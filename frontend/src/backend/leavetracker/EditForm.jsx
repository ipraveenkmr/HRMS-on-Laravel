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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

export default function AddForm({ onClick, eventid, uname }) {
  const baseURL = process.env.REACT_APP_API_URL;
  const [leavestatus, setLeavestatus] = useState("");
  const [selectedemp, setSelectedemp] = useState("");
  const [remainingcldays, seRremainingClDays] = useState(0);
  const [remainingclhours, seRremainingClHours] = useState(0);
  const [remainingeidays, setRemainingEiDays] = useState(0);
  const [remainingeihours, setRemainingEiHours] = useState(0);
  const [remaininglwpdays, setRemainingLwpDays] = useState(0);
  const [remaininglwphours, setRemainingLwpHours] = useState(0);
  const [remainingmedicaldays, setRemainingMedicalDays] = useState(0);
  const [remainingmedicalhours, setRemainingMedicalHours] = useState(0);
  const [remainingotherdays, setRemainingOtherDays] = useState(0);
  const [remainingotherhours, setRemainingOtherHours] = useState(0);
  const [cldays, setCldays] = useState(0);
  const [clhours, setClhours] = useState(0);
  const [eidays, setEidays] = useState(0);
  const [eihours, setEihours] = useState(0);
  const [lwpdays, setLwpdays] = useState(0);
  const [lwphours, setLwphours] = useState(0);
  const [medicaldays, setMedicaldays] = useState(0);
  const [medicalhours, setMedicalhours] = useState(0);
  const [otherdays, setOtherdays] = useState(0);
  const [otherhours, setOtherhours] = useState(0);
  const form = useRef();
  const formdata = useRef("");
  const username = usecdotStore((state) => state.username);
  const employees = usecdotStore((state) => state.employees);
  const [dateleavefrom, setDateleavefrom] = useState(new Date());
  const [monthleavefrom, setMonthleavefrom] = useState("");
  const [yearleavefrom, setYearleavefrom] = useState("");
  const [dateleaveto, setDateleaveto] = useState(new Date());
  const [monthleaveto, setMonthleaveto] = useState("");
  const [lreason, setLreason] = useState("");
  const [btnEnabled, setButtonEnabled] = useState(true);
  const [yearleaveto, setYearleaveto] = useState("");
  const updateEmpusername = usecdotStore((state) => state.updateEmpusername);
  const workinghour = usecdotStore((state) => state.workinghour);
  const empusername = usecdotStore((state) => state.empusername);
  const updateLeave = usecdotStore((state) => state.updateLeave);
  const [showform, setShowform] = useState(false);
  const [dept, setDept] = useState("");

  useEffect(() => {
    leaveEditApi();
    leaveCalcApi();
  }, []);

  const leaveCalcApi = async () => {
    // starting
    await axios
      .get(baseURL + "leave/calculator/" + uname)
      .then(function (response) {
        seRremainingClDays(response.data[0].remaining_CL_Days);
        seRremainingClHours(response.data[0].remaining_CL_Hours);
        setRemainingEiDays(response.data[0].remaining_EI_Days);
        setRemainingEiHours(response.data[0].remaining_EI_Hours);
        setRemainingLwpDays(response.data[0].remaining_LWP_Days);
        setRemainingLwpHours(response.data[0].remaining_LWP_Hours);
        setRemainingMedicalDays(response.data[0].remaining_medical_leave_in_days);
        setRemainingMedicalHours(response.data[0].remaining_medical_leave_in_hours);
        setRemainingOtherDays(response.data[0].remaining_other_leave_in_days);
        setRemainingOtherHours(response.data[0].remaining_other_leave_in_hours);
      })
      .catch(function (error) {
        console.log("kcheckpost" + error); //return 429
      });
    // ending
  };

  const leaveEditApi = async () => {
    // starting
    await axios
      .get(baseURL + "leave/" + eventid)
      .then(function (response) {
        formdata.current = response.data[0];
        setDateleavefrom(formdata.current.leave_from_date);
        setMonthleavefrom(formdata.current.leave_from_month);
        setYearleavefrom(formdata.current.leave_from_year);
        setDateleaveto(formdata.current.leave_to_date);
        setMonthleaveto(formdata.current.leave_to_month);
        setYearleaveto(formdata.current.leave_to_year);
        setSelectedemp(formdata.current.employee);
        setLeavestatus(formdata.current.leave_status);
        setLreason(formdata.current.leave_reason);
        setCldays(formdata.current.CL_Days);
        setClhours(formdata.current.CL_Hours);
        setEidays(formdata.current.EI_Days);
        setEihours(formdata.current.EI_Hours);
        setLwpdays(formdata.current.LWP_Days);
        setLwphours(formdata.current.LWP_Hours);
        setMedicaldays(formdata.current.medical_leave_in_days);
        setMedicalhours(formdata.current.medical_leave_in_hours);
        setOtherdays(formdata.current.other_leave_in_days);
        setOtherhours(formdata.current.other_leave_in_hours);

        // Extract department_id from department object if it's an object, otherwise use the value directly
        const deptId = response.data[0].department && typeof response.data[0].department === 'object' 
          ? response.data[0].department.id 
          : response.data[0].department_id || response.data[0].department;
        setDept(deptId);
        formik.values.leave_reason = formdata.current.leave_reason;
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
      leave_from_date: dateleavefrom,
      leave_from_month: monthleavefrom,
      leave_from_year: yearleavefrom,
      leave_to_date: dateleaveto,
      leave_to_month: monthleaveto,
      leave_to_year: yearleaveto,
      department: dept,
    },

    enableReinitialize: true,

    onSubmit: async (values) => {
      function convert(str) {
        var date = new Date(str),
          mnth = ("0" + (date.getMonth() + 1)).slice(-2),
          day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
      }
      console.log(values);
      formik.values.username = empusername;
      formik.values.department_id = dept;
      formik.values.employee_id = selectedemp;
      formik.values.leave_from_date = convert(dateleavefrom);
      formik.values.leave_from_month = monthleavefrom;
      formik.values.leave_from_year = yearleavefrom;
      formik.values.leave_to_date = convert(dateleaveto);
      formik.values.leave_to_month = monthleaveto;
      formik.values.leave_to_year = yearleaveto;
      formik.values.leave_reason = lreason;
      formik.values.leave_status = leavestatus;
      formik.values.cl_days = cldays;
      formik.values.cl_hours = clhours;
      formik.values.ei_days = eidays;
      formik.values.ei_hours = eihours;
      formik.values.lwp_days = lwpdays;
      formik.values.lwp_hours = lwphours;
      formik.values.medical_leave_in_days = medicaldays;
      formik.values.medical_leave_in_hours = medicalhours;
      formik.values.other_leave_in_days = otherdays;
      formik.values.other_leave_in_hours = otherhours;

      // starting
      await axios
        .post(baseURL + "leave", values)
        .then(function (response) {
          console.log("Employee post: " + JSON.stringify(response.data));
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
          leaveApi();
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

  // useEffect(() => {
  //   setTlid(dayRef.current);
  //   setTlih(hourRef.current);
  // }, [hourRef.current]);

  useEffect(() => {
    if (leavestatus.length > 1) {
      setButtonEnabled(false);
    }
  }, [leavestatus, lreason]);

  const handleLeavetypeStatus = (event) => {
    setLeavestatus(event.target.value);
  };

  const clearForm = () => {
    formik.resetForm();
  };

  const handleEmployeeChange = (event) => {
    setSelectedemp(event.target.value);
    employees.map((item, index) => {
      if (item.id == event.target.value) {
        updateEmpusername(item.username);
        // Extract department_id from department object if it's an object, otherwise use the value directly
        const deptId = item.department && typeof item.department === 'object' 
          ? item.department.id 
          : item.department_id || item.department;
        setDept(deptId);
        console.log("username: " + item.username);
        console.log("department_id: " + deptId);
      }
    });
  };

  const checkCLdays = (event) => {
    console.log("Hours: " + event.target.value);
    setCldays(event.target.value);

    if (isNaN(event.target.value)) {
      toast.error("Invalid day!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        toastId: "id",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      let calculatedHours = parseFloat(
        workinghour * parseFloat(event.target.value)
      );
      setClhours(calculatedHours);
    }
  };
  const checkEIdays = (event) => {
    console.log("Hours: " + event.target.value);
    setEidays(event.target.value);

    if (isNaN(event.target.value)) {
      toast.error("Invalid day!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        toastId: "id",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      let calculatedHours = parseFloat(
        workinghour * parseFloat(event.target.value)
      );
      setEihours(calculatedHours);
    }
  };
  const checkLWPdays = (event) => {
    console.log("Hours: " + event.target.value);
    setLwpdays(event.target.value);

    if (isNaN(event.target.value)) {
      toast.error("Invalid day!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        toastId: "id",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      let calculatedHours = parseFloat(
        workinghour * parseFloat(event.target.value)
      );
      setLwphours(calculatedHours);
    }
  };
  const checkMedicaldays = (event) => {
    console.log("Hours: " + event.target.value);
    setMedicaldays(event.target.value);

    if (isNaN(event.target.value)) {
      toast.error("Invalid day!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        toastId: "id",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      let calculatedHours = parseFloat(
        workinghour * parseFloat(event.target.value)
      );
      setMedicalhours(calculatedHours);
    }
  };
  const checkOtherdays = (event) => {
    console.log("Hours: " + event.target.value);
    setOtherdays(event.target.value);

    if (isNaN(event.target.value)) {
      toast.error("Invalid day!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        toastId: "id",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      let calculatedHours = parseFloat(
        workinghour * parseFloat(event.target.value)
      );
      setOtherhours(calculatedHours);
    }
  };

  const handleLreason = (event) => {
    console.log("days: " + event.target.value);
    setLreason(event.target.value);
  };

  const leaveApi = async () => {
    // starting
    await axios
      .get(baseURL + "leave")
      .then(function (response) {
        console.log("leaves: " + JSON.stringify(response.data));
        updateLeave(response.data);
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
            Edit Leave(s)
          </Typography>
          <Box sx={{ m: 4 }} />
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
                <FormControl
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: "92%" }}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    Employee Name
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={selectedemp}
                    onChange={handleEmployeeChange}
                    InputProps={{
                      readOnly: true,
                    }}
                    disabled
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
                <FormControl
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: "92%" }}
                >
                  <InputLabel id="demo-leave-select-standard-label">
                    Leave Status
                  </InputLabel>
                  <Select
                    labelId="demo-leave-select-standard-label"
                    value={leavestatus}
                    onChange={handleLeavetypeStatus}
                  >
                    <MenuItem value={"Pending"}>Pending</MenuItem>
                    <MenuItem value={"Approved"}>Approved</MenuItem>
                    <MenuItem value={"Rejected"}>Rejected</MenuItem>
                  </Select>
                </FormControl>
                <Box sx={{ m: 2 }} />
                <TextField
                  label="Leave Reason"
                  variant="outlined"
                  size="small"
                  name="leave_reason"
                  onChange={handleLreason}
                  value={lreason}
                  sx={{ minWidth: "92%" }}
                />
                <Box sx={{ m: 2 }} />
                <FormControl variant="standard" sx={{ minWidth: "92%" }}>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DesktopDatePicker
                      label="Leave From"
                      inputFormat="DD/MM/YYYY"
                      value={dateleavefrom}
                      onChange={(newValue) => {
                        setDateleavefrom(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField size="small" {...params} />
                      )}
                    />
                  </LocalizationProvider>
                </FormControl>
                <Box sx={{ m: 2 }} />
                <FormControl variant="standard" sx={{ minWidth: "92%" }}>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DesktopDatePicker
                      label="Leave To"
                      inputFormat="DD/MM/YYYY"
                      value={dateleaveto}
                      onChange={(newValue) => {
                        setDateleaveto(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField size="small" {...params} />
                      )}
                    />
                  </LocalizationProvider>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12}>
                    <TextField
                      label="CL Days"
                      variant="outlined"
                      size="small"
                      type="number"
                      name="CL_Days"
                      onBlur={checkCLdays}
                      onChange={checkCLdays}
                      value={cldays}
                      sx={{ minWidth: "92%" }}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <TextField
                      label="CL Hours"
                      variant="outlined"
                      size="small"
                      type="number"
                      name="CL_Hours"
                      inputProps={{ readOnly: true }}
                      disabled
                      value={clhours}
                      sx={{ minWidth: "92%" }}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <TextField
                      label="Remaining Days"
                      variant="outlined"
                      size="small"
                      type="number"
                      name="remaining_CL_Days"
                      inputProps={{ readOnly: true }}
                      disabled
                      value={remainingcldays}
                      sx={{ minWidth: "92%" }}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <TextField
                      label="Remaining Hours"
                      variant="outlined"
                      size="small"
                      type="number"
                      name="remaining_CL_Hours"
                      inputProps={{ readOnly: true }}
                      disabled
                      value={remainingclhours}
                      sx={{ minWidth: "92%" }}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ m: 2 }} />
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12}>
                    <TextField
                      label="EI Days"
                      variant="outlined"
                      size="small"
                      type="number"
                      name="EI_Days"
                      onBlur={checkEIdays}
                      onChange={checkEIdays}
                      value={eidays}
                      sx={{ minWidth: "92%" }}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <TextField
                      label="EI Hours"
                      variant="outlined"
                      size="small"
                      type="number"
                      name="EI_Hours"
                      inputProps={{ readOnly: true }}
                      disabled
                      value={eihours}
                      sx={{ minWidth: "92%" }}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <TextField
                      label="Remaining Days"
                      variant="outlined"
                      size="small"
                      type="number"
                      name="remaining_EI_Hours"
                      inputProps={{ readOnly: true }}
                      disabled
                      value={remainingeidays}
                      sx={{ minWidth: "92%" }}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <TextField
                      label="Remaining Hours"
                      variant="outlined"
                      size="small"
                      type="number"
                      name="remaining_EI_Hours"
                      inputProps={{ readOnly: true }}
                      disabled
                      value={remainingeihours}
                      sx={{ minWidth: "92%" }}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ m: 2 }} />
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12}>
                    <TextField
                      label="LWP Days"
                      variant="outlined"
                      size="small"
                      type="number"
                      name="LWP_Days"
                      onBlur={checkLWPdays}
                      onChange={checkLWPdays}
                      value={lwpdays}
                      sx={{ minWidth: "92%" }}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <TextField
                      label="LWP Hours"
                      variant="outlined"
                      size="small"
                      type="number"
                      name="LWP_Hours"
                      inputProps={{ readOnly: true }}
                      disabled
                      value={lwphours}
                      sx={{ minWidth: "92%" }}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <TextField
                      label="Remaining Days"
                      variant="outlined"
                      size="small"
                      type="number"
                      name="remaining_LWP_Hours"
                      inputProps={{ readOnly: true }}
                      disabled
                      value={remaininglwpdays}
                      sx={{ minWidth: "92%" }}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <TextField
                      label="Remaining Hours"
                      variant="outlined"
                      size="small"
                      type="number"
                      name="remaining_LWP_Hours"
                      inputProps={{ readOnly: true }}
                      disabled
                      value={remaininglwphours}
                      sx={{ minWidth: "92%" }}
                    />
                  </Grid>
                </Grid>
                {/* <Box sx={{ m: 2 }} />
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12}>
                    <TextField
                      label="Medical Leave Days"
                      variant="outlined"
                      size="small"
                      type="number"
                      name="medical_leave_in_days"
                      onBlur={checkMedicaldays}
                      onChange={checkMedicaldays}
                      value={medicaldays}
                      sx={{ minWidth: "92%" }}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <TextField
                      label="Medical Leave Hours"
                      variant="outlined"
                      size="small"
                      type="number"
                      name="medical_leave_in_hours"
                      inputProps={{ readOnly: true }}
                      disabled
                      value={medicalhours}
                      sx={{ minWidth: "92%" }}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <TextField
                      label="Remaining Days"
                      variant="outlined"
                      size="small"
                      type="number"
                      name="remaining_medical_leave_in_days"
                      inputProps={{ readOnly: true }}
                      disabled
                      value={remainingmedicaldays}
                      sx={{ minWidth: "92%" }}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <TextField
                      label="Remaining Hours"
                      variant="outlined"
                      size="small"
                      type="number"
                      name="remaining_medical_leave_in_hours"
                      inputProps={{ readOnly: true }}
                      disabled
                      value={remainingmedicalhours}
                      sx={{ minWidth: "92%" }}
                    />
                  </Grid>
                </Grid> */}
                <Box sx={{ m: 2 }} />
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12}>
                    <TextField
                      label="Other Leave Days"
                      variant="outlined"
                      size="small"
                      type="number"
                      name="other_leave_in_days"
                      onBlur={checkOtherdays}
                      onChange={checkOtherdays}
                      value={otherdays}
                      sx={{ minWidth: "92%" }}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <TextField
                      label="Other Leave Hours"
                      variant="outlined"
                      size="small"
                      type="number"
                      name="other_leave_in_hours"
                      inputProps={{ readOnly: true }}
                      disabled
                      value={otherhours}
                      sx={{ minWidth: "92%" }}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <TextField
                      label="Remaining Days"
                      variant="outlined"
                      size="small"
                      type="number"
                      name="remaining_other_leave_in_hours"
                      inputProps={{ readOnly: true }}
                      disabled
                      value={remainingotherdays}
                      sx={{ minWidth: "92%" }}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <TextField
                      label="Remaining Hours"
                      variant="outlined"
                      size="small"
                      type="number"
                      name="remaining_other_leave_in_hours"
                      inputProps={{ readOnly: true }}
                      disabled
                      value={remainingotherhours}
                      sx={{ minWidth: "92%" }}
                    />
                  </Grid>
                </Grid>
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
