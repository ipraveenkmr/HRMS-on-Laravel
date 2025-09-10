import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import axios from 'axios';

const AssetCategoryManagement = () => {
  const [assetCategories, setAssetCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    description: ''
  });

  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchAssetCategories();
  }, []);

  const fetchAssetCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}asset-categories`);
      setAssetCategories(response.data);
    } catch (error) {
      console.error('Error fetching asset categories:', error);
      alert('Error fetching asset categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        // Update existing category
        const response = await axios.put(`${baseURL}asset-categories/${editingCategory.id}`, formData);
        setAssetCategories(assetCategories.map(category => 
          category.id === editingCategory.id ? response.data?.category : category
        ));
        setEditingCategory(null);
      } else {
        // Create new category
        const response = await axios.post(`${baseURL}asset-categories`, formData);
        setAssetCategories([...assetCategories, response.data?.category]);
      }
      
      resetForm();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error saving asset category:', error);
      if (error.response?.data?.detail) {
        alert(error.response.data.detail);
      } else {
        alert('Error saving asset category. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      category: '',
      description: ''
    });
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      category: category.category || '',
      description: category.description || ''
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this asset category? This will fail if any assets are using this category.')) {
      try {
        await axios.delete(`${baseURL}asset-categories/${id}`);
        setAssetCategories(assetCategories.filter(category => category.id !== id));
      } catch (error) {
        console.error('Error deleting asset category:', error);
        if (error.response?.data?.detail) {
          alert(error.response.data.detail);
        } else {
          alert('Error deleting asset category. Please try again.');
        }
      }
    }
  };

  const handleViewAssets = async (categoryId) => {
    try {
      const response = await axios.get(`${baseURL}asset-categories/${categoryId}/assets`);
      const assets = response.data;
      if (assets.length === 0) {
        alert('No assets found in this category.');
      } else {
        alert(`Found ${assets.length} asset(s) in this category:\n\n${assets.map(asset => `• ${asset.asset_name || 'Unnamed Asset'}`).join('\n')}`);
      }
    } catch (error) {
      console.error('Error fetching assets for category:', error);
      alert('Error fetching assets for this category.');
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
          <h2 className="text-2xl font-bold">Asset Category Management</h2>
          <p className="text-muted-foreground">Manage asset categories and classifications</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          + Add Asset Category
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-8">
              <p>Loading asset categories...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assetCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No asset categories found. Add your first asset category to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  assetCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.category}</TableCell>
                      <TableCell>{category.description || 'No description'}</TableCell>
                      <TableCell>{formatDateTime(category.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {/* <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewAssets(category.id)}
                            title="View assets in this category"
                          >
                            View Assets
                          </Button> */}
                          <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(category.id)}>
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
              <CardTitle>{editingCategory ? 'Edit Asset Category' : 'Add New Asset Category'}</CardTitle>
              <CardDescription>
                {editingCategory ? 'Update asset category details' : 'Enter asset category information'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category Name *</label>
                  <Input
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g. Laptops, Furniture, Vehicles"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Input
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Optional description of the category"
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingCategory ? 'Update' : 'Add'} Category
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingCategory(null);
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

export default AssetCategoryManagement;