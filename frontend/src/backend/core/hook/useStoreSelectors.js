// hooks/useStoreSelectors.js
import { usecdotStore } from "../../../components/cdotStore";

// Custom hooks for store state selection
export const useStoreSelectors = () => {
    return usecdotStore((state) => ({
        // User data
        username: state.username,
        emp_name: state.emp_name,
        emp_type: state.emp_type,
        emp_department: state.emp_department,
        emp_id: state.emp_id,
        islogin: state.islogin,

        // Navigation
        menustore: state.menustore,

        // Data
        departments: state.departments,
        paygrade: state.paygrade,
        deptEmployee: state.deptEmployee,
        leave: state.leave,
        assets: state.assets,
        myAssets: state.myAssets,
        assetlist: state.assetlist,
        assetCategory: state.assetCategory,
        usernamelist: state.usernamelist,
        branchamelist: state.branchamelist,
        companyList: state.companyList,
        assignedjobs: state.assignedjobs,
        payslip: state.payslip,
        employee: state.employee,
        dailytask: state.dailytask,
        workinghour: state.workinghour,
        manageLeave: state.manageLeave,
        loan: state.loan,
        dashdata: state.dashdata,
    }));
};

export const useStoreActions = () => {
    return usecdotStore((state) => ({
        // User actions
        updateUsername: state.updateUsername,
        updateEmpname: state.updateEmpname,
        updateEmptype: state.updateEmptype,
        updateEmpdepartment: state.updateEmpdepartment,
        updateEmpid: state.updateEmpid,
        updateIslogin: state.updateIslogin,

        // Navigation actions
        updateMenustore: state.updateMenustore,

        // Data actions
        updateDepartments: state.updateDepartments,
        updatePaygrade: state.updatePaygrade,
        updateDeptEmployee: state.updateDeptEmployee,
        updateLeave: state.updateLeave,
        updateAssets: state.updateAssets,
        updateMyAssets: state.updateMyAssets,
        updateAssetlist: state.updateAssetlist,
        updateAssetCategory: state.updateAssetCategory,
        updateUsernamelist: state.updateUsernamelist,
        updateBranchamelist: state.updateBranchamelist,
        updateCompanyList: state.updateCompanyList,
        updateAssignedjobs: state.updateAssignedjobs,
        updatePayslip: state.updatePayslip,
        updateEmployee: state.updateEmployee,
        updateDailytask: state.updateDailytask,
        updateWorkinghour: state.updateWorkinghour,
        updateManageLeave: state.updateManageLeave,
        updateLoan: state.updateLoan,
        updateDashdata: state.updateDashdata,
    }));
};

// Utility hook for clearing store data
export const useClearStore = () => {
    const actions = useStoreActions();

    return () => {
        const clearActions = [
            'updateLeave', 'updateAssets', 'updateAssetlist', 'updateUsernamelist',
            'updateAssignedjobs', 'updateEmployee', 'updateEmpname', 'updateEmptype',
            'updateEmpdepartment', 'updateLoan', 'updateWorkinghour', 'updateDailytask',
            'updatePaygrade', 'updatePayslip', 'updateDeptEmployee', 'updateMenustore'
        ];

        clearActions.forEach(action => {
            if (actions[action]) {
                actions[action]("");
            }
        });
    };
};