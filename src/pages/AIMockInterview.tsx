import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getGrokResponse, Message } from "@/services/grokService";
import { VoiceService, RecognitionState } from "@/services/voiceService";
import { Mic } from "lucide-react";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";

interface I20Details {
  universityName: string;
  programName: string;
  tuition: string;
  livingCost: string;
  scholarship: string;
  totalCOA: string;
}

const MAX_QUESTIONS = 6;
const SILENCE_TIMEOUT = 5000; // 5 seconds

const AIMockInterview = () => {
  // --- User and Firestore State ---
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentName, setPaymentName] = useState("");
  const [paymentNumber, setPaymentNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Interview State ---
  const [recognitionState, setRecognitionState] =
    useState<RecognitionState>("idle");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [i20Details, setI20Details] = useState<I20Details | null>(null);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [finalDecision, setFinalDecision] = useState<string | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [status, setStatus] = useState("Waiting to start...");
  const [showWelcome, setShowWelcome] = useState(true);
  const [recognitionEnded, setRecognitionEnded] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewLogged, setInterviewLogged] = useState(false);

  const voiceService = useRef<VoiceService | null>(null);
  const navigate = useNavigate();
  const answersRef = useRef<string[]>([]);
  const lastTranscriptRef = useRef("");
  const fallbackQuestions = [
    "What are your plans after completing your studies?",
    "How will you fund your education in the US?",
    "Why did you choose this university?",
    "What ties do you have to your home country?",
    "What is your field of study and why did you choose it?",
  ];
  let fallbackIndex = 0;
  const [lastSubmittedAnswer, setLastSubmittedAnswer] = useState("");
  const [lastAIResponse, setLastAIResponse] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  // Setup voice service and system prompt
  useEffect(() => {
    voiceService.current = new VoiceService();
    // Force continuous mode for recognition
    voiceService.current.setContinuousMode(true);
    const savedDetails = localStorage.getItem("i20Details");
    if (savedDetails) {
      setI20Details(JSON.parse(savedDetails));
    } else {
      navigate("/i20-details");
      return;
    }
    const personalizedPrompt = `You are a US visa officer conducting an F1 student visa interview. 
      The applicant is planning to study at ${i20Details?.universityName} in the ${i20Details?.programName} program.
      Their total cost of attendance is $${i20Details?.totalCOA}, with tuition of $${i20Details?.tuition} and living costs of $${i20Details?.livingCost}.
      They have a scholarship of $${i20Details?.scholarship}.
      Your role is to:
      1. First ask if this is their first attempt. If not, ask what changes they have made since their last attempt.
      2. Ask only short, direct questions about their study plans, financial situation, and ties to their home country.
      3. Never use phrases like 'thank you for your response', 'I appreciate', or 'for example'.
      4. Wait for the user to finish speaking before responding.
      5. Do not provide explanations or examples in your questions.
      6. Ask one concise question at a time, and if an answer is unclear, ask a short follow-up question for clarification.`;
    setSystemPrompt(personalizedPrompt);
  }, [navigate]);

  // Fetch user data from Firestore
  useEffect(() => {
    if (!currentUser) return;
    const fetchUser = async () => {
      setLoadingUser(true);
      const userRef = doc(db, "users", currentUser.email);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      } else {
        // Create new user record
        await setDoc(userRef, {
          email: currentUser.email,
          mockAttempts: 0,
          paymentStatus: "free",
          paymentName: "",
          paymentNumber: "",
        });
        setUserData({
          email: currentUser.email,
          mockAttempts: 0,
          paymentStatus: "free",
          paymentName: "",
          paymentNumber: "",
        });
      }
      setLoadingUser(false);
    };
    fetchUser();
  }, [currentUser]);

  // Helper: update user data in Firestore
  const updateUser = async (data: any) => {
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser.email);
    await updateDoc(userRef, data);
    setUserData((prev: any) => ({ ...prev, ...data }));
  };

  // On interview start, check attempts and status
  const canStartInterview =
    userData &&
    (userData.mockAttempts < 5 || userData.paymentStatus === "approved");

  const handleStartInterview = async () => {
    setError(null);
    if (!canStartInterview) {
      setShowPaymentModal(true);
      return;
    }
    if (userData && userData.paymentStatus === "pending") {
      setError(
        "Your payment is pending approval. Please wait for admin approval."
      );
      return;
    }
    setInterviewStarted(true);
    setInterviewLogged(false);
    setShowWelcome(false);
    setQuestionCount(0);
    answersRef.current = [];
    setCurrentAnswer("");
    lastTranscriptRef.current = "";
    // Log interview start
    if (currentUser && userData && !interviewLogged) {
      await addDoc(collection(db, "interview_logs"), {
        email: currentUser.email,
        timestamp: serverTimestamp(),
        attemptNumber: (userData.mockAttempts || 0) + 1,
      });
      setInterviewLogged(true);
    }
    askNextQuestion(
      `Why did you choose to study at ${i20Details?.universityName}?`
    );
  };

  // On payment form submit
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateUser({
        paymentStatus: "pending",
        paymentName,
        paymentNumber,
      });
      setShowPaymentModal(false);
    } catch (err) {
      setError("Failed to submit payment info. Please try again.");
    }
    setIsSubmitting(false);
  };

  // On interview completion, increment attempts
  const handleInterviewComplete = async () => {
    if (userData && userData.paymentStatus !== "approved") {
      await updateUser({ mockAttempts: (userData.mockAttempts || 0) + 1 });
    }
  };

  // Start the interview
  const startInterview = async () => {
    setShowWelcome(false);
    setQuestionCount(0);
    answersRef.current = [];
    setCurrentAnswer("");
    lastTranscriptRef.current = "";
    askNextQuestion(
      `Why did you choose to study at ${i20Details?.universityName}?`
    );
  };

  // Ask a question (AI speaks, then listens until user submits)
  const askNextQuestion = (question: string) => {
    setCurrentQuestion(question);
    setStatus("AI is speaking...");
    setRecognitionState("idle");
    setRecognitionEnded(false);
    // Only clear transcript after new question is asked
    setCurrentAnswer("");
    lastTranscriptRef.current = "";
    voiceService.current?.speak(question, () => {
      setStatus("Listening...");
      setRecognitionState("listening");
      setRecognitionEnded(false);
      voiceService.current?.startListening(
        (text) => {
          // Accumulate only new speech
          if (text.length > lastTranscriptRef.current.length) {
            setCurrentAnswer(text);
            lastTranscriptRef.current = text;
          }
        },
        (state) => {
          setRecognitionState(state);
          if (state === "idle") {
            setRecognitionEnded(true);
          }
        }
      );
    });
  };

  // Stop listening and submit answer (on button click)
  const stopListeningAndSubmit = () => {
    voiceService.current?.stopListening();
    setRecognitionState("idle");
    setRecognitionEnded(false);
    if (currentAnswer.trim()) {
      setStatus("Processing...");
      submitAnswer(currentAnswer.trim());
    }
    // Do NOT clear currentAnswer here; clear after next question is asked
  };

  // Restart listening if recognition ended unexpectedly
  const restartListening = () => {
    setRecognitionEnded(false);
    setRecognitionState("listening");
    voiceService.current?.startListening(
      (text) => {
        if (text.length > lastTranscriptRef.current.length) {
          setCurrentAnswer(text);
          lastTranscriptRef.current = text;
        }
      },
      (state) => {
        setRecognitionState(state);
        if (state === "idle") {
          setRecognitionEnded(true);
        }
      }
    );
  };

  // Submit answer to AI and get next question
  const submitAnswer = async (text: string) => {
    try {
      setLastSubmittedAnswer(text);
      answersRef.current.push(text);
      setQuestionCount((prev) => prev + 1);

      if (questionCount + 1 >= MAX_QUESTIONS) {
        const answers = answersRef.current.join("\n");
        const decisionPrompt = `You are a US visa officer. Based on the applicant's answers below, evaluate their visa application. Consider:
        1. Financial stability and ability to pay for education
        2. Strong ties to home country
        3. Clear study plans and career goals
        4. Consistency in answers
        5. Academic preparation
        
        First, respond with ONLY one of these two sentences:
        - 'Your visa is accepted.' (if they demonstrate strong financial backing, clear goals, and strong ties to home country)
        - 'Your visa application is denied.' (if there are concerns about finances, weak ties, or unclear plans)
        
        Then, provide specific feedback on their performance in these areas:
        1. What were their strongest points?
        2. What areas need improvement?
        3. What specific advice would you give them for their next attempt?
        
        Format your response exactly like this:
        DECISION: [Your decision sentence]
        FEEDBACK: [Your detailed feedback]
        
        Applicant's answers:\n${answers}`;

        const result = await getGrokResponse([
          { role: "system", content: decisionPrompt },
        ]);

        const decisionMatch = result.match(/DECISION: (.*?)(?=FEEDBACK:|$)/s);
        const feedbackMatch = result.match(/FEEDBACK: (.*?)$/s);

        setFinalDecision(
          decisionMatch
            ? decisionMatch[1].trim()
            : "Your visa application is denied."
        );
        setAiFeedback(
          feedbackMatch ? feedbackMatch[1].trim() : "No feedback available."
        );
        setStatus("Interview Complete");
        await handleInterviewComplete();
        return;
      }

      const messages: Message[] = [
        { role: "system", content: systemPrompt },
        ...answersRef.current.map((ans, idx) =>
          idx % 2 === 0
            ? { role: "user" as const, content: ans }
            : { role: "assistant" as const, content: ans }
        ),
        { role: "user" as const, content: text },
      ];

      const aiResponse = await getGrokResponse(messages);
      setLastAIResponse(aiResponse);
      console.log("AI Response:", aiResponse);
      const nextQuestion = aiResponse.split("\n")[0].trim();
      const isQuestion = nextQuestion.endsWith("?") && nextQuestion.length > 10;

      if (!isQuestion || nextQuestion === currentQuestion) {
        setError(
          `AI did not provide a valid new question. Please click 'Retry' to try again.\nAI Response: ${aiResponse}`
        );
        setStatus("AI failed to provide a valid question.");
        setRetryCount((prev) => prev + 1);
        return;
      }
      setRetryCount(0);
      askNextQuestion(nextQuestion);
    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong. Please try again.");
      setStatus("Error occurred");
    }
  };

  const handleRetry = () => {
    if (retryCount >= 1) {
      // Use fallback question
      const fallback =
        fallbackQuestions[fallbackIndex % fallbackQuestions.length];
      fallbackIndex++;
      setError(null);
      setStatus("Using fallback question.");
      askNextQuestion(fallback);
      setRetryCount(0);
    } else {
      setError(null);
      setStatus("Retrying last answer...");
      submitAnswer(lastSubmittedAnswer);
    }
  };

  // --- Review Submit ---
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!currentUser) return;
      await addDoc(collection(db, "ai_voice_reviews"), {
        email: currentUser.email,
        review: reviewText,
        rating: reviewRating,
        timestamp: serverTimestamp(),
        result: finalDecision,
      });
      setReviewSubmitted(true);
    } catch (err) {
      setError("Failed to submit review. Please try again.");
    }
    setIsSubmitting(false);
  };

  // UI: Animated circle
  const renderCircle = () => {
    let circleClass =
      "transition-all duration-300 w-48 h-48 rounded-full mx-auto flex items-center justify-center text-center relative ";

    let gradient =
      "bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500";
    let border = "border-4 ";
    let shadow = "shadow-2xl ";
    let animate = "";

    if (status === "AI is speaking..." || status === "Processing...") {
      border += "border-blue-600 ";
      animate = "animate-pulse ";
    } else if (status === "Listening...") {
      border += "border-green-400 ";
      animate = "animate-glow ";
    } else {
      border += "border-gray-300 ";
    }

    return (
      <div
        className={`${circleClass} ${gradient} ${border} ${shadow} ${animate}`}
        style={{
          boxShadow:
            status === "Listening..."
              ? "0 0 40px #6ee7b7, 0 0 80px #6ee7b7"
              : undefined,
        }}
      >
        {/* Microphone icon */}
        <Mic
          className={`w-16 h-16 mx-auto ${
            status === "Listening..."
              ? "text-green-500 animate-mic"
              : "text-white"
          }`}
        />
        {/* Animated sound bars when listening */}
        {status === "Listening..." && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-1 h-8">
            {[1, 2, 3, 4, 5].map((bar) => (
              <div
                key={bar}
                className={`w-2 rounded bg-green-400 animate-bar${bar}`}
                style={{ height: `${8 + Math.random() * 24}px` }}
              ></div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!i20Details) return null;

  if (loadingUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
        <div className="w-full max-w-2xl p-8 rounded-lg shadow-2xl bg-gray-900/30 border-4 border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Loading Your Interview Session
          </h2>
          <div className="space-y-4">
            <p className="text-gray-300">
              Please wait while we prepare your personalized interview
              experience...
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-400">
                • Loading your profile information
              </p>
              <p className="text-sm text-gray-400">
                • Preparing interview questions
              </p>
              <p className="text-sm text-gray-400">
                • Setting up voice recognition
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show attempts left and status
  const attemptsLeft =
    userData && userData.paymentStatus !== "approved"
      ? 5 - (userData.mockAttempts || 0)
      : "Unlimited";

  if (showWelcome) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
        <div className="w-full max-w-3xl p-8 rounded-lg shadow-2xl bg-gray-900/30 border-4 border-blue-500">
          {renderCircle()}
          <div className="mt-8 space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">
                Welcome to Your AI Visa Interview
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                Practice with our AI visa officer in a realistic interview
                environment. The interview will be fully voice-based - just
                listen and speak naturally!
              </p>
            </div>

            <div className="bg-blue-900/20 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">What to expect:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400">•</span>
                  <span>6 personalized questions based on your profile</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400">•</span>
                  <span>Real-time voice interaction with AI visa officer</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400">•</span>
                  <span>Detailed feedback on your performance</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400">•</span>
                  <span>Tips for improvement after the interview</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Your Interview Credits
                  </h3>
                  <p className="text-gray-300">
                    Free AI Mock Interviews Left:{" "}
                    <span className="font-bold text-white">{attemptsLeft}</span>
                  </p>
                </div>
                {userData?.paymentStatus === "approved" && (
                  <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                    Unlimited Access
                  </span>
                )}
              </div>
            </div>

            <button
              className="w-full mt-6 px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold transition-colors"
              onClick={handleStartInterview}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Starting..." : "Begin Interview"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (finalDecision) {
    const isAccepted = finalDecision.includes("accepted");
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
        <div
          className={`w-full max-w-2xl p-8 rounded-lg shadow-2xl ${
            isAccepted
              ? "bg-green-900/30 border-4 border-green-500"
              : "bg-yellow-900/30 border-4 border-yellow-500"
          }`}
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4">
              {isAccepted ? "VISA APPROVED" : "VISA DECISION"}
            </h2>
            <div className="text-2xl font-mono mb-6">{finalDecision}</div>
          </div>

          <div className="space-y-4 text-lg">
            <div className="flex justify-between border-b border-gray-600 pb-2">
              <span>University:</span>
              <span className="font-semibold">
                {i20Details?.universityName}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-600 pb-2">
              <span>Program:</span>
              <span className="font-semibold">{i20Details?.programName}</span>
            </div>
            <div className="flex justify-between border-b border-gray-600 pb-2">
              <span>Total Cost:</span>
              <span className="font-semibold">${i20Details?.totalCOA}</span>
            </div>
            <div className="flex justify-between border-b border-gray-600 pb-2">
              <span>Scholarship:</span>
              <span className="font-semibold">${i20Details?.scholarship}</span>
            </div>
          </div>

          {/* AI Feedback Section */}
          <div className="mt-8 p-6 bg-black/30 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Interview Feedback
            </h3>
            <div className="prose prose-invert max-w-none">
              {aiFeedback?.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-200">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {!isAccepted && (
            <div className="mt-8 p-4 bg-yellow-900/20 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">
                Common Reasons for Denial:
              </h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Insufficient financial documentation</li>
                <li>Weak ties to home country</li>
                <li>Unclear study plans</li>
                <li>Inconsistent answers</li>
              </ul>
            </div>
          )}
        </div>

        <button
          className="mt-8 px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold"
          onClick={() => navigate("/mock-interviews")}
        >
          Back to Mock Interviews
        </button>

        {/* Review Form */}
        {!reviewSubmitted ? (
          <form
            onSubmit={handleReviewSubmit}
            className="mt-8 bg-white/10 p-6 rounded-lg w-full max-w-md"
          >
            <h3 className="text-lg font-semibold mb-2 text-white">
              How was your AI voice interview experience?
            </h3>
            <textarea
              className="w-full rounded p-2 mb-3 text-black"
              rows={3}
              placeholder="Your feedback..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <div className="flex items-center mb-3">
              <span className="mr-2 text-white">Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className={
                    star <= reviewRating
                      ? "text-yellow-400 text-2xl"
                      : "text-gray-400 text-2xl"
                  }
                  onClick={() => setReviewRating(star)}
                  disabled={isSubmitting}
                >
                  ★
                </button>
              ))}
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        ) : (
          <div className="mt-8 text-green-400 font-semibold text-lg">
            Thank you for your feedback!
          </div>
        )}
      </div>
    );
  }

  // Payment modal UI
  const PaymentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full text-black">
        <h2 className="text-2xl font-bold mb-4">
          Upgrade for Unlimited Interviews
        </h2>
        <p className="mb-4">
          You have used your 5 free AI mock interviews. To continue, please pay
          via eSewa and submit your details for approval.
        </p>
        {/* TODO: Insert your eSewa QR code image here */}
        <div className="mb-4 flex justify-center">
          <img src="/esewa-qr.png" alt="eSewa QR" className="w-40 h-40" />
        </div>
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={paymentName}
            onChange={(e) => setPaymentName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
            disabled={isSubmitting}
          />
          <input
            type="text"
            placeholder="eSewa Number"
            value={paymentNumber}
            onChange={(e) => setPaymentNumber(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit for Approval"}
          </button>
        </form>
        <button
          onClick={() => setShowPaymentModal(false)}
          className="mt-4 w-full text-center text-blue-600"
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  // Show pending/approved status
  if (userData && userData.paymentStatus === "pending") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
        <div className="w-full max-w-2xl p-8 rounded-lg shadow-2xl bg-gray-900/30 border-4 border-yellow-500">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Payment Under Review
          </h2>
          <div className="space-y-6">
            <div className="bg-yellow-900/20 p-4 rounded-lg">
              <p className="text-lg mb-2">
                Thank you for your payment submission!
              </p>
              <p className="text-gray-300">
                Your payment is currently being reviewed by our team. This
                process typically takes 24-48 hours.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">What happens next?</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">•</span>
                  <span>We'll verify your payment details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">•</span>
                  <span>
                    You'll receive an email confirmation once approved
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">•</span>
                  <span>You can then access unlimited mock interviews</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Need help?</h3>
              <p className="text-gray-300">
                If you have any questions about your payment status, please
                contact our support team.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      {renderCircle()}
      <div className="mt-8 mb-4 text-center">
        <div className="text-lg font-semibold mb-2">{currentQuestion}</div>
        {(recognitionState === "listening" || currentAnswer) && (
          <div className="text-green-300 text-xl font-mono min-h-[2rem]">
            {currentAnswer || <span className="opacity-60">Listening...</span>}
          </div>
        )}
      </div>
      <div className="text-center text-gray-300 mb-2 min-h-[1.5rem]">
        {status}
      </div>
      {recognitionState === "listening" && (
        <button
          className="mt-4 px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold"
          onClick={stopListeningAndSubmit}
          disabled={isSubmitting}
        >
          Submit
        </button>
      )}
      {recognitionEnded && recognitionState !== "listening" && (
        <button
          className="mt-4 px-8 py-3 rounded-full bg-yellow-600 hover:bg-yellow-700 text-white text-lg font-semibold"
          onClick={restartListening}
          disabled={isSubmitting}
        >
          Restart Listening
        </button>
      )}
      {error && (
        <div className="text-red-400 text-center mt-2">
          {error.split("\n").map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
          <button
            className="mt-4 px-6 py-2 rounded-full bg-yellow-600 hover:bg-yellow-700 text-white"
            onClick={handleRetry}
          >
            Retry
          </button>
        </div>
      )}
      {showPaymentModal && <PaymentModal />}
    </div>
  );
};

export default AIMockInterview;

// CSS for animate-glow (add to your global CSS):
// .animate-glow { box-shadow: 0 0 40px #6ee7b7, 0 0 80px #6ee7b7; animation: glow 1.5s infinite alternate; }
// @keyframes glow { from { box-shadow: 0 0 20px #6ee7b7; } to { box-shadow: 0 0 60px #6ee7b7; } }
