import { useState, useRef, useEffect } from "react";
import { Typography, Button, Box, TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Stack from "@mui/material/Stack";
import { usecdotStore } from "../../components/cdotStore";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import TableRow from "@mui/material/TableRow";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";

export default function AddForm({ onClick }) {
  const baseURL = process.env.REACT_APP_API_URL;
  const [selectedemp, setSelectedemp] = useState("");
  const form = useRef();
  const updatePayslip = usecdotStore((state) => state.updatePayslip);
  const username = usecdotStore((state) => state.username);
  const employees = usecdotStore((state) => state.employees);
  const [paydate, setPaydate] = useState(new Date());
  const [selectedmanager, setSelectedmanager] = useState("");
  const [statustype, setStatustype] = useState("");
  const updateEmpusername = usecdotStore((state) => state.updateEmpusername);
  const empusername = usecdotStore((state) => state.empusername);
  const paygrades = usecdotStore((state) => state.paygrades);

  // Earnings
  const [basic, setBasic] = useState(0);
  const [hra, setHra] = useState(0);
  const [ta, setTa] = useState(0);
  const [com, setCom] = useState(0);
  const [sa, setSa] = useState(0);
  const [edu, setEdu] = useState(0);
  const [medical, setMedical] = useState(0);

  // Deductions
  const [emppf, setEmppf] = useState(0);
  const [empesi, setEmpesi] = useState(0);
  const [incometax, setIncometax] = useState(0);
  const [advancePay, setAdvancePay] = useState(0);
  const [cltaken, setCitaken] = useState(0);
  const [eitaken, setEitaken] = useState(0);
  const [lwptaken, setLwptaken] = useState(0);
  const [lwptakendays, setLwptakendays] = useState(0);

  // New percentage fields
  const [pfEmployeePercent, setPfEmployeePercent] = useState(12);
  const [pfEmployerPercent, setPfEmployerPercent] = useState(12);
  const [esiEmployeePercent, setEsiEmployeePercent] = useState(0.75);
  const [esiEmployerPercent, setEsiEmployerPercent] = useState(3.25);
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  
  // Employee and company details
  const [selectedEmployeeData, setSelectedEmployeeData] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [ctcAmount, setCtcAmount] = useState(0);

  // Reimbursements
  const [travelExpense, setTravelExpense] = useState(0);
  const [telephoneExpense, setTelephoneExpense] = useState(0);
  const [twoWheelerExpense, setTwoWheelerExpense] = useState(0);
  const [fourWheelerExpense, setFourWheelerExpense] = useState(0);
  const [otherExpense, setOtherExpense] = useState(0);

  // Calculations
  const [totalEarning, setTotalEarning] = useState(0);
  const [totalDeduction, setTotalDeduction] = useState(0);
  const [totalReimbursement, setTotalReimbursement] = useState(0);
  const [totalCTC, setTotalCTC] = useState(0);
  const [netCurrentSalary, setNetCurrentSalary] = useState(0);
  const [grossSalary, setGrossSalary] = useState(0);
  const [employerPf, setEmployerPf] = useState(0);
  const [employerEsi, setEmployerEsi] = useState(0);

  const [btnEnabled, setButtonEnabled] = useState(true);
  const [salaryBtnEnable, setSalaryBtnEnable] = useState(false);
  const [dept, setDept] = useState("");
  const [onbasicpay, setOnbasicpay] = useState(false);
  const [esiAccountNo, setEsiAccountNo] = useState("");
  const [uanNo, setUanNo] = useState("");

  const apay = useRef(0);
  const uname = useRef("");

  useEffect(() => {
    if (incometax && basic) {
      setButtonEnabled(false);
    }
  }, [incometax, basic]);

  // Calculate PF and ESI based on percentages
  useEffect(() => {
    if (basic > 0) {
      const pfBase = onbasicpay ? Math.min(basic, 15000) : basic;
      const empPf = (pfBase * pfEmployeePercent) / 100;
      const empPfEmployer = (pfBase * pfEmployerPercent) / 100;
      setEmppf(Math.round(empPf));
      setEmployerPf(Math.round(empPfEmployer));
    }
  }, [basic, pfEmployeePercent, pfEmployerPercent, onbasicpay]);

  useEffect(() => {
    if (grossSalary > 0 && grossSalary <= 21000) {
      const empEsi = (grossSalary * esiEmployeePercent) / 100;
      const empEsiEmployer = (grossSalary * esiEmployerPercent) / 100;
      setEmpesi(Math.round(empEsi));
      setEmployerEsi(Math.round(empEsiEmployer));
    } else {
      setEmpesi(0);
      setEmployerEsi(0);
    }
  }, [grossSalary, esiEmployeePercent, esiEmployerPercent]);

  const formik = useFormik({
    initialValues: {
      total_days: 30,
      paid_days: 30,
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log(values);
      formik.values.employee_id = selectedemp;
      formik.values.username = empusername;
      formik.values.date = paydate;
      formik.values.status = statustype;
      formik.values.manager = selectedmanager;
      formik.values.basic = parseInt(basic);
      formik.values.hra = parseInt(hra);
      formik.values.ta = parseInt(ta);
      formik.values.com = parseInt(com);
      formik.values.sa = parseInt(sa);
      formik.values.edu = parseInt(edu);
      formik.values.pf_employee_percent = pfEmployeePercent;
      formik.values.pf_employer_percent = pfEmployerPercent;
      formik.values.esi_employee_percent = esiEmployeePercent;
      formik.values.esi_employer_percent = esiEmployerPercent;
      formik.values.bank_account_number = bankAccountNumber;
      formik.values.income_tax = parseInt(incometax);
      formik.values.advance_pay = parseInt(advancePay);
      formik.values.cl_taken = parseInt(cltaken);
      formik.values.ei_taken = parseInt(eitaken);
      formik.values.lwp_taken = parseInt(lwptakendays);
      formik.values.medical = parseInt(medical);
      formik.values.leave_travel_allowance = parseInt(travelExpense);
      formik.values.telephone_expense = parseInt(telephoneExpense);
      formik.values.fuel_and_maint_two_wheeler = parseInt(twoWheelerExpense);
      formik.values.fuel_and_maint_four_wheeler = parseInt(fourWheelerExpense);
      formik.values.other_expense = parseInt(otherExpense);
      formik.values.total_earning = parseInt(totalEarning);
      formik.values.total_reimbursement = parseInt(totalReimbursement);
      formik.values.total_deduction = parseInt(totalDeduction);
      formik.values.net_current_salary = parseInt(netCurrentSalary);
      formik.values.department_id = dept;
      formik.values.esiAccountNo = esiAccountNo;
      formik.values.uan_number = uanNo;

      // console.log("Values: " + JSON.stringify(values));

      await axios
        .post(baseURL + "payroll", values)
        .then(function (response) {
          toast.success("Payslip created successfully!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            toastId: "success",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          payslipApi();
          onClick();
        })
        .catch(function (error) {
          console.log("Error: " + error);
          toast.error("Failed to create payslip!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            toastId: "error",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    },
  });

  const checkCompanyApi = async () => {
    await axios
      .get(baseURL + "companies")
      .then(function (response) {
        if (response.data.emi != null) {
          setAdvancePay(response.data.emi);
          apay.current = response.data.emi;
        } else {
          setAdvancePay(0);
          apay.current = 0;
        }
      })
      .catch(function (error) {
        setAdvancePay(0);
        apay.current = 0;
        console.log("Loan API Error: " + error);
      });
  };

  const fetchEmployeeDetails = async (employeeId) => {
    try {
      const response = await axios.get(baseURL + "employees/" + employeeId);
      const employeeData = response.data[0];
      
      setSelectedEmployeeData(employeeData);
      updateEmpusername(employeeData.username);
      setDept(employeeData.department_id);
      uname.current = employeeData.username;
      
      // Set CTC and gross salary
      setCtcAmount(employeeData.ctc || 0);
      setGrossSalary(employeeData.gross_salary || 0);
      
      // Set employee configuration
      setOnbasicpay(employeeData.isbasicpay || false);
      setEsiAccountNo(employeeData.esi_account_number || "");
      setUanNo(employeeData.uan_number || "");
      setBankAccountNumber(employeeData.bank_account_number || "");
      
      // Set PF and ESI percentages from employee data
      setPfEmployeePercent(employeeData.pf_employee_percent || 12);
      setPfEmployerPercent(employeeData.pf_employer_percent || 12);
      setEsiEmployeePercent(employeeData.esi_employee_percent || 0.75);
      setEsiEmployerPercent(employeeData.esi_employer_percent || 3.25);
      
      return employeeData;
    } catch (error) {
      console.log("Employee API Error: " + error);
      toast.error("Failed to fetch employee details");
      return null;
    }
  };
  
  const fetchCompanyDetails = async () => {
    try {
      const response = await axios.get(baseURL + "companies");
      setCompanyData(response.data);
      return response.data;
    } catch (error) {
      console.log("Company API Error: " + error);
      return null;
    }
  };

  const checkLoanApi = async () => {
    await axios
      .get(baseURL + "loans/employee/" + uname.current)
      .then(function (response) {
        if (response.data.emi != null) {
          setAdvancePay(response.data.emi);
          apay.current = response.data.emi;
        } else {
          setAdvancePay(0);
          apay.current = 0;
        }
      })
      .catch(function (error) {
        setAdvancePay(0);
        apay.current = 0;
        console.log("Loan API Error: " + error);
      });
  };

  const handleEmployeeChange = async (event) => {
    setSalaryBtnEnable(false);
    setSelectedemp(event.target.value);

    // Fetch employee details from API
    const employeeData = await fetchEmployeeDetails(event.target.value);
    
    if (employeeData) {
      // Fetch company details
      await fetchCompanyDetails();
      
      // Check for loans
      await checkLoanApi();
      
      // Calculate salary components based on paygrade and CTC
      const monthlyCTC = employeeData.ctc / 12; // Convert annual CTC to monthly
      const emppaygrade = employeeData.pay_grade_id;
      
      // Calculate salary components based on paygrade percentages and CTC
      paygrades.forEach((paygrade) => {
        if (paygrade.id == emppaygrade) {
          if (paygrade.basic != null) {
            const basicSalary = (parseFloat(paygrade.basic) / 100) * monthlyCTC;
            setBasic(Math.round(basicSalary));
          }
          if (paygrade.hra != null) {
            const hraSalary = (parseFloat(paygrade.hra) / 100) * monthlyCTC;
            setHra(Math.round(hraSalary));
          }
          if (paygrade.ta != null) {
            const taSalary = (parseFloat(paygrade.ta) / 100) * monthlyCTC;
            setTa(Math.round(taSalary));
          }
          if (paygrade.com != null) {
            const comSalary = (parseFloat(paygrade.com) / 100) * monthlyCTC;
            setCom(Math.round(comSalary));
          }
          if (paygrade.sa != null) {
            const saSalary = (parseFloat(paygrade.sa) / 100) * monthlyCTC;
            setSa(Math.round(saSalary));
          }
          if (paygrade.edu != null) {
            const eduSalary = (parseFloat(paygrade.edu) / 100) * monthlyCTC;
            setEdu(Math.round(eduSalary));
          }
          if (paygrade.medical != null) {
            const medicalSalary = (parseFloat(paygrade.medical) / 100) * monthlyCTC;
            setMedical(Math.round(medicalSalary));
          }
          if (paygrade.income_tax != null) {
            const itSalary = (parseFloat(paygrade.income_tax) / 100) * monthlyCTC;
            setIncometax(Math.round(itSalary));
          }
        }
      });
    }

    // Reset calculations
    setTotalEarning(0);
    setTotalDeduction(0);
    setTotalReimbursement(0);
    setNetCurrentSalary(0);
    setTotalCTC(0);
  };

  const payslipApi = async () => {
    await axios
      .get(baseURL + "payroll")
      .then(function (response) {
        updatePayslip(response.data);
      })
      .catch(function (error) {
        console.log("Payslip API Error: " + error);
      });
  };

  const calculateSalary = () => {
    setSalaryBtnEnable(true);
    let pdays = formik.values.paid_days || 30;
    let tdays = formik.values.total_days || 30;

    // Calculate prorated earnings based on paid days
    const ratio = pdays / tdays;
    const s_basic = basic * ratio;
    const s_hra = hra * ratio;
    const s_ta = ta * ratio;
    const s_com = com * ratio;
    const s_sa = sa * ratio;
    const s_edu = edu * ratio;
    const s_medical = medical * ratio;

    // Update state with prorated values
    setBasic(Math.round(s_basic));
    setHra(Math.round(s_hra));
    setTa(Math.round(s_ta));
    setCom(Math.round(s_com));
    setSa(Math.round(s_sa));
    setEdu(Math.round(s_edu));
    setMedical(Math.round(s_medical));

    // Calculate LWP
    const lwpDays = tdays - pdays;
    setLwptakendays(lwpDays);
    
    // Calculate LWP amount based on basic salary (more accurate than gross salary)
    const dailyBasic = basic / tdays;
    const lwpAmount = dailyBasic * lwpDays;
    setLwptaken(Math.round(lwpAmount));

    // Calculate totals
    const totalEarn = s_basic + s_hra + s_ta + s_com + s_sa + s_edu + s_medical;
    const totalDeduct = emppf + empesi + incometax + advancePay + cltaken + eitaken + Math.round(lwpAmount);
    const totalReimb = travelExpense + telephoneExpense + twoWheelerExpense + fourWheelerExpense + otherExpense;
    const netSalary = totalEarn - totalDeduct + totalReimb;
    
    // Calculate monthly CTC based on actual CTC from employee data
    const monthlyCTC = ctcAmount / 12;
    
    setTotalEarning(Math.round(totalEarn));
    setTotalDeduction(Math.round(totalDeduct));
    setTotalReimbursement(Math.round(totalReimb));
    setNetCurrentSalary(Math.round(netSalary));
    setTotalCTC(Math.round(monthlyCTC));
  };

  return (
    <Box sx={{ maxHeight: "90vh", overflow: "auto", p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", color: "primary.main" }}>
          Add Payslip
        </Typography>
        <IconButton onClick={onClick} size="large">
          <CloseIcon />
        </IconButton>
      </Box>

      <form ref={form}>
        <Grid container spacing={3}>
          {/* Employee Information Section */}
          <Grid item xs={12} md={3}>
            <Card elevation={3}>
              <CardHeader
                title="Employee Information"
                sx={{ bgcolor: "primary.light", color: "white", py: 1 }}
                titleTypographyProps={{ variant: "subtitle1", fontWeight: "bold" }}
              />
              <CardContent>
                <Stack spacing={3}>
                  <FormControl fullWidth>
                    <InputLabel>Employee Name</InputLabel>
                    <Select
                      value={selectedemp}
                      onChange={handleEmployeeChange}
                      label="Employee Name"
                    >
                      {employees.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.emp_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    type="number"
                    label="Paid Days"
                    name="paid_days"
                    onChange={formik.handleChange}
                    value={formik.values.paid_days}
                    fullWidth
                    size="small"
                  />

                  <TextField
                    type="number"
                    label="Total Days"
                    name="total_days"
                    onChange={formik.handleChange}
                    value={formik.values.total_days}
                    fullWidth
                    size="small"
                  />

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Pay Date"
                      value={paydate}
                      onChange={(newValue) => setPaydate(newValue)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>

                  <Button
                    variant="contained"
                    color="success"
                    onClick={calculateSalary}
                    disabled={!selectedemp}
                    fullWidth
                    size="large"
                  >
                    Calculate Salary
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            {/* Summary Card */}
            <Card elevation={3} sx={{ mt: 2 }}>
              <CardHeader
                title="Salary Summary"
                sx={{ bgcolor: "success.light", color: "white", py: 1 }}
                titleTypographyProps={{ variant: "subtitle1", fontWeight: "bold" }}
              />
              <CardContent>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Typography fontWeight="bold">Total Earnings:</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight="bold" color="success.main">
                            ₹{totalEarning.toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography fontWeight="bold">Total Deductions:</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight="bold" color="error.main">
                            ₹{totalDeduction.toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography fontWeight="bold">Total Reimbursement:</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight="bold" color="info.main">
                            ₹{totalReimbursement.toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography fontWeight="bold" variant="h6">Net Salary:</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight="bold" variant="h6" color="primary.main">
                            ₹{netCurrentSalary.toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Earnings Section */}
          <Grid item xs={12} md={3}>
            <Card elevation={3}>
              <CardHeader
                title="Earnings"
                sx={{ bgcolor: "success.main", color: "white", py: 1 }}
                titleTypographyProps={{ variant: "subtitle1", fontWeight: "bold" }}
              />
              <CardContent>
                <Stack spacing={2}>
                  <TextField
                    label="Basic DA"
                    type="number"
                    value={basic}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    label="HRA"
                    type="number"
                    value={hra}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    label="Transport Allowance"
                    type="number"
                    value={ta}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    label="Communication"
                    type="number"
                    value={com}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    label="Education Allowance"
                    type="number"
                    value={edu}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    label="Medical Allowance"
                    type="number"
                    value={medical}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    label="Special Allowance / Arrears"
                    type="number"
                    value={sa}
                    onChange={(e) => setSa(Number(e.target.value))}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Deductions Section */}
          <Grid item xs={12} md={3}>
            <Card elevation={3}>
              <CardHeader
                title="Deductions"
                sx={{ bgcolor: "error.main", color: "white", py: 1 }}
                titleTypographyProps={{ variant: "subtitle1", fontWeight: "bold" }}
              />
              <CardContent>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      PF Employee ({pfEmployeePercent}%)
                    </Typography>
                    <TextField
                      type="number"
                      value={emppf}
                      InputProps={{ readOnly: true }}
                      fullWidth
                      size="small"
                    />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      ESI Employee ({esiEmployeePercent}%)
                    </Typography>
                    <TextField
                      type="number"
                      value={empesi}
                      InputProps={{ readOnly: true }}
                      fullWidth
                      size="small"
                    />
                  </Box>
                  <TextField
                    label="Income Tax (TDS)"
                    type="number"
                    value={incometax}
                    onChange={(e) => setIncometax(Number(e.target.value))}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    label="Advance Pay / Loan EMI"
                    type="number"
                    value={advancePay}
                    onChange={(e) => setAdvancePay(Number(e.target.value))}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    label="Casual Leave Taken"
                    type="number"
                    value={cltaken}
                    onChange={(e) => setCitaken(Number(e.target.value))}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    label="Emergency Leave Taken"
                    type="number"
                    value={eitaken}
                    onChange={(e) => setEitaken(Number(e.target.value))}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    label="LWP Days"
                    type="number"
                    value={lwptakendays}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Employer Contribution & Reimbursements */}
          <Grid item xs={12} md={3}>
            <Card elevation={3}>
              <CardHeader
                title="Employer Contribution"
                sx={{ bgcolor: "info.main", color: "white", py: 1 }}
                titleTypographyProps={{ variant: "subtitle1", fontWeight: "bold" }}
              />
              <CardContent>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Employer PF ({pfEmployerPercent}%)
                    </Typography>
                    <TextField
                      type="number"
                      value={employerPf}
                      InputProps={{ readOnly: true }}
                      fullWidth
                      size="small"
                    />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Employer ESI ({esiEmployerPercent}%)
                    </Typography>
                    <TextField
                      type="number"
                      value={employerEsi}
                      InputProps={{ readOnly: true }}
                      fullWidth
                      size="small"
                    />
                  </Box>

                  <Divider />
                  <Typography variant="h6" color="primary">Reimbursements</Typography>

                  <TextField
                    label="Travel Allowance"
                    type="number"
                    value={travelExpense}
                    onChange={(e) => setTravelExpense(Number(e.target.value))}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Telephone Expense"
                    type="number"
                    value={telephoneExpense}
                    onChange={(e) => setTelephoneExpense(Number(e.target.value))}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Two Wheeler Expense"
                    type="number"
                    value={twoWheelerExpense}
                    onChange={(e) => setTwoWheelerExpense(Number(e.target.value))}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Four Wheeler Expense"
                    type="number"
                    value={fourWheelerExpense}
                    onChange={(e) => setFourWheelerExpense(Number(e.target.value))}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Other Expenses"
                    type="number"
                    value={otherExpense}
                    onChange={(e) => setOtherExpense(Number(e.target.value))}
                    fullWidth
                    size="small"
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Final Summary */}
            <Card elevation={3} sx={{ mt: 2 }}>
              <CardHeader
                title="Final Summary"
                sx={{ bgcolor: "secondary.main", color: "white", py: 1 }}
                titleTypographyProps={{ variant: "subtitle1", fontWeight: "bold" }}
              />
              <CardContent>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Typography fontWeight="bold">Gross Salary:</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight="bold">
                            ₹{grossSalary.toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography fontWeight="bold">Annual CTC:</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight="bold" color="success.main">
                            ₹{ctcAmount.toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography fontWeight="bold">Monthly CTC:</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight="bold" color="primary.main">
                            ₹{totalCTC.toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Employee Details Section */}
        <Card elevation={3} sx={{ mt: 3 }}>
          <CardHeader
            title="Employee Account Details"
            sx={{ bgcolor: "warning.main", color: "white", py: 1 }}
            titleTypographyProps={{ variant: "subtitle1", fontWeight: "bold" }}
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Bank Account Number"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="ESI Account Number"
                  value={esiAccountNo}
                  onChange={(e) => setEsiAccountNo(e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="UAN Number"
                  value={uanNo}
                  onChange={(e) => setUanNo(e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Percentage Configuration Section */}
        <Card elevation={3} sx={{ mt: 3 }}>
          <CardHeader
            title="PF & ESI Configuration"
            sx={{ bgcolor: "primary.dark", color: "white", py: 1 }}
            titleTypographyProps={{ variant: "subtitle1", fontWeight: "bold" }}
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  label="PF Employee %"
                  type="number"
                  value={pfEmployeePercent}
                  onChange={(e) => setPfEmployeePercent(Number(e.target.value))}
                  fullWidth
                  size="small"
                  inputProps={{ step: 0.01, min: 0, max: 100 }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="PF Employer %"
                  type="number"
                  value={pfEmployerPercent}
                  onChange={(e) => setPfEmployerPercent(Number(e.target.value))}
                  fullWidth
                  size="small"
                  inputProps={{ step: 0.01, min: 0, max: 100 }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="ESI Employee %"
                  type="number"
                  value={esiEmployeePercent}
                  onChange={(e) => setEsiEmployeePercent(Number(e.target.value))}
                  fullWidth
                  size="small"
                  inputProps={{ step: 0.01, min: 0, max: 100 }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="ESI Employer %"
                  type="number"
                  value={esiEmployerPercent}
                  onChange={(e) => setEsiEmployerPercent(Number(e.target.value))}
                  fullWidth
                  size="small"
                  inputProps={{ step: 0.01, min: 0, max: 100 }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ mt: 4, mb: 2 }}>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={formik.handleSubmit}
              disabled={!selectedemp || !salaryBtnEnable}
              sx={{ minWidth: 120 }}
            >
              Save Payslip
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              onClick={() => formik.resetForm()}
              sx={{ minWidth: 120 }}
            >
              Reset Form
            </Button>
            <Button
              variant="contained"
              color="error"
              size="large"
              onClick={onClick}
              sx={{ minWidth: 120 }}
            >
              Close
            </Button>
          </Stack>
        </Box>
      </form>
    </Box>
  );
}