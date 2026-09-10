import React, { createContext, useContext, useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { db } from '../services/db';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isDemoMode: boolean;
  isLoggedIn: boolean;
  switchRole: (newRole: UserRole) => void;
  loginAsDemo: (role: UserRole) => void;
  loginWithGoogle: (role?: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Record<UserRole, UserProfile> = {
  PATIENT: {
    uid: 'patient-anita',
    email: 'anita@mindnest.app',
    displayName: 'Anita Sharma',
    role: 'PATIENT',
    patientId: 'patient-anita-123',
    photoURL: '/images/patient_anita.jpg',
    createdAt: '2026-01-15T08:00:00Z'
  },
  CAREGIVER: {
    uid: 'caregiver-rahul',
    email: 'rahul@mindnest.app',
    displayName: 'Rahul Sharma',
    role: 'CAREGIVER',
    patientId: 'patient-anita-123',
    photoURL: '/images/person_son_gaurav.jpg',
    createdAt: '2026-01-15T08:00:00Z'
  },
  PROFESSIONAL_CAREGIVER: {
    uid: 'pro-priya',
    email: 'priya.nurse@mindnest.app',
    displayName: 'Priya Verma, RN',
    role: 'PROFESSIONAL_CAREGIVER',
    patientId: 'patient-anita-123',
    photoURL: '/images/person_doctor_ashok.jpg',
    createdAt: '2026-02-01T08:00:00Z'
  },
  FAMILY_MEMBER: {
    uid: 'family-sunita',
    email: 'sunita@mindnest.app',
    displayName: 'Sunita Sharma',
    role: 'FAMILY_MEMBER',
    patientId: 'patient-anita-123',
    photoURL: '/images/person_daughter_sunita.jpg',
    createdAt: '2026-01-16T08:00:00Z'
  },
  ADMIN: {
    uid: 'admin-system',
    email: 'admin@mindnest.app',
    displayName: 'System Administrator',
    role: 'ADMIN',
    createdAt: '2026-01-01T08:00:00Z'
  }
};

const LS_KEY_LOGGED_IN = 'mindnest_logged_in';
const LS_KEY_ROLE = 'mindnest_role';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Restore login state from localStorage so it persists across refreshes
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try { return localStorage.getItem(LS_KEY_LOGGED_IN) === 'true'; } catch { return false; }
  });
  const [role, setRole] = useState<UserRole>(() => {
    try { return (localStorage.getItem(LS_KEY_ROLE) as UserRole) || 'CAREGIVER'; } catch { return 'CAREGIVER'; }
  });
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const savedRole = (localStorage.getItem(LS_KEY_ROLE) as UserRole) || 'CAREGIVER';
      const loggedIn = localStorage.getItem(LS_KEY_LOGGED_IN) === 'true';
      return loggedIn ? DEMO_USERS[savedRole] : null;
    } catch { return null; }
  });
  const [isDemoMode] = useState<boolean>(true);

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    setUser(DEMO_USERS[newRole]);
    try { localStorage.setItem(LS_KEY_ROLE, newRole); } catch {}
  };

  const loginAsDemo = (targetRole: UserRole) => {
    switchRole(targetRole);
    setIsLoggedIn(true);
    db.resetTodayActivityCounts();
    try { localStorage.setItem(LS_KEY_LOGGED_IN, 'true'); } catch {}
  };

  // loginWithGoogle: simulates Google OAuth then sets isLoggedIn
  const loginWithGoogle = (targetRole: UserRole = 'CAREGIVER') => {
    switchRole(targetRole);
    setIsLoggedIn(true);
    db.resetTodayActivityCounts();
    try {
      localStorage.setItem(LS_KEY_LOGGED_IN, 'true');
      localStorage.setItem(LS_KEY_ROLE, targetRole);
    } catch {}
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    try {
      localStorage.removeItem(LS_KEY_LOGGED_IN);
      localStorage.removeItem(LS_KEY_ROLE);
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, role, isDemoMode, isLoggedIn, switchRole, loginAsDemo, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
