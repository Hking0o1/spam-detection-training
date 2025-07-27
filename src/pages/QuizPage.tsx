import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, BookOpen, Trophy, RotateCcw } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const QuizPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const questions: Question[] = [
    {
      id: 1,
      question: "What should you do if you receive an email asking for your password?",
      options: [
        "Reply with your password immediately",
        "Never share your password via email",
        "Only share if it's from your IT department",
        "Share it but ask them to delete the email after"
      ],
      correctAnswer: 1,
      explanation: "Legitimate organizations will never ask for your password via email. Always verify such requests through official channels."
    },
    {
      id: 2,
      question: "Which of these is a red flag in an email?",
      options: [
        "Professional email signature",
        "Urgent language like 'Act now or lose access!'",
        "Proper grammar and spelling",
        "Company logo in the header"
      ],
      correctAnswer: 1,
      explanation: "Phishing emails often use urgent language to pressure you into quick actions without thinking carefully."
    },
    {
      id: 3,
      question: "Before clicking a link in an email, what should you do?",
      options: [
        "Click it immediately if it looks official",
        "Forward the email to all colleagues first",
        "Hover over the link to preview the destination URL",
        "Copy and paste the link into a new browser"
      ],
      correctAnswer: 2,
      explanation: "Hovering over links reveals their true destination, helping you identify suspicious or fake URLs before clicking."
    }
  ];

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
    setQuizCompleted(true);
    
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);
    
    toast({
      title: "Quiz Completed!",
      description: `You scored ${score}/${questions.length} (${percentage}%)`,
      variant: percentage >= 70 ? "default" : "destructive"
    });
  };

  const calculateScore = () => {
    return questions.reduce((score, question) => {
      return selectedAnswers[question.id] === question.correctAnswer ? score + 1 : score;
    }, 0);
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setQuizCompleted(false);
  };

  const score = calculateScore();
  const percentage = Math.round((score / questions.length) * 100);
  const passed = percentage >= 70;

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-6">
            {/* Results Header */}
            <Card className={`border-2 ${passed ? 'border-success bg-success/5' : 'border-destructive bg-destructive/5'}`}>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className={`p-4 ${passed ? 'bg-success/10' : 'bg-destructive/10'} rounded-full inline-block`}>
                    {passed ? (
                      <Trophy className="h-12 w-12 text-success" />
                    ) : (
                      <BookOpen className="h-12 w-12 text-destructive" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">
                      {passed ? "Congratulations!" : "Good Effort!"}
                    </h1>
                    <p className="text-xl text-muted-foreground">
                      You scored {score} out of {questions.length} questions correctly
                    </p>
                    <div className="mt-4">
                      <Badge variant={passed ? "default" : "destructive"} className="text-lg px-4 py-2">
                        {percentage}% {passed ? "PASSED" : "NEEDS IMPROVEMENT"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Question Review */}
            <Card>
              <CardHeader>
                <CardTitle>Question Review</CardTitle>
                <CardDescription>
                  Review your answers and learn from the explanations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {questions.map((question) => {
                  const userAnswer = selectedAnswers[question.id];
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`p-1 rounded-full ${isCorrect ? 'bg-success' : 'bg-destructive'}`}>
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-white" />
                          ) : (
                            <XCircle className="h-5 w-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <h3 className="font-semibold">Question {question.id}</h3>
                          <p className="text-muted-foreground">{question.question}</p>
                          
                          <div className="grid gap-2">
                            {question.options.map((option, index) => (
                              <div
                                key={index}
                                className={`p-2 rounded border text-sm ${
                                  index === question.correctAnswer
                                    ? 'border-success bg-success/10 text-success-foreground'
                                    : index === userAnswer && !isCorrect
                                    ? 'border-destructive bg-destructive/10 text-destructive-foreground'
                                    : 'border-muted'
                                }`}
                              >
                                {option}
                                {index === question.correctAnswer && (
                                  <Badge variant="secondary" className="ml-2 text-xs">
                                    Correct
                                  </Badge>
                                )}
                                {index === userAnswer && index !== question.correctAnswer && (
                                  <Badge variant="destructive" className="ml-2 text-xs">
                                    Your Answer
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                          
                          <div className="p-3 bg-muted/50 rounded">
                            <p className="text-sm">
                              <strong>Explanation:</strong> {question.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={handleRestartQuiz}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Retake Quiz
              </Button>
              <Button onClick={() => navigate("/training")}>
                Back to Training
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Phishing Awareness Quiz</CardTitle>
                  <CardDescription>
                    Test your knowledge about phishing and cybersecurity
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  Question {currentQuestion + 1} of {questions.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Question */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                {currentQ.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedAnswers[currentQ.id]?.toString()}
                onValueChange={(value) => handleAnswerSelect(currentQ.id, parseInt(value))}
              >
                <div className="space-y-4">
                  {currentQ.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label
                        htmlFor={`option-${index}`}
                        className="flex-1 cursor-pointer p-3 rounded border hover:bg-accent"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={selectedAnswers[currentQ.id] === undefined}
            >
              {currentQuestion === questions.length - 1 ? "Submit Quiz" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;