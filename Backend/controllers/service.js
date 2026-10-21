const doctor_available_on = require("../models/doctor_available");
const { HttpError, uploadImage, asList } = require("../utils/http");

// POST /api/v1/service/services (admin) - multipart form with a "doctor_Image" file
async function service_doctor(req, res) {
  const { doctor_name, doctor_profile, doctor_id, doctor_address, Doctor_available } = req.body;
  if (!doctor_name || !doctor_profile || !doctor_id || !doctor_address) {
    throw new HttpError(400, "doctor_name, doctor_profile, doctor_id and doctor_address are required.");
  }
  if (!req.files?.doctor_Image) throw new HttpError(400, "A doctor photo is required (field name: doctor_Image).");

  const doctor = await doctor_available_on.create({
    doctor_name,
    doctor_profile,
    doctor_id,
    doctor_address,
    doctor_degree: asList(req.body.doctor_degree),
    doctor_Image: await uploadImage(req.files.doctor_Image, "doctors"),
    Doctor_available: String(Doctor_available) !== "false",
  });
  res.status(201).json(doctor);
}

// GET /api/v1/service/services
async function show_service_doctor(req, res) {
  res.json(await doctor_available_on.find({}).sort({ createdAt: 1 }));
}

module.exports = { service_doctor, show_service_doctor };
