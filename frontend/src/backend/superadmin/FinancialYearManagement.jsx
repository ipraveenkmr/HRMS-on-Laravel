import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import axios from 'axios';

const FinancialYearManagement = () => {
  const [financialYears, setFinancialYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFinancialYear, setEditingFinancialYear] = useState(null);
  const [formData, setFormData] = useState({
    year: '',
    working_hours: 8.5,
    loan_interest_rate: 7.5,
    login_time: '',
    logout_time: ''
  });

  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchFinancialYears();
  }, []);

  const fetchFinancialYears = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}financial-years`);
      setFinancialYears(response.data);
    } catch (error) {
      console.error('Error fetching financial years:', error);
      alert('Error fetching financial years. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingFinancialYear) {
        // Update existing financial year
        const response = await axios.put(`${baseURL}financial-years/${editingFinancialYear.id}`, formData);
        setFinancialYears(financialYears.map(fy => 
          fy.id === editingFinancialYear.id ? response.data : fy
        ));
        setEditingFinancialYear(null);
      } else {
        // Create new financial year
        const response = await axios.post(`${baseURL}financial-years`, formData);
        setFinancialYears([...financialYears, response.data]);
      }
      
      resetForm();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error saving financial year:', error);
      if (error.response?.data?.detail) {
        alert(error.response.data.detail);
      } else {
        alert('Error saving financial year. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      year: '',
      working_hours: 8.5,
      loan_interest_rate: 7.5,
      login_time: '',
      logout_time: ''
    });
  };

  const handleEdit = (financialYear) => {
    setEditingFinancialYear(financialYear);
    setFormData({
      year: financialYear.year || '',
      working_hours: financialYear.working_hours || 8.5,
      loan_interest_rate: financialYear.loan_interest_rate || 7.5,
      login_time: financialYear.login_time || '',
      logout_time: financialYear.logout_time || ''
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this financial year?')) {
      try {
        await axios.delete(`${baseURL}financial-years/${id}`);
        setFinancialYears(financialYears.filter(fy => fy.id !== id));
      } catch (error) {
        console.error('Error deleting financial year:', error);
        alert('Error deleting financial year. Please try again.');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? parseFloat(value) || 0 : value 
    }));
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Financial Year Management</h2>
          <p className="text-muted-foreground">Manage financial years and accounting periods</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          + Add Financial Year
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-8">
              <p>Loading financial years...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead>Working Hours</TableHead>
                  <TableHead>Loan Interest Rate (%)</TableHead>
                  <TableHead>Login Time</TableHead>
                  <TableHead>Logout Time</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financialYears.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No financial years found. Add your first financial year to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  financialYears.map((financialYear) => (
                    <TableRow key={financialYear.id}>
                      <TableCell className="font-medium">{financialYear.year}</TableCell>
                      <TableCell>{financialYear.working_hours} hrs</TableCell>
                      <TableCell>{financialYear.loan_interest_rate}%</TableCell>
                      <TableCell>{financialYear.login_time || 'Not set'}</TableCell>
                      <TableCell>{financialYear.logout_time || 'Not set'}</TableCell>
                      <TableCell>{formatDateTime(financialYear.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(financialYear)}>
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(financialYear.id)}>
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
          <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingFinancialYear ? 'Edit Financial Year' : 'Add New Financial Year'}</CardTitle>
              <CardDescription>
                {editingFinancialYear ? 'Update financial year details' : 'Enter financial year information'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Year *</label>
                  <Input
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="2024-25"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Working Hours per Day</label>
                  <Input
                    name="working_hours"
                    type="number"
                    step="0.1"
                    min="0"
                    max="24"
                    value={formData.working_hours}
                    onChange={handleInputChange}
                    placeholder="8.5"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Loan Interest Rate (%)</label>
                  <Input
                    name="loan_interest_rate"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.loan_interest_rate}
                    onChange={handleInputChange}
                    placeholder="7.5"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Default Login Time</label>
                  <Input
                    name="login_time"
                    type="time"
                    value={formData.login_time}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Default Logout Time</label>
                  <Input
                    name="logout_time"
                    type="time"
                    value={formData.logout_time}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingFinancialYear ? 'Update' : 'Add'} Financial Year
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingFinancialYear(null);
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

export default FinancialYearManagement;