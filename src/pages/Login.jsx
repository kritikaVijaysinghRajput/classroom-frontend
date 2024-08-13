import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { publicRequest } from "../redux/requestMethods.js";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice.js";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { BsApple } from "react-icons/bs";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("principal");
  const { isFetching, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const res = await publicRequest.post("/api/auth/login", {
        email,
        password,
        role,
      });

      toast.success("Login successful!");
      console.log(res);
      dispatch(setUser(res.data));
      if (role === "teacher") {
        navigate("/teacherdashboard");
      } else if (role === "student") {
        navigate("/studentdashboard");
      } else if (role === "principal") {
        navigate("/principaldashboard");
      }
    } catch (err) {
      console.error("Login failed:", err);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-white text-black">
      <div className="relative flex flex-col gap-4 border-2 bg-white border-gray-300 p-10 rounded-3xl shadow-md w-full max-w-md">
        <div className="text-center">
          <p className="text-4xl font-bold text-gray-700">Login</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 mb-5">
            <label htmlFor="email" className="font-bold text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="p-4 border-2 bg-white text-black border-gray-300 rounded-3xl"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="flex flex-col gap-2 mb-5">
            <label htmlFor="password" className="font-bold text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="p-4 border-2 bg-white text-black border-gray-300 rounded-3xl"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <div className="flex flex-col gap-2   mb-5">
            <label htmlFor="role" className="font-bold text-gray-700">
              Role
            </label>
            <select
              id="role"
              className="p-4 border-2  bg-white text-black border-gray-300 rounded-3xl"
              onChange={(e) => setRole(e.target.value)}
              value={role}
            >
              <option value="principal">Principal</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>
        </div>
        <button
          type="button"
          onClick={handleClick}
          className="border-2 text-white hover:bg-blue-700 bg-blue-500 bg-primary w-full font-bold p-4 rounded-3xl"
        >
          Login
        </button>
        <div className="flex justify-center gap-8 items-center my-4">
          <FaGoogle className="w-10 h-10 text-gray-600" />
          <FaGithub className="w-10 h-10 text-gray-600" />
          <BsApple className="w-10 h-10 text-gray-600" />
        </div>
        <div className="w-full h-[1px] bg-gray-300" />
        <div className="flex justify-center">
          <Link
            to="/auth/registration"
            className="text-primary font-bold hover:underline"
          >
            Don't have an account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
