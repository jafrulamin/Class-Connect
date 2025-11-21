import { Course, Message } from '../types';

// Mock data - in a real app, this would come from a database
const availableCourses: Course[] = [
  { id: '1', name: 'Introduction to Computer Science', code: 'CSC101', instructor: 'Smith', students: 45 },
  { id: '2', name: 'Calculus I', code: 'MATH201', instructor: 'Johnson', students: 38 },
  { id: '3', name: 'English Composition', code: 'ENG101', instructor: 'Williams', students: 52 },
  { id: '4', name: 'Data Structures', code: 'CSC211', instructor: 'Brown', students: 32 },
  { id: '5', name: 'Physics I', code: 'PHY101', instructor: 'Davis', students: 41 },
  { id: '6', name: 'Web Development', code: 'CSC317', instructor: 'Miller', students: 28 },
];

// Hardcoded demo users
const demoUsers = [
  'alex.johnson@cuny.edu',
  'sarah.williams@cuny.edu', 
  'mike.chen@cuny.edu',
  'jessica.martinez@cuny.edu'
];

// Pre-populated chat messages for demonstration
const chatMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      text: 'Hey everyone! Welcome to CSC101 chat',
      sender: 'alex.johnson@cuny.edu',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      courseId: '1'
    },
    {
      id: '2', 
      text: 'Thanks for starting this! Does anyone know when the first assignment is due?',
      sender: 'sarah.williams@cuny.edu',
      timestamp: new Date(Date.now() - 82800000).toISOString(), // 23 hours ago
      courseId: '1'
    },
    {
      id: '3',
      text: 'I think it\'s due next Friday according to the syllabus',
      sender: 'mike.chen@cuny.edu', 
      timestamp: new Date(Date.now() - 79200000).toISOString(), // 22 hours ago
      courseId: '1'
    },
    {
      id: '4',
      text: 'Anyone want to form a study group?',
      sender: 'jessica.martinez@cuny.edu',
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      courseId: '1'
    }
  ],
  '2': [
    {
      id: '1',
      text: 'Calculus chat is live! Who\'s ready for derivatives?',
      sender: 'mike.chen@cuny.edu',
      timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      courseId: '2'
    },
    {
      id: '2',
      text: 'Not me 😅 but we\'ll get through it together',
      sender: 'alex.johnson@cuny.edu',
      timestamp: new Date(Date.now() - 169200000).toISOString(), // 47 hours ago  
      courseId: '2'
    }
  ]
};

export const getAvailableCourses = (): Course[] => {
  return availableCourses;
};

export const getCourseById = (id: string): Course | undefined => {
  return availableCourses.find(course => course.id === id);
};

export const getUserCourses = (): Course[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('userCourses');
  return stored ? JSON.parse(stored) : [];
};

export const getChatMessages = (courseId: string): Message[] => {
  return chatMessages[courseId] || [];
};

export const addMessage = (courseId: string, message: Message): void => {
  if (!chatMessages[courseId]) {
    chatMessages[courseId] = [];
  }
  chatMessages[courseId].push(message);
};