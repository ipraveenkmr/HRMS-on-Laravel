import { useState, useRef, useEffect } from "react";
import { TextField, Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import { toast } from "react-toastify";
import { usecdotStore } from "../../components/cdotStore";
import FormControl from "@mui/material/FormControl";
import "react-toastify/dist/ReactToastify.css";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useemployeeStore } from "../../components/employeeStore";
import InputLabel from "@mui/material/InputLabel";

export default function LastWorkDetails() {
  const st_employer = useemployeeStore((state) => state.st_employer);
  const st_job_title = useemployeeStore((state) => state.st_job_title);
  const st_comment = useemployeeStore((state) => state.st_comment);
  const st_end_date = useemployeeStore((state) => state.st_end_date);
  const st_start_date = useemployeeStore((state) => state.st_start_date);
  const st_reference_name = useemployeeStore(
    (state) => state.st_reference_name
  );
  const st_reference_designation = useemployeeStore(
    (state) => state.st_reference_designation
  );
  const st_refernece_department = useemployeeStore(
    (state) => state.st_refernece_department
  );
  const st_refernece_contact = useemployeeStore(
    (state) => state.st_refernece_contact
  );
  const st_refernece_email = useemployeeStore(
    (state) => state.st_refernece_email
  );
  const st_reference_name_if_any = useemployeeStore(
    (state) => state.st_reference_name_if_any
  );
  const st_reference_designation_if_any = useemployeeStore(
    (state) => state.st_reference_designation_if_any
  );
  const st_refernece_department_if_any = useemployeeStore(
    (state) => state.st_refernece_department_if_any
  );
  const st_refernece_contact_if_any = useemployeeStore(
    (state) => state.st_refernece_contact_if_any
  );
  const st_refernece_email_if_any = useemployeeStore(
    (state) => state.st_refernece_email_if_any
  );

  const updateStEmployer = useemployeeStore((state) => state.updateStEmployer);
  const updateStJobTitle = useemployeeStore((state) => state.updateStJobTitle);
  const updateStComment = useemployeeStore((state) => state.updateStComment);
  const updateStEndDate = useemployeeStore((state) => state.updateStEndDate);
  const updateStStartDate = useemployeeStore(
    (state) => state.updateStStartDate
  );
  const updateStRefernceName = useemployeeStore(
    (state) => state.updateStRefernceName
  );
  const updateStRefernceDesignation = useemployeeStore(
    (state) => state.updateStRefernceDesignation
  );
  const updateStRefernceDepartment = useemployeeStore(
    (state) => state.updateStRefernceDepartment
  );
  const updateStRefernceContact = useemployeeStore(
    (state) => state.updateStRefernceContact
  );
  const updateStRefernceEmail = useemployeeStore(
    (state) => state.updateStRefernceEmail
  );
  const updateStRefernceNameIfAny = useemployeeStore(
    (state) => state.updateStRefernceNameIfAny
  );
  const updateStRefernceDesignationIfAny = useemployeeStore(
    (state) => state.updateStRefernceDesignationIfAny
  );
  const updateStRefernceDepartmentIfAny = useemployeeStore(
    (state) => state.updateStRefernceDepartmentIfAny
  );
  const updateStRefernceContactIfAny = useemployeeStore(
    (state) => state.updateStRefernceContactIfAny
  );
  const updateStRefernceEmailIfAny = useemployeeStore(
    (state) => state.updateStRefernceEmailIfAny
  );

  const handlupdateStRefernceNameIfAny = (event) => {
    updateStRefernceNameIfAny(event.target.value);
  };
  const handleupdateStRefernceDesignationIfAny = (event) => {
    updateStRefernceDesignationIfAny(event.target.value);
  };
  const handleupdateStRefernceDepartmentIfAny = (event) => {
    updateStRefernceDepartmentIfAny(event.target.value);
  };
  const handleupdateStRefernceEmailIfAny = (event) => {
    updateStRefernceEmailIfAny(event.target.value);
  };
  const handleupdateStRefernceContactIfAny = (event) => {
    updateStRefernceContactIfAny(event.target.value);
  };

  const handlupdateStRefernceName = (event) => {
    updateStRefernceName(event.target.value);
  };
  const handleupdateStRefernceDepartment = (event) => {
    updateStRefernceDepartment(event.target.value);
  };
  const handleupdateStRefernceDesignation = (event) => {
    updateStRefernceDesignation(event.target.value);
  };
  const handleupdateStRefernceContact = (event) => {
    updateStRefernceContact(event.target.value);
  };
  const handleupdateStRefernceEmail = (event) => {
    updateStRefernceEmail(event.target.value);
  };

  const handleupdateStEmployer = (event) => {
    updateStEmployer(event.target.value);
  };
  const handleupdateStJobTitle = (event) => {
    updateStJobTitle(event.target.value);
  };
  const handleupdateStComment = (event) => {
    updateStComment(event.target.value);
  };
  const handleupdateStEndDate = (event) => {
    updateStEndDate(event.target.value);
  };
  const handleupdateStStartDate = (event) => {
    updateStStartDate(event.target.value);
  };
  // const handleupdateStEndDate = (newvalue) => {
  //   updateStEndDate(newvalue);
  // };
  // const handleupdateStStartDate = (newvalue) => {
  //   updateStStartDate(newvalue);
  // };

  useEffect(() => {
    // if (usernametype.length > 1 && emptype.length > 1 && wmodetype.length > 1) {
    //   console.log("Working...");
    //   setButtonEnabled(false);
    // }
  }, []);

  return (
    <>
      <div style={{ overflowY: "auto" }}>
        <Box sx={{ m: 5 }} />
        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <TextField
              label="Employer"
              variant="outlined"
              size="small"
              name="employer"
              value={st_employer}
              onChange={handleupdateStEmployer}
              onBlur={handleupdateStEmployer}
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <TextField
              label="Job Title"
              variant="outlined"
              size="small"
              value={st_job_title}
              onChange={handleupdateStJobTitle}
              onBlur={handleupdateStJobTitle}
              name="job_title"
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <TextField
              label="Comment"
              variant="outlined"
              size="small"
              value={st_comment}
              onChange={handleupdateStComment}
              onBlur={handleupdateStComment}
              name="comment"
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 1 }} />
            <InputLabel htmlFor="my-input">Start Date</InputLabel>
            <TextField
              variant="outlined"
              name="emp_last_working_date"
              type="date"
              value={st_start_date}
              onChange={handleupdateStStartDate}
              onBlur={handleupdateStStartDate}
              size="small"
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 1 }} />
            <InputLabel htmlFor="my-input">End date</InputLabel>
            <TextField
              variant="outlined"
              name="emp_last_working_date"
              type="date"
              value={st_end_date}
              onChange={handleupdateStEndDate}
              onBlur={handleupdateStEndDate}
              size="small"
              sx={{ minWidth: "92%" }}
            />
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
              <FormControl variant="outlined" sx={{ minWidth: "92%" }}>
                <MobileDatePicker
                  label="End Date"
                  inputFormat="DD/MM/YYYY"
                  name="emp_resignation_date"
                  variant="outlined"
                  size="small"
                  value={st_start_date}
                  onChange={handleupdateStStartDate}
                  onBlur={handleupdateStStartDate}
                  sx={{ minWidth: "40%" }}
                  renderInput={(params) => (
                    <TextField size="small" {...params} />
                  )}
                />
              </FormControl>
              <Box sx={{ m: 2 }} />
              <FormControl variant="outlined" sx={{ minWidth: "92%" }}>
                <MobileDatePicker
                  label="Start Date"
                  inputFormat="DD/MM/YYYY"
                  name="emp_last_working_date"
                  variant="outlined"
                  size="small"
                  value={st_end_date}
                  onChange={handleupdateStEndDate}
                  onBlur={handleupdateStEndDate}
                  sx={{ minWidth: "40%" }}
                  renderInput={(params) => (
                    <TextField size="small" {...params} />
                  )}
                />
              </FormControl>
            </LocalizationProvider> */}
          </Grid>
          <Grid item md={6} xs={12}>
            <TextField
              label="Reference Name"
              variant="outlined"
              size="small"
              value={st_reference_name}
              onChange={handlupdateStRefernceName}
              onBlur={handlupdateStRefernceName}
              name="reference_name"
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <TextField
              label="Reference Designation"
              variant="outlined"
              size="small"
              value={st_reference_designation}
              onChange={handleupdateStRefernceDesignation}
              onBlur={handleupdateStRefernceDesignation}
              name="reference_designation"
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <TextField
              label="Reference Department"
              variant="outlined"
              size="small"
              value={st_refernece_department}
              onChange={handleupdateStRefernceDepartment}
              onBlur={handleupdateStRefernceDepartment}
              name="reference_department"
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <TextField
              label="Reference Contact"
              type="number"
              value={st_refernece_contact}
              onChange={handleupdateStRefernceContact}
              onBlur={handleupdateStRefernceContact}
              variant="outlined"
              size="small"
              name="reference_contact"
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <TextField
              label="Reference Email"
              variant="outlined"
              value={st_refernece_email}
              onChange={handleupdateStRefernceEmail}
              onBlur={handleupdateStRefernceEmail}
              size="small"
              name="reference_email"
              sx={{ minWidth: "92%" }}
            />
          </Grid>
          {/* <Grid item md={4} xs={12}>
            <TextField
              label="Reference Name (If any)"
              variant="outlined"
              value={st_reference_name_if_any}
              onChange={handlupdateStRefernceNameIfAny}
              onBlur={handlupdateStRefernceNameIfAny}
              size="small"
              
              name="reference_name_if_any"
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <TextField
              label="Reference Designation (If any)"
              variant="outlined"
              value={st_reference_designation_if_any}
              onChange={handleupdateStRefernceDesignationIfAny}
              onBlur={handleupdateStRefernceDesignationIfAny}
              size="small"
              name="reference_designation_if_any"
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <TextField
              label="Reference Department (If any)"
              variant="outlined"
              value={st_refernece_department_if_any}
              onChange={handleupdateStRefernceDepartmentIfAny}
              onBlur={handleupdateStRefernceDepartmentIfAny}
              size="small"
              name="reference_department_if_any"
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <TextField
              label="Reference Contact (If any)"
              type="number"
              value={st_refernece_contact_if_any}
              onChange={handleupdateStRefernceContactIfAny}
              onBlur={handleupdateStRefernceContactIfAny}
              variant="outlined"
              size="small"
              name="reference_contact_if_any"
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <TextField
              label="Reference Email (If any)"
              variant="outlined"
              value={st_refernece_email_if_any}
              onChange={handleupdateStRefernceEmailIfAny}
              onBlur={handleupdateStRefernceEmailIfAny}
              size="small"
              name="reference_email_if_any"
              sx={{ minWidth: "92%" }}
            />
          </Grid> */}
        </Grid>
      </div>
    </>
  );
}
