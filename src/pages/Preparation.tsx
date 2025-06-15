import { FileCheck, CheckCircle, Check, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

const Preparation = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">F1 Visa Preparation</h1>
      <p className="text-muted-foreground mb-8">
        Complete guide to prepare for your F1 visa interview
      </p>

      <Tabs defaultValue="guide">
        <TabsList className="mb-8">
          <TabsTrigger value="guide">Interview Guide</TabsTrigger>
          <TabsTrigger value="questions">Sample Questions</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="mock">Mock Interviews</TabsTrigger>
        </TabsList>

        <TabsContent value="guide">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>F1 Visa Interview Guide</CardTitle>
                  <CardDescription>
                    Essential tips and strategies for a successful interview
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="prose dark:prose-invert max-w-none">
                    <h3>Before Your Interview</h3>
                    <p>
                      Preparing for your F1 visa interview is crucial. The
                      consular officer will make a decision based on your
                      paperwork and the impression you make during this brief
                      meeting.
                    </p>

                    <h4>Key Things to Remember</h4>
                    <ul>
                      <li>
                        <strong>Be concise</strong> - Most interviews last only
                        1-2 minutes. Practice giving clear, direct answers.
                      </li>
                      <li>
                        <strong>Show ties to your home country</strong> - The
                        officer wants to know you plan to return after your
                        studies.
                      </li>
                      <li>
                        <strong>Demonstrate financial capability</strong> - Be
                        prepared to explain how you'll cover tuition and living
                        expenses.
                      </li>
                      <li>
                        <strong>Know your program</strong> - Be able to explain
                        why you chose your specific school and program, and how
                        it relates to your career goals.
                      </li>
                    </ul>

                    <h3>During Your Interview</h3>
                    <p>
                      On the day of your interview, first impressions matter:
                    </p>

                    <ul>
                      <li>
                        <strong>Dress professionally</strong> - Business casual
                        attire is appropriate.
                      </li>
                      <li>
                        <strong>Arrive early</strong> - Plan to arrive at least
                        30 minutes before your appointment time.
                      </li>
                      <li>
                        <strong>Speak in English</strong> - The interview will
                        be conducted in English, so practice beforehand.
                      </li>
                      <li>
                        <strong>Be confident but respectful</strong> - Make eye
                        contact, speak clearly, and answer honestly.
                      </li>
                      <li>
                        <strong>Organize your documents</strong> - Have all your
                        paperwork easily accessible and in order.
                      </li>
                    </ul>

                    <h3>Common Mistakes to Avoid</h3>
                    <ul>
                      <li>Memorizing scripted answers</li>
                      <li>Providing too much information or rambling</li>
                      <li>
                        Being vague about your study plans or career goals
                      </li>
                      <li>Not having clear financial documentation</li>
                      <li>
                        Inconsistencies between your application and your
                        interview responses
                      </li>
                    </ul>
                  </div>

                  <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
                    <h4 className="font-medium text-lg mb-3">
                      Ready to test your preparation?
                    </h4>
                    <p className="mb-4 text-muted-foreground">
                      Practice with our mock interview sessions to gain
                      confidence and receive personalized feedback.
                    </p>
                    <Button asChild>
                      <Link to="/mock-interviews">
                        Schedule a Mock Interview
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Your Preparation Progress</CardTitle>
                  <CardDescription>
                    Track your readiness for the interview
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">Overall Progress</p>
                      <p className="text-sm font-medium">78%</p>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mr-3">
                        <Check className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Documentation</p>
                        <p className="text-sm text-muted-foreground">
                          8/10 items complete
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mr-3">
                        <FileCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Sample Questions</p>
                        <p className="text-sm text-muted-foreground">
                          15/25 reviewed
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mr-3">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Mock Interviews</p>
                        <p className="text-sm text-muted-foreground">
                          2/5 completed
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="font-medium mb-3">Suggested Next Steps</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>Complete your financial documents</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>Practice the remaining sample questions</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>Schedule your next mock interview</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="questions">
          <Card>
            <CardHeader>
              <CardTitle>Sample Interview Questions</CardTitle>
              <CardDescription>
                Common questions asked during F1 visa interviews with suggested
                answers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-8">
                <div className="p-6 border border-border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">
                    Why did you choose this university?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    The officer wants to know that you've researched your
                    options and have specific reasons for choosing this
                    institution.
                  </p>
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Sample Answer:</h4>
                    <p className="text-sm">
                      "I chose [University Name] because of its strong program
                      in [Your Field], which is ranked among the top in the US.
                      The faculty includes professors like [Name] whose research
                      in [Specific Area] aligns with my academic interests.
                      Additionally, the university offers specialized courses in
                      [Specific Courses] that will give me the skills I need for
                      my career goals in [Industry/Field]."
                    </p>
                  </div>
                </div>

                <div className="p-6 border border-border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">
                    How will you finance your education?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    The officer needs to be sure you have sufficient funds to
                    cover your education and living expenses without working
                    illegally.
                  </p>
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Sample Answer:</h4>
                    <p className="text-sm">
                      "My education will be financed through a combination of
                      family support and a scholarship. My parents have saved
                      [Amount] for my education, which covers the first year's
                      tuition and living expenses as shown in these bank
                      statements. Additionally, I've received a merit
                      scholarship of [Amount] per year from the university. I've
                      also included a financial plan for all four years of my
                      education."
                    </p>
                  </div>
                </div>

                <div className="p-6 border border-border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">
                    What are your plans after graduating?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    The officer wants to ensure you plan to return to your home
                    country after completing your studies.
                  </p>
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Sample Answer:</h4>
                    <p className="text-sm">
                      "After completing my degree, I plan to return to [Home
                      Country] to work in the growing [Industry] sector. With my
                      US education, I'll be well-positioned for roles at
                      companies like [Names of Companies in Home Country]. In
                      fact, [Company Name] has a management trainee program that
                      specifically seeks graduates with international education
                      in my field. My family's business/property/ties in [Home
                      Country] are also important to me, and I intend to
                      contribute to my country's development in [Specific Way]."
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center pt-4">
                <p className="mb-4 text-muted-foreground">
                  Want to practice answering these questions with real feedback?
                </p>
                <Button asChild>
                  <Link to="/mock-interviews">Book a Mock Interview</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Document Checklist</CardTitle>
              <CardDescription>
                Essential documents required for your F1 visa interview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  Having all your documents properly prepared and organized is
                  crucial for your visa interview success. Use this checklist to
                  ensure you have everything you need.
                </p>

                <div className="space-y-4">
                  <h3 className="font-medium">Required Documents:</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-border rounded-lg flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Valid Passport</h4>
                        <p className="text-sm text-muted-foreground">
                          Must be valid for at least six months beyond your
                          intended period of stay in the US
                        </p>
                      </div>
                    </div>

                    <div className="p-4 border border-border rounded-lg flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium">
                          Form DS-160 Confirmation
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Printed confirmation page of the DS-160 Online
                          Nonimmigrant Visa Application
                        </p>
                      </div>
                    </div>

                    <div className="p-4 border border-border rounded-lg flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Form I-20</h4>
                        <p className="text-sm text-muted-foreground">
                          Certificate of Eligibility for Nonimmigrant Student
                          Status, signed by you and your school official
                        </p>
                      </div>
                    </div>

                    <div className="p-4 border border-border rounded-lg flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium">SEVIS Fee Receipt</h4>
                        <p className="text-sm text-muted-foreground">
                          Proof of payment of the I-901 SEVIS Fee
                        </p>
                      </div>
                    </div>

                    <div className="p-4 border border-border rounded-lg flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium">
                          Visa Application Fee Receipt
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Proof of payment of the MRV fee
                        </p>
                      </div>
                    </div>

                    <div className="p-4 border border-border rounded-lg flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Passport-sized Photo</h4>
                        <p className="text-sm text-muted-foreground">
                          In case the uploaded photo during DS-160 submission is
                          inadequate
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-medium mt-8">Supporting Documents:</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-border rounded-lg flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Academic Records</h4>
                        <p className="text-sm text-muted-foreground">
                          Transcripts, diplomas, certificates, and standardized
                          test scores (TOEFL, GRE, GMAT)
                        </p>
                      </div>
                    </div>

                    <div className="p-4 border border-border rounded-lg flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium">
                          University Acceptance Materials
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Admission letter and any communications from your
                          university
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/5 p-6 rounded-lg border border-primary/20 mt-8">
                    <h4 className="font-medium mb-3">
                      Document Preparation Tips
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>
                          Organize documents in a professional folder with clear
                          labels
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>
                          Bring both original documents and photocopies
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>
                          Have English translations for any documents not in
                          English
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>
                          Don't provide excessive documents that weren't
                          requested
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>
                          Know where each document is so you can access it
                          quickly during the interview
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="text-center pt-4">
                    <Button asChild>
                      <Link to="/documents/checklist">
                        Download Full Checklist
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mock">
          <Card>
            <CardHeader>
              <CardTitle>Mock Interview Sessions</CardTitle>
              <CardDescription>
                Practice your interview skills with experienced coaches
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  The mock interview is one of the most effective ways to
                  prepare for your F1 visa interview. Our experienced coaches
                  will simulate the actual interview experience and provide
                  personalized feedback.
                </p>

                <h3 className="font-medium text-lg">
                  Our Mock Interview Options
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle> Session</CardTitle>
                      <CardDescription>
                        30-minute interview practice
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                          <span>5 mock interviews</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                          <span>feedback session</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                          <span>Basic document review</span>
                        </li>
                      </ul>
                      <div className="pt-4">
                        <p className="text-2xl font-bold">NPR 1500</p>
                        <p className="text-sm text-muted-foreground">
                          One-time session
                        </p>
                      </div>
                      <Button className="w-full">Book Basic Session</Button>
                    </CardContent>
                  </Card>

                  <Card className="border-primary">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>Premium Session</CardTitle>
                          <CardDescription>
                            Full interview preparation
                          </CardDescription>
                        </div>
                        <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                          Popular
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                          <span>10 mock interview</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                          <span> Detailed feedback</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                          <span>Comprehensive document review</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                          <span>Personalized improvement plan</span>
                        </li>
                      </ul>
                      <div className="pt-4">
                        <p className="text-2xl font-bold">NPR 2500</p>
                        <p className="text-sm text-muted-foreground">
                          One-time session
                        </p>
                      </div>
                      <Button className="w-full">Book Premium Session</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Ultimate Package</CardTitle>
                      <CardDescription>
                        Multiple sessions with expert
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                          <span>20 full mock interviews</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                          <span>Detailed feedback after each session</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                          <span>Expert document preparation</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                          <span>Interview strategy counseling</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                          <span>Email support until your interview</span>
                        </li>
                      </ul>
                      <div className="pt-4">
                        <p className="text-2xl font-bold">NPR 5000</p>
                        <p className="text-sm text-muted-foreground">
                          Complete package
                        </p>
                      </div>
                      <Button className="w-full">Book Ultimate Package</Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-primary/5 p-6 rounded-lg border border-primary/20 mt-8">
                  <h4 className="font-medium mb-3">
                    What to Expect in Your Mock Interview
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>
                        Realistic simulation of the actual interview environment
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>
                        Common and challenging questions tailored to your
                        specific situation
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>Document presentation practice</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>
                        Feedback on your communication style, answers, and
                        overall impression
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>
                        Tips for improvement specific to your performance
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="text-center pt-4">
                  <p className="mb-4 text-sm text-muted-foreground">
                    All sessions are conducted via Zoom with former visa
                    officers or experienced coaches.
                  </p>
                  <Button asChild className="mx-auto">
                    <Link to="/mock-interviews/book">
                      View Available Interview Slots
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Preparation;
