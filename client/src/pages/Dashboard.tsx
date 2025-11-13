import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Receipt,
  FileText,
  Building2,
  Users,
  Package,
  Briefcase,
  BarChart3,
  Wallet,
  BookOpen,
  ArrowRight,
  Activity,
  Target,
  Zap,
  Brain,
  FileSpreadsheet,
  Calculator,
  PieChart,
  LineChart,
  Loader2
} from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user } = useAuth();
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();

  // تحديث الوقت كل دقيقة
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // حساب النسب المئوية للتغيير (وهمية - ستُستبدل ببيانات حقيقية)
  const financialStats = {
    totalCash: stats?.totalCash || 0,
    totalRevenue: stats?.totalRevenue || 0,
    totalExpenses: stats?.totalExpenses || 0,
    netProfit: stats?.netProfit || 0,
    cashChange: 12.5,
    revenueChange: 8.3,
    expensesChange: -5.2,
    profitChange: 15.7,
  };

  const quickActions = [
    {
      title: "سند قبض جديد",
      description: "تسجيل عملية قبض نقدية",
      icon: Receipt,
      color: "bg-green-500",
      path: "/receipt-voucher",
      badge: "سريع"
    },
    {
      title: "سند صرف جديد",
      description: "تسجيل عملية صرف نقدية",
      icon: FileText,
      color: "bg-red-500",
      path: "/payment-voucher",
      badge: "سريع"
    },
    {
      title: "قيد يومي جديد",
      description: "إنشاء قيد محاسبي يدوي",
      icon: FileSpreadsheet,
      color: "bg-blue-500",
      path: "/journal-entry",
      badge: "يدوي"
    },
    {
      title: "المساعد الذكي",
      description: "إنشاء قيود بالذكاء الاصطناعي",
      icon: Brain,
      color: "bg-purple-500",
      path: "/ai-assistant",
      badge: "ذكي"
    },
  ];

  const aiFeatures = [
    {
      title: "المساعد المحاسبي الذكي",
      description: "ابدأ محادثة مع المساعد الذكي لبناء نظامك المحاسبي بسهولة",
      icon: Brain,
      gradient: "from-purple-500 to-pink-500",
      path: "/ai-assistant",
      features: ["فهم الأوامر بالعربية", "إنشاء القيود تلقائياً", "تعلم من سلوكك"]
    },
    {
      title: "مركز التحكم الذكي",
      description: "مساعدك الذكي لإنشاء وإدارة جميع مكونات نظامك المحاسبي",
      icon: Target,
      gradient: "from-blue-500 to-cyan-500",
      path: "/ai-hub",
      features: ["نظرة عامة على النظام", "إحصائيات ذكية", "توصيات تلقائية"]
    },
  ];

  const managementSections = [
    {
      title: "إدارة الوحدات",
      description: "واجهة بسيطة لإدارة وتفعيل الوحدات المحاسبية",
      icon: Building2,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      path: "/units",
      stats: "إدارة الوحدات"
    },
    {
      title: "إدارة المؤسسات",
      description: "واجهة بسيطة لإدارة وتفعيل المؤسسات والفروع",
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      path: "/organizations",
      stats: "إدارة المؤسسات"
    },
    {
      title: "إدارة الحسابات",
      description: "إدارة وإنشاء ورؤية الصناديق والبنوك والأصول",
      icon: Wallet,
      color: "text-green-600",
      bgColor: "bg-green-50",
      path: "/analytical-accounts",
      stats: "الحسابات التحليلية"
    },
  ];

  const accountingTools = [
    {
      title: "القيود التلقائية",
      description: "اكتب الجملة باللغة الطبيعية ليتم إنشاء القيد تلقائياً",
      icon: Zap,
      path: "/ai-assistant",
      badge: "AI"
    },
    {
      title: "بناء دليل الحسابات",
      description: "أخبر المساعد عن نوع نشاطك وسيبني لك دليل حسابات كامل",
      icon: BookOpen,
      path: "/chart-of-accounts",
      badge: "ذكي"
    },
    {
      title: "المعاملات الذكية",
      description: "إدارة التحويلات بين الحسابات والمؤسسات بسهولة",
      icon: Activity,
      path: "/transactions",
      badge: "جديد"
    },
  ];

  const reports = [
    {
      title: "ميزان المراجعة",
      icon: BarChart3,
      path: "/trial-balance",
      color: "text-blue-600"
    },
    {
      title: "قائمة المركز المالي",
      icon: PieChart,
      path: "/balance-sheet",
      color: "text-green-600"
    },
    {
      title: "قائمة الدخل",
      icon: LineChart,
      path: "/income-statement",
      color: "text-purple-600"
    },
    {
      title: "كشف الحساب",
      icon: FileSpreadsheet,
      path: "/account-statement",
      color: "text-orange-600"
    },
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">مرحباً {user?.name || "متنوعات"}</h1>
            <p className="text-muted-foreground text-lg mt-1">
              نظام محاسبي ذكي يساعدك في بناء دليل الحسابات وإدارة القيود المحاسبية بسهولة
            </p>
          </div>
          <div className="text-right text-sm text-muted-foreground hidden md:block">
            <p>{currentTime.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="text-xs mt-1">{currentTime.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
      </div>

      {/* Financial Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي السيولة</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialStats.totalCash.toLocaleString()} ر.س</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+{financialStats.cashChange}%</span>
              <span>من الشهر الماضي</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialStats.totalRevenue.toLocaleString()} ر.س</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+{financialStats.revenueChange}%</span>
              <span>من الشهر الماضي</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المصروفات</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialStats.totalExpenses.toLocaleString()} ر.س</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3 text-green-600" />
              <span className="text-green-600">{financialStats.expensesChange}%</span>
              <span>من الشهر الماضي</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">صافي الربح</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialStats.netProfit.toLocaleString()} ر.س</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+{financialStats.profitChange}%</span>
              <span>من الشهر الماضي</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Features - Large Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {aiFeatures.map((feature, index) => (
          <Card 
            key={index}
            className="relative overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 border-0"
            onClick={() => setLocation(feature.path)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-90`} />
            <CardHeader className="relative z-10">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-white">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-white/90 text-base">
                    {feature.description}
                  </CardDescription>
                </div>
                <ArrowRight className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex flex-wrap gap-2">
                {feature.features.map((item, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-white/20 text-white border-0">
                    {item}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Zap className="h-6 w-6 text-yellow-500" />
          الإجراءات السريعة
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => (
            <Card 
              key={index}
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
              onClick={() => setLocation(action.path)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-3 ${action.color} rounded-xl`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="secondary">{action.badge}</Badge>
                </div>
                <CardTitle className="text-lg mt-3">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* الوحدات المحاسبية */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Building2 className="h-6 w-6 text-blue-500" />
          الوحدات المحاسبية
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {managementSections.map((section, index) => (
            <Card 
              key={index}
              className="cursor-pointer hover:shadow-lg transition-all"
              onClick={() => setLocation(section.path)}
            >
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className={`p-3 ${section.bgColor} rounded-xl`}>
                    <section.icon className={`h-6 w-6 ${section.color}`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <CardDescription className="mt-1">{section.description}</CardDescription>
                    <p className="text-sm font-medium mt-2 text-muted-foreground">{section.stats}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Accounting Tools */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Calculator className="h-6 w-6 text-purple-500" />
          أدوات محاسبية ذكية
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {accountingTools.map((tool, index) => (
            <Card 
              key={index}
              className="cursor-pointer hover:shadow-lg transition-all"
              onClick={() => setLocation(tool.path)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <tool.icon className="h-6 w-6 text-purple-600" />
                    <div>
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                      <CardDescription className="mt-1">{tool.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">{tool.badge}</Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* التقارير المالية */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-green-500" />
          التقارير المالية
        </h2>
        <div className="grid gap-4 md:grid-cols-4">
          {reports.map((report, index) => (
            <Card 
              key={index}
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
              onClick={() => setLocation(report.path)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <report.icon className={`h-8 w-8 ${report.color}`} />
                  <CardTitle className="text-base">{report.title}</CardTitle>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* الإدارة */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Users className="h-6 w-6 text-orange-500" />
          الإدارة
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all"
            onClick={() => setLocation("/employees")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-blue-600" />
                <div>
                  <CardTitle className="text-lg">الموظفين</CardTitle>
                  <CardDescription>إدارة بيانات الموظفين والرواتب</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all"
            onClick={() => setLocation("/inventory")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <Package className="h-6 w-6 text-green-600" />
                <div>
                  <CardTitle className="text-lg">المخزون</CardTitle>
                  <CardDescription>إدارة المخزون والمنتجات</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all"
            onClick={() => setLocation("/assets")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <Briefcase className="h-6 w-6 text-purple-600" />
                <div>
                  <CardTitle className="text-lg">الأصول</CardTitle>
                  <CardDescription>إدارة الأصول الثابتة</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
