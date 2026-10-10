import {
  SchoolProfileData,
  Campus,
  NewsItem,
  AwardItem,
  ProgramProject,
  SchoolEvent,
  GalleryAlbum,
  OrgChartNode,
  SchoolOrganization,
  SchoolIssuance,
  SchoolUpdate,
  MonitoringRecord,
  ApprovedUser,
  UserProfile,
  AuditLog
} from '../types';

export const initialSchoolProfile: SchoolProfileData = {
  schoolName: 'Alcantara National High School',
  schoolId: '301747',
  district: 'District of Alcantara',
  division: 'Division of Romblon',
  region: 'Region IV-B (MIMAROPA)',
  tagline: 'Nurturing Minds, Cultivating Character, Empowering Romblomanon Youth',
  principalName: 'Dr. Rodolfo M. Festin, EdD',
  principalTitle: 'Secondary School Principal IV',
  principalMessage: 'Welcome to the official digital portal of Alcantara National High School. Grounded in the DepEd MATATAG Agenda, we remain steadfast in providing equitable, high-quality, and character-building education to every learner in the Municipality of Alcantara and across Romblon. This unified portal stands as our commitment to transparency, academic excellence, and community partnership.',
  address: 'National Highway, Barangay Poblacion, Alcantara, Romblon 5509, Philippines',
  email: '301747@deped.gov.ph',
  contactNumber: '+63 917 842 1747',
  facebookPage: 'facebook.com/AlcantaraNHS301747',
  establishedYear: 1968,
  totalStudents: 1420,
  totalTeachers: 68,
  totalClassrooms: 36,
  landArea: '2.8 Hectares'
};

export const initialCampuses: Campus[] = [
  {
    id: 'campus-1',
    name: 'Main Campus (Poblacion)',
    category: 'Main Campus',
    address: 'Barangay Poblacion, Alcantara, Romblon',
    description: 'The administrative and academic heart of Alcantara National High School, housing the Junior High School complex, Science Laboratory Pavilion, and central library.',
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
    gradeLevels: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'],
    programsOffered: ['Regular Basic Education Curriculum (BEC)', 'Special Program in Science, Technology & Engineering (STE)', 'Special Program in the Arts (SPA)'],
    facilities: ['Central Administration Building', 'DepEd Computer Laboratory (DCP)', 'Science & Innovation Lab', 'School Gymnasium / Covered Court', 'School Library & Multimedia Hub', 'Canteen & Feeding Center'],
    headPersonnel: 'Dr. Rodolfo M. Festin, Secondary School Principal IV',
    contactNumber: '+63 917 842 1747',
    isActive: true
  },
  {
    id: 'campus-2',
    name: 'San Agustin Annex Campus',
    category: 'Annex / Extension',
    address: 'Sitio Balogo, Barangay San Agustin, Alcantara, Romblon',
    description: 'Serving learners from the agricultural upland and coastal barangays with complete Junior High School curriculum and community-centered learning environments.',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
    gradeLevels: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'],
    programsOffered: ['Junior High School General Curriculum', 'Agri-Fishery Arts Pre-Vocational Track'],
    facilities: ['Instructional Classrooms', 'School Garden (Gulayan sa Paaralan)', 'Reading Corner & Learning Resource Room', 'Multi-Purpose Activity Shed'],
    headPersonnel: 'Mrs. Cynthia M. Gomez, Master Teacher II / Officer-in-Charge',
    contactNumber: '+63 919 551 2890',
    isActive: true
  },
  {
    id: 'campus-3',
    name: 'Senior High School Complex',
    category: 'Senior High School',
    address: 'East Academic Zone, Poblacion, Alcantara, Romblon',
    description: 'A modern two-story academic and technical-vocational pavilion dedicated to preparing Grade 11 and 12 students for higher education, employment, and entrepreneurship.',
    imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80',
    gradeLevels: ['Grade 11', 'Grade 12'],
    programsOffered: [
      'Academic Track: STEM (Science, Technology, Engineering & Mathematics)',
      'Academic Track: ABM (Accountancy, Business & Management)',
      'Academic Track: HUMSS (Humanities & Social Sciences)',
      'TVL Track: Information and Communications Technology (ICT)',
      'TVL Track: Agri-Fishery Arts (Crop Production & Food Processing)'
    ],
    facilities: ['SHS Science & Robotics Hub', 'Computer Drafting & Coding Lab', 'Commercial Cooking & Baking Workshop', 'Mock Hotel & Tourism Suite', 'Guidance & Career Counseling Office'],
    headPersonnel: 'Mr. Emmanuel P. Morales, Assistant Principal II for Senior High School',
    contactNumber: '+63 928 412 9033',
    isActive: true
  }
];

