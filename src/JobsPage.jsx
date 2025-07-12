// JobsPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import "./Jobs-Page.css";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);


    


  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    axios.get(`${BASE_URL}/jobs`)
      .then(res => setJobs(res.data))
      .catch(err => console.error("Failed to fetch jobs:", err));
  }, []);


const handleFileUpload = async () => {
const formData = new FormData();
formData.append("file", file);
formData.append("job_id", selectedJob.id);  // ✅ Pass job_id correctly

try {
  await axios.post(`${BASE_URL}/screen`, formData);  // ❌ Don't set headers manually
  alert("✅ Resume uploaded successfully!");
  setSelectedJob(null);
  setFile(null);
} catch (error) {
  console.error("❌ Upload error:", error.response?.data || error.message);
  alert("❌ Failed to upload resume.");
}
};


  return (
    <div className="jobs-page">
      <h1 className="page-title">Open Job Opportunities</h1>
      <div className="job-list">
        {jobs.length === 0 ? (
          <p>No active jobs available.</p>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="job-card">
              <h2>{job.title}</h2>
              <p><strong>Department:</strong> {job.department}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleString()}</p>
              <p>{job.description}</p>
              <button className="btn btn-primary" onClick={() => setSelectedJob(job)}>
                Apply
              </button>
            </div>
          ))
        )}
      </div>

      {selectedJob && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Apply for {selectedJob.title}</h2>
            <input type="file" accept=".pdf,.docx" onChange={(e) => setFile(e.target.files[0])} />
            <div className="modal-actions">
  <button
    className="btn btn-success"
    disabled={!file || uploading}
    onClick={async () => {
      console.log("📤 Uploading resume...");
      if (!file) {
        alert("Please select a resume file.");
        return;
      }
      if (!selectedJob) {
        alert("No job selected.");
        return;
      }

      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("job_id", selectedJob.id); // ✅ send job_id

      try {
        const res = await axios.post(`${BASE_URL}/screen`, formData);
        console.log("✅ Resume uploaded:", res.data);
        alert("✅ Resume uploaded successfully!");
        setSelectedJob(null);
        setFile(null);
      } catch (error) {
        console.error("❌ Upload failed:", error.response?.data || error.message);
        alert("❌ Resume upload failed.");
      } finally {
        setUploading(false);
      }
    }}
  >
    {uploading ? "Uploading..." : "Submit Resume"}
  </button>

  <button
    className="btn btn-secondary"
    onClick={() => {
      setSelectedJob(null);
      setFile(null);
    }}
  >
    Cancel
  </button>
</div>

          </div>
        </div>
      )}
    </div>
  );
}



