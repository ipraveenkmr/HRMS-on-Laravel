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
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";

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

export default function AssetAllocation() {
  const baseURL = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [editopen, setEditOpen] = useState(false);
  const [eventid, setEventid] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  
  // Store data
  const assets = usecdotStore((state) => state.assets);
  const updateAssets = usecdotStore((state) => state.updateAssets);
  const employees = usecdotStore((state) => state.employees);
  const departments = usecdotStore((state) => state.departments);
  const assetlist = usecdotStore((state) => state.assetlist);
  const assetcategories = usecdotStore((state) => state.assetcategories);
  const username = usecdotStore((state) => state.username);
  const emp_type = usecdotStore((state) => state.emp_type);
  const emp_department = usecdotStore((state) => state.emp_department);
  const emp_id = usecdotStore((state) => state.emp_id);
  const myassets = usecdotStore((state) => state.myassets);
  const updateMyAssets = usecdotStore((state) => state.updateMyAssets);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Role-based data fetching
  useEffect(() => {
    fetchAssetAllocations();
  }, [emp_type, emp_department, username]);

  const fetchAssetAllocations = async () => {
    try {
      let endpoint = "";
      
      if (emp_type === "Admin" || emp_type === "Asset Admin") {
        // Admin sees all allocations
        endpoint = `${baseURL}assets`;
      } else if (emp_type === "Manager") {
        // Manager sees department allocations
        endpoint = `${baseURL}assets/manager/${emp_id}`;
      } else if (emp_type === "Employee") {
        // Employee sees only their allocations
        endpoint = `${baseURL}assets/employee/${username}`;
        const response = await axios.get(endpoint);
        updateMyAssets(response.data);
        return;
      }
      
      const response = await axios.get(endpoint);
      updateAssets(response.data);
    } catch (error) {
      console.error("Error fetching asset allocations:", error);
    }
  };

  const deleteAssetAllocation = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(`${baseURL}assets/${id}`);
        await fetchAssetAllocations();
        Swal.fire("Deleted!", "Asset allocation has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting asset allocation:", error);
      Swal.fire("Error!", "Failed to delete asset allocation.", "error");
    }
  };

  // Get the appropriate data based on role
  const getDisplayData = () => {
    if (emp_type === "Employee") {
      return myassets || [];
    }
    return assets || [];
  };

  // Filter data based on search and filters
  const filteredData = getDisplayData().filter((item) => {
    const matchesSearch = searchQuery === "" || 
      (item.employee_name && item.employee_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.asset_name && item.asset_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.username && item.username.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === "" || item.status === statusFilter;
    const matchesDepartment = departmentFilter === "" || item.department_id == departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredData.length) : 0;

  const getPageTitle = () => {
    if (emp_type === "Admin" || emp_type === "Asset Admin") {
      return "Asset Allocation Management";
    } else if (emp_type === "Manager") {
      return "Department Asset Allocations";
    } else {
      return "My Assets";
    }
  };

  const canAdd = emp_type === "Admin" || emp_type === "Asset Admin";
  const canEdit = emp_type === "Admin" || emp_type === "Asset Admin" || emp_type === "Manager";
  const canDelete = emp_type === "Admin" || emp_type === "Asset Admin";

  return (
    <>
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

      <Typography variant="h4" align="center" sx={{ mb: 3 }}>
        {getPageTitle()}
      </Typography>

      {/* Search and Filter Controls */}
      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by employee name, asset name, or username..."
          sx={{ minWidth: 300 }}
        />
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Allocated">Allocated</MenuItem>
            <MenuItem value="Returned">Returned</MenuItem>
          </Select>
        </FormControl>

        {(emp_type === "Admin" || emp_type === "Asset Admin") && (
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Department</InputLabel>
            <Select
              value={departmentFilter}
              label="Department"
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <MenuItem value="">All Departments</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.department_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {/* Action Buttons */}
      {canAdd && (
        <Stack spacing={2} direction="row" sx={{ mb: 2 }}>
          <Button
            variant="contained"
            onClick={handleOpen}
            startIcon={<AiOutlineFileAdd />}
          >
            Allocate Asset
          </Button>
        </Stack>
      )}

      {/* Data Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="asset allocations table">
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Asset</TableCell>
              <TableCell>Category</TableCell>
              {(emp_type === "Admin" || emp_type === "Asset Admin") && (
                <TableCell>Department</TableCell>
              )}
              <TableCell>Allocation Date</TableCell>
              <TableCell>Return Date</TableCell>
              <TableCell>Status</TableCell>
              {(canEdit || canDelete) && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : filteredData
            ).map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.employee_name || row.username}</TableCell>
                <TableCell>{row.asset_name || row.asset_id}</TableCell>
                <TableCell>{row.category_name || row.asset_category}</TableCell>
                {(emp_type === "Admin" || emp_type === "Asset Admin") && (
                  <TableCell>{row.department_name || row.department_id}</TableCell>
                )}
                <TableCell>
                  {row.allocation_date ? moment(row.allocation_date).format("DD-MM-YYYY") : "N/A"}
                </TableCell>
                <TableCell>
                  {row.return_date ? moment(row.return_date).format("DD-MM-YYYY") : "N/A"}
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      backgroundColor: row.status === "Allocated" ? "#e3f2fd" : "#fff3e0",
                      color: row.status === "Allocated" ? "#1976d2" : "#f57c00",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                    }}
                  >
                    {row.status}
                  </Box>
                </TableCell>
                {(canEdit || canDelete) && (
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      {canEdit && (
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setEventid(row.id);
                            handleEditOpen();
                          }}
                        >
                          <FiEdit />
                        </IconButton>
                      )}
                      {canDelete && (
                        <IconButton
                          color="error"
                          onClick={() => deleteAssetAllocation(row.id)}
                        >
                          <AiFillDelete />
                        </IconButton>
                      )}
                    </Stack>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={canEdit || canDelete ? 8 : 7} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={canEdit || canDelete ? 8 : 7}
                count={filteredData.length}
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

      {filteredData.length === 0 && (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h6" color="textSecondary">
            {emp_type === "Employee" 
              ? "No assets allocated to you yet" 
              : "No asset allocations found"}
          </Typography>
        </Box>
      )}
    </>
  );
}