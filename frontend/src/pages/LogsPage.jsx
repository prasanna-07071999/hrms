import React, { useEffect, useState } from "react";

const LogsPage = () => {
    const [logs, setLogs] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("jwt");
            const response = await fetch("http://localhost:5000/api/logs", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });
            if (!response.ok) {
            setErrorMsg("Failed to fetch logs. Unauthorized or server error.");
            setLogs([]);
            setLoading(false);
            return;
            }
            const data = await response.json();
            const logData = Array.isArray(data) ? data : data.logs || [];
            setLogs(logData);
        } catch (error) {
            setErrorMsg("Something went wrong loading logs.");
            setLogs([]);
        }
        setLoading(false);
        };

        fetchLogs();
    }, []);

    if (loading) {
        return (
        <div className="container mt-4">
            <span>Loading logs...</span>
        </div>
        );
    }

    return (
        <div className="container mt-4">
        <h2>System Logs</h2>
        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
        <table className="table table-bordered mt-3">
            <thead>
            <tr>
                <th>ID</th>
                <th>User</th>
                <th>Organisation</th>
                <th>Action</th>
                <th>Route</th>
                <th>Method</th>
                <th>Status</th>
                <th>IP</th>
                <th>User-Agent</th>
                <th>Created At</th>
            </tr>
            </thead>
            <tbody>
            {logs.length === 0 ? (
                <tr>
                <td colSpan="10" className="text-center">
                    No logs found.
                </td>
                </tr>
            ) : (
                logs.map((log) => (
                <tr key={log.id}>
                    <td>{log.id}</td>
                    <td>{log.userId || log.user_name || log.user_email || ""}</td>
                    <td>{log.organisationId || log.organisation_id || ""}</td>
                    <td>{log.action}</td>
                    <td>{log.route || log.path || ""}</td>
                    <td>{log.method}</td>
                    <td>{log.status}</td>
                    <td>{log.ip}</td>
                    <td>{log.user_agent || log.userAgent || ""}</td>
                    <td>
                    {log.createdAt
                        ? new Date(log.createdAt).toLocaleString()
                        : log.created_at
                        ? new Date(log.created_at).toLocaleString()
                        : ""}
                    </td>
                </tr>
                ))
            )}
            </tbody>
        </table>
        </div>
    );
};

export default LogsPage;
