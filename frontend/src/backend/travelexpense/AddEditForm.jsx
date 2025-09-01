import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import travelExpenseService from '../../services/travelExpenseService';
import axios from 'axios';

const AddEditForm = ({
  open,
  onClose,
  onSuccess,
  expense = null,
  currentUser,
  isManager = false,
  isAdmin = false
}) => {
  const [formData, setFormData] = useState({
    financial_year_id: null,
    employee_id: '',
    department_id: '',
    expense_date: dayjs(),
    expense_type: '',
    amount: '',
    currency: 'INR',
    description: '',
    from_location: '',
    to_location: '',
    purpose: '',
    receipt_document: '',
    status: 'Pending',
    approved_by: '',
    approval_date: '',
    remarks: ''
  });

  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [financialYears, setFinancialYears] = useState([]);
  const [errors, setErrors] = useState({});

  const expenseTypes = travelExpenseService.getExpenseTypes();
  const statusOptions = travelExpenseService.getStatusOptions();
  const currencyOptions = travelExpenseService.getCurrencyOptions();

  useEffect(() => {
    if (open) {
      fetchData();
      if (expense) {
        setFormData({
          ...expense,
          expense_date: expense.expense_date ? dayjs(expense.expense_date) : dayjs(),
          approval_date: expense.approval_date || ''
        });
      } else {
        // Reset form for new expense
        setFormData({
          financial_year_id: null,
          employee_id: currentUser?.emp_id || '',
          department_id: currentUser?.emp_department || '',
          expense_date: dayjs(),
          expense_type: '',
          amount: '',
          currency: 'INR',
          description: '',
          from_location: '',
          to_location: '',
          purpose: '',
          receipt_document: '',
          status: 'Pending',
          approved_by: '',
          approval_date: '',
          remarks: ''
        });
      }
    }
  }, [open, expense, currentUser]);

  const fetchData = async () => {
    try {
      const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/';
      console.log('Fetching data from:', baseURL);

      const [employeesRes, departmentsRes] = await Promise.all([
        axios.get(`${baseURL}employees`),
        axios.get(`${baseURL}departments`),
      ]);

      console.log('Employees response:', employeesRes);
      console.log('Departments response:', departmentsRes);

      setEmployees(employeesRes.data || []);
      setDepartments(departmentsRes.data || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      console.error('Error details:', error.response?.data);
      toast.error(`Failed to load form data: ${error.response?.data?.detail || error.message}`);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Financial year is no longer required (auto-set by backend)
    if (!formData.employee_id) newErrors.employee_id = 'Employee is required';
    if (!formData.department_id) newErrors.department_id = 'Department is required';
    if (!formData.expense_date) newErrors.expense_date = 'Expense date is required';
    if (!formData.expense_type) newErrors.expense_type = 'Expense type is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!formData.purpose) newErrors.purpose = 'Purpose is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        expense_date: formData.expense_date.format('YYYY-MM-DD'),
        amount: parseFloat(formData.amount),
        username: currentUser?.empusername || ''
      };

      // Remove financial_year_id if null to let backend auto-set it
      if (!submitData.financial_year_id) {
        delete submitData.financial_year_id;
      }

      if (expense?.id) {
        await travelExpenseService.updateTravelExpense(expense.id, submitData);
        toast.success('Travel expense updated successfully');
      } else {
        await travelExpenseService.createTravelExpense(submitData);
        toast.success('Travel expense created successfully');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving travel expense:', error);
      toast.error(error.detail || 'Failed to save travel expense');
    } finally {
      setLoading(false);
    }
  };

  const canEdit = () => {
    if (isAdmin) return true;
    if (isManager) return true;
    if (expense && expense.status !== 'Pending') return false;
    return true;
  };

  const canEditStatus = () => {
    return isAdmin || isManager;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">
          {expense ? 'Edit Travel Expense' : 'Add Travel Expense'}
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Financial Year is now auto-selected by backend - no UI needed */}

            {/* Employee */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small" error={!!errors.employee_id}>
                <InputLabel>Employee *</InputLabel>
                <Select
                  value={formData.employee_id}
                  onChange={(e) => handleInputChange('employee_id', e.target.value)}
                  disabled={!canEdit() || (!isAdmin && !isManager)}
                >
                  {employees && employees.length > 0 ? (
                    employees.map((emp) => (
                      <MenuItem key={emp.id} value={emp.id}>
                        {emp.emp_name || emp.username} ({emp.username})
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>
                      <em>Loading employees...</em>
                    </MenuItem>
                  )}
                </Select>
                {errors.employee_id && (
                  <Alert severity="error" sx={{ mt: 1 }}>{errors.employee_id}</Alert>
                )}
              </FormControl>
            </Grid>

            {/* Department */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small" error={!!errors.department_id}>
                <InputLabel>Department *</InputLabel>
                <Select
                  value={formData.department_id}
                  onChange={(e) => handleInputChange('department_id', e.target.value)}
                  disabled={!canEdit()}
                >
                  {departments && departments.length > 0 ? (
                    departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.id}>
                        {dept.department_name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>
                      <em>Loading departments...</em>
                    </MenuItem>
                  )}
                </Select>
                {errors.department_id && (
                  <Alert severity="error" sx={{ mt: 1 }}>{errors.department_id}</Alert>
                )}
              </FormControl>
            </Grid>

            {/* Expense Date */}
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Expense Date *"
                  value={formData.expense_date}
                  onChange={(date) => handleInputChange('expense_date', date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      size="small"
                      error={!!errors.expense_date}
                      helperText={errors.expense_date}
                      disabled={!canEdit()}
                    />
                  )}
                  disabled={!canEdit()}
                />
              </LocalizationProvider>
            </Grid>

            {/* Expense Type */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small" error={!!errors.expense_type}>
                <InputLabel>Expense Type *</InputLabel>
                <Select
                  value={formData.expense_type}
                  onChange={(e) => handleInputChange('expense_type', e.target.value)}
                  disabled={!canEdit()}
                >
                  {expenseTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {errors.expense_type && (
                  <Alert severity="error" sx={{ mt: 1 }}>{errors.expense_type}</Alert>
                )}
              </FormControl>
            </Grid>

            {/* Amount */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Amount *"
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                error={!!errors.amount}
                helperText={errors.amount}
                disabled={!canEdit()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {currencyOptions.find(c => c.value === formData.currency)?.label?.split(' ')[0] || '₹'}
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* Currency */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Currency</InputLabel>
                <Select
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  disabled={!canEdit()}
                >
                  {currencyOptions.map((currency) => (
                    <MenuItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* From Location */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="From Location"
                value={formData.from_location}
                onChange={(e) => handleInputChange('from_location', e.target.value)}
                disabled={!canEdit()}
              />
            </Grid>

            {/* To Location */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="To Location"
                value={formData.to_location}
                onChange={(e) => handleInputChange('to_location', e.target.value)}
                disabled={!canEdit()}
              />
            </Grid>

            {/* Purpose */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Purpose *"
                multiline
                rows={2}
                value={formData.purpose}
                onChange={(e) => handleInputChange('purpose', e.target.value)}
                error={!!errors.purpose}
                helperText={errors.purpose}
                disabled={!canEdit()}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Description"
                multiline
                rows={2}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                disabled={!canEdit()}
              />
            </Grid>

            {/* Status - Only for Managers/Admins */}
            {canEditStatus() && expense && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                    >
                      {statusOptions.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Approved By"
                    value={formData.approved_by}
                    onChange={(e) => handleInputChange('approved_by', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Remarks"
                    multiline
                    rows={2}
                    value={formData.remarks}
                    onChange={(e) => handleInputChange('remarks', e.target.value)}
                  />
                </Grid>
              </>
            )}

            {/* Receipt Document */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Receipt Document URL"
                value={formData.receipt_document}
                onChange={(e) => handleInputChange('receipt_document', e.target.value)}
                disabled={!canEdit()}
                placeholder="https://..."
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !canEdit()}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {expense ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddEditForm;