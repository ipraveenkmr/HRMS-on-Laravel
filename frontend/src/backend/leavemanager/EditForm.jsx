import { useState, useRef, useEffect } from "react";
import { Typography, Button, Box, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Stack from "@mui/material/Stack";
import { usecdotStore } from "../../components/cdotStore";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

export default function AddForm({ onClick, eventid, uname, eid }) {
  const baseURL = process.env.REACT_APP_API_URL;
  const [remainingcldays, seRremainingClDays] = useState(0);
  const [remainingeidays, setRemainingEiDays] = useState(0);
  const [remaininglwpdays, setRemainingLwpDays] = useState(0);
  const [remainingotherdays, setRemainingOtherDays] = useState(0);
  const form = useRef();
  const empusername = usecdotStore((state) => state.empusername);
  const updateManageLeave = usecdotStore((state) => state.updateManageLeave);
  const [showform, setShowform] = useState(false);

  useEffect(() => {
    leaveCalcApi();
  }, []);

  const leaveCalcApi = async () => {
    // starting
    try {
      const response = await axios.get(baseURL + "leave/calculator/username/" + uname);
      console.log("Leave calculator API response:", response.data);
      
      if (response.data && response.data.length > 0) {
        const data = response.data[0];
        seRremainingClDays(data.remaining_cl_days || data.remaining_CL_Days || 0);
        setRemainingEiDays(data.remaining_ei_days || data.remaining_EI_Days || 0);
        setRemainingLwpDays(data.remaining_lwp_days || data.remaining_LWP_Days || 0);
        setRemainingOtherDays(data.remaining_other_leave_in_days || 0);
        setShowform(true);
      } else {
        console.error("No leave calculator data found for user:", uname);
        toast.error("No leave data found for this employee");
      }
    } catch (error) {
      console.error("Leave calculator API error:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        toast.error(error.response.data.error || "Failed to load leave data");
      } else {
        toast.error("Failed to connect to server");
      }
    }
    // ending
  };

  const formik = useFormik({
    initialValues: {
      id: eventid,
    },

    enableReinitialize: true,

    onSubmit: async (values) => {
      console.log(values);
      formik.values.id = eventid;
      formik.values.username = uname;
      formik.values.employee = eid;
      const updateData = {
        remaining_cl_days: Number(remainingcldays),
        remaining_ei_days: Number(remainingeidays),
        remaining_lwp_days: Number(remaininglwpdays),
        remaining_other_leave_in_days: Number(remainingotherdays),
        remaining_cl_hours: 0,
        remaining_ei_hours: 0,
        remaining_lwp_hours: 0,
        remaining_medical_leave_in_days: 0,
        remaining_medical_leave_in_hours: 0,
        remaining_other_leave_in_hours: 0,
      };

      // starting
      try {
        const response = await axios.put(baseURL + "leave/calculator/" + eventid, updateData);
        console.log("Update response:", response.data);
        toast.success("Leave data updated successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          toastId: "id",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        manageleaveApi();
        onClick();
      } catch (error) {
        console.error("Update error:", error);
        if (error.response) {
          console.error("Error response:", error.response.data);
          toast.error(error.response.data.message || "Failed to update leave data", {
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
          toast.error("Failed to connect to server", {
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
      }
      // ending
      // formik.resetForm();
    },
  });

  const manageleaveApi = async () => {
    // starting
    await axios
      .get(baseURL + "manageleave/")
      .then(function (response) {
        updateManageLeave(response.data);
      })
      .catch(function (error) {
        console.log("kcheckpost" + error); //return 429
      });
    // ending
  };
  const handleRemainingcldays = (event)=>{
    seRremainingClDays(event.target.value);
    
  }
  const onchangeRemainingeidays = (event)=>{
    setRemainingEiDays(event.target.value);

  }
  const handleRemaininglwpdays = (event)=>{
    setRemainingLwpDays(event.target.value);

  }
  const handleRemainingotherdays = (event)=>{
    setRemainingOtherDays(event.target.value);

  }

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
              <Grid item md={12} xs={12}>
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12}>
                    <TextField
                      label="Username"
                      variant="outlined"
                      size="small"
                      name="username"
                      inputProps={{ readOnly: true }}
                      value={uname}
                      sx={{ minWidth: "92%" }}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ m: 2 }} />
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12}>
                    <TextField
                      label="Remaining CL Leave"
                      variant="outlined"
                      size="small"
                      type="number"
                      name="remaining_CL_Days"
                      value={remainingcldays}
                      onChange={handleRemainingcldays}
                      sx={{ minWidth: "92%" }}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ m: 2 }} />
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12}>
                    <TextField
                      label="Remaining EI Leave"
                      variant="outlined"
                      size="small"
                      type="number"
                      name="remaining_EI_Days"
                      value={remainingeidays}
                      onChange={onchangeRemainingeidays}
                      sx={{ minWidth: "92%" }}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ m: 2 }} />
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12}>
                    <TextField
                      label="Remaining LWP Leave"
                      variant="outlined"
                      size="small"
                      type="number"
                      name="remaining_LWP_Days"
                      value={remaininglwpdays}
                      onChange={handleRemaininglwpdays}
                      sx={{ minWidth: "92%" }}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ m: 2 }} />
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12}>
                    <TextField
                      label="Remaining Other Leave"
                      variant="outlined"
                      size="small"
                      // type="number"
                      name="remaining_other_leave_in_days"
                      value={remainingotherdays}
                      onChange={handleRemainingotherdays}
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
