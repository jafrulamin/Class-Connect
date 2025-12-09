import { Course, Message, Resource, Poll, College, CourseDoc } from '../types';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

// CUNY Colleges
export const cunyColleges: College[] = [
  { id: 'baruch', name: 'Baruch College', abbreviation: 'Baruch', domain: 'baruch.cuny.edu' },
  { id: 'hunter', name: 'Hunter College', abbreviation: 'Hunter', domain: 'hunter.cuny.edu' },
  { id: 'brooklyn', name: 'Brooklyn College', abbreviation: 'Brooklyn', domain: 'brooklyn.cuny.edu' },
  { id: 'queens', name: 'Queens College', abbreviation: 'Queens', domain: 'qc.cuny.edu' },
  { id: 'city', name: 'City College', abbreviation: 'CCNY', domain: 'ccny.cuny.edu' },
  { id: 'lehman', name: 'Lehman College', abbreviation: 'Lehman', domain: 'lehman.cuny.edu' },
  { id: 'york', name: 'York College', abbreviation: 'York', domain: 'york.cuny.edu' },
  { id: 'johnjay', name: 'John Jay College', abbreviation: 'John Jay', domain: 'jjay.cuny.edu' },
  { id: 'medgar', name: 'Medgar Evers College', abbreviation: 'Medgar Evers', domain: 'mec.cuny.edu' },
  { id: 'citytech', name: 'City Tech', abbreviation: 'City Tech', domain: 'citytech.cuny.edu' },
  { id: 'bmcc', name: 'BMCC', abbreviation: 'BMCC', domain: 'bmcc.cuny.edu' },
  { id: 'bcc', name: 'Bronx Community College', abbreviation: 'BCC', domain: 'bcc.cuny.edu' },
  { id: 'qcc', name: 'Queensborough Community College', abbreviation: 'QCC', domain: 'qcc.cuny.edu' },
  { id: 'kingsborough', name: 'Kingsborough Community College', abbreviation: 'KCC', domain: 'kbcc.cuny.edu' },
  { id: 'laguardia', name: 'LaGuardia Community College', abbreviation: 'LaGuardia', domain: 'lagcc.cuny.edu' },
  { id: 'hostos', name: 'Hostos Community College', abbreviation: 'Hostos', domain: 'hostos.cuny.edu' },
  { id: 'guttman', name: 'Guttman Community College', abbreviation: 'Guttman', domain: 'guttman.cuny.edu' },
  { id: 'law', name: 'CUNY School of Law', abbreviation: 'CUNY Law', domain: 'law.cuny.edu' },
  { id: 'sps', name: 'School of Professional Studies', abbreviation: 'SPS', domain: 'sps.cuny.edu' },
  { id: 'gradcenter', name: 'Graduate Center', abbreviation: 'Graduate Center', domain: 'gc.cuny.edu' },
  { id: 'soj', name: 'School of Journalism', abbreviation: 'CUNY J-School', domain: 'journalism.cuny.edu' },
];

// Fetch all courses from Firestore
export async function fetchAvailableCourses(): Promise<Course[]> {
  try {
    const coursesRef = collection(db, 'courses');
    const snapshot = await getDocs(coursesRef);
    
    return snapshot.docs.map(doc => {
      const data = doc.data() as CourseDoc;
      // Map CourseDoc to Course interface for UI compatibility
      return {
        id: doc.id,
        name: data.title || data.courseCode || '',
        code: data.catalogNumber 
          ? `${data.subject || ''} ${data.catalogNumber}`.trim()
          : (data.courseCode || ''),
        instructor: data.instructor || 'TBA',
        students: 0, // Not stored in Firestore yet
        collegeId: getCollegeIdFromCode(data.collegeCode || '')
      };
    });
  } catch (err) {
    console.error('Error fetching courses from Firestore:', err);
    return [];
  }
}

// Helper function to map college code to college ID
function getCollegeIdFromCode(collegeCode: string): string {
  const codeMap: Record<string, string> = {
    'HTR01': 'hunter',
    'BKL01': 'brooklyn',
    'QNS01': 'queens',
    'NYC01': 'city',
    'LEH01': 'lehman',
    'YOR01': 'york',
    'JJC01': 'johnjay',
    'MEC01': 'medgar',
    'NYT01': 'citytech',
    'BMC01': 'bmcc',
    'BCC01': 'bcc',
    'QCC01': 'qcc',
    'KCC01': 'kingsborough',
    'LAG01': 'laguardia',
    'HOS01': 'hostos',
    'GUT01': 'guttman',
    'LAW01': 'law',
    'SPS01': 'sps',
    'GRD01': 'gradcenter',
    'JOU01': 'soj',
    'BRC01': 'baruch',
    'BAR01': 'baruch'
  };
  return codeMap[collegeCode] || collegeCode.toLowerCase().replace(/\d+/g, '');
}

