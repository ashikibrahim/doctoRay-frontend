import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Table } from "antd";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertsSlice";
import axios from "axios";
import toast from "react-hot-toast";
import Header from "../../components/Header";
import Button from "react-bootstrap/Button";
import moment from "moment";
import { BaseUrl } from "../../Utils/BaseUrl";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();
  const params = useParams();

  const getAppointments = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        `${BaseUrl}/api/doctor/get-doctor-appoitments`,
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

  const changeAppointmentStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `${BaseUrl}/api/doctor/change-appointment-status`,
        {
          appointmentId: record._id,
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        getAppointments();
      }
    } catch (error) {
      toast.error("Error changing doctor account status");
      dispatch(hideLoading());
    }
  };

  const columns = [
    {
      title: "Patient Name",
      dataIndex: "name",
      render: (text, record) => <span>{record.patientname}</span>,
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      render: (text, record) => <span>{record.doctorInfo.phoneNumber}</span>,
    },

    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (record, text) => moment(record.createdAt).format("DD-MM-YYYY"),
    },
    {
      title: "status",
      dataIndex: "status",
    },
    {
      title: "actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "Pending" && (
            <h1
              className="anchor"
              onClick={() => changeAppointmentStatus(record, "Approved")}
            >
              <Button variant="success">Approve</Button>
            </h1>
          )}
          {record.status === "Approved" && (
            <h1
              className="anchor"
              onClick={() => changeAppointmentStatus(record, "Rejected")}
            >
              <Button variant="danger">rejected</Button>
            </h1>
          )}
          {record.status === "Rejected" && (
            <h1
              className="anchor"
              onClick={() => changeAppointmentStatus(record, "Approved")}
            >
              <Button variant="success">Approve</Button>
            </h1>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    getAppointments();
  }, []);

  return (
    <>
      <div className="container">
        <Header />
        <div style={{ paddingTop: "40px" }}>
          <h1 className="page-header mt-5">Appointments</h1>
          <hr />
          <Table columns={columns} dataSource={appointments} />
        </div>
      </div>
    </>
  );
}

export default Appointments;
