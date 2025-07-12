// // src/components/Login.jsx
// "use client";

// import { signInWithPopup } from "firebase/auth";
// import { auth, provider } from "../firebase";
// import { useEffect, useState } from "react";

// export default function Login({ onLogin }) {
//   const [user, setUser] = useState(null);

//   const handleGoogleLogin = async () => {
//     try {
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;
//       setUser(user);
//       onLogin(user); // pass user back to parent if needed
//     } catch (error) {
//       console.error("Login failed", error);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center mt-20">
//       <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
//       <button
//         onClick={handleGoogleLogin}
//         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//       >
//         Sign in with Google
//       </button>
//     </div>
//   );
// }



// multiple login

// // src/components/Login.jsx
// "use client";

// import { signInWithPopup } from "firebase/auth";
// import { auth, googleProvider } from "../firebase";  // renamed provider
// import { useState } from "react";

// export default function Login({ onLogin }) {
//   const [error, setError] = useState(null);

//   const handleGoogleLogin = async () => {
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       const user = result.user;
//       onLogin(user); // pass user object to parent
//     } catch (error) {
//       console.error("Login failed", error);
//       setError("Failed to sign in. Please try again.");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center mt-20">
//       <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
//       <button
//         onClick={handleGoogleLogin}
//         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//       >
//         Sign in with Google
//       </button>
//       {error && <p className="text-red-600 mt-2">{error}</p>}
//     </div>
//   );
// }
// src/components/Login.jsx
// "use client";

// import { signInWithPopup } from "firebase/auth";
// import { auth, googleProvider } from "../firebase";
// import { useState } from "react";

// export default function Login({ onLogin, onBack }) {
//   const [user, setUser] = useState(null);

//   const handleGoogleLogin = async () => {
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       const user = result.user;
//       setUser(user);
//       onLogin(user); // pass user back to parent
//     } catch (error) {
//       console.error("Login failed", error);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center mt-20">
//       <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>

//       <button
//         onClick={handleGoogleLogin}
//         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-4"
//       >
//         Sign in with Google
//       </button>

//       <button
//         onClick={onBack}
//         className="text-sm text-gray-600 underline hover:text-gray-800"
//       >
//         ← Back to Resume Uploader
//       </button>
//     </div>
//   );
// }


// 

// "use client";

// import { signInWithPopup } from "firebase/auth";
// import { auth, googleProvider } from "../firebase";

// export default function Login({ onLogin, onBack }) {
//   const handleGoogleLogin = async () => {
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       const user = result.user;

//       // Pass user data to parent component
//       onLogin(user);
//     } catch (error) {
//       console.error("❌ Google sign-in failed:", error.code, error.message);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center mt-20">
//       <h2 className="text-2xl font-semibold mb-4">🔐 Admin Login</h2>

//       <button
//         onClick={handleGoogleLogin}
//         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-4"
//       >
//         Sign in with Google
//       </button>

//       <button
//         onClick={onBack}
//         className="text-sm text-gray-600 underline hover:text-gray-800"
//       >
//         ← Back to Resume Uploader
//       </button>
//     </div>
//   );
// }












// before v0

// "use client";

// import { useState } from "react";
// import {
//   signInWithPopup,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
// } from "firebase/auth";
// import { auth, googleProvider } from "../firebase";

// export default function Login({ onLogin, onBack }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isRegister, setIsRegister] = useState(false);
//   const [error, setError] = useState("");

//   const handleGoogleLogin = async () => {
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       onLogin(result.user);
//     } catch (err) {
//       setError("Google sign-in failed.");
//       console.error(err);
//     }
//   };

//   const handleEmailLogin = async () => {
//     setError("");
//     try {
//       if (isRegister) {
//         const result = await createUserWithEmailAndPassword(auth, email, password);
//         onLogin(result.user);
//       } else {
//         const result = await signInWithEmailAndPassword(auth, email, password);
//         onLogin(result.user);
//       }
//     } catch (err) {
//     //   setError(err.message);
//     // catch (err) {
//   if (err.code === "auth/user-not-found") {
//     setError("User not found. Please register or check your email.");
//   } else if (err.code === "auth/wrong-password") {
//     setError("Incorrect password. Please try again.");
//   } 
//   else if (err.code === "auth/invalid-email") {
//     setError("Incorrect email. Please try again.");
//   }else if (err.code === "auth/email-already-in-use") {
//     setError("This email is already registered. Please log in.");
//   } else {
//     setError("Authentication failed. " + err.message);
//   }
// // }

//     }
//   };

//   return (
//     <div className="flex flex-col items-center mt-20">
//       <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>

//       <input
//         type="email"
//         placeholder="Email"
//         className="border p-2 mb-2 w-64"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         className="border p-2 mb-4 w-64"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}

//       <button
//         onClick={handleEmailLogin}
//         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-2"
//       >
//         {isRegister ? "Register" : "Login"} with Email
//       </button>

//       <button
//         onClick={handleGoogleLogin}
//         className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mb-4"
//       >
//         Sign in with Google
//       </button>

//       <button
//         onClick={() => setIsRegister(!isRegister)}
//         className="text-sm text-gray-600 underline mb-2"
//       >
//         {isRegister ? "Already have an account? Login" : "New user? Register here"}
//       </button>

//       <button onClick={onBack} className="text-sm text-gray-500 underline">
//         ← Back to Resume Uploader
//       </button>
//     </div>
//   );
// }

// using v0

"use client"

import { useState } from "react"
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { auth, googleProvider } from "../firebase"
import "./login.css"

export default function Login({ onLogin, onBack }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState("")

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      onLogin(result.user)
    } catch (err) {
      setError("Google sign-in failed.")
      console.error(err)
    }
  }

  const handleEmailLogin = async () => {
    setError("")
    try {
      if (isRegister) {
        const result = await createUserWithEmailAndPassword(auth, email, password)
        onLogin(result.user)
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password)
        onLogin(result.user)
      }
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("User not found. Please register or check your email.")
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.")
      } else if (err.code === "auth/invalid-email") {
        setError("Incorrect email. Please try again.")

      }else if (err.code === "auth/invalid-credential") {
        setError("Incorrect credential. Please try again.")} 
      else if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please log in.")
      } else {
        setError("Authentication failed. " + err.message)
      }
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Admin Login</h2>

        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="button-group">
          <button onClick={handleEmailLogin} className="btn btn-primary">
            {isRegister ? "Register" : "Login"} with Email
          </button>

          <button onClick={handleGoogleLogin} className="btn btn-google">
            <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>
        </div>

        <div className="link-group">
          {/* <button onClick={() => setIsRegister(!isRegister)} className="link-button">
            {isRegister ? "Already have an account? Login" : "New user? Register here"}
          </button> */}

          <button onClick={onBack} className="back-button">
            ← Back to Resume Uploader
          </button>
        </div>
      </div>
    </div>
  )
}
