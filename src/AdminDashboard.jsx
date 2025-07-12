"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import "./admin-dashboard.css"
export default function AdminDashboard() {
  const [logs, setLogs] = useState([])
  const [sendingEmail, setSendingEmail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("timestamp")
  const [sortOrder, setSortOrder] = useState("desc")
  const [jobFilter, setJobFilter] = useState("All");


const [showJobModal, setShowJobModal] = useState(false);
const [newJob, setNewJob] = useState({
  title: "",
  description: "",
  department: "",
  location: "",
  deadline: "",
});
const [jobs, setJobs] = useState([]);


  
  // useEffect(() => {
  //   fetchLogs()
  // }, [])
  useEffect(() => {
    fetchLogs();
    fetchJobs(); // ⬅️ Fetch job list for admin
  }, []);
  
const fetchJobs = () => {
  axios.get(`${BASE_URL}/jobs`)
    .then((res) => setJobs(res.data))
    .catch((err) => console.error("❌ Failed to fetch jobs:", err));
};


      
const normalizeLogKeys = (log) => ({
  Name: log.name,
  Email: log.email,
  Role: log.role,
  Level: log.experience_level,
  "Final Score": log.final_score,
  Status: log.status,
  Timestamp: log.timestamp,
  "Job Applied": log.job_title || "—",
});

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const fetchLogs = () => {
  setLoading(true);
  axios
    .get(`${BASE_URL}/logs`)
    .then((res) => {
      const logs = (res.data || []).map(normalizeLogKeys);
      const mergedLogs = mergeDuplicateEmails(logs);
      setLogs(mergedLogs);
    })
    .catch((err) => {
      console.error("❌ Failed to fetch logs:", err);
    })
    .finally(() => {
      setLoading(false);
    });
};


const handleDeleteJob = async (jobId) => {
  if (!window.confirm("Are you sure you want to delete this job?")) return;

  try {
    await axios.delete(`${BASE_URL}/jobs/${jobId}`);
    alert("✅ Job deleted");
    setJobs(jobs.filter((job) => job.id !== jobId));
  } catch (err) {
    console.error("❌ Failed to delete job:", err);
    alert("❌ Failed to delete job");
  }
};

const handleEditJob = (job) => {
  setNewJob(job); // preload modal form
  setShowJobModal(true); // open modal in edit mode
};


const formatForDatetimeLocal = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);  // ✅ cuts to yyyy-MM-ddTHH:mm
};




  const handleViewResume = (email) => {
  const encoded = encodeURIComponent(email);
  const url = `${BASE_URL}/resumes/${encoded}`;
  window.open(url, '_blank');
};

const handleExportCSV = () => {
  if (!filteredAndSortedLogs.length) {
    alert("⚠️ No records to export.");
    return;
  }

  const headers = Object.keys(filteredAndSortedLogs[0]);

  const csvRows = [
    headers.join(","),  // header row
    ...filteredAndSortedLogs.map((row) =>
      headers
        .map((field) =>
          `"${String(row[field] ?? "").replace(/"/g, '""')}"`
        )
        .join(",")
    )
  ];

  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `resume_logs_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



const handleDeleteCandidate = async (email) => {
  if (!window.confirm(`Are you sure you want to delete ${email}?`)) return;
  try {
    // await axios.delete(`http://127.0.0.1:8000/delete-candidate/${encodeURIComponent(email)}`);
    await axios.delete(`${BASE_URL}/logs/${encodeURIComponent(email)}`);

    setLogs(logs.filter(log => log.Email !== email));
    alert("Candidate deleted successfully.");
  } catch (error) {
    console.error("❌ Failed to delete:", error);
    alert("Failed to delete candidate.");
  }
};

  const mergeDuplicateEmails = (data) => {
    const map = new Map()
    data.forEach((entry) => {
      const key = entry.Email
      if (!map.has(key) || new Date(entry.Timestamp) > new Date(map.get(key).Timestamp)) {
        map.set(key, entry)
      }
    })
    return Array.from(map.values())
  }

  const handleSendEmail = async (entry) => {
    setSendingEmail(entry.Email)
    try {
      await axios.post(`${BASE_URL}/send-email`, {
        email: entry.Email,
        name: entry.Name,
        status: entry.Status,
        best_role: entry.Role,
        score: Number.parseFloat(entry["Final Score"] || 0),
      })
      alert(`Email sent to ${entry.Name} (${entry.Email})`)
    } catch (error) {
      console.error("Email send error:", error)
      alert("Failed to send email.")
    } finally {
      setSendingEmail(null)
    }
  }

