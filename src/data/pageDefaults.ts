import { HistoryContent, DepedContent, FooterContent, CurricularLevel } from '../types';

export const defaultHistory: HistoryContent = {
  banner: 'From humble municipal beginnings in 1968 to an award-winning center of academic and technical excellence in the Division of Romblon.',
  intro: 'Over fifty years of dedication to shaping the youth of Alcantara and neighboring municipalities.',
  milestones: [
    { year: '1968', title: 'Founding of Alcantara Municipal High School', description: 'Established through the collaborative efforts of local municipal leaders, civic stakeholders, and community elders to offer secondary education to children in Alcantara who previously had to travel to Odiongan or Romblon town.' },
    { year: '1984', title: 'Conversion to National High School', description: 'By virtue of national legislation and DepEd integration, the school was converted into a full National High School (ANHS), securing regular national budgetary appropriations and instructional facility allocations.' },
    { year: '1998', title: 'Establishment of San Agustin Annex Campus', description: 'To address access challenges for learners from remote coastal and agricultural sitios, the San Agustin Extension Campus was established, bringing basic education closer to remote learners.' },
    { year: '2016', title: 'Senior High School Implementation & Expansion', description: 'Pioneered the full roll-out of Republic Act 10533 (Enhanced Basic Education Act), erecting the Senior High School complex with Academic tracks (STEM, ABM, HUMSS) and TVL specialization suites.' },
    { year: '2023', title: 'Attainment of SBM Level III (Advanced Maturing Practitioner)', description: 'DepEd Regional Office IV-B MIMAROPA conferred the Level III School-Based Management distinction to Alcantara NHS for exemplary leadership, accountability, and community engagement.' },
    { year: 'Present', title: 'Digital Transformation & Sustainable Green Campus', description: 'Continuing the DepEd MATATAG agenda through Project TULAY, science and robotics programs, digital learning caches, and the School360 unified web and management portal.' },
  ],
};

export const defaultDeped: DepedContent = {
  vision: 'We dream of Filipinos who passionately love their country and whose values and competencies enable them to realize their full potential and contribute meaningfully to building the nation.\n\nAs a learner-centered public institution, the Department of Education continuously improves itself to better serve its stakeholders.',
  visionNote: 'At Alcantara National High School, this vision translates into everyday instructional rigor, student empowerment through the SSLG, environmental stewardship through YES-O, and cultivating empathetic, skilled graduates prepared for tertiary education or technical careers.',
  missionIntro: 'To protect and promote the right of every Filipino to quality, equitable, culture-based, and complete basic education where:',
  missionPoints: [
    { title: 'Students', text: 'learn in a child-friendly, gender-sensitive, safe, and motivating environment.' },
    { title: 'Teachers', text: 'facilitate learning and constantly nurture every learner.' },
    { title: 'Administrators & Staff', text: 'as stewards of the institution, ensure an enabling and supportive environment for effective learning to happen.' },
    { title: 'Family, Community & Stakeholders', text: 'are actively engaged and share responsibility for developing life-long learners.' },
  ],
  valuesIntro: 'The Department of Education upholds four foundational core values that are deeply embedded into the character-building curriculum of Alcantara National High School.',
  coreValues: [
    { title: 'Maka-Diyos', description: "Expresses one's spiritual beliefs while respecting the spiritual beliefs of others. Demonstrates adherence to universal moral truths, ethical conduct, and mutual respect among faith traditions." },
    { title: 'Makatao', description: 'Is sensitive to individual, social, and cultural differences. Demonstrates solidarity, empathy, respect for human rights, gender fairness, and peaceful conflict resolution in school and community.' },
    { title: 'Makakalikasan', description: 'Cares for the environment and utilizes resources wisely, judiciously, and economically. Spearheaded in our campus through YES-O, coastal cleanups, and organic waste management.' },
    { title: 'Makabansa', description: 'Demonstrates pride in being a Filipino; exercises the rights and responsibilities of a Filipino citizen. Honors Philippine cultural heritage, languages, and democratic institutions.' },
  ],
  mandate: 'The Department of Education was established by virtue of the **Education Act of 1982 (Batas Pambansa Blg. 232)** and further strengthened by **Republic Act No. 9155 (Governance of Basic Education Act of 2001)**.\n\nThe Department of Education is the primary government agency mandated to formulate, implement, and coordinate policies, plans, programs, and projects in the areas of formal and non-formal basic education. It supervises all elementary and secondary education institutions, including alternative learning systems, both public and private; and provides for the establishment and maintenance of a complete, adequate, and integrated system of basic education relevant to the goals of national development.',
  legalFramework: 'Governing Legal Framework: Republic Act 9155 · Batas Pambansa Blg. 232 · 1987 Constitution of the Republic of the Philippines (Article XIV)',
};

export const defaultFooter = (tagline: string): FooterContent => ({
  about: `${tagline}. An institution committed to the holistic growth of learners under the DepEd MATATAG agenda.`,
  regionLine: 'Region IV-B MIMAROPA · SDO Romblon',
  portalNote: 'Authorized DepEd personnel can log in to view School Issuances, internal updates, and submit monitoring forms.',
});

/** Splits text into paragraphs on blank lines. */
export const paragraphs = (text: string): string[] =>
  (text || '').split(/\n\s*\n/).map(x => x.trim()).filter(Boolean);

export const defaultCurricularPrograms: CurricularLevel[] = [
  {
    level: 'Junior High School (Grades 7 - 10)',
    programs: [
      'Regular Basic Education Curriculum (BEC)',
      'Special Science Program (STE)',
      'Special Program in the Arts (SPA)',
      'Pre-Vocational Technical Livelihood Education (TLE)',
    ],
  },
  {
    level: 'Senior High School (Grades 11 - 12)',
    programs: [
      'STEM (Science, Tech, Engineering & Mathematics)',
      'HUMSS (Humanities and Social Sciences)',
      'ABM (Accountancy, Business & Management)',
      'TVL: Information & Communications Technology (ICT)',
      'TVL: Agri-Fishery Arts (Crop Production & Processing)',
    ],
  },
];
