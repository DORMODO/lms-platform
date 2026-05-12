import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  CreditCard, CheckCircle, DollarSign, Ban,
  Search, Receipt,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Skeleton from "@/components/common/Skeleton"
import { usePaymentHistory } from "@/hooks/apiHooks"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"

const statusStyles = {
  SUCCEEDED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  FAILED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  REFUNDED: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
}

const methodLabels = {
  CREDIT_CARD: "Credit Card",
  PAYPAL: "PayPal",
  FREE: "Free",
}

export default function PaymentPage() {
  const paymentsQuery = usePaymentHistory()
  const [search, setSearch] = useState("")
  const [receiptDialog, setReceiptDialog] = useState(null)

  const payments = useMemo(() => paymentsQuery.data || [], [paymentsQuery.data])

  const filtered = useMemo(() => {
    if (!search) return payments
    const q = search.toLowerCase()
    return payments.filter((p) =>
      (p.receiptNumber || "").toLowerCase().includes(q) ||
      String(p.courseId).includes(q) ||
      String(p.amount).includes(q)
    )
  }, [payments, search])

  const totalSpent = useMemo(
    () => payments.filter(p => p.status === "SUCCEEDED").reduce((sum, p) => sum + p.amount, 0),
    [payments]
  )
  const completedCount = useMemo(
    () => payments.filter(p => p.status === "SUCCEEDED").length,
    [payments]
  )

  const stats = [
    { title: "Total Spent", value: `$${totalSpent.toFixed(2)}`, icon: DollarSign, trend: "All time" },
    { title: "Transactions", value: payments.length, icon: CreditCard, trend: "Total payments" },
    { title: "Completed", value: completedCount, icon: CheckCircle, trend: "Successful payments" },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment History</h1>
        <p className="text-muted-foreground">View all your past transactions and receipts</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, i) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{paymentsQuery.isLoading ? "..." : stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.trend}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaction History</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by receipt, course..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {paymentsQuery.isLoading && (
            <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}</div>
          )}
          {paymentsQuery.isError && (
            <p className="text-sm text-destructive">Could not load payment history.</p>
          )}
          {!paymentsQuery.isLoading && !paymentsQuery.isError && filtered.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              <CreditCard className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No transactions found.</p>
            </div>
          )}
          {!paymentsQuery.isLoading && !paymentsQuery.isError && filtered.length > 0 && (
            <div className="divide-y">
              {filtered.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center ${
                      payment.status === "SUCCEEDED"
                        ? "bg-green-100 dark:bg-green-900/30"
                        : payment.status === "FAILED"
                          ? "bg-red-100 dark:bg-red-900/30"
                          : "bg-muted"
                    }`}>
                      {payment.status === "SUCCEEDED" ? (
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : payment.status === "FAILED" ? (
                        <Ban className="h-4 w-4 text-red-600 dark:text-red-400" />
                      ) : (
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Course #{payment.courseId}</p>
                      <p className="text-xs text-muted-foreground">
                        {methodLabels[payment.paymentMethod] || payment.paymentMethod}
                        {" · "}
                        {new Date(payment.createdAt).toLocaleDateString()}
                        {payment.receiptNumber && (
                          <span className="ml-2 font-mono text-[10px] text-muted-foreground/60">
                            {payment.receiptNumber}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {payment.amount === 0 ? "Free" : `$${payment.amount.toFixed(2)}`}
                      </p>
                      <Badge className={`text-[10px] px-1.5 py-0 ${statusStyles[payment.status] || ""}`}>
                        {payment.status}
                      </Badge>
                    </div>
                    {payment.receiptNumber && (
                      <Button variant="ghost" size="icon" onClick={() => setReceiptDialog(payment)}>
                        <Receipt className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!receiptDialog} onOpenChange={(open) => { if (!open) setReceiptDialog(null) }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Payment Receipt
            </DialogTitle>
          </DialogHeader>
          {receiptDialog && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Receipt Number</span>
                  <span className="text-sm font-mono font-medium">{receiptDialog.receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Transaction ID</span>
                  <span className="text-sm font-mono">{receiptDialog.paymentIntentId || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Course ID</span>
                  <span className="text-sm">#{receiptDialog.courseId}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="text-lg font-bold">
                    {receiptDialog.amount === 0 ? "Free" : `$${receiptDialog.amount.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={statusStyles[receiptDialog.status] || ""}>
                    {receiptDialog.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Date</span>
                  <span className="text-sm">{new Date(receiptDialog.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
