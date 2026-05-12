import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Search, UserPlus, MoreHorizontal, Trash2, Shield, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import Skeleton from "@/components/common/Skeleton"
import { useUsers, useRoles, useCreateUser, useUpdateUserRole, useDeleteUser } from "@/hooks/apiHooks"
import { useAuth } from "@/store/AuthContext"
import { useToast } from "@/context/ToastContext"
import { getUserIdFromToken } from "@/utils/jwt"

export default function UserManagement() {
  const [search, setSearch] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedRoleId, setSelectedRoleId] = useState("")
  const [newUser, setNewUser] = useState({ email: "", password: "", role: "STUDENT" })
  const [formError, setFormError] = useState("")

  const { user } = useAuth()
  const { success, error: showError } = useToast()
  const usersQuery = useUsers()
  const rolesQuery = useRoles()
  const createUser = useCreateUser()
  const updateUserRole = useUpdateUserRole()
  const deleteUser = useDeleteUser()

  const users = useMemo(() => usersQuery.data || [], [usersQuery.data])
  const roles = useMemo(() => rolesQuery.data || [], [rolesQuery.data])

  const adminUserId = getUserIdFromToken(user?.token)

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return users
    return users.filter((u) =>
      [u.email, u.fullName, u.roleName]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    )
  }, [search, users])

  const handleAddUser = async () => {
    setFormError("")
    try {
      await createUser.mutateAsync({
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
      })
      success("User created successfully")
      setShowAddDialog(false)
      setNewUser({ email: "", password: "", role: "STUDENT" })
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to create user"
      setFormError(message)
      showError(message)
    }
  }

  const handleChangeRole = async () => {
    if (!selectedUser || !selectedRoleId) return
    try {
      await updateUserRole.mutateAsync({ userId: selectedUser.id, roleId: Number(selectedRoleId) })
      success(`Role updated for ${selectedUser.email}`)
      setShowRoleDialog(false)
      setSelectedUser(null)
      setSelectedRoleId("")
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to update role"
      showError(message)
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return
    try {
      await deleteUser.mutateAsync({ userId: selectedUser.id, adminUserId: Number(adminUserId) })
      success(`User ${selectedUser.email} deleted`)
      setShowDeleteDialog(false)
      setSelectedUser(null)
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to delete user"
      showError(message)
    }
  }

  const openRoleDialog = (user) => {
    setSelectedUser(user)
    const role = roles.find((r) => r.name === user.roleName)
    setSelectedRoleId(role ? String(role.id) : "")
    setShowRoleDialog(true)
  }

  const openDeleteDialog = (user) => {
    setSelectedUser(user)
    setShowDeleteDialog(true)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage users from user-service</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card className="p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {usersQuery.isLoading && <Skeleton className="h-48 w-full rounded-lg" />}
        {usersQuery.isError && (
          <p className="text-sm text-destructive">
            {usersQuery.error?.response?.data?.message || "Could not load users from user-service."}
          </p>
        )}
        {!usersQuery.isLoading && !usersQuery.isError && filteredUsers.length === 0 && (
          <p className="text-sm text-muted-foreground">No users found.</p>
        )}

        <div className="space-y-4">
          {filteredUsers.map((userItem, index) => (
            <motion.div
              key={userItem.id || userItem.email}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                  {(userItem.fullName || userItem.email).charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold">{userItem.fullName || "—"}</h3>
                  <p className="text-sm text-muted-foreground">{userItem.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm px-2 py-1 rounded-full bg-primary/10">
                  {userItem.roleName || "N/A"}
                </span>
                <span className={`text-sm ${userItem.isApproved === false ? "text-amber-500" : "text-green-500"}`}>
                  {userItem.isApproved === false ? "Pending" : "Active"}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openRoleDialog(userItem)}>
                      <Shield className="mr-2 h-4 w-4" />
                      Change Role
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => openDeleteDialog(userItem)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>Create a new user account</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="add-email"
                  type="email"
                  placeholder="user@example.com"
                  className="pl-10"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="add-password"
                  type="password"
                  placeholder="Min 8 characters"
                  className="pl-10"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-role">Role</Label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser({ ...newUser, role: value })}
              >
                <SelectTrigger id="add-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STUDENT">Student</SelectItem>
                  <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formError && (
              <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{formError}</p>
            )}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setShowAddDialog(false); setFormError("") }}>
                Cancel
              </Button>
              <Button
                onClick={handleAddUser}
                disabled={createUser.isPending || !newUser.email || !newUser.password}
              >
                {createUser.isPending ? "Creating..." : "Create User"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
            <DialogDescription>
              {selectedUser ? `Change role for ${selectedUser.email}` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="change-role">New Role</Label>
              <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                <SelectTrigger id="change-role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={String(role.id)}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setShowRoleDialog(false); setSelectedUser(null) }}>
                Cancel
              </Button>
              <Button onClick={handleChangeRole} disabled={updateUserRole.isPending || !selectedRoleId}>
                {updateUserRole.isPending ? "Updating..." : "Update Role"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              {selectedUser
                ? `Are you sure you want to delete ${selectedUser.email}? This action cannot be undone.`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => { setShowDeleteDialog(false); setSelectedUser(null) }}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={deleteUser.isPending}
            >
              {deleteUser.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
