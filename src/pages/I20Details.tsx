import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface I20Details {
  universityName: string;
  programName: string;
  tuition: string;
  livingCost: string;
  scholarship: string;
  totalCOA: string;
}

const I20Details = () => {
  const navigate = useNavigate();
  const [currentWindow, setCurrentWindow] = useState(0);
  const [details, setDetails] = useState<I20Details>({
    universityName: "",
    programName: "",
    tuition: "",
    livingCost: "",
    scholarship: "",
    totalCOA: "",
  });
  const [isAnimating, setIsAnimating] = useState(false);

  const windows = [
    {
      title: "University Information",
      fields: [
        {
          name: "universityName",
          label: "University Name",
          type: "text",
          required: true,
        },
        {
          name: "programName",
          label: "Program Name",
          type: "text",
          required: true,
        },
      ],
    },
    {
      title: "Financial Details",
      fields: [
        {
          name: "tuition",
          label: "Tuition Fee",
          type: "number",
          required: true,
        },
        {
          name: "livingCost",
          label: "Living Cost",
          type: "number",
          required: true,
        },
      ],
    },
    {
      title: "Scholarship & COA",
      fields: [
        {
          name: "scholarship",
          label: "Scholarship Amount",
          type: "number",
          required: true,
        },
        {
          name: "totalCOA",
          label: "Total Cost of Attendance",
          type: "number",
          required: true,
        },
      ],
    },
  ];

  const validateCurrentWindow = () => {
    const currentFields = windows[currentWindow].fields;
    for (const field of currentFields) {
      if (field.required && !details[field.name as keyof I20Details]) {
        toast.error(`Please fill in ${field.label}`);
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentWindow()) {
      return;
    }

    setIsAnimating(true);
    setTimeout(() => {
      if (currentWindow < windows.length - 1) {
        setCurrentWindow(currentWindow + 1);
      } else {
        // Save details to localStorage and navigate to mock interview
        localStorage.setItem("i20Details", JSON.stringify(details));
        navigate("/ai-mock-interview");
      }
      setIsAnimating(false);
    }, 500);
  };

  const handlePrevious = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (currentWindow > 0) {
        setCurrentWindow(currentWindow - 1);
      }
      setIsAnimating(false);
    }, 500);
  };

  const handleChange = (field: keyof I20Details, value: string) => {
    setDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">I-20 Details</h1>
          <p className="text-muted-foreground">
            Please provide your I-20 information to help us prepare relevant
            interview questions
          </p>
        </div>

        <div className="relative h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentWindow}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="absolute w-full"
            >
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">
                  {windows[currentWindow].title}
                </h2>
                <div className="space-y-4">
                  {windows[currentWindow].fields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <Label htmlFor={field.name}>
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </Label>
                      <Input
                        id={field.name}
                        type={field.type}
                        value={details[field.name as keyof I20Details]}
                        onChange={(e) =>
                          handleChange(
                            field.name as keyof I20Details,
                            e.target.value
                          )
                        }
                        className="w-full"
                        required={field.required}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentWindow === 0}
          >
            Previous
          </Button>
          <Button onClick={handleNext}>
            {currentWindow === windows.length - 1 ? "Start Interview" : "Next"}
          </Button>
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          {windows.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentWindow ? "bg-primary" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default I20Details;