export const initialNews: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Alcantara NHS Clinches 1st Place at Division Science and Innovation Fair 2026',
    slug: 'alcantara-nhs-clinches-division-science-fair-2026',
    category: 'Academic',
    summary: 'STE student researchers bag gold medal for their innovative bio-plastic study using local Romblon agricultural by-products.',
    content: 'Student researchers from the Special Science Class of Alcantara National High School brought honor to the District of Alcantara by capturing the First Place trophy in the Life Science Category at the 2026 Division Science and Innovation Fair held at Odiongan, Romblon.\n\nThe project, spearheaded by Grade 10 researchers under research adviser Mrs. Eleanor G. Tan, developed biodegradable packaging films synthesized from cassava starch and discarded coconut husk fibers sourced locally.\n\n"This victory reflects our school\'s commitment to inquiry-based learning and sustainable community problem-solving," stated School Principal Dr. Rodolfo M. Festin during the flag ceremony recognition rites.',
    author: 'The Beacon Editorial Board',
    publishedDate: '2026-10-02',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80',
    isPublished: true,
    featured: true,
    tags: ['Science Fair', 'STE', 'Division Level', 'Innovation', 'Student Research']
  },
  {
    id: 'news-2',
    title: 'DepEd Division of Romblon Conducts Ocular Inspection for New STEM Laboratory Building',
    slug: 'deped-division-ocular-inspection-stem-building',
    category: 'DepEd Advisory',
    summary: 'Schools Division Superintendent and Education Program Supervisors assess newly completed facilities ahead of the next academic term.',
    content: 'Officials from the Schools Division of Romblon visited Alcantara National High School yesterday to inspect the newly completed 4-classroom laboratory building funded under the Basic Educational Facilities Fund (BEFF).\n\nThe technical inspection confirmed compliance with national seismic standards, digital accessibility conduits, and solar power integration. The new facility will accommodate senior high school STEM laboratories starting next semester.',
    author: 'Office of the Principal',
    publishedDate: '2026-09-28',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80',
    isPublished: true,
    featured: false,
    tags: ['DepEd', 'Infrastructure', 'BEFF', 'STEM Lab']
  },
  {
    id: 'news-3',
    title: 'Alcantara Blue Marlins Triumph in Municipal Athletic Meet, Heading to Division Palaro',
    slug: 'alcantara-blue-marlins-municipal-athletic-meet-2026',
    category: 'Sports',
    summary: 'Secondary athletes dominate volleyball, athletics, and chess events to retain the overall municipal championship trophy.',
    content: 'The official sports delegation of Alcantara National High School, known as the Blue Marlins, displayed exceptional sportsmanship and grit during the 3-day Municipal Athletic Meet concluded last Friday.\n\nThe Blue Marlins swept championship titles in Boys\' and Girls\' Volleyball, Secondary Chess, and 4x100m Track Relays. Head Coach Coach Alberto Perez expressed confidence that the qualifying athletes will represent the District with pride at the upcoming Division Palaro in Romblon, Romblon.',
    author: 'MAPEH Department',
    publishedDate: '2026-09-20',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=80',
    isPublished: true,
    featured: false,
    tags: ['Sports', 'Athletics', 'Municipal Meet', 'Blue Marlins']
  },
  {
    id: 'news-4',
    title: 'School-Based Brigada Eskwela Recognized as Most Sustained Green School in Romblon',
    slug: 'brigada-eskwela-most-sustained-green-school',
    category: 'Community',
    summary: 'Partnership between parents, barangay officials, alumni, and YES-O yields top environmental sustainability rating.',
    content: 'Alcantara National High School has been cited as a model school for environmental stewardship in the Division of Romblon. Through year-round collaboration with the Barangay Council of Poblacion, the Parent-Teacher Association (PTA), and the Youth for Environment in Schools Organization (YES-O), the school maintains a zero-waste segregation facility, rainwater harvesting systems, and an organic vegetable garden that supplies the daily school feeding program.',
    author: 'YES-O Information Desk',
    publishedDate: '2026-09-12',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80',
    isPublished: true,
    featured: false,
    tags: ['Brigada Eskwela', 'Environment', 'YES-O', 'Community Engagement']
  }
];

