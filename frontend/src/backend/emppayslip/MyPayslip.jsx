import { useState, useEffect, useRef } from "react";
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
import { AiFillEye } from "react-icons/ai";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import PrintPayslip from "../payslip/PrintPayslip";
import { usecdotStore } from "../../components/cdotStore";
import TableHead from "@mui/material/TableHead";
import axios from "axios";
import moment from "moment";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
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

export default function MyPayslip() {
  const componentRef = useRef();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [eventid, setEventid] = useState("");
  const [editopen, setEditOpen] = useState(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);
  const [uname, setUname] = useState("");
  const username = usecdotStore((state) => state.username);
  const [myPayslips, setMyPayslips] = useState([]);

  const baseURL = process.env.REACT_APP_API_URL;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - myPayslips.length) : 0;

  useEffect(() => {
    payslipApi();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const viewPayslip = (event, usernam) => {
    setEventid(event);
    setUname(usernam);
    handleEditOpen();
  };

  const payslipApi = async () => {
    // starting
    await axios
      .get(baseURL + "payroll/employee/" + username)
      .then(function (response) {
        const sortedPayslips = Array.isArray(response.data) 
          ? response.data.sort((a, b) => a.id > b.id ? -1 : 1)
          : [];
        setMyPayslips(sortedPayslips);
      })
      .catch(function (error) {
        console.log("Error fetching employee payslips: " + error);
        setMyPayslips([]);
      });
    // ending
  };

  return (
    <>
      <Modal
        open={editopen}
        onClose={handleEditClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflow: "auto" }}
      >
        <Box sx={style} ref={componentRef}>
          <PrintPayslip
            onClick={handleEditClose}
            eventid={eventid}
            uname={uname}
          />
        </Box>
      </Modal>
      <Typography align="center" variant="h5">
        My Payslips
      </Typography>
      <Stack direction="row" spacing={2} className="my-2 mb-2">
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
              <TableCell>Total Days</TableCell>
              <TableCell>Paid Days</TableCell>
              <TableCell>Total Earnings</TableCell>
              <TableCell>Total Deductions</TableCell>
              <TableCell>Net Salary</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? myPayslips.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : myPayslips
            ).map((row) => (
              <TableRow key={row.id}>
                <TableCell style={{ width: 160 }}>{row.total_days}</TableCell>
                <TableCell style={{ width: 160 }}>{row.paid_days}</TableCell>
                <TableCell style={{ width: 160 }}>
                  {row.total_earning}
                </TableCell>
                <TableCell style={{ width: 160 }}>
                  {row.total_deduction}
                </TableCell>
                <TableCell style={{ width: 160 }}>
                  {row.net_current_salary}
                </TableCell>
                <TableCell style={{ width: 160 }}>
                  {moment(row.date).format("DD-MM-YYYY")}
                </TableCell>
                <TableCell style={{ width: 160 }}>
                  {moment(row.created_at).format("DD-MM-YYYY")}
                </TableCell>
                <TableCell style={{ width: 20 }}>
                  <Stack spacing={2} direction="row">
                    <AiFillEye
                      style={{ fontSize: "20px", color: "blue" }}
                      className="cursor-pointer"
                      onClick={() => viewPayslip(row.id, username)}
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
                count={myPayslips.length}
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