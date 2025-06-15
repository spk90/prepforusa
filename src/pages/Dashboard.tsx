import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, Calendar, FileCheck, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="mb-6 text-center">
          Please sign in to access your dashboard.
        </p>
        <Button asChild>
          <Link to="/signin">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground mt-1">{currentUser.email}</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild>
            <Link to="/appointments/track">Track New Appointments</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Visa Journey</CardTitle>
              <CardDescription>
                Track your progress towards your F1 visa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="mr-4 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Documentation</h4>
                    <div className="mt-1 h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-primary rounded-full"
                        style={{ width: "80%" }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      8/10 documents prepared
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Appointment</h4>
                    <div className="mt-1 h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-primary rounded-full"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Interview scheduled for May 15, 2023
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Interview Preparation</h4>
                    <div className="mt-1 h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-primary rounded-full"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      2/5 mock interviews completed
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>
                Updates about your visa application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <div className="mr-3 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Bell className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    New interview slot available
                  </p>
                  <p className="text-xs text-muted-foreground">
                    April 20, 2023 at US Embassy, Mexico City
                  </p>
                  <p className="text-xs text-muted-foreground">10 mins ago</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-3 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Bell className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Document checklist updated
                  </p>
                  <p className="text-xs text-muted-foreground">
                    New requirements for financial documentation
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-3 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Bell className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    New forum post in your thread
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Response to your question about I-20 form
                  </p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-2" asChild>
                <Link to="/notifications">View All Notifications</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
