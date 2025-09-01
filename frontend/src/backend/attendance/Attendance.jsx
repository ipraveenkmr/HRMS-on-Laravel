import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { AiOutlineFileAdd } from "react-icons/ai";
import { SiGooglesheets } from "react-icons/si";
import { AiFillDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import AddForm from "./AddForm";
import EditForm from "./EditForm";
import { usecdotStore } from "../../components/cdotStore";
import TableHead from "@mui/material/TableHead";
import axios from "axios";
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import moment from "moment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Autocomplete from "@mui/material/Autocomplete";
import { CSVDownload } from "react-csv";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function Attendance() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [eventid, setEventid] = useState("");
  const [open, setOpen] = useState(false);
  const [editopen, setEditOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);
  const updateAttendance = usecdotStore((state) => state.updateAttendance);
  const updateFiyear = usecdotStore((state) => state.updateFiyear);
  const employees = usecdotStore((state) => state.employees);
  const updateEmployee = usecdotStore((state) => state.updateEmployee);
  const [changedepartment, setChangeDepartment] = useState("");
  const attendance = usecdotStore((state) => state.attendance).sort((a, b) =>
    a.id > b.id ? -1 : 1
  );
  const baseURL = process.env.REACT_APP_API_URL;
  const onlyURL = process.env.REACT_APP_URL;
  const [fromvalue, setFromValue] = useState(new Date());
  const [tovalue, setToValue] = useState(new Date());
  const departments = usecdotStore((state) => state.departments);
  const [daychange, setDaychange] = useState("Today");
  const [empdata, SetEmpdata] = useState("");
  const [month, SetMonth] = useState("January");
  const [alldata, SetAllData] = useState([]);
  const [isDownload, setIsDownload] = useState(false);
  const [exportattendance, setIsExportAttendance] = useState([]);

  useEffect(() => {
    attendanceApi();
    employeeApi();
    setIsExportAttendance(attendance);
  }, []);

  useEffect(() => {
    function getEmployeeDetails(username) {
      return employees.find((employee) => employee.username === username);
    }

    const transformedData = attendance.map(item => {
      const employeeInfo = getEmployeeDetails(item.username);
      return {
        attendance_date: item.attendance_date.split('-').slice(0, 3).reverse().join('/'),
        name: employeeInfo?.emp_name || '',
        phone: employeeInfo?.emp_phone || '',
        work_mode: employeeInfo?.work_mode || '',
        emp_type: employeeInfo?.emp_type || '',
        username: item.username,
        attendance: item.attendance,
        login_at: item.login_at,
        logout_at: item.logout_at,
        log_time: item.log_time,
        longitude: item.longitude,
        latitude: item.latitude,
        device: item.device,
        ip_address: item.ip_address,
      };
    });

    setIsExportAttendance(transformedData);
  }, [attendance]);

  const employeeApi = async () => {
    // starting
    await axios
      .get(baseURL + "employees")
      .then(function (response) {
        updateEmployee(response.data);
      })
      .catch(function (error) {
        console.log("kcheckpost" + error); //return 429
      });
    // ending
  };

  function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  const attendanceApi = async () => {
    // starting
    await axios
      .get(baseURL + "attendance/")
      .then(function (response) {
        var records = response.data;

        var str = new Date();
        var today = convert(str);
        var emplist = records.filter(
          (data) => data.created_at.substring(0, 10) == today
        );
        updateAttendance(emplist);
        SetAllData(records);
      })
      .catch(function (error) {
        console.log("kcheckpost" + error); //return 429
      });
    // ending
  };

  const attendanceApiAll = async () => {
    // starting
    await axios
      .get(baseURL + "attendance/")
      .then(function (response) {
        updateAttendance(response.data);
      })
      .catch(function (error) {
        console.log("kcheckpost" + error); //return 429
      });
    // ending
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - attendance.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const addUser = () => {
    handleOpen();
  };

  const exportData = () => {
    function convert(str) {
      var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
      return [date.getFullYear(), mnth, day].join("-");
    }
    let fromdtd = convert(fromvalue);
    let todt = convert(tovalue);
    const URL = onlyURL + "attendance-export-csv/" + fromdtd + "/" + todt;
    window.open(URL, "_blank");
  };

  const editUser = (event) => {
    setEventid(event);
    handleEditOpen();
  };

  const deleteRecord = (event) => {

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        deleteApi(event);
      }
    });
  };

  const handleChangeDepartment = async (event) => {
    setChangeDepartment(event.target.value);

    if (event.target.value) {
      await axios
        .get(baseURL + "attendance/manager/" + event.target.value + "/")
        .then(function (response) {
          updateAttendance(response.data);
        })
        .catch(function (error) {
          console.log("kcheckpost" + error); //return 429
        });
    } else {
      attendanceApi();
    }
  };

  const deleteApi = async (event) => {
    // starting
    await axios
      .delete(baseURL + "delete-attendance/" + event + "/", {})
      .then(function (response) {
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
        attendanceApi();
      })
      .catch(function (error) {
        Swal.fire("Error!", "Something went wrong.", "error");
        console.log("kcheckpost" + error); //return 429
      });
    // ending
  };

  const filterAttendance = async (newValue) => {
    setToValue(newValue);
    function convert(str) {
      var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
      return [date.getFullYear(), mnth, day].join("-");
    }
    let fromdtd = convert(fromvalue);
    let todt = convert(newValue);
    attendanceApiDate(fromdtd, todt);
    // const URL = onlyURL + "attendance-export-csv/" + fromdtd + "/" + todt;
    // window.open(URL, "_blank");
  };

  const attendanceApiDate = async (frm, too) => {
    // starting
    await axios
      .get(baseURL + "attendance/")
      .then(function (response) {
        var records = response.data;

        var emplist = records.filter(
          (data) =>
            data.created_at.substring(0, 10) >= frm &&
            data.created_at.substring(0, 10) <= too
        );

        updateAttendance(emplist);
      })
      .catch(function (error) {
        console.log("kcheckpost" + error); //return 429
      });
    // ending
  };

  function splitme(logt) {
    if (logt && typeof logt != "undefined") {
      if (logt != 0) {
        let hour = String(logt);
        hour = hour.split(".");
        let mins = parseInt(hour[1]);
        if (typeof hour[1] != "undefined") {
          if (hour[1].length === 1) {
            mins = mins * 60 * 0.1;
            return hour[0] + " hrs " + Math.round(mins) + " mins";
          } else {
            mins = mins * 60 * 0.01;
            return hour[0] + " hrs " + Math.round(mins) + " mins";
          }
        }
      } else {
        return logt + " min ";
      }
    }
  }

  const handleDayChange = (event) => {
    setDaychange(event.target.value);
    if (event.target.value == "All") {
      attendanceApiAll();
    } else {
      attendanceApi();
    }
  };

  const handleChangeMonth = (event) => {
    SetMonth(event.target.value);
  };

  const handleSearch = () => {
    var emplist = alldata.filter(
      (data) =>
        data.username == empdata.username &&
        data.created_at.substring(5, 7) == month
    );
    updateAttendance(emplist);
  };

  const handleExport = () => {
    setIsDownload(true);
  };



  useEffect(() => {
    if (isDownload) {
      setIsDownload(false);
    }
  }, [isDownload]);

  return (
    <>
      <Typography align="center" variant="h5">
        Attendance Details
      </Typography>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflow: "auto" }}
      >
        <Box sx={style}>
          <AddForm onClick={handleClose} />
        </Box>
      </Modal>
      <Modal
        open={editopen}
        onClose={handleEditClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflow: "auto" }}
      >
        <Box sx={style}>
          <EditForm onClick={handleEditClose} eventid={eventid} />
        </Box>
      </Modal>
      <Stack direction="row" spacing={2} className="my-2 mb-5">
        <FormControl sx={{ minWidth: "16%" }} size="small">
          <InputLabel id="demo-simple-dept-helper-label">
            Select Department
          </InputLabel>
          <Select
            labelId="demo-simple-dept-helper-label"
            id="demo-simple-select-standard"
            value={changedepartment}
            onChange={handleChangeDepartment}
            label="User Type"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {departments.map((item, index) => {
              return (
                <MenuItem value={item.id}>{item.department_name}</MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: "16%" }} size="small">
          <InputLabel id="demo-simple-dept-helper-label">Select Day</InputLabel>
          <Select
            labelId="demo-simple-dept-helper-label"
            id="demo-simple-select-standard"
            value={daychange}
            onChange={handleDayChange}
            label="User Type"
          >
            <MenuItem value="Today">Today</MenuItem>
            <MenuItem value="All">All</MenuItem>
          </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DesktopDatePicker
            label="From"
            inputFormat="DD/MM/YYYY"
            value={fromvalue}
            onChange={(newValue) => {
              setFromValue(newValue);
            }}
            renderInput={(params) => <TextField size="small" {...params} />}
          />
          <DesktopDatePicker
            label="To"
            inputFormat="DD/MM/YYYY"
            value={tovalue}
            onChange={(newvalue) => {
              filterAttendance(newvalue);
            }}
            // onChange={(newvalue) => {
            //   setToValue(newvalue);
            // }}
            renderInput={(params) => <TextField size="small" {...params} />}
          />
        </LocalizationProvider>
        {isDownload && (
          <>
            <CSVDownload data={exportattendance} target="_blank" />;
          </>
        )}
        {/* <Button
          variant="contained"
          onClick={exportData}
          endIcon={<SiGooglesheets />}
        >
          Export
        </Button> */}
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        ></Typography>
        <Button
          variant="contained"
          onClick={addUser}
          endIcon={<AiOutlineFileAdd />}
        >
          Add
        </Button>
      </Stack>
      <Stack direction="row" spacing={2} className="my-2 mb-5">
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={employees}
          onChange={(e, v) => SetEmpdata(v)}
          getOptionLabel={(employees) => employees.username || ""}
          sx={{ width: 250 }}
          renderInput={(params) => (
            <TextField {...params} label="By Username" size="small" />
          )}
        />
        <FormControl sx={{ minWidth: "16%" }} size="small">
          <InputLabel id="demo-simple-dept-helper-label">
            Select Month
          </InputLabel>
          <Select
            labelId="demo-simple-dept-helper-label"
            id="demo-simple-select-standard"
            value={month}
            onChange={handleChangeMonth}
            label="User Type"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="01">January</MenuItem>
            <MenuItem value="02">February</MenuItem>
            <MenuItem value="03">March</MenuItem>
            <MenuItem value="04">April</MenuItem>
            <MenuItem value="05">May</MenuItem>
            <MenuItem value="06">June</MenuItem>
            <MenuItem value="07">July</MenuItem>
            <MenuItem value="08">August</MenuItem>
            <MenuItem value="09">September</MenuItem>
            <MenuItem value="10">October</MenuItem>
            <MenuItem value="11">November</MenuItem>
            <MenuItem value="12">December</MenuItem>
          </Select>
        </FormControl>
        {/* <FormControl sx={{ minWidth: "16%" }} size="small">
          <InputLabel id="demo-simple-dept-helper-label">
            Select Year
          </InputLabel>
          <Select
            labelId="demo-simple-dept-helper-label"
            id="demo-simple-select-standard"
            value={changedepartment}
            onChange={handleChangeDepartment}
            label="User Type"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="2022">2022</MenuItem>
            <MenuItem value="2023">2023</MenuItem>
            <MenuItem value="2024">2024</MenuItem>
          </Select>
        </FormControl> */}
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
        <Button variant="contained" onClick={handleExport}>
          Export
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Attendance</TableCell>
              <TableCell>Logged Time</TableCell>
              <TableCell>Login At</TableCell>
              <TableCell>Logout At</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Device</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? attendance.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
              : attendance
            ).map((row) => (
              <TableRow key={row.id}>
                <TableCell style={{ width: 160 }}>
                  {employees.map((item, index) => {
                    return <>{item.id === row.employee_id && item.emp_name}</>;
                  })}
                </TableCell>
                {row.attendance == "Half Day" && (
                  <TableCell style={{ width: 160 }}>
                    <span className="text-yellow-500">{row.attendance}</span>
                  </TableCell>
                )}
                {row.attendance == "Web" && (
                  <TableCell style={{ width: 160 }}>
                    <span className="text-purple-700">{row.attendance}</span>
                  </TableCell>
                )}
                {row.attendance == "Absent" && (
                  <TableCell style={{ width: 160 }}>
                    <span className="text-red-600">{row.attendance}</span>
                  </TableCell>
                )}
                {row.attendance == "Present" && (
                  <TableCell style={{ width: 160 }}>
                    <span className="text-green-600">{row.attendance}</span>
                  </TableCell>
                )}
                {row.attendance == "Holiday" && (
                  <TableCell style={{ width: 160 }}>
                    <span className="text-cyan-700">{row.attendance}</span>
                  </TableCell>
                )}
                <TableCell style={{ width: 160 }}>
                  {splitme(row.log_time)}
                </TableCell>
                {/* <TableCell style={{ width: 160 }}>{row.log_time}</TableCell> */}
                <TableCell style={{ width: 160 }}>{row.login_at}</TableCell>
                <TableCell style={{ width: 160 }}>{row.logout_at}</TableCell>
                <TableCell style={{ width: 160 }}>
                  {moment(row.login_date).format("DD-MM-YYYY")}
                </TableCell>
                <TableCell style={{ width: 160 }}>{row.device}</TableCell>
                <TableCell style={{ width: 20 }}>
                  <Stack spacing={2} direction="row">
                    <FiEdit
                      style={{ fontSize: "20px", color: "blue" }}
                      className="cursor-pointer"
                      onClick={() => editUser(row.id)}
                    />
                    <AiFillDelete
                      style={{ fontSize: "20px", color: "darkred" }}
                      className="cursor-pointer"
                      onClick={() => deleteRecord(row.id)}
                    />
                  </Stack>
                </TableCell>
              </TableRow>
            ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={8}
                count={attendance.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}
