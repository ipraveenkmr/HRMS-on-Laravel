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
import { AiFillDelete } from "react-icons/ai";
import Typography from "@mui/material/Typography";
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
  width: "40%",
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

export default function DailyTask() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [eventid, setEventid] = useState("");
  const [open, setOpen] = useState(false);
  const [editopen, setEditOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);
  const updateDailytask = usecdotStore((state) => state.updateDailytask);
  const employees = usecdotStore((state) => state.employees);
  const assetlist = usecdotStore((state) => state.assetlist);
  const dailytask = usecdotStore((state) => state.dailytask).sort((a, b) =>
    a.id > b.id ? -1 : 1
  );

  const baseURL = process.env.REACT_APP_API_URL;
  const [changedepartment, setChangeDepartment] = useState("");
  const departments = usecdotStore((state) => state.departments);
  const emp_department = usecdotStore((state) => state.emp_department);
  const emp_id = usecdotStore((state) => state.emp_id);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dailytask.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    dailyTaskApi();
  }, []);

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

  const dailyTaskApi = async () => {
    // starting
    await axios
      .get(baseURL + "daily-tasks/manager/" + emp_id + "/")
      .then(function (response) {
        console.log("assets: " + JSON.stringify(response.data));
        updateDailytask(response.data);
      })
      .catch(function (error) {
        console.log("kcheckpost" + error); //return 429
      });
    // ending
  };

  const deleteApi = async (event) => {
    // starting
    await axios
      .delete(baseURL + "delete-asset/" + event + "/", {})
      .then(function (response) {
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
        dailyTaskApi();
      })
      .catch(function (error) {
        Swal.fire("Error!", "Something went wrong.", "error");
        console.log("kcheckpost" + error); //return 429
      });
    // ending
  };

  const handleChangeDepartment = async (event) => {
    setChangeDepartment(event.target.value);

    if (event.target.value) {
      await axios
        .get(baseURL + "daily-tasks/manager/" + emp_id + "/")
        .then(function (response) {
          console.log("daily-tasks/manager: " + JSON.stringify(response.data));
          updateDailytask(response.data);
        })
        .catch(function (error) {
          console.log("kcheckpost" + error); //return 429
        });
    } else {
      dailyTaskApi();
    }
  };

  return (
    <>
      <Typography align="center" variant="h5">
        Employee Daily Task
      </Typography>
      <Stack direction="row" spacing={2} className="my-2 mb-2">
        {/* <FormControl sx={{ minWidth: "16%" }} size="small">
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
        </FormControl> */}
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
              <TableCell>Task</TableCell>
              <TableCell>Employee</TableCell>
              <TableCell>Manager</TableCell>
              <TableCell>Submission Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? dailytask.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : dailytask
            ).map((row) => (
              <TableRow key={row.id}>
                <TableCell style={{ width: 160 }}>{row.task}</TableCell>
                <TableCell style={{ width: 160 }}>
                  {employees.map((item, index) => {
                    return <>{item.id === row.employee_id && item.emp_name}</>;
                  })}
                </TableCell>
                <TableCell style={{ width: 160 }}>
                  {employees.map((item, index) => {
                    return <>{item.id === row.employee_id && item.emp_name}</>;
                  })}
                </TableCell>
                <TableCell style={{ width: 160 }}>
                  {moment(row.submission_date).format("DD-MM-YYYY")}
                </TableCell>
                <TableCell style={{ width: 160 }}>{row.description}</TableCell>
                <TableCell style={{ width: 160 }}>
                  {moment(row.created_at).format("DD-MM-YYYY")}
                </TableCell>
                <TableCell style={{ width: 20 }}>
                  <Stack spacing={2} direction="row">
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
                count={dailytask.length}
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
