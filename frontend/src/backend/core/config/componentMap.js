// config/componentMap.js
import AssetAllocation from "../../assetallocation/AssetAllocation";
import Attendance from "../../attendance/Attendance";
import MAttendance from "../../managerattendance/MAttendance";
import MyAttendance from "../../empattendance/MyAttendance";
import Task from "../../task/Task";
import MTask from "../../managertask/MTask";
import Loan from "../../loan/Loan";
import LoanCalculator from "../../loancalculator/LoanCalculator";
import DailyTask from "../../dailytask/DailyTask";
import MDailyTask from "../../managerdailytask/MDailyTask";
import EmpDailyTask from "../../empdailytask/DailyTask";
import MyTask from "../../emptask/MyTask";
import Employee from "../../employee/Employee";
import MEmployee from "../../manageremployee/MEmployee";
import Payslip from "../../payslip/Payslip";
import LeaveTracker from "../../leavetracker/LeaveTracker";
import LeaveManager from "../../leavemanager/LeaveManager";
import MyLeaveTracker from "../../empleavetracker/MyLeaveTracker";
import AdminTravelExpense from "../../travelexpense/AdminTravelExpense";
import ManagerTravelExpense from "../../travelexpense/ManagerTravelExpense";
import EmployeeTravelExpense from "../../travelexpense/EmployeeTravelExpense";
import MyPayslip from "../../emppayslip/MyPayslip";
import MyProfile from "../../empprofile/MyProfile";
import ManagerProfile from "../../managerprofile/ManagerProfile";
import Dashboard from "../../Dashboard";

export const componentMap = {
    Admin: {
        "Dashboard": Dashboard,
        "Employees": Employee,
        "Attendance": Attendance,
        "Task": Task,
        "Loan": Loan,
        "Daily Task": DailyTask,
        "Payslip": Payslip,
        "Leaves": LeaveTracker,
        "Manage Leave": LeaveManager,
        "Asset Allocation": AssetAllocation,
        "Calculator": LoanCalculator,
        "Travel Expenses": AdminTravelExpense,
    },

    Manager: {
        "My Details": ManagerProfile,
        "My Attendance": MyAttendance,
        "Manager Employees": MEmployee,
        "Manager Attendance": MAttendance,
        "Manager Task": MTask,
        "Manager Daily Task": MDailyTask,
        "Manager Asset Allocation": AssetAllocation,
        "Manager Travel Expenses": ManagerTravelExpense,
        "Leaves": LeaveTracker,
    },

    Employee: {
        "My Details": MyProfile,
        "My Attendance": MyAttendance,
        "My Daily Task": EmpDailyTask,
        "My Task": MyTask,
        "My Leaves": MyLeaveTracker,
        "My Payslip": MyPayslip,
        "My Travel Expenses": EmployeeTravelExpense,
        "My Assets": AssetAllocation,
    },

    "Asset Admin": {
        "My Attendance": MyAttendance,
        "My Daily Task": EmpDailyTask,
        "My Task": MyTask,
        "My Leaves": MyLeaveTracker,
        "My Assets": AssetAllocation,
        "Asset Allocation": AssetAllocation,
    },
};