import * as React from "react";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import InfoIcon from "@mui/icons-material/Info";
import Nav from "./Nav";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usecdotStore } from "../components/cdotStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

// Styled components for modern design
const GradientBackground = styled(Box)({
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    position: "relative",
    overflow: "hidden",
    "&::before": {
        content: '""',
        position: "absolute",
        top: "10%",
        left: "15%",
        width: "80px",
        height: "80px",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "50%",
        animation: "float 3s ease-in-out infinite",
    },
    "&::after": {
        content: '""',
        position: "absolute",
        top: "20%",
        right: "15%",
        width: "60px",
        height: "60px",
        background: "rgba(255, 255, 255, 0.08)",
        borderRadius: "50%",
        animation: "float 3s ease-in-out infinite 1s",
    },
    "@keyframes float": {
        "0%, 100%": {
            transform: "translateY(0px)",
        },
        "50%": {
            transform: "translateY(-20px)",
        },
    },
});

const FloatingShape = styled(Box)(({ size, top, left, delay }) => ({
    position: "absolute",
    width: `${size}px`,
    height: `${size}px`,
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "50%",
    top: `${top}%`,
    left: `${left}%`,
    animation: `float 3s ease-in-out infinite ${delay}s`,
}));

const GlassCard = styled(Box)({
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    padding: "2rem",
    width: "100%",
});

const DemoCard = styled(Box)({
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "1.5rem",
    width: "100%",
});

