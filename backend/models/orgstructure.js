const mongoose = require('mongoose');
const {Schema} = mongoose;

const OrgUnitSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["Division", "Union", "Conference", "Federation","District", "Church"], required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "OrgUnit", default: null },
});

const orgUnitStructure = mongoose.model("OrgUnit", OrgUnitSchema);

module.exports = orgUnitStructure