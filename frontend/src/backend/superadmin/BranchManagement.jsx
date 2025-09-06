import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import axios from 'axios';

const BranchManagement = () => {
  const [branches, setBranches] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [formData, setFormData] = useState({
    company_name_id: '',
    branch_name: '',
    branch_address: '',
    longitude: '',
    latitude: ''
  });

  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchBranches(),
        fetchCompanies()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axios.get(`${baseURL}branches`);
      setBranches(response.data);
    } catch (error) {
      console.error('Error fetching branches:', error);
      alert('Error fetching branches. Please try again.');
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${baseURL}companies`);
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
      alert('Error fetching companies. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingBranch) {
        // Update existing branch
        const response = await axios.put(`${baseURL}branches/${editingBranch.id}`, formData);
        setBranches(branches.map(branch => 
          branch.id === editingBranch.id ? response.data.branch : branch
        ));
        setEditingBranch(null);
      } else {
        // Create new branch
        const response = await axios.post(`${baseURL}branches`, formData);
        setBranches([...branches, response.data.branch]);
      }
      
      resetForm();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error saving branch:', error);
      if (error.response?.data?.detail) {
        alert(error.response.data.detail);
      } else {
        alert('Error saving branch. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      company_name_id: '',
      branch_name: '',
      branch_address: '',
      longitude: '',
      latitude: ''
    });
  };

  const handleEdit = (branch) => {
    setEditingBranch(branch);
    setFormData({
      company_name_id: branch.company_name_id || '',
      branch_name: branch.branch_name || '',
      branch_address: branch.branch_address || '',
      longitude: branch.longitude || '',
      latitude: branch.latitude || ''
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        await axios.delete(`${baseURL}branches/${id}`);
        setBranches(branches.filter(branch => branch.id !== id));
      } catch (error) {
        console.error('Error deleting branch:', error);
        if (error.response?.data?.detail) {
          alert(error.response.data.detail);
        } else {
          alert('Error deleting branch. Please try again.');
        }
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id.toString() === companyId);
    return company ? company.company_name : 'N/A';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Branch Management</h2>
          <p className="text-muted-foreground">Manage company branches and locations</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          + Add Branch
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-8">
              <p>Loading branches...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Branch Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No branches found. Add your first branch to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  branches.map((branch) => (
                    <TableRow key={branch.id}>
                      <TableCell className="font-medium">{branch.branch_name}</TableCell>
                      <TableCell>{getCompanyName(branch.company_name_id)}</TableCell>
                      <TableCell>{branch.branch_address || 'N/A'}</TableCell>
                      <TableCell>
                        {branch.latitude && branch.longitude ? 
                          `${branch.latitude}, ${branch.longitude}` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(branch)}>
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(branch.id)}>
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
              <CardTitle>{editingBranch ? 'Edit Branch' : 'Add New Branch'}</CardTitle>
              <CardDescription>
                {editingBranch ? 'Update branch details' : 'Enter branch information to add to the system'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Company *</label>
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
                  <label className="block text-sm font-medium mb-1">Branch Name *</label>
                  <Input
                    name="branch_name"
                    value={formData.branch_name}
                    onChange={handleInputChange}
                    placeholder="Enter branch name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Branch Address</label>
                  <Input
                    name="branch_address"
                    value={formData.branch_address}
                    onChange={handleInputChange}
                    placeholder="Branch address"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Longitude</label>
                    <Input
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      placeholder="Longitude (e.g., -74.0060)"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Latitude</label>
                    <Input
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      placeholder="Latitude (e.g., 40.7128)"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingBranch ? 'Update' : 'Add'} Branch
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingBranch(null);
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

export default BranchManagement;