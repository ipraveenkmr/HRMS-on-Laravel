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

export default function MyAttendance() {
  const [punchRecord, setPunchRecord] = useState(null);
  const [punchBusy, setPunchBusy] = useState(false);
  const [punchError, setPunchError] = useState('');
  const [filters, setFilters] = useState({ from: moment().startOf('month').format('YYYY-MM-DD'), to: moment().endOf('month').format('YYYY-MM-DD'), status: '' });
  const [total, setTotal] = useState(0);
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
  const username = usecdotStore((state) => state.username);
  const attendanceData = usecdotStore((state) => state.attendance);
  const attendance = (Array.isArray(attendanceData) ? [...attendanceData] : []).sort((a, b) =>
    a.id > b.id ? -1 : 1
  );

  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    attendanceApi();
  }, [page, rowsPerPage, filters.from, filters.to, filters.status]);

  useEffect(() => {
    if (!username) return;
    axios.get(baseURL + `attendance/check/${moment().format('YYYY-MM-DD')}/${encodeURIComponent(username)}`)
      .then((response) => setPunchRecord(response.data[0] || null))
      .catch(() => setPunchError('Could not load today’s punch state.'));
  }, [username]);

  const punch = async (action) => {
    if (punchBusy) return;

    if (action === 'out') {
      const result = await Swal.fire({
        title: "Punch Out?",
        text: "Are you sure you want to punch out for the day?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Punch Out",
        cancelButtonText: "Cancel",
      });
      if (!result.isConfirmed) {
        return;
      }
    }

    setPunchBusy(true);
    setPunchError('');
    try {
      const response = await axios.post(baseURL + 'attendance/punch', { action });
      setPunchRecord(response.data);
      attendanceApi();
      Swal.fire({
        icon: "success",
        title: action === "out" ? "Punched Out Successfully" : "Punched In Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      setPunchError(error.response?.data?.detail || 'Could not record your punch. Please retry.');
      axios.get(baseURL + `attendance/check/${moment().format('YYYY-MM-DD')}/${encodeURIComponent(username)}`)
        .then((response) => setPunchRecord(response.data[0] || null)).catch(() => {});
    } finally {
      setPunchBusy(false);
    }
  };

  const attendanceApi = async () => {
    // starting
    await axios
      .get(baseURL + "attendance/log/filter", { params: { ...filters, page: page + 1, per_page: rowsPerPage } })
      .then(function (response) {
        updateAttendance(response.data.data);
        setTotal(response.data.total);
      })
      .catch(function (error) {
        console.log("kcheckpost" + error); //return 429
      });
    // ending
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    0;

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

  const editUser = (event) => {
    setEventid(event);
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
      .delete(baseURL + "delete-attendance/" + event, {})
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

  return (
    <>
      <Typography align="center" variant="h5">Attendance Details</Typography>
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
      <Stack direction="row" spacing={2} className="my-2 mb-2">
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        ></Typography>
        <Button variant="contained" disabled={punchBusy || Boolean(punchRecord)} onClick={() => punch('in')}>Punch In</Button>
        <Button variant="contained" disabled={punchBusy || !punchRecord || Boolean(punchRecord.logout_at)} onClick={() => punch('out')}>Punch Out</Button>
      </Stack>
      <Typography>{punchRecord ? `Today: In ${punchRecord.login_at || '—'}, Out ${punchRecord.logout_at || '—'}` : 'Not punched in today'}</Typography>
      {punchError && <Typography color="error" role="alert">{punchError}</Typography>}
      <Box height={20} />
      <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
        <label>From <input type="date" value={filters.from} onChange={(e) => { setPage(0); setFilters({ ...filters, from: e.target.value }); }} /></label>
        <label>To <input type="date" min={filters.from} value={filters.to} onChange={(e) => { setPage(0); setFilters({ ...filters, to: e.target.value }); }} /></label>
        <label>Status <select value={filters.status} onChange={(e) => { setPage(0); setFilters({ ...filters, status: e.target.value }); }}><option value="">All</option><option>Present</option><option>Absent</option><option>Half Day</option><option>Holiday</option><option>Web</option></select></label>
        <Button onClick={() => { setPage(0); setFilters({ from: '', to: '', status: '' }); }}>Clear filters</Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell>Attendance</TableCell>
              <TableCell>Logged Time</TableCell>
              <TableCell>Login At</TableCell>
              <TableCell>Logout At</TableCell>
              <TableCell>Date</TableCell>
              {/* <TableCell>Action</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {attendance.map((row) => (
              <TableRow key={row.id}>
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
                    <span className="text-violet-700">{row.attendance}</span>
                  </TableCell>
                )}
                <TableCell style={{ width: 160 }}>{row.log_time}</TableCell>
                <TableCell style={{ width: 160 }}>{row.login_at}</TableCell>
                <TableCell style={{ width: 160 }}>{row.logout_at}</TableCell>
                <TableCell style={{ width: 160 }}>
                  {moment(row.login_date).format("DD-MM-YYYY")}
                </TableCell>
                {/* <TableCell style={{ width: 20 }}>
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
                </TableCell> */}
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
                count={total}
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
