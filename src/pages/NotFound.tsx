import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <h1 className="text-7xl font-bold text-primary mb-2">404</h1>
      <p className="text-2xl font-semibold mb-4">Page Not Found</p>
      <p className="text-muted-foreground text-center mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link to="/">Return to SlotsNepal</Link>
      </Button>
    </div>
  );
};

export default NotFound;
