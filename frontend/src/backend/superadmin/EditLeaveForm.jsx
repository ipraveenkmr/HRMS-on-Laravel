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
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";

export default function EditLeaveForm({ onClick, eventid, onSuccess }) {
  const baseURL = process.env.REACT_APP_API_URL;
  const [selectedFinancialYear, setSelectedFinancialYear] = useState("");
  const [financialYears, setFinancialYears] = useState([]);
  const [showform, setShowform] = useState(false);
  const form = useRef();
  const formdata = useRef("");

  useEffect(() => {
    console.log("editform: " + eventid);
    leaveEditApi();
    financialYearApi();
  }, []);

  const financialYearApi = async () => {
    await axios
      .get(baseURL + "financial-years")
      .then(function (response) {
        setFinancialYears(response.data);
      })
      .catch(function (error) {
        console.log("Financial year API Error: " + error);
      });
  };

  const leaveEditApi = async () => {
    await axios
      .get(baseURL + "leave-config/" + eventid)
      .then(function (response) {
        formdata.current = response.data;
        console.log("Leave data: " + JSON.stringify(formdata.current));
        
        setSelectedFinancialYear(formdata.current.financial_year_id);
        
        // Set form values
        formik.setValues({
          financial_year_id: formdata.current.financial_year_id,
          cl_days: formdata.current.cl_days,
          cl_hours: formdata.current.cl_hours,
          ei_days: formdata.current.ei_days,
          ei_hours: formdata.current.ei_hours,
          lwp_days: formdata.current.lwp_days,
          lwp_hours: formdata.current.lwp_hours,
          medical_leave_in_days: formdata.current.medical_leave_in_days,
          medical_leave_in_hours: formdata.current.medical_leave_in_hours,
          other_leave_in_days: formdata.current.other_leave_in_days,
          other_leave_in_hours: formdata.current.other_leave_in_hours,
        });
        
        setShowform(true);
      })
      .catch(function (error) {
        console.log("Leave edit API error: " + error);
      });
  };

  const formik = useFormik({
    initialValues: {
      financial_year_id: "",
      cl_days: 0,
      cl_hours: 0,
      ei_days: 0,
      ei_hours: 0,
      lwp_days: 0,
      lwp_hours: 0,
      medical_leave_in_days: 0,
      medical_leave_in_hours: 0,
      other_leave_in_days: 0,
      other_leave_in_hours: 0,
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log(values);
      values.financial_year_id = selectedFinancialYear;

      await axios
        .put(baseURL + "leave-config/" + eventid, values)
        .then(function (response) {
          toast.success("Leave configuration updated successfully!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            toastId: "success",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          onSuccess();
          onClick();
        })
        .catch(function (error) {
          console.log("Error: " + error);
          const errorMessage = error.response?.data?.message || "Failed to update leave configuration!";
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            toastId: "error",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    },
  });

  const handleFinancialYearChange = (event) => {
    setSelectedFinancialYear(event.target.value);
  };

  return (
    <>
      {showform && (
        <Box sx={{ maxHeight: "90vh", overflow: "auto", p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", color: "primary.main" }}>
              Edit Leave Configuration
            </Typography>
            <IconButton onClick={onClick} size="large">
              <CloseIcon />
            </IconButton>
          </Box>

          <form ref={form}>
            <Grid container spacing={3}>
              {/* Financial Year Selection */}
              <Grid item xs={12}>
                <Card elevation={3}>
                  <CardHeader
                    title="Financial Year Selection"
                    sx={{ bgcolor: "primary.light", color: "white", py: 1 }}
                    titleTypographyProps={{ variant: "subtitle1", fontWeight: "bold" }}
                  />
                  <CardContent>
                    <FormControl fullWidth size="small">
                      <InputLabel>Financial Year</InputLabel>
                      <Select
                        value={selectedFinancialYear}
                        onChange={handleFinancialYearChange}
                        label="Financial Year"
                        required
                      >
                        {financialYears.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.year}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              {/* Leave Configuration */}
              <Grid item xs={12} md={6}>
                <Card elevation={3}>
                  <CardHeader
                    title="Leave Days Configuration"
                    sx={{ bgcolor: "success.main", color: "white", py: 1 }}
                    titleTypographyProps={{ variant: "subtitle1", fontWeight: "bold" }}
                  />
                  <CardContent>
                    <Stack spacing={3}>
                      <TextField
                        label="Casual Leave (Days)"
                        type="number"
                        name="cl_days"
                        onChange={formik.handleChange}
                        value={formik.values.cl_days}
                        fullWidth
                        size="small"
                        inputProps={{ min: 0, step: 0.5 }}
                      />
                      <TextField
                        label="Emergency/Sick Leave (Days)"
                        type="number"
                        name="ei_days"
                        onChange={formik.handleChange}
                        value={formik.values.ei_days}
                        fullWidth
                        size="small"
                        inputProps={{ min: 0, step: 0.5 }}
                      />
                      <TextField
                        label="Leave Without Pay (Days)"
                        type="number"
                        name="lwp_days"
                        onChange={formik.handleChange}
                        value={formik.values.lwp_days}
                        fullWidth
                        size="small"
                        inputProps={{ min: 0, step: 0.5 }}
                      />
                      <TextField
                        label="Medical Leave (Days)"
                        type="number"
                        name="medical_leave_in_days"
                        onChange={formik.handleChange}
                        value={formik.values.medical_leave_in_days}
                        fullWidth
                        size="small"
                        inputProps={{ min: 0, step: 0.5 }}
                      />
                      <TextField
                        label="Other Leave (Days)"
                        type="number"
                        name="other_leave_in_days"
                        onChange={formik.handleChange}
                        value={formik.values.other_leave_in_days}
                        fullWidth
                        size="small"
                        inputProps={{ min: 0, step: 0.5 }}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Leave Hours Configuration */}
              <Grid item xs={12} md={6}>
                <Card elevation={3}>
                  <CardHeader
                    title="Leave Hours Configuration"
                    sx={{ bgcolor: "info.main", color: "white", py: 1 }}
                    titleTypographyProps={{ variant: "subtitle1", fontWeight: "bold" }}
                  />
                  <CardContent>
                    <Stack spacing={3}>
                      <TextField
                        label="Casual Leave (Hours)"
                        type="number"
                        name="cl_hours"
                        onChange={formik.handleChange}
                        value={formik.values.cl_hours}
                        fullWidth
                        size="small"
                        inputProps={{ min: 0, step: 0.5 }}
                      />
                      <TextField
                        label="Emergency/Sick Leave (Hours)"
                        type="number"
                        name="ei_hours"
                        onChange={formik.handleChange}
                        value={formik.values.ei_hours}
                        fullWidth
                        size="small"
                        inputProps={{ min: 0, step: 0.5 }}
                      />
                      <TextField
                        label="Leave Without Pay (Hours)"
                        type="number"
                        name="lwp_hours"
                        onChange={formik.handleChange}
                        value={formik.values.lwp_hours}
                        fullWidth
                        size="small"
                        inputProps={{ min: 0, step: 0.5 }}
                      />
                      <TextField
                        label="Medical Leave (Hours)"
                        type="number"
                        name="medical_leave_in_hours"
                        onChange={formik.handleChange}
                        value={formik.values.medical_leave_in_hours}
                        fullWidth
                        size="small"
                        inputProps={{ min: 0, step: 0.5 }}
                      />
                      <TextField
                        label="Other Leave (Hours)"
                        type="number"
                        name="other_leave_in_hours"
                        onChange={formik.handleChange}
                        value={formik.values.other_leave_in_hours}
                        fullWidth
                        size="small"
                        inputProps={{ min: 0, step: 0.5 }}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ mt: 4, mb: 2 }}>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={formik.handleSubmit}
                  disabled={!selectedFinancialYear}
                  sx={{ minWidth: 120 }}
                >
                  Update Configuration
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  onClick={() => formik.resetForm()}
                  sx={{ minWidth: 120 }}
                >
                  Reset Form
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="large"
                  onClick={onClick}
                  sx={{ minWidth: 120 }}
                >
                  Close
                </Button>
              </Stack>
            </Box>
          </form>
        </Box>
      )}
    </>
  );
}