import { useState, useRef, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Typography, Box, Divider, Card, CardContent } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PrintIcon from "@mui/icons-material/Print";
import Button from "@mui/material/Button";
import { usecdotStore } from "../../components/cdotStore";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import axios from "axios";

function PrintPayslip({ onClick, eventid, uname }) {
  const [showform, setShowform] = useState(false);
  const componentRef = useRef();
  const baseURL = process.env.REACT_APP_API_URL;

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
  const [employerPf, setEmployerPf] = useState(0);
  const [employerEsi, setEmployerEsi] = useState(0);
  const [incometax, setIncometax] = useState(0);
  const [advancePay, setAdvancePay] = useState(0);
  const [cltaken, setCitaken] = useState(0);
  const [eitaken, setEitaken] = useState(0);
  const [lwptaken, setLwptaken] = useState(0);

  // Reimbursements
  const [travelExpense, setTravelExpense] = useState(0);
  const [telephoneExpense, setTelephoneExpense] = useState(0);
  const [twoWheelerExpense, setTwoWheelerExpense] = useState(0);
  const [fourWheelerExpense, setFourWheelerExpense] = useState(0);
  const [otherExpense, setOtherExpense] = useState(0);

  // Calculations
  const [totalEarning, setTotalEarning] = useState(0);
  const [totalReimbursement, setTotalReimbursement] = useState(0);
  const [totalDeduction, setTotalDeduction] = useState(0);
  const [netCurrentSalary, setNetCurrentSalary] = useState(0);
  const [ctc, setCTC] = useState(0);
  const [grossSalary, setGrossSalary] = useState(0);

  // Employee Details
  const [empname, setEmpname] = useState("");
  const [empno, setEmpno] = useState("");
  const [designation, setDesignation] = useState("");
  const [pan, setPan] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [bankaccountno, setBankaccounno] = useState("");
  const [bankName, setBankName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [location, setLocation] = useState("");
  const [gender, setGender] = useState("");
  const [pfaccount, setPfaccount] = useState("");
  const [doj, setDoj] = useState("");
  const [paydate, sePaydate] = useState("");
  const [esiAccountNo, setEsiAccountNo] = useState("");
  const [uanNo, setUanNo] = useState("");
  const [paidDays, setPaidDays] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [company, setCompany] = useState(1);
  const [department, setDepartment] = useState("");
  const [branch, setBranch] = useState("");
  const [employeeCtc, setEmployeeCtc] = useState(0);

  // Company Details
  const [companyDetails, setCompanyDetails] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");

  // New percentage fields
  const [pfEmployeePercent, setPfEmployeePercent] = useState(12);
  const [pfEmployerPercent, setPfEmployerPercent] = useState(12);
  const [esiEmployeePercent, setEsiEmployeePercent] = useState(0.75);
  const [esiEmployerPercent, setEsiEmployerPercent] = useState(3.25);
  const backendURL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    payslipEditApi();
    getEmployeeApi();
    getCompanyApi();
  }, []);

  const getEmployeeApi = async () => {
    try {
      const response = await axios.get(baseURL + "employees/username/" + uname);
      const empData = response.data[0];

      // Basic employee information
      setGrossSalary(empData["gross_salary"] || 0);
      setEmployeeCtc(empData["ctc"] || 0);
      setEmpname(empData["emp_name"] || "");
      setEmpno(empData["emp_no"] || "");
      setDesignation(empData["designation"] || "");
      setPan(empData["pan"] || "");
      setAadhaar(empData["aadhaar"] || "");

      // Bank details
      setBankaccounno(empData["bank_account_number"] || "");
      setBankName(empData["bank_name"] || "");
      setIfscCode(empData["ifsc_code"] || "");

      // Personal details
      setLocation(empData["city"] || "");
      setGender(empData["gender"] || "");
      setDoj(empData["emp_joining_date"] || empData["start_date"] || "");

      // Account details
      setPfaccount(empData["pf_account_number_uan"] || "");
      setEsiAccountNo(empData["esi_account_number"] || "");
      setUanNo(empData["uan_number"] || "");

      // Department and branch
      setDepartment(empData["department_name"] || "");
      setBranch(empData["branch_name"] || "");
      setCompany(empData["company_name_id"] || 1);

      // Set PF and ESI percentages
      setPfEmployeePercent(empData["pf_employee_percent"] || 12);
      setPfEmployerPercent(empData["pf_employer_percent"] || 12);
      setEsiEmployeePercent(empData["esi_employee_percent"] || 0.75);
      setEsiEmployerPercent(empData["esi_employer_percent"] || 3.25);

      setShowform(true);
    } catch (error) {
      console.log("Employee API Error: " + error);
      // Still show form with available data
      setShowform(true);
    }
  };

  const getCompanyApi = async () => {
    try {
      const response = await axios.get(baseURL + "companies/companies");
      if (response.data && response.data.length > 0) {
        // Find the company that matches the employee's company ID
        const companyData = response.data.find(comp => comp.id === company) || response.data[0];
        setCompanyDetails(companyData);
        setCompanyName(companyData.company_name || "Company Name");
        setCompanyAddress(companyData.company_address || "Company Address");
        setCompanyLogo(companyData.logo || "");
      }
    } catch (error) {
      console.log("Company API Error: " + error);
      // Set default company info
      setCompanyName(company === 1 ? "UAT Technologies" : "Trickuweb Solutions");
      setCompanyAddress("Corporate Office");
    }
  };

  const payslipEditApi = async () => {
    await axios
      .get(baseURL + "payroll/" + eventid + "/")
      .then(function (response) {
        const payrollData = response.data[0];
        setBasic(payrollData["basic"]);
        setHra(payrollData["hra"]);
        sePaydate(payrollData["date"]);
        setTa(payrollData["ta"]);
        setCom(payrollData["com"]);
        setSa(payrollData["sa"]);
        setMedical(payrollData["medical"]);
        setEdu(payrollData["edu"]);
        setEmppf(payrollData["pf"]);
        setEmpesi(payrollData["esi"]);
        setEmployerEsi(payrollData["fuel_and_maint_four_wheeler"]);
        setIncometax(payrollData["income_tax"]);
        setPaidDays(payrollData["paid_days"]);
        setTotalDays(payrollData["total_days"]);
        setAdvancePay(payrollData["advance_pay"]);
        setCitaken(payrollData["cl_taken"]);
        setEitaken(payrollData["ei_taken"]);
        setLwptaken(payrollData["lwp_taken"]);
        setTravelExpense(payrollData["leave_travel_allowance"]);
        setTelephoneExpense(payrollData["telephone_expense"]);
        setTwoWheelerExpense(payrollData["fuel_and_maint_two_wheeler"]);
        setOtherExpense(payrollData["other_expense"]);
        setTotalEarning(payrollData["total_earning"]);
        setTotalReimbursement(payrollData["total_reimbursement"]);
        setTotalDeduction(payrollData["total_deduction"]);
        setNetCurrentSalary(payrollData["net_current_salary"]);
        // CTC will be calculated from employee data, not from payroll telephone_expense
        // setCTC(payrollData["telephone_expense"]); // This was incorrect

        // Calculate employer PF (should be same as employee PF)
        setEmployerPf(payrollData["pf"]);

        setShowform(true);
      })
      .catch(function (error) {
        console.log("Payroll API Error: " + error);
      });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num || 0);
  };

  const CompanyHeader = () => (
    <Box sx={{ textAlign: 'center', mb: 3, borderBottom: '2px solid #1976d2', pb: 1 }}>
      {companyLogo && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
          <img src={backendURL + companyLogo} alt="Company Logo" style={{ maxHeight: 50, maxWidth: 200 }} />
        </Box>
      )}
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
        {companyName || (company === 1 ? "UAT Technologies" : "Trickuweb Solutions")}
      </Typography>
      <Typography variant="subtitle1" sx={{ color: '#666', mb: 1 }}>
        {companyAddress || "Corporate Office"}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mt: 2 }}>
        SALARY SLIP FOR {moment(paydate).format("MMMM YYYY").toUpperCase()}
      </Typography>
    </Box>
  );

  const EmployeeInfoSection = () => (
    <Card elevation={2} sx={{ mb: 2 }}>
      <CardContent sx={{ py: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1.5, color: '#1976d2', fontSize: '1.1rem' }}>
          Employee Details
        </Typography>
        
        {/* Personal Information Row */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1 }}>
          <Box sx={{ display: 'flex', minWidth: 180, flex: 1 }}>
            <Typography sx={{ fontWeight: 'bold', minWidth: 70, fontSize: '0.875rem' }}>Name:</Typography>
            <Typography sx={{ fontSize: '0.875rem' }}>{empname}</Typography>
          </Box>
          <Box sx={{ display: 'flex', minWidth: 180, flex: 1 }}>
            <Typography sx={{ fontWeight: 'bold', minWidth: 70, fontSize: '0.875rem' }}>Emp ID:</Typography>
            <Typography sx={{ fontSize: '0.875rem' }}>{empno}</Typography>
          </Box>
          <Box sx={{ display: 'flex', minWidth: 200, flex: 1 }}>
            <Typography sx={{ fontWeight: 'bold', minWidth: 90, fontSize: '0.875rem' }}>Designation:</Typography>
            <Typography sx={{ fontSize: '0.875rem' }}>{designation}</Typography>
          </Box>
        </Box>

        {/* Department & Location Row */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1 }}>
          <Box sx={{ display: 'flex', minWidth: 180, flex: 1 }}>
            <Typography sx={{ fontWeight: 'bold', minWidth: 70, fontSize: '0.875rem' }}>Department:</Typography>
            <Typography sx={{ fontSize: '0.875rem' }}>{department}</Typography>
          </Box>
          <Box sx={{ display: 'flex', minWidth: 180, flex: 1 }}>
            <Typography sx={{ fontWeight: 'bold', minWidth: 70, fontSize: '0.875rem' }}>Branch:</Typography>
            <Typography sx={{ fontSize: '0.875rem' }}>{branch}</Typography>
          </Box>
          <Box sx={{ display: 'flex', minWidth: 200, flex: 1 }}>
            <Typography sx={{ fontWeight: 'bold', minWidth: 90, fontSize: '0.875rem' }}>Location:</Typography>
            <Typography sx={{ fontSize: '0.875rem' }}>{location}</Typography>
          </Box>
        </Box>

        {/* Identity Documents Row */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1 }}>
          <Box sx={{ display: 'flex', minWidth: 180, flex: 1 }}>
            <Typography sx={{ fontWeight: 'bold', minWidth: 70, fontSize: '0.875rem' }}>PAN:</Typography>
            <Typography sx={{ fontSize: '0.875rem' }}>{pan}</Typography>
          </Box>
          <Box sx={{ display: 'flex', minWidth: 180, flex: 1 }}>
            <Typography sx={{ fontWeight: 'bold', minWidth: 70, fontSize: '0.875rem' }}>UAN:</Typography>
            <Typography sx={{ fontSize: '0.875rem' }}>{uanNo}</Typography>
          </Box>
          <Box sx={{ display: 'flex', minWidth: 200, flex: 1 }}>
            <Typography sx={{ fontWeight: 'bold', minWidth: 90, fontSize: '0.875rem' }}>ESI No:</Typography>
            <Typography sx={{ fontSize: '0.875rem' }}>{esiAccountNo}</Typography>
          </Box>
        </Box>

        {/* Bank Details Row */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', minWidth: 180, flex: 1 }}>
            <Typography sx={{ fontWeight: 'bold', minWidth: 70, fontSize: '0.875rem' }}>Bank:</Typography>
            <Typography sx={{ fontSize: '0.875rem' }}>{bankName}</Typography>
          </Box>
          <Box sx={{ display: 'flex', minWidth: 180, flex: 1 }}>
            <Typography sx={{ fontWeight: 'bold', minWidth: 70, fontSize: '0.875rem' }}>Account:</Typography>
            <Typography sx={{ fontSize: '0.875rem' }}>{bankaccountno}</Typography>
          </Box>
          <Box sx={{ display: 'flex', minWidth: 200, flex: 1 }}>
            <Typography sx={{ fontWeight: 'bold', minWidth: 90, fontSize: '0.875rem' }}>IFSC:</Typography>
            <Typography sx={{ fontSize: '0.875rem' }}>{ifscCode}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const AttendanceSection = () => (
    <Card elevation={2} sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
          Attendance Summary
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                {totalDays}
              </Typography>
              <Typography variant="subtitle2">Total Days</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e8f5e8', borderRadius: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                {paidDays}
              </Typography>
              <Typography variant="subtitle2">Paid Days</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#ffebee', borderRadius: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                {totalDays - paidDays}
              </Typography>
              <Typography variant="subtitle2">LWP Days</Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const SalaryBreakdownSection = () => (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {/* Earnings */}
      <Grid item xs={12} md={4}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#4caf50' }}>
              Earnings
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#e8f5e8' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Component</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {basic > 0 && (
                    <TableRow>
                      <TableCell>Basic Salary</TableCell>
                      <TableCell align="right">{formatNumber(basic)}</TableCell>
                    </TableRow>
                  )}
                  {hra > 0 && (
                    <TableRow>
                      <TableCell>House Rent Allowance</TableCell>
                      <TableCell align="right">{formatNumber(hra)}</TableCell>
                    </TableRow>
                  )}
                  {ta > 0 && (
                    <TableRow>
                      <TableCell>Transport Allowance</TableCell>
                      <TableCell align="right">{formatNumber(ta)}</TableCell>
                    </TableRow>
                  )}
                  {com > 0 && (
                    <TableRow>
                      <TableCell>Communication Allowance</TableCell>
                      <TableCell align="right">{formatNumber(com)}</TableCell>
                    </TableRow>
                  )}
                  {edu > 0 && (
                    <TableRow>
                      <TableCell>Education Allowance</TableCell>
                      <TableCell align="right">{formatNumber(edu)}</TableCell>
                    </TableRow>
                  )}
                  {medical > 0 && (
                    <TableRow>
                      <TableCell>Medical Allowance</TableCell>
                      <TableCell align="right">{formatNumber(medical)}</TableCell>
                    </TableRow>
                  )}
                  {sa > 0 && (
                    <TableRow>
                      <TableCell>Special Allowance</TableCell>
                      <TableCell align="right">{formatNumber(sa)}</TableCell>
                    </TableRow>
                  )}
                  <TableRow sx={{ bgcolor: '#e8f5e8' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Total Earnings</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatNumber(totalEarning)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Deductions */}
      <Grid item xs={12} md={4}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#f44336' }}>
              Deductions
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#ffebee' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Component</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {emppf > 0 && (
                    <TableRow>
                      <TableCell>Provident Fund ({pfEmployeePercent}%)</TableCell>
                      <TableCell align="right">{formatNumber(emppf)}</TableCell>
                    </TableRow>
                  )}
                  {empesi > 0 && (
                    <TableRow>
                      <TableCell>ESI ({esiEmployeePercent}%)</TableCell>
                      <TableCell align="right">{formatNumber(empesi)}</TableCell>
                    </TableRow>
                  )}
                  {incometax > 0 && (
                    <TableRow>
                      <TableCell>Income Tax (TDS)</TableCell>
                      <TableCell align="right">{formatNumber(incometax)}</TableCell>
                    </TableRow>
                  )}
                  {advancePay > 0 && (
                    <TableRow>
                      <TableCell>Advance/Loan</TableCell>
                      <TableCell align="right">{formatNumber(advancePay)}</TableCell>
                    </TableRow>
                  )}
                  {cltaken > 0 && (
                    <TableRow>
                      <TableCell>Casual Leave</TableCell>
                      <TableCell align="right">{formatNumber(cltaken)}</TableCell>
                    </TableRow>
                  )}
                  {eitaken > 0 && (
                    <TableRow>
                      <TableCell>Emergency Leave</TableCell>
                      <TableCell align="right">{formatNumber(eitaken)}</TableCell>
                    </TableRow>
                  )}
                  {lwptaken > 0 && (
                    <TableRow>
                      <TableCell>Loss of Pay</TableCell>
                      <TableCell align="right">{formatNumber(lwptaken)}</TableCell>
                    </TableRow>
                  )}
                  <TableRow sx={{ bgcolor: '#ffebee' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Total Deductions</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatNumber(totalDeduction)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Employer Contribution */}
      <Grid item xs={12} md={4}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#ff9800' }}>
              Employer Contribution
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#fff3e0' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Component</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employerPf > 0 && (
                    <TableRow>
                      <TableCell>Employer PF ({pfEmployerPercent}%)</TableCell>
                      <TableCell align="right">{formatNumber(employerPf)}</TableCell>
                    </TableRow>
                  )}
                  {employerEsi > 0 && (
                    <TableRow>
                      <TableCell>Employer ESI ({esiEmployerPercent}%)</TableCell>
                      <TableCell align="right">{formatNumber(employerEsi)}</TableCell>
                    </TableRow>
                  )}
                  <TableRow sx={{ bgcolor: '#fff3e0' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Total Contribution</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      {formatNumber((employerPf || 0) + (employerEsi || 0))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Reimbursements */}
            {(travelExpense > 0 || telephoneExpense > 0 || twoWheelerExpense > 0 || fourWheelerExpense > 0 || otherExpense > 0) && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#2196f3' }}>
                  Reimbursements
                </Typography>
                <Table size="small">
                  <TableBody>
                    {travelExpense > 0 && (
                      <TableRow>
                        <TableCell>Travel</TableCell>
                        <TableCell align="right">{formatNumber(travelExpense)}</TableCell>
                      </TableRow>
                    )}
                    {telephoneExpense > 0 && (
                      <TableRow>
                        <TableCell>Telephone</TableCell>
                        <TableCell align="right">{formatNumber(telephoneExpense)}</TableCell>
                      </TableRow>
                    )}
                    {twoWheelerExpense > 0 && (
                      <TableRow>
                        <TableCell>Vehicle (2W)</TableCell>
                        <TableCell align="right">{formatNumber(twoWheelerExpense)}</TableCell>
                      </TableRow>
                    )}
                    {fourWheelerExpense > 0 && (
                      <TableRow>
                        <TableCell>Vehicle (4W)</TableCell>
                        <TableCell align="right">{formatNumber(fourWheelerExpense)}</TableCell>
                      </TableRow>
                    )}
                    {otherExpense > 0 && (
                      <TableRow>
                        <TableCell>Others</TableCell>
                        <TableCell align="right">{formatNumber(otherExpense)}</TableCell>
                      </TableRow>
                    )}
                    <TableRow sx={{ bgcolor: '#e3f2fd' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Total Reimbursement</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatNumber(totalReimbursement)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const SalarySummary = () => (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
          Salary Summary
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3} sm={3}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e8f5e8', borderRadius: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                {formatCurrency(totalEarning)}
              </Typography>
              <Typography variant="subtitle2">Gross Earnings</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3} sm={3}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#ffebee', borderRadius: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                {formatCurrency(totalDeduction)}
              </Typography>
              <Typography variant="subtitle2">Total Deductions</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3} sm={3}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                {formatCurrency(totalReimbursement)}
              </Typography>
              <Typography variant="subtitle2">Reimbursements</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3} sm={3}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fff3e0', borderRadius: 1, border: '2px solid #ff9800' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                {formatCurrency(netCurrentSalary)}
              </Typography>
              <Typography variant="subtitle2">Net Take Home</Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Typography variant="b1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            Annual CTC: {formatCurrency(employeeCtc)}
          </Typography>
          <Typography variant="b1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            Monthly CTC: {formatCurrency(employeeCtc / 12)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const Footer = () => (
    <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #ddd' }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Payslip Generated on: {moment().format("dddd, Do MMMM YYYY")}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            This is a computer generated salary slip and does not require signature.
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            Confidential Document
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <>
      {showform && (
        <Box sx={{ position: 'relative', maxHeight: '90vh', overflow: 'auto' }}>
          {/* Header Controls */}
          <Box sx={{
            position: 'sticky',
            top: 0,
            bgcolor: 'white',
            zIndex: 1000,
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              sx={{ fontWeight: 'bold' }}
            >
              Print Payslip
            </Button>
            <IconButton onClick={onClick} size="large">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Printable Content */}
          <Box ref={componentRef} sx={{ p: 3, maxWidth: '210mm', margin: '0 auto', bgcolor: 'white' }}>
            <CompanyHeader />
            <EmployeeInfoSection />
            <AttendanceSection />
            <SalaryBreakdownSection />
            <SalarySummary />
            <Footer />
          </Box>

          {/* Bottom Action Buttons */}
          <Box sx={{
            position: 'sticky',
            bottom: 0,
            bgcolor: 'white',
            p: 2,
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            boxShadow: '0 -2px 4px rgba(0,0,0,0.1)'
          }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              size="large"
              sx={{ minWidth: 150 }}
            >
              Print Payslip
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={onClick}
              size="large"
              sx={{ minWidth: 150 }}
            >
              Close
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
}

export default PrintPayslip;