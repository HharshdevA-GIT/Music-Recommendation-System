import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
      const res = await API.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);

      alert("Login Successful!");
      navigate("/preferences");

    } catch (err) {
      alert(err.response?.data?.message || "Login Failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-purple-950">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-white mb-6">
          Welcome Back 🎵
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 mb-4 rounded-xl bg-gray-800 text-white outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 mb-6 rounded-xl bg-gray-800 text-white outline-none"
          />

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl text-white font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;