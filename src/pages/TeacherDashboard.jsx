import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { apiEndpoints } from "../constants/apiEndpoints";
import { privateRequest } from "../redux/requestMethods";

const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);
  const [newClassroom, setNewClassroom] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [days, setDays] = useState([]);
  const [editStudent, setEditStudent] = useState(null);
  const [editStudentData, setEditStudentData] = useState({
    fullname: "",
    email: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsResponse] = await Promise.all([
          privateRequest.get(apiEndpoints.STUDENTS),
        ]);
        setStudents(studentsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  const handleSubmitEdit = async (event) => {
    event.preventDefault();

    if (!editStudent) {
      console.error("No student selected for editing");
      return;
    }

    const id = editStudent._id;
    if (!id) {
      console.error("ID is missing");
      return;
    }

    try {
      const response = await privateRequest.put(
        `${apiEndpoints.EDIT_STUDENT}${id}`,
        {
          fullname: editStudentData.fullname,
          email: editStudentData.email,
        }
      );

      if (response.status !== 200) {
        toast.error("Oops, something went wrong!");
      }
      const updatedStudents = students.map((student) =>
        student._id === id
          ? {
              ...student,
              fullname: editStudentData.fullname,
              email: editStudentData.email,
            }
          : student
      );
      setStudents(updatedStudents);

      setEditStudent(null);
      setEditStudentData({ fullname: "", email: "" });

      toast.success("Changes saved successfully");
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Failed to submit changes. Please try again.");
    }
  };

  const handleCreateClassroom = async () => {
    if (newClassroom && startTime && endTime && days.length > 0) {
      try {
        const response = await privateRequest.post(
          apiEndpoints.CREATE_CLASSROOM,
          {
            name: newClassroom,
            startTime,
            endTime,
            days,
          }
        );
        // Assuming you want to update classroom list
        setNewClassroom("");
        setStartTime("");
        setEndTime("");
        setDays([]);
        toast.success("Classroom created successfully.");
      } catch (error) {
        console.error("Error creating classroom:", error);
        toast.error("Failed to create classroom. Please try again.");
      }
    } else {
      toast.error("Please fill in all the fields.");
    }
  };

  const toggleDay = (day) => {
    setDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

  const handleEditClick = (student) => {
    setEditStudent(student);
    setEditStudentData({
      fullname: student.fullname,
      email: student.email,
    });
  };

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

      <div className="flex flex-wrap gap-6">
        <div className="flex-1 min-w-[300px] bg-white p-4 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Students</h2>
          <div className="overflow-x-auto">
            <table className="w-full rounded-lg">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="p-3 text-left rounded-tl-lg">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-center rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student._id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-3">{student.fullname}</td>
                    <td className="p-3">{student.email}</td>
                    <td className="p-3 text-center flex justify-center">
                      <button
                        className="text-blue-500 hover:text-blue-700 mr-4"
                        onClick={() => handleEditClick(student)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(student._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 mt-8">
        <div className="flex-1 min-w-[300px] bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Create Classroom</h2>
          <hr />
          <div className="flex flex-col gap-4 mt-5">
            <input
              type="text"
              placeholder="Classroom Name"
              value={newClassroom}
              onChange={(e) => setNewClassroom(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg shadow-sm w-full"
            />
            <div className="flex gap-4">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg shadow-sm w-full"
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg shadow-sm w-full"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <label className="text-md font-semibold">Select Days:</label>
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ].map((day) => (
                <label key={day} className="inline-flex items-center ml-2">
                  <input
                    type="checkbox"
                    checked={days.includes(day)}
                    onChange={() => toggleDay(day)}
                    className="form-checkbox"
                  />
                  <span className="ml-2">{day}</span>
                </label>
              ))}
            </div>
            <button
              onClick={handleCreateClassroom}
              className="mt-4 bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-blue-700"
            >
              Add Classroom
            </button>
          </div>
        </div>
      </div>

      {editStudent && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-xl shadow-lg w-1/3">
            <h3 className="text-2xl font-semibold mb-4">Edit Student</h3>
            <form onSubmit={handleSubmitEdit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="fullname">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullname"
                  value={editStudentData.fullname}
                  onChange={(e) =>
                    setEditStudentData({
                      ...editStudentData,
                      fullname: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={editStudentData.email}
                  onChange={(e) =>
                    setEditStudentData({
                      ...editStudentData,
                      email: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditStudent(null)}
                  className="mr-3 px-5 py-3 bg-gray-300 rounded-lg shadow hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
