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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import TableRow from "@mui/material/TableRow";

export default function EditForm({ onClick, eventid }) {
  const baseURL = process.env.REACT_APP_API_URL;
  const [leavetype, setLeavetype] = useState("");
  const [selectedemp, setSelectedemp] = useState("");
  const [inhours, setIndays] = useState(468);
  const [indays, setInhours] = useState(52);
  const form = useRef();
  const formdata = useRef("");
  const username = usecdotStore((state) => state.username);
  const employees = usecdotStore((state) => state.employees);
  const [dateleavefrom, setDateleavefrom] = useState("");
  const [monthleavefrom, setMonthleavefrom] = useState("");
  const [yearleavefrom, setYearleavefrom] = useState("");
  const [dateleaveto, setDateleaveto] = useState("");
  const [monthleaveto, setMonthleaveto] = useState("");
  const [showform, setShowform] = useState(false);
  const [yearleaveto, setYearleaveto] = useState("");
  const emp_id = usecdotStore((state) => state.emp_id);
  const emp_department = usecdotStore((state) => state.emp_department);
  const updateLeave = usecdotStore((state) => state.updateLeave);

  useEffect(() => {
    console.log("editform: " + eventid);
    leaveEditApi();

    let todays_date = moment().format("DD-MM-YYYY");
    const dateArray = todays_date.split("-");

    setDateleavefrom(dateArray[0]);
    setMonthleavefrom(dateArray[1]);
    setYearleavefrom(dateArray[2]);
    setDateleaveto(dateArray[0]);
    setMonthleaveto(dateArray[1]);
    setYearleaveto(dateArray[2]);
  }, []);

  const leaveEditApi = async () => {
    // starting
    await axios
      .get(baseURL + "leave/" + eventid)
      .then(function (response) {
        formdata.current = response.data[0];
        console.log("kcheckpost " + JSON.stringify(formdata.current));
        setDateleavefrom(formdata.current.leave_from_date);
        setMonthleavefrom(formdata.current.leave_from_month);
        setYearleavefrom(formdata.current.leave_from_year);
        setDateleaveto(formdata.current.leave_to_date);
        setMonthleaveto(formdata.current.leave_to_month);
        setYearleaveto(formdata.current.leave_to_year);
        setLeavetype(formdata.current.leave_type);
        setSelectedemp(formdata.current.employee);
        formik.values.total_leave_in_days =
          formdata.current.total_leave_in_days;
        formik.values.total_leave_in_hours =
          formdata.current.total_leave_in_hours;
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
      username: username,
      leave_from_date: dateleavefrom,
      leave_from_month: monthleavefrom,
      leave_from_year: yearleavefrom,
      leave_to_date: dateleaveto,
      leave_to_month: monthleaveto,
      leave_to_year: yearleaveto,
      employee_id: emp_id,
      department_id: emp_department && typeof emp_department === 'object' ? emp_department.id : emp_department,
      leave_reason: formdata.current.leave_reason,
      total_leave_in_days: formdata.current.total_leave_in_days,
      total_leave_in_hours: formdata.current.total_leave_in_hours,
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
      formik.values.employee_id = emp_id;
      formik.values.department_id = emp_department && typeof emp_department === 'object' ? emp_department.id : emp_department;
      formik.values.leave_from_date = convert(dateleavefrom);
      formik.values.leave_from_month = monthleavefrom;
      formik.values.leave_from_year = yearleavefrom;
      formik.values.leave_to_date = convert(dateleaveto);
      formik.values.leave_to_month = monthleaveto;
      formik.values.leave_to_year = yearleaveto;
      formik.values.leave_type = leavetype;
      formik.values.remaining_leave_in_days = inhours;
      formik.values.remaining_leave_in_hours = indays;

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

  const handleLeavetypeChange = (event) => {
    setLeavetype(event.target.value);
  };

  const handleLeavefromdate = (event) => {
    setDateleavefrom(event.target.value);
  };
  const handleLeavefrommonth = (event) => {
    setMonthleavefrom(event.target.value);
  };
  const handleLeavefromyear = (event) => {
    setYearleavefrom(event.target.value);
  };
  const handleLeavetodate = (event) => {
    setDateleaveto(event.target.value);
  };
  const handleLeavetomonth = (event) => {
    setMonthleaveto(event.target.value);
  };
  const handleLeavetoyear = (event) => {
    setYearleaveto(event.target.value);
  };

  const clearForm = () => {
    formik.resetForm();
  };

  const handleEmployeeChange = (event) => {
    setSelectedemp(event.target.value);
  };

  const leaveApi = async () => {
    // starting
    await axios
      .get(baseURL + "leave/employee/" + username)
      .then(function (response) {
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
            Edit Leave
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
                <FormControl variant="standard" sx={{ minWidth: "92%" }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Leave Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    value={leavetype}
                    onChange={handleLeavetypeChange}
                  >
                    <MenuItem value={"Casual Leave"}>Casual Leave</MenuItem>
                    <MenuItem value={"Half Day Leave"}>Half Day Leave</MenuItem>
                    <MenuItem value={"Full Day Leave"}>Full Day Leave</MenuItem>
                    <MenuItem value={"Other Leave"}>Other Leave</MenuItem>
                  </Select>
                </FormControl>
                <Box sx={{ m: 2 }} />
                <TextField
                  label="Leave in Days"
                  variant="standard"
                  type="number"
                  name="total_leave_in_days"
                  onChange={formik.handleChange}
                  value={formik.values.total_leave_in_days}
                  sx={{ minWidth: "92%" }}
                />
                <Box sx={{ m: 2 }} />
                <TextField
                  label="Leave in Hours"
                  variant="standard"
                  type="number"
                  name="total_leave_in_hours"
                  onChange={formik.handleChange}
                  value={formik.values.total_leave_in_hours}
                  sx={{ minWidth: "92%" }}
                />
                <Box sx={{ m: 2 }} />
                <TextField
                  label="Leave Reason"
                  variant="standard"
                  name="leave_reason"
                  onChange={formik.handleChange}
                  value={formik.values.leave_reason}
                  sx={{ minWidth: "92%" }}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Box sx={{ m: 7 }} />
                <FormControl variant="standard" sx={{ minWidth: "47%" }}>
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
                <Box sx={{ m: 3 }} />
                <FormControl variant="standard" sx={{ minWidth: "47%" }}>
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
                <Box sx={{ m: 2 }} />
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 170 }} aria-label="simple table">
                    <TableBody>
                      <TableRow>
                        <TableCell align="left">
                          <Typography variant="p" className="font-bold">
                            Remaning leave in days:
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Typography variant="p" className="font-bold">
                            {indays} Days
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell align="left">
                          <Typography variant="p" className="font-bold">
                            Remaning leave in hours:
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Typography variant="p" className="font-bold">
                            {inhours} Hrs.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
            <Box sx={{ m: 4 }} />
            <Stack spacing={2} direction="row">
              <Button
                variant="contained"
                color="primary"
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
