import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Check as ApproveIcon,
  Close as RejectIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import axios from 'axios';
import AddEditForm from './AddEditForm';
import travelExpenseService from '../../services/travelExpenseService';

const TravelExpenseList = ({ 
  currentUser, 
  isAdmin = false, 
  isManager = false, 
  employeeView = false 
}) => {
  const [expenses, setExpenses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [searchText, setSearchText] = useState('');
  
  // Summary stats
  const [summary, setSummary] = useState({
    total_expenses: 0,
    pending_expenses: 0,
    approved_expenses: 0,
    rejected_expenses: 0,
    total_approved_amount: 0
  });

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      if (employeeView && currentUser?.empusername) {
        data = await travelExpenseService.getEmployeeTravelExpenses(currentUser.empusername);
      } else if (isManager && !isAdmin && currentUser?.emp_id) {
        data = await travelExpenseService.getTravelExpensesByDepartment(currentUser.emp_id);
      } else {
        data = await travelExpenseService.getTravelExpenses();
      }
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to load travel expenses');
    } finally {
      setLoading(false);
    }
  }, [employeeView, isManager, isAdmin, currentUser]);

  const fetchSummary = useCallback(async () => {
    try {
      const data = await travelExpenseService.getExpenseSummary();
      setSummary(data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  }, []);

  const fetchEmployees = useCallback(async () => {
    try {
      const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/';
      const response = await axios.get(`${baseURL}employees/`);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  }, []);

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.emp_name : `Employee ID: ${employeeId}`;
  };

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
    if (!employeeView) {
      fetchEmployees();
    }
  }, [fetchExpenses, fetchSummary, fetchEmployees, employeeView]);

  const handleAddExpense = () => {
    setSelectedExpense(null);
    setFormOpen(true);
  };

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setFormOpen(true);
  };

  const handleDeleteExpense = async () => {
    try {
      await travelExpenseService.deleteTravelExpense(expenseToDelete.id);
      toast.success('Expense deleted successfully');
      fetchExpenses();
      fetchSummary();
      setDeleteDialogOpen(false);
      setExpenseToDelete(null);
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    }
  };

  const handleStatusUpdate = async (expense, newStatus) => {
    try {
      const result = await Swal.fire({
        title: `${newStatus} Expense`,
        text: `Are you sure you want to ${newStatus.toLowerCase()} this expense?`,
        input: 'textarea',
        inputLabel: 'Remarks (optional)',
        inputPlaceholder: 'Enter remarks...',
        showCancelButton: true,
        confirmButtonText: `Yes, ${newStatus}`,
        confirmButtonColor: newStatus === 'Approved' ? '#4caf50' : '#f44336'
      });

      if (result.isConfirmed) {
        await travelExpenseService.updateExpenseStatus(
          expense.id, 
          newStatus, 
          currentUser?.empusername || currentUser?.emp_name,
          result.value
        );
        toast.success(`Expense ${newStatus.toLowerCase()} successfully`);
        fetchExpenses();
        fetchSummary();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update expense status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesStatus = !statusFilter || expense.status === statusFilter;
    const matchesType = !typeFilter || expense.expense_type === typeFilter;
    const matchesSearch = !searchText || 
      expense.description?.toLowerCase().includes(searchText.toLowerCase()) ||
      expense.purpose?.toLowerCase().includes(searchText.toLowerCase()) ||
      expense.from_location?.toLowerCase().includes(searchText.toLowerCase()) ||
      expense.to_location?.toLowerCase().includes(searchText.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

  const columns = [
    {
      field: 'expense_date',
      headerName: 'Date',
      width: 110,
      renderCell: (params) => new Date(params.value).toLocaleDateString()
    },
    {
      field: 'expense_type',
      headerName: 'Type',
      width: 120,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold">
          {params.row.currency === 'INR' ? '₹' : params.row.currency} {params.value.toLocaleString()}
        </Typography>
      )
    },
    {
      field: 'from_location',
      headerName: 'From',
      width: 130,
    },
    {
      field: 'to_location',
      headerName: 'To',
      width: 130,
    },
    {
      field: 'purpose',
      headerName: 'Purpose',
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value || ''}>
          <Typography variant="body2" noWrap>
            {params.value || '-'}
          </Typography>
        </Tooltip>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={getStatusColor(params.value)}
          size="small"
        />
      )
    },
    ...(!employeeView ? [{
      field: 'employee_id',
      headerName: 'Employee',
      width: 180,
      renderCell: (params) => {
        return getEmployeeName(params.value);
      }
    }] : []),
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      renderCell: (params) => {
        const expense = params.row;
        const canEdit = isAdmin || isManager || (employeeView && expense.status === 'Pending');
        const canDelete = isAdmin || (employeeView && expense.status === 'Pending');
        const canApprove = (isAdmin || isManager) && expense.status === 'Pending';

        return (
          <Box>
            <Tooltip title="View">
              <IconButton size="small" onClick={() => handleEditExpense(expense)}>
                <ViewIcon />
              </IconButton>
            </Tooltip>
            
            {canEdit && (
              <Tooltip title="Edit">
                <IconButton size="small" onClick={() => handleEditExpense(expense)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}

            {canApprove && (
              <>
                <Tooltip title="Approve">
                  <IconButton 
                    size="small" 
                    color="success"
                    onClick={() => handleStatusUpdate(expense, 'Approved')}
                  >
                    <ApproveIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reject">
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => handleStatusUpdate(expense, 'Rejected')}
                  >
                    <RejectIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}

            {canDelete && (
              <Tooltip title="Delete">
                <IconButton 
                  size="small" 
                  color="error"
                  onClick={() => {
                    setExpenseToDelete(expense);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        );
      }
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Travel Expenses
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => { fetchExpenses(); fetchSummary(); }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddExpense}
          >
            Add Expense
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Expenses
              </Typography>
              <Typography variant="h5">
                {summary.total_expenses}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderLeft: '4px solid #ff9800' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending
              </Typography>
              <Typography variant="h5" color="warning.main">
                {summary.pending_expenses}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderLeft: '4px solid #4caf50' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Approved
              </Typography>
              <Typography variant="h5" color="success.main">
                {summary.approved_expenses}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderLeft: '4px solid #f44336' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Rejected
              </Typography>
              <Typography variant="h5" color="error.main">
                {summary.rejected_expenses}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderLeft: '4px solid #2196f3' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Approved Amount
              </Typography>
              <Typography variant="h5" color="primary.main">
                ₹{summary.total_approved_amount.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search expenses..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                {travelExpenseService.getExpenseTypes().map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => {
                setStatusFilter('');
                setTypeFilter('');
                setSearchText('');
              }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Data Grid */}
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredExpenses}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          loading={loading}
          disableSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell:hover': {
              color: 'primary.main',
            },
          }}
        />
      </Paper>

      {/* Add/Edit Form Dialog */}
      <AddEditForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedExpense(null);
        }}
        onSuccess={() => {
          fetchExpenses();
          fetchSummary();
        }}
        expense={selectedExpense}
        currentUser={currentUser}
        isManager={isManager}
        isAdmin={isAdmin}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Expense</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this travel expense? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteExpense} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TravelExpenseList;