import React from 'react';
import { Box, Typography } from '@mui/material';
import TravelExpenseList from './TravelExpenseList';
import { usecdotStore } from '../../components/cdotStore';

const EmployeeTravelExpense = () => {
  const { 
    empusername,
    emp_name,
    emp_department,
    emp_id 
  } = usecdotStore();

  const currentUser = {
    empusername,
    emp_name,
    emp_department,
    emp_id
  };

  return (
    <Box>
      <TravelExpenseList
        currentUser={currentUser}
        isAdmin={false}
        isManager={false}
        employeeView={true}
      />
    </Box>
  );
};

export default EmployeeTravelExpense;