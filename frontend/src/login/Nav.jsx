import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import logo from "../assets/logo.png"

const drawerWidth = 240;

function Nav(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [navItems, setNavItems] = useState("Register");

  useEffect(() => {
    if (location.pathname == "/register") {
      setNavItems("Login");
    } else {
      setNavItems("Register");
    }
  }, [navItems]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const routeChange = (item) => {
    console.log("Item: " + item);
    if (item === "Login") {
      navigate("/");
    }
    if (item === "Register") {
      navigate("/register");
    }
    if (item === "Login") {
      navigate("/");
    }
    if (item === "Contact") {
      navigate("/contact");
    }
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <span className="logo center">
        <img src={logo} alt="HRMS Logo" height={30} />
      </span>
      <Divider />
      {/* <List>
        <ListItem disablePadding>
          <ListItemButton
            sx={{ textAlign: "center" }}
            onClick={() => {
              routeChange(navItems);
            }}
          >
            <ListItemText primary={navItems} />
          </ListItemButton>
        </ListItem>
      </List> */}
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            <span className="logo">
              <img src={logo} alt="HRMS Logo" height={30} />
            </span>
          </Typography>
          {/* <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Button
              sx={{ color: "#fff" }}
              onClick={() => {
                routeChange(navItems);
              }}
            >
              {navItems}
            </Button>
          </Box> */}
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
      </Box>
    </Box>
  );
}

export default Nav;
