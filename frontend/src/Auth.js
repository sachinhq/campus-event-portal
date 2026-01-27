import React, { useState } from "react";
import "./App.css";

function Auth({ setUser }) {
    const [isSignup, setIsSignup] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "student"
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submit = async (e) => {
        e.preventDefault();

        const url = isSignup
            ? "http://localhost:3001/api/auth/signup"
            : "http://localhost:3001/api/auth/login";

        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        const data = await res.json();

        if (!isSignup) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("name", data.name);
            setUser(data);
        } else {
            alert("Signup successful. Please login.");
            setIsSignup(false);
        }
    };

    return (
        <div className="role-screen">
            <h1>CampusBuzz</h1>
            <form onSubmit={submit}>
                {isSignup && (
                    <input
                        name="name"
                        placeholder="Name"
                        onChange={handleChange}
                        required
                    />
                )}

                <input
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                />

                {isSignup && (
                    <select name="role" onChange={handleChange}>
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                    </select>
                )}

                <button type="submit">
                    {isSignup ? "Signup" : "Login"}
                </button>
            </form>

            <p onClick={() => setIsSignup(!isSignup)}>
                {isSignup ? "Already have an account? Login" : "Create new account"}
            </p>
        </div>
    );
}

export default Auth;
