import { useEffect, useState } from "react";
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
import { supabase } from "@/integrations/supabase/client";

const ReportsPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    totalTargets: 0,
    avgClickRate: 0,
    trainingCompletion: 0
  });
  const [clickedVsNotClicked, setClickedVsNotClicked] = useState<any[]>([]);
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [campaignData, setCampaignData] = useState<any[]>([]);
  const [departmentPerformance, setDepartmentPerformance] = useState<any[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<any[]>([]);

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      // Fetch all required data
      const [campaignsResult, targetsResult, clicksResult, quizResult, employeesResult, trainingsResult] = await Promise.all([
        supabase.from('campaigns').select('*'),
        supabase.from('campaign_targets').select('*'),
        supabase.from('campaign_clicks').select('*'),
        supabase.from('quiz_responses').select('*'),
        supabase.from('employees').select('*'),
        supabase.from('training_completions').select('*')
      ]);

      const totalCampaigns = campaignsResult.data?.length || 0;
      const totalTargets = targetsResult.data?.length || 0;
      const totalClicks = clicksResult.data?.length || 0;
      const totalTrainings = trainingsResult.data?.length || 0;

      // Calculate click rate
      const avgClickRate = totalTargets > 0 ? (totalClicks / totalTargets) * 100 : 0;
      
      // Calculate training completion
      const trainingCompletion = totalTargets > 0 ? (totalTrainings / totalTargets) * 100 : 0;

      setStats({
        totalCampaigns,
        totalTargets,
        avgClickRate: parseFloat(avgClickRate.toFixed(1)),
        trainingCompletion: parseFloat(trainingCompletion.toFixed(1))
      });

      // Clicked vs Not Clicked
      const notClicked = totalTargets - totalClicks;
      setClickedVsNotClicked([
        { name: "Clicked", value: totalClicks, percentage: avgClickRate.toFixed(1) },
        { name: "Not Clicked", value: notClicked, percentage: (100 - avgClickRate).toFixed(1) }
      ]);

      // Quiz results
      const passedQuizzes = quizResult.data?.filter(quiz => 
        quiz.score >= Math.ceil(quiz.total_questions * 0.7)
      ).length || 0;
      const failedQuizzes = (quizResult.data?.length || 0) - passedQuizzes;
      const passRate = quizResult.data?.length ? (passedQuizzes / quizResult.data.length) * 100 : 0;

      setQuizResults([
        { name: "Passed", value: passedQuizzes, percentage: passRate.toFixed(1) },
        { name: "Failed", value: failedQuizzes, percentage: (100 - passRate).toFixed(1) }
      ]);

      // Campaign data with stats
      const { data: campaignsWithStats } = await supabase
        .from('campaigns')
        .select(`
          *,
          campaign_targets(count),
          campaign_clicks(count)
        `)
        .order('created_at', { ascending: false });

      const formattedCampaigns = campaignsWithStats?.map(campaign => {
        const targetCount = campaign.campaign_targets?.[0]?.count || 0;
        const clicks = campaign.campaign_clicks?.[0]?.count || 0;
        const clickRate = targetCount > 0 ? (clicks / targetCount) * 100 : 0;
        
        return {
          id: campaign.id,
          name: campaign.name,
          targetCount,
          clicks,
          clickRate: `${clickRate.toFixed(1)}%`,
          quizCompletions: 0,
          completionRate: "0%",
          date: new Date(campaign.created_at).toLocaleDateString(),
          status: campaign.status === 'completed' ? 'Completed' : 'Active'
        };
      }) || [];

      setCampaignData(formattedCampaigns);

      // Department performance
      const deptMap = employeesResult.data?.reduce((acc, emp) => {
        if (!acc[emp.department]) {
          acc[emp.department] = { employees: 0, clicked: 0, trained: 0 };
        }
        acc[emp.department].employees++;
        return acc;
      }, {} as any) || {};

      // Count clicks per department
      for (const click of clicksResult.data || []) {
        const employee = employeesResult.data?.find(e => e.id === click.employee_id);
        if (employee && deptMap[employee.department]) {
          deptMap[employee.department].clicked++;
        }
      }

      // Count trainings per department
      for (const training of trainingsResult.data || []) {
        const employee = employeesResult.data?.find(e => e.id === training.employee_id);
        if (employee && deptMap[employee.department]) {
          deptMap[employee.department].trained++;
        }
      }

      const deptPerformance = Object.entries(deptMap).map(([dept, data]: [string, any]) => ({
        department: dept,
        employees: data.employees,
        clickRate: data.employees > 0 ? Math.round((data.clicked / data.employees) * 100) : 0,
        trainingRate: data.employees > 0 ? Math.round((data.trained / data.employees) * 100) : 0
      }));

      setDepartmentPerformance(deptPerformance);

      // Monthly trends - group by month
      const monthlyData: any = {};
      campaignsResult.data?.forEach(campaign => {
        const month = new Date(campaign.created_at).toLocaleDateString('en-US', { month: 'short' });
        if (!monthlyData[month]) {
          monthlyData[month] = { month, campaigns: 0, clicks: 0, trainings: 0 };
        }
        monthlyData[month].campaigns++;
      });

      clicksResult.data?.forEach(click => {
        const month = new Date(click.clicked_at).toLocaleDateString('en-US', { month: 'short' });
        if (monthlyData[month]) {
          monthlyData[month].clicks++;
        }
      });

      trainingsResult.data?.forEach(training => {
        const month = new Date(training.completed_at).toLocaleDateString('en-US', { month: 'short' });
        if (monthlyData[month]) {
          monthlyData[month].trainings++;
        }
      });

      setMonthlyTrends(Object.values(monthlyData));

    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = {
    primary: "hsl(var(--primary))",
    destructive: "hsl(var(--destructive))",
    success: "hsl(var(--success))",
    warning: "hsl(var(--warning))",
    muted: "hsl(var(--muted))"
  };

  const handleExportPDF = () => {
    console.log("Exporting to PDF...");
  };

  const handleExportCSV = () => {
    console.log("Exporting to CSV...");
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

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
                <p className="text-2xl font-bold">{stats.totalCampaigns}</p>
                <p className="text-xs text-muted-foreground">All time</p>
              </div>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Targets</p>
                <p className="text-2xl font-bold">{stats.totalTargets}</p>
                <p className="text-xs text-muted-foreground">Employees reached</p>
              </div>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Click Rate</p>
                <p className="text-2xl font-bold">{stats.avgClickRate}%</p>
                <p className="text-xs text-muted-foreground">Across all campaigns</p>
              </div>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Training Completion</p>
                <p className="text-2xl font-bold">{stats.trainingCompletion}%</p>
                <p className="text-xs text-muted-foreground">Overall rate</p>
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
