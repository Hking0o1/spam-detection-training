import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Play, BookOpen, Languages, ArrowRight, Shield, Eye, Link, Lock } from "lucide-react";

const TrainingPage = () => {
  const [language, setLanguage] = useState("english");
  const navigate = useNavigate();

  const phishingTips = [
    {
      icon: Eye,
      title: "Verify the Sender",
      description: "Always check the sender's email address carefully. Phishing emails often use addresses that look similar to legitimate ones but have small differences."
    },
    {
      icon: Link,
      title: "Don't Click Suspicious Links",
      description: "Hover over links to preview the destination URL before clicking. Be wary of shortened URLs or links that don't match the sender's domain."
    },
    {
      icon: Lock,
      title: "Look for HTTPS and Security Indicators",
      description: "Legitimate websites use secure connections (HTTPS). Check for the lock icon in your browser's address bar before entering sensitive information."
    },
    {
      icon: AlertTriangle,
      title: "Be Skeptical of Urgent Requests",
      description: "Phishing emails often create a sense of urgency. Take time to verify requests for personal information or immediate action through other channels."
    },
    {
      icon: Shield,
      title: "Use Multi-Factor Authentication",
      description: "Enable MFA on all your accounts. Even if your password is compromised, MFA provides an additional layer of security."
    }
  ];

  const handleStartQuiz = () => {
    navigate("/quiz");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-card border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Security Alert</h1>
                <p className="text-muted-foreground">You clicked a suspicious link</p>
              </div>
            </div>
            <Badge variant="destructive" className="text-sm">
              Training Required
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Alert Message */}
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <AlertTriangle className="h-8 w-8 text-destructive flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-destructive">
                    You clicked a suspicious link – Here's how to stay safe
                  </h2>
                  <p className="text-muted-foreground">
                    Don't worry! This was a phishing simulation designed to help you learn. 
                    In a real attack, this could have compromised your personal information or 
                    given attackers access to company systems. Let's learn how to identify and 
                    avoid phishing attempts in the future.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Language Toggle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Languages className="h-5 w-5" />
                <span>Language / भाषा</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Label htmlFor="language-toggle">English</Label>
                <Switch
                  id="language-toggle"
                  checked={language === "hindi"}
                  onCheckedChange={(checked) => setLanguage(checked ? "hindi" : "english")}
                />
                <Label htmlFor="language-toggle">हिन्दी</Label>
              </div>
            </CardContent>
          </Card>

          {/* Phishing Safety Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>{language === "hindi" ? "फ़िशिंग से बचने के उपाय" : "How to Stay Safe from Phishing"}</span>
              </CardTitle>
              <CardDescription>
                {language === "hindi" 
                  ? "इन महत्वपूर्ण सुरक्षा उपायों को याद रखें"
                  : "Remember these important security practices"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {phishingTips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-muted/50">
                    <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                      <tip.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">
                        {language === "hindi" 
                          ? getHindiTitle(index)
                          : tip.title
                        }
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {language === "hindi" 
                          ? getHindiDescription(index)
                          : tip.description
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Training Video */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>{language === "hindi" ? "प्रशिक्षण वीडियो" : "Training Video"}</span>
              </CardTitle>
              <CardDescription>
                {language === "hindi" 
                  ? "फ़िशिंग हमलों की पहचान और बचाव के बारे में जानें"
                  : "Learn how to identify and prevent phishing attacks"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="p-4 bg-primary/10 rounded-full inline-block">
                    <Play className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {language === "hindi" 
                        ? "फ़िशिंग जागरूकता प्रशिक्षण"
                        : "Phishing Awareness Training"
                      }
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === "hindi" 
                        ? "अवधि: 5 मिनट"
                        : "Duration: 5 minutes"
                      }
                    </p>
                  </div>
                  <Button>
                    <Play className="mr-2 h-4 w-4" />
                    {language === "hindi" ? "वीडियो चलाएं" : "Play Video"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quiz Call to Action */}
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="p-3 bg-primary/10 rounded-full inline-block">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {language === "hindi" 
                      ? "अपनी जानकारी का परीक्षण करें"
                      : "Test Your Knowledge"
                    }
                  </h3>
                  <p className="text-muted-foreground">
                    {language === "hindi" 
                      ? "एक छोटी क्विज़ लेकर अपनी सीखी गई बातों को जांचें"
                      : "Take a short quiz to test what you've learned"
                    }
                  </p>
                </div>
                <Button size="lg" onClick={handleStartQuiz}>
                  {language === "hindi" ? "क्विज़ शुरू करें" : "Start Quiz"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Helper functions for Hindi translations
const getHindiTitle = (index: number) => {
  const titles = [
    "भेजने वाले की जांच करें",
    "संदिग्ध लिंक पर क्लिक न करें",
    "HTTPS और सुरक्षा संकेतक देखें",
    "तत्काल अनुरोधों पर संदेह करें",
    "मल्टी-फैक्टर प्रमाणीकरण का उपयोग करें"
  ];
  return titles[index];
};

const getHindiDescription = (index: number) => {
  const descriptions = [
    "हमेशा भेजने वाले का ईमेल पता सावधानी से जांचें। फ़िशिंग ईमेल अक्सर वैध पतों के समान दिखने वाले पते का उपयोग करते हैं।",
    "क्लिक करने से पहले लिंक पर होवर करके गंतव्य URL देखें। छोटे URL या भेजने वाले के डोमेन से मेल न खाने वाले लिंक से सावधान रहें।",
    "वैध वेबसाइटें सुरक्षित कनेक्शन (HTTPS) का उपयोग करती हैं। संवेदनशील जानकारी दर्ज करने से पहले अपने ब्राउज़र के एड्रेस बार में लॉक आइकन जांचें।",
    "फ़िशिंग ईमेल अक्सर तात्कालिकता की भावना पैदा करते हैं। व्यक्तिगत जानकारी या तत्काल कार्रवाई के अनुरोधों को अन्य चैनलों के माध्यम से सत्यापित करने के लिए समय लें।",
    "अपने सभी खातों पर MFA सक्षम करें। भले ही आपका पासवर्ड समझौता हो गया हो, MFA सुरक्षा की एक अतिरिक्त परत प्रदान करता है।"
  ];
  return descriptions[index];
};

export default TrainingPage;