const handleSendBulkEmails = async () => {
  if (!filteredAndSortedLogs.length) {
    alert("No candidates to send emails.");
    return;
  }

  if (!window.confirm(`Send emails to ${filteredAndSortedLogs.length} candidates?`)) return;

  let failed = [];

  for (let log of filteredAndSortedLogs) {
    try {
      await axios.post(`${BASE_URL}/send-email`, {
        email: log.Email,
        name: log.Name,
        status: log.Status,
        best_role: log.Role,
        score: Number.parseFloat(log["Final Score"] || 0),
      });
      console.log(`✅ Email sent to ${log.Email}`);
    } catch (error) {
      console.error(`❌ Failed to send to ${log.Email}`, error);
      failed.push(log.Email);
    }
  }

  if (failed.length === 0) {
    alert("✅ Emails sent to all candidates successfully.");
  } else {
    alert(`❌ Failed to send emails to: ${failed.join(", ")}`);
  }
};





  const getStatusClass = (status) => {
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

  const getScoreClass = (score) => {
    const numScore = Number.parseFloat(score)
    if (numScore >= 80) return "score-high"
    if (numScore >= 60) return "score-medium"
    return "score-low"
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }





  const filteredAndSortedLogs = logs
    .filter((log) => {
      const matchesSearch =
        log.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.Role?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || log.Status?.toLowerCase() === statusFilter.toLowerCase()
      const matchesJob =jobFilter === "All" || log["Job Applied"] === jobFilter;
      return matchesSearch && matchesStatus&&matchesJob
    })
    .sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case "name":
          aValue = a.Name || ""
          bValue = b.Name || ""
          break
        case "email":
          aValue = a.Email || ""
          bValue = b.Email || ""
          break
        case "score":
          aValue = Number.parseFloat(a["Final Score"] || 0)
          bValue = Number.parseFloat(b["Final Score"] || 0)
          break
        case "timestamp":
        default:
          aValue = new Date(a.Timestamp)
          bValue = new Date(b.Timestamp)
          break
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-title-section">
            <div className="header-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <div>
              <h1 className="dashboard-title">Admin Dashboard</h1>
              <p className="dashboard-subtitle">Resume screening logs and management</p>
              <button
                className="btn btn-success"
                onClick={() => setShowJobModal(true)}
              >
                + Post New Job
              </button>

            </div>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-number">{logs.length}</div>
              <div className="stat-label">Total Applications</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {
                  logs.filter(
                    (log) =>
                      log.Status?.toLowerCase().includes("accept") || log.Status?.toLowerCase().includes("qualified"),
                  ).length
                }
              </div>
              <div className="stat-label">Qualified</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {logs.filter((log) => Number.parseFloat(log["Final Score"] || 0) >= 80).length}
              </div>
              <div className="stat-label">High Scores</div>
            </div>
          </div>
        </div>

          {/* job postings */}
         <div className="job-list-section">
            <h2>📄 Job Postings</h2>
            {jobs.length === 0 ? (
              <p>No jobs posted yet.</p>
            ) : (
              <ul className="job-list">
                {jobs.map((job) => (
                  <li key={job.id} className="job-list-item">
                    <div className="job-info">
                      <strong>{job.title}</strong> — {job.department} ({job.location})  
                      <br />
                      <small>Deadline: {new Date(job.deadline).toLocaleString()}</small>
                    </div>
                    <div className="job-actions">
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleEditJob(job)}
                      >
                        Edit
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
            {showJobModal && (
    <div className="modal-overlay">
    <div className="modal-content">
      <h2>Post New Job</h2>
      <form
  onSubmit={async (e) => {
    e.preventDefault();
    console.log("📨 Submitting job:", newJob);

    try {
      const response = await axios.post(`${BASE_URL}/jobs`, newJob);
      console.log("✅ Server response:", response.data);
      alert("✅ Job posted successfully!");
      setShowJobModal(false);
      setNewJob({ title: "", description: "", department: "", location: "", deadline: "" });
    } catch (err) {
      console.error("❌ Failed to post job:", err.response?.data || err.message);
      alert("❌ Failed to post job");
    }
  }}
>
        <input
          required
          type="text"
          placeholder="Job Title"
          value={newJob.title}
          onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newJob.description}
          onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Department"
          value={newJob.department}
          onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          value={newJob.location}
          onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
        />
        
        <input
  required
  type="datetime-local"
  value={formatForDatetimeLocal(newJob.deadline)}
  onChange={(e) => {
    const localDate = new Date(e.target.value);
    const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
    setNewJob({ ...newJob, deadline: utcDate.toISOString() });
  }}
/>

        <div className="modal-actions">
          <button type="submit" className="btn btn-primary">Post Job</button>
          <button type="button" onClick={() => setShowJobModal(false)} className="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  </div>
)}


        {/* Controls */}
        <div className="dashboard-controls">
          <div className="controls-row">
            <div className="search-container">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-container">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
                <option value="all">All Status</option>
                <option value="accepted">Accepted</option>
                {/* <option value="qualified">Qualified</option> */}
                <option value="rejected">Rejected</option>
                {/* <option value="not qualified">Not Qualified</option> */}
              </select>
            </div>

            <div className="filter-container">
              <select
                value={jobFilter}
                onChange={(e) => setJobFilter(e.target.value)}
                className="filter-select"
              >
                <option value="All">All Jobs</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.title}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>
            


            <div className="sort-container">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                <option value="timestamp">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="email">Sort by Email</option>
                <option value="score">Sort by Score</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="sort-order-btn"
                title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
              >
                <i className={`fas fa-sort-${sortOrder === "asc" ? "up" : "down"}`}></i>
              </button>
            </div>
                <span
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setJobFilter("All");
                    setSortBy("timestamp");      // optional
                    setSortOrder("desc");        // optional
                  }}
                  className="btn btn-secondary ml-2"
                >
                  <i className="fas fa-undo-alt mr-1"></i> Clear Filters

                </span>

            <button onClick={fetchLogs} className="refresh-btn" title="Refresh Data">
              <i className="fas fa-sync-alt"></i>
            </button>
          </div>
        </div>
        
        {/* Table */}
        <div className="table-container">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
              </div>
              <p className="loading-text">Loading resume logs...</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>
                      <i className="fas fa-clock"></i>
                      Timestamp
                    </th>
                    <th>
                      <i className="fas fa-user"></i>
                      Candidate
                    </th>
                    <th>
                      <i className="fas fa-envelope"></i>
                      Email
                    </th>
                    <th>
                        <i className="fas fa-briefcase"></i>
                            Job Applied
                    </th>

                    <th>
                      <i className="fas fa-briefcase"></i>
                      Role
                    </th>
                    <th>
                      <i className="fas fa-layer-group"></i>
                      Level
                    </th>
                    {/* <th>
                      <i className="fas fa-calendar-alt"></i>
                      Experience
                    </th> */}
                    <th>
                      <i className="fas fa-star"></i>
                      Score
                    </th>
                    <th>
                      <i className="fas fa-flag"></i>
                      Status
                    </th>
                    <th>
                      <i className="fas fa-cog"></i>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedLogs.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="no-data">
                        <div className="no-data-content">
                          <i className="fas fa-inbox"></i>
                          <p>No resume logs found</p>
                          <small>Try adjusting your search or filter criteria</small>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedLogs.map((log, idx) => (
                      <tr key={idx} className="table-row">
                        <td className="timestamp-cell">
                          <div className="timestamp-content">
                            <span className="timestamp-date">{formatDate(log.Timestamp)}</span>
                          </div>
                        </td>
                        <td className="candidate-cell">
                          <div className="candidate-info">
                            <div className="candidate-avatar">{log.Name?.charAt(0)?.toUpperCase() || "?"}</div>
                            <span className="candidate-name">{log.Name}</span>
                          </div>
                        </td>


                        <td className="email-cell">
                          <a href={`mailto:${log.Email}`} className="email-link">
                            {log.Email}
                          </a>
                        </td>
                        <td className="job-title-cell">{log["Job Applied"]}</td>


                        <td className="role-cell">
                          <span className="role-badge">{log.Role}</span>
                        </td>


                        <td className="level-cell">{log.Level}</td>


                      


                        <td className="score-cell">
                          <span className={`score-badge ${getScoreClass(log["Final Score"])}`}>
                            {log["Final Score"]}%
                          </span>
                        </td>


                        <td className="status-cell">
                          <span className={`status-badge ${getStatusClass(log.Status)}`}>{log.Status}</span>
                        </td>


                        <td className="action-cell">
                        <div>
                          <button
                            onClick={() => handleViewResume(log.Email)}className="action-btn view-btn"title="View Resume">
                            <i className="fas fa-eye"></i>
                            <span>View</span>
                            </button>
                          
                       
                          <button
                            onClick={() => handleSendEmail(log)}
                            disabled={sendingEmail === log.Email}
                            className="action-btn email-btn"
                            title="Send Email"
                          >
                            {sendingEmail === log.Email ? (
                              <>
                                <i className="fas fa-spinner fa-spin"></i>
                                <span>Sending...</span>
                              </>
                            ) : (
                              <>
                                <i className="fas fa-paper-plane"></i>
                                <span>Send Email</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteCandidate(log.Email)}
                            className="action-btn delete-btn"
                            title="Delete Candidate"
                          >
                            <i className="fas fa-trash-alt"></i>
                            <span>Delete</span>
                          </button>

                        </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="dashboard-footer">
          <div className="footer-info">
            <span>
              Showing {filteredAndSortedLogs.length} of {logs.length} entries
            </span>
          </div>
          <div className="footer-actions">
            <button className="export-btn" onClick={handleExportCSV} title="Export Data">
              <i className="fas fa-download"></i> Export CSV
            </button>
            <button className="bulk-email-btn action-btn email-btn" onClick={handleSendBulkEmails} title="Send Email to All">
              <i className="fas fa-paper-plane"></i> Send Email to All
            </button>
          </div>

    


        </div>
      </div>
    </div>
  )
}




