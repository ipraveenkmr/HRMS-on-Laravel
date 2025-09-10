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
  const form = useRef();
  const updateAssignedjobs = usecdotStore((state) => state.updateAssignedjobs);
  const username = usecdotStore((state) => state.username);
  const employees = usecdotStore((state) => state.employees);
  const deptemployees = usecdotStore((state) => state.deptemployees);
  const [submissiondate, setSubmissiondate] = useState("");
  const [selectedmanager, setSelectedmanager] = useState("");
  const updateEmpusername = usecdotStore((state) => state.updateEmpusername);
  const [showform, setShowform] = useState(false);
  const [statustype, setStatustype] = useState("");
  const [atask, setAtask] = useState("");
  const formdata = useRef("");
  const [btnEnabled, setButtonEnabled] = useState(true);
  const [dept, setDept] = useState("");

  useEffect(() => {
    if (
      statustype.length > 1
      ) {
      setButtonEnabled(false);
    }
  }, [selectedmanager]);

  useEffect(() => {
    console.log("editform: " + eventid);
    taskEditApi();
  }, []);

  const taskEditApi = async () => {
    // starting
    await axios
      .get(baseURL + "task/" + eventid + "/")
      .then(function (response) {
        formdata.current = response.data[0];
        console.log("kcheckpost " + JSON.stringify(formdata.current));
        setSubmissiondate(formdata.current.submission_date);
        setSelectedmanager(formdata.current.manager);
        setStatustype(formdata.current.status);
        setSelectedemp(formdata.current.employee);
        formik.values.task = formdata.current.task;
        setAtask(response.data[0].task);
        formik.values.task_time = formdata.current.task_time;
        formik.values.comment = formdata.current.comment;
        formik.values.description = formdata.current.description;
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
      task: atask,
    },

    enableReinitialize: true,

    onSubmit: async (values) => {
      console.log(values);
      formik.values.employee = selectedemp;
      formik.values.submission_date = submissiondate;
      formik.values.status = statustype;
      formik.values.manager = selectedmanager;
      formik.values.department = dept;

      console.log("Values: " + JSON.stringify(values));

      // starting
      await axios
        .post(baseURL + "tasks", values)
        .then(function (response) {
          console.log("Task post: " + JSON.stringify(response.data));
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
          taskApi();
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

  const handleManagerChange = (event) => {
    setSelectedmanager(event.target.value);
  };

  // const handleEmployeeChange = (event) => {
  //   setSelectedemp(event.target.value);
  // };
  const handleEmployeeChange = (event) => {
    setSelectedemp(event.target.value);
    employees.map((item, index) => {
      if (item.id == event.target.value) {
        updateEmpusername(item.username);
        setDept(item.department);
      }
    });
  };

  const handleStatusChange = (event) => {
    setStatustype(event.target.value);
  };

  const taskApi = async () => {
    // starting
    await axios
      .get(baseURL + "tasks")
      .then(function (response) {
        console.log("Tasks: " + JSON.stringify(response.data));
        updateAssignedjobs(response.data);
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
            Edit Task
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
              <Grid item md={7} xs={12}>
                <Box sx={{ m: 2 }} />
                <TextField
                  label="Task"
                  variant="standard"
                  name="task"
                  onChange={formik.handleChange}
                  value={formik.values.task}
                  sx={{ minWidth: "92%" }}
                />
                <Box sx={{ m: 2 }} />
                <Box sx={{ m: 2 }} />
                <FormControl variant="standard" sx={{ minWidth: "92%" }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Employee Name
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={selectedemp}
                    onChange={handleEmployeeChange}
                    label="User Type"
                  >
                    {deptemployees.map((item, index) => {
                      return (
                        <MenuItem value={item.id}>{item.emp_name}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <Box sx={{ m: 2 }} />
                <FormControl variant="standard" sx={{ minWidth: "92%" }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Manager
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={selectedmanager}
                    onChange={handleManagerChange}
                    label="User Type"
                  >
                    {deptemployees.map((item, index) => {
                      return (
                        <MenuItem value={item.emp_name}>
                          {item.emp_name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={5} xs={12}>
                <Box sx={{ m: 2 }} />
                <FormControl variant="standard" sx={{ minWidth: "92%" }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Task Status
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    value={statustype}
                    onChange={handleStatusChange}
                  >
                    <MenuItem value={"Pending"}>Pending</MenuItem>
                    <MenuItem value={"Active"}>Active</MenuItem>
                    <MenuItem value={"Completed"}>Completed</MenuItem>
                    <MenuItem value={"Rejected"}>Rejected</MenuItem>
                  </Select>
                </FormControl>
                <Box sx={{ m: 2 }} />
                <TextField
                  label="Description"
                  variant="standard"
                  name="description"
                  onChange={formik.handleChange}
                  value={formik.values.description}
                  sx={{ minWidth: "92%" }}
                />
                <Box sx={{ m: 2 }} />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Submission Date"
                    inputFormat="DD/MM/YYYY"
                    value={submissiondate}
                    onChange={(newValue) => {
                      setSubmissiondate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
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
