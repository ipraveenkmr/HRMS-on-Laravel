import { useState, useRef, useEffect } from "react";
import { TextField, Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import { toast } from "react-toastify";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import "react-toastify/dist/ReactToastify.css";
import { useemployeeStore } from "../../components/employeeStore";

export default function EducationDetails() {

  const st_qualification = useemployeeStore((state) => state.st_qualification);
  const st_specialization = useemployeeStore((state) => state.st_specialization);
  const st_board = useemployeeStore((state) => state.st_board);
  const st_course_name = useemployeeStore((state) => state.st_course_name);
  const st_passing_year = useemployeeStore((state) => state.st_passing_year);

  const updateStQualification = useemployeeStore((state) => state.updateStQualification);
  const updateStSpecialization = useemployeeStore((state) => state.updateStSpecialization);
  const updateStBoard = useemployeeStore((state) => state.updateStBoard);
  const updateStCourseName = useemployeeStore((state) => state.updateStCourseName);
  const updateStPassingYear = useemployeeStore((state) => state.updateStPassingYear);

  const handleUpdateStQualification = (event) => {
    updateStQualification(event.target.value);
  };
  const handleUpdateStSpecialization = (event) => {
    updateStSpecialization(event.target.value);
  };
  const handleUpdateStBoard = (event) => {
    updateStBoard(event.target.value);
  };
  const handleUpdateStCourseName = (event) => {
    updateStCourseName(event.target.value);
  };
  const handleUpdateStPassingYear = (event) => {
    updateStPassingYear(event.target.value);
  };


  useEffect(() => {
    // if (usernametype.length > 1 && emptype.length > 1 && wmodetype.length > 1) {
    //   console.log("Working...");
    //   setButtonEnabled(false);
    // }
  }, []);


  return (
    <>
      <div style={{ overflowY: "auto" }}>
        <Box sx={{ mt: 7 }} />
        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <FormControl
              variant="outlined"
              size="small"
              sx={{ minWidth: "92%" }}
            >
              <InputLabel id="label-qualification">
                Qualification*
              </InputLabel>
              <Select
                labelId="label-qualification"
                value={st_qualification}
                onChange={handleUpdateStQualification}
                onBlur={handleUpdateStQualification}
                label="Qualification"
              >
                <MenuItem value={"Under Graduate"}>Under Graduate</MenuItem>
                <MenuItem value={"Graduate"}>Graduate</MenuItem>
                <MenuItem value={"Post Graduate"}>Post Graduate</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ m: 2 }} />
            <TextField
              label="Specialization"
              variant="outlined"
              size="small"
              name="specialization"
              value={st_specialization}
              onChange={handleUpdateStSpecialization}
              onBlur={handleUpdateStSpecialization}
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <TextField
              label="Board / University"
              variant="outlined"
              size="small"
              value={st_board}
              onChange={handleUpdateStBoard}
              onBlur={handleUpdateStBoard}
              name="board_university"
              sx={{ minWidth: "92%" }}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <TextField
              label="Name of Course"
              variant="outlined"
              size="small"
              value={st_course_name}
              onChange={handleUpdateStCourseName}
              onBlur={handleUpdateStCourseName}
              name="name_of_course"
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <TextField
              label="Passing Year"
              variant="outlined"
              size="small"
              value={st_passing_year}
              onChange={handleUpdateStPassingYear}
              onBlur={handleUpdateStPassingYear}
              name="passing_year"
              sx={{ minWidth: "92%" }}
            />
          </Grid>
        </Grid>
      </div>
    </>
  );
}
