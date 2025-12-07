import { User } from '../types';

const STORAGE_KEY = 'ai_insights_users';
const SESSION_KEY = 'ai_insights_session';

export const registerUser = (email: string, password: string): User => {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  
  if (users[email]) {
    throw new Error('User already exists');
  }

  const newUser = { email, name: email.split('@')[0] };
  users[email] = { ...newUser, password }; // In a real app, never store passwords plain text!
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  
  // Auto login
  localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
  return newUser;
};

export const loginUser = (email: string, password: string): User => {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  const user = users[email];

  if (!user || user.password !== password) {
    throw new Error('Invalid credentials');
  }

  const sessionUser = { email: user.email, name: user.name };
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
  return sessionUser;
};

export const logoutUser = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = (): User | null => {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
};
