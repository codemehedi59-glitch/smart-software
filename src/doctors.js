const doctors = [
  // =====================================================
  // NEUROLOGY / নিউরোলজি
  // =====================================================

  // {
  //   id: 1,
  //   name: "Assoc. Prof. Dr. Md. Zahidul Islam",
  //   banglaName: "সহযোগী অধ্যাপক ডা. মোঃ জাহিদুল ইসলাম",
  //   degree: "MBBS, BCS(H), MD(Neurology), CCD(Biredm)",
  //   department: "Neurology",
  //   banglaDepartment: "নিউরোলজি",
  //   specialty: "Neurology Specialist",
  //   banglaSpecialty: "নিউরোলজি বিশেষজ্ঞ",
  //   designation: "Associate Professor",
  //   banglaDesignation: "সহযোগী অধ্যাপক",
  //   image: "/Images/doctors/zahidul-islam.jpg",
  // },


  // =====================================================
  // CARDIOLOGY / কার্ডিওলজি
  // =====================================================

  {
    id: 2,
    name: "Dr. M. A Hasnain",
    banglaName: "ডা. এম. এ. হাসনাইন",
    degree: "MBBS, BCS(H), MD(Cardiology)",
    department: "Cardiology",
    banglaDepartment: "কার্ডিওলজি",
    specialty: "Cardiology Specialist",
    banglaSpecialty: "হৃদরোগ বিশেষজ্ঞ",
    designation: "Specialist Doctor",
    banglaDesignation: "বিশেষজ্ঞ চিকিৎসক",
    image: "/Images/doctors/ma-hasnain.jpg",
  },

  {
    id: 3,
    name: "Dr. Md. Serajul Islam",
    banglaName: "ডা. মোঃ সিরাজুল ইসলাম",
    degree: "MBBS, PhD (Cardiology)",
    department: "Cardiology",
    banglaDepartment: "কার্ডিওলজি",
    specialty: "Cardiology Specialist",
    banglaSpecialty: "হৃদরোগ বিশেষজ্ঞ",
    designation: "Specialist Doctor",
    banglaDesignation: "বিশেষজ্ঞ চিকিৎসক",
    image: "/Images/doctors/md-serajul-islam.jpg",
  },

  {
    id: 4,
    name: "Asst. Prof. Dr. Md. Ariful Islam (Rony)",
    banglaName: "সহকারী অধ্যাপক ডা. মোঃ আরিফুল ইসলাম (রনি)",
    degree: "MBBS, BCS (Health), D-Card",
    department: "Cardiology",
    banglaDepartment: "কার্ডিওলজি",
    specialty: "Cardiology Specialist",
    banglaSpecialty: "হৃদরোগ বিশেষজ্ঞ",
    designation: "Assistant Professor",
    banglaDesignation: "সহকারী অধ্যাপক",
    image: "/Images/doctors/ariful-islam-rony.jpg",
  },


  // =====================================================
  // GASTROENTEROLOGY / গ্যাস্ট্রোএন্টারোলজি
  // =====================================================

  {
    id: 5,
    name: "Asst. Prof. Dr. Md. Abdul Mumit Sarkar",
    banglaName: "সহকারী অধ্যাপক ডা. মোঃ আব্দুল মুমিত সরকার",
    degree: "MBBS, BCS(H), MD(Gastroenterology)",
    department: "Gastroenterology",
    banglaDepartment: "গ্যাস্ট্রোএন্টারোলজি",
    specialty: "Gastroenterology Specialist",
    banglaSpecialty: "গ্যাস্ট্রোএন্টারোলজি বিশেষজ্ঞ",
    designation: "Assistant Professor",
    banglaDesignation: "সহকারী অধ্যাপক",
    image: "/Images/doctors/abdul-mumit-sarkar.jpg",
  },

  {
    id: 6,
    name: "Dr. Sanjoy Kumar Paul",
    banglaName: "ডা. সঞ্জয় কুমার পাল",
    degree: "MBBS, BCS(H), MCPS, CCD, MD",
    department: "Gastroenterology",
    banglaDepartment: "গ্যাস্ট্রোএন্টারোলজি",
    specialty: "Gastroenterology Specialist",
    banglaSpecialty: "গ্যাস্ট্রোএন্টারোলজি বিশেষজ্ঞ",
    designation: "Specialist Doctor",
    banglaDesignation: "বিশেষজ্ঞ চিকিৎসক",
    image: "/Images/doctors/sanjoy-kumar-paul.jpg",
  },


  // =====================================================
  // GYNAECOLOGY & OBSTETRICS / গাইনী ও প্রসূতিবিদ্যা
  // =====================================================

  {
    id: 7,
    name: "Prof. Dr. Hasina Akhtar",
    banglaName: "অধ্যাপক ডা. হাসিনা আক্তার",
    degree: "MBBS, FCPS (Gynaecology & Obstetrics)",
    department: "Gynaecology & Obstetrics",
    banglaDepartment: "গাইনী ও প্রসূতিবিদ্যা",
    specialty: "Gynaecology & Obstetrics Specialist",
    banglaSpecialty: "গাইনী ও প্রসূতি রোগ বিশেষজ্ঞ",
    designation: "Professor",
    banglaDesignation: "অধ্যাপক",
    image: "/Images/doctors/hasina-akhtar.jpg",
  },

  {
    id: 8,
    name: "Dr. Shahnaj Sultana (Sweet)",
    banglaName: "ডা. শাহনাজ সুলতানা (সুইটি)",
    degree: "MBBS, BCS(H), FCPS, MCPS(Gynea & Obs)",
    department: "Gynaecology & Obstetrics",
    banglaDepartment: "গাইনী ও প্রসূতিবিদ্যা",
    specialty: "Gynaecology & Obstetrics Specialist",
    banglaSpecialty: "গাইনী ও প্রসূতি রোগ বিশেষজ্ঞ",
    designation: "Specialist Doctor",
    banglaDesignation: "বিশেষজ্ঞ চিকিৎসক",
    image: "/Images/doctors/shahnaj-sultana.jpg",
  },

  {
    id: 9,
    name: "Asst. Prof. Dr. Monowara Begum",
    banglaName: "সহকারী অধ্যাপক ডা. মনোয়ারা বেগম",
    degree: "MBBS, DGO, FCPS, FIGO, FACS",
    department: "Gynaecology & Obstetrics",
    banglaDepartment: "গাইনী ও প্রসূতিবিদ্যা",
    specialty: "Gynaecology & Obstetrics Specialist",
    banglaSpecialty: "গাইনী ও প্রসূতি রোগ বিশেষজ্ঞ",
    designation: "Assistant Professor",
    banglaDesignation: "সহকারী অধ্যাপক",
    image: "/Images/doctors/monowara-begum.jpg",
  },

  {
    id: 10,
    name: "Dr. Hosneara Sonia",
    banglaName: "ডা. হোসনেয়ারা সোনিয়া",
    degree: "MBBS, BCS(H), MS(Gynae)",
    department: "Gynaecology & Obstetrics",
    banglaDepartment: "গাইনী ও প্রসূতিবিদ্যা",
    specialty: "Gynaecology Specialist",
    banglaSpecialty: "গাইনী বিশেষজ্ঞ",
    designation: "Specialist Doctor",
    banglaDesignation: "বিশেষজ্ঞ চিকিৎসক",
    image: "/Images/doctors/hosneara-sonia.jpg",
  },


  // =====================================================
  // UROLOGY / ইউরোলজি
  // =====================================================

  {
    id: 11,
    name: "Dr. Md. Salahuddin Kabir (Anik)",
    banglaName: "ডা. মোঃ সালাহউদ্দিন কবির (অনিক)",
    degree: "MBBS, BCS(H), FCPS, MS",
    department: "Urology",
    banglaDepartment: "ইউরোলজি",
    specialty: "Urology Specialist",
    banglaSpecialty: "ইউরোলজি বিশেষজ্ঞ",
    designation: "Specialist Doctor",
    banglaDesignation: "বিশেষজ্ঞ চিকিৎসক",
    image: "/Images/doctors/salahuddin-kabir-anik.jpg",
  },

  {
    id: 12,
    name: "Asst. Prof. Dr. Khandaker Mahadi-Ul-Haque",
    banglaName: "সহকারী অধ্যাপক ডা. খন্দকার মাহাদী-উল-হক",
    degree: "MBBS, BCS(H), MS (Urology)",
    department: "Urology",
    banglaDepartment: "ইউরোলজি",
    specialty: "Urology Specialist",
    banglaSpecialty: "ইউরোলজি বিশেষজ্ঞ",
    designation: "Assistant Professor",
    banglaDesignation: "সহকারী অধ্যাপক",
    image: "/Images/doctors/mahadi-ul-haque.jpg",
  },


  // =====================================================
  // NEPHROLOGY / নেফ্রোলজি
  // =====================================================

  {
    id: 13,
    name: "Asst. Prof. Dr. Md. Safayet Hossain Pramanik",
    banglaName: "সহকারী অধ্যাপক ডা. মোঃ সাফায়েত হোসেন প্রামাণিক",
    degree: "MBBS, BCS, MD, MACP",
    department: "Nephrology",
    banglaDepartment: "নেফ্রোলজি",
    specialty: "Nephrology Specialist",
    banglaSpecialty: "কিডনি রোগ বিশেষজ্ঞ",
    designation: "Assistant Professor",
    banglaDesignation: "সহকারী অধ্যাপক",
    image: "/Images/doctors/safayet-hossain-pramanik.jpg",
  },


  // =====================================================
  // SURGERY / সার্জারি
  // =====================================================

  {
    id: 14,
    name: "Asst. Prof. Dr. Md. Abdul Hakim",
    banglaName: "সহকারী অধ্যাপক ডা. মোঃ আব্দুল হাকিম",
    degree: "MBBS, BCS(H), FCPS, MD",
    department: "Surgery",
    banglaDepartment: "সার্জারি",
    specialty: "Surgery Specialist",
    banglaSpecialty: "সার্জারি বিশেষজ্ঞ",
    designation: "Assistant Professor",
    banglaDesignation: "সহকারী অধ্যাপক",
    image: "/Images/doctors/abdul-hakim.jpg",
  },

  {
    id: 15,
    name: "Asst. Prof. Dr. Md. Sofi Ullah",
    banglaName: "সহকারী অধ্যাপক ডা. মোঃ সফি উল্লাহ",
    degree: "MBBS, BCS(H), FCPS (Surgery)",
    department: "Surgery",
    banglaDepartment: "সার্জারি",
    specialty: "Surgery Specialist",
    banglaSpecialty: "সার্জারি বিশেষজ্ঞ",
    designation: "Assistant Professor",
    banglaDesignation: "সহকারী অধ্যাপক",
    image: "/Images/doctors/sofi-ullah.jpg",
  },

  {
    id: 16,
    name: "Dr. Istiak Ahmed",
    banglaName: "ডা. ইশতিয়াক আহমেদ",
    degree: "MBBS, BCS(H), MRCS",
    department: "Surgery",
    banglaDepartment: "সার্জারি",
    specialty: "Surgery Specialist",
    banglaSpecialty: "সার্জারি বিশেষজ্ঞ",
    designation: "Specialist Doctor",
    banglaDesignation: "বিশেষজ্ঞ চিকিৎসক",
    image: "/Images/doctors/istiak-ahmed.jpg",
  },

  {
    id: 17,
    name: "Asst. Prof. Dr. Md. Mahbub Alam (Rana)",
    banglaName: "সহকারী অধ্যাপক ডা. মোঃ মাহবুব আলম (রানা)",
    degree: "MBBS, BCS(H), FCPS (Surgery)",
    department: "Surgery",
    banglaDepartment: "সার্জারি",
    specialty: "Surgery Specialist",
    banglaSpecialty: "সার্জারি বিশেষজ্ঞ",
    designation: "Assistant Professor",
    banglaDesignation: "সহকারী অধ্যাপক",
    image: "/Images/doctors/mahbub-alam-rana.jpg",
  },

  {
    id: 18,
    name: "Asst. Prof. Dr. Farhan Imtiaz Chowdhury",
    banglaName: "সহকারী অধ্যাপক ডা. ফারহান ইমতিয়াজ চৌধুরী",
    degree: "MBBS, BCS, FCPS",
    department: "Surgery",
    banglaDepartment: "সার্জারি",
    specialty: "Surgery Specialist",
    banglaSpecialty: "সার্জারি বিশেষজ্ঞ",
    designation: "Assistant Professor",
    banglaDesignation: "সহকারী অধ্যাপক",
    image: "/Images/doctors/farhan-imtiaz-chowdhury.jpg",
  },


  // =====================================================
  // MEDICINE / মেডিসিন
  // =====================================================

  {
    id: 19,
    name: "Asst. Prof. Dr. M.A Munnaf Sarkar",
    banglaName: "সহকারী অধ্যাপক ডা. এম. এ. মুন্নাফ সরকার",
    degree: "MBBS, BCS(H), MD, CCD, MACP",
    department: "Medicine",
    banglaDepartment: "মেডিসিন",
    specialty: "Medicine Specialist",
    banglaSpecialty: "মেডিসিন বিশেষজ্ঞ",
    designation: "Assistant Professor",
    banglaDesignation: "সহকারী অধ্যাপক",
    image: "/Images/doctors/ma-munnaf-sarkar.jpg",
  },

  {
    id: 20,
    name: "Asst. Prof. Dr. Md. Mosiur Rahman",
    banglaName: "সহকারী অধ্যাপক ডা. মোঃ মশিউর রহমান",
    degree: "MBBS, BCS(H), MACP, MD(Internal Medicine)",
    department: "Medicine",
    banglaDepartment: "মেডিসিন",
    specialty: "Internal Medicine Specialist",
    banglaSpecialty: "ইন্টারনাল মেডিসিন বিশেষজ্ঞ",
    designation: "Assistant Professor",
    banglaDesignation: "সহকারী অধ্যাপক",
    image: "/Images/doctors/mosiur-rahman.jpg",
  },


  // =====================================================
  // HEMATOLOGY / হেমাটোলজি
  // =====================================================

  {
    id: 21,
    name: "Dr. Mohit Kumer Pramanik",
    banglaName: "ডা. মোহিত কুমার প্রামাণিক",
    degree: "MBBS, BCS(H), MD(Hematology)",
    department: "Hematology",
    banglaDepartment: "হেমাটোলজি",
    specialty: "Hematology Specialist",
    banglaSpecialty: "রক্তরোগ বিশেষজ্ঞ",
    designation: "Specialist Doctor",
    banglaDesignation: "বিশেষজ্ঞ চিকিৎসক",
    image: "/Images/doctors/mohit-kumer-pramanik.jpg",
  },


  // =====================================================
  // PEDIATRIC HEMATOLOGY & ONCOLOGY
  // =====================================================

  {
    id: 22,
    name: "Asst. Prof. Dr. Md. Nazrul Islam",
    banglaName: "সহকারী অধ্যাপক ডা. মোঃ নজরুল ইসলাম",
    degree: "MBBS, BCS(H), MD(Pediatric Hematology & Oncology)",
    department: "Pediatric Hematology & Oncology",
    banglaDepartment: "শিশু হেমাটোলজি ও অনকোলজি",
    specialty: "Pediatric Hematology & Oncology Specialist",
    banglaSpecialty: "শিশু রক্তরোগ ও ক্যান্সার বিশেষজ্ঞ",
    designation: "Assistant Professor",
    banglaDesignation: "সহকারী অধ্যাপক",
    image: "/Images/doctors/nazrul-islam.jpg",
  },


  // =====================================================
  // DERMATOLOGY / চর্মরোগ
  // =====================================================

  {
    id: 23,
    name: "Asst. Prof. Dr. Md. Almgir Reza",
    banglaName: "সহকারী অধ্যাপক ডা. মোঃ আলমগীর রেজা",
    degree: "MBBS, BCS, DDV, MACP",
    department: "Dermatology",
    banglaDepartment: "চর্মরোগ",
    specialty: "Dermatology Specialist",
    banglaSpecialty: "চর্মরোগ বিশেষজ্ঞ",
    designation: "Assistant Professor",
    banglaDesignation: "সহকারী অধ্যাপক",
    image: "/Images/doctors/almgir-reza.jpg",
  },


  {
  id: 29,
  name: "Dr. Ibrahim Md. Sharaf",
  banglaName: "ডা. ইব্রাহিম মোঃ শরাফ",
  degree: "MBBS, BCS(H), DDV, MCPS",
  department: "Dermatology",
  banglaDepartment: "চর্মরোগ",
  specialty: "Dermatology Specialist",
  banglaSpecialty: "চর্মরোগ বিশেষজ্ঞ",
  designation: "Specialist Doctor",
  banglaDesignation: "বিশেষজ্ঞ চিকিৎসক",
  image: "/Images/doctors/ibrahim-md-sharaf.jpg",
},


  // =====================================================
  // ORTHOPAEDICS / অর্থোপেডিক্স
  // =====================================================

  {
    id: 24,
    name: "Dr. Sree Ashok Kumar",
    banglaName: "ডা. শ্রী অশোক কুমার",
    degree: "MBBS, BCS(H), MS(Ortho)",
    department: "Orthopaedics",
    banglaDepartment: "অর্থোপেডিক্স",
    specialty: "Orthopaedic Specialist",
    banglaSpecialty: "অর্থোপেডিক্স বিশেষজ্ঞ",
    designation: "Specialist Doctor",
    banglaDesignation: "বিশেষজ্ঞ চিকিৎসক",
    image: "/Images/doctors/sree-ashok-kumar.jpg",
  },


  // =====================================================
  // RADIOLOGY / রেডিওলজি
  // =====================================================

 

  {
    id: 25,
    name: "Asst. Prof. Dr. Abul Hasnat (Dablu)",
    banglaName: "সহকারী অধ্যাপক ডা. আবুল হাসনাত (ডাবলু)",
    degree: "MBBS, BCS(H), M-Phil",
    department: "Radiology",
    banglaDepartment: "রেডিওলজি",
    specialty: "Radiology & Imaging Specialist",
    banglaSpecialty: "রেডিওলজি ও ইমেজিং বিশেষজ্ঞ",
    designation: "Assistant Professor",
    banglaDesignation: "সহকারী অধ্যাপক",
    image: "/Images/doctors/abul-hasnat-dablu.jpg",
  },

   {
    id: 26,
    name: "Dr. Farzana Hasan",
    banglaName: "ডা. ফারজানা হাসান",
    degree: "MBBS, BCS(H), MD",
    department: "Radiology",
    banglaDepartment: "রেডিওলজি",
    specialty: "Radiology & Imaging Specialist",
    banglaSpecialty: "রেডিওলজি ও ইমেজিং বিশেষজ্ঞ",
    designation: "Specialist Doctor",
    banglaDesignation: "বিশেষজ্ঞ চিকিৎসক",
    image: "/Images/doctors/farzana-hasan.jpg",
  },

   {
  id: 28,
  name: "Dr. Md. Husnaion Zubery",
  banglaName: "ডা. মোঃ হুসনাইন জুবেরী",
  degree: "MBBS, BCS (Health), MD (Radiology & Imaging-BSMMU)",
  department: "Radiology & Imaging",
  banglaDepartment: "রেডিওলজি ও ইমেজিং",
  specialty: "Radiologist - Neuroradiology",
  banglaSpecialty: "রেডিওলজিস্ট - নিউরোরেডিওলজি",
  designation: "Assistant Professor",
  banglaDesignation: "সহকারী অধ্যাপক",
  image: "/Images/doctors/md-husnaion-zubery.jpg",
},


  // =====================================================
  // SONOLOGY / সোনোলজি
  // =====================================================

  {
    id: 27,
    name: "Dr. Md. Tuhin Hasan Ripon",
    banglaName: "ডা. মোঃ তুহিন হাসান রিপন",
    degree: "MBBS, FCPS (Part-II)",
    department: "Radiology",
    banglaDepartment: "রেডিওলজি",
    specialty: "Consultant Sonologist",
    banglaSpecialty: "কনসালট্যান্ট সোনোলজিস্ট",
    designation: "Consultant Sonologist",
    banglaDesignation: "কনসালট্যান্ট সোনোলজিস্ট",
    image: "/Images/doctors/tuhin-hasan-ripon.jpg",
  },

  {
    id: 28,
    name: "Dr. Farhana Ferdous",
    banglaName: "ডা. ফারহানা ফেরদৌস",
    degree: "MBBS, DMU",
    department: "Radiology",
    banglaDepartment: "রেডিওলজি",
    specialty: "Sonology Specialist",
    banglaSpecialty: "সোনোলজি বিশেষজ্ঞ",
    designation: "Sonologist",
    banglaDesignation: "সোনোলজিস্ট",
    image: "/Images/doctors/farhana-ferdous.jpg",
  },
];

export default doctors;