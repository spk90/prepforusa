import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Esewa, Khalti, ConnectIPS } from "@/components/ui/icons";

interface Plan {
  name: string;
  price: string;
  description: string;
  features: string[];
}

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan as Plan | undefined;

  const paymentOptions = [
    {
      id: "esewa",
      name: "eSewa",
      icon: <Esewa className="h-8 w-8" />,
      description: "Pay securely with eSewa",
    },
    {
      id: "khalti",
      name: "Khalti",
      icon: <Khalti className="h-8 w-8" />,
      description: "Pay securely with Khalti",
    },
    {
      id: "connectips",
      name: "ConnectIPS",
      icon: <ConnectIPS className="h-8 w-8" />,
      description: "Pay securely with ConnectIPS",
    },
  ];

  const handlePayment = async (paymentMethod: string) => {
    if (!plan) return;
    // Here you would integrate with the actual payment gateway
    console.log(`Processing payment for ${plan.name} using ${paymentMethod}`);
    // After successful payment, you would:
    // 1. Create a booking in your database
    // 2. Redirect to a confirmation page
    navigate("/payment-success", { state: { plan, paymentMethod } });
  };

  if (!plan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Plan Selected</h1>
          <p className="text-muted-foreground mb-4">
            Please select a plan from the mock interview page.
          </p>
          <Button onClick={() => navigate("/mock-interviews")}>
            Back to Plans
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Booking</h1>
          <p className="text-muted-foreground">
            You're booking the {plan.name} package for {plan.price}
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Package Details</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {plan.features?.map((feature: string) => (
                <li key={feature} className="flex items-center">
                  <span className="text-primary mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Select Payment Method</h2>
          {paymentOptions.map((option) => (
            <Card key={option.id} className="hover:bg-muted/50 cursor-pointer">
              <CardContent className="p-4">
                <div
                  className="flex items-center space-x-4"
                  onClick={() => handlePayment(option.id)}
                >
                  <div className="flex-shrink-0">{option.icon}</div>
                  <div>
                    <h3 className="font-medium">{option.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Payment;
