import React from "react";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import DoctorCard from "../components/DoctorCard";
import DoctorCarousel from "../components/DoctorCarousel";
import axios from "axios";
import { Col, Row } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { BaseUrl } from "../Utils/BaseUrl";

function Home() {
  const [doctors, setDoctors] = useState([]);
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        `${BaseUrl}/api/users/get-all-approved-doctors`
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="mainhome">
        <Header />
        {user?.isAdmin ? (
          <Header />
        ) : user?.isDoctor ? (
          <Header />
        ) : (
          <>
            <Header />
            <div style={{ paddingTop: "65px" }}>
              <DoctorCarousel />
            </div>
            <div className="container homesearch">
                <div className="search-div">
                  <input type="" className="search-box" placeholder="Search..." onChange={(e)=>setQuery(e.target.value)}></input>
                </div>
              </div>

            <div
              className="container"
              style={{ paddingTop: "100px", paddingBottom: "10px" }}
            >
              <Row gutter={[30, 40]}>
                {doctors.map((doctor) => (
                  <Col span={6} xs={24} sm={12} md={12} lg={8} xl={8}>
                    <DoctorCard doctor1={doctor} />
                  </Col>
                ))}
              </Row>
              {/* <Row gutter={[30, 40]}>
                  
                  {doctors.filter((doctor) =>
                  doctor.specialization.toLowerCase().includes(query) || doctor.firstName.toLowerCase().includes(query) 
                  ).map((doctor) => (
                    <Col span={6} xs={24} sm={12} md={12} lg={8} xl={8}>
                      <DoctorCard doctor1={doctor} />
                    </Col>
                  ))}
                  
                </Row> */}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Home;
