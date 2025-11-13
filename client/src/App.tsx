import { Toaster } from "@/components/ui/sonner";
import { InstallPrompt } from "@/components/InstallPrompt";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardLayout from "@/components/DashboardLayout";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import ChartOfAccounts from "./pages/ChartOfAccounts";
import AnalyticalAccounts from "./pages/AnalyticalAccounts";
import PaymentVoucher from "./pages/PaymentVoucher";
import ReceiptVoucher from "./pages/ReceiptVoucher";
import VouchersList from "./pages/VouchersList";

import Reports from "./pages/Reports";
import Employees from "./pages/Employees";
import Inventory from "./pages/Inventory";
import Assets from "./pages/Assets";
import Units from "./pages/Units";
import AIAssistant from "./pages/AIAssistant";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <DashboardLayout><Dashboard /></DashboardLayout>} />
      <Route path="/chart-of-accounts" component={() => <DashboardLayout><ChartOfAccounts /></DashboardLayout>} />
      <Route path="/analytical-accounts" component={() => <DashboardLayout><AnalyticalAccounts /></DashboardLayout>} />
      <Route path="/vouchers" component={() => <DashboardLayout><VouchersList /></DashboardLayout>} />
      <Route path="/vouchers/payment" component={() => <DashboardLayout><PaymentVoucher /></DashboardLayout>} />
      <Route path="/vouchers/receipt" component={() => <DashboardLayout><ReceiptVoucher /></DashboardLayout>} />

      <Route path="/payment-voucher" component={() => <DashboardLayout><PaymentVoucher /></DashboardLayout>} />
      <Route path="/receipt-voucher" component={() => <DashboardLayout><ReceiptVoucher /></DashboardLayout>} />
      <Route path="/vouchers-list" component={() => <DashboardLayout><VouchersList /></DashboardLayout>} />
      <Route path="/ai-assistant" component={() => <DashboardLayout><AIAssistant /></DashboardLayout>} />
      <Route path="/reports" component={() => <DashboardLayout><Reports /></DashboardLayout>} />
      <Route path="/inventory" component={() => <DashboardLayout><Inventory /></DashboardLayout>} />
      <Route path="/employees" component={() => <DashboardLayout><Employees /></DashboardLayout>} />
      <Route path="/assets" component={() => <DashboardLayout><Assets /></DashboardLayout>} />
      <Route path="/units" component={() => <DashboardLayout><Units /></DashboardLayout>} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <InstallPrompt />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}