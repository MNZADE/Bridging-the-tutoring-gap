import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ["present","absent"], default: "present" }
});

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
