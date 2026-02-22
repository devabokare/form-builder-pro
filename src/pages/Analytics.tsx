import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, BarChart3, Users, FileText, TrendingUp, Eye, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import clipboardIcon from '@/assets/clipboard-icon.png';

const submissionData = [
  { day: 'Mon', submissions: 12 },
  { day: 'Tue', submissions: 19 },
  { day: 'Wed', submissions: 15 },
  { day: 'Thu', submissions: 27 },
  { day: 'Fri', submissions: 22 },
  { day: 'Sat', submissions: 8 },
  { day: 'Sun', submissions: 5 },
];

const fieldTypeData = [
  { name: 'Short Text', value: 35 },
  { name: 'Email', value: 20 },
  { name: 'Dropdown', value: 18 },
  { name: 'Checkbox', value: 12 },
  { name: 'Number', value: 8 },
  { name: 'Other', value: 7 },
];

const completionData = [
  { day: 'Mon', rate: 78 },
  { day: 'Tue', rate: 82 },
  { day: 'Wed', rate: 75 },
  { day: 'Thu', rate: 88 },
  { day: 'Fri', rate: 85 },
  { day: 'Sat', rate: 90 },
  { day: 'Sun', rate: 92 },
];

const formPerformance = [
  { name: 'Contact Form', views: 340, submissions: 128, rate: 37.6 },
  { name: 'Feedback Survey', views: 210, submissions: 95, rate: 45.2 },
  { name: 'Job Application', views: 180, submissions: 42, rate: 23.3 },
  { name: 'Event Registration', views: 150, submissions: 110, rate: 73.3 },
];

const PIE_COLORS = [
  'hsl(24, 95%, 53%)',
  'hsl(16, 90%, 50%)',
  'hsl(38, 92%, 50%)',
  'hsl(142, 71%, 45%)',
  'hsl(199, 89%, 48%)',
  'hsl(280, 60%, 55%)',
];

const Analytics = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('7d');

  const stats = [
    { label: 'Total Forms', value: '12', icon: FileText, change: '+2 this week' },
    { label: 'Total Submissions', value: '108', icon: Users, change: '+23 this week' },
    { label: 'Avg. Completion Rate', value: '84%', icon: CheckCircle, change: '+3% vs last week' },
    { label: 'Total Views', value: '880', icon: Eye, change: '+120 this week' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="mr-1"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-10 h-10 rounded-xl overflow-hidden liftup-shadow">
                <img src={clipboardIcon} alt="LiftupForms" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-lg font-bold liftup-gradient-text">Analytics</h1>
                <p className="text-xs text-muted-foreground">Form performance insights</p>
              </div>
            </div>

            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="liftup-shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-[hsl(var(--liftup-success))]" />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xs text-[hsl(var(--liftup-success))] mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submissions Chart */}
          <Card className="liftup-shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Submissions Over Time
              </CardTitle>
              <CardDescription>Daily form submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={submissionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: 13,
                      }}
                    />
                    <Bar dataKey="submissions" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Completion Rate Chart */}
          <Card className="liftup-shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Completion Rate
              </CardTitle>
              <CardDescription>Daily completion percentage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={completionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: 13,
                      }}
                      formatter={(value: number) => [`${value}%`, 'Rate']}
                    />
                    <defs>
                      <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="rate"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#colorRate)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Field Type Distribution */}
          <Card className="liftup-shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Field Type Usage</CardTitle>
              <CardDescription>Most used field types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fieldTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {fieldTypeData.map((_, index) => (
                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: 13,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-3 justify-center mt-2">
                {fieldTypeData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: PIE_COLORS[index % PIE_COLORS.length] }}
                    />
                    {entry.name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Form Performance Table */}
          <Card className="lg:col-span-2 liftup-shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Form Performance</CardTitle>
              <CardDescription>Views, submissions, and conversion rate per form</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Form Name</th>
                      <th className="text-right py-3 px-2 font-medium text-muted-foreground">Views</th>
                      <th className="text-right py-3 px-2 font-medium text-muted-foreground">Submissions</th>
                      <th className="text-right py-3 px-2 font-medium text-muted-foreground">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formPerformance.map((form) => (
                      <tr key={form.name} className="border-b border-border/50 last:border-0">
                        <td className="py-3 px-2 font-medium text-foreground">{form.name}</td>
                        <td className="text-right py-3 px-2 text-muted-foreground">{form.views}</td>
                        <td className="text-right py-3 px-2 text-muted-foreground">{form.submissions}</td>
                        <td className="text-right py-3 px-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            form.rate >= 50
                              ? 'bg-accent text-accent-foreground'
                              : 'bg-secondary text-secondary-foreground'
                          }`}>
                            {form.rate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
