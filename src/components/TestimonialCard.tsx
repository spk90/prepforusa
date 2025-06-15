
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  image?: string;
  className?: string;
}

const TestimonialCard = ({ quote, author, role, image, className }: TestimonialCardProps) => {
  return (
    <div className={cn("p-6 rounded-lg border border-border bg-card shadow-sm", className)}>
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-muted overflow-hidden flex-shrink-0 mr-4">
          {image ? (
            <img src={image} alt={author} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
              {author.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h4 className="font-medium">{author}</h4>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
      <blockquote className="text-foreground italic">"{quote}"</blockquote>
    </div>
  );
};

export default TestimonialCard;
