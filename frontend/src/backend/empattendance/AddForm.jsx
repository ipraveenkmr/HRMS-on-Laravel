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
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

export default function AddForm({ onClick }) {
  const baseURL = process.env.REACT_APP_API_URL;
  const [attendancetype, setAttendancetype] = useState("Web");
  const [loginvalue, setLoginvalue] = useState("");
  const [logoutvalue, setLogoutvalue] = useState("");
  const [selectedemp, setSelectedemp] = useState("");
  const [loggedtime, setLoggedtime] = useState(0);
  const form = useRef();
  const username = usecdotStore((state) => state.username);
  const employees = usecdotStore((state) => state.employees);
  const emp_id = usecdotStore((state) => state.emp_id);
  const updateAttendance = usecdotStore((state) => state.updateAttendance);
  const [datelogin, setDatelogin] = useState(new Date());
  const [monthlogin, setMonthlogin] = useState("");
  const [yearlogin, setYearlogin] = useState("");
  const [btnEnabled, setButtonEnabled] = useState(true);
  const emp_department = usecdotStore((state) => state.emp_department);

  useEffect(() => {
    console.log("Working..." + attendancetype.length + " " + loginvalue.length);
    if (attendancetype.length > 1 && loginvalue.length > 1) {
      console.log("Working...");
      setButtonEnabled(false);
    }
  }, [attendancetype, loginvalue, datelogin]);

  const formik = useFormik({
    initialValues: {
      username: username,
      login_date: datelogin,
      login_month: monthlogin,
      login_year: yearlogin,
      employee: emp_id,
      department: emp_department,
    },

    enableReinitialize: true,

    onSubmit: async (values) => {
      function convert(str) {
        var date = new Date(str),
          mnth = ("0" + (date.getMonth() + 1)).slice(-2),
          day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
      }

      if (isNaN(loggedtime)) {
        toast.error("Invalid time!", {
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
        console.log("Login emp_department: " + emp_department);
        formik.values.attendance_date = convert(datelogin);
        formik.values.employee_id = emp_id;
        formik.values.attendance = "Web";
        formik.values.login_at = loginvalue;
        formik.values.log_time = parseFloat(loggedtime);
        formik.values.logout_at = logoutvalue;
        formik.values.login_date = convert(datelogin);
        formik.values.login_month = monthlogin;
        formik.values.login_year = yearlogin;
        formik.values.department_id = emp_department;
        // starting
        await axios
          .post(baseURL + "attendance", values)
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
            attendanceApi();
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
      }
    },
  });

  const handleAttendanceChange = (event) => {
    setAttendancetype(event.target.value);
  };

  const handleLogoutat = (event) => {
    setLogoutvalue(event.target.value);

    if (isNaN(loggedtime)) {
      toast.error("Invalid time!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        toastId: "id",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    console.log("Event: " + event);

    if (loginvalue) {
      console.log("login time: " + loginvalue);
      console.log("logout time: " + event.target.value);

      const loginArray = loginvalue.split(":");
      const logoutArray = event.target.value.split(":");

      const loginhour = loginArray[0];
      const loginmin = loginArray[1];
      const logouthour = logoutArray[0];
      const logoutmin = logoutArray[1];

      const hour = parseInt(logouthour) - parseInt(loginhour);
      const min = parseInt(logoutmin) - parseInt(loginmin);

      let mininhour = parseFloat(parseFloat(min) / 60) + parseInt(hour);

      setLoggedtime(mininhour.toFixed(2));

      console.log("hour: " + parseInt(hour));
      console.log("Min: " + parseInt(min));
      console.log("Min in hour: " + parseFloat(mininhour).toFixed(2));
    } else {
      toast.error("Log in time required!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        toastId: "id",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleLoginat = (event) => {
    setLoginvalue(event.target.value);
  };

  const clearForm = () => {
    formik.resetForm();
  };

  const attendanceApi = async () => {
    // starting
    await axios
      .get(baseURL + "attendance/employee/" + username)
      .then(function (response) {
        console.log("attendance: " + JSON.stringify(response.data));
        updateAttendance(response.data);
      })
      .catch(function (error) {
        console.log("kcheckpost" + error); //return 429
      });
    // ending
  };

  return (
    <>
      <div style={{ overflowY: "auto" }}>
        <Typography variant="h5" align="center">
          Add Details
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
              {/* <Box sx={{ m: 2 }} />
              <FormControl variant="standard" sx={{ minWidth: "92%" }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Attendance
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  value={attendancetype}
                  onChange={handleAttendanceChange}
                >
                  <MenuItem value={"Present"}>Present</MenuItem>
                  <MenuItem value={"Absent"}>Absent</MenuItem>
                  <MenuItem value={"Leave"}>Leave</MenuItem>
                  <MenuItem value={"Holiday"}>Holiday</MenuItem>
                </Select>
              </FormControl> */}
              <Box sx={{ m: 2 }} />
              <Stack spacing={2} direction="row">
                <FormControl variant="standard" sx={{ minWidth: "44%" }}>
                  <TextField
                    label="Login At"
                    variant="standard"
                    name="login_at"
                    onChange={handleLoginat}
                    value={loginvalue}
                    sx={{ minWidth: "92%" }}
                  />
                </FormControl>
                <FormControl variant="standard" sx={{ minWidth: "44%" }}>
                  <TextField
                    label="Logout At"
                    variant="standard"
                    name="logout_at"
                    onChange={handleLogoutat}
                    onBlur={handleLogoutat}
                    value={logoutvalue}
                    sx={{ minWidth: "92%" }}
                  />
                </FormControl>
              </Stack>
            </Grid>
            <Grid item md={6} xs={12}>
              <Box sx={{ m: 3 }} />
              <FormControl variant="standard" sx={{ minWidth: "47%" }}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DesktopDatePicker
                    label="Date"
                    inputFormat="DD/MM/YYYY"
                    value={datelogin}
                    onChange={(newValue) => {
                      setDatelogin(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField size="small" {...params} />
                    )}
                  />
                </LocalizationProvider>
              </FormControl>
              <Box sx={{ m: 2 }} />
              <Typography variant="p" className="font-bold">
                Total Logged Time: {loggedtime} Hrs.
              </Typography>
              <Box sx={{ m: 2 }} />
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
    </>
  );
}
