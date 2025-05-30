import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;

  xp: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Usuario simulado para propósitos de desarrollo
const mockUser: User = {
  id: '1',
  email: 'estudiante@ejemplo.com',
  name: 'Estudiante de Prueba',
  xp: 250
};

export const useAuthStore = create<AuthState>((set) => ({
  // Para propósitos de demo, empezamos con un usuario ya autenticado
  user: mockUser,
  isAuthenticated: true,
  isLoading: false,
  
  login: async (email) => {
    set({ isLoading: true });
    
    try {
      // Simulación de llamada a API (esto se reemplazaría por llamada real)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Usuario simulado
      const user = {
        id: '1',
        email,
        name: email.split('@')[0],
        xp: 0
      };
      
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  register: async (email: string) => {
    set({ isLoading: true });
    
    try {
      // Simulación de llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = {
        id: '1',
        email,
        name: email.split('@')[0],
        xp: 0
      };
      
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  logout: () => {
    set({ 
      user: null, 
      isAuthenticated: false 
    });
  }
})); 