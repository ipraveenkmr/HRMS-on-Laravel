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
    if (st_profile_pic && st_aadhar_pic && st_pan_pic) {
      setImage(st_profile_pic);
      setUploadAadhaar(st_aadhar_pic);
      setUploadPan(st_pan_pic);
      setLoading(false);
      setLoadinga(false);
      setLoadingp(false);
    }
  }, [st_profile_pic, st_aadhar_pic, st_pan_pic]);

  const uploadImage = async (e) => {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "ayjxmtmi");
    setLoading(true);
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/ddalmaqrk/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const file = await res.json();

    setImage(file.secure_url);
    updateStProfilePic(file.secure_url);
    setLoadinga(false);
  };

  const uploadAadhaar = async (e) => {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "ayjxmtmi");
    setLoading(true);
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/ddalmaqrk/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const file = await res.json();

    setUploadAadhaar(file.secure_url);
    updateStAadharPic(file.secure_url);
    setLoadingp(false);
  };

  const uploadPan = async (e) => {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "ayjxmtmi");
    setLoading(true);
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/ddalmaqrk/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const file = await res.json();

    setUploadPan(file.secure_url);
    updateStPanPic(file.secure_url);
    setLoading(false);
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
              sx={{ minWidth: "92%" }}
              onChange={uploadImage}
            />
            <Box sx={{ m: 2 }} />
            <Box sx={{ m: 2, height: 240, width: 200 }}>
              {loading ? (
                <h3>Loading...</h3>
              ) : (
                <img src={image} style={{ width: "300px" }} />
              )}
            </Box>
          </Grid>
          <Grid item md={4} xs={12}>
            <p>Aadhaar Id</p>
            <Box sx={{ m: 1 }} />
            <TextField
              type="file"
              name="aadhaar_pic"
              sx={{ minWidth: "92%" }}
              onChange={uploadAadhaar}
            />
            <Box sx={{ m: 2 }} />
            <Box sx={{ m: 2, height: 240, width: 200 }}>
              {loadinga ? (
                <h3>Loading...</h3>
              ) : (
                <img src={uploadaadhaarpic} style={{ width: "300px" }} />
              )}
            </Box>
          </Grid>
          <Grid item md={4} xs={12}>
            <p>Pan Card</p>
            <Box sx={{ m: 1 }} />
            <TextField
              type="file"
              name="pan_pic"
              sx={{ minWidth: "92%" }}
              onChange={uploadPan}
            />
            <Box sx={{ m: 2 }} />
            <Box sx={{ m: 2, height: 240, width: 200 }}>
              {loadingp ? (
                <h3>Loading...</h3>
              ) : (
                <img src={uploadpanpic} style={{ width: "300px" }} />
              )}
            </Box>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
