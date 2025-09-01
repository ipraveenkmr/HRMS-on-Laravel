import { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import PersonalDetails from "./PersonalDetails";
import OfficialDetails from "./OfficialDetails";
import LastWorkDetails from "./LastWorkDetails";
import EducationDetails from "./EducationDetails";
import OtherDetails from "./OtherDetails";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usecdotStore } from "../../components/cdotStore";
import { useemployeeStore } from "../../components/employeeStore";

const steps = [
  "Personal Details",
  "Official Details",
  "Education Details",
  "Last Work Details",
  "Other Details",
];

export default function AddForm({ closeform, eventid }) {
  const baseURL = process.env.REACT_APP_API_URL;
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const updateEmployee = usecdotStore((state) => state.updateEmployee);

  const st_username = useemployeeStore((state) => state.st_username);
  const st_company = useemployeeStore((state) => state.st_company);
  const st_branchname = useemployeeStore((state) => state.st_branchname);
  const st_work_mode = useemployeeStore((state) => state.st_work_mode);
  const st_name = useemployeeStore((state) => state.st_name);
  const st_email = useemployeeStore((state) => state.st_email);
  const st_phone = useemployeeStore((state) => state.st_phone);
  const st_emergency_phone = useemployeeStore(
    (state) => state.st_emergency_phone
  );
  const st_gender = useemployeeStore((state) => state.st_gender);
  const st_father_husband_name = useemployeeStore(
    (state) => state.st_father_husband_name
  );
  const st_mother_name = useemployeeStore((state) => state.st_mother_name);
  const st_permanent_address = useemployeeStore(
    (state) => state.st_permanent_address
  );
  const st_present_address = useemployeeStore(
    (state) => state.st_present_address
  );
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
  const st_esi_account_no = useemployeeStore(
    (state) => state.st_esi_account_no
  );
  const st_status = useemployeeStore((state) => state.st_status);
  const st_full_and_final = useemployeeStore(
    (state) => state.st_full_and_final
  );
  const st_joining_date = useemployeeStore((state) => state.st_joining_date);
  const st_resignation_date = useemployeeStore(
    (state) => state.st_resignation_date
  );
  const st_last_working_day = useemployeeStore(
    (state) => state.st_last_working_day
  );
  const st_pay_grade = useemployeeStore((state) => state.st_pay_grade);
  const st_gross_salary = useemployeeStore((state) => state.st_gross_salary);
  const st_ctc = useemployeeStore((state) => state.st_ctc);
  const st_pf = useemployeeStore((state) => state.st_pf);
  const st_esi = useemployeeStore((state) => state.st_esi);
  const st_bank_name = useemployeeStore((state) => state.st_bank_name);
  const st_bank_account_no = useemployeeStore(
    (state) => state.st_bank_account_no
  );
  const st_ifsc_code = useemployeeStore((state) => state.st_ifsc_code);
  const st_branch = useemployeeStore((state) => state.st_branch);
  const st_bank_city = useemployeeStore((state) => state.st_bank_city);
  const st_qualification = useemployeeStore((state) => state.st_qualification);
  const st_specialization = useemployeeStore(
    (state) => state.st_specialization
  );
  const st_board = useemployeeStore((state) => state.st_board);
  const st_course_name = useemployeeStore((state) => state.st_course_name);
  const st_passing_year = useemployeeStore((state) => state.st_passing_year);
  const st_employer = useemployeeStore((state) => state.st_employer);
  const st_job_title = useemployeeStore((state) => state.st_qualification);
  const st_comment = useemployeeStore((state) => state.st_comment);
  const st_end_date = useemployeeStore((state) => state.st_end_date);
  const st_start_date = useemployeeStore((state) => state.st_start_date);
  const st_reference_name = useemployeeStore(
    (state) => state.st_reference_name
  );
  const st_reference_designation = useemployeeStore(
    (state) => state.st_reference_designation
  );
  const st_refernece_department = useemployeeStore(
    (state) => state.st_refernece_department
  );
  const st_refernece_contact = useemployeeStore(
    (state) => state.st_refernece_contact
  );
  const st_refernece_email = useemployeeStore(
    (state) => state.st_refernece_email
  );
  const st_reference_name_if_any = useemployeeStore(
    (state) => state.st_reference_name_if_any
  );
  const st_reference_designation_if_any = useemployeeStore(
    (state) => state.st_reference_designation_if_any
  );
  const st_refernece_department_if_any = useemployeeStore(
    (state) => state.st_refernece_department_if_any
  );
  const st_refernece_contact_if_any = useemployeeStore(
    (state) => state.st_refernece_contact_if_any
  );
  const st_refernece_email_if_any = useemployeeStore(
    (state) => state.st_refernece_email_if_any
  );
  const st_profile_pic = useemployeeStore((state) => state.st_profile_pic);
  const st_aadhar_pic = useemployeeStore((state) => state.st_aadhar_pic);
  const st_pan_pic = useemployeeStore((state) => state.st_pan_pic);
  const st_longitude = useemployeeStore((state) => state.st_longitude);
  const st_latitude = useemployeeStore((state) => state.st_latitude);
  const isbasicpay = useemployeeStore((state) => state.isbasicpay);
  const uannumber = useemployeeStore((state) => state.uannumber);

  //Adding Details for Edit Form
  const [showform, setShowform] = useState(false);
  const formdata = useRef("");

  useEffect(() => {
    console.log("editform: " + eventid);
    if (eventid > 0) {
      employeeEditApi();
    } else {
      setShowform(true);
    }
  }, []);

  const updateStUsername = useemployeeStore((state) => state.updateStUsername);
  const updateStCompany = useemployeeStore((state) => state.updateStCompany);
  const updateStBranchname = useemployeeStore(
    (state) => state.updateStBranchname
  );
  const updateStWorkMode = useemployeeStore((state) => state.updateStWorkMode);
  const updateStName = useemployeeStore((state) => state.updateStName);
  const updateStEmail = useemployeeStore((state) => state.updateStEmail);
  const updateStPhone = useemployeeStore((state) => state.updateStPhone);
  const updateStEmergencyPhone = useemployeeStore(
    (state) => state.updateStEmergencyPhone
  );
  const updateStGender = useemployeeStore((state) => state.updateStGender);
  const updateStFatherHusbandName = useemployeeStore(
    (state) => state.updateStFatherHusbandName
  );
  const updateStMotherName = useemployeeStore(
    (state) => state.updateStMotherName
  );
  const updateStPermanentAddress = useemployeeStore(
    (state) => state.updateStPermanentAddress
  );
  const updateStPresentAddress = useemployeeStore(
    (state) => state.updateStPresentAddress
  );
  const updateStCity = useemployeeStore((state) => state.updateStCity);
  const updateStState = useemployeeStore((state) => state.updateStState);
  const updateStPincode = useemployeeStore((state) => state.updateStPincode);
  const updateStPan = useemployeeStore((state) => state.updateStPan);
  const updateStAadhaar = useemployeeStore((state) => state.updateStAadhaar);
  const updateStDob = useemployeeStore((state) => state.updateStDob);
  const updateStEmpNo = useemployeeStore((state) => state.updateStEmpNo);
  const updateStDepartment = useemployeeStore(
    (state) => state.updateStDepartment
  );
  const updateStDesignation = useemployeeStore(
    (state) => state.updateStDesignation
  );
  const updateStEmpType = useemployeeStore((state) => state.updateStEmpType);
  const updateStJobType = useemployeeStore((state) => state.updateStJobType);
  const updateStProbation = useemployeeStore(
    (state) => state.updateStProbation
  );
  const updateStFileNo = useemployeeStore((state) => state.updateStFileNo);
  const updateStPfAccountNo = useemployeeStore(
    (state) => state.updateStPfAccountNo
  );
  const updateStEsiAccountNo = useemployeeStore(
    (state) => state.updateStEsiAccountNo
  );
  const updateStStatus = useemployeeStore((state) => state.updateStStatus);
  const updateStFullNfinal = useemployeeStore(
    (state) => state.updateStFullNfinal
  );
  const updateStJoiningdate = useemployeeStore(
    (state) => state.updateStJoiningdate
  );
  const updateStResignationdate = useemployeeStore(
    (state) => state.updateStResignationdate
  );
  const updateStLastWorkingDay = useemployeeStore(
    (state) => state.updateStLastWorkingDay
  );
  const updateStPayGrade = useemployeeStore((state) => state.updateStPayGrade);
  const updateStGrossSalary = useemployeeStore(
    (state) => state.updateStGrossSalary
  );
  const updateStCtc = useemployeeStore((state) => state.updateStCtc);
  const updateStPf = useemployeeStore((state) => state.updateStPf);
  const updateStEsi = useemployeeStore((state) => state.updateStEsi);
  const updateStBankName = useemployeeStore((state) => state.updateStBankName);
  const updateStBankAccountNo = useemployeeStore(
    (state) => state.updateStBankAccountNo
  );
  const updateStIfscCode = useemployeeStore((state) => state.updateStIfscCode);
  const updateStBranch = useemployeeStore((state) => state.updateStBranch);
  const updateStBankCity = useemployeeStore((state) => state.updateStBankCity);
  const updateStEmployer = useemployeeStore((state) => state.updateStEmployer);
  const updateStJobTitle = useemployeeStore((state) => state.updateStJobTitle);
  const updateStComment = useemployeeStore((state) => state.updateStComment);
  const updateStEndDate = useemployeeStore((state) => state.updateStEndDate);
  const updateStStartDate = useemployeeStore(
    (state) => state.updateStStartDate
  );
  const updateStRefernceName = useemployeeStore(
    (state) => state.updateStRefernceName
  );
  const updateStRefernceDesignation = useemployeeStore(
    (state) => state.updateStRefernceDesignation
  );
  const updateStRefernceDepartment = useemployeeStore(
    (state) => state.updateStRefernceDepartment
  );
  const updateStRefernceContact = useemployeeStore(
    (state) => state.updateStRefernceContact
  );
  const updateStRefernceEmail = useemployeeStore(
    (state) => state.updateStRefernceEmail
  );
  const updateStRefernceNameIfAny = useemployeeStore(
    (state) => state.updateStRefernceNameIfAny
  );
  const updateStRefernceDesignationIfAny = useemployeeStore(
    (state) => state.updateStRefernceDesignationIfAny
  );
  const updateStRefernceDepartmentIfAny = useemployeeStore(
    (state) => state.updateStRefernceDepartmentIfAny
  );
  const updateStRefernceContactIfAny = useemployeeStore(
    (state) => state.updateStRefernceContactIfAny
  );
  const updateStRefernceEmailIfAny = useemployeeStore(
    (state) => state.updateStRefernceEmailIfAny
  );
  const updateStQualification = useemployeeStore(
    (state) => state.updateStQualification
  );
  const updateStSpecialization = useemployeeStore(
    (state) => state.updateStSpecialization
  );
  const updateStBoard = useemployeeStore((state) => state.updateStBoard);
  const updateStCourseName = useemployeeStore(
    (state) => state.updateStCourseName
  );
  const updateStPassingYear = useemployeeStore(
    (state) => state.updateStPassingYear
  );
  const updateStProfilePic = useemployeeStore(
    (state) => state.updateStProfilePic
  );
  const updateStAadharPic = useemployeeStore(
    (state) => state.updateStAadharPic
  );
  const updateStPanPic = useemployeeStore((state) => state.updateStPanPic);
  const updateBasicPay = useemployeeStore((state) => state.updateBasicPay);
  const updateUanNumber = useemployeeStore((state) => state.updateUanNumber);

  const employeeEditApi = async () => {
    // starting
    await axios
      .get(baseURL + "employees/" + eventid + "/", {
        // headers: {
        //   "Access-Control-Allow-Origin": "*",
        //   "Content-type": "Application/json",
        //   Authorization: `Bearer ${usertoken}`,
        // },
      })
      .then(function (response) {
        formdata.current = response.data[0];
        // console.log("kcheckpost emp " + JSON.stringify(response.data[0].ctc));
        updateStUsername(response.data[0].username);
        updateStCompany(response.data[0].company_name_id);
        updateStBranchname(response.data[0].branch_name_id);
        updateStWorkMode(response.data[0].work_mode);
        updateStName(response.data[0].emp_name);
        updateStEmail(response.data[0].emp_email);
        updateStPhone(response.data[0].emp_phone);
        updateStEmergencyPhone(response.data[0].emp_emergency_phone);
        updateStGender(response.data[0].gender);
        updateStFatherHusbandName(response.data[0].father_husband_name);
        updateStMotherName(response.data[0].mothers_name);
        updateStPermanentAddress(response.data[0].permanent_address);
        updateStPresentAddress(response.data[0].present_address);
        updateStCity(response.data[0].city);
        updateStState(response.data[0].state);
        updateStPincode(response.data[0].pincode);
        updateStPan(response.data[0].pan);
        updateStAadhaar(response.data[0].aadhaar);
        updateStDob(response.data[0].dob);
        updateStEmpNo(response.data[0].emp_no);
        updateStDepartment(response.data[0].department_id);
        updateStDesignation(response.data[0].designation);
        updateStEmpType(response.data[0].emp_type);
        updateStJobType(response.data[0].job_type);
        updateStProbation(response.data[0].probation_period_in_month);
        updateStFileNo(response.data[0].emp_file_no);
        updateStPfAccountNo(response.data[0].pf_account_number_uan);
        updateStEsiAccountNo(response.data[0].esi_account_number);
        updateStStatus(response.data[0].emp_status);
        updateStFullNfinal(response.data[0].full_and_final_settlement);
        updateStJoiningdate(response.data[0].emp_joining_date);
        updateStResignationdate(response.data[0].st_resignation_date);
        updateStLastWorkingDay(response.data[0].emp_last_working_date);
        updateStPayGrade(response.data[0].pay_grade_id);
        updateStGrossSalary(response.data[0].gross_salary);
        updateStCtc(response.data[0].ctc);
        updateStPf(response.data[0].pf);
        updateStEsi(response.data[0].esi);
        updateStBankName(response.data[0].bank_name);
        updateStBankAccountNo(response.data[0].bank_account_number);
        updateStIfscCode(response.data[0].ifsc_code);
        updateStBranch(response.data[0].bank_branch);
        updateStBankCity(response.data[0].bank_city);
        updateStQualification(response.data[0].qualification);
        updateStSpecialization(response.data[0].specialization);
        updateStBoard(response.data[0].board_university);
        updateStCourseName(response.data[0].name_of_course);
        updateStPassingYear(response.data[0].passing_year);
        updateStEmployer(response.data[0].employer);
        updateStJobTitle(response.data[0].job_title);
        updateStComment(response.data[0].comment);
        updateStEndDate(response.data[0].end_date);
        updateStStartDate(response.data[0].start_date);
        updateStRefernceName(response.data[0].reference_name);
        updateStRefernceDesignation(response.data[0].reference_designation);
        updateStRefernceDepartment(response.data[0].reference_department);
        updateStRefernceContact(response.data[0].reference_contact);
        updateStRefernceEmail(response.data[0].reference_email);
        updateStRefernceNameIfAny(response.data[0].reference_name_if_any);
        updateStRefernceDesignationIfAny(
          response.data[0].reference_designation_if_any
        );
        updateStRefernceDepartmentIfAny(
          response.data[0].reference_department_if_any
        );
        updateStRefernceContactIfAny(response.data[0].reference_contact_if_any);
        updateStRefernceEmailIfAny(response.data[0].reference_email_if_any);
        updateStProfilePic(response.data[0].photo);
        updateStAadharPic(response.data[0].aadhaar_pic);
        updateStPanPic(response.data[0].pan_pic);
        updateBasicPay(response.data[0].isbasicpay);
        updateUanNumber(response.data[0].uan_number);

        setShowform(true);
      })
      .catch(function (error) {
        console.log("kcheckpost" + error); //return 429
      });
    // ending
  };

  //Adding Details for Edit Form

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    console.log("Next Step Clicked...");
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);

    if (activeStep == 0) {
      if (!st_username || !st_work_mode || !st_gender || !st_branchname) {
        alertpersonal();
      }
    }

    if (activeStep == 1) {
      if (
        !st_emp_no ||
        !st_pay_grade ||
        !st_department ||
        !st_emp_type ||
        !st_job_type ||
        !st_status
      ) {
        alertofficial();
      }
    }

    if (activeStep == 2) {
      if (!st_qualification) {
        alerteducation();
      }
    }
  };

  const handleSubmit = async () => {
    if (
      st_work_mode &&
      st_emp_type &&
      st_status &&
      st_department &&
      st_job_type &&
      st_job_type &&
      st_qualification
    ) {
      await postData();
    } else {
      alertuser();
    }
  };

  const alertuser = () => {
    toast.error(
      "Please select work mode, emp type, job type and qualification!",
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        toastId: "id",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
  };

  const alertme = () => {
    toast.error("Please enter all required deatils!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      toastId: "id",
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const alertpersonal = () => {
    toast.error("Please enter Username, Branch, Work Mode and Gender!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      toastId: "personal",
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const alertofficial = () => {
    toast.error(
      "Please enter Emp No, Pay Grade, Department, Emp Type, Status!",
      {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        toastId: "official",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
  };

  const alerteducation = () => {
    toast.error("Please enter Qualification!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      toastId: "official",
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const postData = async () => {
    const values = {
      id: eventid,
      username: st_username,
      company_name_id: st_company,
      branch_name_id: st_branchname,
      longitude: st_longitude,
      latitude: st_latitude,
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
      probation_period_in_month: st_probation,
      emp_file_no: st_emp_file_no,
      pf_account_number_uan: st_pf_account_no,
      esi_account_number: st_esi_account_no,
      emp_status: st_status,
      full_and_final_settlement: st_full_and_final,
      emp_joining_date: st_joining_date,
      emp_resignation_date: st_resignation_date,
      emp_last_working_date: st_last_working_day,
      pay_grade_id: st_pay_grade,
      gross_salary: st_gross_salary,
      ctc: st_ctc,
      pf: st_pf,
      esi: st_esi,
      bank_name: st_bank_name,
      bank_account_number: st_bank_account_no,
      ifsc_code: st_ifsc_code,
      bank_branch: st_branch,
      bank_city: st_bank_city,
      qualification: st_qualification,
      specialization: st_specialization,
      board_university: st_board,
      name_of_course: st_course_name,
      passing_year: st_passing_year,
      employer: st_employer,
      job_title: st_job_title,
      comment: st_comment,
      start_date: st_start_date,
      end_date: st_end_date,
      reference_name: st_reference_name,
      reference_designation: st_reference_designation,
      reference_department: st_refernece_department,
      reference_contact: st_refernece_contact,
      reference_email: st_refernece_email,
      reference_name_if_any: st_reference_name_if_any,
      reference_designation_if_any: st_reference_designation_if_any,
      reference_department_if_any: st_refernece_department_if_any,
      reference_contact_if_any: st_refernece_contact_if_any,
      reference_email_if_any: st_refernece_email_if_any,
      photo: st_profile_pic,
      aadhaar_pic: st_aadhar_pic,
      pan_pic: st_pan_pic,
      isbasicpay: isbasicpay,
      uan_number: uannumber,
    };

    await axios({
      method: eventid > 0 ? 'put' : 'post',
      url: eventid > 0 ? `${baseURL}employees/${eventid}/` : `${baseURL}employees/`,
      data: values
    })
      .then(function (response) {
        console.log(`Employee ${eventid > 0 ? 'update' : 'post'}: ` + JSON.stringify(response.data));
        toast.success(eventid > 0 ? "Employee updated successfully!" : "Employee created successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          toastId: "id",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        employeeApi();
        closeform();
      })
      .catch(function (error) {
        console.log("kcheckpost" + error); //return 429
        toast.error("Something went wrong!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          toastId: "id",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  const employeeApi = async () => {
    // starting
    await axios
      .get(baseURL + "employees", {
        // headers: {
        //   "Access-Control-Allow-Origin": "*",
        //   "Content-type": "Application/json",
        //   Authorization: `Bearer ${usertoken}`,
        // },
      })
      .then(function (response) {
        updateEmployee(response.data);
      })
      .catch(function (error) {
        console.log("kcheckpost" + error); //return 429
      });
    // ending
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <>
      {showform && (
        <div>
          <IconButton
            style={{ position: "absolute", top: "0", right: "0" }}
            onClick={closeform}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ m: 2 }} />
          <Box sx={{ width: "100%" }}>
            <Stepper activeStep={activeStep}>
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
            <>
              {activeStep == 0 && <PersonalDetails />}
              {activeStep == 1 && <OfficialDetails />}
              {activeStep == 2 && <EducationDetails />}
              {activeStep == 3 && <LastWorkDetails />}
              {activeStep == 4 && <OtherDetails />}
              <Box
                sx={{ display: "flex", flexDirection: "row", pt: 2 }}
                position="absolute"
                bottom="20px"
              >
                <Button
                  color="inherit"
                  variant="outlined"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ ml: 2 }}></Box>
                {activeStep === steps.length - 1 && (
                  <Button onClick={handleSubmit} variant="outlined">
                    Submit
                  </Button>
                )}
                {activeStep !== steps.length - 1 && (
                  <Button onClick={handleNext} variant="outlined">
                    Next
                  </Button>
                )}
              </Box>
            </>
          </Box>
        </div>
      )}
    </>
  );
}
