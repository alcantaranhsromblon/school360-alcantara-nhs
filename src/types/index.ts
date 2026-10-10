export type UserRole = 'public' | 'teacher' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'teacher' | 'admin';
  department?: string;
  position?: string;
  avatarUrl?: string;
  employeeId?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface ApprovedUser {
  id: string;
  email: string;
  fullName: string;
  intendedRole: 'teacher' | 'admin';
  department: string;
  status: 'approved' | 'pending' | 'revoked';
  addedBy: string;
  addedAt: string;
}

export interface SchoolProfileData {
  schoolName: string;
  schoolId: string;
  district: string;
  division: string;
  region: string;
  tagline: string;
  principalName: string;
  principalTitle: string;
  principalMessage: string;
  address: string;
  email: string;
  contactNumber: string;
  facebookPage: string;
  establishedYear: number;
  totalStudents: number;
  totalTeachers: number;
  totalClassrooms: number;
  landArea: string;
}

export interface Campus {
  id: string;
  name: string;
  category: 'Main Campus' | 'Annex / Extension' | 'Senior High School';
  address: string;
  description: string;
  imageUrl: string;
  gradeLevels: string[];
  programsOffered: string[];
  facilities: string[];
  headPersonnel: string;
  contactNumber: string;
  isActive: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  category: 'Academic' | 'DepEd Advisory' | 'Sports' | 'Community' | 'Extracurricular';
  summary: string;
  content: string;
  author: string;
  publishedDate: string;
  imageUrl: string;
  isPublished: boolean;
  featured: boolean;
  tags: string[];
}

export interface AwardItem {
  id: string;
  title: string;
  recipient: string;
  level: 'District' | 'Division' | 'Regional' | 'National' | 'International';
  dateAwarded: string;
  category: 'Academic' | 'Sports' | 'Journalism' | 'Arts & Culture' | 'Faculty & School';
  description: string;
  imageUrl: string;
  isPublished: boolean;
}

export interface ProgramProject {
  id: string;
  title: string;
  status: 'Ongoing' | 'Completed' | 'Upcoming';
  leadOffice: string;
  objectives: string;
  description: string;
  outcomes: string;
  startDate: string;
  endDate?: string;
  imageUrl: string;
  isPublished: boolean;
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  category: 'Academic' | 'Meeting' | 'Celebration' | 'Sports' | 'DepEd Activity';
  description: string;
  imageUrl: string;
  isPublished: boolean;
}

export interface GalleryPhoto {
  id: string;
  caption: string;
  imageUrl: string;
  takenDate: string;
  approved: boolean;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  createdDate: string;
  photos: GalleryPhoto[];
  isPublished: boolean;
}

export interface OrgChartNode {
  id: string;
  fullName: string;
  position: string;
  category: 'Executive Leadership' | 'Department Head' | 'Teaching Personnel' | 'Non-Teaching Personnel' | 'Job Order Support';
  department: string;
  reportsToId?: string; // id of manager
  email?: string;
  phone?: string;
  imageUrl: string;
  order: number;
}

export interface SchoolOrganization {
  id: string;
  code: 'SSLG' | 'YES-O' | 'THE_BEACON' | 'AVANT_GARDE' | string;
  name: string;
  acronym: string;
  description: string;
  objectives: string[];
  adviser: string;
  presidentOrHead: string;
  logoUrl: string;
  officers: { position: string; name: string; gradeLevel: string }[];
  recentActivities: { title: string; date: string; description: string }[];
  announcements: { title: string; date: string; content: string }[];
  isPublished: boolean;
}

export interface SchoolIssuance {
  id: string;
  issuanceNumber: string; // e.g. "School Memo No. 14, s. 2026"
  title: string;
  dateIssued: string;
  category: 'School Memorandum' | 'Division Advisory' | 'DepEd Order' | 'Internal Directive' | 'Curriculum Guide';
  description: string;
  signatory: string;
  fileName: string;
  fileSize: string;
  fileType: 'PDF' | 'DOCX' | 'XLSX';
  downloadUrl: string;
  isArchived: boolean;
}

export interface SchoolUpdate {
  id: string;
  title: string;
  date: string;
  priority: 'High' | 'Normal' | 'Urgent';
  targetAudience: 'All Faculty' | 'JHS Teachers' | 'SHS Teachers' | 'Advisers' | 'Admin Staff';
  content: string;
  postedBy: string;
  attachmentName?: string;
  attachmentSize?: string;
  isArchived: boolean;
}

export interface MonitoringRecord {
  id: string;
  title: string;
  code: string;
  category: 'SBM Assessment' | 'IPCRF/OPCRF' | 'Classroom Observation' | 'DepEd Form 137/SF10' | 'Brigada Eskwela' | 'WASH in Schools (WinS)';
  deadline: string;
  status: 'Pending' | 'Submitted' | 'Reviewed' | 'Completed';
  submittedBy?: string;
  reviewedBy?: string;
  submissionDate?: string;
  academicYear: string;
  remarks?: string;
  attachmentName?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorEmail: string;
  actorRole: UserRole;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'UNPUBLISH' | 'ARCHIVE' | 'DOWNLOAD_PROTECTED' | 'ROLE_CHANGE' | 'LOGIN' | 'LOGOUT';
  module: string;
  itemTitle: string;
  details: string;
}
