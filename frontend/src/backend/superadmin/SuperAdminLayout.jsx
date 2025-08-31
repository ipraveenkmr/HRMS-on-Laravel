import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const SuperAdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'companies', label: 'Companies', icon: '🏢', path: '/superadmin/companies' },
    { id: 'branches', label: 'Branches', icon: '🏪', path: '/superadmin/branches' },
    { id: 'departments', label: 'Departments', icon: '🏛️', path: '/superadmin/departments' },
    { id: 'assets', label: 'Assets', icon: '📱', path: '/superadmin/assets' },
    { id: 'asset-categories', label: 'Asset Categories', icon: '📂', path: '/superadmin/asset-categories' },
    { id: 'paygrade', label: 'PayGrade', icon: '💰', path: '/superadmin/paygrade' },
    { id: 'financial-years', label: 'Financial Years', icon: '📅', path: '/superadmin/financial-years' },
    { id: 'employees', label: 'Employees', icon: '👥', path: '/superadmin/employees' },
    { id: 'users', label: 'User Management', icon: '🔐', path: '/superadmin/users' },
  ];

  const getCurrentTab = () => {
    const currentPath = location.pathname;
    const tab = tabs.find(tab => tab.path === currentPath);
    return tab ? tab.id : 'companies';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Super Admin Panel</h1>
          <p className="text-muted-foreground mt-2">Manage companies, branches, assets, and system configurations</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 lg:min-w-64">
            <Card className="sticky top-4">
              <CardContent className="p-0">
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-lg">Navigation</h3>
                  <p className="text-sm text-muted-foreground">Super Admin Controls</p>
                </div>
                <nav className="p-2">
                  {tabs.map((tab) => (
                    <Button
                      key={tab.id}
                      variant={getCurrentTab() === tab.id ? 'default' : 'ghost'}
                      className={`w-full justify-start text-left h-auto py-3 px-3 mb-1 ${
                        getCurrentTab() === tab.id 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => navigate(tab.path)}
                    >
                      <div className="flex items-center w-full text-left">
                        <span className="text-lg mr-3 flex-shrink-0">{tab.icon}</span>
                        <span className="text-sm font-medium text-left flex-1">{tab.label}</span>
                      </div>
                    </Button>
                  ))}
                </nav>
                <div className="p-2 border-t">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 px-3 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => navigate('/backend')}
                  >
                    <div className="flex items-center w-full text-left">
                      <span className="text-lg mr-3 flex-shrink-0">⚙️</span>
                      <span className="text-sm font-medium text-left flex-1">Admin</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLayout;