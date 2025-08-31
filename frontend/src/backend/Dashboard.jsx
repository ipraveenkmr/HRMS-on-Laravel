import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { BiLaptop } from 'react-icons/bi';
import { BsFillCalendarRangeFill, BsPersonSquare } from 'react-icons/bs';
import { GoTasklist } from 'react-icons/go';
import VBarChart from "./charts/VBarChart";
import DashAccordion from "./charts/DashAccordion";
import CountUp from "react-countup";
import "./dashboard.css";
import { usecdotStore } from "../components/cdotStore";

export default function Dashboard() {
  const dashdata = usecdotStore((state) => state.dashdata);

  return (
    <>
      <div className="bgcolor">
        <Box component="main" sx={{ flexGrow: 1}}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Stack direction="row" spacing={2}>
                <Card
                  className="gradient"
                  sx={{ minWidth: 49 + "%", height: 140 }}
                >
                  <div className="iconstylewhite">
                    <BsPersonSquare style={{fontSize: "30px", marginLeft: "-10px"}} />
                  </div>
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      sx={{ color: "#f0fcfc" }}
                    >
                      <CountUp delay={0.2} end={dashdata.emp_count} duration={0.3} />
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ color: "#ccd1d1" }}
                    >
                      Total Employees
                    </Typography>
                  </CardContent>
                </Card>
                <Card
                  className="gradientlight"
                  sx={{ minWidth: 49 + "%", height: 140 }}
                >
                  <div className="iconstylewhite">
                    <BsFillCalendarRangeFill style={{fontSize: "30px", marginLeft: "-10px"}}/>
                  </div>
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      sx={{ color: "#f0fcfc" }}
                    >
                      <CountUp delay={0.2} end={dashdata.attendance_count} duration={0.4} />
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ color: "#ccd1d1" }}
                    >
                      Total login in last 24 hrs.
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
            <Grid item xs={4}>
              <Stack spacing={2}>
                <Card className="gradientlight">
                  <Stack spacing={2} direction="row">
                    <div className="iconstylewhite">
                      <BiLaptop style={{fontSize: "24px"}}/>
                    </div>
                    <div className="paddingall">
                      <span className="pricetitle fontwhite">{dashdata.asset_count}</span>
                      <br />
                      <span className="pricesubtitle fontlightgrey">
                        Total Asset
                      </span>
                    </div>
                  </Stack>
                </Card>
                <Card>
                  <Stack spacing={2} direction="row">
                    <div className="iconstyle">
                      <GoTasklist style={{fontSize: "24px"}} />
                    </div>
                    <div className="paddingall">
                      <span className="pricetitle">{dashdata.daily_task_count}</span>
                      <br />
                      <span className="pricesubtitle">Task Completed</span>
                    </div>
                  </Stack>
                </Card>
              </Stack>
            </Grid>
          </Grid>

          <Box height={20} />

          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Card sx={{ height: 60 + "vh" }}>
                <CardContent>
                  <VBarChart />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{ minHeight: 60 + "vh" }}>
                <CardContent>
                  <div className="paddingall">
                    <span className="pricetitle">Recently Submitted Daily Task</span>
                  </div>
                  <Box height={10} />
                  <DashAccordion />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </div>
    </>
  );
}