const RoleButton = styled("button")({
    width: "100%",
    padding: "12px 16px",
    margin: "8px 0",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(5px)",
    color: "white",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    "&:hover": {
        background: "rgba(255, 255, 255, 0.2)",
        transform: "translateY(-2px)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    },
});

function Copyright(props) {
    return (
        <Typography
            variant="body2"
            color="rgba(255, 255, 255, 0.6)"
            align="center"
            sx={{ mt: 4 }}
            {...props}
        >
            {"Copyright © "}
            <Link color="inherit" href="https://codingmstr.com">
                CodingMSTR.com
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const baseURL = process.env.REACT_APP_API_URL;
    const updateTokenstore = usecdotStore((state) => state.updateTokenstore);
    const updateIslogin = usecdotStore((state) => state.updateIslogin);
    const updateUsername = usecdotStore((state) => state.updateUsername);
    const username = usecdotStore((state) => state.username);
    const updateAttendance = usecdotStore((state) => state.updateAttendance);
    const updateMenustore = usecdotStore((state) => state.updateMenustore);
    const updateEmptype = usecdotStore((state) => state.updateEmptype);
    const updateEmployee = usecdotStore((state) => state.updateEmployee);
    const updateEmpdepartment = usecdotStore(
        (state) => state.updateEmpdepartment
    );
    const islogin = usecdotStore((state) => state.islogin);
    const navigate = useNavigate();

    useEffect(() => {
        if (islogin) {
            updateEmptype("");
            updateEmpdepartment("");
            updateMenustore("");
            myattendanceApi();
            employeeApi();
        }
    }, [islogin]);

    const employeeApi = async () => {
        await axios
            .get(baseURL + "employees")
            .then(function (response) {
                updateEmployee(response.data);
                navigate("/backend/");
            })
            .catch(function (error) {
                console.log("kcheckpost" + error);
            });
    };

    const myattendanceApi = async () => {
        await axios
            .get(baseURL + "attendance/employee/" + username)
            .then(function (response) {
                updateAttendance(response.data);
            })
            .catch(function (error) {
                console.log("kcheckpost" + error);
            });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const formData = new FormData();
        formData.append("username", data.get("email"));
        formData.append("password", data.get("password"));

        await axios
            .post(baseURL + "auth/token", formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            })
            .then(function (response) {
                updateTokenstore(response.data.access);
                updateIslogin(true);
                updateUsername(data.get("email"));
                navigate("/backend/");
            })
            .catch(function (error) {
                console.log("kcheckpost" + error);
                toast.error("Username or password is incorrect!", {
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

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const fillCredentials = (username, password) => {
        document.getElementById("email").value = username;
        document.getElementById("password").value = password;
    };

    return (
        <GradientBackground>
            <Nav />

            {/* Floating Elements */}
            <FloatingShape size={40} top={70} left={10} delay={2} />
            <FloatingShape size={100} top={60} left={80} delay={0.5} />
            <FloatingShape size={30} top={40} left={5} delay={1.5} />
            <FloatingShape size={50} top={80} left={90} delay={2.5} />

            <Container
                component="main"
                maxWidth="lg"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "80vh",
                    py: 2,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        gap: 4,
                        width: "100%",
                        maxWidth: "900px",
                        alignItems: "flex-start",
                        flexDirection: { xs: "column", md: "row" },
                        justifyContent: "center",
                    }}
                >
                    {/* Demo Credentials Card */}
                    <DemoCard
                        sx={{
                            flex: { xs: "1", md: "0 0 380px" },
                            order: { xs: 2, md: 1 },
                            alignSelf: { xs: "stretch", md: "flex-start" },
                        }}
                        style={{ marginTop: "100px" }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 2,
                            }}
                        >
                            <InfoIcon sx={{ color: "white", mr: 1 }} />
                            <Typography
                                variant="h6"
                                sx={{ color: "white", fontWeight: 600 }}
                            >
                                Demo Credentials
                            </Typography>
                        </Box>

                        <Typography
                            variant="body2"
                            sx={{ color: "rgba(255, 255, 255, 0.8)", mb: 2 }}
                        >
                            Click on any role below to auto-fill credentials:
                        </Typography>

                        <RoleButton
                            onClick={() =>
                                fillCredentials("Employee", "Employee@123")
                            }
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 600 }}
                            >
                                👤 Login as Employee
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                Username: Employee | Password: Employee@123
                            </Typography>
                        </RoleButton>

                        <RoleButton
                            onClick={() =>
                                fillCredentials("Manager", "Manager@123")
                            }
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 600 }}
                            >
                                👔 Login as Manager
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                Username: Manager | Password: Manager@123
                            </Typography>
                        </RoleButton>

                        <RoleButton
                            onClick={() =>
                                fillCredentials("Admin", "Admin@123")
                            }
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 600 }}
                            >
                                ⚡ Login as Admin
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                Username: Admin | Password: Admin@123
                            </Typography>
                        </RoleButton>
                    </DemoCard>

                    {/* Login Form Card */}
                    <GlassCard
                        sx={{
                            flex: { xs: "1", md: "0 0 400px" },
                            order: { xs: 1, md: 2 },
                            alignSelf: { xs: "stretch", md: "flex-start" },
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <Avatar
                                sx={{
                                    m: 1,
                                    bgcolor: "rgba(255, 255, 255, 0.2)",
                                    width: 64,
                                    height: 64,
                                    mb: 2,
                                }}
                            >
                                <PersonIcon
                                    sx={{ fontSize: 32, color: "white" }}
                                />
                            </Avatar>

                            <Typography
                                component="h1"
                                variant="h4"
                                sx={{
                                    color: "white",
                                    fontWeight: 700,
                                    mb: 1,
                                    textAlign: "center",
                                }}
                            >
                                HR Portal
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    color: "rgba(255, 255, 255, 0.8)",
                                    mb: 3,
                                    textAlign: "center",
                                }}
                            >
                                Welcome back! Please sign in to continue
                            </Typography>

                            <Box
                                component="form"
                                noValidate
                                onSubmit={handleSubmit}
                                sx={{ width: "100%" }}
                            >
                                <div className="mb-4 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <PersonIcon
                                            sx={{
                                                color: "rgba(255, 255, 255, 0.6)",
                                                fontSize: 20,
                                            }}
                                        />
                                    </div>
                                    <input
                                        required
                                        id="email"
                                        name="email"
                                        type="text"
                                        autoComplete="email"
                                        autoFocus
                                        placeholder="Username"
                                        className="w-full h-10 pl-10 pr-3 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/50 hover:bg-white/25 transition-all duration-200"
                                    />
                                </div>

                                <div className="mb-4 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LockIcon
                                            sx={{
                                                color: "rgba(255, 255, 255, 0.6)",
                                                fontSize: 20,
                                            }}
                                        />
                                    </div>
                                    <input
                                        required
                                        name="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        id="password"
                                        autoComplete="current-password"
                                        placeholder="Password"
                                        className="w-full h-10 pl-10 pr-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/50 hover:bg-white/25 transition-all duration-200"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={
                                                handleMouseDownPassword
                                            }
                                            size="small"
                                            sx={{
                                                color: "rgba(255, 255, 255, 0.6)",
                                            }}
                                        >
                                            {showPassword ? (
                                                <VisibilityOff
                                                    sx={{ fontSize: 18 }}
                                                />
                                            ) : (
                                                <Visibility
                                                    sx={{ fontSize: 18 }}
                                                />
                                            )}
                                        </IconButton>
                                    </div>
                                </div>

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            value="remember"
                                            sx={{
                                                color: "rgba(255, 255, 255, 0.6)",
                                                "&.Mui-checked": {
                                                    color: "white",
                                                },
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography
                                            sx={{
                                                color: "rgba(255, 255, 255, 0.8)",
                                            }}
                                        >
                                            Remember me
                                        </Typography>
                                    }
                                    sx={{ mb: 2 }}
                                />

                                <button
                                    type="submit"
                                    className="w-full h-10 mb-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50"
                                >
                                    Sign In
                                </button>

                                <Box sx={{ textAlign: "center" }}>
                                    <Link
                                        href="#"
                                        variant="body2"
                                        sx={{
                                            color: "rgba(255, 255, 255, 0.8)",
                                            textDecoration: "none",
                                            "&:hover": {
                                                color: "white",
                                                textDecoration: "underline",
                                            },
                                        }}
                                    >
                                        Forgot password?
                                    </Link>
                                </Box>
                            </Box>
                        </Box>

                        <Copyright />
                    </GlassCard>
                </Box>
            </Container>
        </GradientBackground>
    );
}
