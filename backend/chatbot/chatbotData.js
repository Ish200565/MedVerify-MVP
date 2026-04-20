/**
 * chatbotData.js
 * Static snapshot of your database — used by the chatbot engine.
 * No DB queries, no API keys, just plain data.
 * Update this file whenever your real data changes significantly.
 */

const chatbotData = {

  medicines: [
    { name: "Paracetamol 500mg",   type: "Tablet",    manufacturer: "Cipla",        category: "Analgesic",        uses: ["Fever", "Headache"],               description: "Common pain & fever reliever",          quantity: 120, unitType: "Strip",  expiryDate: "2026-08-01" },
    { name: "Amoxicillin 250mg",   type: "Capsule",   manufacturer: "Sun Pharma",   category: "Antibiotic",       uses: ["Bacterial infections"],            description: "Broad-spectrum antibiotic",              quantity: 15,  unitType: "Strip",  expiryDate: "2025-10-31" },
    { name: "Ibuprofen 400mg",     type: "Tablet",    manufacturer: "Dr. Reddy",    category: "NSAID",            uses: ["Pain", "Inflammation"],            description: "Anti-inflammatory painkiller",           quantity: 25,  unitType: "Strip",  expiryDate: "2026-08-15" },
    { name: "ORS Sachets",         type: "Syrup",     manufacturer: "Electral",     category: "Rehydration",      uses: ["Dehydration", "Diarrhea"],         description: "Oral rehydration salts",                 quantity: 10,  unitType: "Bottle", expiryDate: "2025-11-20" },
    { name: "Cetirizine 10mg",     type: "Tablet",    manufacturer: "Cipla",        category: "Antihistamine",    uses: ["Allergy", "Cold"],                 description: "Antiallergic medication",                quantity: 20,  unitType: "Strip",  expiryDate: "2026-04-05" },
    { name: "Metformin 500mg",     type: "Tablet",    manufacturer: "USV",          category: "Antidiabetic",     uses: ["Diabetes"],                        description: "Type 2 diabetes management",             quantity: 85,  unitType: "Strip",  expiryDate: "2026-12-01" },
    { name: "Amlodipine 5mg",      type: "Tablet",    manufacturer: "Zydus",        category: "Antihypertensive", uses: ["Hypertension"],                    description: "Blood pressure control",                 quantity: 60,  unitType: "Strip",  expiryDate: "2027-01-15" },
    { name: "Azithromycin 500mg",  type: "Tablet",    manufacturer: "Zydus",        category: "Antibiotic",       uses: ["Respiratory infections"],          description: "Z-pack antibiotic",                      quantity: 10,  unitType: "Strip",  expiryDate: "2025-06-30" },
    { name: "Omeprazole 20mg",     type: "Capsule",   manufacturer: "Sun Pharma",   category: "PPI",              uses: ["Acidity", "Ulcer"],                description: "Proton pump inhibitor",                  quantity: 45,  unitType: "Strip",  expiryDate: "2026-09-10" },
    { name: "Vitamin C 500mg",     type: "Tablet",    manufacturer: "Abbott",       category: "Supplement",       uses: ["Immunity", "Deficiency"],          description: "Ascorbic acid supplement",               quantity: 150, unitType: "Strip",  expiryDate: "2027-03-01" },
    { name: "Iron + Folic Acid",   type: "Tablet",    manufacturer: "Cipla",        category: "Supplement",       uses: ["Anemia", "Pregnancy"],             description: "Haemoglobin booster",                    quantity: 18,  unitType: "Strip",  expiryDate: "2026-05-20" },
    { name: "Calcium 500mg",       type: "Tablet",    manufacturer: "Abbott",       category: "Supplement",       uses: ["Bone health"],                     description: "Calcium carbonate",                      quantity: 70,  unitType: "Strip",  expiryDate: "2027-02-28" },
    { name: "Betadine Ointment",   type: "Ointment",  manufacturer: "Win-Medicare", category: "Topical",          uses: ["Wound care", "Antiseptic"],        description: "Povidone-iodine antiseptic",             quantity: 8,   unitType: "Tube",   expiryDate: "2025-12-15" },
    { name: "Dexamethasone 0.5mg", type: "Tablet",    manufacturer: "Cadila",       category: "Corticosteroid",   uses: ["Inflammation", "Allergy"],         description: "Steroid anti-inflammatory",              quantity: 35,  unitType: "Strip",  expiryDate: "2026-07-30" },
    { name: "Ringer's Lactate",    type: "Injection", manufacturer: "Baxter",       category: "IV Fluid",         uses: ["IV Fluid", "Dehydration"],         description: "Intravenous electrolyte solution",       quantity: 12,  unitType: "Vial",   expiryDate: "2026-03-01" },
  ],

  doctors: [
    { name: "Dr. Priya Sharma",  specialisation: "General Medicine", experience: 8,  phone: "9876543210", email: "priya.sharma@ngo.com"  },
    { name: "Dr. Rohit Mehta",   specialisation: "Paediatrics",      experience: 5,  phone: "9876543211", email: "rohit.mehta@ngo.com"   },
    { name: "Dr. Sunita Patil",  specialisation: "Gynaecology",      experience: 12, phone: "9876543212", email: "sunita.patil@ngo.com"  },
    { name: "Dr. Aakash Desai",  specialisation: "Internal Medicine",experience: 7,  phone: "9876543213", email: "aakash.desai@ngo.com"  },
    { name: "Dr. Meena Joshi",   specialisation: "Dermatology",      experience: 6,  phone: "9876543214", email: "meena.joshi@ngo.com"   },
  ],

  camps: [
    { name: "Free Health Camp – Andheri West",         location: "Andheri West, Mumbai",  date: "2026-05-10", status: "upcoming",  doctor: "Dr. Priya Sharma",  medicines: ["Paracetamol 500mg", "ORS Sachets", "Cetirizine 10mg"],          description: "General OPD camp" },
    { name: "Rural Wellness Drive – Nagpur",            location: "Nagpur Central",         date: "2026-06-15", status: "upcoming",  doctor: "Dr. Rohit Mehta",   medicines: ["Amoxicillin 250mg", "Ibuprofen 400mg", "Vitamin C 500mg"],      description: "Rural outreach" },
    { name: "Mother & Child Health Camp – Bandra",      location: "Bandra East, Mumbai",    date: "2026-07-04", status: "upcoming",  doctor: "Dr. Sunita Patil",  medicines: ["Iron + Folic Acid", "Calcium 500mg", "ORS Sachets"],            description: "MCH focus camp" },
    { name: "Diabetes Screening Camp – Pune",           location: "Pune Camp Area",         date: "2026-05-28", status: "upcoming",  doctor: "Dr. Aakash Desai",  medicines: ["Metformin 500mg", "Vitamin C 500mg"],                           description: "Diabetes awareness" },
    { name: "Dermatology Camp – Thane",                 location: "Thane West",             date: "2026-06-20", status: "upcoming",  doctor: "Dr. Meena Joshi",   medicines: ["Betadine Ointment", "Dexamethasone 0.5mg"],                      description: "Skin camp" },
    { name: "General OPD Camp – Dharavi",               location: "Dharavi, Mumbai",        date: "2026-04-30", status: "upcoming",  doctor: "Dr. Priya Sharma",  medicines: ["Paracetamol 500mg", "Cetirizine 10mg", "Omeprazole 20mg"],      description: "Walk-in OPD" },
    { name: "Blood Pressure Awareness – Nashik",        location: "Nashik Road",            date: "2026-08-01", status: "upcoming",  doctor: "Dr. Aakash Desai",  medicines: ["Amlodipine 5mg", "Metformin 500mg"],                            description: "BP screening" },
    { name: "Vaccination Drive – Vasai",                location: "Vasai, Palghar",         date: "2026-07-12", status: "upcoming",  doctor: "Dr. Rohit Mehta",   medicines: ["Ringer's Lactate", "Paracetamol 500mg"],                        description: "Immunisation drive" },
    { name: "Eye & ENT Camp – Panvel",                  location: "Panvel, Raigad",         date: "2026-06-05", status: "upcoming",  doctor: "Dr. Sunita Patil",  medicines: ["Cetirizine 10mg", "Azithromycin 500mg"],                        description: "Eye & ENT" },
    { name: "Nutrition & Anemia Camp – Aurangabad",     location: "Aurangabad City",        date: "2026-09-10", status: "upcoming",  doctor: "Dr. Meena Joshi",   medicines: ["Iron + Folic Acid", "Vitamin C 500mg", "Calcium 500mg"],        description: "Nutrition focus" },
    { name: "Free Health Camp – Goregaon",              location: "Goregaon East, Mumbai",  date: "2026-01-15", status: "completed", doctor: "Dr. Priya Sharma",  medicines: ["Paracetamol 500mg", "ORS Sachets"],                             totalPeople: 180, minorCases: 152, majorCases: 28, successRate: 84 },
    { name: "Rural Wellness Drive – Kurla",             location: "Kurla East, Mumbai",     date: "2025-12-10", status: "completed", doctor: "Dr. Rohit Mehta",   medicines: ["Amoxicillin 250mg", "Ibuprofen 400mg"],                         totalPeople: 140, minorCases: 118, majorCases: 22, successRate: 84 },
    { name: "General OPD Camp – Thane",                 location: "Thane West",             date: "2025-11-22", status: "completed", doctor: "Dr. Aakash Desai",  medicines: ["Paracetamol 500mg", "Omeprazole 20mg", "Cetirizine 10mg"],      totalPeople: 210, minorCases: 182, majorCases: 28, successRate: 87 },
    { name: "Diabetes Screening – Nagpur",              location: "Nagpur Central",         date: "2025-10-05", status: "completed", doctor: "Dr. Aakash Desai",  medicines: ["Metformin 500mg"],                                              totalPeople: 95,  minorCases: 78,  majorCases: 17, successRate: 82 },
    { name: "Mother & Child Camp – Panvel",             location: "Panvel, Raigad",         date: "2025-09-18", status: "completed", doctor: "Dr. Sunita Patil",  medicines: ["Iron + Folic Acid", "Calcium 500mg"],                           totalPeople: 165, minorCases: 149, majorCases: 16, successRate: 90 },
    { name: "Dermatology Camp – Nashik",                location: "Nashik Road",            date: "2025-08-30", status: "completed", doctor: "Dr. Meena Joshi",   medicines: ["Betadine Ointment", "Dexamethasone 0.5mg"],                      totalPeople: 88,  minorCases: 70,  majorCases: 18, successRate: 80 },
    { name: "Orthopaedic Screening – Aurangabad",       location: "Aurangabad City",        date: "2025-07-14", status: "completed", doctor: "Dr. Priya Sharma",  medicines: ["Ibuprofen 400mg", "Calcium 500mg"],                             totalPeople: 120, minorCases: 98,  majorCases: 22, successRate: 82 },
    { name: "Eye & ENT Camp – Vasai",                   location: "Vasai, Palghar",         date: "2025-06-20", status: "completed", doctor: "Dr. Rohit Mehta",   medicines: ["Cetirizine 10mg", "Azithromycin 500mg"],                        totalPeople: 75,  minorCases: 62,  majorCases: 13, successRate: 83 },
    { name: "Vaccination Drive – Bandra",               location: "Bandra East, Mumbai",    date: "2025-05-08", status: "completed", doctor: "Dr. Sunita Patil",  medicines: ["Ringer's Lactate", "Paracetamol 500mg"],                        totalPeople: 200, minorCases: 188, majorCases: 12, successRate: 94 },
    { name: "Blood Pressure Camp – Dharavi",            location: "Dharavi, Mumbai",        date: "2025-04-11", status: "completed", doctor: "Dr. Aakash Desai",  medicines: ["Amlodipine 5mg", "Metformin 500mg"],                            totalPeople: 110, minorCases: 90,  majorCases: 20, successRate: 82 },
  ],

  reports: [
    { campName: "Free Health Camp – Goregaon",        doctor: "Dr. Priya Sharma",  totalPeople: 180, minorCases: 152, majorCases: 28, successRate: 84, commonDiseases: ["fever","common cold","diarrhea"],          recommendations: "Increase ORS and Paracetamol stock before next camp." },
    { campName: "Rural Wellness Drive – Kurla",        doctor: "Dr. Rohit Mehta",  totalPeople: 140, minorCases: 118, majorCases: 22, successRate: 84, commonDiseases: ["respiratory infection","fever"],            recommendations: "Refer major cases to district hospital." },
    { campName: "General OPD Camp – Thane",            doctor: "Dr. Aakash Desai", totalPeople: 210, minorCases: 182, majorCases: 28, successRate: 87, commonDiseases: ["acidity","fever","cold"],                    recommendations: "Schedule follow-up for hypertension cases." },
    { campName: "Diabetes Screening – Nagpur",         doctor: "Dr. Aakash Desai", totalPeople: 95,  minorCases: 78,  majorCases: 17, successRate: 82, commonDiseases: ["diabetes","hypertension"],                   recommendations: "Conduct awareness session on diabetes diet." },
    { campName: "Mother & Child Camp – Panvel",        doctor: "Dr. Sunita Patil", totalPeople: 165, minorCases: 149, majorCases: 16, successRate: 90, commonDiseases: ["anemia","malnutrition"],                     recommendations: "Increase Iron + Folic Acid stock." },
    { campName: "Dermatology Camp – Nashik",           doctor: "Dr. Meena Joshi",  totalPeople: 88,  minorCases: 70,  majorCases: 18, successRate: 80, commonDiseases: ["skin infection","allergy"],                  recommendations: "Restock Betadine and Dexamethasone." },
    { campName: "Orthopaedic Screening – Aurangabad",  doctor: "Dr. Priya Sharma", totalPeople: 120, minorCases: 98,  majorCases: 22, successRate: 82, commonDiseases: ["joint pain","inflammation"],                 recommendations: "Refer major orthopaedic cases to specialist." },
    { campName: "Eye & ENT Camp – Vasai",              doctor: "Dr. Rohit Mehta",  totalPeople: 75,  minorCases: 62,  majorCases: 13, successRate: 83, commonDiseases: ["eye infection","ear infection"],             recommendations: "Ensure cold-chain for eye drops." },
    { campName: "Vaccination Drive – Bandra",          doctor: "Dr. Sunita Patil", totalPeople: 200, minorCases: 188, majorCases: 12, successRate: 94, commonDiseases: ["fever post-vaccination"],                    recommendations: "Maintain adequate Paracetamol for post-vaccination fever." },
    { campName: "Blood Pressure Camp – Dharavi",       doctor: "Dr. Aakash Desai", totalPeople: 110, minorCases: 90,  majorCases: 20, successRate: 82, commonDiseases: ["hypertension","diabetes"],                   recommendations: "Increase Amlodipine stock for future BP camps." },
  ],

  ngo: {
    name: "HealthFirst Foundation",
    ngoName: "HealthFirst",
    state: "Maharashtra",
    phone: "9900000001",
    email: "seededngo@health.com",
  },
};

module.exports = chatbotData;
