import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
}

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (
    apiCall: () => Promise<any>,
    options: UseApiOptions = {}
  ) => {
    const {
      onSuccess,
      onError,
      showSuccessToast = true,
      showErrorToast = true,
      successMessage = 'Operation completed successfully'
    } = options;

    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      
      if (showSuccessToast) {
        toast.success(successMessage);
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      
      if (showErrorToast) {
        toast.error(errorMessage);
      }
      
      if (onError) {
        onError(errorMessage);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
}

// Specific hooks for different entities
export function useStudents() {
  const { execute, loading, error } = useApi();

  const getStudents = useCallback((params?: any) => 
    execute(() => api.get('/teacher/students', params)), [execute]);

  const createStudent = useCallback((data: any) => 
    execute(() => api.post('/teacher/students', data), {
      successMessage: 'Student created successfully'
    }), [execute]);

  const updateStudent = useCallback((id: number, data: any) => 
    execute(() => api.put(`/teacher/students/${id}`, data), {
      successMessage: 'Student updated successfully'
    }), [execute]);

  const deleteStudent = useCallback((id: number) => 
    execute(() => api.delete(`/teacher/students/${id}`), {
      successMessage: 'Student deleted successfully'
    }), [execute]);

  return {
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    loading,
    error
  };
}

export function useTeachers() {
  const { execute, loading, error } = useApi();

  const getTeachers = useCallback((params?: any) => 
    execute(() => api.get('/admin/teachers', params)), [execute]);

  const createTeacher = useCallback((data: any) => 
    execute(() => api.post('/admin/teachers', data), {
      successMessage: 'Teacher created successfully'
    }), [execute]);

  const updateTeacher = useCallback((id: number, data: any) => 
    execute(() => api.put(`/admin/teachers/${id}`, data), {
      successMessage: 'Teacher updated successfully'
    }), [execute]);

  const deleteTeacher = useCallback((id: number) => 
    execute(() => api.delete(`/admin/teachers/${id}`), {
      successMessage: 'Teacher deleted successfully'
    }), [execute]);

  return {
    getTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    loading,
    error
  };
}

export function useParents() {
  const { execute, loading, error } = useApi();

  const getParents = useCallback((params?: any) => 
    execute(() => api.get('/admin/parents', params)), [execute]);

  const createParent = useCallback((data: any) => 
    execute(() => api.post('/admin/parents', data), {
      successMessage: 'Parent created successfully'
    }), [execute]);

  const updateParent = useCallback((id: number, data: any) => 
    execute(() => api.put(`/admin/parents/${id}`, data), {
      successMessage: 'Parent updated successfully'
    }), [execute]);

  const deleteParent = useCallback((id: number) => 
    execute(() => api.delete(`/admin/parents/${id}`), {
      successMessage: 'Parent deleted successfully'
    }), [execute]);

  return {
    getParents,
    createParent,
    updateParent,
    deleteParent,
    loading,
    error
  };
}

export function useClasses() {
  const { execute, loading, error } = useApi();

  const getClasses = useCallback((params?: any) => 
    execute(() => api.get('/admin/classes', params)), [execute]);

  const createClass = useCallback((data: any) => 
    execute(() => api.post('/admin/classes', data), {
      successMessage: 'Class created successfully'
    }), [execute]);

  const updateClass = useCallback((id: number, data: any) => 
    execute(() => api.put(`/admin/classes/${id}`, data), {
      successMessage: 'Class updated successfully'
    }), [execute]);

  const deleteClass = useCallback((id: number) => 
    execute(() => api.delete(`/admin/classes/${id}`), {
      successMessage: 'Class deleted successfully'
    }), [execute]);

  return {
    getClasses,
    createClass,
    updateClass,
    deleteClass,
    loading,
    error
  };
}

export function useSubjects() {
  const { execute, loading, error } = useApi();

  const getSubjects = useCallback((params?: any) => 
    execute(() => api.get('/admin/subjects', params)), [execute]);

  const createSubject = useCallback((data: any) => 
    execute(() => api.post('/admin/subjects', data), {
      successMessage: 'Subject created successfully'
    }), [execute]);

  const updateSubject = useCallback((id: number, data: any) => 
    execute(() => api.put(`/admin/subjects/${id}`, data), {
      successMessage: 'Subject updated successfully'
    }), [execute]);

  const deleteSubject = useCallback((id: number) => 
    execute(() => api.delete(`/admin/subjects/${id}`), {
      successMessage: 'Subject deleted successfully'
    }), [execute]);

  return {
    getSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
    loading,
    error
  };
}