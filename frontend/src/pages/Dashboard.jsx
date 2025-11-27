import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const Dashboard = () => {
    const history = useHistory();
    const token = localStorage.getItem("jwt");

    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalTeams: 0,
        totalAdmins: 0
    });

    let isAdmin = false;

    if (token) {
        try {
            const decoded = JSON.parse(atob(token.split(".")[1]));
            isAdmin = decoded.isAdmin;
        } catch {}
    }

    useEffect(() => {
        fetch("http://localhost:5000/api/stats/summary")
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error("Failed to load stats:", err));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("jwt");
        history.push("/login");
    };

    if (!token) {
        history.push("/login");
        return null;
    }

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
                    width: "500px",
                    background: "#ffffffcc",
                    backdropFilter: "blur(10px)"
                }}
            >
                <h2 className="text-center mb-4 fw-bold">Dashboard</h2>

                <div className="mb-4">
                    <h5>Total Employees: {stats.totalEmployees}</h5>
                    <h5>Total Teams: {stats.totalTeams}</h5>
                    <h5>Total Admins: {stats.totalAdmins}</h5>
                </div>

                <button className="btn btn-primary w-100 mb-3" onClick={() => history.push("/employees")}>
                    Manage Employees
                </button>

                <button className="btn btn-dark w-100 mb-3" onClick={() => history.push("/teams")}>
                    Manage Teams
                </button>

                {isAdmin && (
                    <button className="btn btn-warning w-100 mb-3" onClick={() => history.push("/logs")}>
                        View Logs
                    </button>
                )}

                <button className="btn btn-danger w-100" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
