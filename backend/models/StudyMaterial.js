import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
  title: String,
  description: String,
  standard: Number,
  stream: String,
  fileUrl: String
});

const StudyMaterial = mongoose.model("StudyMaterial", materialSchema);
export default StudyMaterial;