export const initialAwards: AwardItem[] = [
  {
    id: 'award-1',
    title: '1st Place - Life Science (Secondary Level)',
    recipient: 'Alcantara NHS Junior Researchers (Grade 10 STE)',
    level: 'Division',
    dateAwarded: '2026-10-02',
    category: 'Academic',
    description: 'Awarded at the 2026 Division Science & Technology Fair for the bio-degradable polymer formulation project.',
    imageUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80',
    isPublished: true
  },
  {
    id: 'award-2',
    title: 'Best School-Based Management (SBM) Level III Practitioner',
    recipient: 'Alcantara National High School Faculty & Staff',
    level: 'Regional',
    dateAwarded: '2026-07-15',
    category: 'Faculty & School',
    description: 'Conferred by DepEd Regional Office IV-B MIMAROPA for exemplary institutional governance and community accountability.',
    imageUrl: 'https://images.unsplash.com/photo-1579389083078-4e7018379f7e?auto=format&fit=crop&w=800&q=80',
    isPublished: true
  },
  {
    id: 'award-3',
    title: 'Overall Champion - Secondary English Collaborative Desktop Publishing',
    recipient: 'The Beacon Editorial Team',
    level: 'Division',
    dateAwarded: '2026-05-18',
    category: 'Journalism',
    description: 'Division Schools Press Conference (DSPC 2026) championship trophy and qualifier to RSPC.',
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
    isPublished: true
  },
  {
    id: 'award-4',
    title: 'Best Brigada Eskwela Implementer (Mega Secondary School Category)',
    recipient: 'Alcantara NHS Stakeholders & PTA Council',
    level: 'Division',
    dateAwarded: '2025-11-20',
    category: 'Faculty & School',
    description: 'Recognized for highest volunteer hours and community mobilization across secondary schools in Romblon.',
    imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80',
    isPublished: true
  }
];

export const initialPrograms: ProgramProject[] = [
  {
    id: 'prog-1',
    title: 'Project TULAY: Technology-Utilized Learning for All Romblomanon Youth',
    status: 'Ongoing',
    leadOffice: 'ICT Department & Academic Coordination',
    objectives: 'Equip every student and teacher with digital learning platforms, hybrid offline LMS caches, and digital literacy training.',
    description: 'Project TULAY bridges the archipelagic connectivity divide by establishing localized offline digital learning caches (DepEd Commons servers) inside campus computer labs.',
    outcomes: '100% of Junior and Senior High school faculty trained; 68 active digital lesson modules implemented across science and mathematics.',
    startDate: '2025-06-01',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    isPublished: true
  },
  {
    id: 'prog-2',
    title: 'Gulayan sa Paaralan & Sustainable School Canteen Feeding Initiative',
    status: 'Ongoing',
    leadOffice: 'YES-O & TLE Agri-Fishery Department',
    objectives: 'Zero malnourished learners through organic vegetable cultivation within campus grounds.',
    description: 'A student-maintained hydroponic and open-field farm harvesting fresh leafy vegetables, squash, and legumes used directly in the school nutritional program.',
    outcomes: 'Decreased wasted and severely wasted learner rates by 84% over 18 months.',
    startDate: '2024-08-15',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=800&q=80',
    isPublished: true
  },
  {
    id: 'prog-3',
    title: 'Project KALINGA: Peer Mental Health & Guidance Support Network',
    status: 'Ongoing',
    leadOffice: 'Guidance and Counseling Office & SSLG',
    objectives: 'Provide safe spaces, psychosocial first aid, and structured peer-listening circles for adolescent learners.',
    description: 'Organizes monthly wellness check-ins, anti-bullying awareness workshops, and adolescent health forums.',
    outcomes: 'Over 450 student consultations handled; established designated Wellness Nook in library.',
    startDate: '2025-01-10',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    isPublished: true
  }
];

export const initialEvents: SchoolEvent[] = [
  {
    id: 'event-1',
    title: '2nd Quarter Nationwide Simultaneous Earthquake Drill (NSED)',
    date: '2026-10-15',
    time: '09:00 AM - 10:30 AM',
    venue: 'Alcantara NHS Main & Annex Grounds',
    status: 'Upcoming',
    category: 'DepEd Activity',
    description: 'Standard disaster preparedness drill coordinated with the Municipal Disaster Risk Reduction and Management Office (MDRRMO) Alcantara.',
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
    isPublished: true
  },
  {
    id: 'event-2',
    title: 'General Assembly of the Parent-Teacher Association (PTA)',
    date: '2026-10-24',
    time: '01:30 PM - 04:30 PM',
    venue: 'School Gymnasium',
    status: 'Upcoming',
    category: 'Meeting',
    description: 'Presentation of mid-year financial statements, School Improvement Plan (SIP) progress, and distribution of Report Cards.',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    isPublished: true
  },
  {
    id: 'event-3',
    title: 'National Teachers\' Day Culminating Celebration',
    date: '2026-10-05',
    time: '08:00 AM - 05:00 PM',
    venue: 'Campus Grounds & Covered Court',
    status: 'Completed',
    category: 'Celebration',
    description: 'Student-led celebration honoring the 68 dedicated educators of Alcantara NHS with musical tributes, gifts, and sportsfest.',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    isPublished: true
  }
];

