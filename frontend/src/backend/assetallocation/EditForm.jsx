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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import TableRow from "@mui/material/TableRow";

export default function EditForm({ onClick, eventid }) {
  const baseURL = process.env.REACT_APP_API_URL;
  const [selectedemp, setSelectedemp] = useState("");
  const [selecteddepartment, setSelecteddepartment] = useState("");
  const [asset_status, setAssetStatus] = useState("Alocated");
  const [selectedasset, setSelectedasset] = useState("");
  const [assetcategory, setAssetcategory] = useState("");
  const form = useRef();
  const employees = usecdotStore((state) => state.employees);
  const departments = usecdotStore((state) => state.departments);
  const assetcategories = usecdotStore((state) => state.assetcategories);
  const [allocatedate, setAllocatedate] = useState("");
  const [showform, setShowform] = useState(false);
  const [returndate, setReturndate] = useState("");
  const formdata = useRef("");
  const [btnEnabled, setButtonEnabled] = useState(true);
  const [assetName, setAssetName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [supportLink, setSupportLink] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [purchaseValue, setPurchaseValue] = useState("");
  const [description, setDescription] = useState("");
  const [username, setUsername] = useState("");
  const [alist, setAlist] = useState([]);
  const [iassets, setIassets] = useState([]);

  useEffect(() => {
    assetApi();
  }, [])

  const assetApi = async () => {
    // starting
    await axios
      .get(baseURL + "assets/")
      .then(function (response) {
        setIassets(response.data);
        setAlist(response.data);
        assetEditApi();
      })
      .catch(function (error) {
        console.log("kcheckpost" + error); //return 429
      });
    // ending
  };

  useEffect(() => {
    console.log("selectedasset: " + selectedasset);
    if (selectedemp && selectedasset) {
      setButtonEnabled(false);
    }
  }, [selectedasset, selectedemp, allocatedate]);

  const assetEditApi = async () => {
    // starting
    await axios
      .get(baseURL + "assets/" + eventid)
      .then(function (response) {
        formdata.current = response.data;
        console.log("kcheckpost " + JSON.stringify(formdata.current));
        setSelectedasset(formdata.current.asset_id);
        setAssetcategory(formdata.current.asset_category);
        setUsername(formdata.current.username);
        setSelectedemp(formdata.current.employee_id || formdata.current.employee);
        setSelecteddepartment(formdata.current.department_id || formdata.current.department);
        setAllocatedate(formdata.current.allocation_date);
        setReturndate(formdata.current.return_date);
        setAssetStatus(formdata.current.status);
        formik.values.description = formdata.current.description;

        alist.map((item, index) => {
          if (item.id == (formdata.current.asset_id || formdata.current.asset)) {
            setAssetName(item.asset_name);
            setManufacturer(item.manufacturer);
            setModelNumber(item.model_number);
            setSerialNumber(item.serial_number);
            setSupportLink(item.support_link);
            setPurchaseDate(item.purchasing_date);
            setServiceDate(item.active_service_date);
            setPurchaseValue(item.purchasing_value);
            setDescription(item.description);
            console.log("name: " + item.asset_name);
            console.log("Manufacturer:: " + item.manufacturer);
          }
        });

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
      department_id: selecteddepartment,
      allocation_date: allocatedate,
      return_date: returndate,
      username: username,
    },

    enableReinitialize: true,

    onSubmit: async (values) => {
      console.log(values);
      formik.values.asset_id = selectedasset;
      formik.values.employee_id = selectedemp;
      formik.values.username = username;
      formik.values.department_id = selecteddepartment;
      formik.values.allocation_date = allocatedate;
      formik.values.return_date = returndate;
      formik.values.asset_category = assetcategory;
      formik.values.status = asset_status;

      console.log("Values: " + JSON.stringify(values));

      // starting
      await axios
        .put(baseURL + "assets/" + eventid, values)
        .then(function (response) {
          console.log("Asset allocation updated: " + JSON.stringify(response.data));
          toast.success("Asset allocation updated successfully!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            toastId: "id",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          onClick();
          window.location.reload();
        })
        .catch(function (error) {
          console.log("Error updating allocation: " + error);
          toast.error("Failed to update asset allocation!", {
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
    alist.map((item, index) => {
      if (item.id == event.target.value) {
        setAssetName(item.asset_name);
        setManufacturer(item.manufacturer);
        setModelNumber(item.model_number);
        setSerialNumber(item.serial_number);
        setSupportLink(item.support_link);
        setPurchaseDate(item.purchasing_date);
        setServiceDate(item.active_service_date);
        setPurchaseValue(item.purchasing_value);
        setDescription(item.description);
        console.log("name: " + item.asset_name);
        console.log("Manufacturer:: " + item.manufacturer);
      }
    });
  };

  const handleEmployeeChange = (event) => {
    setSelectedemp(event.target.value);
    employees.map((item, index) => {
      if (item.id == event.target.value) {
        setUsername(item.username);
        setSelecteddepartment(item.department_id || item.department);
        console.log("username: " + item.username);
      }
    });
  };

  const handleDepartmentChange = (event) => {
    setSelecteddepartment(event.target.value);
    console.log(event.target.value);
  };

  const handleAssetStatusChange = (event) => {
    setAssetStatus(event.target.value);
  };


  const handleAssetCategoryChange = (event) => {
    setAssetcategory(event.target.value);
    var data_filter = iassets.filter((element) => element.asset_category_id == event.target.value);
    setAlist(data_filter);
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
                    Category
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={assetcategory}
                    onChange={handleAssetCategoryChange}
                    label="Category"
                  >
                    {assetcategories.map((item, index) => {
                      return (
                        <MenuItem value={item.id}>{item.category}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
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
                    {alist.map((item, index) => {
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
                <FormControl variant="standard" sx={{ minWidth: "92%" }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Department
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={selecteddepartment}
                    onChange={handleDepartmentChange}
                    label="User Type"
                  >
                    {departments.map((item, index) => {
                      return (
                        <MenuItem value={item.id}>
                          {item.department_name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <Box sx={{ m: 2 }} />
                <FormControl variant="standard" sx={{ minWidth: "92%" }}>
                  <InputLabel id="gender-label">Status</InputLabel>
                  <Select
                    label="Status"
                    labelId="gender-label"
                    size="small"
                    value={asset_status}
                    onChange={handleAssetStatusChange}
                  >
                    <MenuItem value={"Allocated"}>Allocated</MenuItem>
                    <MenuItem value={"Returned"}>Returned</MenuItem>
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
                <Box sx={{ m: 3 }} />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <FormControl variant="standard" sx={{ minWidth: "92%" }}>
                    <DatePicker
                      label="Allocation Date"
                      inputFormat="DD/MM/YYYY"
                      value={allocatedate}
                      onChange={(newValue) => {
                        setAllocatedate(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField size="small" {...params} />
                      )}
                    />
                  </FormControl>
                </LocalizationProvider>
                <Box sx={{ m: 3 }} />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <FormControl variant="standard" sx={{ minWidth: "92%" }}>
                    <DatePicker
                      label="Return Date"
                      value={returndate}
                      inputFormat="DD/MM/YYYY"
                      onChange={(newValue) => {
                        setReturndate(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField size="small" {...params} />
                      )}
                    />
                  </FormControl>
                </LocalizationProvider>
              </Grid>
              <Grid item md={5} xs={12}>
                <Box sx={{ m: 2 }} />
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 170 }} aria-label="simple table">
                    <TableBody>
                      <TableRow>
                        <TableCell align="left">
                          <Typography variant="p" className="font-bold">
                            Manufacturer:
                          </Typography>
                        </TableCell>
                        <TableCell align="left" sx={{ minWidth: 170 }}>
                          <Typography variant="p" className="font-bold">
                            {manufacturer}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell align="left">
                          <Typography variant="p" className="font-bold">
                            Serial number:
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Typography variant="p" className="font-bold">
                            {serialNumber}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell align="left">
                          <Typography variant="p" className="font-bold">
                            Support link:
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Typography variant="p" className="font-bold">
                            {supportLink}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell align="left">
                          <Typography variant="p" className="font-bold">
                            Purchasing date:
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Typography variant="p" className="font-bold">
                            {purchaseDate}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell align="left">
                          <Typography variant="p" className="font-bold">
                            Active Service Date:
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Typography variant="p" className="font-bold">
                            {serviceDate}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell align="left">
                          <Typography variant="p" className="font-bold">
                            Purchasing Value:
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Typography variant="p" className="font-bold">
                            {purchaseValue}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell align="left">
                          <Typography variant="p" className="font-bold">
                            Description:
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Typography variant="p" className="font-bold">
                            {description}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
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
