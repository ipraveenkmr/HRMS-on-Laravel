// services/apiService.js
import axios from "axios";
import { usecdotStore } from "../../../components/cdotStore";

class ApiService {
    constructor() {
        this.baseURL = process.env.REACT_APP_API_URL;
        this.axiosInstance = axios.create({
            baseURL: this.baseURL,
        });
    }

    // Generic API methods
    async get(endpoint) {
        try {
            return await this.axiosInstance.get(endpoint);
        } catch (error) {
            console.error(`API Error - GET ${endpoint}:`, error);
            throw error;
        }
    }

    async post(endpoint, data) {
        try {
            return await this.axiosInstance.post(endpoint, data);
        } catch (error) {
            console.error(`API Error - POST ${endpoint}:`, error);
            throw error;
        }
    }

    async put(endpoint, data) {
        try {
            return await this.axiosInstance.put(endpoint, data);
        } catch (error) {
            console.error(`API Error - PUT ${endpoint}:`, error);
            throw error;
        }
    }

    async delete(endpoint) {
        try {
            return await this.axiosInstance.delete(endpoint);
        } catch (error) {
            console.error(`API Error - DELETE ${endpoint}:`, error);
            throw error;
        }
    }

    // Store update helper
    updateStore(action, data) {
        const store = usecdotStore.getState();
        if (store[action]) {
            store[action](data);
        }
    }

    // Common data initialization
    async initializeCommonData() {
        const commonApis = [
            { endpoint: "assets", action: "updateAssetlist" },
            { endpoint: "asset-categories", action: "updateAssetCategory" },
            { endpoint: "auth/users", action: "updateUsernamelist" },
            { endpoint: "branches", action: "updateBranchamelist" },
            { endpoint: "companies/companies", action: "updateCompanyList" },
            { endpoint: "departments", action: "updateDepartments" },
            { endpoint: "dashboard/financial-year", action: "updateWorkinghour" },
            { endpoint: "dashboard/stats", action: "updateDashdata" },
        ];

        const apiPromises = commonApis.map(async ({ endpoint, action }) => {
            try {
                const response = await this.get(endpoint);
                this.updateStore(action, response.data);
            } catch (error) {
                console.error(`Failed to fetch ${endpoint}:`, error);
            }
        });

        // Also fetch employee data
        const { username } = usecdotStore.getState();
        if (username) {
            try {
                const response = await this.get(`employees/username/${username}`);
                const employeeData = response.data[0];
                this.updateStore("updateEmpname", employeeData.emp_name);
                this.updateStore("updateEmptype", employeeData.emp_type);
                this.updateStore("updateEmpdepartment", employeeData.department_id);
                this.updateStore("updateEmpid", employeeData.id);
            } catch (error) {
                console.error("Failed to fetch employee data:", error);
            }
        }

        await Promise.allSettled(apiPromises);
    }

    // Role-specific data initialization
    async initializeRoleSpecificData(emp_type, emp_department, username) {
        const roleApiMap = {
            Admin: [
                { endpoint: "tasks", action: "updateAssignedjobs" },
                { endpoint: "payroll", action: "updatePayslip" },
                { endpoint: "leave", action: "updateLeave" },
                { endpoint: "assets", action: "updateAssets" },
                { endpoint: "loans", action: "updateLoan" },
                { endpoint: "paygrade", action: "updatePaygrade" },
                { endpoint: "leave", action: "updateManageLeave" },
            ],
            Manager: [
                { endpoint: `tasks/manager/${usecdotStore.getState().emp_id}/`, action: "updateAssignedjobs" },
                { endpoint: `leave/manager/${usecdotStore.getState().emp_id}/`, action: "updateLeave" },
                { endpoint: `daily-tasks/manager/${usecdotStore.getState().emp_id}/`, action: "updateDailytask" },
                { endpoint: `assets/allocations/manager/${usecdotStore.getState().emp_id}/`, action: "updateAssets" },
                { endpoint: "leave/", action: "updateManageLeave" },
                { endpoint: "paygrade/", action: "updatePaygrade" },
            ],
            Employee: [
                { endpoint: `tasks/employee/${username}`, action: "updateAssignedjobs" },
                { endpoint: `leave/employee/${username}`, action: "updateLeave" },
                { endpoint: `daily-tasks/employee/${username}`, action: "updateDailytask" },
                { endpoint: `assets/allocations/employee/${username}`, action: "updateMyAssets" },
                { endpoint: "paygrade/", action: "updatePaygrade" },
            ],
            "Asset Admin": [
                { endpoint: `tasks/employee/${username}`, action: "updateAssignedjobs" },
                { endpoint: `leave/employee/${username}`, action: "updateLeave" },
                { endpoint: `daily-tasks/employee/${username}`, action: "updateDailytask" },
                { endpoint: `assets/allocations/employee/${username}`, action: "updateMyAssets" },
                { endpoint: "assets/", action: "updateAssets" },
                { endpoint: "paygrade/", action: "updatePaygrade" },
            ],
        };

        const apis = roleApiMap[emp_type] || [];
        const apiPromises = apis.map(async ({ endpoint, action }) => {
            try {
                const response = await this.get(endpoint);
                this.updateStore(action, response.data);
            } catch (error) {
                console.error(`Failed to fetch ${endpoint} for ${emp_type}:`, error);
            }
        });

        await Promise.allSettled(apiPromises);
    }

    // Specific API methods (keeping the original method names for backward compatibility)
    async loanApi() {
        try {
            const response = await this.get("loans/");
            this.updateStore("updateLoan", response.data);
        } catch (error) {
            console.error("loanApi error:", error);
        }
    }

