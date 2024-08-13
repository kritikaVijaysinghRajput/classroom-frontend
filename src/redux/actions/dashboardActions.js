import axios from "axios";
import { apiEndpoints } from "../../constants/apiEndpoints";

export const fetchTeachers = () => async (dispatch) => {
  try {
    const response = await axios.get(apiEndpoints.TEACHERS);
    dispatch({ type: "FETCH_TEACHERS_SUCCESS", payload: response.data });
  } catch (error) {
    console.error("Failed to fetch teachers:", error);
  }
};

export const fetchStudents = () => async (dispatch) => {
  try {
    const response = await axios.get(apiEndpoints.STUDENTS);
    dispatch({ type: "FETCH_STUDENTS_SUCCESS", payload: response.data });
  } catch (error) {
    console.error("Failed to fetch students:", error);
  }
};

export const createClassroom = (classroomData) => async (dispatch) => {
  try {
    await axios.post(apiEndpoints.CREATE_CLASSROOM, classroomData);
    dispatch({ type: "CREATE_CLASSROOM_SUCCESS" });
  } catch (error) {
    console.error("Failed to create classroom:", error);
  }
};

export const assignClassroom = (teacherId, classroomId) => async (dispatch) => {
  try {
    await axios.post(apiEndpoints.ASSIGN_CLASSROOM, { teacherId, classroomId });
    dispatch({ type: "ASSIGN_CLASSROOM_SUCCESS" });
  } catch (error) {
    console.error("Failed to assign classroom:", error);
  }
};

export const fetchClassroomStudents = () => async (dispatch) => {
  try {
    const response = await axios.get(apiEndpoints.CLASSROOM_STUDENTS);
    dispatch({
      type: "FETCH_CLASSROOM_STUDENTS_SUCCESS",
      payload: response.data,
    });
  } catch (error) {
    console.error("Failed to fetch classroom students:", error);
  }
};
