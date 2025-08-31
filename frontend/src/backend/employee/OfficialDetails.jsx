import { useState, useRef, useEffect } from "react";
import { TextField, Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usecdotStore } from "../../components/cdotStore";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useemployeeStore } from "../../components/employeeStore";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export default function OfficialDetails() {
  const departments = usecdotStore((state) => state.departments);
  const paygrades = usecdotStore((state) => state.paygrades);

  const isContractual = useemployeeStore((state) => state.isContractual);
  const updateIsContractual = useemployeeStore(
    (state) => state.updateIsContractual
  );

  const st_emp_no = useemployeeStore((state) => state.st_emp_no);
  const st_department = useemployeeStore((state) => state.st_department);
  const st_designation = useemployeeStore((state) => state.st_designation);
  const st_emp_type = useemployeeStore((state) => state.st_emp_type);
  const st_job_type = useemployeeStore((state) => state.st_job_type);
  const st_probation = useemployeeStore((state) => state.st_probation);
  const st_emp_file_no = useemployeeStore((state) => state.st_emp_file_no);
  const st_pf_account_no = useemployeeStore((state) => state.st_pf_account_no);
  const st_esi_account_no = useemployeeStore(
    (state) => state.st_esi_account_no
  );
  const st_status = useemployeeStore((state) => state.st_status);
  const st_full_and_final = useemployeeStore(
    (state) => state.st_full_and_final
  );
  const st_joining_date = useemployeeStore((state) => state.st_joining_date);
  const st_resignation_date = useemployeeStore(
    (state) => state.st_resignation_date
  );
  const st_last_working_day = useemployeeStore(
    (state) => state.st_last_working_day
  );
  const st_pay_grade = useemployeeStore((state) => state.st_pay_grade);
  const st_gross_salary = useemployeeStore((state) => state.st_gross_salary);
  const st_ctc = useemployeeStore((state) => state.st_ctc);
  const st_pf = useemployeeStore((state) => state.st_pf);
  const st_pf_employee_percent = useemployeeStore((state) => state.st_pf_employee_percent);
  const st_pf_employer_percent = useemployeeStore((state) => state.st_pf_employer_percent);
  const st_esi = useemployeeStore((state) => state.st_esi);
  const st_esi_employee_percent = useemployeeStore((state) => state.st_esi_employee_percent);
  const st_esi_employer_percent = useemployeeStore((state) => state.st_esi_employer_percent);
  const st_bank_name = useemployeeStore((state) => state.st_bank_name);
  const st_bank_account_no = useemployeeStore(
    (state) => state.st_bank_account_no
  );
  const st_ifsc_code = useemployeeStore((state) => state.st_ifsc_code);
  const st_branch = useemployeeStore((state) => state.st_branch);
  const st_bank_city = useemployeeStore((state) => state.st_bank_city);

  const updateStEmpNo = useemployeeStore((state) => state.updateStEmpNo);
  const updateStDepartment = useemployeeStore(
    (state) => state.updateStDepartment
  );
  const updateStDesignation = useemployeeStore(
    (state) => state.updateStDesignation
  );
  const updateStEmpType = useemployeeStore((state) => state.updateStEmpType);
  const updateStJobType = useemployeeStore((state) => state.updateStJobType);
  const updateStProbation = useemployeeStore(
    (state) => state.updateStProbation
  );
  const updateStFileNo = useemployeeStore((state) => state.updateStFileNo);
  const updateStPfAccountNo = useemployeeStore(
    (state) => state.updateStPfAccountNo
  );
  const updateStEsiAccountNo = useemployeeStore(
    (state) => state.updateStEsiAccountNo
  );
  const updateUanNumber = useemployeeStore(
    (state) => state.updateUanNumber
  );
  const updateStStatus = useemployeeStore((state) => state.updateStStatus);
  const updateStFullNfinal = useemployeeStore(
    (state) => state.updateStFullNfinal
  );
  const updateStJoiningdate = useemployeeStore(
    (state) => state.updateStJoiningdate
  );
  const updateStResignationdate = useemployeeStore(
    (state) => state.updateStResignationdate
  );
  const updateStLastWorkingDay = useemployeeStore(
    (state) => state.updateStLastWorkingDay
  );
  const updateStPayGrade = useemployeeStore((state) => state.updateStPayGrade);
  const updateStGrossSalary = useemployeeStore(
    (state) => state.updateStGrossSalary
  );
  const updateStCtc = useemployeeStore(
    (state) => state.updateStCtc
  );
  const updateStPf = useemployeeStore((state) => state.updateStPf);
  const updateStPfEmployeePercent = useemployeeStore((state) => state.updateStPfEmployeePercent);
  const updateStPfEmployerPercent = useemployeeStore((state) => state.updateStPfEmployerPercent);
  const updateStEsi = useemployeeStore((state) => state.updateStEsi);
  const updateStEsiEmployeePercent = useemployeeStore((state) => state.updateStEsiEmployeePercent);
  const updateStEsiEmployerPercent = useemployeeStore((state) => state.updateStEsiEmployerPercent);
  const updateStBankName = useemployeeStore((state) => state.updateStBankName);
  const updateStBankAccountNo = useemployeeStore(
    (state) => state.updateStBankAccountNo
  );
  const updateStIfscCode = useemployeeStore((state) => state.updateStIfscCode);
  const updateStBranch = useemployeeStore((state) => state.updateStBranch);
  const updateStBankCity = useemployeeStore((state) => state.updateStBankCity);
  const updateBasicPay = useemployeeStore((state) => state.updateBasicPay);
  const isbasicpay = useemployeeStore((state) => state.isbasicpay);
  const uannumber = useemployeeStore((state) => state.uannumber);

  const handleUpdateStEmpNo = (event) => {
    updateStEmpNo(event.target.value);
    if (!event.target.value) {
      alertuser("Emp no.");
    }
  };
  const handleUpdateStDepartment = (event) => {
    updateStDepartment(event.target.value);
    if (!event.target.value) {
      alertuser("Department");
    }
  };
  const handleUpdateStDesignation = (event) => {
    updateStDesignation(event.target.value);
  };
  const handleUpdateStEmpType = (event) => {
    updateStEmpType(event.target.value);
    if (!event.target.value) {
      alertuser("Emp type");
    }
  };
  const handleUpdateStJobType = (event) => {
    if (event.target.value == "Contractual") {
      updateIsContractual(true);
    } else {
      updateIsContractual(false);
    }
    updateStJobType(event.target.value);
  };
  const handleUpdateStProbation = (event) => {
    updateStProbation(event.target.value);
  };
  const handleUpdateStFileNo = (event) => {
    updateStFileNo(event.target.value);
  };
  const handleUpdateStPfAccountNo = (event) => {
    updateStPfAccountNo(event.target.value);
  };
  const handleUpdateStEsiAccountNo = (event) => {
    updateStEsiAccountNo(event.target.value);
  };
  const handleUpdateUanNo = (event) => {
    updateUanNumber(event.target.value);
  };
  const handleUpdateStStatus = (event) => {
    updateStStatus(event.target.value);
  };
  const handleUpdateStFullNfinal = (event) => {
    updateStFullNfinal(event.target.value);
  };
  const handleUpdateStJoiningdate = (event) => {
    updateStJoiningdate(event.target.value);
  };
  const handleUpdateStResignationdate = (event) => {
    updateStResignationdate(event.target.value);
  };
  const handleUpdateStLastWorkingDay = (event) => {
    updateStLastWorkingDay(event.target.value);
  };
  // const handleUpdateStJoiningdate = (newValue) => {
  //   updateStJoiningdate(newValue);
  // };
  // const handleUpdateStResignationdate = (newValue) => {
  //   updateStResignationdate(newValue);
  // };
  // const handleUpdateStLastWorkingDay = (newValue) => {
  //   updateStLastWorkingDay(newValue);
  // };
  const handleUpdateStPayGrade = (event) => {
    updateStPayGrade(event.target.value);
    if (!event.target.value) {
      alertuser("Pay grade");
    }
  };
  const handleUpdateStGrossSalary = (event) => {
    updateStGrossSalary(event.target.value);
  };
  const handleUpdateStCtc = (event) => {
    updateStCtc(event.target.value);
  };
  const handleUpdateStPf = (event) => {
    updateStPf(event.target.value);
  };
  const handleUpdateStPfEmployeePercent = (event) => {
    updateStPfEmployeePercent(event.target.value);
  };
  const handleUpdateStPfEmployerPercent = (event) => {
    updateStPfEmployerPercent(event.target.value);
  };
  const handleUpdateStEsi = (event) => {
    updateStEsi(event.target.value);
  };
  const handleUpdateStEsiEmployeePercent = (event) => {
    updateStEsiEmployeePercent(event.target.value);
  };
  const handleUpdateStEsiEmployerPercent = (event) => {
    updateStEsiEmployerPercent(event.target.value);
  };
  const handleUpdateStBankName = (event) => {
    updateStBankName(event.target.value);
  };
  const handleUpdateStBankAccountNo = (event) => {
    updateStBankAccountNo(event.target.value);
  };
  const handleUpdateStIfscCode = (event) => {
    updateStIfscCode(event.target.value);
  };
  const handleUpdateStBranch = (event) => {
    updateStBranch(event.target.value);
  };
  const handleUpdateStBankCity = (event) => {
    updateStBankCity(event.target.value);
  };
  const handleBasicPayFilterChange = (event) => {
    updateBasicPay(event.target.checked);
  };

  const alertuser = (data) => {
    toast.error(data + " can't be empty!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      toastId: "id",
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <>
      <div style={{ overflowY: "auto" }}>
        <Box sx={{ m: 3 }} />
        <Grid container spacing={2}>
          <Grid item md={4} xs={12}>
            <TextField
              label="Emp No*"
              variant="outlined"
              size="small"
              name="emp_no"
              value={st_emp_no}
              onBlur={handleUpdateStEmpNo}
              onChange={handleUpdateStEmpNo}
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <FormControl
              variant="outlined"
              size="small"
              sx={{ minWidth: "92%" }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                Pay Grade*
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                value={st_pay_grade}
                onBlur={handleUpdateStPayGrade}
                onChange={handleUpdateStPayGrade}
              >
                {paygrades.map((item, index) => {
                  return <MenuItem value={item.id}>{item.grade}</MenuItem>;
                })}
              </Select>
            </FormControl>
            <Box sx={{ m: 2 }} />
            <FormControl
              variant="outlined"
              size="small"
              sx={{ minWidth: "92%" }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                Department*
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={st_department}
                onBlur={handleUpdateStDepartment}
                onChange={handleUpdateStDepartment}
                label="User Type"
              >
                {departments.map((item, index) => {
                  return (
                    <MenuItem value={item.id}>{item.department_name}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <Box sx={{ m: 2 }} />
            <TextField
              label="Designation"
              variant="outlined"
              size="small"
              name="designation"
              value={st_designation}
              onChange={handleUpdateStDesignation}
              onBlur={handleUpdateStDesignation}
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <FormControl
              variant="outlined"
              size="small"
              sx={{ minWidth: "92%" }}
            >
              <InputLabel id="emptype-label">Emp Type*</InputLabel>
              <Select
                labelId="emptype-label"
                label="Emp Type*"
                value={st_emp_type}
                onBlur={handleUpdateStEmpType}
                onChange={handleUpdateStEmpType}
              >
                <MenuItem value={"Employee"}>Employee</MenuItem>
                <MenuItem value={"Manager"}>Manager</MenuItem>
                <MenuItem value={"Asset Admin"}>Asset Admin</MenuItem>
                <MenuItem value={"Admin"}>Admin</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ m: 2 }} />
            <TextField
              label="PF Account No / UAN"
              variant="outlined"
              size="small"
              name="pf_account_number_uan"
              value={st_pf_account_no}
              onChange={handleUpdateStPfAccountNo}
              onBlur={handleUpdateStPfAccountNo}
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <TextField
              label="UAN No"
              variant="outlined"
              size="small"
              value={uannumber}
              onChange={handleUpdateUanNo}
              onBlur={handleUpdateUanNo}
              name="esi_account_number"
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <TextField
              label="ESI Account No"
              variant="outlined"
              size="small"
              value={st_esi_account_no}
              onChange={handleUpdateStEsiAccountNo}
              onBlur={handleUpdateStEsiAccountNo}
              name="esi_account_number"
              sx={{ minWidth: "92%" }}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl
              variant="outlined"
              size="small"
              sx={{ minWidth: "92%" }}
            >
              <InputLabel id="jobtype-label">Job Type*</InputLabel>
              <Select
                labelId="jobtype-label"
                value={st_job_type}
                onChange={handleUpdateStJobType}
                onBlur={handleUpdateStJobType}
                label="Job Type"
              >
                <MenuItem value={"Pemanent"}>Permanent</MenuItem>
                <MenuItem value={"Contractual"}>Contractual</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ m: 2 }} />
            {isContractual && (
              <TextField
                label="Probation Period in Month"
                variant="outlined"
                size="small"
                name="probation_period_in_month"
                value={st_probation}
                onChange={handleUpdateStProbation}
                onBlur={handleUpdateStProbation}
                sx={{ minWidth: "92%" }}
              />
            )}
            <Box sx={{ m: 2 }} />
            <TextField
              label="EMP File No"
              variant="outlined"
              size="small"
              value={st_emp_file_no}
              onChange={handleUpdateStFileNo}
              onBlur={handleUpdateStFileNo}
              name="emp_file_no"
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <FormControl
              variant="outlined"
              size="small"
              sx={{ minWidth: "92%" }}
            >
              <InputLabel id="staus-label">Status*</InputLabel>
              <Select
                labelId="status-label"
                label="Status"
                value={st_status}
                onChange={handleUpdateStStatus}
                onBlur={handleUpdateStStatus}
              >
                <MenuItem value={"Working"}>Working</MenuItem>
                <MenuItem value={"Resigned"}>Resigned</MenuItem>
                <MenuItem value={"Notice Period"}>Notice Period</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ m: 2 }} />
            <FormControl
              variant="outlined"
              size="small"
              sx={{ minWidth: "92%" }}
            >
              <InputLabel id="staus-label">F & F Status</InputLabel>
              <Select
                labelId="status-label"
                label="F & F Status"
                value={st_full_and_final}
                onChange={handleUpdateStFullNfinal}
                onBlur={handleUpdateStFullNfinal}
              >
                <MenuItem value={"Pending"}>Pending</MenuItem>
                <MenuItem value={"Completed"}>Completed</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ m: 1 }} />
            <InputLabel htmlFor="my-input">Joining Date</InputLabel>
            <TextField
              variant="outlined"
              name="emp_joining_date"
              type="date"
              value={st_joining_date}
              onChange={handleUpdateStJoiningdate}
              onBlur={handleUpdateStJoiningdate}
              size="small"
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 1 }} />
            <InputLabel htmlFor="my-input">Resignation Date</InputLabel>
            <TextField
              variant="outlined"
              name="emp_resignation_date"
              type="date"
              value={st_resignation_date}
              onChange={handleUpdateStResignationdate}
              onBlur={handleUpdateStResignationdate}
              size="small"
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 1 }} />
            <InputLabel htmlFor="my-input">Last Working Day</InputLabel>
            <TextField
              variant="outlined"
              name="emp_last_working_date"
              type="date"
              value={st_last_working_day}
              onChange={handleUpdateStLastWorkingDay}
              onBlur={handleUpdateStLastWorkingDay}
              size="small"
              sx={{ minWidth: "92%" }}
            />
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
              <FormControl variant="outlined" sx={{ minWidth: "92%" }}>
                <MobileDatePicker
                  label="Joining Date"
                  inputFormat="DD/MM/YYYY"
                  name="emp_joining_date"
                  variant="outlined"
                  size="small"
                  value={st_joining_date}
                  onChange={handleUpdateStJoiningdate}
                  onBlur={handleUpdateStJoiningdate}
                  sx={{ minWidth: "92%" }}
                  renderInput={(params) => (
                    <TextField size="small" {...params} />
                  )}
                />
              </FormControl>
              <Box sx={{ m: 2 }} />
              <FormControl variant="outlined" sx={{ minWidth: "92%" }}>
                <MobileDatePicker
                  label="Resignation Date"
                  inputFormat="DD/MM/YYYY"
                  name="emp_resignation_date"
                  variant="outlined"
                  size="small"
                  value={st_resignation_date}
                  onChange={handleUpdateStResignationdate}
                  onBlur={handleUpdateStResignationdate}
                  sx={{ minWidth: "92%" }}
                  renderInput={(params) => (
                    <TextField size="small" {...params} />
                  )}
                />
              </FormControl>
              <Box sx={{ m: 2 }} />
              <FormControl variant="outlined" sx={{ minWidth: "92%" }}>
                <MobileDatePicker
                  label="Last Working Day"
                  inputFormat="DD/MM/YYYY"
                  name="emp_last_working_date"
                  variant="outlined"
                  size="small"
                  value={st_last_working_day}
                  onChange={handleUpdateStLastWorkingDay}
                  onBlur={handleUpdateStLastWorkingDay}
                  sx={{ minWidth: "92%" }}
                  renderInput={(params) => (
                    <TextField size="small" {...params} />
                  )}
                />
              </FormControl>
            </LocalizationProvider> */}
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              label="CTC*"
              type="number"
              variant="outlined"
              size="small"
              value={st_ctc}
              onBlur={handleUpdateStCtc}
              onChange={handleUpdateStCtc}
              name="ctc"
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <div style={{display: "flex"}}>
              {/* <TextField
                label="PF (in %)"
                type="number"
                variant="outlined"
                size="small"
                value={st_pf}
                onBlur={handleUpdateStPf}
                onChange={handleUpdateStPf}
                name="st_pf"
                sx={{ minWidth: "42%" }}
              /> */}
               {/* <Box sx={{ m: 2 }} /> */}
              <span>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isbasicpay}
                        onChange={handleBasicPayFilterChange}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    }

                    label="PF Deduction On Basic Pay"
                  />
                </FormGroup>
              </span>

            </div>
            <Box sx={{ m: 2 }} />
            <TextField
              label="PF Employee (%)"
              type="number"
              variant="outlined"
              size="small"
              value={st_pf_employee_percent}
              onBlur={handleUpdateStPfEmployeePercent}
              onChange={handleUpdateStPfEmployeePercent}
              name="pf_employee_percent"
              inputProps={{ step: "0.01", min: "0", max: "100" }}
              sx={{ minWidth: "45%", marginRight: "2%" }}
            />
            <TextField
              label="PF Employer (%)"
              type="number"
              variant="outlined"
              size="small"
              value={st_pf_employer_percent}
              onBlur={handleUpdateStPfEmployerPercent}
              onChange={handleUpdateStPfEmployerPercent}
              name="pf_employer_percent"
              inputProps={{ step: "0.01", min: "0", max: "100" }}
              sx={{ minWidth: "45%" }}
            />
            <Box sx={{ m: 2 }} />
            {/* <TextField
              label="ESI (in %)"
              type="number"
              variant="outlined"
              size="small"
              value={st_esi}
              onBlur={handleUpdateStEsi}
              onChange={handleUpdateStEsi}
              name="st_esi"
              sx={{ minWidth: "92%" }}
            /> */}
            <Box sx={{ m: 2 }} />
            <TextField
              label="ESI Employee (%)"
              type="number"
              variant="outlined"
              size="small"
              value={st_esi_employee_percent}
              onBlur={handleUpdateStEsiEmployeePercent}
              onChange={handleUpdateStEsiEmployeePercent}
              name="esi_employee_percent"
              inputProps={{ step: "0.01", min: "0", max: "100" }}
              sx={{ minWidth: "45%", marginRight: "2%" }}
            />
            <TextField
              label="ESI Employer (%)"
              type="number"
              variant="outlined"
              size="small"
              value={st_esi_employer_percent}
              onBlur={handleUpdateStEsiEmployerPercent}
              onChange={handleUpdateStEsiEmployerPercent}
              name="esi_employer_percent"
              inputProps={{ step: "0.01", min: "0", max: "100" }}
              sx={{ minWidth: "45%" }}
            />
            <Box sx={{ m: 2 }} />
            <TextField
              label="Bank Name"
              variant="outlined"
              size="small"
              name="bank_name"
              value={st_bank_name}
              onChange={handleUpdateStBankName}
              onBlur={handleUpdateStBankName}
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <TextField
              label="Bank Account Number"
              variant="outlined"
              size="small"
              value={st_bank_account_no}
              onChange={handleUpdateStBankAccountNo}
              onBlur={handleUpdateStBankAccountNo}
              type="number"
              name="bank_account_number"
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <TextField
              label="IFSC Code"
              variant="outlined"
              size="small"
              value={st_ifsc_code}
              onChange={handleUpdateStIfscCode}
              onBlur={handleUpdateStIfscCode}
              name="ifsc_code"
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <TextField
              label="Branch"
              variant="outlined"
              size="small"
              value={st_branch}
              onChange={handleUpdateStBranch}
              onBlur={handleUpdateStBranch}
              name="branch"
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <TextField
              label="Bank City"
              variant="outlined"
              size="small"
              value={st_bank_city}
              onChange={handleUpdateStBankCity}
              onBlur={handleUpdateStBankCity}
              name="bank_city"
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
          </Grid>
        </Grid>
      </div>
    </>
  );
}
