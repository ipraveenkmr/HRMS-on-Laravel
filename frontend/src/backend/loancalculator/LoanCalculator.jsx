import { useState, useRef, useEffect } from "react";
import { Typography, Button, Box, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Stack from "@mui/material/Stack";
import { BiArrowBack } from "react-icons/bi";
import { usecdotStore } from "../../components/cdotStore";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import axios from "axios";

export default function LoanCalculator() {
  const updateMenustore = usecdotStore((state) => state.updateMenustore);
  const [amount, setAmount] = useState(0);
  const [interest, setInterest] = useState(0);
  const [time, setTime] = useState(0);
  const [emi, setEmi] = useState(0);
  const [totalinterest, setTotalinterest] = useState(0);
  const [principal, setPrincipal] = useState(0);
  const baseURL = process.env.REACT_APP_API_URL;

  const openLoancalculator = () => {
    updateMenustore("Loan");
  };

  const handlePrincipalchange = (event) => {
    setPrincipal(event.target.value);
  };
  const handleInterestchange = (event) => {
    setInterest(event.target.value);
  };
  const handleTimechange = (event) => {
    setTime(event.target.value);
  };

  const emiApi = async () => {
    let values = {
      "principal": principal,
      "interest": interest,
      "time": time
    };
    // starting
    await axios
    .post(baseURL + "calculateemi/", values)
    .then(function (response) {
      console.log("Task post: " + JSON.stringify(response.data));
      setAmount(Math.round(response.data.amount));
      setEmi(Math.round(response.data.emi));
      setTotalinterest(Math.round(response.data.interest));
    })
    .catch(function (error) {
      console.log("kcheckpost" + error); //return 429
      toast.error("Something went wrong!", {
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
  };

  const calculateLoan = () => {

    if (principal > 0 && interest > 0 && time > 0) {
      emiApi();
    } else {
      toast.error("Amount, Interest and Period must be greater than 0!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        toastId: "id",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <>
      <div style={{ overflowY: "auto" }}>
        <Typography variant="h5" align="center">
          Loan Calculator
        </Typography>
        <Stack direction="row" spacing={2} className="my-2 mb-2">
          <Typography
            align="center"
            variant="h5"
            onClick={openLoancalculator}
            className="cursor-pointer"
          >
            <BiArrowBack />
          </Typography>
        </Stack>
        <Box sx={{ m: 2 }} />
        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <Box sx={{ m: 2 }} />
            <TextField
              label="Enter loan Amount"
              type="number"
              variant="outlined"
              name="loan_amount"
              onChange={handlePrincipalchange}
              value={principal}
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <TextField
              label="Enter interest rate"
              variant="outlined"
              type="number"
              name="interest_rate"
              onChange={handleInterestchange}
              value={interest}
              sx={{ minWidth: "92%" }}
            />
            <Box sx={{ m: 2 }} />
            <TextField
              label="Enter loan period in month"
              variant="outlined"
              type="number"
              name="loan_period_in_month"
              onChange={handleTimechange}
              value={time}
              sx={{ minWidth: "92%" }}
            />
            <Box
              m={1}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <FormControl
                size="large"
                align="center"
                style={{ marginTop: "10px" }}
              >
                <Button variant="outlined" size="large" onClick={calculateLoan}>
                  Calculate
                </Button>
              </FormControl>
            </Box>
          </Grid>
          <Grid item md={6} xs={12} alignItems="center" justifyContent="center">
            <Box sx={{ m: 2 }} />
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableBody>
                  <TableRow>
                    <TableCell align="center">
                      <Typography variant="p">Loan EMI</Typography>
                      <Box sx={{ m: 1 }} />
                      <Typography variant="h6" className="font-bold">
                        ₹ {emi}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ m: 2 }} />
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableBody>
                  <TableRow>
                    <TableCell align="center">
                      <Typography variant="p">
                        Total Interest Payable
                      </Typography>
                      <Box sx={{ m: 1 }} />
                      <Typography variant="h6" className="font-bold">
                        ₹ {totalinterest}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ m: 2 }} />
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableBody>
                  <TableRow>
                    <TableCell align="center">
                      <Typography variant="p">
                        Total Payment (Principal + Interest)
                      </Typography>
                      <Box sx={{ m: 1 }} />
                      <Typography variant="h6" className="font-bold">
                        ₹ {amount}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <Box sx={{ m: 4 }} />
      </div>
    </>
  );
}
