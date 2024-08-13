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
    <div className="p-6 min-h-screen">
      <div className="shadow-sm border mb-4 rounded-xl flex justify-between items-center">
        <h1 className="text-3xl font-bold text-center text-blue-400 m-3">
          Student Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="text-blue-500 hover:text-blue-700 p-5"
        >
          <FaSignOutAlt size={25} />
        </button>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">
          Students in Your Classroom
        </h3>
        <table className="w-full rounded-3xl shadow-lg p-2 mb-8">
          <thead>
            <tr className="bg-blue-300">
              <th className="p-3 font-semibold text-left">Name</th>
              <th className="p-3 font-semibold text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-t border-gray-200">
                <td className="p-3 font-semibold">{student.fullname}</td>
                <td className="p-3 font-semibold">{student.email}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="text-xl font-semibold mb-4">TimeTable</h3>
        <table className="w-full rounded-3xl shadow-lg p-2">
          <thead>
            <tr className="bg-blue-300">
              <th className="p-3 font-semibold text-left">Name</th>
              <th className="p-3 font-semibold text-left">Start Time</th>
              <th className="p-3 font-semibold text-left">End Time</th>
              <th className="p-3 font-semibold text-left">Days</th>
            </tr>
          </thead>
          <tbody>
            {classrooms.map((classroom) => (
              <tr key={classroom.id} className="border-t border-gray-200">
                <td className="p-3 font-semibold">{classroom.name}</td>
                <td className="p-3 font-semibold">{classroom.startTime}</td>
                <td className="p-3 font-semibold">{classroom.endTime}</td>
                <td className="p-3 font-semibold">{classroom.days}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentDashboard;
