import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Mail,
  MousePointer,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Eye
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const AdminDashboard = () => {
  const summaryStats = [
    {
      title: "Total Campaigns Launched",
      value: "24",
      description: "This month",
      icon: Mail,
      trend: "+12%",
      positive: true
    },
    {
      title: "Total Employees Targeted",
      value: "1,247",
      description: "Active employees",
      icon: Users,
      trend: "+3%",
      positive: true
    },
    {
      title: "Click Rate",
      value: "18.5%",
      description: "Average across campaigns",
      icon: MousePointer,
      trend: "-5%",
      positive: true
    },
    {
      title: "Quiz Pass Rate",
      value: "78%",
      description: "Training completion",
      icon: GraduationCap,
      trend: "+8%",
      positive: true
    }
  ];

  const clickTrendData = [
    { month: "Jan", clicks: 25 },
    { month: "Feb", clicks: 22 },
    { month: "Mar", clicks: 28 },
    { month: "Apr", clicks: 19 },
    { month: "May", clicks: 18 },
    { month: "Jun", clicks: 15 }
  ];

  const departmentData = [
    { department: "Sales", employees: 45, clicked: 12, rate: "27%" },
    { department: "IT", employees: 32, clicked: 3, rate: "9%" },
    { department: "HR", employees: 18, clicked: 4, rate: "22%" },
    { department: "Finance", employees: 25, clicked: 8, rate: "32%" },
    { department: "Marketing", employees: 28, clicked: 7, rate: "25%" }
  ];

  const recentCampaigns = [
    {
      id: 1,
      name: "Banking Security Alert",
      date: "2024-01-15",
      targeted: 250,
      clicked: 45,
      clickRate: "18%",
      status: "Completed"
    },
    {
      id: 2,
      name: "IT Support Request",
      date: "2024-01-12",
      targeted: 180,
      clicked: 32,
      clickRate: "18%",
      status: "Completed"
    },
    {
      id: 3,
      name: "CEO Urgent Message",
      date: "2024-01-10",
      targeted: 320,
      clicked: 68,
      clickRate: "21%",
      status: "Completed"
    },
    {
      id: 4,
      name: "Payroll Update",
      date: "2024-01-08",
      targeted: 195,
      clicked: 29,
      clickRate: "15%",
      status: "In Progress"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge variant="secondary" className="bg-success text-success-foreground">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </Badge>;
      case "In Progress":
        return <Badge variant="secondary" className="bg-warning text-warning-foreground">
          <AlertTriangle className="w-3 h-3 mr-1" />
          In Progress
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your phishing awareness campaigns and training progress
            </p>
          </div>
          <Button>
            <Eye className="mr-2 h-4 w-4" />
            View All Reports
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {summaryStats.map((stat, index) => (
            <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>{stat.description}</span>
                  <span className={`flex items-center ${stat.positive ? 'text-success' : 'text-destructive'}`}>
                    <TrendingUp className="mr-1 h-3 w-3" />
                    {stat.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Click Trends Chart */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Click Trends Over Time</CardTitle>
              <CardDescription>
                Monthly phishing simulation click rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={clickTrendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Department Performance */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>
                Click rates by department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="department" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Bar dataKey="clicked" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Campaign Activity */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Campaign Activity</CardTitle>
            <CardDescription>
              Latest phishing simulation campaigns and their results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Targeted</TableHead>
                  <TableHead>Clicked</TableHead>
                  <TableHead>Click Rate</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>{campaign.date}</TableCell>
                    <TableCell>{campaign.targeted}</TableCell>
                    <TableCell>{campaign.clicked}</TableCell>
                    <TableCell>{campaign.clickRate}</TableCell>
                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;