import { useState, useEffect } from "react";
import { Calendar, Bell, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const Appointments = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    visaType: "",
    desiredMonth: "",
    country: "",
    embassy: "",
    dateFrom: "",
    dateTo: "",
    emailNotifications: false,
    smsNotifications: false,
    pushNotifications: false,
  });
  const [userPreferences, setUserPreferences] = useState<any[]>([]);

  // Fetch user preferences
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "appointments"),
      where("userId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const preferences = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserPreferences(preferences);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendEmailNotification = async (formData: any) => {
    try {
      console.log("Sending email notification...");
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: ["sujalkhanal25@gmail.com", "smritibhusal672@gmail.com"],
          subject: "New F1 Visa Appointment Tracking Request",
          text: `
            New Appointment Tracking Request:
            Name: ${formData.name}
            Phone: ${formData.phoneNumber}
            Visa Type: ${formData.visaType}
            Desired Month: ${formData.desiredMonth}
            Country: ${formData.country}
            Embassy: ${formData.embassy}
            Date Range: ${formData.dateFrom} to ${formData.dateTo}
            Email Notifications: ${formData.emailNotifications ? "Yes" : "No"}
            SMS Notifications: ${formData.smsNotifications ? "Yes" : "No"}
            Push Notifications: ${formData.pushNotifications ? "Yes" : "No"}
          `,
        }),
      });

      const result = await response.json();
      console.log("Email sending response:", result);

      if (!response.ok) {
        throw new Error(result.error || "Failed to send email");
      }

      toast.success("Email notification sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email notification");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Please sign in to track appointments");
      return;
    }

    try {
      // Store in Firebase
      const appointmentsRef = collection(db, "appointments");
      const docRef = await addDoc(appointmentsRef, {
        ...formData,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        status: "active",
        lastChecked: serverTimestamp(),
      });

      // Send email notification
      await sendEmailNotification(formData);

      toast.success("Appointment tracking preferences saved successfully!");

      // Reset form
      setFormData({
        name: "",
        phoneNumber: "",
        visaType: "",
        desiredMonth: "",
        country: "",
        embassy: "",
        dateFrom: "",
        dateTo: "",
        emailNotifications: false,
        smsNotifications: false,
        pushNotifications: false,
      });
    } catch (error) {
      console.error("Error saving appointment preferences:", error);
      toast.error("Failed to save appointment preferences");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-4">
            F1 Visa Appointments
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track and receive instant alerts for new interview slots at your
            preferred embassy. Never miss an opportunity to secure your study
            abroad journey.
          </p>
        </div>

        <Tabs defaultValue="track" className="max-w-6xl mx-auto">
          <TabsList className="mb-8 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="track" className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Track Appointments
            </TabsTrigger>
            <TabsTrigger value="guide" className="flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              Booking Guide
            </TabsTrigger>
          </TabsList>

          <TabsContent value="track">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      Track New Appointment Slots
                    </CardTitle>
                    <CardDescription className="text-base">
                      Select your preferred embassy locations and receive
                      instant alerts when new slots become available
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name" className="text-sm font-medium">
                            Full Name
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            className="mt-1.5 bg-white/50"
                            required
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor="phoneNumber"
                            className="text-sm font-medium"
                          >
                            Phone Number
                          </Label>
                          <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="Enter your phone number"
                            className="mt-1.5 bg-white/50"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label
                            htmlFor="visaType"
                            className="text-sm font-medium"
                          >
                            Visa Type
                          </Label>
                          <Select
                            value={formData.visaType}
                            onValueChange={(value) =>
                              handleSelectChange("visaType", value)
                            }
                          >
                            <SelectTrigger className="mt-1.5 bg-white/50">
                              <SelectValue placeholder="Select visa type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="F1">
                                F1/F2 Student Visa
                              </SelectItem>
                              <SelectItem value="J1">
                                B1/B2 Business Visa
                              </SelectItem>
                              <SelectItem value="M1">
                                M1 Vocational Student
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label
                            htmlFor="desiredMonth"
                            className="text-sm font-medium"
                          >
                            Desired Month
                          </Label>
                          <Select
                            value={formData.desiredMonth}
                            onValueChange={(value) =>
                              handleSelectChange("desiredMonth", value)
                            }
                          >
                            <SelectTrigger className="mt-1.5 bg-white/50">
                              <SelectValue placeholder="Select desired month" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="january">January</SelectItem>
                              <SelectItem value="february">February</SelectItem>
                              <SelectItem value="march">March</SelectItem>
                              <SelectItem value="april">April</SelectItem>
                              <SelectItem value="may">May</SelectItem>
                              <SelectItem value="june">June</SelectItem>
                              <SelectItem value="july">July</SelectItem>
                              <SelectItem value="august">August</SelectItem>
                              <SelectItem value="september">
                                September
                              </SelectItem>
                              <SelectItem value="october">October</SelectItem>
                              <SelectItem value="november">November</SelectItem>
                              <SelectItem value="december">December</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="embassy"
                          className="text-sm font-medium"
                        >
                          Embassy/Consulate
                        </Label>
                        <Input
                          id="embassy"
                          name="embassy"
                          value={formData.embassy}
                          onChange={handleInputChange}
                          placeholder="Select embassy or consulate"
                          className="mt-1.5 bg-white/50"
                          required
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">
                          Preferred Date Range
                        </Label>
                        <div className="grid grid-cols-2 gap-4 mt-1.5">
                          <Input
                            id="date-from"
                            name="dateFrom"
                            value={formData.dateFrom}
                            onChange={handleInputChange}
                            type="date"
                            className="bg-white/50"
                            required
                          />
                          <Input
                            id="date-to"
                            name="dateTo"
                            value={formData.dateTo}
                            onChange={handleInputChange}
                            type="date"
                            className="bg-white/50"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-sm font-medium">
                          Notification Preferences
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="email-notifications"
                              checked={formData.emailNotifications}
                              onCheckedChange={(checked) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  emailNotifications: checked,
                                }))
                              }
                            />
                            <Label htmlFor="email-notifications">Email</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="sms-notifications"
                              checked={formData.smsNotifications}
                              onCheckedChange={(checked) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  smsNotifications: checked,
                                }))
                              }
                            />
                            <Label htmlFor="sms-notifications">SMS</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="push-notifications"
                              checked={formData.pushNotifications}
                              onCheckedChange={(checked) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  pushNotifications: checked,
                                }))
                              }
                            />
                            <Label htmlFor="push-notifications">Push</Label>
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                      >
                        Save Preferences & Start Tracking
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">
                      Your Tracking Preferences
                    </CardTitle>
                    <CardDescription>
                      Currently active appointment trackers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userPreferences.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">
                          No active trackers. Add one to get started.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userPreferences.map((pref) => (
                          <div
                            key={pref.id}
                            className="p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-gray-900">
                                  {pref.embassy}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {pref.visaType} - {pref.desiredMonth}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  pref.status === "active"
                                    ? "default"
                                    : "secondary"
                                }
                                className="bg-gradient-to-r from-blue-600 to-indigo-700"
                              >
                                {pref.status}
                              </Badge>
                            </div>
                            <div className="mt-3 text-sm">
                              <p className="text-gray-600">
                                Date Range: {pref.dateFrom} to {pref.dateTo}
                              </p>
                              <div className="flex gap-2 mt-2">
                                {pref.emailNotifications && (
                                  <Badge
                                    variant="outline"
                                    className="bg-blue-50"
                                  >
                                    Email
                                  </Badge>
                                )}
                                {pref.smsNotifications && (
                                  <Badge
                                    variant="outline"
                                    className="bg-green-50"
                                  >
                                    SMS
                                  </Badge>
                                )}
                                {pref.pushNotifications && (
                                  <Badge
                                    variant="outline"
                                    className="bg-purple-50"
                                  >
                                    Push
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="guide">
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">
                  F1 Visa Appointment Booking Guide
                </CardTitle>
                <CardDescription className="text-base">
                  A step-by-step guide to booking your visa interview
                  appointment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-6">
                  <div className="flex">
                    <div className="mr-4 h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white flex-shrink-0">
                      <span className="font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Pay the SEVIS Fee</h3>
                      <p className="text-muted-foreground mt-1">
                        Before scheduling your visa appointment, you need to pay
                        the SEVIS fee (I-901 fee) online at www.fmjfee.com.
                        You'll need your I-20 form to complete this payment.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="mr-4 h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white flex-shrink-0">
                      <span className="font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Complete the DS-160 Form</h3>
                      <p className="text-muted-foreground mt-1">
                        Fill out the DS-160 (Online Nonimmigrant Visa
                        Application) form at ceac.state.gov/genniv. Save the
                        confirmation page with barcode – you'll need this for
                        your interview.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="mr-4 h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white flex-shrink-0">
                      <span className="font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium">
                        Register on the US Embassy Website
                      </h3>
                      <p className="text-muted-foreground mt-1">
                        Create an account on the local US Embassy or Consulate
                        website where you'll be interviewed. Usually, this will
                        be at ustraveldocs.com for your specific country.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="mr-4 h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white flex-shrink-0">
                      <span className="font-bold">4</span>
                    </div>
                    <div>
                      <h3 className="font-medium">
                        Pay the Visa Application Fee
                      </h3>
                      <p className="text-muted-foreground mt-1">
                        Pay the non-refundable visa application fee (MRV fee) of
                        $160 USD. Instructions for payment will be provided on
                        the embassy website.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="mr-4 h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white flex-shrink-0">
                      <span className="font-bold">5</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Schedule Your Interview</h3>
                      <p className="text-muted-foreground mt-1">
                        After payment confirmation, you can schedule your
                        interview on the embassy website. Choose the earliest
                        available date that works for you.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Appointments;
