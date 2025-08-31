import { useEffect, useState } from "react";
import {
  TextField,
  Box,
  Typography,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  LinearProgress,
  Alert
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "@mui/material/Button";
import axios from "axios";
import { usecdotStore } from "../../components/cdotStore";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

export default function Username({ closeform }) {
  const updateUsernamelist = usecdotStore((state) => state.updateUsernamelist);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(null);

  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => { }, []);

  // Password strength calculator
  const calculatePasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (/[a-z]/.test(pwd)) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 25;
    return Math.min(strength, 100);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return 'error';
    if (passwordStrength < 50) return 'warning';
    if (passwordStrength < 75) return 'info';
    return 'success';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Weak';
    if (passwordStrength < 50) return 'Fair';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  const handleUpdateUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleUpdatePassword = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));

    // Check password match if confirm password exists
    if (confirmpassword) {
      setPasswordMatch(newPassword === confirmpassword);
    }
  };

  const handleUpdateConfirmPassword = (event) => {
    const confirmPwd = event.target.value;
    setConfirmPassword(confirmPwd);
    setPasswordMatch(password === confirmPwd);
  };

  const handleConfirmPassword = (event) => {
    const confirmPwd = event.target.value;
    setConfirmPassword(confirmPwd);
    setPasswordMatch(password === confirmPwd);

    if (password !== confirmPwd && confirmPwd.length > 0) {
      alertpasswordmismatch();
    }
  };

  const handleCreateUser = async () => {
    if (!username.trim()) {
      toast.error("Username is required!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }

    if (password === confirmpassword) {
      setIsLoading(true);
      try {
        const response = await axios.post(baseURL + "auth/signup/", {
          username: username,
          password: password,
        });

        if (response.status === 201) {
          alertuser();
          closeform();
        } else if (response.status === 200) {
          alertusercreated();
          usersApi();
          closeform();
        }
      } catch (error) {
        console.log("Error creating user:", error);
        toast.error("Error: Failed to create user. Please try again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      alertpasswordmismatch();
    }
  };

  const alertuser = () => {
    toast.error("Username already exists! Please choose a different username.", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
    });
  };

  const alertpasswordmismatch = () => {
    toast.error("Passwords don't match. Please check and try again.", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
    });
  };

  const alertusercreated = () => {
    toast.success("User created successfully!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
    });
  };

  const usersApi = async () => {
    try {
      const response = await axios.get(baseURL + "users/");
      updateUsernamelist(response.data);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  const isFormValid = username.trim() && password.length >= 6 && passwordMatch;

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '32px',
        width: '100%',
        maxWidth: '420px',
        margin: '0 auto',
        position: 'relative',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e0e0e0'
      }}
    >
      {/* Close Button */}
      <Box
        onClick={closeform}
        sx={{
          position: "absolute",
          top: '16px',
          right: '16px',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#e0e0e0',
          },
          transition: 'all 0.2s ease'
        }}
      >
        <CloseIcon
          sx={{
            color: '#666',
            fontSize: '20px'
          }}
        />
      </Box>

      {/* Header */}
      <Typography
        variant="h5"
        component="h1"
        align="center"
        gutterBottom
        sx={{
          color: '#333',
          fontWeight: 'bold',
          marginBottom: '32px',
          fontSize: '1.5rem'
        }}
      >
        Create New User
      </Typography>

      {/* Form */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            size="small"
            value={username}
            onChange={handleUpdateUsername}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: '#666' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#fafafa',
                '& fieldset': {
                  borderColor: '#e0e0e0',
                },
                '&:hover fieldset': {
                  borderColor: '#bdbdbd',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#666',
                '&.Mui-focused': {
                  color: '#1976d2',
                },
              },
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined">
            <InputLabel
              htmlFor="outlined-adornment-password"
              sx={{
                color: '#666',
                '&.Mui-focused': { color: '#1976d2' }
              }}
            >
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              size="small"
              value={password}
              onChange={handleUpdatePassword}
              startAdornment={
                <InputAdornment position="start">
                  <LockIcon sx={{ color: '#666' }} />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{ color: '#666' }}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              sx={{
                backgroundColor: '#fafafa',
                '& fieldset': {
                  borderColor: '#e0e0e0',
                },
                '&:hover fieldset': {
                  borderColor: '#bdbdbd',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2',
                },
              }}
            />
          </FormControl>

          {password && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Password Strength: {getPasswordStrengthText()}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={passwordStrength}
                color={getPasswordStrengthColor()}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: '#e0e0e0',
                }}
              />
            </Box>
          )}
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined">
            <InputLabel
              htmlFor="outlined-adornment-confirm-password"
              sx={{
                color: '#666',
                '&.Mui-focused': { color: '#1976d2' }
              }}
            >
              Confirm Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              size="small"
              value={confirmpassword}
              onChange={handleUpdateConfirmPassword}
              onBlur={handleConfirmPassword}
              startAdornment={
                <InputAdornment position="start">
                  <LockIcon sx={{ color: '#666' }} />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {confirmpassword && (
                      passwordMatch ? (
                        <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                      ) : (
                        <ErrorIcon sx={{ color: '#f44336', fontSize: 20 }} />
                      )
                    )}
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      sx={{ color: '#666' }}
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </Box>
                </InputAdornment>
              }
              label="Confirm Password"
              sx={{
                backgroundColor: '#fafafa',
                '& fieldset': {
                  borderColor: '#e0e0e0',
                },
                '&:hover fieldset': {
                  borderColor: '#bdbdbd',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2',
                },
              }}
            />
          </FormControl>
        </Grid>

        {confirmpassword && !passwordMatch && (
          <Grid item xs={12}>
            <Alert
              severity="error"
              sx={{
                backgroundColor: '#ffebee',
                color: '#c62828'
              }}
            >
              Passwords do not match
            </Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            size="small"
            onClick={handleCreateUser}
            disabled={!isFormValid || isLoading}
            sx={{
              py: 0.75,
              px: 3,
              fontSize: '0.875rem',
              fontWeight: '600',
              backgroundColor: '#1976d2',
              color: 'white',
              borderRadius: '6px',
              textTransform: 'none',
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
              display: 'block',
              margin: '0 auto',
              '&:hover': {
                backgroundColor: '#1565c0',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
              },
              '&:disabled': {
                backgroundColor: '#bdbdbd',
                color: '#fff',
                boxShadow: 'none',
              },
            }}
          >
            {isLoading ? 'Creating User...' : 'Create User'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}