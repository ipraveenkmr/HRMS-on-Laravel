import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import userService from '../../services/userService';
import { toast } from 'react-toastify';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
    employee_id: '',
    permissions: [],
    is_active: true
  });
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    match: false
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const userData = await userService.getUsers();
      setUsers(userData);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const roles = [
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'admin', label: 'Admin' },
    { value: 'hr', label: 'HR Manager' },
    { value: 'manager', label: 'Manager' },
    { value: 'employee', label: 'Employee' }
  ];

  const permissions = [
    'view_dashboard',
    'manage_employees',
    'manage_attendance',
    'manage_leave',
    'manage_payroll',
    'manage_assets',
    'manage_tasks',
    'view_reports',
    'manage_users'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Enhanced password validation
    if (formData.password || !editingUser) {
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return;
      }
      
      if (!passwordValidation.length || !passwordValidation.hasUpper || !passwordValidation.hasLower || !passwordValidation.hasNumber) {
        toast.error('Password must contain at least 6 characters, including uppercase, lowercase, and number');
        return;
      }
    }
    
    try {
      setLoading(true);
      
      if (editingUser) {
        // Update existing user
        const updateData = { ...formData };
        // Remove password if empty during edit
        if (!formData.password) {
          delete updateData.password;
          delete updateData.confirmPassword;
        }
        delete updateData.confirmPassword;
        
        const result = await userService.updateUser(editingUser.id, updateData);
        
        if (result.result === 'Updated') {
          toast.success('User updated successfully');
          await loadUsers();
          setEditingUser(null);
        } else {
          toast.error(result.result || 'Failed to update user');
        }
      } else {
        // Create new user
        const createData = { ...formData };
        delete createData.confirmPassword;
        
        const result = await userService.createUser(createData);
        
        if (result.result === 'Created') {
          toast.success('User created successfully');
          await loadUsers();
        } else {
          toast.error(result.result || 'Failed to create user');
        }
      }
      
      resetForm();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('An error occurred while saving the user');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    try {
      setLoading(true);
      const result = await userService.resetPassword(selectedUser.id, passwordData.newPassword);
      
      if (result.result === 'Password updated') {
        toast.success('Password updated successfully');
        setPasswordData({ newPassword: '', confirmPassword: '' });
        setIsPasswordModalOpen(false);
        setSelectedUser(null);
      } else {
        toast.error('Failed to update password');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('An error occurred while updating the password');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'employee',
      employee_id: '',
      permissions: [],
      is_active: true
    });
    setPasswordValidation({
      length: false,
      hasUpper: false,
      hasLower: false,
      hasNumber: false,
      match: false
    });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      ...user,
      password: '',
      confirmPassword: ''
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true);
        const result = await userService.deleteUser(id);
        
        if (result.result === 'Deleted') {
          toast.success('User deleted successfully');
          await loadUsers();
        } else {
          toast.error('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('An error occurred while deleting the user');
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePasswordChange = (user) => {
    setSelectedUser(user);
    setIsPasswordModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate password in real-time
    if (name === 'password' || name === 'confirmPassword') {
      const password = name === 'password' ? value : formData.password;
      const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
      
      setPasswordValidation({
        length: password.length >= 6,
        hasUpper: /[A-Z]/.test(password),
        hasLower: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        match: password === confirmPassword && password.length > 0
      });
    }
  };

  const handlePermissionChange = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const getRoleLabel = (roleValue) => {
    const role = roles.find(r => r.value === roleValue);
    return role ? role.label : roleValue;
  };

  const generateUsername = () => {
    const timestamp = Date.now().toString().slice(-4);
    return `user${timestamp}`;
  };

  const getPermissionDescription = (permission) => {
    const descriptions = {
      'view_dashboard': 'Access main dashboard',
      'manage_employees': 'Add, edit, delete employees',
      'manage_attendance': 'Track and modify attendance',
      'manage_leave': 'Handle leave requests',
      'manage_payroll': 'Process salary and payslips',
      'manage_assets': 'Allocate and track assets',
      'manage_tasks': 'Assign and monitor tasks',
      'view_reports': 'Generate and view reports',
      'manage_users': 'Create and manage user accounts'
    };
    return descriptions[permission] || 'System permission';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          + Add User
        </Button>
      </div>

      {/* Database Schema Notice */}
      <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <span className="text-orange-600 text-xl">ℹ️</span>
            <div>
              <h3 className="font-semibold text-orange-800 dark:text-orange-200">Limited Schema Mode</h3>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                Currently working with basic user schema (username, password, active status). 
                Additional fields like email, role, and permissions are shown but not saved until database migration is applied.
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                <strong>Working features:</strong> Create users, update username/password, activate/deactivate accounts, delete users
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingUsers ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No users found. Add your first user to get started.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleLabel(user.role)}</TableCell>
                    <TableCell>{user.employee_id || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? 'default' : 'secondary'}>
                        {user.is_active ? 'active' : 'inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handlePasswordChange(user)}>
                          Reset Password
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(user.id)}>
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingUser ? 'Edit User' : 'Add New User'}</CardTitle>
              <CardDescription>
                {editingUser ? 'Update user details and permissions' : 'Create a new user account'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Primary User Credentials - Most Important Fields */}
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">
                    👤 User Credentials
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-blue-800 dark:text-blue-200">
                        Username *
                      </label>
                      <Input
                        name="username"
                        value={formData.username || generateUsername()}
                        onChange={handleInputChange}
                        placeholder="Enter unique username"
                        required
                        className="font-medium"
                      />
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        This will be used for login
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-blue-800 dark:text-blue-200">
                          Password * {editingUser && '(leave empty to keep current)'}
                        </label>
                        <Input
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Enter secure password"
                          required={!editingUser}
                          className={`font-medium ${formData.password && !passwordValidation.length ? 'border-red-500' : ''}`}
                          minLength={6}
                        />
                        {formData.password && (
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs ${passwordValidation.length ? 'text-green-600' : 'text-red-600'}`}>
                                {passwordValidation.length ? '✓' : '✗'} At least 6 characters
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs ${passwordValidation.hasUpper ? 'text-green-600' : 'text-red-600'}`}>
                                {passwordValidation.hasUpper ? '✓' : '✗'} Uppercase letter
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs ${passwordValidation.hasLower ? 'text-green-600' : 'text-red-600'}`}>
                                {passwordValidation.hasLower ? '✓' : '✗'} Lowercase letter
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                                {passwordValidation.hasNumber ? '✓' : '✗'} Number
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-blue-800 dark:text-blue-200">
                          Confirm Password *
                        </label>
                        <Input
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm password"
                          required={!editingUser || formData.password}
                          className={`font-medium ${formData.confirmPassword && !passwordValidation.match ? 'border-red-500' : formData.confirmPassword && passwordValidation.match ? 'border-green-500' : ''}`}
                        />
                        {formData.confirmPassword && (
                          <div className="mt-2">
                            <span className={`text-xs ${passwordValidation.match ? 'text-green-600' : 'text-red-600'}`}>
                              {passwordValidation.match ? '✓ Passwords match' : '✗ Passwords do not match'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
                    📧 Contact Information
                  </h3>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="user@company.com"
                      required
                    />
                  </div>
                </div>

                {/* Role & Employee Information */}
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="text-lg font-semibold mb-3 text-green-900 dark:text-green-100">
                    🏢 Role & Employment Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-green-800 dark:text-green-200">
                        User Role *
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        required
                      >
                        {roles.map(role => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Determines access level
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-green-800 dark:text-green-200">
                        Employee ID
                      </label>
                      <Input
                        name="employee_id"
                        value={formData.employee_id}
                        onChange={handleInputChange}
                        placeholder="EMP001 (optional)"
                      />
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Link to employee record
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="text-lg font-semibold mb-3 text-orange-900 dark:text-orange-100">
                    ⚙️ Account Settings
                  </h3>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-orange-800 dark:text-orange-200">
                      Account Status
                    </label>
                    <select
                      name="is_active"
                      value={formData.is_active}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === 'true' }))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="true">🟢 Active - User can login</option>
                      <option value="false">🔴 Inactive - Login disabled</option>
                    </select>
                  </div>
                </div>
                
                {/* Permissions */}
                <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h3 className="text-lg font-semibold mb-3 text-purple-900 dark:text-purple-100">
                    🔐 System Permissions
                  </h3>
                  <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">
                    Select specific permissions for this user. Role-based permissions will also apply.
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {permissions.map(permission => (
                      <label key={permission} className="flex items-start space-x-2 p-2 hover:bg-purple-100 dark:hover:bg-purple-900 rounded">
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(permission)}
                          onChange={() => handlePermissionChange(permission)}
                          className="rounded border-gray-300 mt-1"
                        />
                        <div>
                          <span className="text-sm font-medium capitalize">
                            {permission.replace('_', ' ')}
                          </span>
                          <p className="text-xs text-purple-600 dark:text-purple-400">
                            {getPermissionDescription(permission)}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? 'Saving...' : (editingUser ? 'Update' : 'Create')} User
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingUser(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Password Reset Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Reset Password</CardTitle>
              <CardDescription>
                Reset password for user: {selectedUser?.username}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <Input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                    required
                    minLength={6}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                  <Input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? 'Updating...' : 'Reset Password'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsPasswordModalOpen(false);
                      setSelectedUser(null);
                      setPasswordData({ newPassword: '', confirmPassword: '' });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserManagement;