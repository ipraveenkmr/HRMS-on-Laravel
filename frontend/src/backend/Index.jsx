import React, { useEffect, useState, useCallback, useMemo } from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  Drawer as MuiDrawer,
  AppBar as MuiAppBar,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Menu,
  Modal,
  Grid,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  AccountCircle,
} from "@mui/icons-material";
import { useNavigate, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Marquee from "react-fast-marquee";

import { navigationConfig } from "./core/config/navigationConfig";
import { componentMap } from "./core/config/componentMap";
import { apiService } from "./core/services/apiService";
import { useStoreSelectors, useStoreActions, useClearStore } from "./hooks/useStoreSelectors";
import {
  DRAWER_WIDTH,
  MODAL_STYLE,
  getUserDisplayName,
  clearLocalStorage
} from "./core/utils/constants";
import EditForm from "./profile/EditForm";
import logo from "../assets/logo.png";
import "./dashboard.css";

// Styled Components
const openedMixin = (theme) => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

// Custom Hooks
const useAuth = () => {
  const navigate = useNavigate();
  const { islogin } = useStoreSelectors();
  const { updateIslogin } = useStoreActions();
  const clearStore = useClearStore();

  const logout = useCallback(() => {
    clearLocalStorage();
    updateIslogin(false);
    clearStore();
    navigate("/");
  }, [navigate, updateIslogin, clearStore]);

  return { islogin, logout };
};

const useNotifications = () => {
  const [notifications, setNotifications] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notificationTitles = await apiService.notificationApi();
        setNotifications(notificationTitles.join(" • "));
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  return notifications;
};

// Components
const UserProfile = ({ emp_name, emp_type, onEditOpen, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleEditClick = () => {
    onEditOpen();
    handleClose();
  };

  const handleLogoutClick = () => {
    onLogout();
    handleClose();
  };

  return (
    <>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleEditClick}>Profile</MenuItem>
        <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
      </Menu>
    </>
  );
};

const NavigationList = ({ emp_type, navigate, open }) => {
  const location = useLocation();
  const config = navigationConfig[emp_type] || [];

  const handleNavigation = (item) => {
    if (item.route) {
      navigate(item.route);
    }
  };

  return (
    <List>
      {config.map((item, index) => (
        <React.Fragment key={item.key || index}>
          {item.divider && <Divider />}
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={() => handleNavigation(item)}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                backgroundColor: location.pathname === item.route ? 'rgba(25, 118, 210, 0.12)' : 'transparent',
                '&:hover': {
                  backgroundColor: location.pathname === item.route ? 'rgba(25, 118, 210, 0.18)' : 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {item.icon ? <item.icon /> : <span>⚠️</span>}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        </React.Fragment>
      ))}
    </List>
  );
};

const MainContent = ({ emp_type }) => {
  const roleRoutes = navigationConfig[emp_type] || [];
  
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }} className="bgcolor">
      <DrawerHeader />
      <Routes>
        {roleRoutes.map((item) => {
          if (item.route && item.menu && componentMap[emp_type]?.[item.menu]) {
            const Component = componentMap[emp_type][item.menu];
            return (
              <Route 
                key={item.route} 
                path={item.route.replace('/backend', '')} 
                element={<Component />} 
              />
            );
          }
          return null;
        })}
        {/* Default redirect to the first route */}
        <Route 
          path="*" 
          element={
            roleRoutes.length > 0 && roleRoutes[0].route ? 
              <Navigate to={roleRoutes[0].route} replace /> :
              <Box sx={{ p: 3 }}>
                <Typography variant="h6">No routes available</Typography>
              </Box>
          } 
        />
      </Routes>
    </Box>
  );
};

// Main Component
const Index = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { islogin, logout } = useAuth();
  const notifications = useNotifications();

  // Local state
  const [open, setOpen] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  // Store state and actions
  const {
    username,
    emp_name,
    emp_type,
    emp_department,
  } = useStoreSelectors();

  // Memoized values
  const userDisplayName = useMemo(
    () => getUserDisplayName(emp_name, emp_type),
    [emp_name, emp_type]
  );

  // Effects
  useEffect(() => {
    if (!islogin) {
      navigate("/");
      return;
    }

    // Initialize common data
    apiService.initializeCommonData();
  }, [islogin, navigate]);

  useEffect(() => {
    if (!emp_type || !islogin) return;

    // Initialize role-specific data and redirect to default route
    apiService.initializeRoleSpecificData(emp_type, emp_department, username);
    
    // Navigate to the first route for the role if not already on a route
    const roleRoutes = navigationConfig[emp_type];
    if (roleRoutes && roleRoutes.length > 0 && roleRoutes[0].route) {
      const currentPath = window.location.hash.replace('#', '');
      if (currentPath === '/backend' || !currentPath.includes(`/backend/${emp_type.toLowerCase()}`)) {
        navigate(roleRoutes[0].route);
      }
    }
  }, [emp_type, islogin, emp_department, username, navigate]);

  // Handlers
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

  if (!islogin) {
    return null;
  }

  return (
    <>
      <Modal
        open={editOpen}
        onClose={handleEditClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflow: "auto" }}
      >
        <Box sx={MODAL_STYLE}>
          <EditForm onClick={handleEditClose} eventid={username} />
        </Box>
      </Modal>

      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" component="div" sx={{ flexGrow: 2 }}>
              <span className="logo">
                <img src={logo} alt="CDOT Logo" height={30} />
              </span>
            </Typography>

            <Marquee speed={40}>{notifications}</Marquee>

            <UserProfile
              emp_name={emp_name}
              emp_type={emp_type}
              onEditOpen={handleEditOpen}
              onLogout={logout}
            />
          </Toolbar>
        </AppBar>

        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <Grid container justify="flex-start">
              <span className="text-sm ml-4 font-semibold">
                {userDisplayName}
              </span>
            </Grid>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>

          <NavigationList
            emp_type={emp_type}
            navigate={navigate}
            open={open}
          />
        </Drawer>

        <MainContent emp_type={emp_type} />
      </Box>
    </>
  );
};

export default Index;