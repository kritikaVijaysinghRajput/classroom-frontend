import React, { useState, useEffect } from "react";
import { apiEndpoints } from "../constants/apiEndpoints";
import { privateRequest } from "../redux/requestMethods";
import toast from "react-hot-toast";
import { FaSignOutAlt } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [students, setStudents] = useState([]);
  const [classroom, setClassroom] = useState({});
  const [timetable, setTimetable] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentAndClassroomData = async () => {
      try {
        const studentsResponse = await privateRequest.get(
          apiEndpoints.STUDENTS
        );
        setStudents(studentsResponse.data);

        const timetableResponse = await privateRequest.get(
          apiEndpoints.GET_CLASSROOM
        );
        setTimetable(timetableResponse.data);

        const classroomsResponse = await privateRequest.get(
          apiEndpoints.GET_CLASSROOM
        );
        setClassrooms(classroomsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data. Please try again later.");
      }
    };

    fetchStudentAndClassroomData();
  }, []);

  const handleLogout = () => {
    navigate("/auth/login");
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center bg-white p-4 shadow-lg rounded-xl mb-6">
        <h1 className="text-4xl font-bold text-blue-600">Teacher Dashboard</h1>
        <button
          onClick={handleLogout}
          className="text-blue-500 hover:text-blue-700 bg-gray-200 p-3 rounded-full shadow"
        >
          <FaSignOutAlt size={25} />
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">TimeTable</h3>
        <table className="w-full border border-gray-300 rounded-lg bg-white">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="p-3 font-semibold text-left">Name</th>
              <th className="p-3 font-semibold text-left">Start Time</th>
              <th className="p-3 font-semibold text-left">End Time</th>
              <th className="p-3 font-semibold text-left">Days</th>
            </tr>
          </thead>
          <tbody>
            {classrooms.map((classroom) => (
              <tr key={classroom.id} className="border-t border-gray-300">
                <td className="p-3">{classroom.name}</td>
                <td className="p-3">{classroom.startTime}</td>
                <td className="p-3">{classroom.endTime}</td>
                <td className="p-3">{classroom.days.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">
          Students in Your Classroom
        </h3>
        <table className="w-full border border-gray-300 rounded-lg bg-white">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="p-3 font-semibold text-left">Name</th>
              <th className="p-3 font-semibold text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-t border-gray-300">
                <td className="p-3">{student.fullname}</td>
                <td className="p-3">{student.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentDashboard;
