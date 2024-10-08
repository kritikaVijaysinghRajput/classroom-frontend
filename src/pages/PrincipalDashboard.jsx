import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSignOutAlt } from "react-icons/fa";
import { apiEndpoints } from "../constants/apiEndpoints";
import { useNavigate } from "react-router-dom";
import { privateRequest } from "../redux/requestMethods.js";
import toast from "react-hot-toast";

const PrincipalDashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [newClassroom, setNewClassroom] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editData, setEditData] = useState({
    fullname: "",
    email: "",
  });
  const [showEditForm, setShowEditForm] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [days, setDays] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [assignError, setAssignError] = useState("");

  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const teachersResponse = await privateRequest.get(apiEndpoints.TEACHERS);
      setTeachers(teachersResponse.data);

      const studentsResponse = await privateRequest.get(apiEndpoints.STUDENTS);
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
  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitEdit = async (event) => {
    event.preventDefault();

    if (!selectedTeacher && !selectedStudent) {
      console.error("No teacher or student selected");
      return;
    }

    const id = selectedTeacher?._id || selectedStudent?._id;
    if (!id) {
      console.error("ID is missing");
      return;
    }

    try {
      const endpoint = !selectedTeacher
        ? `${apiEndpoints.EDIT_STUDENT}${id}`
        : `${apiEndpoints.EDIT_TEACHER}${id}`;
      console.log("EDITDATA:", editData);
      const response = await privateRequest.put(endpoint, {
        fullname: editData.fullname,
        email: editData.email,
      });

      if (!response.status == 200) {
        toast.error("oops something went wrong!");
      }
      fetchData();

      setEditData({ fullname: "", email: "", password: "" });
      setSelectedTeacher(null);
      setSelectedStudent(null);
      setShowEditForm(false);

      toast.success("Changes saved successfully");
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Failed to submit changes. Please try again.");
    }
  };

  const handleDelete = async (id, type) => {
    try {
      const endpoint =
        type === "teachers"
          ? apiEndpoints.DELETE_TEACHER
          : apiEndpoints.DELETE_STUDENT;

      await privateRequest.delete(`${endpoint}/${id}`);

      if (type === "teachers") {
        setTeachers(teachers.filter((teacher) => teacher.id !== id));
      } else if (type === "students") {
        setStudents(students.filter((student) => student.id !== id));
      }

      toast.success(`${type.slice(0, -1).toUpperCase()} deleted successfully.`);
    } catch (error) {
      console.error(
        "Delete failed:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to delete. Please try again.");
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

  const toggleDay = (day) => {
    setDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

  const handleAssignClassroom = async () => {
    if (selectedTeacher && selectedClassroom) {
      try {
        const teachersResponse = await privateRequest.get(
          apiEndpoints.TEACHERS
        );
        const teachers = teachersResponse.data;

        const teacher = teachers.find(
          (teacher) => teacher._id === selectedTeacher
        );
        if (!teacher) {
          setAssignError("Selected teacher not found.");
          return;
        }

        const classroomsResponse = await privateRequest.get(
          apiEndpoints.CREATE_CLASSROOM
        );
        const classrooms = classroomsResponse.data;

        const classroom = classrooms.find(
          (classroom) => classroom._id === selectedClassroom
        );
        if (!classroom) {
          setAssignError("Selected classroom not found.");
          return;
        }

        await privateRequest.post(apiEndpoints.ASSIGN_CLASSROOM, {
          teacherId: selectedTeacher,
          classroomId: selectedClassroom,
        });
        setSelectedTeacher("");
        setSelectedClassroom("");
        setAssignError(""); // Clear any previous errors
        toast.success("Classroom assigned successfully.");
      } catch (error) {
        console.error("Error assigning classroom:", error);
        setAssignError("Failed to assign classroom. Please try again.");
      }
    } else {
      setAssignError("Please select both a teacher and a classroom.");
    }
  };

  const handleEditClick = (user) => {
    if (user.type === "teacher") {
      setSelectedTeacher(user);
    } else {
      setSelectedStudent(user);
    }
    setEditData({
      fullname: user.fullname,
      email: user.email,
    });
    setShowEditForm(true);
  };

  const handleLogout = () => {
    navigate("/auth/login");
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center bg-white p-4 shadow-lg rounded-xl mb-6">
        <h1 className="text-4xl font-bold text-blue-600">
          Principal Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="text-blue-500 hover:text-blue-700 bg-gray-200 p-3 rounded-full shadow"
        >
          <FaSignOutAlt size={25} />
        </button>
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="flex-1 min-w-[300px] bg-white p-4 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Teachers</h2>
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
                {teachers.map((teacher) => (
                  <tr
                    key={teacher.id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-3">{teacher.fullname}</td>
                    <td className="p-3">{teacher.email}</td>
                    <td className="p-3 text-center flex justify-center">
                      <button
                        className="text-blue-500 hover:text-blue-700 mr-4"
                        onClick={() => handleEditClick(teacher, "teachers")}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(teacher._id, "teachers")}
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
                    key={student.id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-3">{student.fullname}</td>
                    <td className="p-3">{student.email}</td>
                    <td className="p-3 text-center flex justify-center">
                      <button
                        className="text-blue-500 hover:text-blue-700 mr-4"
                        onClick={() => handleEditClick(student, "students")}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(student._id, "students")}
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

        <div className="flex-1 min-w-[300px] bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">
            Assign Classroom to Teacher
          </h2>
          <hr />
          <div className="flex flex-col gap-4 mt-5">
            <div>
              <label className="block text-md font-semibold mb-2">
                Select Teacher:
              </label>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg shadow-sm w-full"
              >
                <option value="">Select Teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.fullname}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-md font-semibold mb-2">
                Select Classroom:
              </label>
              <select
                value={selectedClassroom}
                onChange={(e) => setSelectedClassroom(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg shadow-sm w-full"
              >
                <option value="">Select Classroom</option>
                {classrooms.map((classroom) => (
                  <option key={classroom._id} value={classroom._id}>
                    {classroom.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAssignClassroom}
              className="mt-4 bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-blue-700"
            >
              Assign Classroom
            </button>
            {assignError && <p className="mt-2 text-red-500">{assignError}</p>}
          </div>
        </div>
      </div>

      {showEditForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-xl shadow-lg w-1/3">
            <h3 className="text-2xl font-semibold mb-4">Edit User</h3>
            <form onSubmit={handleSubmitEdit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="fullname">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullname"
                  value={editData.fullname}
                  onChange={(e) =>
                    setEditData({ ...editData, fullname: e.target.value })
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
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
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

export default PrincipalDashboard;
