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

export default function MyLeaveTracker() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [eventid, setEventid] = useState("");
  const [open, setOpen] = useState(false);
  const [editopen, setEditOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);
  const updateLeave = usecdotStore((state) => state.updateLeave);
  const employees = usecdotStore((state) => state.employees);
  const username = usecdotStore((state) => state.username);
  const leaves = usecdotStore((state) => state.leaves).sort((a, b) =>
    a.id > b.id ? -1 : 1
  );

  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    leaveApi();
    console.log("Emp: " + JSON.stringify(employees[0].id));
  }, []);

  const leaveApi = async () => {
    // starting
    await axios
      .get(baseURL + "leave/employee/" + username)
      .then(function (response) {
        updateLeave(response.data);
      })
      .catch(function (error) {
        console.log("kcheckpost" + error); //return 429
      });
    // ending
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - leaves.length) : 0;

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
      .delete(baseURL + "leave/" + event, {})
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

  return (
    <>
      <Typography align="center" variant="h5">
        My Leaves
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
      <Stack direction="row" spacing={2} className="my-2 mb-2">
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
              <TableCell>Leave Reason</TableCell>
              <TableCell>Leave Status</TableCell>
              <TableCell>Leave From</TableCell>
              <TableCell>Leave To</TableCell>
              <TableCell>Created At</TableCell>
              {/* <TableCell>Action</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? leaves.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : leaves
            ).map((row) => (
              <TableRow key={row.id}>
                <TableCell style={{ width: 160 }}>{row.leave_reason}</TableCell>
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
                <TableCell style={{ width: 160 }}>
                  {moment(row.leave_from_date).format("DD-MM-YYYY")}
                </TableCell>
                <TableCell style={{ width: 160 }}>
                  {moment(row.leave_to_date).format("DD-MM-YYYY")}
                </TableCell>
                <TableCell style={{ width: 160 }}>
                  {moment(row.created_at).format("DD-MM-YYYY")}
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
                count={leaves.length}
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
