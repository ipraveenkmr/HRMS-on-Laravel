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
    await axios
      .get(baseURL + "leave/calculator/" + uname)
      .then(function (response) {
        seRremainingClDays(response.data[0].remaining_CL_Days);
        setRemainingEiDays(response.data[0].remaining_EI_Days);
        setRemainingLwpDays(response.data[0].remaining_LWP_Days);
        setRemainingOtherDays(response.data[0].remaining_other_leave_in_days);
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
    },

    enableReinitialize: true,

    onSubmit: async (values) => {
      console.log(values);
      formik.values.id = eventid;
      formik.values.username = uname;
      formik.values.employee = eid;
      formik.values.remaining_CL_Days = Number(remainingcldays);
      formik.values.remaining_EI_Days = Number(remainingeidays);
      formik.values.remaining_LWP_Days = Number(remaininglwpdays);
      formik.values.remaining_other_leave_in_days = Number(remainingotherdays);
      formik.values.remaining_CL_Hours = 0;
      formik.values.remaining_EI_Hours = 0;
      formik.values.remaining_LWP_Hours = 0;
      formik.values.remaining_medical_leave_in_days = 0;
      formik.values.remaining_medical_leave_in_hours = 0;
      formik.values.remaining_other_leave_in_hours = 0;

      // starting
      await axios
        .post(baseURL + "create-leavemanager/", values)
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
          manageleaveApi();
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
