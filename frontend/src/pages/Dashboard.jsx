import React from "react";

import { useHistory } from "react-router-dom";

const Dashboard = () => {
    const history = useHistory();
    const token = localStorage.getItem("jwt");

    let isAdmin = false;

    if (token) {
        try {
            const decoded = JSON.parse(atob(token.split(".")[1]));
            isAdmin = decoded.isAdmin;
        } catch (err) {
            console.error("Token decode failed:", err);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("jwt");
        history.push("/login");
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #6A82FB, #FC5C7D)"
            }}
        >
            <div
                className="card shadow-lg p-4"
                style={{
                    borderRadius: "20px",
                    width: "450px",
                    background: "#ffffffcc",
                    backdropFilter: "blur(10px)"
                }}
            >
                <h2 className="text-center mb-4 fw-bold" style={{ color: "#333" }}>
                    <i className="bi bi-speedometer2 me-2"></i>
                    Dashboard
                </h2>

                {!token && (
                    <div className="alert alert-danger text-center">
                        Please login again!
                    </div>
                )}

                <button
                    className="btn btn-primary w-100 mb-3 py-2"
                    style={{ fontSize: "18px", borderRadius: "10px" }}
                    onClick={() => history.push("/employees")}
                >
                    <i className="bi bi-people-fill me-2"></i>
                    Manage Employees
                </button>

                <button
                    className="btn btn-dark w-100 mb-3 py-2"
                    style={{ fontSize: "18px", borderRadius: "10px" }}
                    onClick={() => history.push("/teams")}
                >
                    <i className="bi bi-collection me-2"></i>
                    Manage Teams
                </button>

                {isAdmin && (
                    <button
                        className="btn btn-warning w-100 mb-3 py-2"
                        style={{ fontSize: "18px", borderRadius: "10px" }}
                        onClick={() => history.push("/logs")}
                    >
                        <i className="bi bi-journal-text me-2"></i>
                        View System Logs
                    </button>
                )}

                <button
                    className="btn btn-danger w-100 py-2"
                    style={{ fontSize: "18px", borderRadius: "10px" }}
                    onClick={handleLogout}
                >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;