export const initialAlbums: GalleryAlbum[] = [
  {
    id: 'album-1',
    title: 'National Teachers Day 2026 Tributes',
    description: 'Highlights from the heartfelt student tributes, games, and fellowship program honoring our hardworking faculty.',
    coverImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    createdDate: '2026-10-06',
    isPublished: true,
    photos: [
      {
        id: 'p-1',
        caption: 'Faculty group photo during opening ceremonies in covered court',
        imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80',
        takenDate: '2026-10-05',
        approved: true
      },
      {
        id: 'p-2',
        caption: 'SSLG officers presenting handmade floral bouquets to veteran teachers',
        imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80',
        takenDate: '2026-10-05',
        approved: true
      },
      {
        id: 'p-3',
        caption: 'Cultural dance performance presented by Special Program in the Arts students',
        imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
        takenDate: '2026-10-05',
        approved: true
      }
    ]
  },
  {
    id: 'album-2',
    title: 'Division Science & Technology Fair 2026',
    description: 'Memorable moments from the Romblon Division Science Fair competitions.',
    coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    createdDate: '2026-10-03',
    isPublished: true,
    photos: [
      {
        id: 'p-4',
        caption: 'Grade 10 STE researchers presenting data to the panel of DOST evaluators',
        imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80',
        takenDate: '2026-10-02',
        approved: true
      },
      {
        id: 'p-5',
        caption: 'Awarding ceremonies at the Division of Romblon gymnasium',
        imageUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=1000&q=80',
        takenDate: '2026-10-02',
        approved: true
      }
    ]
  },
  {
    id: 'album-3',
    title: 'Green Campus & Gulayan sa Paaralan Project',
    description: 'Our agro-ecological gardens, seedling nursery, and environmental drives in partnership with YES-O.',
    coverImage: 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=800&q=80',
    createdDate: '2026-09-18',
    isPublished: true,
    photos: [
      {
        id: 'p-6',
        caption: 'Junior High students harvesting organic greens for the school supplementary feeding',
        imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=1000&q=80',
        takenDate: '2026-09-15',
        approved: true
      },
      {
        id: 'p-7',
        caption: 'Tree planting activity along the perimeter buffer zone of Alcantara NHS',
        imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80',
        takenDate: '2026-09-15',
        approved: true
      }
    ]
  }
];

export const initialOrgChart: OrgChartNode[] = [
  {
    id: 'org-1',
    fullName: 'Dr. Rodolfo M. Festin, EdD',
    position: 'Secondary School Principal IV',
    category: 'Executive Leadership',
    department: 'Office of the School Principal',
    email: 'rodolfo.festin@deped.gov.ph',
    phone: '+63 917 842 1747',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    order: 1
  },
  {
    id: 'org-2',
    fullName: 'Mr. Emmanuel P. Morales, MAEd',
    position: 'Assistant Principal II (Senior High School)',
    category: 'Executive Leadership',
    department: 'Senior High School Academic Council',
    reportsToId: 'org-1',
    email: 'emmanuel.morales@deped.gov.ph',
    phone: '+63 928 412 9033',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    order: 2
  },
  {
    id: 'org-3',
    fullName: 'Mrs. Lydia S. Familaran, MAEd',
    position: 'Assistant Principal II (Junior High School)',
    category: 'Executive Leadership',
    department: 'Junior High School Academic Affairs',
    reportsToId: 'org-1',
    email: 'lydia.familaran@deped.gov.ph',
    phone: '+63 919 782 4410',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    order: 3
  },
  // Department Heads
  {
    id: 'org-4',
    fullName: 'Mrs. Eleanor G. Tan, MST',
    position: 'Head Teacher III - Science & Technology',
    category: 'Department Head',
    department: 'Science & Mathematics Department',
    reportsToId: 'org-3',
    email: 'eleanor.tan@deped.gov.ph',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    order: 4
  },
  {
    id: 'org-5',
    fullName: 'Mr. Vicente A. Montesa',
    position: 'Head Teacher III - Mathematics',
    category: 'Department Head',
    department: 'Mathematics Department',
    reportsToId: 'org-3',
    email: 'vicente.montesa@deped.gov.ph',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    order: 5
  },
  {
    id: 'org-6',
    fullName: 'Mrs. Maria Corazon D. Reyes',
    position: 'Head Teacher III - English & Humanities',
    category: 'Department Head',
    department: 'Languages Department',
    reportsToId: 'org-3',
    email: 'maria.reyes@deped.gov.ph',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    order: 6
  },
  {
    id: 'org-7',
    fullName: 'Mr. Danilo K. Mingoa',
    position: 'Head Teacher II - TLE & TVL Tracks',
    category: 'Department Head',
    department: 'Technology and Livelihood Education',
    reportsToId: 'org-2',
    email: 'danilo.mingoa@deped.gov.ph',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    order: 7
  },
  // Master Teachers & Faculty
  {
    id: 'org-8',
    fullName: 'Mrs. Cynthia M. Gomez',
    position: 'Master Teacher II / Annex OIC',
    category: 'Teaching Personnel',
    department: 'San Agustin Annex Campus',
    reportsToId: 'org-1',
    email: 'cynthia.gomez@deped.gov.ph',
    imageUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80',
    order: 8
  },
  {
    id: 'org-9',
    fullName: 'Mr. Roberto T. Santos',
    position: 'Master Teacher I - Senior High STEM',
    category: 'Teaching Personnel',
    department: 'Senior High School Department',
    reportsToId: 'org-2',
    email: 'teacher.santos@alcantara.deped.gov.ph',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    order: 9
  },
  {
    id: 'org-10',
    fullName: 'Ms. Clarisse B. Galindez',
    position: 'Teacher III - English & School Paper Adviser',
    category: 'Teaching Personnel',
    department: 'Languages Department',
    reportsToId: 'org-6',
    email: 'clarisse.galindez@deped.gov.ph',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    order: 10
  },
  {
    id: 'org-11',
    fullName: 'Mr. Ronald F. Maaba',
    position: 'Teacher II - Social Studies / SSLG Adviser',
    category: 'Teaching Personnel',
    department: 'Araling Panlipunan Department',
    reportsToId: 'org-3',
    email: 'ronald.maaba@deped.gov.ph',
    imageUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    order: 11
  },
  // Non-teaching & Job order
  {
    id: 'org-12',
    fullName: 'Atty. Jayson L. Fronda, CPA',
    position: 'Administrative Officer II (HR & Records)',
    category: 'Non-Teaching Personnel',
    department: 'Administrative and Support Services',
    reportsToId: 'org-1',
    email: 'jayson.fronda@deped.gov.ph',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    order: 12
  },
  {
    id: 'org-13',
    fullName: 'Mrs. Evelyn R. Solis',
    position: 'Senior Bookkeeper / Disbursing Officer',
    category: 'Non-Teaching Personnel',
    department: 'Finance and Accounting Unit',
    reportsToId: 'org-12',
    email: 'evelyn.solis@deped.gov.ph',
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
    order: 13
  },
  {
    id: 'org-14',
    fullName: 'Mr. Danilo P. Riano',
    position: 'Security & Campus Grounds Head',
    category: 'Job Order Support',
    department: 'General Services & Physical Plant',
    reportsToId: 'org-12',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    order: 14
  }
];

