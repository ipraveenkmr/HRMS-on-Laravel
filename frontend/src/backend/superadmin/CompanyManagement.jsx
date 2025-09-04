import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import axios from 'axios';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    company_address: '',
    support_email: '',
    longitude: '',
    latitude: '',
    cloudinary_email: '',
    cloudinary_preset: '',
    cloudinary_api: '',
    status: 'Active',
    logo: ''
  });

  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}companies/companies`);
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
      alert('Error fetching companies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setUploading(true);
      let logoPath = formData.logo;
      
      // Upload logo if a file is selected
      if (selectedFile) {
        const logoFormData = new FormData();
        logoFormData.append('file', selectedFile);
        
        const uploadResponse = await axios.post(`${baseURL}companies/upload-logo`, logoFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        logoPath = uploadResponse.data.file_path;
      }
      
      const companyData = {
        ...formData,
        logo: logoPath
      };
      
      if (editingCompany) {
        // Update existing company
        const response = await axios.put(`${baseURL}companies/companies/${editingCompany.id}`, companyData);
        setCompanies(companies.map(company => 
          company.id === editingCompany.id ? response.data : company
        ));
        setEditingCompany(null);
      } else {
        // Create new company
        const response = await axios.post(`${baseURL}companies/companies`, companyData);
        setCompanies([...companies, response.data]);
      }
      
      resetForm();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error saving company:', error);
      if (error.response?.data?.detail) {
        alert(error.response.data.detail);
      } else {
        alert('Error saving company. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      company_name: '',
      company_address: '',
      support_email: '',
      longitude: '',
      latitude: '',
      cloudinary_email: '',
      cloudinary_preset: '',
      cloudinary_api: '',
      status: 'Active',
      logo: ''
    });
    setSelectedFile(null);
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setFormData({
      company_name: company.company_name || '',
      company_address: company.company_address || '',
      support_email: company.support_email || '',
      longitude: company.longitude || '',
      latitude: company.latitude || '',
      cloudinary_email: company.cloudinary_email || '',
      cloudinary_preset: company.cloudinary_preset || '',
      cloudinary_api: company.cloudinary_api || '',
      status: company.status || 'Active',
      logo: company.logo || ''
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await axios.delete(`${baseURL}companies/companies/${id}`);
        setCompanies(companies.filter(company => company.id !== id));
      } catch (error) {
        console.error('Error deleting company:', error);
        if (error.response?.data?.detail) {
          alert(error.response.data.detail);
        } else {
          alert('Error deleting company. Please try again.');
        }
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    } else {
      alert('Please select a valid image file.');
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Company Management</h2>
          <p className="text-muted-foreground">Manage companies in your system</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          + Add Company
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-8">
              <p>Loading companies...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Support Email</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No companies found. Add your first company to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        {company.logo ? (
                          <img 
                            src={company.logo.startsWith('http') ? company.logo : `${baseURL.replace('/api/', '')}${company.logo}`} 
                            alt={`${company.company_name} logo`}
                            className="w-12 h-12 object-contain rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                            No Logo
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{company.company_name}</TableCell>
                      <TableCell>{company.support_email || 'N/A'}</TableCell>
                      <TableCell>{company.company_address || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={company.status === 'Active' ? 'default' : 'secondary'}>
                          {company.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(company)}>
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(company.id)}>
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
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>{editingCompany ? 'Edit Company' : 'Add New Company'}</CardTitle>
              <CardDescription>
                {editingCompany ? 'Update company details' : 'Enter company information to add to the system'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium mb-1">Company Logo</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mb-2"
                  />
                  {selectedFile && (
                    <div className="mt-2">
                      <img 
                        src={URL.createObjectURL(selectedFile)} 
                        alt="Logo preview" 
                        className="w-16 h-16 object-contain rounded border"
                      />
                      <p className="text-sm text-gray-600 mt-1">{selectedFile.name}</p>
                    </div>
                  )}
                  {!selectedFile && formData.logo && (
                    <div className="mt-2">
                      <img 
                        src={formData.logo.startsWith('http') ? formData.logo : `${baseURL.replace('/api/', '')}${formData.logo}`} 
                        alt="Current logo" 
                        className="w-16 h-16 object-contain rounded border"
                      />
                      <p className="text-sm text-gray-600 mt-1">Current logo</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Company Name *</label>
                  <Input
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Support Email</label>
                  <Input
                    name="support_email"
                    type="email"
                    value={formData.support_email}
                    onChange={handleInputChange}
                    placeholder="support@company.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Company Address</label>
                  <Input
                    name="company_address"
                    value={formData.company_address}
                    onChange={handleInputChange}
                    placeholder="Company address"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Longitude</label>
                    <Input
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      placeholder="Longitude"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Latitude</label>
                    <Input
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      placeholder="Latitude"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Cloudinary Email</label>
                  <Input
                    name="cloudinary_email"
                    type="email"
                    value={formData.cloudinary_email}
                    onChange={handleInputChange}
                    placeholder="cloudinary@company.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Cloudinary Preset</label>
                  <Input
                    name="cloudinary_preset"
                    value={formData.cloudinary_preset}
                    onChange={handleInputChange}
                    placeholder="Cloudinary preset"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Cloudinary API Key</label>
                  <Input
                    name="cloudinary_api"
                    value={formData.cloudinary_api}
                    onChange={handleInputChange}
                    placeholder="Cloudinary API key"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1" disabled={uploading}>
                    {uploading ? 'Uploading...' : (editingCompany ? 'Update' : 'Add')} Company
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingCompany(null);
                      resetForm();
                    }}
                    disabled={uploading}
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

export default CompanyManagement;