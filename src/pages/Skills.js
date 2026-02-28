import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Skills.css";

function Skills() {
    const [skill, setSkill] = useState("");
    const [skills, setSkills] = useState([]);
    const [popupMsg, setPopupMsg] = useState("");
    const navigate = useNavigate();
    const fileInputRefs = useRef({});

    // Tokens
    const getAccessToken = () => localStorage.getItem("access");
    const getRefreshToken = () => localStorage.getItem("refresh");

    const refreshAccessToken = async () => {
        const refresh = getRefreshToken();
        if (!refresh) {
            logoutUser();
            throw new Error("No refresh token");
        }

        try {
            const res = await axios.post("http://localhost:8000/token/refresh/", { refresh });
            localStorage.setItem("access", res.data.access);
            return res.data.access;
        } catch (err) {
            logoutUser();
            throw err;
        }
    };

    const logoutUser = () => {
        localStorage.clear();
        navigate("/login");
    };

    const apiCallWithRefresh = async (axiosRequest) => {
        try {
            return await axiosRequest();
        } catch (error) {
            if (error.response && error.response.status === 401) {
                const newToken = await refreshAccessToken();
                return await axiosRequest(newToken);
            }
            throw error;
        }
    };

    // Fetch skills
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await apiCallWithRefresh((token) =>
                    axios.get("http://localhost:8000/skills/", {
                        headers: { Authorization: `Bearer ${token || getAccessToken()}` },
                    })
                );
                setSkills(response.data);
            } catch (err) {
                console.error("Skill fetch error:", err);
            }
        };
        fetchSkills();
    }, []);

    // Add a skill
    const handleAddSkill = async () => {
        const trimmedSkill = skill.trim();
        if (!trimmedSkill) return;

        try {
            const response = await apiCallWithRefresh((token) =>
                axios.post(
                    "http://localhost:8000/skills/add/",
                    { name: trimmedSkill },
                    { headers: { Authorization: `Bearer ${token || getAccessToken()}` } }
                )
            );

            setSkills((prev) => [...prev, response.data]);
            setSkill("");
        } catch (err) {
            alert(err.response?.data?.error || "Skill could not be added");
        }
    };

    // Remove a skill
    const handleRemoveSkill = async (id) => {
        try {
            await apiCallWithRefresh((token) =>
                axios.delete(`http://localhost:8000/skills/delete/${id}/`, {
                    headers: { Authorization: `Bearer ${token || getAccessToken()}` },
                })
            );

            setSkills((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    // Upload certificate
    const handleFileChange = async (e, skillId) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("verification_file", file);

        try {
            await apiCallWithRefresh((token) =>
                axios.post(
                    `http://localhost:8000/skills/upload/${skillId}/`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token || getAccessToken()}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                )
            );

            setPopupMsg("File uploaded successfully!");
            setTimeout(() => setPopupMsg(""), 2000);

            // Refresh skills
            const response = await axios.get("http://localhost:8000/skills/", {
                headers: { Authorization: `Bearer ${getAccessToken()}` },
            });
            setSkills(response.data);

        } catch (err) {
            alert("File upload failed.");
        }
    };

    const triggerFileUpload = (skillId) => {
        fileInputRefs.current[skillId].value = "";
        fileInputRefs.current[skillId].click();
    };

    const handleVerifySkill = () => {
        navigate("/assessments");
    };

    return (
        <div className="content">
            {popupMsg && <div className="popup-success">{popupMsg}</div>}

            <div className="skills-container">
                <h2 className="skills-title">My Skills</h2>
                <div className="instructions-box">
                    <p><strong>1.</strong> If you do not have a certificate, select <b>Verify</b> to complete the assessment for skill validation.</p>
                    <p><strong>2.</strong> If you already possess a certificate, choose <b>Upload Certificate</b> to submit it for verification.</p>
                    <p><strong>3.</strong> To remove a skill from your profile, use the <b>Remove</b> option.</p>
                </div>

                {/* Add Skill */}
                <div className="input-section">
                    <input
                        type="text"
                        placeholder="Enter a skill (e.g., React, SQL)"
                        value={skill}
                        onChange={(e) => setSkill(e.target.value)}
                        className="skill-input"
                    />
                    <button onClick={handleAddSkill} className="save-btn">Save</button>
                </div>

                {/* Skill Cards */}
                <div className="skills-list">
                    {skills.map((s) => (
                        <div key={s.id} className="skill-card">
                            <span className="skill-name">{s.name}</span>

                            {s.verified ? (
                                <p className="verified-text">🎖️ Verified Skill</p>
                            ) : (
                                <>
                                    {s.certificate && (
                                        <p className="pending-text">
                                            ⏳ Certificate uploaded (Pending verification)
                                        </p>
                                    )}

                                    {!s.certificate && (
                                        <>
                                            <button
                                                onClick={() => triggerFileUpload(s.id)}
                                                className="verify-btn"
                                            >
                                                Upload Certificate
                                            </button>

                                            <input
                                                type="file"
                                                ref={(el) => (fileInputRefs.current[s.id] = el)}
                                                style={{ display: "none" }}
                                                onChange={(e) => handleFileChange(e, s.id)}
                                            />

                                            <button
                                                onClick={handleVerifySkill}
                                                className="verify-btn"
                                            >
                                                Verify
                                            </button>
                                        </>
                                    )}

                                    <button
                                        onClick={() => handleRemoveSkill(s.id)}
                                        className="remove-btn"
                                    >
                                        Remove
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {skills.length === 0 && (
                    <p className="empty-msg">No skills added yet. Add one above.</p>
                )}
            </div>

        </div>
    );
}

export default Skills;
