import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileSpreadsheet, Download, Users, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BulkEmailUploadProps {
  onEmployeesImported?: (count: number) => void;
  onUploadComplete?: () => void;
}

const BulkEmailUpload = ({ onEmployeesImported, onUploadComplete }: BulkEmailUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedEmployees, setUploadedEmployees] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      const text = await file.text();
      let employees: any[] = [];

      if (file.name.endsWith('.csv')) {
        employees = parseCSV(text);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        toast({
          variant: "destructive",
          title: "Excel files not supported yet",
          description: "Please convert your Excel file to CSV format and try again."
        });
        return;
      } else {
        toast({
          variant: "destructive",
          title: "Unsupported file format",
          description: "Please upload a CSV file."
        });
        return;
      }

      if (employees.length === 0) {
        toast({
          variant: "destructive",
          title: "No valid data found",
          description: "Please check your file format and try again."
        });
        return;
      }

      // Insert employees into Supabase
      const { data, error } = await supabase
        .from('employees')
        .insert(employees)
        .select();

      if (error) {
        console.error('Error inserting employees:', error);
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: "There was an error importing the employees. Please try again."
        });
        return;
      }

      setUploadedEmployees(data || []);
      onEmployeesImported?.(data?.length || 0);
      onUploadComplete?.();
      
      toast({
        title: "Upload successful",
        description: `${data?.length || 0} employees imported successfully.`
      });

    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error processing the file. Please check the format and try again."
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const parseCSV = (text: string): Array<{name: string, email: string, department: string, status: string}> => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const employees: Array<{name: string, email: string, department: string, status: string}> = [];

    // Expected headers: name, email, department
    const nameIndex = headers.findIndex(h => h.includes('name'));
    const emailIndex = headers.findIndex(h => h.includes('email'));
    const departmentIndex = headers.findIndex(h => h.includes('department') || h.includes('dept'));

    if (nameIndex === -1 || emailIndex === -1 || departmentIndex === -1) {
      throw new Error('CSV must contain name, email, and department columns');
    }

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length >= 3) {
        employees.push({
          name: values[nameIndex],
          email: values[emailIndex],
          department: values[departmentIndex],
          status: 'active'
        });
      }
    }

    return employees;
  };

  const downloadTemplate = () => {
    const template = "name,email,department\nJohn Doe,john.doe@company.com,Sales\nJane Smith,jane.smith@company.com,Marketing\nMike Johnson,mike.johnson@company.com,IT";
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Template downloaded",
      description: "CSV template has been downloaded to your computer."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Bulk Employee Import
        </CardTitle>
        <CardDescription>
          Upload a CSV file to add multiple employees at once
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file-upload">Upload CSV File</Label>
          <div className="flex items-center gap-2">
            <Input
              id="file-upload"
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={downloadTemplate}
              className="whitespace-nowrap"
            >
              <Download className="h-4 w-4 mr-2" />
              Template
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            CSV file should contain columns: name, email, department
          </p>
        </div>

        {isUploading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-muted-foreground">Uploading...</span>
          </div>
        )}

        {uploadedEmployees.length > 0 && (
          <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center gap-2 text-success">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">
                Successfully imported {uploadedEmployees.length} employees
              </span>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <strong>File format requirements:</strong>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>CSV format only (.csv)</li>
            <li>Required columns: name, email, department</li>
            <li>First row should contain column headers</li>
            <li>Email addresses must be valid and unique</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkEmailUpload;