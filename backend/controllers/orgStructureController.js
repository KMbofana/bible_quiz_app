const orgUnitStructure = require('../models/orgstructure');

const buildOrgTree = require("../utils/helperBuildOrgTree");

const addUnits = async (req, res) =>{
    try {
    const { name, type, parentId } = req.body;

    // create a new org unit
    const newOrgUnit = new OrgUnit({
      name,
      type,
      parentId: parentId || null // in case it's top level
    });

    await newOrgUnit.save();

    res.status(201).json({
      message: "Organization Unit created successfully",
      orgUnit: newOrgUnit
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create organization unit", error });
  }
}



// get each unit
 const getEachUnit = async (req, res) => {
  try {
    const units = await OrgUnit.find().lean(); // get all units

    const tree = buildOrgTree(units, null); // start from top (parentId = null)

    res.status(200).json(tree);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch organization tree" });
  }
}


// GET one branch by ID
const getbranchByID = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Get all units
    const allUnits = await OrgUnit.find().lean();

    // 2️⃣ Find the root unit (the one requested)
    const root = allUnits.find(u => String(u._id) === id);
    if (!root) {
      return res.status(404).json({ message: "OrgUnit not found" });
    }

    // 3️⃣ Build tree from this root
    const children = buildOrgTree(allUnits, id);

    // 4️⃣ Combine root + children
    const branch = {
      _id: root._id,
      name: root.name,
      type: root.type,
      children
    };

    res.json(branch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch branch", error });
  }
}


module.exports = {
    addUnits,
    getEachUnit,
    getbranchByID
}