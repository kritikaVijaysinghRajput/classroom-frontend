import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaSignOutAlt } from "react-icons/fa";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teachersResponse = await privateRequest.get(
          apiEndpoints.TEACHERS
        );
        setTeachers(teachersResponse.data);

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

  const handleEdit = async (id, type, updatedData) => {
    try {
      const endpoint =
        type === "teachers"
          ? apiEndpoints.EDIT_TEACHER
          : apiEndpoints.EDIT_STUDENT;

      await privateRequest.put(`${endpoint}/${id}`, updatedData);

      if (type === "teachers") {
        setTeachers((prevTeachers) =>
          prevTeachers.map((teacher) =>
            teacher.id === id ? { ...teacher, ...updatedData } : teacher
          )
        );
      } else if (type === "students") {
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student.id === id ? { ...student, ...updatedData } : student
          )
        );
      }

      toast.success(`${type.slice(0, -1).toUpperCase()} updated successfully.`);
    } catch (error) {
      console.error(
        "Update failed:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to update. Please try again.");
    }
  };

  const handleSubmitEdit = async (event) => {
    event.preventDefault();

    if (!selectedTeacher && !selectedStudent) {
      console.error("No teacher or student selected");
      return;
    }

    const id = selectedTeacher?.id || selectedStudent?.id;
    if (!id) {
      console.error("ID is missing");
      return;
    }

    try {
      const endpoint = selectedTeacher
        ? `api/users/update/teachers/${id}`
        : `api/users/update/students/${id}`;

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error("Failed to update data");
      }

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
    <div className="p-6 min-h-screen">
      <div className="shadow-sm border mb-4 rounded-xl flex justify-between items-center">
        <h1 className="text-3xl font-bold text-center text-blue-400 m-3">
          Principal Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="text-blue-500 hover:text-blue-700 p-5"
        >
          <FaSignOutAlt size={25} />
        </button>
      </div>
      <div className="mb-8 ">
        <h2 className="text-2xl font-semibold mb-4 ">Teachers</h2>
        <table className="w-full rounded-3xl shadow-lg p-2">
          <thead>
            <tr className="bg-blue-300">
              <th className="p-3 font-semibold text-left">Name</th>
              <th className="p-3 font-semibold text-left">Email</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="border-t border-gray-200">
                <td className="p-3 font-semibold">{teacher.fullname}</td>
                <td className="p-3 font-semibold">{teacher.email}</td>
                <td className="p-3  text-center">
                  <button
                    className="text-blue-500 hover:text-blue-700 mr-2"
                    onClick={() => handleEditClick(teacher, "teachers")}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(teacher.id, "teachers")}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Students</h2>
        <table className="w-full rounded-3xl shadow-lg">
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
                    className="text-blue-500 hover:text-blue-700 mr-2"
                    onClick={() => handleEditClick(student, "students")}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(student.id, "students")}
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
      <div className="mb-8 border p-5  rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4">
          Assign Classroom to Teacher
        </h2>
        <div className="mb-4">
          <label className="mr-2 font-semibold">Select Teacher:</label>
          <select
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">Select Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.fullname}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="mr-2 font-semibold">Select Classroom:</label>
          <select
            value={selectedClassroom}
            onChange={(e) => setSelectedClassroom(e.target.value)}
            className="p-2 border border-gray-300 rounded"
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
          className="mt-4 bg-blue-500 text-white font-semibold px-4 py-2 rounded-2xl shadow-md"
        >
          Assign Classroom
        </button>
        {assignError && <p className="mt-2 text-red-500">{assignError}</p>}
      </div>
      {showEditForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
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
                  className="w-full p-2 border border-gray-300 rounded"
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
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="mr-4 px-4 py-2 bg-gray-300 text-gray-700 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
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
