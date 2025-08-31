import create from "zustand";
import { persist } from "zustand/middleware";

let cdotStore = (set) => ({
  menustore: "",
  tokenstore: "",
  departments: "",
  islogin: false,
  employees: "",
  attendance: "",
  leaves: "",
  manageleave: "",
  assets: "",
  myassets: "",
  assetlist: "",
  usernamelist: "",
  branchamelist: "",
  assignedjobs: "",
  emp_name: "",
  emp_type: "",
  emp_department: "",
  emp_id: "",
  empusername: "",
  payslip: "",
  paygrades: "",
  dailytask: "",
  workinghour: "",
  loans: "",
  deptemployees: "",
  assetcategories: "",
  companylist: "",
  dashdata: "",
  updateDashdata: (dashdata) =>
    set((state) => ({ dashdata: dashdata })),
  updateCompanyList: (companylist) =>
    set((state) => ({ companylist: companylist })),
  updateAssetCategory: (assetcategories) =>
    set((state) => ({ assetcategories: assetcategories })),
  updateLoan: (loans) =>
    set((state) => ({ loans: loans })),
  updateWorkinghour: (workinghour) =>
    set((state) => ({ workinghour: workinghour })),
  updateDailytask: (dailytask) =>
    set((state) => ({ dailytask: dailytask })),
  updatePaygrade: (paygrades) =>
    set((state) => ({ paygrades: paygrades })),
  updatePayslip: (payslip) =>
    set((state) => ({ payslip: payslip })),
  updateEmpusername: (empusername) =>
    set((state) => ({ empusername: empusername })),
  updateEmpid: (emp_id) =>
    set((state) => ({ emp_id: emp_id })),
  updateEmpname: (emp_name) =>
    set((state) => ({ emp_name: emp_name })),
  updateEmptype: (emp_type) =>
    set((state) => ({ emp_type: emp_type })),
  updateEmpdepartment: (emp_department) =>
    set((state) => ({ emp_department: emp_department })),
  updateAssignedjobs: (assignedjobs) =>
    set((state) => ({ assignedjobs: assignedjobs })),
  updateUsernamelist: (usernamelist) =>
    set((state) => ({ usernamelist: usernamelist })),
  updateBranchamelist: (branchamelist) =>
    set((state) => ({ branchamelist: branchamelist })),
  updateAssetlist: (assetlist) =>
    set((state) => ({ assetlist: assetlist })),
  updateAssets: (assets) =>
    set((state) => ({ assets: assets })),
  updateMyAssets: (myassets) =>
    set((state) => ({ myassets: myassets })),
  updateManageLeave: (manageleave) =>
    set((state) => ({ manageleave: manageleave })),
  updateLeave: (leaves) =>
    set((state) => ({ leaves: leaves })),
  updateUsername: (username) => set((state) => ({ username: username })),
  updateAttendance: (attendance) =>
    set((state) => ({ attendance: attendance })),
  updateEmployee: (employees) => set((state) => ({ employees: employees })),
  updateDeptEmployee: (deptemployees) => set((state) => ({ deptemployees: deptemployees })),
  updateIslogin: (islogin) => set((state) => ({ islogin: islogin })),
  updateDepartments: (departments) =>
    set((state) => ({ departments: departments })),
  updateTokenstore: (tokenstore) =>
    set((state) => ({ tokenstore: tokenstore })),
  updateMenustore: (menustore) => set((state) => ({ menustore: menustore })),
});

cdotStore = persist(cdotStore, { name: "hrms_store_api" });
export const usecdotStore = create(cdotStore);
