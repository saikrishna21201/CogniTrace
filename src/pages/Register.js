import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    school10: "",
    percent10: "",
    college12: "",
    percent12: "",
    passoutYear: "",
    currentPercent: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔥 OTP BYPASSED
  const sendOtp = () => {
    alert("OTP verified (bypassed).");
  };

  // 🔥 REGISTER BYPASSED
  const register = (e) => {
    e.preventDefault();
    alert("Registered Successfully!");
    navigate("/login"); // or "/dashboard"
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  return (
    <div className="register-page-center-bg">
      <div className="register-centered-card">
        <div className="register-image-container">
          <img
            src="/regsrc.png"
            alt="Registration Illustration"
            className="register-image"
          />
        </div>

        <div className="register-form-panel">
          <h2 className="register-title">Register</h2>

          <form className="register-form-scrollable" onSubmit={register}>
            <div className="form-group">
              <label className="input-label">Full Name</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label className="input-label">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="button-container">
              <button
                type="button"
                className="action-button"
                onClick={sendOtp}
              >
                Send OTP
              </button>
            </div>

            <div className="form-group">
              <label className="input-label">Mobile Number</label>
              <input
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Enter 10-digit mobile number"
              />
            </div>

            <div className="form-group">
              <label className="input-label">10th School Name</label>
              <input
                name="school10"
                value={form.school10}
                onChange={handleChange}
                placeholder="Enter your 10th school name"
              />
            </div>

            <div className="form-group">
              <label className="input-label">10th Percentage</label>
              <input
                type="number"
                name="percent10"
                value={form.percent10}
                onChange={handleChange}
                placeholder="0 - 100"
              />
            </div>

            <div className="form-group">
              <label className="input-label">
                Intermediate/Diploma College Name
              </label>
              <input
                name="college12"
                value={form.college12}
                onChange={handleChange}
                placeholder="Enter your college name"
              />
            </div>

            <div className="form-group">
              <label className="input-label">
                Intermediate/Diploma Percentage
              </label>
              <input
                type="number"
                name="percent12"
                value={form.percent12}
                onChange={handleChange}
                placeholder="0 - 100"
              />
            </div>

            <div className="form-group">
              <label className="input-label">Year of Passout</label>
              <select
                name="passoutYear"
                value={form.passoutYear}
                onChange={handleChange}
                className="custom-dropdown"
              >
                <option value="">Select Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="input-label">Current Percentage</label>
              <input
                type="number"
                name="currentPercent"
                value={form.currentPercent}
                onChange={handleChange}
                placeholder="0 - 100"
              />
            </div>

            <div className="form-group">
              <label className="input-label">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
              />
            </div>

            <div className="form-group">
              <label className="input-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
              />
            </div>

            <div className="button-container">
              <button className="action-button" type="submit">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
