"use client"

import { useState,useEffect } from "react"
import axios from "axios"
import "./resume-uploader.css"

export default function ResumeUploader() {
  const [file, setFile] = useState(null)
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [emailSending, setEmailSending] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const BASE_URL = import.meta.env.VITE_API_BASE_URL
// const [theme, setTheme] = useState("light");

// useEffect(() => {
//   document.body.setAttribute("data-theme", theme);
//   localStorage.setItem("theme", theme);
// }, [theme]);

// const toggleTheme = () => {
//   setTheme((prev) => (prev === "light" ? "dark" : "light"));
// };


  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("🟢 handleSubmit triggered"); 
  if (!file) return;
  setLoading(true);
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post(`${BASE_URL}/screen`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("✅ Response from backend:", res.data);
    setResponse(res.data);
  } catch (error) {
    console.error("❌ Error uploading file:", error);
    if (error.response) {
      console.error("❌ Backend responded with:", error.response.data);
    } else {
      console.error("❌ Request failed with no response.");
    }
  } finally {
    setLoading(false);
  }
};


  const handleSendEmail = async () => {
    if (!response || !response.email) return
    setEmailSending(true)
    try {
      await axios.post(`${BASE_URL}/send-email`, {
        email: response.email,
        name: response.name,
        status: response.status,
        best_role: response.best_role,
        score: response.final_score,
      })
      alert("Email sent successfully!")
    } catch (error) {
      console.error("Email send error:", error)
      alert("Failed to send email.")
    } finally {
      setEmailSending(false)
    }
  }

  const getStatusColorClass = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
      case "qualified":
        return "status-success"
      case "rejected":
      case "not qualified":
        return "status-danger"
      default:
        return "status-warning"
    }
  }

  const getScoreColorClass = (score) => {
    if (score >= 80) return "score-high"
    if (score >= 60) return "score-medium"
    return "score-low"
  }

  return (
    <div className="app-container">
      {/* <div className="resume-toggle-header">
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div> */}

      <div className="main-content">
        {/* Header */}
        <div className="header-section">
          <div className="header-icon">
            <i className="fas fa-file-alt"></i>
          </div>
          <h1 className="header-title">Resume Screening Platform</h1>
          <p className="header-subtitle">Upload and analyze resumes with AI-powered screening</p>
        </div>

        {/* Upload Section */}
        <div className="card upload-card">
          <div className="card-header">
            <h2 className="card-title">
              <i className="fas fa-upload title-icon"></i>
              Upload Resume
            </h2>
            <p className="card-description">Upload a PDF or DOCX file to begin the screening process</p>
          </div>
          <div className="card-content">
            <form onSubmit={handleSubmit} className="upload-form">
              {/* Drag & Drop Area */}
              <div
                className={`drop-zone ${dragActive ? "drag-active" : ""} ${file ? "file-selected" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input type="file" accept=".pdf,.docx" onChange={handleFileChange} className="file-input" />
                <div className="drop-zone-content">
                  {file ? (
                    <>
                      <i className="fas fa-check-circle drop-zone-icon success"></i>
                      <div className="drop-zone-text">
                        <p className="drop-zone-title success">{file.name}</p>
                        <p className="drop-zone-subtitle success">Ready to analyze</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-upload drop-zone-icon"></i>
                      <div className="drop-zone-text">
                        <p className="drop-zone-title">Drag & drop your resume here</p>
                        <p className="drop-zone-subtitle">or click to browse files</p>
                        <p className="drop-zone-hint">Supports PDF and DOCX files</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <button type="submit" disabled={!file || loading} className="btn btn-primary analyze-button">
                {loading ? (
                  <>
                    <i className="fas fa-spinner button-icon spinning"></i>
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <i className="fas fa-file-alt button-icon"></i>
                    Analyze Resume
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Loading Progress */}
        {loading && (
          <div className="card loading-card">
            <div className="card-content">
              <div className="loading-section">
                <div className="loading-header">
                  <i className="fas fa-spinner loading-icon spinning"></i>
                  <span className="loading-text">Processing your resume...</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "75%" }}></div>
                </div>
                <p className="loading-description">Our AI is analyzing skills, experience, and qualifications</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {response && (
          <div className="results-section">
            {/* Candidate Overview */}
            <div className="card results-card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fas fa-user title-icon"></i>
                  Candidate Profile
                </h2>
              </div>
              <div className="card-content">
                <div className="candidate-grid">
                  <div className="candidate-info-section">
                    <div className="info-item">
                      <label className="info-label">Full Name</label>
                      <p className="info-value large">{response.name}</p>
                    </div>
                    <div className="info-item">
                      <label className="info-label">Email Address</label>
                      <p className="info-value">{response.email}</p>
                    </div>
                    <div className="info-item">
                      <label className="info-label">Experience Level</label>
                      <div className="experience-info">
                        <i className="fas fa-clock info-icon"></i>
                        <span className="experience-years">{response.experience_years} years</span>
                        <span className="badge badge-secondary experience-badge">{response.level}</span>
                      </div>
                    </div>
                  </div>
                  <div className="candidate-info-section">
                    <div className="info-item">
                      <label className="info-label">Best Match Role</label>
                      <div className="role-info">
                        <i className="fas fa-briefcase info-icon"></i>
                        <span className="role-name">{response.best_role}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <label className="info-label">Overall Score</label>
                      <div className="score-info">
                        <i className="fas fa-star score-star"></i>
                        <span className={`score-value ${getScoreColorClass(response.final_score)}`}>
                          {response.final_score}%
                        </span>
                      </div>
                    </div>
                    <div className="info-item">
                      <label className="info-label">Status</label>
                      <span className={`badge status-badge ${getStatusColorClass(response.status)}`}>
                        {response.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Analysis */}
            <div className="card skills-card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fas fa-cogs title-icon"></i>
                  Skills Analysis
                </h2>
                <p className="card-description">Matched skills from the resume</p>
              </div>
              <div className="card-content">
                <div className="skills-container">
                  {response.matched_skills.map((skill, index) => (
                    <span key={index} className="badge badge-outline skill-badge">
                      <i className="fas fa-tag skill-icon"></i>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Section */}
            <div className="card action-card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fas fa-envelope title-icon"></i>
                  Send Results
                </h2>
                <p className="card-description">Email the screening results to the candidate</p>
              </div>
              <div className="card-content">
                <div className="alert email-alert">
                  <i className="fas fa-exclamation-circle alert-icon"></i>
                  <span className="alert-description">
                    This will send a detailed screening report to {response.email}
                  </span>
                </div>
                <button onClick={handleSendEmail} disabled={emailSending} className="btn btn-success email-button">
                  {emailSending ? (
                    <>
                      <i className="fas fa-spinner button-icon spinning"></i>
                      Sending Email...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-envelope button-icon"></i>
                      Send Results via Email
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
