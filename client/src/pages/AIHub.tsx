import { useState } from "react";
import { useRoute } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  Sparkles,
  Building2,
  Factory,
  Store,
  BookOpen,
  Wallet,
  FileText,
  TrendingDown,
  TrendingUp,
  Loader2,
  Send,
  Lightbulb,
  History,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Filter,
  Home,
} from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function AIHub() {
  const [, params] = useRoute("/ai-hub");
  
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: "مرحباً! أنا مساعدك الذكي. يمكنني مساعدتك في إنشاء وإدارة جميع مكونات نظامك المحاسبي. كيف يمكنني مساعدتك اليوم؟"
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("chat");
  const [commandFilter, setCommandFilter] = useState<string>("all");

  // Fetch command history
  const { data: commandHistory = [], refetch: refetchHistory } = trpc.commandHistory.list.useQuery(
    { limit: 100 },
    { enabled: selectedTab === "history" }
  );

  const { data: commandStats } = trpc.commandHistory.stats.useQuery(
    undefined,
    { enabled: selectedTab === "history" }
  );

  const capabilities = [
    {
      icon: Building2,
      title: "الوحدات المحاسبية",
      description: "إنشاء وحدات محاسبية جديدة",
      color: "from-blue-600 to-cyan-600",
      example: "أنشئ وحدة محاسبية اسمها 'شركة النور'"
    },
    {
      icon: Factory,
      title: "المؤسسات والمشاريع",
      description: "إضافة مؤسسات ومشاريع",
      color: "from-purple-600 to-pink-600",
      example: "أضف مؤسسة 'فرع الرياض'"
    },
    {
      icon: Store,
      title: "الفروع",
      description: "إنشاء فروع جديدة",
      color: "from-green-600 to-emerald-600",
      example: "أضف فرع 'حي الملز'"
    },
    {
      icon: BookOpen,
      title: "دليل الحسابات",
      description: "إنشاء دليل حسابات كامل",
      color: "from-orange-600 to-red-600",
      example: "أنشئ دليل حسابات لنشاط تجاري"
    },
    {
      icon: Wallet,
      title: "الحسابات التحليلية",
      description: "إضافة صناديق، بنوك، عملاء، موردين",
      color: "from-indigo-600 to-purple-600",
      example: "أضف صندوق الفرع الرئيسي"
    },
    {
      icon: FileText,
      title: "القيود المحاسبية",
      description: "إنشاء قيود محاسبية",
      color: "from-teal-600 to-cyan-600",
      example: "شراء بضاعة بمبلغ 5000 ريال نقداً"
    },
    {
      icon: TrendingDown,
      title: "سندات الصرف",
      description: "إنشاء سندات صرف",
      color: "from-red-600 to-rose-600",
      example: "صرف رواتب الموظفين 50000 ريال"
    },
    {
      icon: TrendingUp,
      title: "سندات القبض",
      description: "إنشاء سندات قبض",
      color: "from-green-600 to-lime-600",
      example: "استلام 20000 ريال من عميل محمد"
    },
  ];

  const quickSuggestions = [
    "أنشئ نظام محاسبي كامل لشركة تجارية",
    "أضف دليل حسابات لنشاط مقاولات",
    "أنشئ 3 صناديق: الرئيسي، الفرعي، والطوارئ",
    "شراء معدات بمبلغ 15000 ريال بالتقسيط",
  ];

  const processCommandMutation = trpc.ai.processCommand.useMutation();

  const handleSend = async () => {
    if (!message.trim() || isProcessing) return;

    const userMessage = message.trim();
    setMessage("");
    
    // Add user message to chat
    setChatHistory(prev => [...prev, { role: "user", content: userMessage }]);
    setIsProcessing(true);

    try {
      // معالجة الأمر باستخدام محرك AI
      const result = await processCommandMutation.mutateAsync({
        command: userMessage,
        organizationId: undefined, // سيتم تحديده لاحقاً
      });

      // إضافة رد المساعد
      let responseContent = result.message;
      
      // تنسيق النتائج حسب نوع الأمر
      if (result.data) {
        if (result.commandType === 'query_journal_entries' && result.data.entries) {
          responseContent += `\n\n**القيود المحاسبية:**\n`;
          responseContent += `- عدد القيود: ${result.data.count}\n`;
          responseContent += `- إجمالي المدين: ${result.data.totalDebit}\n`;
          responseContent += `- إجمالي الدائن: ${result.data.totalCredit}\n\n`;
          
          if (result.data.entries.length > 0) {
            responseContent += `**أول 5 قيود:**\n`;
            result.data.entries.slice(0, 5).forEach((entry: any, i: number) => {
              responseContent += `${i + 1}. ${entry.date} - ${entry.description} (مدين: ${entry.debit}, دائن: ${entry.credit})\n`;
            });
          }
        } else if (result.commandType === 'query_accounts' && result.data.accounts) {
          responseContent += `\n\n**الحسابات:**\n`;
          result.data.accounts.slice(0, 10).forEach((acc: any, i: number) => {
            responseContent += `${i + 1}. ${acc.code} - ${acc.name} (${acc.type})\n`;
          });
        } else if (result.commandType === 'query_balances' && result.data.accounts) {
          responseContent += `\n\n**الأرصدة:**\n`;
          responseContent += `- إجمالي الرصيد: ${result.data.totalBalance}\n\n`;
          result.data.accounts.forEach((acc: any, i: number) => {
            responseContent += `${i + 1}. ${acc.name} (${acc.type}): ${acc.balance}\n`;
          });
        } else {
          // عرض افتراضي للبيانات
          responseContent += `\n\nتفاصيل النتيجة:\n${JSON.stringify(result.data, null, 2)}`;
        }
      }
      
      setChatHistory(prev => [...prev, {
        role: "assistant",
        content: responseContent
      }]);

      // تحديث سجل الأوامر
      if (selectedTab === "history") {
        refetchHistory();
      }
    } catch (error: any) {
      setChatHistory(prev => [...prev, {
        role: "assistant",
        content: `حدث خطأ: ${error.message}`
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setMessage(suggestion);
  };

  const handleCapabilityClick = (example: string) => {
    setMessage(example);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 p-6">
      <div className="container max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <Home className="h-4 w-4" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>مركز التحكم الذكي</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-4">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">مركز التحكم الذكي</h1>
          <p className="text-lg text-gray-600">
            مساعدك الذكي لإنشاء وإدارة جميع مكونات نظامك المحاسبي
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              المحادثة
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              سجل الأوامر
            </TabsTrigger>
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Capabilities */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                الإمكانيات
              </h2>
              <div className="space-y-3">
                {capabilities.map((capability, index) => {
                  const Icon = capability.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleCapabilityClick(capability.example)}
                      className="w-full text-right p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${capability.color} flex-shrink-0`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                            {capability.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {capability.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Right Column - Chat Interface */}
          <div className="lg:col-span-2 space-y-4">
            {/* Chat History */}
            <Card className="p-6 h-[600px] flex flex-col">
              <h2 className="text-xl font-bold text-gray-900 mb-4">المحادثة</h2>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        msg.role === "user"
                          ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-4 rounded-2xl">
                      <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Suggestions */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  اقتراحات سريعة:
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSuggestion(suggestion)}
                      className="text-sm px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="flex gap-3">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="اكتب رسالتك هنا... (مثال: أنشئ دليل حسابات لنشاط تجاري)"
                  rows={3}
                  className="flex-1 resize-none"
                  disabled={isProcessing}
                />
                <Button
                  onClick={handleSend}
                  disabled={!message.trim() || isProcessing}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-auto"
                  size="lg"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </Card>

            {/* Status/Preview Card */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">الحالة</h2>
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="font-semibold text-green-900">النظام جاهز</p>
                  <p className="text-sm text-green-700">يمكنك البدء بإرسال الأوامر</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
          </TabsContent>

          {/* Command History Tab */}
          <TabsContent value="history">
            <div className="space-y-6">
              {/* Statistics */}
              {commandStats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <History className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{commandStats.total}</p>
                        <p className="text-sm text-gray-600">إجمالي الأوامر</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{commandStats.success}</p>
                        <p className="text-sm text-gray-600">نجحت</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-red-100 rounded-lg">
                        <XCircle className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{commandStats.failed}</p>
                        <p className="text-sm text-gray-600">فشلت</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-yellow-100 rounded-lg">
                        <Clock className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{commandStats.pending}</p>
                        <p className="text-sm text-gray-600">قيد المعالجة</p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Filter */}
              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <Filter className="w-5 h-5 text-gray-600" />
                  <Select value={commandFilter} onValueChange={setCommandFilter}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="فلترة حسب النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأنواع</SelectItem>
                      <SelectItem value="create_unit">الوحدات المحاسبية</SelectItem>
                      <SelectItem value="create_organization">المؤسسات</SelectItem>
                      <SelectItem value="create_branch">الفروع</SelectItem>
                      <SelectItem value="create_chart">دليل الحسابات</SelectItem>
                      <SelectItem value="create_analytical_account">الحسابات التحليلية</SelectItem>
                      <SelectItem value="create_journal_entry">القيود المحاسبية</SelectItem>
                      <SelectItem value="create_payment_voucher">سندات الصرف</SelectItem>
                      <SelectItem value="create_receipt_voucher">سندات القبض</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>

              {/* Command History List */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <History className="w-6 h-6" />
                  سجل الأوامر
                </h2>
                
                <div className="space-y-3">
                  {commandHistory
                    .filter(cmd => commandFilter === "all" || cmd.commandType === commandFilter)
                    .map((cmd) => (
                    <div
                      key={cmd.id}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant={cmd.status === "success" ? "default" : cmd.status === "failed" ? "destructive" : "secondary"}
                              className={cmd.status === "success" ? "bg-green-600" : cmd.status === "pending" ? "bg-yellow-600" : ""}
                            >
                              {cmd.status === "success" ? "نجح" : cmd.status === "failed" ? "فشل" : "قيد المعالجة"}
                            </Badge>
                            <Badge variant="outline">
                              {getCommandTypeLabel(cmd.commandType)}
                            </Badge>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {format(new Date(cmd.createdAt), "PPp", { locale: ar })}
                            </span>
                          </div>
                          <p className="text-gray-900 font-medium mb-2">{cmd.command}</p>
                          {cmd.result && (
                            <details className="text-sm text-gray-600">
                              <summary className="cursor-pointer hover:text-purple-600">عرض التفاصيل</summary>
                              <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
                                {cmd.result}
                              </pre>
                            </details>
                          )}
                          {cmd.errorMessage && (
                            <p className="text-sm text-red-600 mt-2">خطأ: {cmd.errorMessage}</p>
                          )}
                          {cmd.executionTime && (
                            <p className="text-xs text-gray-500 mt-1">وقت التنفيذ: {cmd.executionTime}ms</p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-shrink-0"
                          onClick={() => {
                            setMessage(cmd.command);
                            setSelectedTab("chat");
                          }}
                        >
                          <RotateCcw className="w-4 h-4 ml-2" />
                          إعادة التنفيذ
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {commandHistory.filter(cmd => commandFilter === "all" || cmd.commandType === commandFilter).length === 0 && (
                    <div className="text-center py-12">
                      <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 text-lg">لا توجد أوامر بعد</p>
                      <p className="text-gray-500 text-sm mt-2">ابدأ بإرسال أوامر من تبويب المحادثة</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function getCommandTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    create_unit: "وحدة محاسبية",
    create_organization: "مؤسسة",
    create_branch: "فرع",
    create_chart: "دليل حسابات",
    create_analytical_account: "حساب تحليلي",
    create_journal_entry: "قيد محاسبي",
    create_payment_voucher: "سند صرف",
    create_receipt_voucher: "سند قبض",
    other: "أخرى"
  };
  return labels[type] || type;
}
