"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ toggle state
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setError("All fields are required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await fetch("https://helio-aiqr.onrender.com/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Sign Up Failed");
        return;
      }

      localStorage.setItem("supabaseSession", JSON.stringify(data.session));
      router.push("/home");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
      <section className="relative min-h-screen flex items-center justify-center px-4 bg-white dark:bg-gray-900 overflow-hidden font-sans">
        
        {/* Background Vector Shapes */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
          <svg
            className="absolute -top-[10%] -left-[10%] w-[70vw] max-w-[800px] text-blue-50 dark:text-blue-900/20 opacity-70 transform rotate-12"
            fill="currentColor"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M45.7,-76.4C58.9,-69.3,69,-55.4,75.2,-40.7C81.4,-26,83.7,-10.5,80.7,3.6C77.8,17.7,69.5,30.5,59.5,41.2C49.5,51.9,37.8,60.6,24.3,67.4C10.7,74.2,-4.7,79.2,-19.7,77.5C-34.7,75.8,-49.4,67.4,-60.1,55.5C-70.8,43.6,-77.5,28.2,-81.4,12C-85.3,-4.2,-86.3,-21.2,-79.8,-35.3C-73.3,-49.4,-59.4,-60.6,-45.1,-67.3C-30.8,-74,-15.4,-76.2,0.8,-77.3C17,-78.4,32.5,-83.4,45.7,-76.4Z"
              transform="translate(100 100)"
            />
          </svg>
          <svg
            className="absolute -bottom-[20%] -right-[10%] w-[60vw] max-w-[600px] text-gray-50 dark:text-gray-800/50 opacity-70"
            fill="currentColor"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M47.5,-73.2C59.9,-63.5,67.2,-47.4,73.4,-31.1C79.6,-14.8,84.7,1.8,81.4,16.5C78,31.2,66.1,44.1,51.7,52.3C37.3,60.5,20.4,63.9,4.4,57.1C-11.7,50.2,-26.8,33,-40.8,21C-54.7,9,-67.5,2.3,-68.8,-13.7C-70,-29.7,-59.7,-55.1,-43.3,-66.1C-26.9,-77.1,-4.5,-73.6,12.7,-70.6C29.9,-67.6,47.5,-73.2,47.5,-73.2Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
  
        {/* Form Card */}
        <div className="relative z-10 w-full max-w-md p-8 sm:p-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Image
                className="w-auto h-12"
                src="/icons/Logo.png"
                alt="Logo"
                width={200}
                height={200}
                priority
              />
            </div>
  
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome To Helio
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Please enter your details to sign up.
              </p>
            </div>
  
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/50 text-center">
                {error}
              </div>
            )}
            {/* User name Input*/}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                User name
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
  
            {/* Email Input */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
  
            {/* Password Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
  
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 shadow-md shadow-blue-500/20"
            >
              Sign up
            </button>
  
            {/* Divider */}
            <div className="relative flex items-center my-6">
              <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
              <span className="flex-shrink-0 mx-4 text-sm text-gray-400 dark:text-gray-500">
                or
              </span>
              <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
            </div>
  
            {/* Google Sign In */}
            <button
              type="button"
              onClick={() =>
                (window.location.href =
                  "https://your-app.onrender.com/api/auth/google")
              }
              className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 40 40">
                <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#FFC107" />
                <path d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z" fill="#FF3D00" />
                <path d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z" fill="#4CAF50" />
                <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#1976D2" />
              </svg>
              Sign up with Google
            </button>
  
            {/* Footer Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already Have an Account?{" "}
                <a
                  href="/"
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  Sign in
                </a>
              </p>
            </div>
          </form>
        </div>
      </section>
    );
  }