export const initialOrganizations: SchoolOrganization[] = [
  {
    id: 'org-sslg',
    code: 'SSLG',
    name: 'Supreme Secondary Learner Government',
    acronym: 'SSLG',
    description: 'The highest governing body of learners in Alcantara National High School, promoting democratic governance, youth empowerment, student rights, and proactive leadership across both campuses.',
    objectives: [
      'Represent student voice in school governance and decision-making bodies',
      'Foster responsible leadership, civic duty, and integrity among learners',
      'Initiate student-led welfare and environmental protection programs',
      'Collaborate with school administration to enrich campus life'
    ],
    adviser: 'Mr. Ronald F. Maaba, Teacher II',
    presidentOrHead: 'Joshua Caleb M. Romero (Grade 12 STEM)',
    logoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
    officers: [
      { position: 'President', name: 'Joshua Caleb M. Romero', gradeLevel: 'Grade 12 STEM' },
      { position: 'Vice President (JHS)', name: 'Alyssa Mae S. Famorcan', gradeLevel: 'Grade 10 STE' },
      { position: 'Vice President (SHS)', name: 'Keith Andrei G. Prado', gradeLevel: 'Grade 11 HUMSS' },
      { position: 'Secretary', name: 'Krizza Joy D. Rivas', gradeLevel: 'Grade 11 ABM' },
      { position: 'Treasurer', name: 'Mark Angelo B. Festin', gradeLevel: 'Grade 10 STE' },
      { position: 'Auditor', name: 'Nicole Anne L. Galus', gradeLevel: 'Grade 9 Regular' },
      { position: 'Public Information Officer', name: 'Christian Dave E. Falculan', gradeLevel: 'Grade 12 TVL-ICT' }
    ],
    recentActivities: [
      {
        title: 'Project LINGKOD: Leadership Training for Class Officers',
        date: '2026-09-08',
        description: 'Trained 140 section presidents and vice presidents on parliamentary procedure, project management, and conflict resolution.'
      },
      {
        title: 'Anti-Bullying & Cyber-Safety Campaign Week',
        date: '2026-08-22',
        description: 'Conducted classroom symposiums with guest resource speakers from PNP Alcantara.'
      }
    ],
    announcements: [
      {
        title: 'Call for Proposals: Student Innovation & Campus Improvement Fund 2026',
        date: '2026-10-04',
        content: 'All accredited homeroom sections may submit community mini-project proposals to the SSLG office before October 28.'
      }
    ],
    isPublished: true
  },
  {
    id: 'org-yeso',
    code: 'YES-O',
    name: 'Youth for Environment in Schools Organization',
    acronym: 'YES-O',
    description: 'The premier co-curricular environmental organization tasked with climate action, ecological conservation, biodiversity protection, and sustainable school management in Alcantara NHS.',
    objectives: [
      'Spearhead environmental stewardship and tree planting around Alcantara',
      'Maintain the school materials recovery facility (MRF) and zero-plastic policy',
      'Manage organic waste composting for the Gulayan sa Paaralan initiative',
      'Promote water conservation and renewable energy awareness'
    ],
    adviser: 'Mrs. Eleanor G. Tan, Head Teacher III',
    presidentOrHead: 'Sofia Beatrice L. Montesa (Grade 10 STE)',
    logoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80',
    officers: [
      { position: 'President', name: 'Sofia Beatrice L. Montesa', gradeLevel: 'Grade 10 STE' },
      { position: 'Vice President', name: 'Gabriel Ian F. Tan', gradeLevel: 'Grade 11 STEM' },
      { position: 'Secretary', name: 'Hannah Rose M. Manalo', gradeLevel: 'Grade 9 Regular' },
      { position: 'Treasurer', name: 'Dominic Kyle C. Mingoa', gradeLevel: 'Grade 10 Regular' }
    ],
    recentActivities: [
      {
        title: 'Mangrove Reforestation Drive along Alcantara Coastal Sanctuary',
        date: '2026-09-21',
        description: 'Planted 500 mangrove propagules with support from DENR Romblon and LGU Alcantara.'
      },
      {
        title: 'Recycled Art & Upcycling Exhibition 2026',
        date: '2026-08-30',
        description: 'Showcased student sculptures and utility crafts created from collected plastic bottles.'
      }
    ],
    announcements: [
      {
        title: 'Monthly Solid Waste Audit & Clean-up Drive',
        date: '2026-10-07',
        content: 'Scheduled for this coming Friday after class dismissal. All green club volunteers to report to the MRF.'
      }
    ],
    isPublished: true
  },
  {
    id: 'org-the-beacon',
    code: 'THE_BEACON',
    name: 'The Beacon',
    acronym: 'The Beacon',
    description: 'The Official English Student Publication of Alcantara National High School. Committed to fearless truth-telling, investigative journalism, literary excellence, and objective school reporting.',
    objectives: [
      'Document school events, student achievements, and community developments with journalistic integrity',
      'Serve as an open forum for critical student discourse and literary expression',
      'Train aspiring student journalists in editorial writing, layout, photojournalism, and broadcasting',
      'Excel in the annual Division and Regional Schools Press Conferences'
    ],
    adviser: 'Ms. Clarisse B. Galindez, Teacher III',
    presidentOrHead: 'Princess Dianne A. Ferrancullo (Grade 12 HUMSS)',
    logoUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=400&q=80',
    officers: [
      { position: 'Editor-in-Chief', name: 'Princess Dianne A. Ferrancullo', gradeLevel: 'Grade 12 HUMSS' },
      { position: 'Associate Editor', name: 'Liam Nathaniel S. Reyes', gradeLevel: 'Grade 11 STEM' },
      { position: 'Managing Editor', name: 'Katarina Jean M. Faigao', gradeLevel: 'Grade 10 STE' },
      { position: 'News Editor', name: 'Ezekiel Bryan T. Prado', gradeLevel: 'Grade 11 HUMSS' },
      { position: 'Feature Editor', name: 'Samantha Chloe P. Festin', gradeLevel: 'Grade 10 Regular' },
      { position: 'Chief Photojournalist', name: 'Jericho Dale M. Gomez', gradeLevel: 'Grade 12 TVL-ICT' }
    ],
    recentActivities: [
      {
        title: 'Campus Journalism Bootcamp & Layout Workshop',
        date: '2026-09-14',
        description: 'Intensive 2-day workshop covering editorial cartooning, sports writing, and Adobe InDesign publishing.'
      }
    ],
    announcements: [
      {
        title: 'Open Call for Literary and Opinion Submissions (Quarter 2 Folio)',
        date: '2026-10-01',
        content: 'Accepting poems, essays, and photo essays around the theme: "Archipelagic Voices: Romblon\'s Youth in the Modern Age".'
      }
    ],
    isPublished: true
  },
  {
    id: 'org-avant-garde',
    code: 'AVANT_GARDE',
    name: 'Avant Garde (Ang Gabay)',
    acronym: 'Avant Garde',
    description: 'Ang Opisyal na Pampaaralang Pahayagan sa Filipino ng Mataas na Paaralang Pambansa ng Alcantara. Itinataguyod ang sariling wika, mapagpalayang pamamahayag, at pagpapahalaga sa kulturang Romblomanon.',
    objectives: [
      'Pagpapalaganap ng makabuluhan at mapanagutang pamamahayag sa wikang Filipino',
      'Pagtatampok sa kasaysayan, tradisyon, at mga tagumpay ng mamamayan ng Alcantara',
      'Paghuhubog sa kakayahan ng mga kabataang manunulat sa iba\'t ibang larang ng pamamahayag',
      'Pakikibahagi sa mga patimpalak sa pamamahayag sa antas pandibisyon at panrehiyon'
    ],
    adviser: 'Gng. Maria Corazon D. Reyes, Head Teacher III',
    presidentOrHead: 'Janella Maye R. Madrona (Grade 12 HUMSS)',
    logoUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
    officers: [
      { position: 'Punong Patnugot (Editor-in-Chief)', name: 'Janella Maye R. Madrona', gradeLevel: 'Grade 12 HUMSS' },
      { position: 'Katuwang na Patnugot', name: 'Angelo Rafael D. Solis', gradeLevel: 'Grade 11 HUMSS' },
      { position: 'Patnugot sa Balita', name: 'Bea Christine L. Perez', gradeLevel: 'Grade 10 STE' },
      { position: 'Patnugot sa Lathalain', name: 'John Vincent F. Riano', gradeLevel: 'Grade 11 ABM' }
    ],
    recentActivities: [
      {
        title: 'Pampinid na Palatuntunan para sa Buwan ng Wikang Pambansa',
        date: '2026-08-29',
        description: 'Nanguna sa pagdaraos ng Balagtasan, Sabayang Pagbigkas, at Pagsulat ng Sanaysay sa buong paaralan.'
      }
    ],
    announcements: [
      {
        title: 'Pagtanggap ng mga Kontribusyon para sa Isyung Pandibisyon',
        date: '2026-10-03',
        content: 'Ipadala ang inyong mga tula, dagli, at sanaysay sa Tanggapan ng Avant Garde o sa opisyal na email.'
      }
    ],
    isPublished: true
  }
];

