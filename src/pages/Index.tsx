import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Shield,
  Target,
  GraduationCap,
  BarChart3,
  Mail,
  Users,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Lock
} from "lucide-react";
import logo from "@/assets/logo.png";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Mail,
      title: "Phishing Simulations",
      description: "Create realistic phishing campaigns to test employee awareness",
      color: "text-primary"
    },
    {
      icon: GraduationCap,
      title: "Interactive Training",
      description: "Comprehensive security awareness training modules",
      color: "text-success"
    },
    {
      icon: BarChart3,
      title: "Detailed Analytics",
      description: "Track progress and measure training effectiveness",
      color: "text-warning"
    },
    {
      icon: Users,
      title: "Employee Management",
      description: "Manage employee directories and training records",
      color: "text-primary"
    }
  ];

  const stats = [
    { label: "Organizations Protected", value: "500+", icon: Shield },
    { label: "Phishing Attempts Blocked", value: "50K+", icon: Target },
    { label: "Employees Trained", value: "100K+", icon: GraduationCap },
    { label: "Success Rate", value: "95%", icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="SecureGuard" className="h-10 w-auto" />
              <div>
                <h1 className="text-xl font-bold">SecureGuard</h1>
                <p className="text-sm text-muted-foreground">Phishing Awareness Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button onClick={() => navigate("/admin")}>
                Admin Login
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <Badge variant="outline" className="px-4 py-2">
              <Lock className="mr-2 h-4 w-4" />
              Enterprise Security Solution
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Protect Your Organization from{" "}
              <span className="text-primary">Phishing Attacks</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive phishing awareness training and simulation platform 
              that empowers your employees to identify and prevent cyber threats.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/admin")} className="shadow-corporate">
                Get Started
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/training")}>
                View Training Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <stat.icon className="h-8 w-8 text-primary mx-auto" />
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Complete Phishing Protection Suite
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build a security-conscious workforce
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <feature.icon className={`h-12 w-12 ${feature.color}`} />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Secure Your Organization?
            </h2>
            <p className="text-xl opacity-90">
              Join hundreds of organizations that trust SecureGuard to protect 
              their employees from phishing attacks.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate("/admin")}
              className="shadow-elevated"
            >
              Start Your Free Trial
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="SecureGuard" className="h-8 w-auto" />
              <span className="font-semibold">SecureGuard</span>
            </div>
            <p className="text-muted-foreground text-sm mt-4 md:mt-0">
              © 2024 SecureGuard. Protecting organizations worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
