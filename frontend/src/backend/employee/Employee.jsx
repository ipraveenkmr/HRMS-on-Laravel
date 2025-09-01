import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
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
import { AiOutlineUserAdd } from "react-icons/ai";
import { RiFileUserLine } from "react-icons/ri";
import { AiFillDelete, AiOutlineCloudDownload } from "react-icons/ai";
import { FiEdit, FiDownload } from "react-icons/fi";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TableHead from "@mui/material/TableHead";
import AddForm from "./AddForm";
import AddUsername from "./AddUsername";
import { usecdotStore } from "../../components/cdotStore";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";
import Autocomplete from "@mui/material/Autocomplete";
import { useemployeeStore } from "../../components/employeeStore";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  height: "85%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const ustyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "27%",
  height: "50%",
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

export default function Employee() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [eventid, setEventid] = useState("");
  const [open, setOpen] = useState(false);
  const [editopen, setEditOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);
  const updateEmployee = usecdotStore((state) => state.updateEmployee);
  const updateAttendance = usecdotStore((state) => state.updateAttendance);
  const employees = usecdotStore((state) => state.employees).sort((a, b) =>
    a.id > b.id ? -1 : 1
  );
  const [emprecord, SetEmprecord] = useState([]);
  const [empdata, SetEmpdata] = useState("");
  const baseURL = process.env.REACT_APP_API_URL;

  const updateStUsername = useemployeeStore((state) => state.updateStUsername);
  const updateStCompany = useemployeeStore((state) => state.updateStCompany);
  const updateStBranchname = useemployeeStore(
    (state) => state.updateStBranchname
  );
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
  const updateStEmpNo = useemployeeStore((state) => state.updateStEmpNo);
  const updateStDepartment = useemployeeStore(
    (state) => state.updateStDepartment
  );
  const updateStDesignation = useemployeeStore(
    (state) => state.updateStDesignation
  );
  const updateStEmpType = useemployeeStore((state) => state.updateStEmpType);
  const updateStJobType = useemployeeStore((state) => state.updateStJobType);
  const updateStProbation = useemployeeStore(
    (state) => state.updateStProbation
  );
  const updateStFileNo = useemployeeStore((state) => state.updateStFileNo);
  const updateStPfAccountNo = useemployeeStore(
    (state) => state.updateStPfAccountNo
  );
  const updateStEsiAccountNo = useemployeeStore(
    (state) => state.updateStEsiAccountNo
  );
  const updateUanNumber = useemployeeStore(
    (state) => state.updateUanNumber
  );
  const updateStStatus = useemployeeStore((state) => state.updateStStatus);
  const updateStFullNfinal = useemployeeStore(
    (state) => state.updateStFullNfinal
  );
  const updateStJoiningdate = useemployeeStore(
    (state) => state.updateStJoiningdate
  );
  const updateStResignationdate = useemployeeStore(
    (state) => state.updateStResignationdate
  );
  const updateStLastWorkingDay = useemployeeStore(
    (state) => state.updateStLastWorkingDay
  );
  const updateStPayGrade = useemployeeStore((state) => state.updateStPayGrade);
  const updateStGrossSalary = useemployeeStore(
    (state) => state.updateStGrossSalary
  );
  const updateStPf = useemployeeStore((state) => state.updateStPf);
  const updateStEsi = useemployeeStore((state) => state.updateStEsi);
  const updateStBankName = useemployeeStore((state) => state.updateStBankName);
  const updateStBankAccountNo = useemployeeStore(
    (state) => state.updateStBankAccountNo
  );
  const updateStIfscCode = useemployeeStore((state) => state.updateStIfscCode);
  const updateStBranch = useemployeeStore((state) => state.updateStBranch);
  const updateStBankCity = useemployeeStore((state) => state.updateStBankCity);
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
  const updateStQualification = useemployeeStore(
    (state) => state.updateStQualification
  );
  const updateStSpecialization = useemployeeStore(
    (state) => state.updateStSpecialization
  );
  const updateStBoard = useemployeeStore((state) => state.updateStBoard);
  const updateStCourseName = useemployeeStore(
    (state) => state.updateStCourseName
  );
  const updateStPassingYear = useemployeeStore(
    (state) => state.updateStPassingYear
  );
  const updateStProfilePic = useemployeeStore(
    (state) => state.updateStProfilePic
  );
  const updateStAadharPic = useemployeeStore(
    (state) => state.updateStAadharPic
  );
  const updateStPanPic = useemployeeStore((state) => state.updateStPanPic);
  const updateBasicPay = useemployeeStore((state) => state.updateBasicPay);
  const [changedepartment, setChangeDepartment] = useState("");
  const departments = usecdotStore((state) => state.departments);
  const backendURL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    attendanceApi();
    employeeApi();
    SetEmprecord(employees);
  }, []);

  useEffect(() => {
    SetEmprecord(employees);
  }, [employees]);

  const attendanceApi = async () => {
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

  const employeeApi = async () => {
    // starting
    await axios
      .get(baseURL + "employees", {
        // headers: {
        //   "Access-Control-Allow-Origin": "*",
        //   "Content-type": "Application/json",
        //   Authorization: `Bearer ${usertoken}`,
        // },
      })
      .then(function (response) {
        updateEmployee(response.data);
      })
      .catch(function (error) {
        console.log("kcheckpost" + error); //return 429
      });
    // ending
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - employees.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const editUser = (event) => {
    setEventid(event);
    handleOpen();
  };

  const downloadAadhaar = (event) => {
    window.open(backendURL + event);
  };

  const downloadPan = (event) => {
    window.open(backendURL + event);
  };

  const downloadPhoto = (event) => {
    window.open(backendURL + event);
  };

  const createUsername = () => {
    handleEditOpen();
  };

  const addUser = () => {
    // localStorage.removeItem('cdot_empstore_api');
    updateStUsername("");
    updateStCompany("");
    updateStBranchname("");
    updateStWorkMode("");
    updateStName("");
    updateStEmail("");
    updateStPhone("");
    updateStEmergencyPhone();
    updateStGender();
    updateStFatherHusbandName("");
    updateStMotherName("");
    updateStPermanentAddress("");
    updateStPresentAddress("");
    updateStCity("");
    updateStState("");
    updateStPincode("");
    updateStPan("");
    updateStAadhaar("");
    updateStDob("");
    updateStEmpNo("");
    updateStDepartment("");
    updateStDesignation("");
    updateStEmpType("");
    updateStJobType("");
    updateStProbation("");
    updateStFileNo("");
    updateStPfAccountNo("");
    updateStEsiAccountNo("");
    updateUanNumber("");
    updateStStatus("");
    updateStFullNfinal("");
    updateStJoiningdate("");
    updateStResignationdate("");
    updateStLastWorkingDay("");
    updateStPayGrade("");
    updateStGrossSalary(0);
    updateStPf(0);
    updateStEsi(0);
    updateStBankName("");
    updateStBankAccountNo(0);
    updateStIfscCode("");
    updateStBranch("");
    updateStBankCity("");
    updateStQualification("");
    updateStSpecialization("");
    updateStBoard("");
    updateStCourseName("");
    updateStPassingYear("");
    updateStEmployer("");
    updateStJobTitle("");
    updateStComment("");
    updateStEndDate("");
    updateStStartDate("");
    updateStRefernceName("");
    updateStRefernceDesignation("");
    updateStRefernceDepartment("");
    updateStRefernceContact("");
    updateStRefernceEmail("");
    updateStRefernceNameIfAny("");
    updateStRefernceDesignationIfAny("");
    updateStRefernceDepartmentIfAny("");
    updateStRefernceContactIfAny("");
    updateStRefernceEmailIfAny("");
    updateStProfilePic("");
    updateStAadharPic("");
    updateStPanPic("");
    setEventid();
    handleOpen();
    updateBasicPay(false);
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

  const deleteApi = async (event) => {
    // starting
    await axios
      .delete(baseURL + "delete-employee/" + event + "/", {
        // headers: {
        //   "Access-Control-Allow-Origin": "*",
        //   "Content-type": "Application/json",
        //   Authorization: `Bearer ${usertoken}`,
        // },
      })
      .then(function (response) {
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
        employeeApi();
      })
      .catch(function (error) {
        Swal.fire("Error!", "Something went wrong.", "error");
      });
    // ending
  };

  useEffect(() => {
    if (empdata) {
      SetEmprecord([empdata]);
      // SetEmprecord([...emprecord, empdata]);
    } else {
      SetEmprecord(employees);
    }
  }, [empdata]);

  const handleChangeDepartment = async (event) => {
    setChangeDepartment(event.target.value);

    if (event.target.value) {
      await axios
        .get(baseURL + "employees/manager/" + event.target.value + "/")
        .then(function (response) {
          updateEmployee(response.data);
        })
        .catch(function (error) {
          console.log("kcheckpost" + error); //return 429
        });
    } else {
      employeeApi();
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Username", "Name", "Phone", "Email", "Gender", "Father/Husband Name", 
      "Mother Name", "City", "State", "Pincode", "PAN", "Aadhaar", "DOB",
      "Employee No", "Department", "Designation", "Employee Type", "Job Type",
      "Joining Date", "Gross Salary", "Bank Name", "Bank Account No", 
      "IFSC Code", "Created At"
    ];
    
    const csvData = emprecord.map(emp => [
      emp.username || "",
      emp.emp_name || "",
      emp.emp_phone || "",
      emp.email || "",
      emp.gender || "",
      emp.father_husband_name || "",
      emp.mother_name || "",
      emp.city || "",
      emp.state || "",
      emp.pincode || "",
      emp.pan || "",
      emp.aadhaar || "",
      emp.dob ? moment(emp.dob).format("DD-MM-YYYY") : "",
      emp.emp_no || "",
      emp.department || "",
      emp.designation || "",
      emp.emp_type || "",
      emp.job_type || "",
      emp.joining_date ? moment(emp.joining_date).format("DD-MM-YYYY") : "",
      emp.gross_salary || "",
      emp.bank_name || "",
      emp.bank_account_no || "",
      emp.ifsc_code || "",
      moment(emp.created_at).format("DD-MM-YYYY")
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `employees_${moment().format("YYYY-MM-DD")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Typography align="center" variant="h5">
        Employee Details
      </Typography>
      <Modal
        open={open}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflow: "auto" }}
        onHide={handleClose}
        backdrop="static"
      >
        <Box sx={style}>
          <AddForm closeform={handleClose} eventid={eventid} />
        </Box>
      </Modal>
      <Modal
        open={editopen}
        onClose={handleEditClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflow: "auto" }}
        onHide={handleEditClose}
        backdrop="static"
      >
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh', // Full viewport height
          padding: '20px' // Optional: add some padding
        }}>
          <AddUsername closeform={handleEditClose} />
        </div>
      </Modal>
      <Stack direction="row" spacing={2} className="my-2 mb-2">
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
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={employees}
          onChange={(e, v) => SetEmpdata(v)}
          getOptionLabel={(employees) => employees.username || ""}
          sx={{ width: 250 }}
          renderInput={(params) => (
            <TextField {...params} label="By Name" size="small" />
          )}
        />
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={employees}
          onChange={(e, v) => SetEmpdata(v)}
          getOptionLabel={(employees) => employees.emp_phone || ""}
          sx={{ width: 250 }}
          renderInput={(params) => (
            <TextField {...params} label="By Number" size="small" />
          )}
        />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        ></Typography>
        <Button
          variant="contained"
          onClick={() => exportToCSV()}
          endIcon={<FiDownload />}
          color="success"
        >
          Export CSV
        </Button>
        <Button
          variant="contained"
          onClick={() => createUsername()}
          endIcon={<RiFileUserLine />}
        >
          Create Username
        </Button>
        <Button
          variant="contained"
          onClick={() => addUser()}
          endIcon={<AiOutlineUserAdd />}
        >
          Add
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Download</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? emprecord.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
              : emprecord
            ).map((row) => (
              <TableRow key={row.id}>
                <TableCell style={{ width: 160 }}>{row.username}</TableCell>
                <TableCell style={{ width: 160 }}>{row.emp_name}</TableCell>
                <TableCell style={{ width: 160 }}>{row.emp_phone}</TableCell>
                <TableCell style={{ width: 160 }}>{row.gender}</TableCell>
                <TableCell style={{ width: 160 }}>{row.city}</TableCell>
                <TableCell style={{ width: 190 }}>
                  <Stack spacing={1} direction="row">
                    {row.aadhaar_pic && (
                      <span
                        style={{ width: 60 }}
                        className="cursor-pointer"
                        onClick={() => downloadAadhaar(row.aadhaar_pic)}
                      >
                        <AiOutlineCloudDownload
                          style={{ fontSize: "20px", color: "green" }}
                        />
                        Aadhaar
                      </span>
                    )}
                    {row.pan_pic && (
                      <span
                        style={{ width: 60 }}
                        className="cursor-pointer"
                        onClick={() => downloadPan(row.pan_pic)}
                      >
                        <AiOutlineCloudDownload
                          style={{ fontSize: "20px", color: "green" }}
                        />
                        Pan
                      </span>
                    )}
                    {row.photo && (
                      <span
                        style={{ width: 60 }}
                        className="cursor-pointer"
                        onClick={() => downloadPhoto(row.photo)}
                      >
                        <AiOutlineCloudDownload
                          style={{ fontSize: "20px", color: "green" }}
                        />
                        Photo
                      </span>
                    )}
                  </Stack>
                </TableCell>
                <TableCell style={{ width: 160 }}>
                  {moment(row.created_at).format("DD-MM-YYYY")}
                </TableCell>
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
                colSpan={9}
                count={emprecord.length}
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