export const getAllColleges = (): College[] => {
  return cunyColleges;
};

export const getCollegeById = (collegeId: string): College | undefined => {
  return cunyColleges.find(college => college.id === collegeId);
};


// Get course by ID (fetches from API)
export async function getCourseById(id: string): Promise<Course | null> {
  try {
    const courses = await fetchAvailableCourses();
    return courses.find(course => course.id === id) || null;
  } catch (err) {
    console.error('Error fetching course:', err);
    return null;
  }
}

export const getUserCourses = (): Course[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('userCourses');
  return stored ? JSON.parse(stored) : [];
};

export const leaveCourse = (courseId: string): void => {
  if (typeof window === 'undefined') return;
  const userCourses = getUserCourses();
  const updatedCourses = userCourses.filter(course => course.id !== courseId);
  localStorage.setItem('userCourses', JSON.stringify(updatedCourses));
  
  // Also clear chat messages for this course when leaving
  localStorage.removeItem(`chatMessages_${courseId}`);
};

// Get chat messages from localStorage (persists across page refreshes)
export const getChatMessages = (courseId: string): Message[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(`chatMessages_${courseId}`);
  return stored ? JSON.parse(stored) : [];
};

// Save message to localStorage
export const addMessage = (courseId: string, message: Message): void => {
  if (typeof window === 'undefined') return;
  
  const messages = getChatMessages(courseId);
  messages.push(message);
  localStorage.setItem(`chatMessages_${courseId}`, JSON.stringify(messages));
};

// Get last message from localStorage
export const getLastMessage = (courseId: string): Message | null => {
  const messages = getChatMessages(courseId);
  return messages.length > 0 ? messages[messages.length - 1] : null;
};

// Get course resources from localStorage
export const getCourseResources = (courseId: string): Resource[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(`courseResources_${courseId}`);
  return stored ? JSON.parse(stored) : [];
};

// Add resource to course
export const addCourseResource = (courseId: string, resource: Resource): void => {
  if (typeof window === 'undefined') return;
  const resources = getCourseResources(courseId);
  resources.push(resource);
  localStorage.setItem(`courseResources_${courseId}`, JSON.stringify(resources));
};

// Delete resource from course
export const deleteCourseResource = (courseId: string, resourceId: string): void => {
  if (typeof window === 'undefined') return;
  const resources = getCourseResources(courseId);
  const updatedResources = resources.filter(r => r.id !== resourceId);
  localStorage.setItem(`courseResources_${courseId}`, JSON.stringify(updatedResources));
};

// Get course polls from localStorage
export const getCoursePolls = (courseId: string): Poll[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(`coursePolls_${courseId}`);
  return stored ? JSON.parse(stored) : [];
};

// Add poll to course
export const addCoursePoll = (courseId: string, poll: Poll): void => {
  if (typeof window === 'undefined') return;
  const polls = getCoursePolls(courseId);
  polls.push(poll);
  localStorage.setItem(`coursePolls_${courseId}`, JSON.stringify(polls));
};

// Vote on a poll option
export const voteOnPoll = (courseId: string, pollId: string, optionId: string, userEmail: string): void => {
  if (typeof window === 'undefined') return;
  const polls = getCoursePolls(courseId);
  const poll = polls.find(p => p.id === pollId);
  
  if (!poll) return;
  
  // Remove user's vote from all options first (one vote per user)
  poll.options.forEach(option => {
    option.votes = option.votes.filter(email => email !== userEmail);
  });
  
  // Add vote to selected option
  const option = poll.options.find(o => o.id === optionId);
  if (option && !option.votes.includes(userEmail)) {
    option.votes.push(userEmail);
  }
  
  localStorage.setItem(`coursePolls_${courseId}`, JSON.stringify(polls));
};

// Delete poll from course
export const deleteCoursePoll = (courseId: string, pollId: string): void => {
  if (typeof window === 'undefined') return;
  const polls = getCoursePolls(courseId);
  const updatedPolls = polls.filter(p => p.id !== pollId);
  localStorage.setItem(`coursePolls_${courseId}`, JSON.stringify(updatedPolls));
};