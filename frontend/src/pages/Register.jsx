import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", formData);

      alert("Registration Successful!");

      setFormData({
        username: "",
        email: "",
        password: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-900 via-black to-indigo-900">
      <Navbar />
      <div className="w-full max-w-md bg-gray-800/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-white mb-2">
          Create Account
        </h1>

        <p className="text-center text-gray-400 mb-8">
          Join Music Recommendation System
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-3 mb-4 rounded-xl bg-gray-700 text-white outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 mb-4 rounded-xl bg-gray-700 text-white outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 mb-6 rounded-xl bg-gray-700 text-white outline-none"
          />

          <button
            type="submit"
            className="w-full bg-green-600 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-green-400 hover:text-green-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;