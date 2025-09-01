import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import axios from 'axios';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [paygrades, setPaygrades] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    emp_name: '',
    username: '',
    emp_email: '',
    emp_phone: '',
    department_id: '',
    designation: '',
    joining_date: '',
    ctc: '',
    gross_salary: '',
    company_name_id: '',
    branch_name_id: '',
    pay_grade_id: '',
    manager_id: '',
    emp_type: 'Employee'
  });

  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchEmployees(),
        fetchCompanies(),
        fetchBranches(),
        fetchDepartments(),
        fetchPaygrades(),
        fetchUsers()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${baseURL}employees`);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${baseURL}employees/companies/`);
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axios.get(`${baseURL}employees/branches`);
      setBranches(response.data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${baseURL}employees/departments`);
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchPaygrades = async () => {
    try {
      const response = await axios.get(`${baseURL}paygrade/`);
      setPaygrades(response.data);
    } catch (error) {
      console.error('Error fetching paygrades:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${baseURL}auth/users/`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check if username is already assigned to another employee (when creating or changing username)
      if (!editingEmployee || (editingEmployee && editingEmployee.username !== formData.username)) {
        const existingEmployee = employees.find(emp => emp.username === formData.username);
        if (existingEmployee) {
          alert('This user account is already assigned to another employee. Please select a different user account.');
          return;
        }
      }

      if (editingEmployee) {
        // Update existing employee
        const response = await axios.put(`${baseURL}employees/${editingEmployee.id}`, formData);
        setEmployees(employees.map(employee =>
          employee.id === editingEmployee.id ? response.data : employee
        ));
        setEditingEmployee(null);
      } else {
        // Create new employee
        const response = await axios.post(`${baseURL}employees`, formData);
        setEmployees([...employees, response.data]);
      }

      resetForm();
      setIsAddModalOpen(false);

      // Refresh users list to update available users
      await fetchUsers();
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Error saving employee. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      emp_name: '',
      username: '',
      emp_email: '',
      emp_phone: '',
      department_id: '',
      designation: '',
      joining_date: '',
      ctc: '',
      gross_salary: '',
      company_name_id: '',
      branch_name_id: '',
      pay_grade_id: '',
      manager_id: '',
      emp_type: 'Employee'
    });
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      emp_name: employee.emp_name || '',
      username: employee.username || '',
      emp_email: employee.emp_email || '',
      emp_phone: employee.emp_phone || '',
      department_id: employee.department_id || '',
      designation: employee.designation || '',
      joining_date: employee.joining_date || '',
      ctc: employee.ctc || '',
      gross_salary: employee.gross_salary || '',
      company_name_id: employee.company_name_id ? employee.company_name_id.toString() : '',
      branch_name_id: employee.branch_name_id ? employee.branch_name_id.toString() : '',
      pay_grade_id: employee.pay_grade_id ? employee.pay_grade_id.toString() : '',
      manager_id: employee.manager_id || '',
      emp_type: employee.emp_type || 'Employee'
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`${baseURL}employees/${id}`);
        setEmployees(employees.filter(employee => employee.id !== id));

        // Refresh users list to update available users
        await fetchUsers();
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Error deleting employee. Please try again.');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Reset branch when company changes
    if (name === 'company_name_id') {
      setFormData(prev => ({ ...prev, branch_name_id: '' }));
    }

    // Auto-populate CTC when paygrade changes (if CTC is empty)
    if (name === 'pay_grade_id' && value && !formData.ctc) {
      const selectedPaygrade = paygrades.find(pg => pg.id.toString() === value);
      if (selectedPaygrade && selectedPaygrade.min_gross_range) {
        const ctcValue = selectedPaygrade.min_gross_range * 12;
        setFormData(prev => ({
          ...prev,
          ctc: ctcValue.toString(),
          gross_salary: selectedPaygrade.min_gross_range.toString()
        }));
      }
    }

    // Auto-calculate gross salary when CTC changes
    if (name === 'ctc' && value) {
      const grossSalary = Math.round(parseFloat(value) / 12);
      setFormData(prev => ({ ...prev, gross_salary: grossSalary.toString() }));
    }
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id.toString() === companyId);
    return company ? company.company_name : 'N/A';
  };

  const getBranchName = (branchId) => {
    const branch = branches.find(b => b.id.toString() === branchId);
    return branch ? branch.branch_name : 'N/A';
  };

  const getDepartmentName = (deptId) => {
    const dept = departments.find(d => d.id.toString() === deptId);
    return dept ? dept.department_name : deptId || 'N/A';
  };

  const getPayGradeName = (payGradeId) => {
    const paygrade = paygrades.find(pg => pg.id.toString() === payGradeId);
    return paygrade ? `Grade ${paygrade.grade}` : 'N/A';
  };

  const getFilteredBranches = () => {
    return branches.filter(branch => branch.company_name_id && branch.company_name_id.toString() === formData.company_name_id);
  };

  const getAvailableUsers = () => {
    // Get usernames that are already assigned to employees
    const assignedUsernames = employees.map(emp => emp.username);

    // Filter out users that are already assigned (except when editing)
    return users.filter(user => {
      const isAssigned = assignedUsernames.includes(user.username);
      const isCurrentEmployee = editingEmployee && editingEmployee.username === user.username;
      return !isAssigned || isCurrentEmployee;
    });
  };

  const getManagerEmployees = () => {
    return employees.filter(emp => emp.emp_type === 'Manager');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Employee Management</h2>
          <p className="text-muted-foreground">Manage employee records and information</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          + Add Employee
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-8">
              <p>Loading employees...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>PayGrade</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No employees found. Add your first employee to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.username}</TableCell>
                      <TableCell>{employee.emp_name}</TableCell>
                      <TableCell>{employee.emp_email}</TableCell>
                      <TableCell>{getDepartmentName(employee.department_id)}</TableCell>
                      <TableCell>{employee.designation}</TableCell>
                      <TableCell>{getPayGradeName(employee.pay_grade_id)}</TableCell>
                      <TableCell>
                        <Badge variant={employee.emp_type === 'Admin' ? 'default' : 'secondary'}>
                          {employee.emp_type}
                        </Badge>
                      </TableCell>
                      <TableCell>{getCompanyName(employee.company_name_id)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(employee)}>
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(employee.id)}>
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</CardTitle>
              <CardDescription>
                {editingEmployee ? 'Update employee details' : 'Enter employee information to add to the system'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Select User Account</label>
                    <select
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="">Select a user account</option>
                      {getAvailableUsers().map(user => (
                        <option key={user.id} value={user.username}>
                          {user.username} {user.email ? `(${user.email})` : ''}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Only unassigned user accounts are shown
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <Input
                      name="emp_name"
                      value={formData.emp_name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input
                      name="emp_email"
                      type="email"
                      value={formData.emp_email}
                      onChange={handleInputChange}
                      placeholder="john.doe@company.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <Input
                      name="emp_phone"
                      value={formData.emp_phone}
                      onChange={handleInputChange}
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Department</label>
                    <select
                      name="department_id"
                      value={formData.department_id}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>
                          {dept.department_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Designation</label>
                    <Input
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      placeholder="Software Engineer"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Employee Type</label>
                    <select
                      name="emp_type"
                      value={formData.emp_type}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="Employee">Employee</option>
                      <option value="Manager">Manager</option>
                      <option value="Admin">Admin</option>
                      <option value="Asset Admin">Asset Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Joining Date</label>
                    <Input
                      name="joining_date"
                      type="date"
                      value={formData.joining_date}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Company</label>
                    <select
                      name="company_name_id"
                      value={formData.company_name_id}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="">Select Company</option>
                      {companies.map(company => (
                        <option key={company.id} value={company.id}>
                          {company.company_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Branch</label>
                    <select
                      name="branch_name_id"
                      value={formData.branch_name_id}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      disabled={!formData.company_name_id}
                      required
                    >
                      <option value="">Select Branch</option>
                      {getFilteredBranches().map(branch => (
                        <option key={branch.id} value={branch.id}>
                          {branch.branch_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">PayGrade *</label>
                    <select
                      name="pay_grade_id"
                      value={formData.pay_grade_id}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="">Select PayGrade</option>
                      {paygrades.map(paygrade => (
                        <option key={paygrade.id} value={paygrade.id}>
                          Grade {paygrade.grade} ({paygrade.min_gross_range?.toLocaleString()} - {paygrade.max_gross_range?.toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">CTC (Annual)</label>
                    <Input
                      name="ctc"
                      type="number"
                      value={formData.ctc}
                      onChange={handleInputChange}
                      placeholder="600000"
                    />
                    {/* <p className="text-xs text-muted-foreground mt-1">
                      Gross salary will be calculated as CTC/12
                    </p> */}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Manager (Optional)</label>
                    <select
                      name="manager_id"
                      value={formData.manager_id}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select Manager</option>
                      {getManagerEmployees().map(manager => (
                        <option key={manager.id} value={manager.id}>
                          {manager.emp_name} - {manager.username}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingEmployee ? 'Update' : 'Add'} Employee
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingEmployee(null);
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
    </div>
  );
};

export default EmployeeManagement;