import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  CreditCard, DollarSign, CheckCircle, Ban, Search,
  RefreshCw, XCircle, Filter,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Skeleton from "@/components/common/Skeleton"
import { useAllPayments, useRefundPayment } from "@/hooks/apiHooks"
import { useToast } from "@/context/ToastContext"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const statusStyles = {
  SUCCEEDED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  FAILED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  REFUNDED: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
}

export default function AdminPaymentPage() {
  const { success, error: showError } = useToast()
  const paymentsQuery = useAllPayments()
  const refundMutation = useRefundPayment()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [refundDialog, setRefundDialog] = useState(null)
  const [refundReason, setRefundReason] = useState("")

  const payments = useMemo(() => paymentsQuery.data || [], [paymentsQuery.data])

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      if (statusFilter !== "ALL" && p.status !== statusFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          String(p.paymentId).includes(q) ||
          String(p.studentId).includes(q) ||
          String(p.courseId).includes(q) ||
          (p.receiptNumber || "").toLowerCase().includes(q) ||
          (p.paymentIntentId || "").toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [payments, search, statusFilter])

  const totalRevenue = useMemo(
    () => payments.filter(p => p.status === "SUCCEEDED").reduce((s, p) => s + p.amount, 0),
    [payments]
  )
  const totalFees = useMemo(
    () => payments.filter(p => p.status === "SUCCEEDED").reduce((s, p) => s + (p.platformFee || 0), 0),
    [payments]
  )
  const refundedCount = useMemo(
    () => payments.filter(p => p.status === "REFUNDED").length,
    [payments]
  )

  const handleRefund = async () => {
    if (!refundDialog || !refundReason.trim()) return
    try {
      await refundMutation.mutateAsync({ paymentId: refundDialog.paymentId, reason: refundReason })
      success("Payment refunded successfully")
      setRefundDialog(null)
      setRefundReason("")
    } catch (err) {
      showError(err.message || "Refund failed")
    }
  }

  const stats = [
    { title: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-green-600" },
    { title: "Platform Fees", value: `$${totalFees.toFixed(2)}`, icon: CreditCard, color: "text-blue-600" },
    { title: "Transactions", value: payments.length, icon: RefreshCw, color: "text-purple-600" },
    { title: "Refunded", value: refundedCount, icon: XCircle, color: "text-red-600" },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment Management</h1>
        <p className="text-muted-foreground">View and manage all platform transactions</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{paymentsQuery.isLoading ? "..." : stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Transactions</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID, receipt..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="SUCCEEDED">Succeeded</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {paymentsQuery.isLoading && (
            <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}</div>
          )}
          {paymentsQuery.isError && (
            <p className="text-sm text-destructive">Could not load payments.</p>
          )}
          {!paymentsQuery.isLoading && !paymentsQuery.isError && filtered.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              <CreditCard className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No payments found.</p>
            </div>
          )}
          {!paymentsQuery.isLoading && !paymentsQuery.isError && filtered.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-3 px-2">ID</th>
                    <th className="text-left py-3 px-2">Receipt</th>
                    <th className="text-left py-3 px-2">Student</th>
                    <th className="text-left py-3 px-2">Course</th>
                    <th className="text-right py-3 px-2">Amount</th>
                    <th className="text-right py-3 px-2">Fee</th>
                    <th className="text-center py-3 px-2">Status</th>
                    <th className="text-right py-3 px-2">Date</th>
                    <th className="text-center py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((payment) => (
                    <tr key={payment.paymentId} className="border-b hover:bg-accent/50">
                      <td className="py-3 px-2 font-mono text-xs">{payment.paymentId}</td>
                      <td className="py-3 px-2 font-mono text-xs">{payment.receiptNumber || "—"}</td>
                      <td className="py-3 px-2">{payment.studentId}</td>
                      <td className="py-3 px-2">{payment.courseId}</td>
                      <td className="py-3 px-2 text-right font-medium">
                        ${payment.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-2 text-right text-muted-foreground">
                        ${(payment.platformFee || 0).toFixed(2)}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Badge className={`${statusStyles[payment.status] || ""}`}>
                          {payment.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-right text-muted-foreground text-xs">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2 text-center">
                        {payment.status === "SUCCEEDED" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setRefundDialog(payment)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!refundDialog} onOpenChange={(open) => { if (!open) { setRefundDialog(null); setRefundReason("") } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refund Payment</DialogTitle>
            <DialogDescription>
              Refund payment #{refundDialog?.paymentId} for ${refundDialog?.amount?.toFixed(2)}?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="reason">Refund Reason</Label>
            <Textarea
              id="reason"
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="e.g., Student requested cancellation"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => { setRefundDialog(null); setRefundReason("") }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRefund} disabled={!refundReason.trim() || refundMutation.isPending}>
              {refundMutation.isPending ? "Refunding..." : "Confirm Refund"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
