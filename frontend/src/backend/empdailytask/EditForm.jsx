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
  const [selectedemp, setSelectedemp] = useState(1);
  const [taskmaanger, setTaskmaanger] = useState("");
  const [selectedtask, setSelectedtask] = useState("");
  const form = useRef();
  const updateDailytask = usecdotStore((state) => state.updateDailytask);
  const username = usecdotStore((state) => state.username);
  const employees = usecdotStore((state) => state.employees);
  const assignedjobs = usecdotStore((state) => state.assignedjobs);
  const [submissiondate, setSubmissiondate] = useState(new Date());
  const formdata = useRef("");
  const emp_id = usecdotStore((state) => state.emp_id);
  const emp_department = usecdotStore((state) => state.emp_department);
  const [btnEnabled, setButtonEnabled] = useState(true);
  const [showform, setShowform] = useState(false);

  useEffect(() => {
    if (selectedtask) {
      setButtonEnabled(false);
    }
    console.log("Emp id: " + emp_id + " username: " + username);
  }, [selectedtask]);

  useEffect(() => {
    dailytaskEditApi();
  }, []);

  const dailytaskEditApi = async () => {
    // starting
    await axios
      .get(baseURL + "daily-tasks/" + eventid)
      .then(function (response) {
        formdata.current = response.data[0];
        console.log("kcheckpost " + JSON.stringify(formdata.current));
        formik.values.task = response.data[0].task;
        formik.values.submission_date = response.data[0].submission_date;
        formik.values.manager = response.data[0].manager;
        formik.values.description = response.data[0].description;
        setSelectedtask(response.data[0].task);
        // setSelectedemp(response.data[0].manager);

        {
          employees.map((item, index) => {
            if (item.emp_name == response.data[0].manager) {
              setSelectedemp(item.id);
            }
          });
        }

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
      employee_id: emp_id,
      department_id: emp_department,
    },

    enableReinitialize: true,

    onSubmit: async (values) => {
      console.log(values);
      // Ensure employee_id is included in the submission data
      const submitData = {
        ...values,
        task: selectedtask,
        submission_date: submissiondate,
        manager: taskmaanger,
        department_id: emp_department,
        employee_id: emp_id,
        username: username
      };

      console.log("Submit Data: " + JSON.stringify(submitData));

      // starting
      await axios
        .put(baseURL + "daily-tasks/" + eventid, submitData)
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
          dailytaskApi();
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

  const handleTaskChange = (event) => {
    setSelectedtask(event.target.value);
  };

  const handleManagerChange = (event) => {
    setSelectedemp(event.target.value);
    employees.map((item, index) => {
      if (item.id == event.target.value) {
        console.log("username: " + item.emp_name);
        setTaskmaanger(item.emp_name);
      }
    });
  };

  const dailytaskApi = async () => {
    // starting
    await axios
      .get(baseURL + "daily-tasks/employee/" + username + "/")
      .then(function (response) {
        console.log("Daily Task: " + JSON.stringify(response.data));
        updateDailytask(response.data);
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
            Edit Daily Task
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
              <Grid item md={12} xs={12}>
                <TextField
                  label="Task"
                  variant="standard"
                  name="task"
                  value={selectedtask}
                  onChange={handleTaskChange}
                  sx={{ minWidth: "92%" }}
                />
                {/* <FormControl variant="standard" sx={{ minWidth: "92%" }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    task
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={selectedtask}
                    onChange={handleTaskChange}
                    label="User Type"
                  >
                    {assignedjobs.map((item, index) => {
                      return <MenuItem value={item.id}>{item.task}</MenuItem>;
                    })}
                  </Select>
                </FormControl> */}
                <Box sx={{ m: 2 }} />
                <FormControl variant="standard" sx={{ minWidth: "92%" }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Manager
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={selectedemp}
                    onChange={handleManagerChange}
                    label="Department"
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
                  label="Description"
                  variant="standard"
                  name="description"
                  onChange={formik.handleChange}
                  value={formik.values.description}
                  sx={{ minWidth: "92%" }}
                />
                <Box sx={{ m: 4 }} />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <FormControl variant="standard" sx={{ minWidth: "92%" }}>
                    <DatePicker
                      label="Submission Date"
                      inputFormat="DD/MM/YYYY"
                      value={submissiondate}
                      onChange={(newValue) => {
                        setSubmissiondate(newValue);
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
