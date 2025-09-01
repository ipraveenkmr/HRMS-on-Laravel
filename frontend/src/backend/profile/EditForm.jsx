import { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import { Typography, TextField, Button, Box, Tabs, Tab } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Stack from "@mui/material/Stack";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { usecdotStore } from "../../components/cdotStore";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const validate = (values) => {
  const errors = {};
  if (!values.emp_name) {
    errors.emp_name = "Required";
  } else if (values.emp_name.length < 3) {
    errors.emp_name = "Must be 3 characters or more";
  }
  return errors;
};

const validatePassword = (values) => {
  const errors = {};
  if (!values.currentPassword) {
    errors.currentPassword = "Current password is required";
  }
  if (!values.newPassword) {
    errors.newPassword = "New password is required";
  } else if (values.newPassword.length < 8) {
    errors.newPassword = "Password must be at least 8 characters";
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirm password is required";
  } else if (values.newPassword !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }
  return errors;
};

const validateAccount = (values) => {
  const errors = {};
  if (!values.username) {
    errors.username = "Username is required";
  } else if (values.username.length < 3) {
    errors.username = "Username must be at least 3 characters";
  }
  if (!values.emp_email) {
    errors.emp_email = "Email is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.emp_email)) {
    errors.emp_email = "Invalid email address";
  }
  return errors;
};

export default function EditForm({ onClick, eventid }) {
  const baseURL = process.env.REACT_APP_API_URL;
  const [departmenttype, setDepartmenttype] = useState("");
  const [usernametype, setUsernametype] = useState("");
  const [gendertype, setGendertype] = useState("");
  const [emptype, setEmptype] = useState("");
  const formdata = useRef("");
  const [showform, setShowform] = useState(false);
  const [dobvalue, setDobValue] = useState(dayjs("2014-08-18T21:11:54"));
  const [joiningdatevalue, setJoiningdatevalue] = useState(
    dayjs("2014-08-18T21:11:54")
  );
  const form = useRef();
  const departments = usecdotStore((state) => state.departments);
  const username = usecdotStore((state) => state.username);
  const updateEmployee = usecdotStore((state) => state.updateEmployee);
  const usernamelist = usecdotStore((state) => state.usernamelist);
  const [tabValue, setTabValue] = useState(0);
  const [userId, setUserId] = useState(null);
  const emp_id = usecdotStore((state) => state.emp_id);

  useEffect(() => {
    console.log("editform: " + eventid);
    employeeEditApi();
  }, []);

  const employeeEditApi = async () => {
    await axios
      .get(baseURL + "employees/username/" + eventid, {})
      .then(function (response) {
        formdata.current = response.data[0];
        console.log("kcheckpost " + JSON.stringify(formdata.current));
        setDepartmenttype(formdata.current.department);
        setDobValue(formdata.current.dob);
        setJoiningdatevalue(formdata.current.joining_date);
        setGendertype(formdata.current.gender);
        setUsernametype(formdata.current.username);
        setEmptype(formdata.current.emp_type);
        setUserId(formdata.current.user_id);
        setShowform(true);
      })
      .catch(function (error) {
        console.log("kcheckpost" + error);
      });
  };

  const formik = useFormik({
    initialValues: {
      id: eventid,
      username: formdata.current.username,
      emp_name: formdata.current.emp_name,
      emp_phone: formdata.current.emp_phone,
      emp_email: formdata.current.emp_email,
      department: formdata.current.department,
      emp_no: formdata.current.emp_no,
      joining_salary: formdata.current.joining_salary,
      current_salary: formdata.current.current_salary,
      last_company: formdata.current.last_company,
      father_husband_name: formdata.current.father_husband_name,
      gender: formdata.current.gender,
      education: formdata.current.education,
      address: formdata.current.address,
      dob: formdata.current.dob,
      pan: formdata.current.pan,
      aadhaar: formdata.current.aadhaar,
      joining_date: formdata.current.joining_date,
    },
    validate,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log(values);
      formik.values.username = usernametype;
      formik.values.emp_type = emptype;

      await axios
        .put(baseURL + "employees/username/" + eventid + "/", values)
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
          employeeApi();
          onClick();
        })
        .catch(function (error) {
          console.log("kcheckpost" + error);
          toast.error("Username or password is incorrect!", {
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
    },
  });

  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
    validate: validatePassword,
    onSubmit: async (values) => {
      try {
        await axios.post(baseURL + "auth/users/username/" + eventid + "/reset-password", {
          user_id: eventid,
          new_password: values.newPassword
        });
        toast.success("Password updated successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        passwordFormik.resetForm();
      } catch (error) {
        toast.error("Failed to update password. Please check your current password.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.log("Password update error: " + error);
      }
    },
  });

  const accountFormik = useFormik({
    initialValues: {
      username: formdata.current.username || "",
      emp_email: formdata.current.emp_email || ""
    },
    validate: validateAccount,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await axios.put(baseURL + "auth/users/username/" + eventid + "/", {
          username: values.username,
          email: values.emp_email
        });
        toast.success("Account details updated successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        employeeEditApi();
      } catch (error) {
        toast.error("Failed to update account details. Username may already exist.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.log("Account update error: " + error);
      }
    },
  });

  const handleDepartmentChange = (event) => {
    setDepartmenttype(event.target.value);
    formik.values.department = event.target.value;
  };

  const handleGenderChange = (event) => {
    setGendertype(event.target.value);
    formik.values.gender = event.target.value;
  };

  const handleDobChange = (newValue) => {
    setDobValue(newValue);
    formik.values.dob = newValue;
  };

  const handleJoiningDateChange = (newValue) => {
    setJoiningdatevalue(newValue);
    formik.values.joining_date = newValue;
  };

  const handleUsernameChange = (event) => {
    setUsernametype(event.target.value);
  };

  const handleEmpChange = (event) => {
    setEmptype(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const clearForm = () => {
    formik.resetForm();
  };

  const employeeApi = async () => {
    await axios
      .get(baseURL + "employees", {})
      .then(function (response) {
        updateEmployee(response.data);
      })
      .catch(function (error) {
        console.log("kcheckpost" + error);
      });
  };

  return (
    <>
      {showform && (
        <div style={{ overflowY: "auto" }}>
          <Typography variant="h5" align="center">
            Edit Profile
          </Typography>
          <IconButton
            style={{ position: "absolute", top: "0", right: "0" }}
            onClick={onClick}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
              <Tab label="Change Password" />
              <Tab label="Account Settings" />
            </Tabs>
          </Box>

          {tabValue === 0 && (
            <form>
              <Box sx={{ m: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Current Password"
                    type="password"
                    variant="standard"
                    name="currentPassword"
                    onChange={passwordFormik.handleChange}
                    value={passwordFormik.values.currentPassword}
                    sx={{ minWidth: "100%", mb: 2 }}
                  />
                  {passwordFormik.errors.currentPassword ? (
                    <div className="text-orange-700">
                      {passwordFormik.errors.currentPassword}
                    </div>
                  ) : null}
                  <Box sx={{ m: 2 }} />
                  <TextField
                    label="New Password"
                    type="password"
                    variant="standard"
                    name="newPassword"
                    onChange={passwordFormik.handleChange}
                    value={passwordFormik.values.newPassword}
                    sx={{ minWidth: "100%", mb: 2 }}
                  />
                  {passwordFormik.errors.newPassword ? (
                    <div className="text-orange-700">
                      {passwordFormik.errors.newPassword}
                    </div>
                  ) : null}
                  <Box sx={{ m: 2 }} />
                  <TextField
                    label="Confirm New Password"
                    type="password"
                    variant="standard"
                    name="confirmPassword"
                    onChange={passwordFormik.handleChange}
                    value={passwordFormik.values.confirmPassword}
                    sx={{ minWidth: "100%", mb: 2 }}
                  />
                  {passwordFormik.errors.confirmPassword ? (
                    <div className="text-orange-700">
                      {passwordFormik.errors.confirmPassword}
                    </div>
                  ) : null}
                </Grid>
              </Grid>
              <Box sx={{ m: 4 }} />
              <Stack spacing={2} direction="row">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={passwordFormik.handleSubmit}
                >
                  Change Password
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => passwordFormik.resetForm()}
                >
                  Reset
                </Button>
              </Stack>
            </form>
          )}

          {tabValue === 1 && (
            <form>
              <Box sx={{ m: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Username"
                    variant="standard"
                    name="username"
                    onChange={accountFormik.handleChange}
                    value={accountFormik.values.username}
                    sx={{ minWidth: "100%", mb: 2 }}
                  />
                  {accountFormik.errors.username ? (
                    <div className="text-orange-700">
                      {accountFormik.errors.username}
                    </div>
                  ) : null}
                  <Box sx={{ m: 2 }} />
                  <TextField
                    label="Email"
                    variant="standard"
                    name="emp_email"
                    onChange={accountFormik.handleChange}
                    value={accountFormik.values.emp_email}
                    sx={{ minWidth: "100%", mb: 2 }}
                  />
                  {accountFormik.errors.emp_email ? (
                    <div className="text-orange-700">
                      {accountFormik.errors.emp_email}
                    </div>
                  ) : null}
                </Grid>
              </Grid>
              <Box sx={{ m: 4 }} />
              <Stack spacing={2} direction="row">
                {/* <Button
                  variant="contained"
                  color="primary"
                  onClick={accountFormik.handleSubmit}
                >
                  Update Account
                </Button> */}
              </Stack>
            </form>
          )}
        </div>
      )}
    </>
  );
}