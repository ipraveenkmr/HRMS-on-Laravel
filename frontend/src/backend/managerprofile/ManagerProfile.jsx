import { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import PersonalDetails from "../manageremployee/PersonalDetails";
import OfficialDetails from "../manageremployee/OfficialDetails";
import LastWorkDetails from "../manageremployee/LastWorkDetails";
import EducationDetails from "../manageremployee/EducationDetails";
import OtherDetails from "../manageremployee/OtherDetails";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usecdotStore } from "../../components/cdotStore";
import { useemployeeStore } from "../../components/employeeStore";
import Swal from "sweetalert2";

const steps = [
  "Personal Details",
  "Official Details",
  "Education Details",
  "Last Work Details",
  "Other Details",
];

export default function ManagerProfile() {
  const baseURL = process.env.REACT_APP_API_URL;
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasPassingYear, setHasPassingYear] = useState(false);
  const username = usecdotStore((state) => state.username);
  const updateEmployee = usecdotStore((state) => state.updateEmployee);

  // Employee store state
  const st_username = useemployeeStore((state) => state.st_username);
  const st_company = useemployeeStore((state) => state.st_company);
  const st_branchname = useemployeeStore((state) => state.st_branchname);
  const st_work_mode = useemployeeStore((state) => state.st_work_mode);
  const st_name = useemployeeStore((state) => state.st_name);
  const st_email = useemployeeStore((state) => state.st_email);
  const st_phone = useemployeeStore((state) => state.st_phone);
  const st_emergency_phone = useemployeeStore((state) => state.st_emergency_phone);
  const st_gender = useemployeeStore((state) => state.st_gender);
  const st_father_husband_name = useemployeeStore((state) => state.st_father_husband_name);
  const st_mother_name = useemployeeStore((state) => state.st_mother_name);
  const st_permanent_address = useemployeeStore((state) => state.st_permanent_address);
  const st_present_address = useemployeeStore((state) => state.st_present_address);
  const st_city = useemployeeStore((state) => state.st_city);
  const st_state = useemployeeStore((state) => state.st_state);
  const st_pincode = useemployeeStore((state) => state.st_pincode);
  const st_pan = useemployeeStore((state) => state.st_pan);
  const st_aadhaar = useemployeeStore((state) => state.st_aadhaar);
  const st_dob = useemployeeStore((state) => state.st_dob);
  const st_emp_no = useemployeeStore((state) => state.st_emp_no);
  const st_department = useemployeeStore((state) => state.st_department);
  const st_designation = useemployeeStore((state) => state.st_designation);
  const st_emp_type = useemployeeStore((state) => state.st_emp_type);
  const st_job_type = useemployeeStore((state) => state.st_job_type);
  const st_probation = useemployeeStore((state) => state.st_probation);
  const st_emp_file_no = useemployeeStore((state) => state.st_emp_file_no);
  const st_pf_account_no = useemployeeStore((state) => state.st_pf_account_no);
  const st_esi_account_no = useemployeeStore((state) => state.st_esi_account_no);
  const st_status = useemployeeStore((state) => state.st_status);
  const st_full_and_final = useemployeeStore((state) => state.st_full_and_final);
  const st_joining_date = useemployeeStore((state) => state.st_joining_date);
  const st_resignation_date = useemployeeStore((state) => state.st_resignation_date);
  const st_last_working_day = useemployeeStore((state) => state.st_last_working_day);
  const st_pay_grade = useemployeeStore((state) => state.st_pay_grade);
  const st_gross_salary = useemployeeStore((state) => state.st_gross_salary);
  const st_pf = useemployeeStore((state) => state.st_pf);
  const st_esi = useemployeeStore((state) => state.st_esi);
  const st_bank_name = useemployeeStore((state) => state.st_bank_name);
  const st_bank_account_no = useemployeeStore((state) => state.st_bank_account_no);
  const st_ifsc_code = useemployeeStore((state) => state.st_ifsc_code);
  const st_branch = useemployeeStore((state) => state.st_branch);
  const st_bank_city = useemployeeStore((state) => state.st_bank_city);
  const st_qualification = useemployeeStore((state) => state.st_qualification);
  const st_specialization = useemployeeStore((state) => state.st_specialization);
  const st_board = useemployeeStore((state) => state.st_board);
  const st_course_name = useemployeeStore((state) => state.st_course_name);
  const st_passing_year = useemployeeStore((state) => state.st_passing_year);
  const st_employer = useemployeeStore((state) => state.st_employer);
  const st_job_title = useemployeeStore((state) => state.st_job_title);
  const st_comment = useemployeeStore((state) => state.st_comment);
  const st_end_date = useemployeeStore((state) => state.st_end_date);
  const st_start_date = useemployeeStore((state) => state.st_start_date);
  const st_refernce_name = useemployeeStore((state) => state.st_refernce_name);
  const st_refernce_designation = useemployeeStore((state) => state.st_refernce_designation);
  const st_refernce_department = useemployeeStore((state) => state.st_refernce_department);
  const st_refernce_contact = useemployeeStore((state) => state.st_refernce_contact);
  const st_refernce_email = useemployeeStore((state) => state.st_refernce_email);
  const st_refernce_name_if_any = useemployeeStore((state) => state.st_refernce_name_if_any);
  const st_refernce_designation_if_any = useemployeeStore((state) => state.st_refernce_designation_if_any);
  const st_refernce_department_if_any = useemployeeStore((state) => state.st_refernce_department_if_any);
  const st_refernce_contact_if_any = useemployeeStore((state) => state.st_refernce_contact_if_any);
  const st_refernce_email_if_any = useemployeeStore((state) => state.st_refernce_email_if_any);
  const st_profile_pic = useemployeeStore((state) => state.st_profile_pic);
  const st_aadhar_pic = useemployeeStore((state) => state.st_aadhar_pic);
  const st_pan_pic = useemployeeStore((state) => state.st_pan_pic);

  // Employee store actions
  const updateStUsername = useemployeeStore((state) => state.updateStUsername);
  const updateStCompany = useemployeeStore((state) => state.updateStCompany);
  const updateStBranchname = useemployeeStore((state) => state.updateStBranchname);
  const updateStWorkMode = useemployeeStore((state) => state.updateStWorkMode);
  const updateStName = useemployeeStore((state) => state.updateStName);
  const updateStEmail = useemployeeStore((state) => state.updateStEmail);
  const updateStPhone = useemployeeStore((state) => state.updateStPhone);
  const updateStEmergencyPhone = useemployeeStore((state) => state.updateStEmergencyPhone);
  const updateStGender = useemployeeStore((state) => state.updateStGender);
  const updateStFatherHusbandName = useemployeeStore((state) => state.updateStFatherHusbandName);
  const updateStMotherName = useemployeeStore((state) => state.updateStMotherName);
  const updateStPermanentAddress = useemployeeStore((state) => state.updateStPermanentAddress);
  const updateStPresentAddress = useemployeeStore((state) => state.updateStPresentAddress);
  const updateStCity = useemployeeStore((state) => state.updateStCity);
  const updateStState = useemployeeStore((state) => state.updateStState);
  const updateStPincode = useemployeeStore((state) => state.updateStPincode);
  const updateStPan = useemployeeStore((state) => state.updateStPan);
  const updateStAadhaar = useemployeeStore((state) => state.updateStAadhaar);
  const updateStDob = useemployeeStore((state) => state.updateStDob);
  const updateStEmpNo = useemployeeStore((state) => state.updateStEmpNo);
  const updateStDepartment = useemployeeStore((state) => state.updateStDepartment);
  const updateStDesignation = useemployeeStore((state) => state.updateStDesignation);
  const updateStEmpType = useemployeeStore((state) => state.updateStEmpType);
  const updateStJobType = useemployeeStore((state) => state.updateStJobType);
  const updateStProbation = useemployeeStore((state) => state.updateStProbation);
  const updateStFileNo = useemployeeStore((state) => state.updateStFileNo);
  const updateStPfAccountNo = useemployeeStore((state) => state.updateStPfAccountNo);
  const updateStEsiAccountNo = useemployeeStore((state) => state.updateStEsiAccountNo);
  const updateUanNumber = useemployeeStore((state) => state.updateUanNumber);
  const updateStStatus = useemployeeStore((state) => state.updateStStatus);
  const updateStFullNfinal = useemployeeStore((state) => state.updateStFullNfinal);
  const updateStJoiningdate = useemployeeStore((state) => state.updateStJoiningdate);
  const updateStResignationdate = useemployeeStore((state) => state.updateStResignationdate);
  const updateStLastWorkingDay = useemployeeStore((state) => state.updateStLastWorkingDay);
  const updateStPayGrade = useemployeeStore((state) => state.updateStPayGrade);
  const updateStGrossSalary = useemployeeStore((state) => state.updateStGrossSalary);
  const updateStPf = useemployeeStore((state) => state.updateStPf);
  const updateStEsi = useemployeeStore((state) => state.updateStEsi);
  const updateStBankName = useemployeeStore((state) => state.updateStBankName);
  const updateStBankAccountNo = useemployeeStore((state) => state.updateStBankAccountNo);
  const updateStIfscCode = useemployeeStore((state) => state.updateStIfscCode);
  const updateStBranch = useemployeeStore((state) => state.updateStBranch);
  const updateStBankCity = useemployeeStore((state) => state.updateStBankCity);
  const updateStQualification = useemployeeStore((state) => state.updateStQualification);
  const updateStSpecialization = useemployeeStore((state) => state.updateStSpecialization);
  const updateStBoard = useemployeeStore((state) => state.updateStBoard);
  const updateStCourseName = useemployeeStore((state) => state.updateStCourseName);
  const updateStPassingYear = useemployeeStore((state) => state.updateStPassingYear);
  const updateStEmployer = useemployeeStore((state) => state.updateStEmployer);
  const updateStJobTitle = useemployeeStore((state) => state.updateStJobTitle);
  const updateStComment = useemployeeStore((state) => state.updateStComment);
  const updateStEndDate = useemployeeStore((state) => state.updateStEndDate);
  const updateStStartDate = useemployeeStore((state) => state.updateStStartDate);
  const updateStRefernceName = useemployeeStore((state) => state.updateStRefernceName);
  const updateStRefernceDesignation = useemployeeStore((state) => state.updateStRefernceDesignation);
  const updateStRefernceDepartment = useemployeeStore((state) => state.updateStRefernceDepartment);
  const updateStRefernceContact = useemployeeStore((state) => state.updateStRefernceContact);
  const updateStRefernceEmail = useemployeeStore((state) => state.updateStRefernceEmail);
  const updateStRefernceNameIfAny = useemployeeStore((state) => state.updateStRefernceNameIfAny);
  const updateStRefernceDesignationIfAny = useemployeeStore((state) => state.updateStRefernceDesignationIfAny);
  const updateStRefernceDepartmentIfAny = useemployeeStore((state) => state.updateStRefernceDepartmentIfAny);
  const updateStRefernceContactIfAny = useemployeeStore((state) => state.updateStRefernceContactIfAny);
  const updateStRefernceEmailIfAny = useemployeeStore((state) => state.updateStRefernceEmailIfAny);
  const updateStProfilePic = useemployeeStore((state) => state.updateStProfilePic);
  const updateStAadharPic = useemployeeStore((state) => state.updateStAadharPic);
  const updateStPanPic = useemployeeStore((state) => state.updateStPanPic);

  useEffect(() => {
    if (username) {
      loadEmployeeData();
    }
  }, [username]);

  const loadEmployeeData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(baseURL + "employees/username/" + username);
      if (response.data && response.data.length > 0) {
        const emp = response.data[0];
        // Populate employee store with current data
        updateStUsername(emp.username || "");
        updateStCompany(emp.company_name_id || "");
        updateStBranchname(emp.branch_name_id || "");
        updateStWorkMode(emp.work_mode || "");
        updateStName(emp.emp_name || "");
        updateStEmail(emp.emp_email || "");
        updateStPhone(emp.emp_phone || "");
        updateStEmergencyPhone(emp.emp_emergency_phone || "");
        updateStGender(emp.gender || "");
        updateStFatherHusbandName(emp.father_husband_name || "");
        updateStMotherName(emp.mothers_name || "");
        updateStPermanentAddress(emp.permanent_address || "");
        updateStPresentAddress(emp.present_address || "");
        updateStCity(emp.city || "");
        updateStState(emp.state || "");
        updateStPincode(emp.pincode || "");
        updateStPan(emp.pan || "");
        updateStAadhaar(emp.aadhaar || "");
        updateStDob(emp.dob || "");
        updateStEmpNo(emp.emp_no || "");
        updateStDepartment(emp.department_id || "");
        updateStDesignation(emp.designation || "");
        updateStEmpType(emp.emp_type || "");
        updateStJobType(emp.job_type || "");
        updateStProbation(emp.probation_period || "");
        updateStFileNo(emp.emp_file_no || "");
        updateStPfAccountNo(emp.pf_account_number_uan || "");
        updateStEsiAccountNo(emp.esi_account_number || "");
        updateUanNumber(emp.uan_number || "");
        updateStStatus(emp.emp_status || "");
        updateStFullNfinal(emp.full_and_final || "");
        updateStJoiningdate(emp.start_date || "");
        updateStResignationdate(emp.resignation_date || "");
        updateStLastWorkingDay(emp.last_working_day || "");
        updateStPayGrade(emp.pay_grade_id || "");
        updateStGrossSalary(emp.gross_salary || 0);
        updateStPf(emp.pf || 0);
        updateStEsi(emp.esi || 0);
        updateStBankName(emp.bank_name || "");
        updateStBankAccountNo(emp.bank_account_number || "");
        updateStIfscCode(emp.ifsc_code || "");
        updateStBranch(emp.branch || "");
        updateStBankCity(emp.bank_city || "");
        updateStQualification(emp.qualification || "");
        updateStSpecialization(emp.specialization || "");
        updateStBoard(emp.board_university || "");
        updateStCourseName(emp.course_name || "");
        updateStPassingYear(emp.passing_year || "");
        setHasPassingYear(!!(emp.passing_year && emp.passing_year.trim() !== ''));
        updateStEmployer(emp.employer || "");
        updateStJobTitle(emp.job_title || "");
        updateStComment(emp.comment || "");
        updateStEndDate(emp.end_date || "");
        updateStStartDate(emp.start_date || "");
        updateStRefernceName(emp.reference_name || "");
        updateStRefernceDesignation(emp.reference_designation || "");
        updateStRefernceDepartment(emp.reference_department || "");
        updateStRefernceContact(emp.reference_contact || "");
        updateStRefernceEmail(emp.reference_email || "");
        updateStRefernceNameIfAny(emp.reference_name_if_any || "");
        updateStRefernceDesignationIfAny(emp.reference_designation_if_any || "");
        updateStRefernceDepartmentIfAny(emp.reference_department_if_any || "");
        updateStRefernceContactIfAny(emp.reference_contact_if_any || "");
        updateStRefernceEmailIfAny(emp.reference_email_if_any || "");
        updateStProfilePic(emp.photo || "");
        updateStAadharPic(emp.aadhaar_pic || "");
        updateStPanPic(emp.pan_pic || "");
      }
    } catch (error) {
      console.error("Error loading employee data:", error);
      toast.error("Failed to load employee data");
    } finally {
      setLoading(false);
    }
  };

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
    setIsEditMode(false);
  };

  const handleEdit = () => {
    setIsEditMode(true);
    setActiveStep(0);
  };

  const handleSave = async () => {
    if (st_passing_year && st_passing_year.trim() !== '') {
      const result = await Swal.fire({
        title: 'Confirmation Required',
        text: 'Are you sure? You won\'t be able to edit the passing year next time!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, save it!'
      });

      if (!result.isConfirmed) {
        return;
      }
    }

    try {
      setLoading(true);
      const employeeData = {
        username: st_username,
        company_name_id: st_company,
        branch_name_id: st_branchname,
        work_mode: st_work_mode,
        emp_name: st_name,
        emp_email: st_email,
        emp_phone: st_phone,
        emp_emergency_phone: st_emergency_phone,
        gender: st_gender,
        father_husband_name: st_father_husband_name,
        mothers_name: st_mother_name,
        permanent_address: st_permanent_address,
        present_address: st_present_address,
        city: st_city,
        state: st_state,
        pincode: st_pincode,
        pan: st_pan,
        aadhaar: st_aadhaar,
        dob: st_dob,
        emp_no: st_emp_no,
        department_id: st_department,
        designation: st_designation,
        emp_type: st_emp_type,
        job_type: st_job_type,
        probation_period: st_probation,
        emp_file_no: st_emp_file_no,
        pf_account_number_uan: st_pf_account_no,
        esi_account_number: st_esi_account_no,
        emp_status: st_status,
        full_and_final: st_full_and_final,
        start_date: st_joining_date,
        resignation_date: st_resignation_date,
        last_working_day: st_last_working_day,
        pay_grade_id: st_pay_grade,
        gross_salary: st_gross_salary,
        pf: st_pf,
        esi: st_esi,
        bank_name: st_bank_name,
        bank_account_number: st_bank_account_no,
        ifsc_code: st_ifsc_code,
        branch: st_branch,
        bank_city: st_bank_city,
        qualification: st_qualification,
        specialization: st_specialization,
        board_university: st_board,
        course_name: st_course_name,
        passing_year: st_passing_year,
        employer: st_employer,
        job_title: st_job_title,
        comment: st_comment,
        end_date: st_end_date,
        reference_name: st_refernce_name,
        reference_designation: st_refernce_designation,
        reference_department: st_refernce_department,
        reference_contact: st_refernce_contact,
        reference_email: st_refernce_email,
        reference_name_if_any: st_refernce_name_if_any,
        reference_designation_if_any: st_refernce_designation_if_any,
        reference_department_if_any: st_refernce_department_if_any,
        reference_contact_if_any: st_refernce_contact_if_any,
        reference_email_if_any: st_refernce_email_if_any,
        photo: st_profile_pic,
        aadhaar_pic: st_aadhar_pic,
        pan_pic: st_pan_pic,
      };

      const response = await axios.put(
        baseURL + "employees/username/" + username,
        employeeData
      );

      if (response.status === 200) {
        Swal.fire("Success!", "Profile updated successfully.", "success");
        setIsEditMode(false);
        setActiveStep(0);
        // Refresh employee list in store
        const employeeListResponse = await axios.get(baseURL + "employees/");
        updateEmployee(employeeListResponse.data);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire("Error!", "Failed to update profile.", "error");
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <PersonalDetails />;
      case 1:
        return <OfficialDetails />;
      case 2:
        return <EducationDetails />;
      case 3:
        return <LastWorkDetails />;
      case 4:
        return <OtherDetails />;
      default:
        return "Unknown step";
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading profile data...</Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, m: 1 }}>
      <Typography align="center" variant="h5" sx={{ mb: 3 }}>
        My Details - Manager Profile
      </Typography>
      
      {!isEditMode ? (
        <Box sx={{ textAlign: 'center', mb: 1 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            View and update your personal information
          </Typography>
          <Button variant="contained" onClick={handleEdit}>
            Edit Profile
          </Button>
        </Box>
      ) : null}

      {isEditMode && (
        <>
          <Stepper activeStep={activeStep} sx={{ mb: 0 }}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>

          <Box sx={{ mt: 2, mb: 1 }}>
            {getStepContent(activeStep)}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}
            {activeStep === steps.length - 1 ? (
              !hasPassingYear && (
                <Button onClick={handleSave} disabled={loading}>
                  Save Profile
                </Button>
              )
            ) : (
              <Button onClick={handleNext}>
                Next
              </Button>
            )}
          </Box>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button variant="outlined" onClick={handleReset}>
              Cancel
            </Button>
          </Box>
        </>
      )}

      {!isEditMode && activeStep === 0 && (
        <Box sx={{ mt: 2 }}>
          {getStepContent(0)}
        </Box>
      )}
    </Paper>
  );
}