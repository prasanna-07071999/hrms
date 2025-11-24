import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import EmployeeForm from "../components/EmployeeForm";

const Employees = () => {
    const history = useHistory();
    const [employees, setEmployees] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const token = localStorage.getItem("jwt");

    const fetchEmployees = useCallback(async () => {
        try {
        const url = "http://localhost:5000/api/employees";
        const options = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const response = await fetch(url, options);
        const data = await response.json();
        if (!response.ok) {
            setErrorMsg(data.message || "Failed to load employees");
            return;
        }
        setEmployees(data);
        } catch (error) {
        setErrorMsg("Something went wrong");
        }
    }, [token]);

    useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

    const handleAddClick = () => {
        setSelectedEmployee(null);
        setShowForm(true);
    };

    const handleEditClick = (emp) => {
        setSelectedEmployee(emp);
        setShowForm(true);
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        fetchEmployees();
        setSuccessMsg("Saved successfully!");
    };

    const handleLogout = () => {
        localStorage.removeItem("jwt");
        history.push("/login");
    };

    return (
        <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h1>Employees</h1>
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        <button className="btn btn-primary mb-3" onClick={handleAddClick}>
            Add Employee
        </button>
        <div className="card p-3 shadow">
            <table className="table table-bordered">
            <thead className="table-light">
                <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th style={{ width: "120px" }}>Action</th>
                </tr>
            </thead>
            <tbody>
                {employees.map((emp) => (
                <tr key={emp.id}>
                    <td>{emp.id}</td>
                    <td>{emp.first_name} {emp.last_name}</td>
                    <td>{emp.email}</td>
                    <td>{emp.phone}</td>
                    <td>
                    <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleEditClick(emp)}
                    >
                        Edit
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        {showForm && (
            <EmployeeForm
            selectedEmployee={selectedEmployee}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
            />
        )}
        </div>
    );
};

export default Employees