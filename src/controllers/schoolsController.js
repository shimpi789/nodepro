import connection from "../config/db.js";
import Joi from "joi";

// Validation schema
const schema = Joi.object({
  name: Joi.string().min(1).required(),
  address: Joi.string().min(1).required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
});

export async function addSchool(req, res) {
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const { name, address, latitude, longitude } = value;

  try {
    const [result] = await connection
      .promise()
      .execute(
        `INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)`,
        [name, address, latitude, longitude]
      );

    res.status(201).json({
      message: "School added successfully",
      id: result.insertId,
      name,
      address,
      latitude,
      longitude,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

export async function listSchools(req, res) {
  const latQ = parseFloat(req.query.latitude);
  const lngQ = parseFloat(req.query.longitude);

  if (Number.isNaN(latQ) || Number.isNaN(lngQ)) {
    return res.status(400).json({
      error: "latitude and longitude query params are required",
    });
  }

  try {
    const [rows] = await connection
      .promise()
      .query(
        `SELECT id, name, address, latitude, longitude FROM schools`
      );

    // Calculate distances (Haversine)
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371e3; // meters

    const withDistance = rows.map((school) => {
      const φ1 = toRad(latQ);
      const φ2 = toRad(school.latitude);
      const Δφ = toRad(school.latitude - latQ);
      const Δλ = toRad(school.longitude - lngQ);

      const a =
        Math.sin(Δφ / 2) ** 2 +
        Math.cos(φ1) *
          Math.cos(φ2) *
          Math.sin(Δλ / 2) ** 2;

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      return { ...school, distance: Math.round(distance) }; // meters rounded
    });

    // Sort by distance
    withDistance.sort((a, b) => a.distance - b.distance);

    res.json(withDistance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}
