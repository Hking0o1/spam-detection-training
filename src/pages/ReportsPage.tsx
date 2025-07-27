import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  FileText,
  Calendar,
  TrendingUp,
  Users,
  Mail,
  Target,
  Award,
  AlertTriangle
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";

const ReportsPage = () => {
  const clickedVsNotClicked = [
    { name: "Clicked", value: 245, percentage: 23.5 },
    { name: "Not Clicked", value: 798, percentage: 76.5 }
  ];

  const quizResults = [
    { name: "Passed", value: 612, percentage: 78.2 },
    { name: "Failed", value: 171, percentage: 21.8 }
  ];

  const campaignData = [
    {
      id: 1,
      name: "Banking Security Alert",
      targetCount: 450,
      clicks: 89,
      clickRate: "19.8%",
      quizCompletions: 67,
      completionRate: "75.3%",
      date: "2024-01-15",
      status: "Completed"
    },
    {
      id: 2,
      name: "IT Support Request",
      targetCount: 320,
      clicks: 52,
      clickRate: "16.3%",
      quizCompletions: 41,
      completionRate: "78.8%",
      date: "2024-01-12",
      status: "Completed"
    },
    {
      id: 3,
      name: "CEO Urgent Message",
      targetCount: 280,
      clicks: 71,
      clickRate: "25.4%",
      quizCompletions: 48,
      completionRate: "67.6%",
      date: "2024-01-10",
      status: "Completed"
    },
    {
      id: 4,
      name: "Payroll Update",
      targetCount: 195,
      clicks: 33,
      clickRate: "16.9%",
      quizCompletions: 25,
      completionRate: "75.8%",
      date: "2024-01-08",
      status: "Completed"
    }
  ];

  const monthlyTrends = [
    { month: "Jul", campaigns: 3, clicks: 67, trainings: 45 },
    { month: "Aug", campaigns: 4, clicks: 89, trainings: 72 },
    { month: "Sep", campaigns: 5, clicks: 112, trainings: 89 },
    { month: "Oct", campaigns: 3, clicks: 78, trainings: 65 },
    { month: "Nov", campaigns: 6, clicks: 145, trainings: 118 },
    { month: "Dec", campaigns: 4, clicks: 98, trainings: 87 }
  ];

  const departmentPerformance = [
    { department: "Sales", employees: 45, clickRate: 27, trainingRate: 89 },
    { department: "Marketing", employees: 28, clickRate: 25, trainingRate: 92 },
    { department: "Finance", employees: 25, clickRate: 32, trainingRate: 76 },
    { department: "HR", employees: 18, clickRate: 22, trainingRate: 94 },
    { department: "IT", employees: 32, clickRate: 9, trainingRate: 97 },
    { department: "Operations", employees: 38, clickRate: 21, trainingRate: 85 }
  ];

  const COLORS = {
    primary: "hsl(var(--primary))",
    destructive: "hsl(var(--destructive))",
    success: "hsl(var(--success))",
    warning: "hsl(var(--warning))",
    muted: "hsl(var(--muted))"
  };

  const handleExportPDF = () => {
    // Mock export functionality
    console.log("Exporting to PDF...");
  };

  const handleExportCSV = () => {
    // Mock export functionality
    console.log("Exporting to CSV...");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
            <p className="text-muted-foreground">
              Comprehensive insights into your phishing awareness campaigns and training effectiveness
            </p>
          </div>
          <div className="flex space-x-2">
            <Select defaultValue="last-30">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-7">Last 7 days</SelectItem>
                <SelectItem value="last-30">Last 30 days</SelectItem>
                <SelectItem value="last-90">Last 90 days</SelectItem>
                <SelectItem value="last-year">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExportPDF}>
              <FileText className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Campaigns</p>
                <p className="text-2xl font-bold">24</p>
                <p className="text-xs text-muted-foreground">+4 this month</p>
              </div>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Targets</p>
                <p className="text-2xl font-bold">1,043</p>
                <p className="text-xs text-muted-foreground">Employees reached</p>
              </div>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Click Rate</p>
                <p className="text-2xl font-bold">19.7%</p>
                <p className="text-xs text-success">-2.3% from last month</p>
              </div>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Training Completion</p>
                <p className="text-2xl font-bold">78.2%</p>
                <p className="text-xs text-success">+5.1% from last month</p>
              </div>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="campaigns">Campaign Details</TabsTrigger>
            <TabsTrigger value="departments">Department Analysis</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Click Rate Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Overall Click Rate</CardTitle>
                  <CardDescription>
                    Percentage of employees who clicked phishing links
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={clickedVsNotClicked}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                      >
                        <Cell fill={COLORS.destructive} />
                        <Cell fill={COLORS.success} />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Quiz Results */}
              <Card>
                <CardHeader>
                  <CardTitle>Training Quiz Results</CardTitle>
                  <CardDescription>
                    Pass vs Fail rate for security awareness training
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={quizResults}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                      >
                        <Cell fill={COLORS.success} />
                        <Cell fill={COLORS.destructive} />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>
                  Detailed results for each phishing simulation campaign
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Targets</TableHead>
                      <TableHead>Clicks</TableHead>
                      <TableHead>Click Rate</TableHead>
                      <TableHead>Quiz Completions</TableHead>
                      <TableHead>Completion Rate</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaignData.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{campaign.name}</TableCell>
                        <TableCell>{campaign.date}</TableCell>
                        <TableCell>{campaign.targetCount}</TableCell>
                        <TableCell>{campaign.clicks}</TableCell>
                        <TableCell>
                          <Badge variant={parseFloat(campaign.clickRate) > 20 ? "destructive" : "secondary"}>
                            {campaign.clickRate}
                          </Badge>
                        </TableCell>
                        <TableCell>{campaign.quizCompletions}</TableCell>
                        <TableCell>
                          <Badge variant={parseFloat(campaign.completionRate) > 75 ? "default" : "outline"}>
                            {campaign.completionRate}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{campaign.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Department Performance Comparison</CardTitle>
                <CardDescription>
                  Click rates and training completion by department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={departmentPerformance}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="clickRate" fill={COLORS.destructive} name="Click Rate %" />
                    <Bar dataKey="trainingRate" fill={COLORS.success} name="Training Rate %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>
                  Campaign activity and results over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="clicks"
                      stackId="1"
                      stroke={COLORS.destructive}
                      fill={COLORS.destructive}
                      fillOpacity={0.6}
                      name="Total Clicks"
                    />
                    <Area
                      type="monotone"
                      dataKey="trainings"
                      stackId="2"
                      stroke={COLORS.success}
                      fill={COLORS.success}
                      fillOpacity={0.6}
                      name="Training Completions"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ReportsPage;