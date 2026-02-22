import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ArrowLeft, BarChart3, Users, FileText, TrendingUp, Eye, CheckCircle, CalendarIcon, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { format, subDays, eachDayOfInterval, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import clipboardIcon from '@/assets/clipboard-icon.png';

// Seed-based pseudo-random for consistent data per date
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateDataForRange(from: Date, to: Date) {
  const days = eachDayOfInterval({ start: from, end: to });

  const submissionData = days.map((day) => {
    const seed = day.getTime() / 86400000;
    const submissions = Math.round(seededRandom(seed) * 30 + 3);
    return {
      day: format(day, days.length > 14 ? 'MMM d' : 'EEE d'),
      submissions,
      date: day,
    };
  });

  const completionData = days.map((day) => {
    const seed = day.getTime() / 86400000 + 100;
    const rate = Math.round(seededRandom(seed) * 30 + 65);
    return {
      day: format(day, days.length > 14 ? 'MMM d' : 'EEE d'),
      rate: Math.min(rate, 100),
    };
  });

  const totalSubmissions = submissionData.reduce((s, d) => s + d.submissions, 0);
  const avgRate = Math.round(completionData.reduce((s, d) => s + d.rate, 0) / completionData.length);
  const totalViews = Math.round(totalSubmissions * (2.5 + seededRandom(from.getTime()) * 1.5));
  const totalForms = Math.round(8 + seededRandom(to.getTime()) * 8);

  const fieldTypeData = [
    { name: 'Short Text', value: Math.round(20 + seededRandom(from.getTime() + 1) * 20) },
    { name: 'Email', value: Math.round(10 + seededRandom(from.getTime() + 2) * 15) },
    { name: 'Dropdown', value: Math.round(8 + seededRandom(from.getTime() + 3) * 15) },
    { name: 'Checkbox', value: Math.round(5 + seededRandom(from.getTime() + 4) * 12) },
    { name: 'Number', value: Math.round(3 + seededRandom(from.getTime() + 5) * 10) },
    { name: 'Other', value: Math.round(2 + seededRandom(from.getTime() + 6) * 8) },
  ];

  const formPerformance = [
    'Contact Form', 'Feedback Survey', 'Job Application', 'Event Registration',
  ].map((name, i) => {
    const views = Math.round(50 + seededRandom(from.getTime() + i * 10) * 300);
    const subs = Math.round(views * (0.2 + seededRandom(to.getTime() + i * 10) * 0.5));
    return { name, views, submissions: subs, rate: Math.round((subs / views) * 1000) / 10 };
  });

  return { submissionData, completionData, fieldTypeData, formPerformance, totalSubmissions, avgRate, totalViews, totalForms };
}

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
  const today = new Date();
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(today, 6),
    to: today,
  });

  const data = useMemo(
    () => generateDataForRange(dateRange.from, dateRange.to),
    [dateRange.from.getTime(), dateRange.to.getTime()]
  );

  const dayCount = differenceInDays(dateRange.to, dateRange.from) + 1;

  const handlePreset = (days: number) => {
    setDateRange({ from: subDays(today, days - 1), to: today });
  };

  const stats = [
    { label: 'Total Forms', value: String(data.totalForms), icon: FileText, change: `in ${dayCount} days` },
    { label: 'Total Submissions', value: String(data.totalSubmissions), icon: Users, change: `in ${dayCount} days` },
    { label: 'Avg. Completion Rate', value: `${data.avgRate}%`, icon: CheckCircle, change: `avg over ${dayCount} days` },
    { label: 'Total Views', value: String(data.totalViews), icon: Eye, change: `in ${dayCount} days` },
  ];

  const rangeLabel = `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`;

  const exportCSV = useCallback(() => {
    const lines: string[] = [];
    lines.push('LiftupForms Analytics Report');
    lines.push(`Date Range: ${rangeLabel}`);
    lines.push('');

    // Summary
    lines.push('Summary');
    stats.forEach((s) => lines.push(`${s.label},${s.value}`));
    lines.push('');

    // Submissions
    lines.push('Daily Submissions');
    lines.push('Day,Submissions');
    data.submissionData.forEach((d) => lines.push(`${d.day},${d.submissions}`));
    lines.push('');

    // Completion Rate
    lines.push('Daily Completion Rate');
    lines.push('Day,Rate (%)');
    data.completionData.forEach((d) => lines.push(`${d.day},${d.rate}`));
    lines.push('');

    // Field Types
    lines.push('Field Type Usage');
    lines.push('Type,Count');
    data.fieldTypeData.forEach((d) => lines.push(`${d.name},${d.value}`));
    lines.push('');

    // Form Performance
    lines.push('Form Performance');
    lines.push('Form Name,Views,Submissions,Rate (%)');
    data.formPerformance.forEach((f) => lines.push(`${f.name},${f.views},${f.submissions},${f.rate}`));

    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${format(dateRange.from, 'yyyy-MM-dd')}-to-${format(dateRange.to, 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported successfully!');
  }, [data, dateRange, stats, rangeLabel]);

  const exportPDF = useCallback(() => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Title
    doc.setFontSize(18);
    doc.text('LiftupForms Analytics', 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Date Range: ${rangeLabel}`, 14, 28);

    // Summary table
    doc.setFontSize(13);
    doc.setTextColor(0);
    doc.text('Summary', 14, 40);
    autoTable(doc, {
      startY: 44,
      head: [['Metric', 'Value']],
      body: stats.map((s) => [s.label, s.value]),
      theme: 'striped',
      headStyles: { fillColor: [234, 120, 30] },
      margin: { left: 14 },
    });

    // Submissions table
    let y = (doc as any).lastAutoTable.finalY + 12;
    doc.setFontSize(13);
    doc.text('Daily Submissions', 14, y);
    autoTable(doc, {
      startY: y + 4,
      head: [['Day', 'Submissions']],
      body: data.submissionData.map((d) => [d.day, String(d.submissions)]),
      theme: 'striped',
      headStyles: { fillColor: [234, 120, 30] },
      margin: { left: 14 },
    });

    // Form Performance table
    y = (doc as any).lastAutoTable.finalY + 12;
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFontSize(13);
    doc.text('Form Performance', 14, y);
    autoTable(doc, {
      startY: y + 4,
      head: [['Form Name', 'Views', 'Submissions', 'Rate (%)']],
      body: data.formPerformance.map((f) => [f.name, String(f.views), String(f.submissions), `${f.rate}%`]),
      theme: 'striped',
      headStyles: { fillColor: [234, 120, 30] },
      margin: { left: 14 },
    });

    // Field Types table
    y = (doc as any).lastAutoTable.finalY + 12;
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFontSize(13);
    doc.text('Field Type Usage', 14, y);
    autoTable(doc, {
      startY: y + 4,
      head: [['Field Type', 'Count']],
      body: data.fieldTypeData.map((d) => [d.name, String(d.value)]),
      theme: 'striped',
      headStyles: { fillColor: [234, 120, 30] },
      margin: { left: 14 },
    });

    doc.save(`analytics-${format(dateRange.from, 'yyyy-MM-dd')}-to-${format(dateRange.to, 'yyyy-MM-dd')}.pdf`);
    toast.success('PDF exported successfully!');
  }, [data, dateRange, stats, rangeLabel]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="mr-1">
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

            <div className="flex items-center gap-2">
              {/* Preset buttons */}
              <div className="hidden sm:flex items-center gap-1">
                {[{ label: '7D', days: 7 }, { label: '14D', days: 14 }, { label: '30D', days: 30 }, { label: '90D', days: 90 }].map((p) => (
                  <Button
                    key={p.label}
                    variant={dayCount === p.days ? 'default' : 'outline'}
                    size="sm"
                    className={cn('h-8 px-3 text-xs', dayCount === p.days && 'liftup-gradient text-primary-foreground border-0')}
                    onClick={() => handlePreset(p.days)}
                  >
                    {p.label}
                  </Button>
                ))}
              </div>

              {/* Date range picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-2 text-xs">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {format(dateRange.from, 'MMM d')} – {format(dateRange.to, 'MMM d, yyyy')}
                    </span>
                    <span className="sm:hidden">
                      {format(dateRange.from, 'M/d')} – {format(dateRange.to, 'M/d')}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => {
                      if (range?.from && range?.to) {
                        setDateRange({ from: range.from, to: range.to });
                      } else if (range?.from) {
                        setDateRange({ from: range.from, to: range.from });
                      }
                    }}
                    numberOfMonths={2}
                    disabled={(date) => date > today}
                    initialFocus
                    className={cn('p-3 pointer-events-auto')}
                  />
                </PopoverContent>
              </Popover>

              {/* Export dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-2 text-xs">
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={exportCSV}>
                    <FileText className="w-4 h-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportPDF}>
                    <FileText className="w-4 h-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
                  <BarChart data={data.submissionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} interval={dayCount > 30 ? Math.floor(dayCount / 10) : 0} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 13 }} />
                    <Bar dataKey="submissions" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

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
                  <AreaChart data={data.completionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} interval={dayCount > 30 ? Math.floor(dayCount / 10) : 0} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} domain={[0, 100]} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 13 }} formatter={(value: number) => [`${value}%`, 'Rate']} />
                    <defs>
                      <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorRate)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="liftup-shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Field Type Usage</CardTitle>
              <CardDescription>Most used field types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.fieldTypeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                      {data.fieldTypeData.map((_, index) => (
                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 13 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-3 justify-center mt-2">
                {data.fieldTypeData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[index % PIE_COLORS.length] }} />
                    {entry.name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
                    {data.formPerformance.map((form) => (
                      <tr key={form.name} className="border-b border-border/50 last:border-0">
                        <td className="py-3 px-2 font-medium text-foreground">{form.name}</td>
                        <td className="text-right py-3 px-2 text-muted-foreground">{form.views}</td>
                        <td className="text-right py-3 px-2 text-muted-foreground">{form.submissions}</td>
                        <td className="text-right py-3 px-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            form.rate >= 50 ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground'
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
