import { User, AuthState } from '@/types';

// Mock JWT functions - replace with actual JWT implementation
export const mockAuth = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    // Mock login - replace with actual API call
    const mockUsers = [
      { id: 1, email: 'admin@school.com', role: 'admin' as const, password: 'admin123' },
      { id: 2, email: 'teacher@school.com', role: 'teacher' as const, password: 'teacher123' },
      { id: 3, email: 'parent@school.com', role: 'parent' as const, password: 'parent123' },
    ];

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = user;
    return {
      user: {
        ...userWithoutPassword,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      token: `mock-jwt-token-${user.id}`,
    };
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user-data');
    }
  },

  getCurrentUser: (): User | null => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user-data');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  },

  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth-token');
    }
    return null;
  },

  setAuth: (user: User, token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user-data', JSON.stringify(user));
      localStorage.setItem('auth-token', token);
    }
  },

  isAuthenticated: (): boolean => {
    return !!mockAuth.getToken();
  },
};