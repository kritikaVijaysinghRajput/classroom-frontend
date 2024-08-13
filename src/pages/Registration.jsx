import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { publicRequest } from "../redux/requestMethods.js";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice.js";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { BsApple } from "react-icons/bs";

const Registration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const response = await publicRequest.post("/api/auth/register", {
        fullname,
        email,
        password,
        role,
      });

      toast.success("Registration successful!");
      dispatch(setUser(response.data));

      navigate("/auth/login");
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center  items-center min-h-screen w-screen ">
      <div className="w-full max-w-md mb-2 bg-white shadow-xl border rounded-3xl p-6">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">
          Register
        </h2>

        <form onSubmit={handleClick} className="space-y-4">
          <div>
            <label
              htmlFor="fullname"
              className="block text-lg font-semibold text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              className="w-full px-4 py-3 border bg-white text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-lg font-semibold text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border bg-white text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-lg font-semibold text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 border bg-white text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-lg font-semibold text-gray-700 mb-1"
            >
              Role
            </label>
            <select
              id="role"
              className="w-full px-4 py-3 border bg-white text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              onChange={(e) => setRole(e.target.value)}
              value={role}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="principal">Principal</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-primary text-white hover:bg-blue-700 bg-blue-500  my-4  font-semibold rounded-xl hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Register
          </button>
        </form>

        <div className="flex justify-center mt-4 gap-4 ">
          <FaGoogle className="w-10 h-10 bg-gray-200 p-2 rounded-full text-gray-700 cursor-pointer hover:bg-gray-300" />
          <FaGithub className="w-10 h-10 bg-gray-200 p-2 rounded-full text-gray-700 cursor-pointer hover:bg-gray-300" />
          <BsApple className="w-10 h-10 bg-gray-200 p-2 rounded-full text-gray-700 cursor-pointer hover:bg-gray-300" />
        </div>

        <div className="border-t border-gray-300 my-4" />

        <div className="text-center">
          <Link
            to="/auth/login"
            className="text-primary font-semibold hover:underline"
          >
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Registration;
