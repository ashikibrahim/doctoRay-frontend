import React from "react";
import { useState } from "react";
import {
  AppBar,
  Button,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Badge,
} from "@mui/material";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import DrawerComp from "./DrawerComp";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import axios from "axios";
import { setUser } from "../redux/userSlice";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { BaseUrl } from "../Utils/BaseUrl";

// const PAGES = ["HOME", "APPOINTMENTS", "APPLY-DOCTOR", "PROFILE"];

const Header = () => {
  const [value, setValue] = useState();
  const [userInfo, setUserInfo] = useState(null);
  const theme = useTheme();
  console.log(theme);
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  const getUser = async () => {
    try {
      dispatch(showLoading());
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${BaseUrl}/api/users/get-user-info-by-id`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(hideLoading());
      if (response.data.success) {
        const userData = response.data.data;

        if (userData.isBlock === "block") {
          localStorage.clear();
          toast.error("your account has been  blocked");
        } else {
          dispatch(setUser(response.data.data));
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    if (!userInfo) {
      getUser();
    }
  }, [userInfo]);

  const onLogout = () => {
    dispatch(setUser(null));
    localStorage.clear();
    navigate("/");
  };

  const userMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line",
      value: "one",
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: "ri-file-list-line",
      value: "two",
    },
    {
      name: "Apply-doctor",
      path: "/apply-doctor",
      icon: "ri-hospital-line",
      value: "three",
    },
    {
      name: "Profile",
      path: "/Profile",
      icon: "ri-user-line",
      value: "four",
    },
  ];

  const doctorMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      name: "Appointments",
      path: "/doctor/appointments",
      icon: "ri-file-list-line",
    },
    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "ri-user-line",
    },
  ];

  const adminMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      name: "Users",
      path: "/admin/userslist",
      icon: "ri-user-line",
    },
    {
      name: "Doctors",
      path: "/admin/doctorslist",
      icon: "ri-user-star-line",
    },
    {
      name: "Profile",
      path: "/profile",
      icon: "ri-user-line",
    },
  ];

  const menuToBeRendered = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : userMenu;

  return (
    <React.Fragment>
      <AppBar sx={{ background: "#ffff" }}>
        <Toolbar>
          {isMatch ? (
            <>
              <Typography
                sx={{ fontSize: "1.5rem", marginLeft: "10%", color: "#1976D2" }}
              >
                doctoRay
              </Typography>
              <DrawerComp />
            </>
          ) : (
            <>
              <VaccinesIcon sx={{ color: "#1976D2", width: "100px" }} />
              <Tabs
                sx={{ marginLeft: "100px", color: "#1976D2" }}
                textColor="#14bef0"
                value={value}
                onChange={(e, value) => setValue(value)}
                // indicatorColor="secondary"
              >
                {menuToBeRendered.map((menu) => (
                  <Tab
                    value={menu.value}
                    label={menu.name}
                    onClick={() => navigate(menu.path)}
                    sx={{ margin: "auto" }}
                  />
                ))}

                <Tab value="one" label="" />
              </Tabs>

              {user ? (
                <>
                  <Button
                    sx={{ marginLeft: "auto", marginRight: "10px" }}
                    variant="contained"
                    onClick={onLogout}
                  >
                    Logout
                  </Button>
                  <Badge
                    badgeContent={user?.unseenNotifications.length}
                    color="error"
                    onClick={() => navigate("/notifications")}
                  >
                    <NotificationsIcon sx={{ color: "#1976D2" }} />
                  </Badge>
                  <Link to="/Profile">
                    <Typography sx={{ color: "1976D2", marginLeft: "10px" }}>
                      {user?.name}
                    </Typography>
                  </Link>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => navigate("/login")}
                    sx={{ marginLeft: "auto" }}
                    variant="contained"
                  >
                    Login
                  </Button>

                  <Button
                    onClick={() => navigate("/register")}
                    sx={{ marginLeft: "10px", marginRight: "10px" }}
                    variant="contained"
                  >
                    Signup
                  </Button>
                </>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default Header;
