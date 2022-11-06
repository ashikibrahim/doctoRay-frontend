import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input } from "antd";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { BaseUrl } from "../Utils/BaseUrl";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      console.log(values, "values login page");
      const response = await axios.post(`${BaseUrl}/api/users/login`, values);

      dispatch(hideLoading());
      if (response.data.Success) {
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.data);
        // dispatch(setUser(response.data.data))
        navigate("/");
      } else {
        toast.error("login error");
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="outerdiv">
      <div className="authentication">
        <div className="authentication-form card p-3">
          <h1 className="card-title">doctoRay</h1>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item label="Email" name="email">
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item label="Password" name="password">
              <Input placeholder="Password" type="password" />
            </Form.Item>
            <Button
              className="primary-button my-2 full-width-button"
              htmlType="submit"
            >
              LOGIN
            </Button>

            <Link to="/register" className="anchor mt-2">
              CLICK HERE TO REGISTER
            </Link>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
