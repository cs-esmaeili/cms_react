import React from "react";
import { useSelector } from 'react-redux';
import config from "../../config.json";

const Dashboard = () => {
    const permission = useSelector(state => state.profile.permissions).includes('dashboard_page');
    if (permission === false) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <div>شما به این قسمت دسترسی ندارید</div>
            </div>
        );
    } else {
        return (
            <div style={{ textAlign: "center" }}>
                <img src={config.logo_url} alt="error" className="img-fluid"/>
                <p className="mt-5">در حال کار هستیم انرژی داشته باشید</p>
            </div>
        );
    }
}

export default Dashboard;
