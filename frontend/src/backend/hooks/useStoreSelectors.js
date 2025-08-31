import { usecdotStore } from "../../components/cdotStore";

export const useStoreSelectors = () => {
  return {
    menustore: usecdotStore((state) => state.menustore),
    islogin: usecdotStore((state) => state.islogin),
    username: usecdotStore((state) => state.username),
    emp_name: usecdotStore((state) => state.emp_name),
    emp_type: usecdotStore((state) => state.emp_type),
    emp_department: usecdotStore((state) => state.emp_department),
  };
};

export const useStoreActions = () => {
  return {
    updateMenustore: usecdotStore((state) => state.updateMenustore),
    updateIslogin: usecdotStore((state) => state.updateIslogin),
    updateDepartments: usecdotStore((state) => state.updateDepartments),
    updatePaygrade: usecdotStore((state) => state.updatePaygrade),
    updateDeptEmployee: usecdotStore((state) => state.updateDeptEmployee),
    updateLeave: usecdotStore((state) => state.updateLeave),
    updateAssets: usecdotStore((state) => state.updateAssets),
    updateMyAssets: usecdotStore((state) => state.updateMyAssets),
    updateAssetlist: usecdotStore((state) => state.updateAssetlist),
    updateAssetCategory: usecdotStore((state) => state.updateAssetCategory),
    updateUsernamelist: usecdotStore((state) => state.updateUsernamelist),
    updateBranchamelist: usecdotStore((state) => state.updateBranchamelist),
    updateCompanyList: usecdotStore((state) => state.updateCompanyList),
    updateAssignedjobs: usecdotStore((state) => state.updateAssignedjobs),
    updatePayslip: usecdotStore((state) => state.updatePayslip),
    updateEmployee: usecdotStore((state) => state.updateEmployee),
    updateEmpname: usecdotStore((state) => state.updateEmpname),
    updateEmptype: usecdotStore((state) => state.updateEmptype),
    updateEmpdepartment: usecdotStore((state) => state.updateEmpdepartment),
    updateDailytask: usecdotStore((state) => state.updateDailytask),
    updateWorkinghour: usecdotStore((state) => state.updateWorkinghour),
    updateManageLeave: usecdotStore((state) => state.updateManageLeave),
    updateEmpid: usecdotStore((state) => state.updateEmpid),
    updateLoan: usecdotStore((state) => state.updateLoan),
    updateDashdata: usecdotStore((state) => state.updateDashdata),
  };
};

export const useClearStore = () => {
  const actions = useStoreActions();
  
  return () => {
    actions.updateLeave("");
    actions.updateAssets("");
    actions.updateAssetlist("");
    actions.updateUsernamelist("");
    actions.updateAssignedjobs("");
    actions.updateEmployee("");
    actions.updateEmpname("");
    actions.updateEmptype("");
    actions.updateEmpdepartment("");
    actions.updateLoan("");
    actions.updateWorkinghour("");
    actions.updateDailytask("");
    actions.updatePaygrade("");
    actions.updatePayslip("");
    actions.updateDeptEmployee("");
  };
};