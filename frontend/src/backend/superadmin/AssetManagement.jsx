import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import axios from 'axios';

const AssetManagement = () => {
  const [assets, setAssets] = useState([]);
  const [assetCategories, setAssetCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [formData, setFormData] = useState({
    asset_name: '',
    asset_category_id: '',
    manufacturer: '',
    model_number: '',
    serial_number: '',
    purchasing_date: '',
    purchasing_value: '',
    active_service_date: '',
    support_link: '',
    description: ''
  });

  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchAssetCategories();
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}assets`);
      setAssets(response.data);
    } catch (error) {
      console.error('Error fetching assets:', error);
      alert('Error fetching assets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssetCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await axios.get(`${baseURL}asset-categories`);
      setAssetCategories(response.data);
    } catch (error) {
      console.error('Error fetching asset categories:', error);
      // Fallback to default categories if API fails
      setAssetCategories([
        { id: 1, category: 'Laptop' },
        { id: 2, category: 'Desktop' },
        { id: 3, category: 'Mobile Phone' },
        { id: 4, category: 'Tablet' },
        { id: 5, category: 'Printer' },
        { id: 6, category: 'Other' }
      ]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Convert category name back to category_id
      const selectedCategory = assetCategories.find(cat => cat.category === formData.asset_category_id);
      if (!selectedCategory) {
        alert('Please select a valid asset category');
        return;
      }

      const submitData = {
        ...formData,
        asset_category_id: selectedCategory.id
      };

      if (editingAsset) {
        // Update existing asset
        const response = await axios.put(`${baseURL}assets/${editingAsset.id}`, submitData);
        setAssets(assets.map(asset => 
          asset.id === editingAsset.id ? response.data.asset : asset
        ));
        setEditingAsset(null);
      } else {
        // Create new asset
        const response = await axios.post(`${baseURL}assets`, submitData);
        setAssets([...assets, response.data.asset]);
      }
      
      resetForm();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error saving asset:', error);
      if (error.response?.data?.detail) {
        alert(error.response.data.detail);
      } else {
        alert('Error saving asset. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      asset_name: '',
      asset_category_id: '',
      manufacturer: '',
      model_number: '',
      serial_number: '',
      purchasing_date: '',
      purchasing_value: '',
      active_service_date: '',
      support_link: '',
      description: ''
    });
  };

  const handleEdit = (asset) => {
    setEditingAsset(asset);
    // Find category name from category_id
    const category = assetCategories.find(cat => cat.id === asset.asset_category_id);
    setFormData({
      asset_name: asset.asset_name || '',
      asset_category_id: category ? category.category : '',
      manufacturer: asset.manufacturer || '',
      model_number: asset.model_number || '',
      serial_number: asset.serial_number || '',
      purchasing_date: asset.purchasing_date || '',
      purchasing_value: asset.purchasing_value || '',
      active_service_date: asset.active_service_date || '',
      support_link: asset.support_link || '',
      description: asset.description || ''
    });
    setIsAddModalOpen(true);
    fetchAssetCategories(); // Refresh categories when editing
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await axios.delete(`${baseURL}assets/${id}`);
        setAssets(assets.filter(asset => asset.id !== id));
      } catch (error) {
        console.error('Error deleting asset:', error);
        if (error.response?.data?.detail) {
          alert(error.response.data.detail);
        } else {
          alert('Error deleting asset. Please try again.');
        }
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Asset Management</h2>
          <p className="text-muted-foreground">Manage company assets and equipment</p>
        </div>
        <Button onClick={() => {
          setIsAddModalOpen(true);
          fetchAssetCategories(); // Refresh categories when opening modal
        }}>
          + Add Asset
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-8">
              <p>Loading assets...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Purchase Date</TableHead>
                  <TableHead>Purchase Value</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No assets found. Add your first asset to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  assets.map((asset) => {
                    const category = assetCategories.find(cat => cat.id === asset.asset_category_id);
                    return (
                      <TableRow key={asset.id}>
                        <TableCell className="font-medium">{asset.asset_name || 'Unnamed Asset'}</TableCell>
                        <TableCell>{category ? category.category : 'Unknown Category'}</TableCell>
                        <TableCell>{asset.manufacturer || '-'}</TableCell>
                        <TableCell>{asset.serial_number || '-'}</TableCell>
                        <TableCell>{asset.purchasing_date || '-'}</TableCell>
                        <TableCell>{asset.purchasing_value ? `$${asset.purchasing_value}` : '-'}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(asset)}>
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(asset.id)}>
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
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
              <CardTitle>{editingAsset ? 'Edit Asset' : 'Add New Asset'}</CardTitle>
              <CardDescription>
                {editingAsset ? 'Update asset details' : 'Enter asset information to add to the system'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Asset Name *</label>
                    <Input
                      name="asset_name"
                      value={formData.asset_name}
                      onChange={handleInputChange}
                      placeholder="Enter asset name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Category *</label>
                    <select
                      name="asset_category_id"
                      value={formData.asset_category_id}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                      disabled={categoriesLoading}
                    >
                      <option value="">
                        {categoriesLoading ? 'Loading categories...' : 'Select Category'}
                      </option>
                      {assetCategories.map(category => (
                        <option key={category.id} value={category.category}>
                          {category.category}
                        </option>
                      ))}
                    </select>
                    {assetCategories.length === 0 && !categoriesLoading && (
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground">
                          No categories available. Please create categories in Asset Category Management.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={fetchAssetCategories}
                          className="text-xs px-2 py-1 h-6"
                        >
                          Refresh
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Manufacturer</label>
                    <Input
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleInputChange}
                      placeholder="Manufacturer name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Model Number</label>
                    <Input
                      name="model_number"
                      value={formData.model_number}
                      onChange={handleInputChange}
                      placeholder="Model number"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Serial Number</label>
                    <Input
                      name="serial_number"
                      value={formData.serial_number}
                      onChange={handleInputChange}
                      placeholder="Serial number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Support Link</label>
                    <Input
                      name="support_link"
                      value={formData.support_link}
                      onChange={handleInputChange}
                      placeholder="Support/documentation link"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Purchase Date</label>
                    <Input
                      name="purchasing_date"
                      type="date"
                      value={formData.purchasing_date}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Purchase Value</label>
                    <Input
                      name="purchasing_value"
                      type="number"
                      step="0.01"
                      value={formData.purchasing_value}
                      onChange={handleInputChange}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Active Service Date</label>
                    <Input
                      name="active_service_date"
                      type="date"
                      value={formData.active_service_date}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Input
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Asset description"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingAsset ? 'Update' : 'Add'} Asset
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingAsset(null);
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

export default AssetManagement;