const initialState = {
  teachers: [],
  students: [],
  classroomStudents: [],
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_TEACHERS_SUCCESS":
      return { ...state, teachers: action.payload };
    case "FETCH_STUDENTS_SUCCESS":
      return { ...state, students: action.payload };
    case "FETCH_CLASSROOM_STUDENTS_SUCCESS":
      return { ...state, classroomStudents: action.payload };
    default:
      return state;
  }
};

export default dashboardReducer;
