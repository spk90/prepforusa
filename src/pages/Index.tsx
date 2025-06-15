import {
  Calendar,
  FileCheck,
  MessageCircle,
  Bell,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import FeatureCard from "@/components/FeatureCard";
import TestimonialCard from "@/components/TestimonialCard";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent animate-fade-in">
              Your Complete F1 Visa Journey Companion
            </h1>
            <p
              className="text-xl md:text-2xl mb-8 text-gray-600 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Get prepared, stay informed, and succeed in your visa interview
              with personalized assistance every step of the way.
            </p>
            <div
              className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white group"
              >
                <Link
                  to="/ai-mock-interview"
                  className="flex items-center gap-2"
                >
                  Try AI Mock Interview
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-2">
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
            <div
              className="mt-12 p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              <p className="text-lg mb-6 text-gray-700">
                Experience a realistic visa interview simulation with our
                AI-powered voice assistant that acts as a visa officer.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Real-time Voice Interaction
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Personalized Feedback
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Available 24/7
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              Your F1 Visa Journey Made Simple
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and resources designed to help international
              students navigate the visa process with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              title="F1 Visa Appointment Alerts"
              description="Get real-time notifications when new visa interview slots become available at your preferred embassy or consulate."
              icon={<Calendar className="h-6 w-6" />}
              to="/appointments"
              className="animate-fade-in hover:shadow-lg transition-shadow"
            />
            <FeatureCard
              title="Visa Interview Preparation"
              description="Access comprehensive guides, mock interview practice, and document checklists to prepare for your visa interview."
              icon={<FileCheck className="h-6 w-6" />}
              to="/preparation"
              className="animate-fade-in hover:shadow-lg transition-shadow"
            />
            <FeatureCard
              title="Community Support"
              description="Connect with other students, share experiences, and get advice from those who have successfully obtained their F1 visa."
              icon={<MessageCircle className="h-6 w-6" />}
              to="/community"
              className="animate-fade-in hover:shadow-lg transition-shadow"
            />
            <FeatureCard
              title="Important Updates"
              description="Stay informed about policy changes, embassy announcements, and other crucial information affecting F1 visa applicants."
              icon={<Bell className="h-6 w-6" />}
              to="/updates"
              className="animate-fade-in hover:shadow-lg transition-shadow"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to prepare for your F1 visa interview with confidence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="font-bold text-lg">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Sign Up</h3>
              <p className="text-gray-600">
                Create your account and tell us about your visa application
                needs and preferences.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="font-bold text-lg">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Prepare</h3>
              <p className="text-gray-600">
                Access our comprehensive preparation resources and practice for
                your interview.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="font-bold text-lg">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Succeed</h3>
              <p className="text-gray-600">
                Confidently attend your interview and begin your educational
                journey in the US.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from students who successfully navigated their F1 visa
              journey with our help
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <TestimonialCard
              author="abhi bista"
              quote="I was worried about booking my F1 visa interview date, but NepalF1Slots came through when I needed it the most. A big shoutout to NepalF1Slots for helping me personally and solving a serious issue I was facing. Truly grateful for the support and quick response. Thanks to the entire NepalF1Slots team!"
              role="Student from Nepal"
              className="hover:shadow-lg transition-shadow"
            />
            <TestimonialCard
              quote="The document checklist and preparation materials were incredibly helpful. I felt confident walking into my interview."
              author="Jyasmine"
              role="Student from Nepal"
              className="hover:shadow-lg transition-shadow"
            />
            <TestimonialCard
              quote="The community forum helped me connect with other students from my country who shared their experiences and calmed my nerves."
              author="Prasanna B"
              role="Student from Nepal"
              className="hover:shadow-lg transition-shadow"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your F1 Visa Journey?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have successfully obtained their F1
            visas with our comprehensive preparation resources.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="bg-white text-blue-600 hover:bg-white/90"
            >
              <Link to="/signup">Get Started Now</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white text-white hover:bg-white/10"
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
