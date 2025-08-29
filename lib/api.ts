
// lib/api.ts
export const API_URL = "https://jaja-render-api.onrender.com";


// ===== Token Helpers =====
const getToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");

const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// ===== Auth APIs =====

// 🔑 Login
export const loginApi = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  const data = await res.json();

  // Save tokens
  setTokens(data.token, data.refreshToken);

  return data; // contains { message, token, refreshToken, user }
};

// 🔄 Refresh access token
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token available");

  const res = await fetch(`${API_URL}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: refreshToken }),
  });

  if (!res.ok) throw new Error("Failed to refresh token");

  const data = await res.json();
  localStorage.setItem("accessToken", data.accessToken);
  return data.accessToken;
};

// ===== Authenticated Fetch Wrapper =====
const authFetch = async (url: string, options: RequestInit = {}) => {
  let token = getToken();
  if (!token) throw new Error("No access token found, please login first");

  options.headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  let res = await fetch(url, options);

  // if expired, refresh and retry
  if (res.status === 401 || res.status === 403) {
    token = await refreshAccessToken();
    options.headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    };
    res = await fetch(url, options);
  }

  return res;
};

// ===== Parent APIs =====
export const createParentApi = async (data: {
  full_name: string;
  email: string;
  phone?: string;
  occupation?: string;
  address?: string;
}) => {
  const res = await authFetch(`${API_URL}/parents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create parent: ${errorText}`);
  }

  return res.json();
};


// ✅ Get All Active Parents
export const getParentsApi = async () => {
  const res = await authFetch(`${API_URL}/parentlist`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch parents: ${errorText}`);
  }

  return res.json(); // returns array of parents
};



// ✅ Update Parent
export const updateParentApi = async (data: {
  id: number;
  full_name?: string;
  email?: string;
  phone?: string;
  occupation?: string;
  address?: string;
}) => {
  const res = await authFetch(`${API_URL}/parentsupdate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update parent: ${errorText}`);
  }

  return res.json();
};

// ✅ Delete Parent
export const deleteParentApi = async (id: number) => {
  const res = await authFetch(`${API_URL}/parentsdelete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to delete parent: ${errorText}`);
  }

  return res.json();
};




//add teacher
export const addTeacherApi = async (teacherData: {
  teacher_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  qualification: string;
  experience_years:number
}) => {
  try {
    console.log("Sending teacher data:", teacherData);
    const res = await authFetch(`${API_URL}/teachers`, { // Changed to lowercase for consistency
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teacherData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to add teacher: ${errorText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Add teacher API error:', error);
    throw error; // Re-throw to be caught by the caller
  }
};


// get all teacher
  export const getTeachersApi = async () => {
    const res = await authFetch(`${API_URL}/teacherlist`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch teachers: ${errorText}`);
    }
  
    return res.json(); // array of teachers
  };
  

  //update teacher
export const updateTeachersApi = async (data: {
  teacher_id: string; // varchar now
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  qualification?: string;
  experience_years?: number;
}) => {
  const res = await authFetch(`${API_URL}/teachersupdate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update teacher: ${errorText}`);
  }

  return res.json();
};


// deleteTeacherApi
export const deleteTeacherApi = async (teacher_id: string) => {
  const res = await authFetch(`${API_URL}/teacherdelete`, {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify({ teacher_id }),
   });
 
   if (!res.ok) {
     throw new Error("Failed to delete teacher");
   }
 
   return res.json();
 };


 // Create Class
export const createClassApi = async (data: {
  name: string;
  description?: string;
  sections: string; // <-- comma-separated string from the form
  isActive: boolean;
}) => {
  const res = await authFetch(`${API_URL}/classes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create class: ${errorText}`);
  }

  return res.json();
};


// Define the Class type (adjust fields as needed to match your backend response)
export type Class = {
  id: number;
  name: string;
  description?: string;
  sections: string;
  isActive: boolean;
  // Add other fields as needed
};

// Get all classes with sections and capacities
export const getClassesApi = async (): Promise<Class[]> => {
  const res = await authFetch(`${API_URL}/classes`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch classes: ${errorText}`);
  }

  const data = await res.json();
  console.log("Fetched classes:", JSON.stringify(data, null, 2)); // Debug to verify capacity
  return data; // Returns array of classes with sections and capacity
};

// Get Single Class by ID
export const getClassByIdApi = async (id: number) => {
  const res = await authFetch(`${API_URL}/classes/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch class: ${errorText}`);
  }

  return res.json();
};

// Update Class
export const updateClassApi = async (id: number, data: { name?: string; description?: string; is_active?: boolean }) => {
  const res = await authFetch(`${API_URL}/classes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update class: ${errorText}`);
  }

  return res.json();
};

// Delete Class
export const deleteClassApi = async (id: number) => {
  const res = await authFetch(`${API_URL}/classes/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to delete class: ${errorText}`);
  }

  return res.json();
};



// Create Subject
export const createSubjectApi = async (subject: {
  name: string;
  description?: string;
  classId: number;
  teacherId: number;
}) => {
  const res = await authFetch(`${API_URL}/createsubjects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subject),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create subject: ${errorText}`);
  }

  return res.json();
};

