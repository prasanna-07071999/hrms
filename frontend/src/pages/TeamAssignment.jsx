  import React, { useEffect, useState, useCallback } from "react";
  import BackButton from "../components/BackButton";

  const TeamAssignment = (props) => {
    const teamId = props.match.params.teamId;
    const [employees, setEmployees] = useState([]);
    const [team, setTeam] = useState(null);
    const [selectedAssign, setSelectedAssign] = useState([]);
    const [selectedUnassign, setSelectedUnassign] = useState([]);
    const token = localStorage.getItem("jwt");

    const fetchEmployees = useCallback(async () => {
      const response = await fetch("http://localhost:5000/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setEmployees(data);
    }, [token]);

    const fetchTeamDetails = useCallback(async () => {
      const response = await fetch(`http://localhost:5000/api/teams/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setTeam(data);
    }, [teamId, token]);

    useEffect(() => {
      fetchEmployees();
      fetchTeamDetails();
    }, [fetchEmployees, fetchTeamDetails]);

    const handleAssign = async () => {
      if (selectedAssign.length === 0) {
        alert("Select employee(s) to assign.");
        return;
      }
      await fetch(`http://localhost:5000/api/teams/${teamId}/assign`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeeIds: selectedAssign }),
      });
      setSelectedAssign([]);
      fetchTeamDetails();
    };

    const handleUnassign = async () => {
      if (selectedUnassign.length === 0) {
        alert("Select an employee to unassign.");
        return;
      }
      await fetch(`http://localhost:5000/api/teams/${teamId}/unassign`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeeId: selectedUnassign[0] }),
      });
      setSelectedUnassign([]);
      fetchTeamDetails();
    };

    if (!team) {
      return <div className="container mt-4">Loading team...</div>;
    }

    const assignedIds = team.employees ? team.employees.map((e) => e.id) : [];

    return (
      <div className="container mt-4">
        <h2 className="mb-3">Assign Employees to: {team.name}</h2>
        <div className="mb-3 d-flex flex-row justify-content-between">
          <div className="mb-3">
            <button
              className="btn btn-primary me-2"
              onClick={() => props.history.push("/employees")}
            >
              Employees
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => props.history.push("/teams")}
            >
              Teams
            </button>
          </div>
          <div>
            <BackButton />
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-6">
            <h4>Available Employees</h4>
            <div className="border p-3" style={{ minHeight: "250px" }}>
              {employees
                .filter((e) => !assignedIds.includes(e.id))
                .map((emp) => (
                  <div className="form-check" key={emp.id}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedAssign.includes(emp.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAssign([...selectedAssign, emp.id]);
                        } else {
                          setSelectedAssign(
                            selectedAssign.filter((id) => id !== emp.id)
                          );
                        }
                      }}
                    />
                    <label className="form-check-label">
                      {emp.first_name} {emp.last_name} ({emp.email})
                    </label>
                  </div>
                ))}
            </div>
            <button onClick={handleAssign} className="btn btn-success mt-3">
              Assign Selected
            </button>
          </div>
          <div className="col-md-6">
            <h4>Assigned Employees</h4>
            <div className="border p-3" style={{ minHeight: "250px" }}>
              {team.employees && team.employees.length === 0 && <p>No employees assigned.</p>}
              {team.employees &&
                team.employees.map((emp) => (
                  <div className="form-check" key={emp.id}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedUnassign.includes(emp.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUnassign([emp.id]);
                        } else {
                          setSelectedUnassign([]);
                        }
                      }}
                    />
                    <label className="form-check-label">
                      {emp.first_name} {emp.last_name} ({emp.email})
                    </label>
                  </div>
                ))}
            </div>
            <button onClick={handleUnassign} className="btn btn-danger mt-3">
              Unassign Selected
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default TeamAssignment;