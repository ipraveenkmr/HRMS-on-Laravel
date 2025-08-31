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
  const [submissiondate, setSubmissiondate] = useState(new Date());
  const [selectedmanager, setSelectedmanager] = useState("");
  const [showform, setShowform] = useState(false);
  const [statustype, setStatustype] = useState("");
  const emp_id = usecdotStore((state) => state.emp_id);
  const formdata = useRef("");
  const [btnEnabled, setButtonEnabled] = useState(true);
  const emp_department = usecdotStore((state) => state.emp_department);
  const [image, setImage] = useState("");

  useEffect(() => {
    if (selectedmanager.length > 1 && statustype.length > 1) {
      setButtonEnabled(false);
    }
  }, [selectedmanager, statustype, submissiondate]);

  useEffect(() => {
    console.log("editform: " + eventid);
    taskEditApi();
  }, []);

  const taskEditApi = async () => {
    // starting
    await axios
      .get(baseURL + "tasks/" + eventid + "/")
      .then(function (response) {
        formdata.current = response.data[0];
        console.log("kcheckpost " + JSON.stringify(formdata.current));
        setSubmissiondate(formdata.current.submission_date);
        setSelectedmanager(formdata.current.manager);
        setStatustype(formdata.current.status);
        setSelectedemp(formdata.current.employee_id);
        formik.values.task = formdata.current.task;
        formik.values.task_time = formdata.current.task_time;
        formik.values.comment = formdata.current.comment;
        formik.values.description = formdata.current.description;
        setImage(formdata.current.document);
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
      task: formdata.current.task,
      username: username,
      employee_id: emp_id,
      department_id: emp_department,
    },

    enableReinitialize: true,

    onSubmit: async (values) => {
      console.log(values);
      
      // Create properly structured data for the API
      const submitData = {
        ...values,
        submission_date: submissiondate,
        status: statustype,
        employee_id: emp_id,
        manager: selectedmanager,
        document: image,
        department_id: emp_department,
        username: username
      };

      console.log("Submit Data: " + JSON.stringify(submitData));

      // starting
      await axios
        .put(baseURL + "tasks/" + eventid, submitData)
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

  const handleEmployeeChange = (event) => {
    setSelectedemp(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatustype(event.target.value);
  };

  const taskApi = async () => {
    // starting
    await axios
      .get(baseURL + "tasks/employee/" + username + "/")
      .then(function (response) {
        console.log("Tasks: " + JSON.stringify(response.data));
        updateAssignedjobs(response.data);
      })
      .catch(function (error) {
        console.log("kcheckpost" + error); //return 429
      });
    // ending
  };

  const uploadImage = async (e) => {
    function getExtension(filename) {
      return filename.split(".").pop();
    }

    const files = e.target.files;

    if (getExtension(files[0].name) == "zip") {
      const data = new FormData();
      data.append("file", files[0]);
      data.append("upload_preset", "ayjxmtmi");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/ddalmaqrk/raw/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const file = await res.json();

      setImage(file.secure_url);
    } else {
      const data = new FormData();
      data.append("file", files[0]);
      data.append("upload_preset", "ayjxmtmi");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/ddalmaqrk/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const file = await res.json();

      setImage(file.secure_url);
    }
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
                    Manager
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={selectedmanager}
                    onChange={handleManagerChange}
                    label="User Type"
                  >
                    {employees.map((item, index) => {
                      return (
                        <MenuItem value={item.emp_name}>
                          {item.emp_name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
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
              </Grid>
              <Grid item md={5} xs={12}>
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
                <p>Document</p>
                <Box sx={{ m: 1 }} />
                <TextField
                  variant="outlined"
                  type="file"
                  name="photo"
                  sx={{ minWidth: "92%" }}
                  onChange={uploadImage}
                />
                {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Submission Date"
                    inputFormat="DD/MM/YYYY"
                    value={submissiondate}
                    onChange={(newValue) => {
                      setSubmissiondate(newValue);
                    }}
                    renderInput={(params) => <TextField size="small" {...params} />}
                  />
                </LocalizationProvider> */}
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
