// utils/constants.js
export const DRAWER_WIDTH = 240;

export const EMPLOYEE_TYPES = {
    ADMIN: 'Admin',
    MANAGER: 'Manager',
    EMPLOYEE: 'Employee',
    ASSET_ADMIN: 'Asset Admin',
};

export const MODAL_STYLE = {
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

export const ROLE_DEFAULT_MENUS = {
    [EMPLOYEE_TYPES.ADMIN]: 'Dashboard',
    [EMPLOYEE_TYPES.MANAGER]: 'Manager Attendance',
    [EMPLOYEE_TYPES.EMPLOYEE]: 'My Attendance',
    [EMPLOYEE_TYPES.ASSET_ADMIN]: 'My Attendance',
};

// utils/helpers.js
export const getUserDisplayName = (emp_name, emp_type) => {
    const typeDisplay = {
        [EMPLOYEE_TYPES.ADMIN]: ' (Admin)',
        [EMPLOYEE_TYPES.MANAGER]: ' (Manager)',
        [EMPLOYEE_TYPES.ASSET_ADMIN]: ' (Asset Admin)',
    };
    return emp_name + (typeDisplay[emp_type] || '');
};

export const getLocalStorageKey = () => 'cdot_store_api';

export const clearLocalStorage = () => {
    localStorage.removeItem(getLocalStorageKey());
};

// utils/errorHandler.js
export class ErrorHandler {
    static handleApiError(error, context = '') {
        const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error';
        console.error(`${context} Error:`, errorMessage);

        // You can add more sophisticated error handling here
        // such as showing toast notifications, logging to external services, etc.

        return errorMessage;
    }

    static handleAsyncOperation(operation, context = '') {
        return async (...args) => {
            try {
                return await operation(...args);
            } catch (error) {
                return this.handleApiError(error, context);
            }
        };
    }
}

// utils/validation.js
export const validateRequiredFields = (data, requiredFields) => {
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    return true;
};

export const isValidEmployeeType = (type) => {
    return Object.values(EMPLOYEE_TYPES).includes(type);
};