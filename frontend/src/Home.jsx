import { Routes, Route } from "react-router-dom";
import Login from "./login/Login";
import Register from "./login/Register";
import Contact from "./login/Contact";
import Index from "./backend/Index";
import PageNotFound from "./login/PageNotFound";
import SuperAdminLayout from "./backend/superadmin/SuperAdminLayout";
import CompanyManagement from "./backend/superadmin/CompanyManagement";
import BranchManagement from "./backend/superadmin/BranchManagement";
import DepartmentManagement from "./backend/superadmin/DepartmentManagement";
import AssetManagement from "./backend/superadmin/AssetManagement";
import AssetCategoryManagement from "./backend/superadmin/AssetCategoryManagement";
import PayGradeManagement from "./backend/superadmin/PayGradeManagement";
import FinancialYearManagement from "./backend/superadmin/FinancialYearManagement";
import EmployeeManagement from "./backend/superadmin/EmployeeManagement";
import UserManagement from "./backend/superadmin/UserManagement";
import { ToastContainer } from "react-toastify";

function Home() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/signin" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/backend/*" element={<Index />}></Route>
        <Route path="/superadmin" element={<SuperAdminLayout />}>
          <Route index element={<CompanyManagement />} />
          <Route path="companies" element={<CompanyManagement />} />
          <Route path="branches" element={<BranchManagement />} />
          <Route path="departments" element={<DepartmentManagement />} />
          <Route path="assets" element={<AssetManagement />} />
          <Route path="asset-categories" element={<AssetCategoryManagement />} />
          <Route path="paygrade" element={<PayGradeManagement />} />
          <Route path="financial-years" element={<FinancialYearManagement />} />
          <Route path="employees" element={<EmployeeManagement />} />
          <Route path="users" element={<UserManagement />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default Home;
