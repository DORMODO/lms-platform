import { useState } from "react"
import { motion } from "framer-motion"
import { Shield, Plus, Settings, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Skeleton from "@/components/common/Skeleton"
import {
  useRoles,
  usePermissions,
  useCreateRole,
  useDeleteRole,
  useAddPermissionToRole,
  useRemovePermissionFromRole,
  useCreatePermission,
} from "@/hooks/apiHooks"
import { useToast } from "@/context/ToastContext"

export default function RolePermissionsManagement() {
  const { success, error: showError } = useToast()

  const rolesQuery = useRoles()
  const permissionsQuery = usePermissions()
  const createRole = useCreateRole()
  const deleteRole = useDeleteRole()
  const addPermission = useAddPermissionToRole()
  const removePermission = useRemovePermissionFromRole()
  const createPermission = useCreatePermission()

  const roles = rolesQuery.data || []
  const allPermissions = permissionsQuery.data || []

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showManageDialog, setShowManageDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showCreatePermissionDialog, setShowCreatePermissionDialog] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [newRoleName, setNewRoleName] = useState("")
  const [selectedPermissionIds, setSelectedPermissionIds] = useState([])
  const [newPermission, setNewPermission] = useState({ name: "", description: "" })
  const [createError, setCreateError] = useState("")

  const openManageDialog = (role) => {
    setSelectedRole(role)
    setShowManageDialog(true)
  }

  const openDeleteDialog = (role) => {
    setSelectedRole(role)
    setShowDeleteDialog(true)
  }

  const handleCreateRole = async () => {
    setCreateError("")
    try {
      await createRole.mutateAsync({
        name: newRoleName,
        permissionIds: selectedPermissionIds,
      })
      success(`Role "${newRoleName}" created`)
      setShowCreateDialog(false)
      setNewRoleName("")
      setSelectedPermissionIds([])
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to create role"
      setCreateError(message)
      showError(message)
    }
  }

  const handleDeleteRole = async () => {
    if (!selectedRole) return
    try {
      await deleteRole.mutateAsync(selectedRole.id)
      success(`Role "${selectedRole.name}" deleted`)
      setShowDeleteDialog(false)
      setSelectedRole(null)
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to delete role"
      showError(message)
    }
  }

  const handleAddPermission = async (permissionId) => {
    if (!selectedRole) return
    try {
      await addPermission.mutateAsync({ roleId: selectedRole.id, permissionId })
      success("Permission added")
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to add permission"
      showError(message)
    }
  }

  const handleRemovePermission = async (permissionId) => {
    if (!selectedRole) return
    try {
      await removePermission.mutateAsync({ roleId: selectedRole.id, permissionId })
      success("Permission removed")
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to remove permission"
      showError(message)
    }
  }

  const handleCreatePermission = async () => {
    try {
      await createPermission.mutateAsync(newPermission)
      success(`Permission "${newPermission.name}" created`)
      setShowCreatePermissionDialog(false)
      setNewPermission({ name: "", description: "" })
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to create permission"
      showError(message)
    }
  }

  const togglePermissionSelection = (permissionId) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Roles & Permissions</h1>
          <p className="text-muted-foreground">Configure role-based access control from auth-service</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowCreatePermissionDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Permission
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        </div>
      </div>

      {rolesQuery.isLoading && <Skeleton className="h-48 w-full rounded-lg" />}
      {rolesQuery.isError && (
        <Card className="p-6 text-sm text-destructive">
          {rolesQuery.error?.response?.data?.message || "Could not load roles from auth-service."}
        </Card>
      )}

      <div className="grid gap-4">
        {roles.map((role, index) => (
          <motion.div
            key={role.id || role.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">{role.name}</h3>
                  {role.isStatic && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      System
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openManageDialog(role)} title="Manage permissions">
                    <Settings className="h-4 w-4" />
                  </Button>
                  {!role.isStatic && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => openDeleteDialog(role)}
                      title="Delete role"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {(role.permissions || []).length === 0 && (
                  <span className="text-xs text-muted-foreground">No permissions assigned</span>
                )}
                {(role.permissions || []).map((permission) => {
                  const name = typeof permission === "string" ? permission : permission.name
                  return (
                    <span key={name} className="text-xs px-2 py-1 rounded-full bg-secondary">
                      {name}
                    </span>
                  )
                })}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {!rolesQuery.isLoading && !rolesQuery.isError && roles.length === 0 && (
        <p className="text-sm text-muted-foreground">No roles returned from auth-service.</p>
      )}

      {/* Create Role Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Role</DialogTitle>
            <DialogDescription>Create a new role with optional permissions</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role-name">Role Name</Label>
              <Input
                id="role-name"
                placeholder="e.g. MODERATOR"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value.toUpperCase())}
              />
            </div>
            {allPermissions.length > 0 && (
              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="max-h-48 overflow-y-auto space-y-1 border rounded-lg p-2">
                  {allPermissions.map((perm) => {
                    const isSelected = selectedPermissionIds.includes(perm.id)
                    return (
                      <button
                        key={perm.id}
                        type="button"
                        onClick={() => togglePermissionSelection(perm.id)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          isSelected
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-accent"
                        }`}
                      >
                        <span className="font-medium">{perm.name}</span>
                        {perm.description && (
                          <span className="text-muted-foreground ml-2">— {perm.description}</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
            {createError && (
              <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{createError}</p>
            )}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setShowCreateDialog(false); setCreateError("") }}>
                Cancel
              </Button>
              <Button onClick={handleCreateRole} disabled={createRole.isPending || !newRoleName.trim()}>
                {createRole.isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Permissions Dialog */}
      <Dialog open={showManageDialog} onOpenChange={setShowManageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Permissions</DialogTitle>
            <DialogDescription>
              {selectedRole ? `Add or remove permissions for "${selectedRole.name}"` : ""}
            </DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Current Permissions</Label>
                <div className="flex flex-wrap gap-2 min-h-[2rem]">
                  {(selectedRole.permissions || []).length === 0 && (
                    <span className="text-sm text-muted-foreground">None</span>
                  )}
                  {(selectedRole.permissions || []).map((perm) => {
                    const permName = typeof perm === "string" ? perm : perm.name
                    const permId = typeof perm === "object" ? perm.id : null
                    return (
                      <span key={permName} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-secondary">
                        {permName}
                        <button
                          type="button"
                          onClick={() => handleRemovePermission(permId)}
                          className="hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )
                  })}
                </div>
              </div>
              <div>
                <Label className="mb-2 block">Add Permission</Label>
                <div className="max-h-48 overflow-y-auto space-y-1 border rounded-lg p-2">
                  {allPermissions
                    .filter((p) => !(selectedRole.permissions || []).some(
                      (rp) => (typeof rp === "string" ? rp : rp.name) === p.name
                    ))
                    .map((perm) => (
                      <button
                        key={perm.id}
                        type="button"
                        onClick={() => handleAddPermission(perm.id)}
                        className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors"
                      >
                        <span className="font-medium">{perm.name}</span>
                        {perm.description && (
                          <span className="text-muted-foreground ml-2">— {perm.description}</span>
                        )}
                      </button>
                    ))}
                  {allPermissions.filter((p) => !(selectedRole.permissions || []).some(
                    (rp) => (typeof rp === "string" ? rp : rp.name) === p.name
                  )).length === 0 && (
                    <p className="text-sm text-muted-foreground p-2">All permissions are already assigned</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => { setShowManageDialog(false); setSelectedRole(null) }}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Role Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              {selectedRole
                ? `Are you sure you want to delete "${selectedRole.name}"? This action cannot be undone.`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => { setShowDeleteDialog(false); setSelectedRole(null) }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteRole} disabled={deleteRole.isPending}>
              {deleteRole.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Permission Dialog */}
      <Dialog open={showCreatePermissionDialog} onOpenChange={setShowCreatePermissionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Permission</DialogTitle>
            <DialogDescription>Add a new permission that can be assigned to roles</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="perm-name">Permission Name</Label>
              <Input
                id="perm-name"
                placeholder="e.g. courses:manage"
                value={newPermission.name}
                onChange={(e) => setNewPermission({ ...newPermission, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="perm-desc">Description (optional)</Label>
              <Input
                id="perm-desc"
                placeholder="What this permission allows"
                value={newPermission.description}
                onChange={(e) => setNewPermission({ ...newPermission, description: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setShowCreatePermissionDialog(false); setNewPermission({ name: "", description: "" }) }}>
                Cancel
              </Button>
              <Button onClick={handleCreatePermission} disabled={createPermission.isPending || !newPermission.name.trim()}>
                {createPermission.isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