// PROTECTED CONTENT FOR TEACHERS & ADMINS
export const initialIssuances: SchoolIssuance[] = [
  {
    id: 'memo-1',
    issuanceNumber: 'School Memorandum No. 18, s. 2026',
    title: 'Conduct of Mid-Year Performance Review and Mid-Year INSET 2026 for Secondary Teachers',
    dateIssued: '2026-10-06',
    category: 'School Memorandum',
    description: 'Detailed instructions on the schedules, working committees, venue assignments, and required individual portfolio artifacts for the upcoming 5-day INSET at the Main Campus audio-visual hall.',
    signatory: 'Dr. Rodolfo M. Festin, Secondary School Principal IV',
    fileName: 'School_Memo_18_s2026_MidYear_INSET.pdf',
    fileSize: '1.8 MB',
    fileType: 'PDF',
    downloadUrl: '#download-memo-1',
    isArchived: false
  },
  {
    id: 'memo-2',
    issuanceNumber: 'Division Advisory No. 062, s. 2026',
    title: 'Administration of the Mid-Year Comprehensive Rapid Literacy Assessment (CRLA) and Phil-IRI',
    dateIssued: '2026-09-25',
    category: 'Division Advisory',
    description: 'Advisory from SDO Romblon regarding the synchronized reading diagnostic assessments for Grade 7 through Grade 10 learners, including testing protocols and submission links.',
    signatory: 'Schools Division Superintendent, SDO Romblon',
    fileName: 'Division_Advisory_062_s2026_CRLA_PhilIRI.pdf',
    fileSize: '840 KB',
    fileType: 'PDF',
    downloadUrl: '#download-memo-2',
    isArchived: false
  },
  {
    id: 'memo-3',
    issuanceNumber: 'School Directive No. 09, s. 2026',
    title: 'Submission Guidelines for Quarter 1 Electronic Class Records (e-CR) and Grading Verification',
    dateIssued: '2026-09-18',
    category: 'Internal Directive',
    description: 'Mandatory deadlines for subject teachers to transmit verified automated e-class records to curriculum chairpersons and grade level coordinators.',
    signatory: 'Mrs. Lydia S. Familaran, Assistant Principal II',
    fileName: 'School_Directive_09_s2026_Grading_Verification.pdf',
    fileSize: '512 KB',
    fileType: 'PDF',
    downloadUrl: '#download-memo-3',
    isArchived: false
  },
  {
    id: 'memo-4',
    issuanceNumber: 'DepEd Order No. 011, s. 2026',
    title: 'Policy Guidelines on the Implementation of the Strengthened Technical-Vocational-Livelihood (STVL) Track',
    dateIssued: '2026-08-30',
    category: 'DepEd Order',
    description: 'National directives defining updated competency standards, TESDA NC-II alignment, and work immersion safety protocols for senior high schools.',
    signatory: 'Secretary of Education, DepEd Central Office',
    fileName: 'DepEd_Order_011_s2026_STVL_Guidelines.pdf',
    fileSize: '3.4 MB',
    fileType: 'PDF',
    downloadUrl: '#download-memo-4',
    isArchived: false
  }
];

