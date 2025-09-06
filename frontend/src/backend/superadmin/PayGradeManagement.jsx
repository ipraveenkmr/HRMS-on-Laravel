import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import axios from 'axios';

const PayGradeManagement = () => {
  const [paygrades, setPaygrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPaygrade, setEditingPaygrade] = useState(null);
  const [formData, setFormData] = useState({
    grade: '',
    min_gross_range: '',
    max_gross_range: '',
    basic: '',
    hra: '',
    ta: '',
    com: '',
    medical: '',
    edu: '',
    sa: '',
    income_tax: ''
  });

  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchPaygrades();
  }, []);

  const fetchPaygrades = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}paygrade`);
      setPaygrades(response.data);
    } catch (error) {
      console.error('Error fetching paygrades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convert string values to numbers
      const paygradeData = {
        ...formData,
        grade: parseInt(formData.grade),
        min_gross_range: parseInt(formData.min_gross_range) || 0,
        max_gross_range: parseInt(formData.max_gross_range) || 0,
        basic: parseFloat(formData.basic) || 0,
        hra: parseFloat(formData.hra) || 0,
        ta: parseFloat(formData.ta) || 0,
        com: parseFloat(formData.com) || 0,
        medical: parseFloat(formData.medical) || 0,
        edu: parseFloat(formData.edu) || 0,
        sa: parseFloat(formData.sa) || 0,
        income_tax: parseFloat(formData.income_tax) || 0
      };

      if (editingPaygrade) {
        // Update existing paygrade
        const response = await axios.put(`${baseURL}paygrade/${editingPaygrade.id}`, paygradeData);
        setPaygrades(paygrades.map(paygrade =>
          paygrade.id === editingPaygrade.id ? response.data : paygrade
        ));
        setEditingPaygrade(null);
      } else {
        // Create new paygrade
        const response = await axios.post(`${baseURL}paygrade`, paygradeData);
        setPaygrades([...paygrades, response.data]);
      }

      resetForm();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error saving paygrade:', error);
      if (error.response?.data?.detail) {
        alert(`Error: ${error.response.data.detail}`);
      } else {
        alert('Error saving paygrade. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      grade: '',
      min_gross_range: '',
      max_gross_range: '',
      basic: '',
      hra: '',
      ta: '',
      com: '',
      medical: '',
      edu: '',
      sa: '',
      income_tax: ''
    });
  };

  const handleEdit = (paygrade) => {
    setEditingPaygrade(paygrade);
    setFormData({
      grade: paygrade.grade || '',
      min_gross_range: paygrade.min_gross_range || '',
      max_gross_range: paygrade.max_gross_range || '',
      basic: paygrade.basic || '',
      hra: paygrade.hra || '',
      ta: paygrade.ta || '',
      com: paygrade.com || '',
      medical: paygrade.medical || '',
      edu: paygrade.edu || '',
      sa: paygrade.sa || '',
      income_tax: paygrade.income_tax || ''
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this paygrade?')) {
      try {
        await axios.delete(`${baseURL}paygrade/${id}`);
        setPaygrades(paygrades.filter(paygrade => paygrade.id !== id));
      } catch (error) {
        console.error('Error deleting paygrade:', error);
        alert('Error deleting paygrade. Please try again.');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">PayGrade Management</h2>
          <p className="text-muted-foreground">Manage salary pay grades and compensation structures</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          + Add PayGrade
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-8">
              <p>Loading paygrades...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Grade</TableHead>
                  <TableHead>Salary Range</TableHead>
                  <TableHead>Basic</TableHead>
                  <TableHead>HRA</TableHead>
                  <TableHead>TA</TableHead>
                  <TableHead>Medical</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paygrades.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No paygrades found. Add your first paygrade to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  paygrades.map((paygrade) => (
                    <TableRow key={paygrade.id}>
                      <TableCell className="font-medium">Grade {paygrade.grade}</TableCell>
                      <TableCell>
                        {formatCurrency(paygrade.min_gross_range)} - {formatCurrency(paygrade.max_gross_range)}
                      </TableCell>
                      <TableCell>{paygrade.basic} %</TableCell>
                      <TableCell>{paygrade.hra} %</TableCell>
                      <TableCell>{paygrade.ta} %</TableCell>
                      <TableCell>{paygrade.medical} %</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(paygrade)}>
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(paygrade.id)}>
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
          <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingPaygrade ? 'Edit PayGrade' : 'Add New PayGrade'}</CardTitle>
              <CardDescription>
                {editingPaygrade ? 'Update paygrade details' : 'Enter paygrade information to add to the system'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Grade *</label>
                    <Input
                      name="grade"
                      type="number"
                      value={formData.grade}
                      onChange={handleInputChange}
                      placeholder="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Income Tax</label>
                    <Input
                      name="income_tax"
                      type="number"
                      value={formData.income_tax}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Min Gross Range</label>
                    <Input
                      name="min_gross_range"
                      type="number"
                      value={formData.min_gross_range}
                      onChange={handleInputChange}
                      placeholder="25000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Max Gross Range</label>
                    <Input
                      name="max_gross_range"
                      type="number"
                      value={formData.max_gross_range}
                      onChange={handleInputChange}
                      placeholder="50000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Basic Salary</label>
                    <Input
                      name="basic"
                      type="number"
                      value={formData.basic}
                      onChange={handleInputChange}
                      placeholder="20000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">HRA</label>
                    <Input
                      name="hra"
                      type="number"
                      value={formData.hra}
                      onChange={handleInputChange}
                      placeholder="8000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Transport Allowance</label>
                    <Input
                      name="ta"
                      type="number"
                      value={formData.ta}
                      onChange={handleInputChange}
                      placeholder="2000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Communication</label>
                    <Input
                      name="com"
                      type="number"
                      value={formData.com}
                      onChange={handleInputChange}
                      placeholder="1000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Medical Allowance</label>
                    <Input
                      name="medical"
                      type="number"
                      value={formData.medical}
                      onChange={handleInputChange}
                      placeholder="5000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Education Allowance</label>
                    <Input
                      name="edu"
                      type="number"
                      value={formData.edu}
                      onChange={handleInputChange}
                      placeholder="2000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Special Allowance</label>
                    <Input
                      name="sa"
                      type="number"
                      value={formData.sa}
                      onChange={handleInputChange}
                      placeholder="3000"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingPaygrade ? 'Update' : 'Add'} PayGrade
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingPaygrade(null);
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

export default PayGradeManagement;