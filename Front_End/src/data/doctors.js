// Static doctor directory. Field names match the Mongoose "doctor_available_on" schema in /Backend.
const img = (name) => `/images/doctors/${name}.svg`;

const doctors = [
  { _id: "d-ananya-sen", doctor_name: "Dr. Ananya Sen", doctor_profile: "Cardiologist", doctor_id: "DOC-1001", doctor_degree: ["MBBS", "MD (Cardiology)"], doctor_address: "Salt Lake, Kolkata", doctor_Image: img("ananya-sen"), Doctor_available: true },
  { _id: "d-rahul-mehta", doctor_name: "Dr. Rahul Mehta", doctor_profile: "General Physician", doctor_id: "DOC-1002", doctor_degree: ["MBBS", "MD (Medicine)"], doctor_address: "Park Street, Kolkata", doctor_Image: img("rahul-mehta"), Doctor_available: true },
  { _id: "d-priya-nair", doctor_name: "Dr. Priya Nair", doctor_profile: "Dermatologist", doctor_id: "DOC-1003", doctor_degree: ["MBBS", "MD (Dermatology)"], doctor_address: "Howrah", doctor_Image: img("priya-nair"), Doctor_available: true },
  { _id: "d-arjun-das", doctor_name: "Dr. Arjun Das", doctor_profile: "Pediatrician", doctor_id: "DOC-1004", doctor_degree: ["MBBS", "DCH"], doctor_address: "Behala, Kolkata", doctor_Image: img("arjun-das"), Doctor_available: false },
  { _id: "d-sneha-roy", doctor_name: "Dr. Sneha Roy", doctor_profile: "Gynecologist", doctor_id: "DOC-1005", doctor_degree: ["MBBS", "MS (Obstetrics & Gynecology)"], doctor_address: "New Town, Kolkata", doctor_Image: img("sneha-roy"), Doctor_available: true },
  { _id: "d-imran-qureshi", doctor_name: "Dr. Imran Qureshi", doctor_profile: "Orthopedic Surgeon", doctor_id: "DOC-1006", doctor_degree: ["MBBS", "MS (Orthopedics)"], doctor_address: "Garia, Kolkata", doctor_Image: img("imran-qureshi"), Doctor_available: true },
  { _id: "d-kavita-rao", doctor_name: "Dr. Kavita Rao", doctor_profile: "Psychiatrist", doctor_id: "DOC-1007", doctor_degree: ["MBBS", "MD (Psychiatry)"], doctor_address: "Online only", doctor_Image: img("kavita-rao"), Doctor_available: true },
  { _id: "d-sourav-ghosh", doctor_name: "Dr. Sourav Ghosh", doctor_profile: "ENT Specialist", doctor_id: "DOC-1008", doctor_degree: ["MBBS", "MS (ENT)"], doctor_address: "Dum Dum, Kolkata", doctor_Image: img("sourav-ghosh"), Doctor_available: false },
];

export default doctors;
