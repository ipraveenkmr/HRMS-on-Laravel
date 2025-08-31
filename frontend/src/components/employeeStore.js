import create from "zustand";
import { persist } from "zustand/middleware";

let employeeStore = (set) => ({
  isContractual: false,
  st_username: "",
  st_work_mode: "",
  st_name: "",
  st_email: "",
  st_phone: "",
  st_emergency_phone: "",
  st_gender: "",
  st_father_husband_name: "",
  st_mother_name: "",
  st_permanent_address: "",
  st_present_address: "",
  st_city: "",
  st_state: "",
  st_pincode: "",
  st_pan: "",
  st_aadhaar: "",
  st_dob: "",
  st_emp_no: "",
  st_department: "",
  st_designation: "",
  st_emp_type: "",
  st_job_type: "",
  st_probation: "",
  st_emp_file_no: "",
  st_pf_account_no: "",
  st_esi_account_no: "",
  st_status: "",
  st_full_and_final: "",
  st_joining_date: "",
  st_resignation_date: "",
  st_last_working_day: "",
  st_pay_grade: "",
  st_gross_salary: 0,
  st_ctc: 0,
  st_pf: 0,
  st_pf_employee_percent: 12.00,
  st_pf_employer_percent: 12.00,
  st_esi: 0,
  st_esi_employee_percent: 0.75,
  st_esi_employer_percent: 3.25,
  st_bank_name: "",
  st_bank_account_no: 0,
  st_ifsc_code: "",
  st_branch: "",
  st_bank_city: "",
  st_qualification: "",
  st_specialization: "",
  st_board: "",
  st_course_name: "",
  st_passing_year: "",
  st_employer: "",
  st_job_title: "",
  st_comment: "",
  st_end_date: new Date(),
  st_start_date: new Date(),
  st_reference_name: "",
  st_reference_designation: "",
  st_refernece_department: "",
  st_refernece_contact: "",
  st_refernece_email: "",
  st_reference_name_if_any: "",
  st_reference_designation_if_any: "",
  st_refernece_department_if_any: "",
  st_refernece_contact_if_any: "",
  st_refernece_email_if_any: "",
  st_profile_pic: "",
  st_aadhar_pic: "",
  st_pan_pic: "",
  st_branchname: "",
  st_longitude: "",
  st_latitude: "",
  st_company: "",
  isbasicpay: false,
  uannumber: "",
  updateUanNumber: (uannumber) => set((state) => ({ uannumber: uannumber })),
  updateBasicPay: (isbasicpay) => set((state) => ({ isbasicpay: isbasicpay })),
  updateStCompany: (st_company) => set((state) => ({ st_company: st_company })),
  updateStLongitude: (st_longitude) =>
    set((state) => ({ st_longitude: st_longitude })),
  updateStLatitude: (st_latitude) =>
    set((state) => ({ st_latitude: st_latitude })),
  updateStBranchname: (st_branchname) =>
    set((state) => ({ st_branchname: st_branchname })),
  updateIsContractual: (isContractual) =>
    set((state) => ({ isContractual: isContractual })),
  updateStUsername: (st_username) =>
    set((state) => ({ st_username: st_username })),
  updateStWorkMode: (st_work_mode) =>
    set((state) => ({ st_work_mode: st_work_mode })),
  updateStName: (st_name) => set((state) => ({ st_name: st_name })),
  updateStEmail: (st_email) => set((state) => ({ st_email: st_email })),
  updateStPhone: (st_phone) => set((state) => ({ st_phone: st_phone })),
  updateStEmergencyPhone: (st_emergency_phone) =>
    set((state) => ({ st_emergency_phone: st_emergency_phone })),
  updateStGender: (st_gender) => set((state) => ({ st_gender: st_gender })),
  updateStFatherHusbandName: (st_father_husband_name) =>
    set((state) => ({ st_father_husband_name: st_father_husband_name })),
  updateStMotherName: (st_mother_name) =>
    set((state) => ({ st_mother_name: st_mother_name })),
  updateStPermanentAddress: (st_permanent_address) =>
    set((state) => ({ st_permanent_address: st_permanent_address })),
  updateStPresentAddress: (st_present_address) =>
    set((state) => ({ st_present_address: st_present_address })),
  updateStCity: (st_city) => set((state) => ({ st_city: st_city })),
  updateStState: (st_state) => set((state) => ({ st_state: st_state })),
  updateStPincode: (st_pincode) => set((state) => ({ st_pincode: st_pincode })),
  updateStPan: (st_pan) => set((state) => ({ st_pan: st_pan })),
  updateStAadhaar: (st_aadhaar) => set((state) => ({ st_aadhaar: st_aadhaar })),
  updateStDob: (st_dob) => set((state) => ({ st_dob: st_dob })),
  updateStEmpNo: (st_emp_no) => set((state) => ({ st_emp_no: st_emp_no })),
  updateStDepartment: (st_department) =>
    set((state) => ({ st_department: st_department })),
  updateStDesignation: (st_designation) =>
    set((state) => ({ st_designation: st_designation })),
  updateStEmpType: (st_emp_type) =>
    set((state) => ({ st_emp_type: st_emp_type })),
  updateStJobType: (st_job_type) =>
    set((state) => ({ st_job_type: st_job_type })),
  updateStProbation: (st_probation) =>
    set((state) => ({ st_probation: st_probation })),
  updateStFileNo: (st_emp_file_no) =>
    set((state) => ({ st_emp_file_no: st_emp_file_no })),
  updateStPfAccountNo: (st_pf_account_no) =>
    set((state) => ({ st_pf_account_no: st_pf_account_no })),
  updateStEsiAccountNo: (st_esi_account_no) =>
    set((state) => ({ st_esi_account_no: st_esi_account_no })),
  updateStStatus: (st_status) => set((state) => ({ st_status: st_status })),
  updateStFullNfinal: (st_full_and_final) =>
    set((state) => ({ st_full_and_final: st_full_and_final })),
  updateStJoiningdate: (st_joining_date) =>
    set((state) => ({ st_joining_date: st_joining_date })),
  updateStResignationdate: (st_resignation_date) =>
    set((state) => ({ st_resignation_date: st_resignation_date })),
  updateStLastWorkingDay: (st_last_working_day) =>
    set((state) => ({ st_last_working_day: st_last_working_day })),
  updateStPayGrade: (st_pay_grade) =>
    set((state) => ({ st_pay_grade: st_pay_grade })),
  updateStGrossSalary: (st_gross_salary) =>
    set((state) => ({ st_gross_salary: st_gross_salary })),
  updateStCtc: (st_ctc) =>
    set((state) => ({ st_ctc: st_ctc })),
  updateStPf: (st_pf) => set((state) => ({ st_pf: st_pf })),
  updateStPfEmployeePercent: (st_pf_employee_percent) => set((state) => ({ st_pf_employee_percent: st_pf_employee_percent })),
  updateStPfEmployerPercent: (st_pf_employer_percent) => set((state) => ({ st_pf_employer_percent: st_pf_employer_percent })),
  updateStEsi: (st_esi) => set((state) => ({ st_esi: st_esi })),
  updateStEsiEmployeePercent: (st_esi_employee_percent) => set((state) => ({ st_esi_employee_percent: st_esi_employee_percent })),
  updateStEsiEmployerPercent: (st_esi_employer_percent) => set((state) => ({ st_esi_employer_percent: st_esi_employer_percent })),
  updateStBankName: (st_bank_name) =>
    set((state) => ({ st_bank_name: st_bank_name })),
  updateStBankAccountNo: (st_bank_account_no) =>
    set((state) => ({ st_bank_account_no: st_bank_account_no })),
  updateStIfscCode: (st_ifsc_code) =>
    set((state) => ({ st_ifsc_code: st_ifsc_code })),
  updateStBranch: (st_branch) => set((state) => ({ st_branch: st_branch })),
  updateStBankCity: (st_bank_city) =>
    set((state) => ({ st_bank_city: st_bank_city })),
  updateStQualification: (st_qualification) =>
    set((state) => ({ st_qualification: st_qualification })),
  updateStSpecialization: (st_specialization) =>
    set((state) => ({ st_specialization: st_specialization })),
  updateStBoard: (st_board) => set((state) => ({ st_board: st_board })),
  updateStCourseName: (st_course_name) =>
    set((state) => ({ st_course_name: st_course_name })),
  updateStPassingYear: (st_passing_year) =>
    set((state) => ({ st_passing_year: st_passing_year })),
  updateStEmployer: (st_employer) =>
    set((state) => ({ st_employer: st_employer })),
  updateStJobTitle: (st_job_title) =>
    set((state) => ({ st_job_title: st_job_title })),
  updateStComment: (st_comment) => set((state) => ({ st_comment: st_comment })),
  updateStEndDate: (st_end_date) =>
    set((state) => ({ st_end_date: st_end_date })),
  updateStStartDate: (st_start_date) =>
    set((state) => ({ st_start_date: st_start_date })),
  updateStRefernceName: (st_reference_name) =>
    set((state) => ({ st_reference_name: st_reference_name })),
  updateStRefernceDesignation: (st_reference_designation) =>
    set((state) => ({ st_reference_designation: st_reference_designation })),
  updateStRefernceDepartment: (st_refernece_department) =>
    set((state) => ({ st_refernece_department: st_refernece_department })),
  updateStRefernceContact: (st_refernece_contact) =>
    set((state) => ({ st_refernece_contact: st_refernece_contact })),
  updateStRefernceEmail: (st_refernece_email) =>
    set((state) => ({ st_refernece_email: st_refernece_email })),
  updateStRefernceNameIfAny: (st_reference_name_if_any) =>
    set((state) => ({ st_reference_name_if_any: st_reference_name_if_any })),
  updateStRefernceDesignationIfAny: (st_reference_designation_if_any) =>
    set((state) => ({
      st_reference_designation_if_any: st_reference_designation_if_any,
    })),
  updateStRefernceDepartmentIfAny: (st_refernece_department_if_any) =>
    set((state) => ({
      st_refernece_department_if_any: st_refernece_department_if_any,
    })),
  updateStRefernceContactIfAny: (st_refernece_contact_if_any) =>
    set((state) => ({
      st_refernece_contact_if_any: st_refernece_contact_if_any,
    })),
  updateStRefernceEmailIfAny: (st_refernece_email_if_any) =>
    set((state) => ({ st_refernece_email_if_any: st_refernece_email_if_any })),
  updateStProfilePic: (st_profile_pic) =>
    set((state) => ({ st_profile_pic: st_profile_pic })),
  updateStAadharPic: (st_aadhar_pic) =>
    set((state) => ({ st_aadhar_pic: st_aadhar_pic })),
  updateStPanPic: (st_pan_pic) => set((state) => ({ st_pan_pic: st_pan_pic })),
});

employeeStore = persist(employeeStore, { name: "cdot_empstore_api" });
export const useemployeeStore = create(employeeStore);
