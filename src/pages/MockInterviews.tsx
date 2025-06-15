import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Mic, MessageSquare } from "lucide-react";

const MockInterviews = () => {
  const navigate = useNavigate();

  const pricingPlans = [
    {
      name: "Basic Session",
      price: "NPR 1500",
      description: "30-minute interview practice",
      features: [
        "One-on-one session",
        "Basic feedback",
        "Common questions",
        "Email support",
      ],
    },
    {
      name: "Premium Session",
      price: "NPR 2500",
      description: "Full interview preparation",
      features: [
        "One-on-one session",
        "Detailed feedback",
        "Customized questions",
        "Priority support",
        "Follow-up session",
      ],
      popular: true,
    },
    {
      name: "Ultimate Package",
      price: "NPR 4500",
      description: "Multiple sessions with expert",
      features: [
        "Three sessions",
        "Comprehensive feedback",
        "Personalized strategy",
        "24/7 support",
        "Document review",
        "Mock visa interview",
      ],
    },
  ];

  const handleBookNow = (plan: any) => {
    navigate("/payment", { state: { plan } });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Mock Interview Sessions</h1>
          <p className="text-muted-foreground">
            Practice your visa interview with our experienced coaches and get
            personalized feedback
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`p-6 ${
                plan.popular ? "border-primary shadow-lg" : ""
              }`}
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p className="text-2xl font-bold mt-2">{plan.price}</p>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <svg
                        className="h-5 w-5 text-primary mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" onClick={() => handleBookNow(plan)}>
                  Book Now
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mic className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">AI Mock Interview</h3>
                <p className="text-muted-foreground">
                  Practice with our AI visa officer
                </p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              Get instant feedback and practice anytime with our AI-powered mock
              interview system.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/ai-mock-interview")}
            >
              Try AI Mock Interview
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Expert Feedback</h3>
                <p className="text-muted-foreground">
                  Get detailed analysis of your performance
                </p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              Our experienced coaches will provide comprehensive feedback on
              your answers, body language, and overall presentation.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                navigate("/payment", { state: { plan: "Expert Session" } })
              }
            >
              Book Expert Session
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MockInterviews;
