import { useState, useRef, useEffect } from "react";
import { TextField, Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useemployeeStore } from "../../components/employeeStore";

export default function OtherDetails() {
  const [image, setImage] = useState("");
  const [uploadaadhaarpic, setUploadAadhaar] = useState("");
  const [uploadpanpic, setUploadPan] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadinga, setLoadinga] = useState(false);
  const [loadingp, setLoadingp] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewAadhaar, setPreviewAadhaar] = useState("");
  const [previewPan, setPreviewPan] = useState("");
  const baseURL = process.env.REACT_APP_API_URL;
  const backendURL = process.env.REACT_APP_BACKEND_URL;

  const st_profile_pic = useemployeeStore((state) => state.st_profile_pic);
  const st_aadhar_pic = useemployeeStore((state) => state.st_aadhar_pic);
  const st_pan_pic = useemployeeStore((state) => state.st_pan_pic);

  const updateStProfilePic = useemployeeStore(
    (state) => state.updateStProfilePic
  );
  const updateStAadharPic = useemployeeStore(
    (state) => state.updateStAadharPic
  );
  const updateStPanPic = useemployeeStore((state) => state.updateStPanPic);

  useEffect(() => {
    // Helper function to get display URL
    const getDisplayUrl = (path) => {
      if (!path) return "";
      // If it's already a full URL (Cloudinary), use as is
      if (path.startsWith("http")) return path;
      // If it's a relative path, create full URL
      return `${backendURL}${path}`;
      // return `${window.location.origin}${path}`;
    };

    if (st_profile_pic) {
      setImage(getDisplayUrl(st_profile_pic));
      setLoading(false);
    }
    if (st_aadhar_pic) {
      setUploadAadhaar(getDisplayUrl(st_aadhar_pic));
      setLoadinga(false);
    }
    if (st_pan_pic) {
      setUploadPan(getDisplayUrl(st_pan_pic));
      setLoadingp(false);
    }
  }, [st_profile_pic, st_aadhar_pic, st_pan_pic]);

  const uploadImage = async (e) => {
    const files = e.target.files;
    if (!files[0]) return;

    // Create local preview immediately
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target.result);
    };
    reader.readAsDataURL(files[0]);

    const data = new FormData();
    data.append("file", files[0]);
    setLoading(true);

    try {
      const res = await fetch(`${baseURL}employees/upload-profile-picture`, {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const result = await res.json();
      const fileUrl = `${window.location.origin}${result.file_path}`;

      setImage(fileUrl);
      updateStProfilePic(result.file_path);
      setPreviewImage(""); // Clear preview after successful upload
      setLoading(false);

      toast.success("Profile picture uploaded successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Upload error:", error);
      setPreviewImage(""); // Clear preview on error
      setLoading(false);
      toast.error("Failed to upload profile picture. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const uploadAadhaar = async (e) => {
    const files = e.target.files;
    if (!files[0]) return;

    // Create local preview immediately
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewAadhaar(event.target.result);
    };
    reader.readAsDataURL(files[0]);

    const data = new FormData();
    data.append("file", files[0]);
    setLoadinga(true);

    try {
      const res = await fetch(`${baseURL}employees/upload-aadhaar`, {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const result = await res.json();
      const fileUrl = `${window.location.origin}${result.file_path}`;

      setUploadAadhaar(fileUrl);
      updateStAadharPic(result.file_path);
      setPreviewAadhaar(""); // Clear preview after successful upload
      setLoadinga(false);

      toast.success("Aadhaar document uploaded successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Upload error:", error);
      setPreviewAadhaar(""); // Clear preview on error
      setLoadinga(false);
      toast.error("Failed to upload Aadhaar document. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const uploadPan = async (e) => {
    const files = e.target.files;
    if (!files[0]) return;

    // Create local preview immediately
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewPan(event.target.result);
    };
    reader.readAsDataURL(files[0]);

    const data = new FormData();
    data.append("file", files[0]);
    setLoadingp(true);

    try {
      const res = await fetch(`${baseURL}employees/upload-pan`, {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const result = await res.json();
      const fileUrl = `${window.location.origin}${result.file_path}`;

      setUploadPan(fileUrl);
      updateStPanPic(result.file_path);
      setPreviewPan(""); // Clear preview after successful upload
      setLoadingp(false);

      toast.success("PAN document uploaded successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Upload error:", error);
      setPreviewPan(""); // Clear preview on error
      setLoadingp(false);
      toast.error("Failed to upload PAN document. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <>
      <div style={{ overflowY: "auto" }}>
        <Box sx={{ m: 10 }} />
        <Grid container spacing={2}>
          <Grid item md={4} xs={12}>
            <p>Profile Picture</p>
            <Box sx={{ m: 1 }} />
            <TextField
              variant="outlined"
              type="file"
              name="photo"
              inputProps={{
                accept: "image/*",
                style: { fontSize: "14px" }
              }}
              sx={{ minWidth: "92%" }}
              onChange={uploadImage}
            />
            <Box sx={{ m: 2 }} />
            <Box sx={{ m: 2, height: 240, width: 200 }}>
              {loading ? (
                <h3>Loading...</h3>
              ) : (previewImage || image) ? (
                <img
                  src={previewImage || image}
                  alt="Profile"
                  style={{ width: "300px", maxHeight: "240px", objectFit: "contain" }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div style={{ 
                  width: "300px", 
                  height: "240px", 
                  border: "2px dashed #ccc", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  color: "#999"
                }}>
                  No image selected
                </div>
              )}
            </Box>
          </Grid>
          <Grid item md={4} xs={12}>
            <p>Aadhaar Id</p>
            <Box sx={{ m: 1 }} />
            <TextField
              type="file"
              name="aadhaar_pic"
              inputProps={{
                accept: "image/*",
                style: { fontSize: "14px" }
              }}
              sx={{ minWidth: "92%" }}
              onChange={uploadAadhaar}
            />
            <Box sx={{ m: 2 }} />
            <Box sx={{ m: 2, height: 240, width: 200 }}>
              {loadinga ? (
                <h3>Loading...</h3>
              ) : (previewAadhaar || uploadaadhaarpic) ? (
                <img
                  src={previewAadhaar || uploadaadhaarpic}
                  alt="Aadhaar"
                  style={{ width: "300px", maxHeight: "240px", objectFit: "contain" }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div style={{ 
                  width: "300px", 
                  height: "240px", 
                  border: "2px dashed #ccc", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  color: "#999"
                }}>
                  No image selected
                </div>
              )}
            </Box>
          </Grid>
          <Grid item md={4} xs={12}>
            <p>Pan Card</p>
            <Box sx={{ m: 1 }} />
            <TextField
              type="file"
              name="pan_pic"
              inputProps={{
                accept: "image/*",
                style: { fontSize: "14px" }
              }}
              sx={{ minWidth: "92%" }}
              onChange={uploadPan}
            />
            <Box sx={{ m: 2 }} />
            <Box sx={{ m: 2, height: 240, width: 200 }}>
              {loadingp ? (
                <h3>Loading...</h3>
              ) : (previewPan || uploadpanpic) ? (
                <img
                  src={previewPan || uploadpanpic}
                  alt="PAN Card"
                  style={{ width: "300px", maxHeight: "240px", objectFit: "contain" }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div style={{ 
                  width: "300px", 
                  height: "240px", 
                  border: "2px dashed #ccc", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  color: "#999"
                }}>
                  No image selected
                </div>
              )}
            </Box>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
