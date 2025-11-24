import React, { useState } from "react"

import { useHistory } from "react-router-dom"

const RegisterOrg = () => {
    const history = useHistory()

    const [orgName, setOrgName] = useState("")
    const [adminName, setAdminName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMsg, setErrorMsg] = useState("")
    const [successMsg, setSuccessMsg] = useState("")

    const handleRegister = async (event) => {
        event.preventDefault()
        try {
            const url = "http://localhost:5000/api/auth/register"
            const options = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orgName,
                    adminName,
                    email,
                    password,
                }),
            }

            const response = await fetch(url, options)
            const data = await response.json()

            if (!response.ok) {
                setErrorMsg(data.message || "Registration failed")
                return
            }

            localStorage.setItem("jwt", data.token);

            setSuccessMsg("Registration successful! Please Login")
            setTimeout(() => history.push("/login"), 2000)

        } catch (error) {
            setErrorMsg("Something went wrong")
        }
    }

    return (
        <div className="container mt-5" style={{ maxWidth: "550px" }}>
            <h1 className="text-danger text-center pt-5">Human Resourse Management System</h1>
            <div className="card p-4 shadow">
                <h1 className="text-center mb-4">Register Organization</h1>

                {errorMsg && (
                    <div className="alert alert-danger">{errorMsg}</div>
                )}

                {successMsg && (
                    <div className="alert alert-success">{successMsg}</div>
                )}

                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label className="form-label">Organization Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Admin Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={adminName}
                            onChange={(e) => setAdminName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Admin Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Admin Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </div>

                    <button className="btn btn-success w-100" type="submit">
                        Register
                    </button>
                </form>

                <div className="text-center mt-3">
                    <a href="/login">Already have an account? Login</a>
                </div>
            </div>
        </div>
    )
}

export default RegisterOrg
