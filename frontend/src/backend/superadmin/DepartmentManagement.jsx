import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import axios from 'axios';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departmentStats, setDepartmentStats] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({
    department_name: ''
  });

  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}departments`);
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      alert('Error fetching departments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingDepartment) {
        // Update existing department
        const response = await axios.put(`${baseURL}departments/${editingDepartment.id}`, formData);
        setDepartments(departments.map(dept => 
          dept.id === editingDepartment.id ? response.data : dept
        ));
        setEditingDepartment(null);
      } else {
        // Create new department
        const response = await axios.post(`${baseURL}departments`, formData);
        setDepartments([...departments, response.data]);
      }
      
      resetForm();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error saving department:', error);
      if (error.response?.data?.detail) {
        alert(error.response.data.detail);
      } else {
        alert('Error saving department. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      department_name: ''
    });
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setFormData({
      department_name: department.department_name || ''
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await axios.delete(`${baseURL}departments/${id}`);
        setDepartments(departments.filter(dept => dept.id !== id));
      } catch (error) {
        console.error('Error deleting department:', error);
        if (error.response?.data?.detail) {
          alert(error.response.data.detail);
        } else {
          alert('Error deleting department. Please try again.');
        }
      }
    }
  };

  const handleViewStats = async (department) => {
    try {
      setSelectedDepartment(department);
      const response = await axios.get(`${baseURL}departments/${department.id}/stats`);
      setDepartmentStats(response.data);
      setIsStatsModalOpen(true);
    } catch (error) {
      console.error('Error fetching department stats:', error);
      alert('Error fetching department statistics. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Department Management</h2>
          <p className="text-muted-foreground">Manage departments in your organization</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          + Add Department
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-8">
              <p>Loading departments...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department Name</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      No departments found. Add your first department to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  departments.map((department) => (
                    <TableRow key={department.id}>
                      <TableCell className="font-medium">{department.department_name}</TableCell>
                      <TableCell>{formatDate(department.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewStats(department)}>
                            Stats
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(department)}>
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(department.id)}>
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

      {/* Add/Edit Department Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>{editingDepartment ? 'Edit Department' : 'Add New Department'}</CardTitle>
              <CardDescription>
                {editingDepartment ? 'Update department details' : 'Enter department information to add to the system'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Department Name *</label>
                  <Input
                    name="department_name"
                    value={formData.department_name}
                    onChange={handleInputChange}
                    placeholder="Enter department name"
                    required
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingDepartment ? 'Update' : 'Add'} Department
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingDepartment(null);
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

      {/* Department Statistics Modal */}
      {isStatsModalOpen && departmentStats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle>Department Statistics</CardTitle>
              <CardDescription>
                Statistics for {selectedDepartment?.department_name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{departmentStats.total_employees}</div>
                  <div className="text-sm text-blue-800">Total Employees</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{departmentStats.active_employees}</div>
                  <div className="text-sm text-green-800">Active Employees</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Employee Types Breakdown</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-purple-50 rounded">
                    <div className="text-xl font-bold text-purple-600">{departmentStats.employee_types.admins}</div>
                    <div className="text-sm text-purple-800">Admins</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded">
                    <div className="text-xl font-bold text-yellow-600">{departmentStats.employee_types.managers}</div>
                    <div className="text-sm text-yellow-800">Managers</div>
                  </div>
                  <div className="text-center p-3 bg-cyan-50 rounded">
                    <div className="text-xl font-bold text-cyan-600">{departmentStats.employee_types.employees}</div>
                    <div className="text-sm text-cyan-800">Employees</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  <p><strong>Department ID:</strong> {departmentStats.department_id}</p>
                  <p><strong>Created:</strong> {formatDate(departmentStats.created_at)}</p>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsStatsModalOpen(false);
                    setDepartmentStats(null);
                    setSelectedDepartment(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;