export const initialUpdates: SchoolUpdate[] = [
  {
    id: 'upd-1',
    title: 'Urgent: Faculty Emergency Meeting on Disaster Drill Readiness & Severe Weather Advisory',
    date: '2026-10-08',
    priority: 'Urgent',
    targetAudience: 'All Faculty',
    content: 'All teaching and non-teaching personnel are directed to attend a 30-minute coordination briefing today at 4:15 PM at the Library Annex. We will finalize evacuation marshals for the District Disaster Drill and review PAGASA weather bulletin protocols.',
    postedBy: 'Office of the Principal',
    attachmentName: 'Drill_Marshals_Assignment_Matrix.pdf',
    attachmentSize: '420 KB',
    isArchived: false
  },
  {
    id: 'upd-2',
    title: 'Guidance and Career Counseling Schedule for Grade 10 Completers (Batch 2026-2027)',
    date: '2026-10-03',
    priority: 'Normal',
    targetAudience: 'JHS Teachers',
    content: 'Grade 10 Class Advisers are requested to coordinate with Guidance Counselor Mrs. Elena Rios for the synchronized National Career Assessment Examination (NCAE) profile profiling starting next week.',
    postedBy: 'Guidance & Counseling Unit',
    attachmentName: 'Grade10_CareerGuidance_Schedule.xlsx',
    attachmentSize: '185 KB',
    isArchived: false
  },
  {
    id: 'upd-3',
    title: 'IT Lab Maintenance & Wi-Fi Access Points Upgrade Schedule',
    date: '2026-09-29',
    priority: 'Normal',
    targetAudience: 'All Faculty',
    content: 'The DCP Computer Laboratories and Faculty Wi-Fi repeaters will undergo router firmware updates this Saturday, Oct 11. Offline file syncing is recommended for teachers planning weekend lesson preparation.',
    postedBy: 'ICT Coordinator',
    isArchived: false
  }
];

