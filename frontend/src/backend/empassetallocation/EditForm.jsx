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
  const [selectedasset, setSelectedasset] = useState("");
  const form = useRef();
  const updateAssets = usecdotStore((state) => state.updateAssets);
  const employees = usecdotStore((state) => state.employees);
  const assetlist = usecdotStore((state) => state.assetlist);
  const assetcategories = usecdotStore((state) => state.assetcategories);
  const [allocatedate, setAllocatedate] = useState("");
  const [showform, setShowform] = useState(false);
  const [returndate, setReturndate] = useState("");
  const username = usecdotStore((state) => state.username);
  const formdata = useRef("");
  const [btnEnabled, setButtonEnabled] = useState(true);

  useEffect(() => {
    if (
      selectedemp &&
      selectedasset
      ) {
      setButtonEnabled(false);
    }
  }, [selectedasset, selectedemp, allocatedate]);

  useEffect(() => {
    assetEditApi();
  }, []);

  const assetEditApi = async () => {
    // starting
    await axios
      .get(baseURL + "asset/" + eventid + "/")
      .then(function (response) {
        formdata.current = response.data[0];
        console.log("kcheckpost " + JSON.stringify(formdata.current));
        setSelectedasset(formdata.current.asset);
        setSelectedemp(formdata.current.employee);
        setAllocatedate(formdata.current.allocation_date);
        setReturndate(formdata.current.return_date);
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
      asset: selectedasset,
      employee: selectedemp,
      allocation_date: allocatedate,
      return_date: returndate,
    },

    enableReinitialize: true,

    onSubmit: async (values) => {
      console.log(values);
      formik.values.asset = selectedasset;
      formik.values.employee = selectedemp;
      formik.values.allocation_date = allocatedate;
      formik.values.return_date = returndate;

      console.log("Values: " + JSON.stringify(values));

      // starting
      await axios
        .post(baseURL + "create-asset/", values)
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
          assetApi();
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

  const handleAssetChange = (event) => {
    setSelectedasset(event.target.value);
  };

  const handleEmployeeChange = (event) => {
    setSelectedemp(event.target.value);
  };

  const assetApi = async () => {
    // starting
    await axios
      .get(baseURL + "myasset/" + username + "/")
      .then(function (response) {
        updateAssets(response.data);
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
            Edit Assigned Asset
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
                <FormControl variant="standard" sx={{ minWidth: "92%" }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Asset
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={selectedasset}
                    onChange={handleAssetChange}
                    label="User Type"
                  >
                    {assetlist.map((item, index) => {
                      return (
                        <MenuItem value={item.id}>{item.asset_name}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
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
                <Box sx={{ m: 2 }} />
              </Grid>
              <Grid item md={5} xs={12}>
                <Box sx={{ m: 7 }} />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Allocation Date"
                    inputFormat="DD/MM/YYYY"
                    value={allocatedate}
                    onChange={(newValue) => {
                      setAllocatedate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
                <Box sx={{ m: 2 }} />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Return Date"
                    value={returndate}
                    inputFormat="DD/MM/YYYY"
                    onChange={(newValue) => {
                      setReturndate(newValue);
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
