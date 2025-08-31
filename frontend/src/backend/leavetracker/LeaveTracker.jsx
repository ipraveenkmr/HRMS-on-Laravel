import { useState, useEffect } from "react";
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
import moment from "moment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

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

export default function LeaveTracker() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [eventid, setEventid] = useState("");
  const [uname, setUname] = useState("");
  const [open, setOpen] = useState(false);
  const [editopen, setEditOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);
  const updateLeave = usecdotStore((state) => state.updateLeave);
  const employees = usecdotStore((state) => state.employees);
  const leaves = usecdotStore((state) => state.leaves).sort((a, b) =>
    a.id > b.id ? -1 : 1
  );
  const [emprecord, SetEmprecord] = useState([]);
  const [empdata, SetEmpdata] = useState([]);
  const [statustype, setStatustype] = useState("");
  const baseURL = process.env.REACT_APP_API_URL;
  const [changedepartment, setChangeDepartment] = useState("");
  const departments = usecdotStore((state) => state.departments);
  const emp_type = usecdotStore((state) => state.emp_type);
  const emp_department = usecdotStore((state) => state.emp_department);

  useEffect(() => {
    leaveApi();
  }, []);

  useEffect(() => {
    SetEmprecord(leaves);
  }, [leaves]);

  // useEffect(() => {
  //   if (empdata) {
  //     SetEmprecord([empdata]);
  //     // SetEmprecord([...emprecord, empdata]);
  //   } else {
  //     SetEmprecord(leaves);
  //   }
  // }, [empdata]);

  const leaveApi = async () => {
    // starting
    await axios
      .get(baseURL + "leave/")
      .then(function (response) {
        if (emp_type == "Admin") {
          updateLeave(response.data);
          SetEmprecord(response.data);
        } else {
          let records = response.data;
          function filterRecordsByDepartment(records) {
            return records.filter((record) => record.department === emp_department);
          }
          const filteredRecords = filterRecordsByDepartment(records);
          updateLeave(filteredRecords);
          SetEmprecord(filteredRecords);
        }
      })
      .catch(function (error) {
        console.log("kcheckpost" + error); //return 429
      });
    // ending
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - emprecord.length) : 0;

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

  const editUser = (event, usernam) => {
    setEventid(event);
    setUname(usernam);
    handleEditOpen();
  };

  const deleteRecord = (event) => {
    console.log("Delete record.." + event);

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
      .delete(baseURL + "delete-leave/" + event + "/", {})
      .then(function (response) {
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
        leaveApi();
      })
      .catch(function (error) {
        Swal.fire("Error!", "Something went wrong.", "error");
        console.log("kcheckpost" + error); //return 429
      });
    // ending
  };

  const handleStatusChange = (event) => {
    setStatustype(event.target.value);
    if (event.target.value) {
      SetEmprecord(
        leaves.filter((job) => job.leave_status.includes(event.target.value))
      );
    } else {
      SetEmprecord(leaves);
    }
  };

  const handleChangeDepartment = async (event) => {
    setChangeDepartment(event.target.value);

    if (event.target.value) {
      await axios
        .get(baseURL + "leavebydept/" + event.target.value + "/")
        .then(function (response) {
          console.log("leavebydept: " + JSON.stringify(response.data));
          updateLeave(response.data);
        })
        .catch(function (error) {
          console.log("kcheckpost" + error); //return 429
        });
    } else {
      leaveApi();
    }
  };

  return (
    <>
      <Typography align="center" variant="h5">
        Leaves
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
          <EditForm onClick={handleEditClose} eventid={eventid} uname={uname} />
        </Box>
      </Modal>
      <Stack direction="row" spacing={2} className="my-2 mb-2">
        {/* <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={leaves}
          onChange={(e, v) => SetEmpdata(v)}
          getOptionLabel={(leaves) => leaves.leave_status || ""}
          sx={{ width: 250 }}
          renderInput={(params) => (
            <TextField {...params} label="By Status" size="small" />
          )}
        /> */}
        {emp_type == "Admin" && (<>
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
        </>)}

        <FormControl sx={{ m: 1, minWidth: "16%" }} size="small">
          <InputLabel id="demo-simple-select-helper-label">
            Select Status
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={statustype}
            label="Age"
            onChange={handleStatusChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={"Pending"}>Pending</MenuItem>
            <MenuItem value={"Approved"}>Approved</MenuItem>
            <MenuItem value={"Rejected"}>Rejected</MenuItem>
          </Select>
        </FormControl>
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
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Total Status</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Created At</TableCell>
              {emp_type == "Admin" && (
                <TableCell>Action</TableCell>
              )}
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
                <TableCell style={{ width: 160 }}>
                  {employees.map((item, index) => {
                    return <>{item.id === row.employee_id && item.emp_name}</>;
                  })}
                </TableCell>
                {row.leave_status == "Pending" && (
                  <TableCell style={{ width: 160 }}>
                    <span className="text-violet-700">{row.leave_status}</span>
                  </TableCell>
                )}
                {row.leave_status == "Approved" && (
                  <TableCell style={{ width: 160 }}>
                    <span className="text-green-700">{row.leave_status}</span>
                  </TableCell>
                )}
                {row.leave_status == "Rejected" && (
                  <TableCell style={{ width: 160 }}>
                    <span className="text-red-700">{row.leave_status}</span>
                  </TableCell>
                )}
                <TableCell style={{ width: 160 }}>{row.leave_reason}</TableCell>
                <TableCell style={{ width: 160 }}>
                  {row.leave_from_date}
                </TableCell>
                <TableCell style={{ width: 160 }}>
                  {row.leave_to_date}
                </TableCell>
                <TableCell style={{ width: 160 }}>
                  {moment(row.created_at).format("DD-MM-YYYY")}
                </TableCell>

                <TableCell style={{ width: 20 }}>
                  <Stack spacing={2} direction="row">
                    <FiEdit
                      style={{ fontSize: "20px", color: "blue" }}
                      className="cursor-pointer"
                      onClick={() => editUser(row.id, row.username)}
                    />
                    {emp_type == "Admin" && (
                      <AiFillDelete
                        style={{ fontSize: "20px", color: "darkred" }}
                        className="cursor-pointer"
                        onClick={() => deleteRecord(row.id)}
                      />
                    )}
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
