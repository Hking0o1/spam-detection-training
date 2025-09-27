import { useEffect, useState } from "react";
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
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    totalEmployees: 0,
    clickRate: "0%",
    quizPassRate: "0%"
  });
  const [clickTrendData, setClickTrendData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [recentCampaigns, setRecentCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch summary stats
      const [campaignsResult, employeesResult, clicksResult, quizResult] = await Promise.all([
        supabase.from('campaigns').select('*'),
        supabase.from('employees').select('*'),
        supabase.from('campaign_clicks').select('*'),
        supabase.from('quiz_responses').select('score, total_questions')
      ]);

      const totalCampaigns = campaignsResult.data?.length || 0;
      const totalEmployees = employeesResult.data?.length || 0;
      const totalClicks = clicksResult.data?.length || 0;
      
      // Calculate click rate
      const { data: targetsData } = await supabase.from('campaign_targets').select('*');
      const totalTargets = targetsData?.length || 1;
      const clickRate = Math.round((totalClicks / totalTargets) * 100);
      
      // Calculate quiz pass rate
      const passedQuizzes = quizResult.data?.filter(quiz => 
        quiz.score >= Math.ceil(quiz.total_questions * 0.7)
      ).length || 0;
      const quizPassRate = quizResult.data?.length ? 
        Math.round((passedQuizzes / quizResult.data.length) * 100) : 0;

      setStats({
        totalCampaigns,
        totalEmployees,
        clickRate: `${clickRate}%`,
        quizPassRate: `${quizPassRate}%`
      });

      // Fetch department performance
      const { data: deptData } = await supabase
        .from('employees')
        .select(`
          department,
          id,
          campaign_clicks!inner(id)
        `);

      const deptStats = deptData?.reduce((acc, emp) => {
        if (!acc[emp.department]) {
          acc[emp.department] = { employees: 0, clicked: 0 };
        }
        acc[emp.department].employees++;
        if (emp.campaign_clicks.length > 0) {
          acc[emp.department].clicked++;
        }
        return acc;
      }, {});

      const departmentChartData = Object.entries(deptStats || {}).map(([dept, data]: [string, any]) => ({
        department: dept,
        employees: data.employees,
        clicked: data.clicked,
        rate: `${Math.round((data.clicked / data.employees) * 100)}%`
      }));

      setDepartmentData(departmentChartData);

      // Fetch recent campaigns with stats
      const { data: campaignData } = await supabase
        .from('campaigns')
        .select(`
          *,
          campaign_targets(count),
          campaign_clicks(count)
        `)
        .order('created_at', { ascending: false })
        .limit(4);

      const campaignsWithStats = campaignData?.map(campaign => ({
        id: campaign.id,
        name: campaign.name,
        date: new Date(campaign.created_at).toLocaleDateString(),
        targeted: campaign.campaign_targets?.[0]?.count || 0,
        clicked: campaign.campaign_clicks?.[0]?.count || 0,
        clickRate: campaign.campaign_targets?.[0]?.count ? 
          `${Math.round((campaign.campaign_clicks?.[0]?.count || 0) / campaign.campaign_targets[0].count * 100)}%` : 
          '0%',
        status: campaign.status === 'completed' ? 'Completed' : 'In Progress'
      })) || [];

      setRecentCampaigns(campaignsWithStats);

      // Mock trend data for now (you can enhance this with actual monthly data)
      setClickTrendData([
        { month: "Jan", clicks: Math.floor(Math.random() * 30) + 10 },
        { month: "Feb", clicks: Math.floor(Math.random() * 30) + 10 },
        { month: "Mar", clicks: Math.floor(Math.random() * 30) + 10 },
        { month: "Apr", clicks: Math.floor(Math.random() * 30) + 10 },
        { month: "May", clicks: Math.floor(Math.random() * 30) + 10 },
        { month: "Jun", clicks: clickRate }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  const summaryStats = [
    {
      title: "Total Campaigns Launched",
      value: stats.totalCampaigns.toString(),
      description: "All time",
      icon: Mail,
      trend: "+12%",
      positive: true
    },
    {
      title: "Total Employees",
      value: stats.totalEmployees.toString(),
      description: "In directory",
      icon: Users,
      trend: "+3%",
      positive: true
    },
    {
      title: "Click Rate",
      value: stats.clickRate,
      description: "Average across campaigns",
      icon: MousePointer,
      trend: "-5%",
      positive: false
    },
    {
      title: "Quiz Pass Rate",
      value: stats.quizPassRate,
      description: "Training completion",
      icon: GraduationCap,
      trend: "+8%",
      positive: true
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