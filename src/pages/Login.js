import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const [popupMsg, setPopupMsg] = useState("");
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        const access = localStorage.getItem("access");
        if (access) {
            navigate('/home', { replace: true });
        } else {
            setAuthChecked(true);
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // 🔥 LOGIN BYPASSED
    const login = () => {
        if (!form.email) {
            alert("Please enter email");
            return;
        }

        // Fake auth (for demo)
        localStorage.setItem("access", "dummy_access_token");
        localStorage.setItem("refresh", "dummy_refresh_token");
        localStorage.setItem("full_name", "Demo User");
        localStorage.setItem("email", form.email);

        window.dispatchEvent(new Event("storage"));

        setPopupMsg("Logged in successfully!");

        setTimeout(() => {
            setPopupMsg("");
            navigate('/home', { replace: true });
        }, 1200);
    };

    if (!authChecked || popupMsg) {
        return (
            <div className="login-page-bg">
                {popupMsg && <div className="login-popup">{popupMsg}</div>}
            </div>
        );
    }

    return (
        <div className="login-page-bg">
            <div className="login-wrapper">
                <div className="login-image-container">
                    <img
                        src="/logsrc.png"
                        alt="Login Illustration"
                        className="login-image"
                    />
                </div>

                <div className="login-container">
                    <h2 className="login-title">Login</h2>

                    <div className="login-form">
                        <input
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            style={{ marginBottom: '1.5rem' }}
                        />

                        <button
                            onClick={login}
                            style={{
                                backgroundColor: '#1f2937',
                                color: '#fff'
                            }}
                        >
                            Login
                        </button>
                    </div>

                    <p
                        className="forgot-password"
                        onClick={() => navigate('/reset-password')}
                    >
                        Forgot Password?
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
