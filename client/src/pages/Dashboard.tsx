import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { formatCurrency } from "@/const";
import { Wallet, TrendingUp, TrendingDown, DollarSign, Loader2 } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const cards = [
    {
      title: "إجمالي السيولة",
      value: stats?.totalCash || 0,
      icon: Wallet,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "إجمالي الإيرادات",
      value: stats?.totalRevenue || 0,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "إجمالي المصروفات",
      value: stats?.totalExpenses || 0,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "صافي الربح",
      value: stats?.netProfit || 0,
      icon: DollarSign,
      color: stats && stats.netProfit >= 0 ? "text-green-600" : "text-red-600",
      bgColor: stats && stats.netProfit >= 0 ? "bg-green-50" : "bg-red-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">مرحبًا، {user?.name || "المستخدم"}</h1>
        <p className="text-muted-foreground mt-1">نظرة عامة على الوضع المالي</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(card.value)}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>الإجراءات السريعة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/vouchers/payment"
              className="block p-4 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="font-medium">سند صرف جديد</div>
              <div className="text-sm text-muted-foreground">تسجيل عملية صرف نقدية</div>
            </a>
            <a
              href="/vouchers/receipt"
              className="block p-4 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="font-medium">سند قبض جديد</div>
              <div className="text-sm text-muted-foreground">تسجيل عملية قبض نقدية</div>
            </a>
            <a
              href="/ai-assistant"
              className="block p-4 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="font-medium">المساعد الذكي</div>
              <div className="text-sm text-muted-foreground">إنشاء قيود تلقائية بالذكاء الاصطناعي</div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>آخر العمليات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground text-center py-8">
              لا توجد عمليات حديثة
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
