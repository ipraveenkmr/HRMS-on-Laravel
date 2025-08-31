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
import Stack from "@mui/material/Stack";
import { FiEdit } from "react-icons/fi";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import EditForm from "./EditForm";
import { usecdotStore } from "../../components/cdotStore";
import TableHead from "@mui/material/TableHead";
import axios from "axios";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
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

export default function LeaveManager() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [eventid, setEventid] = useState("");
  const [uname, setUname] = useState("");
  const [editopen, setEditOpen] = useState(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);
  const updateManageLeave = usecdotStore((state) => state.updateManageLeave);
  const employees = usecdotStore((state) => state.employees);
  const manageleave = usecdotStore((state) => state.manageleave).sort((a, b) =>
    a.id > b.id ? -1 : 1
  );
  const [emprecord, SetEmprecord] = useState([]);
  const [eid, setEmpid] = useState('');
  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    manageleaveApi();
  }, []);

  useEffect(() => {
    SetEmprecord(manageleave);
  }, [manageleave]);

  const manageleaveApi = async () => {
    // starting
    await axios
      .get(baseURL + "manageleave/")
      .then(function (response) {
        updateManageLeave(response.data);
        SetEmprecord(response.data);
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

  const editUser = (event, usernam, empid) => {
    setEventid(event);
    setUname(usernam);
    setEmpid(empid);
    handleEditOpen();
  };

  const handleUsernameChange = (newValue) => {
    if (newValue) {
      var emplist = emprecord.filter(
        (data) => data.username == newValue.username
      );
      SetEmprecord(emplist);
    } else {
      manageleaveApi();
    }
  };

  return (
    <>
      <Typography align="center" variant="h5">
        Manage Leave
      </Typography>
      <Modal
        open={editopen}
        onClose={handleEditClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflow: "auto" }}
      >
        <Box sx={style}>
          <EditForm onClick={handleEditClose} eventid={eventid} uname={uname} eid={eid} />
        </Box>
      </Modal>
      <Stack direction="row" spacing={2} className="my-2 mb-2">
        <FormControl variant="outlined" sx={{ minWidth: "16%" }} size="small">
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={employees}
            onChange={(e, v) => handleUsernameChange(v)}
            getOptionLabel={(employees) => employees.emp_name || ""}
            sx={{ width: 250 }}
            renderInput={(params) => (
              <TextField {...params} label="By Name" size="small" />
            )}
          />
        </FormControl>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        ></Typography>
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>CL</TableCell>
              <TableCell>EI</TableCell>
              <TableCell>LWP</TableCell>
              <TableCell>Other</TableCell>
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
                <TableCell style={{ width: 160 }}>
                  {employees.map((item, index) => {
                    return <>{item.id === row.employee_id && item.emp_name}</>;
                  })}
                </TableCell>
                <TableCell style={{ width: 160 }}>
                  {row.remaining_CL_Days}
                </TableCell>
                <TableCell style={{ width: 160 }}>
                  {row.remaining_EI_Days}
                </TableCell>
                <TableCell style={{ width: 160 }}>
                  {row.remaining_LWP_Days}
                </TableCell>
                <TableCell style={{ width: 160 }}>
                  {row.remaining_other_leave_in_days}
                </TableCell>
                <TableCell style={{ width: 20 }}>
                  <Stack spacing={2} direction="row">
                    <FiEdit
                      style={{ fontSize: "20px", color: "blue" }}
                      className="cursor-pointer"
                      onClick={() => editUser(row.id, row.username, row.employee)}
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