export const initialMonitoringRecords: MonitoringRecord[] = [
  {
    id: 'mon-1',
    title: 'IPCRF Phase 3 Mid-Year Performance Monitoring and Coaching Form',
    code: 'MON-2026-IPCRF-03',
    category: 'IPCRF/OPCRF',
    deadline: '2026-10-25',
    status: 'Pending',
    academicYear: '2026-2027',
    remarks: 'Awaiting submission of portfolio MOVs from Junior High Department Heads.',
    attachmentName: 'IPCRF_Monitoring_Template_2026.docx'
  },
  {
    id: 'mon-2',
    title: 'Classroom Observation Tool (COT) Cycle 1 Summary Rating Sheets',
    code: 'MON-2026-COT-CY1',
    category: 'Classroom Observation',
    deadline: '2026-10-10',
    status: 'Submitted',
    submittedBy: 'Master Teacher Robert Santos',
    submissionDate: '2026-10-04',
    academicYear: '2026-2027',
    remarks: 'All 68 teachers observed; awaiting final consolidation by Principal Dr. Festin.',
    attachmentName: 'COT_Cycle1_Consolidated_Ratings.xlsx'
  },
  {
    id: 'mon-3',
    title: 'DepEd Form 137 / SF10 Permanent Learner Records Verification Audit',
    code: 'MON-2026-SF10-AUD',
    category: 'DepEd Form 137/SF10',
    deadline: '2026-09-30',
    status: 'Reviewed',
    submittedBy: 'Atty. Jayson Fronda, Admin Officer II',
    reviewedBy: 'Dr. Rodolfo M. Festin, Principal IV',
    submissionDate: '2026-09-28',
    academicYear: '2026-2027',
    remarks: 'Grade 7 and Grade 11 transferees verified with LIS Learner Reference Numbers.',
    attachmentName: 'SF10_Audit_Certification_Signed.pdf'
  },
  {
    id: 'mon-4',
    title: 'School-Based Management (SBM) Assessment Level III Validation Portfolio',
    code: 'MON-2026-SBM-L3',
    category: 'SBM Assessment',
    deadline: '2026-08-15',
    status: 'Completed',
    submittedBy: 'SBM Committee Secretariat',
    reviewedBy: 'Division SBM Validation Team, SDO Romblon',
    submissionDate: '2026-08-10',
    academicYear: '2026-2027',
    remarks: 'Validated with Level III Maturing Practitioner distinction by Regional Office.',
    attachmentName: 'SBM_Level3_Official_Validation_Report.pdf'
  },
  {
    id: 'mon-5',
    title: 'WASH in Schools (WinS) 3-Star Accreditation Periodic Monitoring Report',
    code: 'MON-2026-WINS-Q1',
    category: 'WASH in Schools (WinS)',
    deadline: '2026-11-15',
    status: 'Pending',
    academicYear: '2026-2027',
    remarks: 'Inspection of sanitation facilities and water testing scheduled for last week of October.',
    attachmentName: 'WinS_Quarterly_Rubric_2026.pdf'
  }
];

