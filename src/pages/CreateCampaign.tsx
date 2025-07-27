import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Mail, Users, Eye, Send, Clock } from "lucide-react";

const CreateCampaign = () => {
  const [campaignName, setCampaignName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const { toast } = useToast();

  const emailTemplates = [
    {
      id: "banking-alert",
      name: "Banking Security Alert",
      subject: "Urgent: Suspicious Activity Detected",
      preview: "Your account has been flagged for suspicious activity. Click here to verify...",
      category: "Financial"
    },
    {
      id: "it-support",
      name: "IT Support Request",
      subject: "Action Required: System Update",
      preview: "IT department requires you to update your password immediately...",
      category: "Technical"
    },
    {
      id: "ceo-urgent",
      name: "CEO Urgent Message",
      subject: "URGENT: CEO Request",
      preview: "This is an urgent request from the CEO. Please respond immediately...",
      category: "Executive"
    },
    {
      id: "payroll-update",
      name: "Payroll Update",
      subject: "Payroll System Update Required",
      preview: "Update your payroll information to continue receiving payments...",
      category: "HR"
    }
  ];

  const employeeGroups = [
    { id: "all", name: "All Employees", count: 1247 },
    { id: "sales", name: "Sales Department", count: 45 },
    { id: "it", name: "IT Department", count: 32 },
    { id: "hr", name: "HR Department", count: 18 },
    { id: "finance", name: "Finance Department", count: 25 },
    { id: "marketing", name: "Marketing Department", count: 28 },
    { id: "new-hires", name: "New Hires (Last 30 days)", count: 12 }
  ];

  const handleGroupToggle = (groupId: string) => {
    setSelectedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handlePreviewEmail = () => {
    if (!selectedTemplate && !customEmail) {
      toast({
        variant: "destructive",
        title: "No Content Selected",
        description: "Please select a template or write a custom email to preview."
      });
      return;
    }
    
    toast({
      title: "Email Preview",
      description: "Preview window would open here in a real implementation."
    });
  };

  const handleSubmitCampaign = () => {
    if (!campaignName || (!selectedTemplate && !customEmail) || selectedGroups.length === 0) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields before launching the campaign."
      });
      return;
    }

    const targetCount = selectedGroups.reduce((total, groupId) => {
      const group = employeeGroups.find(g => g.id === groupId);
      return total + (group?.count || 0);
    }, 0);

    toast({
      title: "Campaign Launched Successfully",
      description: `"${campaignName}" campaign launched targeting ${targetCount} employees.`
    });

    // Reset form
    setCampaignName("");
    setSelectedTemplate("");
    setCustomEmail("");
    setSelectedGroups([]);
    setScheduleDate("");
    setScheduleTime("");
  };

  const selectedTemplate_obj = emailTemplates.find(t => t.id === selectedTemplate);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Launch New Phishing Simulation</h1>
          <p className="text-muted-foreground">
            Create and deploy phishing awareness campaigns to test and train your employees
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Campaign Details */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Details</CardTitle>
                <CardDescription>
                  Basic information about your phishing simulation campaign
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">Campaign Name *</Label>
                  <Input
                    id="campaign-name"
                    placeholder="e.g., Q1 Banking Security Test"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Email Template Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Email Template</CardTitle>
                <CardDescription>
                  Choose from pre-designed templates or create a custom email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Template</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an email template" />
                    </SelectTrigger>
                    <SelectContent>
                      {emailTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{template.name}</span>
                            <Badge variant="outline" className="ml-2">
                              {template.category}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedTemplate_obj && (
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h4 className="font-medium">{selectedTemplate_obj.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Subject: {selectedTemplate_obj.subject}
                    </p>
                    <p className="text-sm mt-2">{selectedTemplate_obj.preview}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="custom-email">Or Write Custom Email</Label>
                  <Textarea
                    id="custom-email"
                    placeholder="Write your custom phishing email content here..."
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    rows={6}
                  />
                </div>

                <Button variant="outline" onClick={handlePreviewEmail}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Email
                </Button>
              </CardContent>
            </Card>

            {/* Employee Group Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Target Audience</CardTitle>
                <CardDescription>
                  Select which employee groups to include in this campaign
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {employeeGroups.map((group) => (
                    <div
                      key={group.id}
                      className={`
                        flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors
                        ${selectedGroups.includes(group.id) 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:bg-accent'
                        }
                      `}
                      onClick={() => handleGroupToggle(group.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedGroups.includes(group.id)}
                          onChange={() => handleGroupToggle(group.id)}
                          className="rounded"
                        />
                        <div>
                          <p className="font-medium">{group.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {group.count} employees
                          </p>
                        </div>
                      </div>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Schedule Campaign</CardTitle>
                <CardDescription>
                  Set when to launch this phishing simulation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule-date">Launch Date</Label>
                    <Input
                      id="schedule-date"
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schedule-time">Launch Time</Label>
                    <Input
                      id="schedule-time"
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Campaign Name:</span>
                    <span className="font-medium">
                      {campaignName || "Not set"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Template:</span>
                    <span className="font-medium">
                      {selectedTemplate_obj?.name || (customEmail ? "Custom" : "Not selected")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Target Groups:</span>
                    <span className="font-medium">
                      {selectedGroups.length || 0} selected
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Recipients:</span>
                    <span className="font-medium">
                      {selectedGroups.reduce((total, groupId) => {
                        const group = employeeGroups.find(g => g.id === groupId);
                        return total + (group?.count || 0);
                      }, 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Schedule:</span>
                    <span className="font-medium">
                      {scheduleDate && scheduleTime ? `${scheduleDate} ${scheduleTime}` : "Immediate"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button 
                onClick={handleSubmitCampaign}
                className="w-full"
                size="lg"
              >
                <Send className="mr-2 h-4 w-4" />
                Launch Campaign
              </Button>
              <Button variant="outline" className="w-full">
                <Clock className="mr-2 h-4 w-4" />
                Save as Draft
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateCampaign;