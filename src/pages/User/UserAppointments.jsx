import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Table } from "antd";
import moment from "moment";
import Header from "../../components/Header";
import { BaseUrl } from "../../Utils/BaseUrl";

function UserAppointments() {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();

  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        `${BaseUrl}/api/users/get-appointments-by-user-id`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.doctorInfo.firstName} {record.doctorInfo.lastName}
        </span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      render: (text, record) => <span>{record.doctorInfo.phoneNumber}</span>,
    },
    {
      title: "date & time",
      dataIndex: "dateAndtime",
      render: (text, record) => <span>{record.dateAndtime}</span>,
    },

    {
      title: "status",
      dataIndex: "status",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "Pending" && (
            <h6 style={{ color: "red" }}>pending</h6>
          )}
          {record.status === "Approved" && (
            <h6 style={{ color: "green" }}>Approved</h6>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    getAppointmentsData();
  }, []);

  return (
    <>
      <Header />
      <div className="container" style={{ marginTop: "80px" }}>
        <h1 className="page-title">Appointments</h1>
        <hr />
        <Table columns={columns} dataSource={appointments} />
      </div>
    </>
  );
}
export default UserAppointments;