// Get All Subjects
export const getSubjectsApi = async () => {
  const response = await authFetch(`${API_URL}/subjects`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch subjects: ${errorText}`);
  }

  return response.json();
};
// Update Subject
export const updateSubjectApi = async (
  id: number,
  subject: {
    name: string;
    description?: string;
    classId: number;
    teacherId: number;
  }
) => {
  const res = await authFetch(`${API_URL}/updatesubjects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subject),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update subject: ${errorText}`);
  }

  return res.json();
};

// Delete Subject
export const deleteSubjectApi = async (id: number) => {
  const res = await authFetch(`${API_URL}/deletesubjects/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to delete subject: ${errorText}`);
  }

  return res.json();
};


        //================== ===== Student APIs ==========================================
export const createStudentApi = async (payload: any) => {
  const res = await authFetch(`${API_URL}/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload), // send what StudentForm already built
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create student: ${errorText}`);
  }

  return res.json();
};


// ===== Student APIs =====
export const getStudentsApi = async () => {
  const res = await authFetch(`${API_URL}/students`, {
    method: "GET",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch students: ${errorText}`);
  }

  return res.json(); // { count, data }
};

// ===== Update Student API =====
export const updateStudentApi = async (student: any) => {
  const res = await authFetch(`${API_URL}/updateStudent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(student), // student object should include `id`
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update student: ${errorText}`);
  }

  return res.json(); // { message: "Student updated successfully" }
};

// ===== Deactivate Student API =====
export const deactivateStudentApi = async (id: number) => {
  const res = await authFetch(`${API_URL}/deactivateStudent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },  // 👈 ensure this
    body: JSON.stringify({ id }),                     // 👈 wrapped object
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to deactivate student: ${errorText}`);
  }

  return res.json();
};

// 🔹 Get all classes
export const getclassesforstudents = async () => {
  const res = await authFetch(`${API_URL}/getclassesforstudents`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch classes: ${errorText}`);
  }

  return res.json(); // returns array of classes
};

// 🔹 Get all sections
export const getSectionsApi = async () => {
  const res = await authFetch(`${API_URL}/getsectionsforstudents`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch sections: ${errorText}`);
  }

  return res.json(); // returns array of sections
};


// ✅ Add marks
export const addMarksApi = async (payload: any) => {
  const res = await authFetch(`${API_URL}/api/marks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to add marks: ${errorText}`);
  }

  return res.json();
};

// ✅ Fetch classes for marks form
export const getClassesForMarksApi = async () => {
  const res = await authFetch(`${API_URL}/api/marks/classes`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch classes: ${errorText}`);
  }

  return res.json();
};

// ✅ Fetch students by class
export const getStudentsForMarksApi = async (classId: number) => {
  const res = await authFetch(`${API_URL}/api/marks/students/${classId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch students: ${errorText}`);
  }

  return res.json();
};

// ✅ Fetch subjects
export const getSubjectsForMarksApi = async () => {
  const res = await authFetch(`${API_URL}/api/marks/subjects`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch subjects: ${errorText}`);
  }

  return res.json();
};

// 🔹 Get all marks
export const getMarksApi = async () => {
  const res = await authFetch(`${API_URL}/api/marks`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch marks: ${errorText}`);
  }

  return res.json();
};

// 🔹 Get marks for a single student
export const getStudentMarksApi = async (studentId: number) => {
  const res = await authFetch(`${API_URL}/api/marks/${studentId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch student marks: ${errorText}`);
  }

  return res.json();
};

// Update Marks
export const updateMarksApi = async (
  id: number,
  mark: {
    studentId: number;
    subjectId: number;
    classId: number;
    examType: string;
    marksObtained: number;
    totalMarks: number;
    examDate?: string;
    remarks?: string;
  }
) => {
  const res = await authFetch(`${API_URL}/api/marks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mark),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update mark: ${errorText}`);
  }

  return res.json();
};


//============================================entry and exit================================================


// ===== Entry/Exit APIs =====
export const addStudentEntryExitApi = async (
  studentId: number,
  status: "ENTRY" | "EXIT",
  classId: number,
  sectionId: number
) => {
  const res = await authFetch(`${API_URL}/student-entry-exit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId, status, classId, sectionId }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to add entry/exit: ${errorText}`);
  }

  return res.json();
};

export const getStudentsByClassSectionApi = async (
  classId: number,
  sectionId: number
) => {
  if (!classId || !sectionId) {
    throw new Error("classId and sectionId are required to fetch students");
  }

  try {
    const res = await authFetch(
      `${API_URL}/students-by-class-section?classId=${classId}&sectionId=${sectionId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch students: ${errorText}`);
    }

    return res.json();
  } catch (error) {
    console.error("getStudentsByClassSectionApi error:", error, {
      classId,
      sectionId,
    });
    throw error;
  }
};

// ✅ Get student entry/exit logs (uses stored procedure)
export const getStudentEntryExitApi = async (
  date: string,
  classId?: number,
  sectionId?: number
) => {
  const params = new URLSearchParams();
  params.append("date", date);
  if (classId) params.append("classId", String(classId));
  if (sectionId) params.append("sectionId", String(sectionId));

  const response = await authFetch(
    `${API_URL}/students-entry-exit?${params.toString()}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch student entry/exit data: ${errorText}`);
  }

  return response.json();
};
// Get Sections by Class API
export const getSectionsApientryexit = async (classId: number) => {
  if (!classId) {
    throw new Error("classId is required to fetch sections");
  }

  try {
    const res = await authFetch(
      `${API_URL}/sections?classId=${classId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch sections: ${errorText}`);
    }

    return res.json();
  } catch (error) {
    console.error("getSectionsApi error:", error, { classId });
    throw error;
  }
};

