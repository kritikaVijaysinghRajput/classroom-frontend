import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaSignOutAlt } from "react-icons/fa";
import { apiEndpoints } from "../constants/apiEndpoints";
import { useNavigate } from "react-router-dom";
import { privateRequest } from "../redux/requestMethods";
import toast from "react-hot-toast";

const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [newStudent, setNewStudent] = useState({
    fullname: "",
    email: "",
  });
  const [newClassroom, setNewClassroom] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [days, setDays] = useState([]);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [editStudentData, setEditStudentData] = useState({
    fullname: "",
    email: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsResponse = await privateRequest.get(
          apiEndpoints.STUDENTS
        );
        setStudents(studentsResponse.data);

        const classroomsResponse = await privateRequest.get(
          apiEndpoints.CREATE_CLASSROOM
        );
        setClassrooms(classroomsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  const handleEditStudent = async () => {
    if (editStudentData.fullname && editStudentData.email) {
      try {
        const response = await privateRequest.put(
          `${apiEndpoints.UPDATE_STUDENT}/${editStudent.id}`,
          editStudentData
        );
        setStudents(
          students.map((student) =>
            student.id === editStudent.id ? response.data : student
          )
        );
        setEditStudent(null);
        setEditStudentData({ fullname: "", email: "" });
        toast.success("Student updated successfully.");
      } catch (error) {
        console.error("Error updating student:", error);
        toast.error("Failed to update student. Please try again.");
      }
    } else {
      toast.error("Please fill in all fields.");
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
        setClassrooms([...classrooms, response.data]);
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

  const handleDeleteStudent = async (id) => {
    try {
      await privateRequest.delete(`${apiEndpoints.DELETE_STUDENT}/${id}`);
      setStudents(students.filter((student) => student.id !== id));
      toast.success("Student deleted successfully.");
    } catch (error) {
      console.error(
        "Delete failed:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to delete student. Please try again.");
    }
  };

  const handleLogout = () => {
    navigate("/auth/login");
  };
  return (
    <div className="p-6 min-h-screen">
      <div className="shadow-sm border mb-4 rounded-xl flex justify-between items-center">
        <h1 className="text-3xl font-bold text-center text-blue-400 m-3">
          Teacher Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="text-blue-500 hover:text-blue-700 p-5"
        >
          <FaSignOutAlt size={25} />
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Students</h2>
        <button
          onClick={() => setShowAddStudentForm(true)}
          className="bg-blue-500 text-white p-2 rounded-lg mb-4 flex items-center"
        >
          <FaPlus className="mr-2" />
          Add Student
        </button>
        <table className="w-full rounded-3xl shadow-lg p-2">
          <thead>
            <tr className="bg-blue-300">
              <th className="p-3 font-semibold text-left">Name</th>
              <th className="p-3 font-semibold text-left">Email</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-t border-gray-200">
                <td className="p-3 font-semibold">{student.fullname}</td>
                <td className="p-3 font-semibold">{student.email}</td>
                <td className="p-3 text-center">
                  <button
                    className="text-blue-500 hover:text-blue-700 mx-2"
                    onClick={() => {
                      setEditStudent(student);
                      setEditStudentData({
                        fullname: student.fullname,
                        email: student.email,
                      });
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 mx-2"
                    onClick={() => handleDeleteStudent(student.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-8 border p-5  rounded-2xl shadow-md ">
        <h2 className="text-2xl font-semibold  mb-4">Create Classroom</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Classroom Name"
            value={newClassroom}
            onChange={(e) => setNewClassroom(e.target.value)}
            className="p-2 border shadow-sm rounded-xl"
          />
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="p-2 border shadow-sm rounded-xl ml-2"
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="p-2 border shadow-sm rounded-xl ml-2"
          />
          <div className="mt-4">
            <label className="mr-4 text-md font-semibold">Select Days :</label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={days.includes("Monday")}
                onChange={() => toggleDay("Monday")}
                className="form-checkbox"
              />
              <span className="ml-2">Monday</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="checkbox"
                checked={days.includes("Tuesday")}
                onChange={() => toggleDay("Tuesday")}
                className="form-checkbox"
              />
              <span className="ml-2">Tuesday</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="checkbox"
                checked={days.includes("Wednesday")}
                onChange={() => toggleDay("Wednesday")}
                className="form-checkbox"
              />
              <span className="ml-2">Wednesday</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="checkbox"
                checked={days.includes("Thursday")}
                onChange={() => toggleDay("Thursday")}
                className="form-checkbox"
              />
              <span className="ml-2">Thursday</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="checkbox"
                checked={days.includes("Friday")}
                onChange={() => toggleDay("Friday")}
                className="form-checkbox"
              />
              <span className="ml-2">Friday</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="checkbox"
                checked={days.includes("Saturday")}
                onChange={() => toggleDay("Saturday")}
                className="form-checkbox"
              />
              <span className="ml-2">Saturday</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="checkbox"
                checked={days.includes("Sunday")}
                onChange={() => toggleDay("Sunday")}
                className="form-checkbox"
              />
              <span className="ml-2">Sunday</span>
            </label>
          </div>
          <button
            onClick={handleCreateClassroom}
            className="mt-4 bg-blue-500 text-white font-semibold  px-4 py-2 rounded-2xl shadow-md"
          >
            Add Classroom
          </button>
        </div>
      </div>

      {showAddStudentForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add Student</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <label className="block mb-2">
                Fullname:
                <input
                  type="text"
                  value={newStudent.fullname}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, fullname: e.target.value })
                  }
                  className="border p-2 rounded-lg w-full"
                />
              </label>
              <label className="block mb-4">
                Email:
                <input
                  type="email"
                  value={newStudent.email}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, email: e.target.value })
                  }
                  className="border p-2 rounded-lg w-full"
                />
              </label>
              <button
                onClick={handleAddStudent}
                className="bg-blue-500 text-white p-2 rounded-lg"
              >
                Add Student
              </button>
              <button
                type="button"
                onClick={() => setShowAddStudentForm(false)}
                className="bg-red-500 text-white p-2 rounded-lg ml-2"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {editStudent && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Student</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <label className="block mb-2">
                Fullname:
                <input
                  type="text"
                  value={editStudentData.fullname}
                  onChange={(e) =>
                    setEditStudentData({
                      ...editStudentData,
                      fullname: e.target.value,
                    })
                  }
                  className="border p-2 rounded-lg w-full"
                />
              </label>
              <label className="block mb-4">
                Email:
                <input
                  type="email"
                  value={editStudentData.email}
                  onChange={(e) =>
                    setEditStudentData({
                      ...editStudentData,
                      email: e.target.value,
                    })
                  }
                  className="border p-2 rounded-lg w-full"
                />
              </label>
              <button
                onClick={handleEditStudent}
                className="bg-blue-500 text-white p-2 rounded-lg"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditStudent(null)}
                className="bg-red-500 text-white p-2 rounded-lg ml-2"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
