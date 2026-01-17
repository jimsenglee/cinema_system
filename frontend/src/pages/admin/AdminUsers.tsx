import { useState } from "react";
import { Search, Plus, Edit, MoreHorizontal, Users, Shield, Crown, Trash2, Lock, Unlock } from "lucide-react";
import { AdminLayout } from "./AdminLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { mockUsers, User } from "@/data/mockData";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const roleColors: Record<User["role"], string> = {
  customer: "bg-muted text-muted-foreground border-border/30",
  staff: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  manager: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  admin: "bg-accent/20 text-accent border-accent/30"
};

const membershipColors: Record<User["membershipTier"], string> = {
  Bronze: "from-amber-700 to-amber-900",
  Silver: "from-slate-400 to-slate-600",
  Gold: "from-yellow-500 to-amber-600",
  Platinum: "from-slate-300 to-slate-500"
};

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<User["role"] | "all">("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "customer" as User["role"],
    membershipTier: "Bronze" as User["membershipTier"],
    status: "active" as User["status"]
  });

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "customer",
      membershipTier: "Bronze",
      status: "active"
    });
    setIsAddDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      membershipTier: user.membershipTier,
      status: user.status
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success(`User "${formData.name}" created successfully!`);
    setIsAddDialogOpen(false);
    setIsSubmitting(false);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success(`User "${formData.name}" updated successfully!`);
    setIsEditDialogOpen(false);
    setIsSubmitting(false);
  };

  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success(`User "${selectedUser?.name}" deleted successfully!`);
    setIsDeleteDialogOpen(false);
    setIsSubmitting(false);
  };

  return (
    <AdminLayout title="Users" subtitle="Manage customers and staff accounts">
      {/* Actions Bar */}
      <div className="flex flex-col gap-3 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-card/50 border border-border/50 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button variant="cinema" className="gap-2 text-xs sm:text-sm" onClick={handleAddUser}>
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Add User</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Create a new user account</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {(["all", "customer", "staff", "manager", "admin"] as const).map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={cn(
                "px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0",
                filterRole === role
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-card/50 text-muted-foreground border border-border/30 hover:text-foreground"
              )}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <p className="text-xs sm:text-sm text-muted-foreground">
          Showing {filteredUsers.length} of {mockUsers.length} users
        </p>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredUsers.map((user) => (
          <GlassCard key={user.id} className="relative overflow-hidden p-3 sm:p-4">
            {/* Membership Gradient */}
            <div className={cn(
              "absolute top-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-br opacity-20",
              membershipColors[user.membershipTier]
            )} />
            
            <div className="relative">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-base sm:text-xl font-bold shadow-lg flex-shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">{user.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                <span className={cn(
                  "px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-medium border",
                  roleColors[user.role]
                )}>
                  {user.role === "admin" && <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 inline mr-0.5 sm:mr-1" />}
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                  <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3 inline mr-0.5 sm:mr-1" />
                  {user.membershipTier}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                <div>
                  <p className="text-muted-foreground text-[10px] sm:text-xs">Points</p>
                  <p className="font-semibold text-foreground">{user.pointsBalance.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[10px] sm:text-xs">Member Since</p>
                  <p className="font-semibold text-foreground">{format(new Date(user.memberSince), "MMM yyyy")}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border/30">
                <span className={cn(
                  "px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium",
                  user.status === "active" 
                    ? "bg-success/20 text-success" 
                    : "bg-destructive/20 text-destructive"
                )}>
                  {user.status}
                </span>
                <div className="flex gap-1 sm:gap-2">
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-1 text-xs h-7 sm:h-8 px-2 sm:px-3" onClick={() => handleEditUser(user)}>
                        <Edit className="w-3 h-3" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Edit {user.name}'s account</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-1 text-destructive hover:text-destructive hover:bg-destructive/10 h-7 sm:h-8 px-2" onClick={() => handleDeleteUser(user)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Delete {user.name}'s account</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 sm:py-20">
          <Users className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/30 mb-3 sm:mb-4" />
          <p className="text-base sm:text-lg font-medium text-foreground">No users found</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Try adjusting your search</p>
        </div>
      )}

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitAdd} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+60 12-345 6789" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role">Role *</Label>
                <Select value={formData.role} onValueChange={(value: any) => setFormData({...formData, role: value})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="membershipTier">Membership *</Label>
                <Select value={formData.membershipTier} onValueChange={(value: any) => setFormData({...formData, membershipTier: value})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bronze">Bronze</SelectItem>
                    <SelectItem value="Silver">Silver</SelectItem>
                    <SelectItem value="Gold">Gold</SelectItem>
                    <SelectItem value="Platinum">Platinum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" variant="cinema" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create User"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user account details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input id="edit-name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div>
              <Label htmlFor="edit-email">Email *</Label>
              <Input id="edit-email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div>
              <Label htmlFor="edit-phone">Phone</Label>
              <Input id="edit-phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-role">Role *</Label>
                <Select value={formData.role} onValueChange={(value: any) => setFormData({...formData, role: value})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-status">Status *</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="locked">Locked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-membershipTier">Membership *</Label>
              <Select value={formData.membershipTier} onValueChange={(value: any) => setFormData({...formData, membershipTier: value})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bronze">Bronze</SelectItem>
                  <SelectItem value="Silver">Silver</SelectItem>
                  <SelectItem value="Gold">Gold</SelectItem>
                  <SelectItem value="Platinum">Platinum</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" variant="cinema" disabled={isSubmitting}>{isSubmitting ? "Updating..." : "Update User"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedUser?.name}"? This action cannot be undone and will remove all their bookings and data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? "Deleting..." : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminUsers;
