import React from "react";
import { Chart } from "react-google-charts";
import { usecdotStore } from "../../components/cdotStore";

export const options = {
  chart: {
    title: "Attendance Data",
    subtitle: "Attendance, Present, Absent Records",
  },
  colors: ["#188310", "rgb(214, 51, 23)"],
};

export default function VBarChart() {
  const dashdata = usecdotStore((state) => state.dashdata);
  
  // Use attendance data from API if available, otherwise fall back to default data
  const chartData = dashdata?.attendance_chart_data || [
    ["Date", "Present", "Absent"],
    ["No Data", 0, 0],
  ];

  return (
    <Chart
      chartType="Bar"
      width="100%"
      height="350px"
      data={chartData}
      options={options}
    />
  );
}
