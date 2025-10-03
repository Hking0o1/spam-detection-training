import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Mail, Users, Eye, Send, Clock, Upload, Edit, Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import BulkEmailUpload from "@/components/BulkEmailUpload";

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  status: string | null;
  created_at: string;
  updated_at: string;
}

interface Template {
  id: string;
  name: string;
  subject: string;
  content: string;
  template_type: string;
}

const CreateCampaign = () => {
  const [campaignName, setCampaignName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [newTemplate, setNewTemplate] = useState({ name: "", subject: "", content: "", template_type: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchEmployees();
    fetchTemplates();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load employees"
      });
    }
  };

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, name, subject, content, template_type')
        .not('template_type', 'is', null);
      
      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load templates"
      });
    }
  };

  const saveTemplate = async () => {
    try {
      if (editingTemplate) {
        const { error } = await supabase
          .from('campaigns')
          .update({
            name: editingTemplate.name,
            subject: editingTemplate.subject,
            content: editingTemplate.content,
            template_type: editingTemplate.template_type
          })
          .eq('id', editingTemplate.id);
        
        if (error) throw error;
        toast({ title: "Template updated successfully" });
      } else {
        // Get current user for new template
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast({
            variant: "destructive",
            title: "Authentication required",
            description: "You must be logged in to create templates."
          });
          return;
        }

        const { error } = await supabase
          .from('campaigns')
          .insert([{
            ...newTemplate,
            status: 'template',
            created_by: user.id
          }]);
        
        if (error) throw error;
        toast({ title: "Template created successfully" });
        setNewTemplate({ name: "", subject: "", content: "", template_type: "" });
      }
      
      setEditingTemplate(null);
      setIsDialogOpen(false);
      fetchTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save template"
      });
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Template deleted successfully" });
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete template"
      });
    }
  };

  const getDepartmentCounts = () => {
    const departments = employees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return [
      { id: "all", name: "All Employees", count: employees.length },
      ...Object.entries(departments).map(([dept, count]) => ({
        id: dept.toLowerCase().replace(/\s+/g, '-'),
        name: `${dept} Department`,
        count
      }))
    ];
  };

  const handleEmployeeToggle = (employeeId: string) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleDepartmentToggle = (department: string) => {
    const deptEmployees = employees
      .filter(emp => department === "all" || emp.department.toLowerCase().replace(/\s+/g, '-') === department)
      .map(emp => emp.id);
    
    const allSelected = deptEmployees.every(id => selectedEmployees.includes(id));
    
    if (allSelected) {
      setSelectedEmployees(prev => prev.filter(id => !deptEmployees.includes(id)));
    } else {
      setSelectedEmployees(prev => [...new Set([...prev, ...deptEmployees])]);
    }
  };

  const handlePreviewEmail = () => {
    const template = templates.find(t => t.id === selectedTemplate);
    if (!template && !customEmail) {
      toast({
        variant: "destructive",
        title: "No Content Selected",
        description: "Please select a template or write a custom email to preview."
      });
      return;
    }
    
    const content = template ? template.content : customEmail;
    const subject = template ? template.subject : customSubject;
    
    toast({
      title: "Email Preview",
      description: `Subject: ${subject}\n\nContent: ${content.substring(0, 100)}...`
    });
  };

  const handleSubmitCampaign = async () => {
    const template = templates.find(t => t.id === selectedTemplate);
    
    if (!campaignName || (!selectedTemplate && !customEmail) || selectedEmployees.length === 0) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields before launching the campaign."
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You must be logged in to create campaigns."
        });
        return;
      }

      // Create campaign
      const campaignData = {
        name: campaignName,
        subject: template ? template.subject : customSubject,
        content: template ? template.content : customEmail,
        template_type: template?.template_type || 'custom',
        status: 'active',
        scheduled_date: scheduleDate && scheduleTime ? new Date(`${scheduleDate} ${scheduleTime}`).toISOString() : null,
        created_by: user.id
      };

      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .insert([campaignData])
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Create campaign targets
      const targets = selectedEmployees.map(employeeId => ({
        campaign_id: campaign.id,
        employee_id: employeeId
      }));

      const { error: targetsError } = await supabase
        .from('campaign_targets')
        .insert(targets);

      if (targetsError) throw targetsError;

      // Send emails to all selected employees
      const targetEmployees = employees.filter(emp => selectedEmployees.includes(emp.id));
      let successCount = 0;
      let failCount = 0;

      for (const employee of targetEmployees) {
        try {
          const { error: emailError } = await supabase.functions.invoke('send-campaign-email', {
            body: {
              to: employee.email,
              subject: campaignData.subject,
              content: campaignData.content,
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
        title: successCount > 0 ? "Campaign Launched Successfully" : "Campaign created but emails failed",
        description: `"${campaignName}" campaign created. Sent ${successCount} emails successfully.${failCount > 0 ? ` Failed to send ${failCount} emails.` : ''}`,
        variant: failCount === targetEmployees.length ? "destructive" : "default"
      });

      // Reset form
      setCampaignName("");
      setSelectedTemplate("");
      setCustomSubject("");
      setCustomEmail("");
      setSelectedEmployees([]);
      setScheduleDate("");
      setScheduleTime("");
    } catch (error) {
      console.error('Error launching campaign:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to launch campaign"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedTemplateObj = templates.find(t => t.id === selectedTemplate);
  const departmentCounts = getDepartmentCounts();

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

            {/* Email Template Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Email Templates</CardTitle>
                    <CardDescription>
                      Manage and use email templates for your campaigns
                    </CardDescription>
                  </div>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setEditingTemplate(null)}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Template
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingTemplate ? 'Edit Template' : 'Create New Template'}
                        </DialogTitle>
                        <DialogDescription>
                          Create or modify email templates for phishing campaigns
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Template Name</Label>
                          <Input
                            value={editingTemplate ? editingTemplate.name : newTemplate.name}
                            onChange={(e) => editingTemplate 
                              ? setEditingTemplate({...editingTemplate, name: e.target.value})
                              : setNewTemplate({...newTemplate, name: e.target.value})
                            }
                            placeholder="e.g., Banking Security Alert"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Template Type</Label>
                          <Select
                            value={editingTemplate ? editingTemplate.template_type : newTemplate.template_type}
                            onValueChange={(value) => editingTemplate
                              ? setEditingTemplate({...editingTemplate, template_type: value})
                              : setNewTemplate({...newTemplate, template_type: value})
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select template type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="financial">Financial</SelectItem>
                              <SelectItem value="technical">Technical</SelectItem>
                              <SelectItem value="executive">Executive</SelectItem>
                              <SelectItem value="hr">HR</SelectItem>
                              <SelectItem value="security">Security</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Email Subject</Label>
                          <Input
                            value={editingTemplate ? editingTemplate.subject : newTemplate.subject}
                            onChange={(e) => editingTemplate
                              ? setEditingTemplate({...editingTemplate, subject: e.target.value})
                              : setNewTemplate({...newTemplate, subject: e.target.value})
                            }
                            placeholder="e.g., Urgent: Account Security Alert"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email Content</Label>
                          <Textarea
                            value={editingTemplate ? editingTemplate.content : newTemplate.content}
                            onChange={(e) => editingTemplate
                              ? setEditingTemplate({...editingTemplate, content: e.target.value})
                              : setNewTemplate({...newTemplate, content: e.target.value})
                            }
                            placeholder="Write your email content here..."
                            rows={8}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={saveTemplate}>
                            {editingTemplate ? 'Update' : 'Create'} Template
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Template</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an email template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{template.name}</span>
                            <Badge variant="outline" className="ml-2">
                              {template.template_type}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {templates.length > 0 && (
                  <div className="grid gap-2 max-h-40 overflow-y-auto">
                    {templates.map((template) => (
                      <div key={template.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{template.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{template.subject}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingTemplate(template);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTemplate(template.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedTemplateObj && (
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h4 className="font-medium">{selectedTemplateObj.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Subject: {selectedTemplateObj.subject}
                    </p>
                    <div className="text-sm mt-2 max-h-32 overflow-y-auto">
                      {selectedTemplateObj.content}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="custom-subject">Custom Email Subject</Label>
                  <Input
                    id="custom-subject"
                    placeholder="Enter custom email subject..."
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-email">Custom Email Content</Label>
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

            {/* Target Audience Selection */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Target Audience</CardTitle>
                    <CardDescription>
                      Select employees for this campaign or upload CSV
                    </CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload CSV
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Upload Employee Data</DialogTitle>
                        <DialogDescription>
                          Upload a CSV file to add new employees to the system
                        </DialogDescription>
                      </DialogHeader>
                      <BulkEmailUpload onUploadComplete={fetchEmployees} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Department Quick Select */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Quick Select by Department</Label>
                  <div className="grid gap-2">
                    {departmentCounts.map((dept) => {
                      const deptEmployees = employees
                        .filter(emp => dept.id === "all" || emp.department.toLowerCase().replace(/\s+/g, '-') === dept.id)
                        .map(emp => emp.id);
                      const allSelected = deptEmployees.length > 0 && deptEmployees.every(id => selectedEmployees.includes(id));
                      const someSelected = deptEmployees.some(id => selectedEmployees.includes(id));
                      
                      return (
                        <div
                          key={dept.id}
                          className={`
                            flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors
                            ${allSelected 
                              ? 'border-primary bg-primary/5' 
                              : someSelected 
                                ? 'border-primary/50 bg-primary/2'
                                : 'border-border hover:bg-accent'
                            }
                          `}
                          onClick={() => handleDepartmentToggle(dept.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              checked={allSelected}
                              className={someSelected && !allSelected ? "data-[state=checked]:bg-primary/50" : ""}
                            />
                            <div>
                              <p className="font-medium">{dept.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {dept.count} employees
                              </p>
                            </div>
                          </div>
                          <Users className="h-4 w-4 text-muted-foreground" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Individual Employee Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Individual Employees ({selectedEmployees.length} selected)
                  </Label>
                  <div className="max-h-60 overflow-y-auto border rounded-lg">
                    {employees.map((employee) => (
                      <div
                        key={employee.id}
                        className={`
                          flex items-center justify-between p-3 border-b last:border-b-0 cursor-pointer hover:bg-accent
                          ${selectedEmployees.includes(employee.id) ? 'bg-primary/5' : ''}
                        `}
                        onClick={() => handleEmployeeToggle(employee.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox checked={selectedEmployees.includes(employee.id)} />
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {employee.email} • {employee.department}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                      {selectedTemplateObj?.name || (customEmail ? "Custom" : "Not selected")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Selected Employees:</span>
                    <span className="font-medium">
                      {selectedEmployees.length} employees
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
                disabled={isLoading}
              >
                <Send className="mr-2 h-4 w-4" />
                {isLoading ? "Launching..." : "Launch Campaign"}
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