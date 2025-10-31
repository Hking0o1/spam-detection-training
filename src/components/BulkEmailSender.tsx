import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, Users, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { emailSubjectSchema, emailContentSchema, sanitizeHtmlContent } from '@/lib/validation';

const BulkEmailSender = () => {
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [targetDepartment, setTargetDepartment] = useState("all");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const emailTemplates = [
    {
      id: "banking-alert",
      name: "Banking Security Alert",
      subject: "Urgent: Suspicious Activity Detected",
      content: `Dear Employee,

We have detected suspicious activity on your company account. To secure your account, please verify your credentials immediately by clicking the link below:

[VERIFY ACCOUNT NOW]

If you do not verify within 24 hours, your account may be temporarily suspended.

Best regards,
Security Team`
    },
    {
      id: "it-support",
      name: "IT Support Request",
      subject: "Action Required: System Update",
      content: `Dear Team Member,

IT department requires immediate action from all users. Due to a critical security update, you must update your password within the next 2 hours.

Click here to update your password: [UPDATE PASSWORD]

Failure to comply may result in account lockout.

IT Support Team`
    },
    {
      id: "ceo-message",
      name: "CEO Urgent Message",
      subject: "URGENT: CEO Request",
      content: `Dear Employee,

This is an urgent request from the CEO. Due to confidential matters, please review the attached document immediately:

[DOWNLOAD DOCUMENT]

This matter requires your immediate attention.

Executive Office`
    }
  ];

  const departments = [
    { value: "all", label: "All Departments" },
    { value: "Sales", label: "Sales" },
    { value: "IT", label: "IT" },
    { value: "HR", label: "HR" },
    { value: "Finance", label: "Finance" },
    { value: "Marketing", label: "Marketing" }
  ];

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setEmailSubject(template.subject);
      setEmailContent(template.content);
    }
  };

  const handleSendBulkEmail = async () => {
    if (!emailSubject || !emailContent) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide both subject and content for the email."
      });
      return;
    }

    // Validate inputs
    const subjectValidation = emailSubjectSchema.safeParse(emailSubject);
    if (!subjectValidation.success) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: subjectValidation.error.errors[0].message
      });
      return;
    }

    const contentValidation = emailContentSchema.safeParse(emailContent);
    if (!contentValidation.success) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: contentValidation.error.errors[0].message
      });
      return;
    }

    // Sanitize HTML content
    const sanitizedContent = sanitizeHtmlContent(emailContent);

    setIsSending(true);

    try {
      // Get target employees
      let query = supabase.from('employees').select('*');
      
      if (targetDepartment !== "all") {
        query = query.eq('department', targetDepartment);
      }

      const { data: employees, error: employeesError } = await query;

      if (employeesError) {
        throw employeesError;
      }

      if (!employees || employees.length === 0) {
        toast({
          variant: "destructive",
          title: "No recipients found",
          description: "No employees found for the selected criteria."
        });
        return;
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You must be logged in to send bulk emails."
        });
        return;
      }

      // Create campaign record
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .insert({
          name: `Bulk Email - ${new Date().toLocaleDateString()}`,
          subject: subjectValidation.data,
          content: sanitizedContent,
          template_type: selectedTemplate || 'custom',
          status: 'active',
          created_by: user.id
        })
        .select()
        .single();

      if (campaignError) {
        throw campaignError;
      }

      // Create campaign targets
      const targets = employees.map(emp => ({
        campaign_id: campaign.id,
        employee_id: emp.id
      }));

      const { error: targetsError } = await supabase
        .from('campaign_targets')
        .insert(targets);

      if (targetsError) {
        throw targetsError;
      }

      // Send emails using edge function
      let successCount = 0;
      let failCount = 0;

      for (const employee of employees) {
        try {
          const { error: emailError } = await supabase.functions.invoke('send-campaign-email', {
            body: {
              to: employee.email,
              subject: subjectValidation.data,
              content: sanitizedContent,
              campaignId: campaign.id
            }
          });

          if (emailError) {
            console.error(`Failed to send email to ${employee.email}:`, emailError);
            failCount++;
          } else {
            successCount++;
          }
        } catch (error) {
          console.error(`Error sending email to ${employee.email}:`, error);
          failCount++;
        }
      }

      toast({
        title: successCount > 0 ? "Bulk email campaign created" : "Email sending failed",
        description: `Successfully sent ${successCount} emails. ${failCount > 0 ? `Failed to send ${failCount} emails.` : ''}`,
        variant: failCount === employees.length ? "destructive" : "default"
      });

      // Reset form
      setEmailSubject("");
      setEmailContent("");
      setSelectedTemplate("");
      setTargetDepartment("all");

    } catch (error) {
      console.error('Error sending bulk email:', error);
      toast({
        variant: "destructive",
        title: "Failed to send emails",
        description: "There was an error sending the bulk emails. Please try again."
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Bulk Email Campaign
        </CardTitle>
        <CardDescription>
          Send phishing simulation emails to multiple employees
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Template Selection */}
        <div className="space-y-2">
          <Label htmlFor="template-select">Email Template (Optional)</Label>
          <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a template or create custom email" />
            </SelectTrigger>
            <SelectContent>
              {emailTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Target Department */}
        <div className="space-y-2">
          <Label htmlFor="department-select">Target Department</Label>
          <Select value={targetDepartment} onValueChange={setTargetDepartment}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.value} value={dept.value}>
                  {dept.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Email Subject */}
        <div className="space-y-2">
          <Label htmlFor="email-subject">Email Subject *</Label>
          <Input
            id="email-subject"
            placeholder="Enter email subject"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
          />
        </div>

        {/* Email Content */}
        <div className="space-y-2">
          <Label htmlFor="email-content">Email Content *</Label>
          <Textarea
            id="email-content"
            placeholder="Enter your email content here..."
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            rows={8}
          />
          <p className="text-sm text-muted-foreground">
            Tip: Use [VERIFY ACCOUNT], [UPDATE PASSWORD], etc. as placeholder links for phishing simulation
          </p>
        </div>

        {/* Send Button */}
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleSendBulkEmail} 
            disabled={isSending}
            className="flex-1"
          >
            {isSending ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Bulk Email
              </>
            )}
          </Button>
        </div>

        {/* Info Box */}
        <div className="p-4 bg-info/10 border border-info/20 rounded-lg">
          <div className="flex items-start gap-2">
            <Users className="h-4 w-4 text-info mt-1" />
            <div className="text-sm">
              <p className="font-medium text-info">Bulk Email Information</p>
              <p className="text-muted-foreground mt-1">
                This will create a new phishing simulation campaign and send emails to all employees in the selected department. 
                Results will be tracked automatically when recipients interact with the emails.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkEmailSender;