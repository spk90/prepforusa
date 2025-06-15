
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  className?: string;
}

const FeatureCard = ({ title, description, icon, to, className }: FeatureCardProps) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "block p-6 rounded-lg border border-border bg-card shadow-sm hover:shadow-md transition-all card-hover",
        className
      )}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Link>
  );
};

export default FeatureCard;
