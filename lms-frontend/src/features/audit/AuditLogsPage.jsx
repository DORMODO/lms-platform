import { motion } from "framer-motion"
import { FileText, Download, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Skeleton from "@/components/common/Skeleton"
import { useAuditLogs } from "@/hooks/apiHooks"

export default function AuditLogsPage() {
  const logsQuery = useAuditLogs()
  const logs = logsQuery.data || []

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Audit Logs</h1>
          <p className="text-muted-foreground">Track system activity and changes from the audit endpoint</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card className="p-6">
        {logsQuery.isLoading && <Skeleton className="h-48 w-full rounded-lg" />}
        {logsQuery.isError && (
          <p className="text-sm text-destructive">
            {logsQuery.error?.response?.data?.message || "Could not load audit logs from the backend."}
          </p>
        )}
        {!logsQuery.isLoading && !logsQuery.isError && logs.length === 0 && (
          <p className="text-sm text-muted-foreground">No audit logs returned by the backend.</p>
        )}
        <div className="space-y-4">
          {logs.map((log, index) => (
            <motion.div
              key={log.id || `${log.action}-${log.timestamp}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <FileText className="h-5 w-5 text-muted-foreground mt-1" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{log.action || log.eventType || "Audit event"}</p>
                  <span className="text-sm text-muted-foreground">{log.timestamp || log.createdAt || ""}</span>
                </div>
                <p className="text-sm text-muted-foreground">{log.user || log.actor || log.email || ""}</p>
                <p className="text-sm mt-1">{log.details || log.message || JSON.stringify(log)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
