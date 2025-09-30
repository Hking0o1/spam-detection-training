import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Upload, 
  Filter, 
  Download, 
  Mail, 
  CheckCircle, 
  XCircle, 
  Clock,
  Users
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import BulkEmailUpload from "@/components/BulkEmailUpload";
import BulkEmailSender from "@/components/BulkEmailSender";

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  status: "Clicked" | "Not Clicked" | "Completed Training" | "Pending" | "Inactive";
  lastCampaign: string;
  completionRate: number;
}

const EmployeeDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showBulkEmail, setShowBulkEmail] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform data to match the Employee interface
      const transformedEmployees = data?.map(emp => ({
        id: emp.id,
        name: emp.name,
        email: emp.email,
        department: emp.department,
        status: (emp.status === 'active' ? 'Pending' : 'Inactive') as Employee['status'],
        lastCampaign: 'N/A',
        completionRate: 0
      })) || [];

      setEmployees(transformedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load employees. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const departments = ["all", "Sales", "IT", "HR", "Finance", "Marketing"];
  const statuses = ["all", "Clicked", "Not Clicked", "Completed Training", "Pending"];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;
    const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Clicked":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Clicked
          </Badge>
        );
      case "Not Clicked":
        return (
          <Badge variant="secondary" className="bg-success text-success-foreground">
            <CheckCircle className="w-3 h-3 mr-1" />
            Safe
          </Badge>
        );
      case "Completed Training":
        return (
          <Badge variant="default">
            <CheckCircle className="w-3 h-3 mr-1" />
            Trained
          </Badge>
        );
      case "Pending":
        return (
          <Badge variant="outline">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleEmployeesImported = (count: number) => {
    fetchEmployees(); // Refresh the employee list
    setShowBulkUpload(false);
    toast({
      title: "Import Successful",
      description: `${count} employees have been imported successfully.`
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Employee data is being exported to CSV format."
    });
  };

  const stats = {
    total: employees.length,
    clicked: employees.filter(e => e.status === "Clicked").length,
    safe: employees.filter(e => e.status === "Not Clicked").length,
    trained: employees.filter(e => e.status === "Completed Training").length,
    pending: employees.filter(e => e.status === "Pending").length
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employee Directory</h1>
            <p className="text-muted-foreground">
              Manage employees and track their phishing awareness training progress
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setShowBulkUpload(!showBulkUpload)}>
              <Upload className="mr-2 h-4 w-4" />
              Import CSV
            </Button>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button onClick={() => setShowBulkEmail(!showBulkEmail)}>
              <Mail className="mr-2 h-4 w-4" />
              Bulk Email
            </Button>
          </div>
        </div>

        {/* Bulk Upload Section */}
        {showBulkUpload && (
          <BulkEmailUpload onEmployeesImported={handleEmployeesImported} />
        )}

        {/* Bulk Email Section */}
        {showBulkEmail && (
          <BulkEmailSender />
        )}

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">At Risk (Clicked)</p>
                <p className="text-2xl font-bold text-destructive">{stats.clicked}</p>
              </div>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Safe</p>
                <p className="text-2xl font-bold text-success">{stats.safe}</p>
              </div>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Trained</p>
                <p className="text-2xl font-bold text-primary">{stats.trained}</p>
              </div>
              <CheckCircle className="h-4 w-4 text-primary" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning">{stats.pending}</p>
              </div>
              <Clock className="h-4 w-4 text-warning" />
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Management</CardTitle>
            <CardDescription>
              Search and filter employees by department and training status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept === "all" ? "All Departments" : dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "all" ? "All Statuses" : status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Employee Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2 text-sm text-muted-foreground">Loading employees...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Campaign</TableHead>
                    <TableHead>Training Rate</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{getStatusBadge(employee.status)}</TableCell>
                      <TableCell>{employee.lastCampaign}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${employee.completionRate}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{employee.completionRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {filteredEmployees.length === 0 && (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold">No employees found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default EmployeeDirectory;