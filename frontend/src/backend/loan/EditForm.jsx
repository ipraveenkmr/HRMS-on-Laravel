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

export default function EditForm({ onClick, eventid }) {
  const baseURL = process.env.REACT_APP_API_URL;
  const [selectedemp, setSelectedemp] = useState("");
  const [empdepartment, setEmpdepartment] = useState("");
  const form = useRef();
  const updateLoan = usecdotStore((state) => state.updateLoan);
  const username = usecdotStore((state) => state.username);
  const employees = usecdotStore((state) => state.employees);
  const [applydate, setApplydate] = useState(new Date());
  const [statustype, setStatustype] = useState("");
  const updateEmpusername = usecdotStore((state) => state.updateEmpusername);
  const empusername = usecdotStore((state) => state.empusername);
  const formdata = useRef("");
  const [showform, setShowform] = useState(false);
  const [btnEnabled, setButtonEnabled] = useState(true);

  useEffect(() => {
    if (statustype.length > 1) {
      setButtonEnabled(false);
    }
  }, [statustype, applydate]);

  useEffect(() => {
    console.log("editform: " + eventid);
    loanEditApi();
  }, []);

  const loanEditApi = async () => {
    // starting
    await axios
      .get(baseURL + "loan/" + eventid)
      .then(function (response) {
        formdata.current = response.data[0];
        console.log("kcheckpost " + JSON.stringify(formdata.current));
        setApplydate(formdata.current.apply_date);
        setStatustype(formdata.current.status);
        setSelectedemp(formdata.current.employee);
        setEmpdepartment(formdata.current.department);
        formik.values.purpose = formdata.current.purpose;
        formik.values.loan_amount = formdata.current.loan_amount;
        formik.values.loan_period_in_month =
          formdata.current.loan_period_in_month;
        setShowform(true);
      })
      .catch(function (error) {
        console.log("kcheckpost" + error); //return 429
      });
    // ending
  };

  const formik = useFormik({
    initialValues: {
      id: eventid,
      username: username,
      employee_id: selectedemp,
      apply_date: applydate,
      department_id: empdepartment,
      loan_amount: formdata.current.loan_amount,
      loan_period_in_month: formdata.current.loan_period_in_month,
    },

    enableReinitialize: true,

    onSubmit: async (values) => {
      console.log(values);
      formik.values.status = statustype;

      console.log("Values: " + JSON.stringify(values));

      // starting
      await axios
        .post(baseURL + "loans", values)
        .then(function (response) {
          console.log("Loan post: " + JSON.stringify(response.data));
          toast.success("Your data is submitted!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            toastId: "id",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          loanApi();
          onClick();
        })
        .catch(function (error) {
          console.log("kcheckpost" + error); //return 429
          toast.error("Something went wrong!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            toastId: "id",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
      // ending
      // formik.resetForm();
    },
  });

  const clearForm = () => {
    formik.resetForm();
  };

  const handleEmployeeChange = (event) => {
    setSelectedemp(event.target.value);
    employees.map((item, index) => {
      if (item.id == event.target.value) {
        updateEmpusername(item.username);
        setEmpdepartment(item.department);
        console.log("username: " + item.username);
      }
    });
  };

  const handleStatusChange = (event) => {
    setStatustype(event.target.value);
  };

  const loanApi = async () => {
    // starting
    await axios
      .get(baseURL + "loans")
      .then(function (response) {
        console.log("Loans: " + JSON.stringify(response.data));
        updateLoan(response.data);
      })
      .catch(function (error) {
        console.log("kcheckpost" + error); //return 429
      });
    // ending
  };

  return (
    <>
      {showform && (
        <div style={{ overflowY: "auto" }}>
          <Typography variant="h5" align="center">
            Edit Loan
          </Typography>
          <IconButton
            style={{ position: "absolute", top: "0", right: "0" }}
            onClick={onClick}
          >
            <CloseIcon />
          </IconButton>
          <form ref={form}>
            <Box sx={{ m: 2 }} />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12}>
                <Box sx={{ m: 2 }} />
                <FormControl
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: "92%" }}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    Emp Name
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    inputProps={{ readOnly: true }}
                    value={selectedemp}
                    disabled
                    onChange={handleEmployeeChange}
                    label="User Type"
                  >
                    {employees.map((item, index) => {
                      return (
                        <MenuItem value={item.id}>{item.emp_name}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <Box sx={{ m: 2 }} />
                <TextField
                  label="Loan Amount"
                  type="number"
                  inputProps={{ readOnly: true }}
                  variant="outlined"
                  size="small"
                  disabled
                  name="loan_amount"
                  onChange={formik.handleChange}
                  value={formik.values.loan_amount}
                  sx={{ minWidth: "92%" }}
                />
                <Box sx={{ m: 2 }} />
                <TextField
                  label="Loan period in month"
                  variant="outlined"
                  inputProps={{ readOnly: true }}
                  size="small"
                  disabled
                  type="number"
                  name="loan_period_in_month"
                  onChange={formik.handleChange}
                  value={formik.values.loan_period_in_month}
                  sx={{ minWidth: "92%" }}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Box sx={{ m: 2 }} />
                <FormControl
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: "92%" }}
                >
                  <InputLabel id="demo-simple-loan-standard-label">
                    Loan Status
                  </InputLabel>
                  <Select
                    labelId="demo-simple-loan-standard-label"
                    id="demo-simple-select-standard"
                    label="Status"
                    value={statustype}
                    onChange={handleStatusChange}
                  >
                    <MenuItem value={"Active"}>Active</MenuItem>
                    <MenuItem value={"Completed"}>Completed</MenuItem>
                  </Select>
                </FormControl>
                <Box sx={{ m: 2 }} />
                <TextField
                  label="Purpose"
                  variant="outlined"
                  size="small"
                  name="purpose"
                  onChange={formik.handleChange}
                  value={formik.values.purpose}
                  sx={{ minWidth: "92%" }}
                />
                <Box sx={{ m: 4 }} />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <FormControl variant="standard" sx={{ minWidth: "92%" }}>
                    <DatePicker
                      label="Apply Date"
                      inputFormat="DD/MM/YYYY"
                      disabled
                      value={applydate}
                      onChange={(newValue) => {
                        setApplydate(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField size="small" {...params} />
                      )}
                    />
                  </FormControl>
                </LocalizationProvider>
              </Grid>
            </Grid>
            <Box sx={{ m: 4 }} />
            <Stack spacing={2} direction="row">
              <Button
                variant="contained"
                color="primary"
                disabled={btnEnabled}
                onClick={formik.handleSubmit}
              >
                Save
              </Button>
              <Button
                variant="contained"
                color="error"
                className="mx-3"
                onClick={onClick}
              >
                Close
              </Button>
            </Stack>
          </form>
        </div>
      )}
    </>
  );
}