    async dashApi() {
        try {
            const response = await this.get("dashboard/stats");
            this.updateStore("updateDashdata", response.data);
        } catch (error) {
            console.error("dashApi error:", error);
        }
    }

    async manageleaveApi() {
        try {
            const response = await this.get("leave/");
            this.updateStore("updateManageLeave", response.data);
        } catch (error) {
            console.error("manageleaveApi error:", error);
        }
    }

    async notificationApi() {
        try {
            const response = await this.get("dashboard/notifications");
            return response.data.map(item => item.title);
        } catch (error) {
            console.error("notificationApi error:", error);
            return [];
        }
    }

    async fiApi() {
        try {
            const response = await this.get("dashboard/financial-year");
            this.updateStore("updateWorkinghour", response.data);
        } catch (error) {
            console.error("fiApi error:", error);
        }
    }

    async managerdailytaskApi(emp_id) {
        try {
            const response = await this.get(`daily-tasks/manager/${emp_id}/`);
            this.updateStore("updateDailytask", response.data);
        } catch (error) {
            console.error("managerdailytaskApi error:", error);
        }
    }

    async mydailytaskApi(username) {
        try {
            const response = await this.get(`daily-tasks/employee/${username}/`);
            this.updateStore("updateDailytask", response.data);
        } catch (error) {
            console.error("mydailytaskApi error:", error);
        }
    }

    async employeeEditApi(username) {
        try {
            const response = await this.get(`employees/username/${username}`);
            const employeeData = response.data[0];
            this.updateStore("updateEmpname", employeeData.emp_name);
            this.updateStore("updateEmptype", employeeData.emp_type);
            this.updateStore("updateEmpdepartment", employeeData.department_id);
            this.updateStore("updateEmpid", employeeData.id);
        } catch (error) {
            console.error("employeeEditApi error:", error);
        }
    }

    async usersApi() {
        try {
            const response = await this.get("auth/users");
            this.updateStore("updateUsernamelist", response.data);
        } catch (error) {
            console.error("usersApi error:", error);
        }
    }

    async branchApi() {
        try {
            const response = await this.get("branches");
            this.updateStore("updateBranchamelist", response.data);
        } catch (error) {
            console.error("branchApi error:", error);
        }
    }

    async companyApi() {
        try {
            const response = await this.get("companies/companies");
            this.updateStore("updateCompanyList", response.data);
        } catch (error) {
            console.error("companyApi error:", error);
        }
    }

    async taskApi() {
        try {
            const response = await this.get("tasks");
            this.updateStore("updateAssignedjobs", response.data);
        } catch (error) {
            console.error("taskApi error:", error);
        }
    }

    async payslipApi() {
        try {
            const response = await this.get("payslip/");
            this.updateStore("updatePayslip", response.data);
        } catch (error) {
            console.error("payslipApi error:", error);
        }
    }

    async managertaskApi(emp_id) {
        try {
            const response = await this.get(`tasks/manager/${emp_id}/`);
            this.updateStore("updateAssignedjobs", response.data);
        } catch (error) {
            console.error("managertaskApi error:", error);
        }
    }

    async mytaskApi(username) {
        try {
            const response = await this.get(`tasks/employee/${username}/`);
            this.updateStore("updateAssignedjobs", response.data);
        } catch (error) {
            console.error("mytaskApi error:", error);
        }
    }

    async assetcategoryApi() {
        try {
            const response = await this.get("asset-categories");
            this.updateStore("updateAssetCategory", response.data);
        } catch (error) {
            console.error("assetcategoryApi error:", error);
        }
    }

    async assetlistApi() {
        try {
            const response = await this.get("assets");
            this.updateStore("updateAssetlist", response.data);
        } catch (error) {
            console.error("assetlistApi error:", error);
        }
    }

    async assetApi() {
        try {
            const response = await this.get("assets/");
            this.updateStore("updateAssets", response.data);
        } catch (error) {
            console.error("assetApi error:", error);
        }
    }

    async managerassetApi(emp_id) {
        try {
            const response = await this.get(`assets/allocations/manager/${emp_id}/`);
            this.updateStore("updateAssets", response.data);
        } catch (error) {
            console.error("managerassetApi error:", error);
        }
    }

    async myassetApi(username) {
        try {
            const response = await this.get(`assets/employee/${username}/`);
            this.updateStore("updateMyAssets", response.data);
        } catch (error) {
            console.error("myassetApi error:", error);
        }
    }

    async managerleaveApi(emp_id) {
        try {
            const response = await this.get(`leave/manager/${emp_id}/`);
            this.updateStore("updateLeave", response.data);
        } catch (error) {
            console.error("managerleaveApi error:", error);
        }
    }

    async myleaveApi(username) {
        try {
            const response = await this.get(`leave/employee/${username}/`);
            this.updateStore("updateLeave", response.data);
        } catch (error) {
            console.error("myleaveApi error:", error);
        }
    }

    async leaveApi() {
        try {
            const response = await this.get("leave/");
            this.updateStore("updateLeave", response.data);
        } catch (error) {
            console.error("leaveApi error:", error);
        }
    }

    async departmentApi() {
        try {
            const response = await this.get("departments");
            this.updateStore("updateDepartments", response.data);
        } catch (error) {
            console.error("departmentApi error:", error);
        }
    }

    async paygradeApi() {
        try {
            const response = await this.get("paygrade/");
            this.updateStore("updatePaygrade", response.data);
        } catch (error) {
            console.error("paygradeApi error:", error);
        }
    }
}

// Export singleton instance
export const apiService = new ApiService();