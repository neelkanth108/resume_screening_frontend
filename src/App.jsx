// import { useState, useEffect } from "react";
// import ResumeUploader from "./ResumeUploader";
// import AdminDashboard from "./AdminDashboard";
// import Login from "./components/Login";
// import { auth } from "./firebase";
// import { onAuthStateChanged, signOut } from "firebase/auth";



// const ADMIN_EMAILS = import.meta.env.VITE_ADMIN_EMAILS?.split(",") || [];
//  // Add your approved admin emails here

// export default function App() {
//   const [isAdminView, setIsAdminView] = useState(false);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     if (isAdminView && user && !ADMIN_EMAILS.includes(user.email)) {
//       setIsAdminView(false);
//     }
//   }, [isAdminView, user]);

//   const isAdmin = user && ADMIN_EMAILS.includes(user.email);

//   const handleLogout = () => {
//     signOut(auth);
//     setUser(null);
//     setIsAdminView(false);
//   };

//   // If user is trying to view admin but isn't allowed, show Login
//   if (isAdminView && !user) {
//     return <Login onLogin={setUser} onBack={() => setIsAdminView(false)} />;
//   }

//   return (
//     <div className="min-h-screen p-6 bg-gray-50">
//       <div className="flex justify-between items-center mb-4">
//         <button
//           onClick={() => setIsAdminView(!isAdminView)}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           {isAdminView ? "Switch to Resume Uploader" : "Switch to Admin Dashboard"}
//         </button>

//         {user && (
//           <div className="flex items-center gap-3">
//             <span className="text-gray-700">{user.email}</span>
//             <button
//               onClick={handleLogout}
//               className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
//             >
//               Logout
//             </button>
//           </div>
//         )}
//       </div>

//       {isAdminView ? (
//         user && isAdmin ? (
//           <AdminDashboard />
//         ) : (
//           <div className="text-red-600 font-semibold mt-4">
//             Unauthorized: You are not an approved admin.
//           </div>
//         )
//       ) : (
//         <ResumeUploader />
//       )}
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import ResumeUploader from "./ResumeUploader";
import AdminDashboard from "./AdminDashboard";
import JobsPage from "./JobsPage";
import Login from "./components/Login";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "./App.css"
const ADMIN_EMAILS = import.meta.env.VITE_ADMIN_EMAILS?.split(",") || [];

export default function App() {
  const [viewMode, setViewMode] = useState("jobs"); // "jobs", "uploader", or "admin"
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  const handleLogout = () => {
    signOut(auth);
    setUser(null);
    setViewMode("jobs");
  };
//   const [theme, setTheme] = useState("light");

// useEffect(() => {
//   document.body.setAttribute("data-theme", theme);
// }, [theme]);

// const toggleTheme = () => {
//   setTheme((prev) => (prev === "light" ? "dark" : "light"));
// };


  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Top Navigation */}
      <div className="flex justify-between items-center mb-4">
        {/* <div className="flex gap-4">
          <button
            onClick={() => setViewMode("jobs")}
            className={`px-4 py-2 rounded ${viewMode === "jobs" ? "bg-blue-700 text-white" : "bg-gray-200"}`}
          >
            Job Board
          </button>
          <button
            onClick={() => setViewMode("uploader")}
            className={`px-4 py-2 rounded ${viewMode === "uploader" ? "bg-blue-700 text-white" : "bg-gray-200"}`}
          >
            Resume Uploader
          </button>
          <button
            onClick={() => setViewMode("admin")}
            className={`px-4 py-2 rounded ${viewMode === "admin" ? "bg-blue-700 text-white" : "bg-gray-200"}`}
          >
            Admin Dashboard
          </button>
        </div> */}

        <div className="view-toggle-container">
          <button
            onClick={() => setViewMode("jobs")}
            className={`view-toggle-button ${viewMode === "jobs" ? "active" : ""}`}
          >
            Job Board
          </button>
          <button
            onClick={() => setViewMode("uploader")}
            className={`view-toggle-button ${viewMode === "uploader" ? "active" : ""}`}
          >
            Resume Uploader
          </button>
          <button
            onClick={() => setViewMode("admin")}
            className={`view-toggle-button ${viewMode === "admin" ? "active" : ""}`}
          >
            Admin Dashboard
          </button>
        {/* </div> */}


        {user && (
          <div className="user-info">
            <span>{user.email}</span>
            <button onClick={handleLogout}>Logout</button>
           </div>
        )}
        </div>
      </div>

      {/* View Rendering */}
      {viewMode === "admin" ? (
        user && isAdmin ? (
          <AdminDashboard />
        ) : (
          <Login onLogin={setUser} onBack={() => setViewMode("jobs")} />
        )
      ) : viewMode === "uploader" ? (
        <ResumeUploader />
      ) : (
        <JobsPage />
      )}
    </div>
  );
}
