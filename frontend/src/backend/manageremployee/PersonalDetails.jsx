import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { TextField, Box } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { usecdotStore } from "../../components/cdotStore";
import { useemployeeStore } from "../../components/employeeStore";
import Stack from "@mui/material/Stack";

export default function PersonalDetails() {
  const usernamelist = usecdotStore((state) => state.usernamelist);

  const st_username = useemployeeStore((state) => state.st_username);
  const st_work_mode = useemployeeStore((state) => state.st_work_mode);
  const st_name = useemployeeStore((state) => state.st_name);
  const st_email = useemployeeStore((state) => state.st_email);
  const st_phone = useemployeeStore((state) => state.st_phone);
  const st_emergency_phone = useemployeeStore(
    (state) => state.st_emergency_phone
  );
  const st_gender = useemployeeStore((state) => state.st_gender);
  const st_father_husband_name = useemployeeStore(
    (state) => state.st_father_husband_name
  );
  const st_mother_name = useemployeeStore((state) => state.st_mother_name);
  const st_permanent_address = useemployeeStore(
    (state) => state.st_permanent_address
  );
  const st_present_address = useemployeeStore(
    (state) => state.st_present_address
  );
  const st_city = useemployeeStore((state) => state.st_city);
  const st_state = useemployeeStore((state) => state.st_state);
  const st_pincode = useemployeeStore((state) => state.st_pincode);
  const st_pan = useemployeeStore((state) => state.st_pan);
  const st_aadhaar = useemployeeStore((state) => state.st_aadhaar);
  const st_dob = useemployeeStore((state) => state.st_dob);

  const updateStUsername = useemployeeStore((state) => state.updateStUsername);
  const updateStWorkMode = useemployeeStore((state) => state.updateStWorkMode);
  const updateStName = useemployeeStore((state) => state.updateStName);
  const updateStEmail = useemployeeStore((state) => state.updateStEmail);
  const updateStPhone = useemployeeStore((state) => state.updateStPhone);
  const updateStEmergencyPhone = useemployeeStore(
    (state) => state.updateStEmergencyPhone
  );
  const updateStGender = useemployeeStore((state) => state.updateStGender);
  const updateStFatherHusbandName = useemployeeStore(
    (state) => state.updateStFatherHusbandName
  );
  const updateStMotherName = useemployeeStore(
    (state) => state.updateStMotherName
  );
  const updateStPermanentAddress = useemployeeStore(
    (state) => state.updateStPermanentAddress
  );
  const updateStPresentAddress = useemployeeStore(
    (state) => state.updateStPresentAddress
  );
  const updateStCity = useemployeeStore((state) => state.updateStCity);
  const updateStState = useemployeeStore((state) => state.updateStState);
  const updateStPincode = useemployeeStore((state) => state.updateStPincode);
  const updateStPan = useemployeeStore((state) => state.updateStPan);
  const updateStAadhaar = useemployeeStore((state) => state.updateStAadhaar);
  const updateStDob = useemployeeStore((state) => state.updateStDob);


  const handleUsernameChange = (event) => {
    updateStUsername(event.target.value);
  };

  const handleGenderChange = (event) => {
    updateStGender(event.target.value);
  };

  const handleWmodeChange = (event) => {
    updateStWorkMode(event.target.value);
  };

  const handleDobChange = (newValue) => {
    updateStDob(newValue);
  };

  const handleEmpNameChange = (event) => {
    updateStName(event.target.value);
  };

  const handleEmpEmailChange = (event) => {
    updateStEmail(event.target.value);
  };

  const handleEmpPhoneChange = (event) => {
    updateStPhone(event.target.value);
  };

  const handleEmpEmergencyPhoneChange = (event) => {
    updateStEmergencyPhone(event.target.value);
  };
  
  const handleFatherChange = (event) => {
    updateStFatherHusbandName(event.target.value);
  };

  const handleMotherChange = (event) => {
    updateStMotherName(event.target.value);
  };

  const handlePermanentAddressChange = (event) => {
    updateStPermanentAddress(event.target.value);
  };

  const handlePresentAddressChange = (event) => {
    updateStPresentAddress(event.target.value);
  };

  const handleStateChange = (event) => {
    updateStState(event.target.value);
  };

  const handlePincodeChange = (event) => {
    updateStPincode(event.target.value);
  };

  const handlePanChange = (event) => {
    updateStPan(event.target.value);
  };

  const handleAadhaarChange = (event) => {
    updateStAadhaar(event.target.value);
  };

  const handleCityChange = (event) => {
    updateStCity(event.target.value);
  };

  return (
    <>
      <div style={{ overflowY: "auto" }}>
        <Box sx={{ m: 4 }} />
        <Grid container spacing={2}>
          <Grid item md={4} xs={12}>
            <Box sx={{ m: 2 }} />
            <FormControl
              variant="outlined"
              sx={{ minWidth: "92%" }}
              size="small"
            >
              <InputLabel id="username-label">Username</InputLabel>
              <Select
                labelId="username-label"
                size="small"
                value={st_username}
                label="Username"
                onChange={handleUsernameChange}
              >
                {usernamelist.map((item, index) => {
                  return (
                    <MenuItem value={item.username}>{item.username}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <Box sx={{ m: 2 }} />
            <FormControl variant="outlined" sx={{ minWidth: "92%" }}>
              <InputLabel id="work-mode-label">Work Mode</InputLabel>
              <Select
                labelId="work-mode-label"
                label="Work Mode"
                value={st_work_mode}
                size="small"
                onChange={handleWmodeChange}
              >
                <MenuItem value={"Office"}>Office</MenuItem>
                <MenuItem value={"Field"}>Field</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ m: 2 }} />
            <TextField
              label="Name"
              size="small"
              variant="outlined"
              name="emp_name"
              id="emp_name"
              sx={{ minWidth: "92%" }}
              value={st_name}
              onChange={handleEmpNameChange}
              onBlur={handleEmpNameChange}
            />
            <Box sx={{ m: 2 }} />
            <TextField
              label="Enter Email"
              variant="outlined"
              size="small"
              sx={{ minWidth: "92%" }}
              name="emp_email"
              id="emp_email"
              value={st_email}
              onChange={handleEmpEmailChange}
              onBlur={handleEmpEmailChange}
            />
            <Box sx={{ m: 2 }} />
            <TextField
              label="Phone No."
              variant="outlined"
              size="small"
              name="emp_phone"
              type="number"
              value={st_phone}
              onChange={handleEmpPhoneChange}
              onBlur={handleEmpPhoneChange}
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <TextField
              label="Emergency Phone No."
              variant="outlined"
              size="small"
              name="emp_emergency_phone"
              type="number"
              value={st_emergency_phone}
              onChange={handleEmpEmergencyPhoneChange}
              onBlur={handleEmpEmergencyPhoneChange}
              sx={{ minWidth: "92%" }}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <Box sx={{ m: 2 }} />
            <FormControl variant="outlined" sx={{ minWidth: "92%" }}>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                label="Gender"
                labelId="gender-label"
                size="small"
                value={st_gender}
                onChange={handleGenderChange}
              >
                <MenuItem value={"Male"}>Male</MenuItem>
                <MenuItem value={"Female"}>Female</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ m: 2 }} />
            <TextField
              label="Father / Husband Name"
              variant="outlined"
              size="small"
              name="father_husband_name"
              value={st_father_husband_name}
              onChange={handleFatherChange}
              onBlur={handleFatherChange}
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <TextField
              label="Mothe's Name"
              variant="outlined"
              name="mothers_name"
              size="small"
              value={st_mother_name}
              onChange={handleMotherChange}
              onBlur={handleMotherChange}
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <TextField
              label="Permanent Address"
              variant="outlined"
              size="small"
              name="permanent_address"
              value={st_permanent_address}
              onChange={handlePermanentAddressChange}
              onBlur={handlePermanentAddressChange}
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <TextField
              label="Present Address"
              variant="outlined"
              size="small"
              name="permanent_address"
              value={st_present_address}
              onChange={handlePresentAddressChange}
              onBlur={handlePresentAddressChange}
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <TextField
              label="City"
              variant="outlined"
              name="city"
              size="small"
              value={st_city}
              onChange={handleCityChange}
              onBlur={handleCityChange}
              sx={{ minWidth: "92%" }}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <Box sx={{ m: 2 }} />
            <TextField
              label="State"
              variant="outlined"
              name="state"
              size="small"
              value={st_state}
              onChange={handleStateChange}
              onBlur={handleStateChange}
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <TextField
              label="Pincode"
              variant="outlined"
              size="small"
              name="pincode"
              value={st_pincode}
              onChange={handlePincodeChange}
              onBlur={handlePincodeChange}
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <TextField
              label="Pan"
              variant="outlined"
              size="small"
              name="pan"
              value={st_pan}
              onChange={handlePanChange}
              onBlur={handlePanChange}
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <TextField
              label="Aadhaar"
              variant="outlined"
              name="aadhaar"
              value={st_aadhaar}
              onChange={handleAadhaarChange}
              onBlur={handleAadhaarChange}
              size="small"
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 3 }} />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack spacing={2} direction="row">
                <FormControl variant="outlined" sx={{ minWidth: "92%" }}>
                  <MobileDatePicker
                    label="DOB"
                    inputFormat="DD/MM/YYYY"
                    maxDate="01/01/2025"
                    minDate="01/01/1950"
                    name="dob"
                    value={st_dob}
                    variant="outlined"
                    onChange={handleDobChange}
                    sx={{ minWidth: "92%" }}
                    renderInput={(params) => (
                      <TextField size="small" {...params} />
                    )}
                  />
                </FormControl>
              </Stack>
            </LocalizationProvider>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
