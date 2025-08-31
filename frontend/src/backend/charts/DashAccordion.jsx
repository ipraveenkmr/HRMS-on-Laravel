import Accordion from "@mui/material/Accordion";
import { useEffect } from "react";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { usecdotStore } from "../../components/cdotStore";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import axios from "axios";
import Stack from "@mui/material/Stack";

export default function DashAccordion() {
  const dailytask = usecdotStore((state) => state.dailytask);
  const employees = usecdotStore((state) => state.employees);
  const updateDailytask = usecdotStore((state) => state.updateDailytask);
  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    dailytaskApi();
  }, []);

  const dailytaskApi = async () => {
    // starting
    await axios
      .get(baseURL + "daily-tasks/")
      .then(function (response) {
        updateDailytask(response.data);
      })
      .catch(function (error) {
        console.log("kcheckpost" + error); //return 429
      });
    // ending
  };

  return (
    <div>
      <>
        {dailytask.length > 0 && (
          <>
            {dailytask.slice(0, 7).map((task, index) => {
              return (
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>
                      {employees.map((item, index) => {
                        return (
                          <>{item.id === task.employee_id && item.emp_name}</>
                        );
                      })}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ m: 2 }}>
                      <Stack direction="row" spacing={2} c>
                        <Typography variant="subtitle2" sx={{ width: "80px" }}>
                          Task:
                        </Typography>
                        <Typography variant="body2">{task.task}</Typography>
                      </Stack>
                    </Box>
                    <Divider />
                    <Box sx={{ m: 2 }}>
                      <Stack direction="row" spacing={2}>
                        <Typography variant="subtitle2" sx={{ width: "80px" }}>
                          Description:
                        </Typography>
                        <Typography variant="body2">
                          {task.description}
                        </Typography>
                      </Stack>
                    </Box>
                    <Divider />
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </>
        )}
      </>
    </div>
  );
}
