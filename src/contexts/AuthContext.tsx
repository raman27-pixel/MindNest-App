import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isDemoMode: boolean;
  switchRole: (newRole: UserRole) => void;
  loginAsDemo: (role: UserRole) => void;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('PATIENT');
  const [user, setUser] = useState<UserProfile | null>(DEMO_USERS.PATIENT);
  const [isDemoMode] = useState<boolean>(true);

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    setUser(DEMO_USERS[newRole]);
  };

  const loginAsDemo = (targetRole: UserRole) => {
    switchRole(targetRole);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, isDemoMode, switchRole, loginAsDemo, logout }}>
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
