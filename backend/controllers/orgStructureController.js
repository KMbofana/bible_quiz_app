const orgUnitStructure = require('../models/orgstructure');

const buildOrgTree = require("../utils/helperBuildOrgTree");

function unitExists(tree, name, type) {
  for (const node of tree) {
    if (
      node.name.toLowerCase() === name.toLowerCase() &&
      node.type.toLowerCase() === type.toLowerCase()
    ) {
      return true; // ✅ Found a match
    }
    // 🔁 Recursively search children if they exist
    if (node.children && node.children.length > 0) {
      const foundInChildren = unitExists(node.children, name, type);
      if (foundInChildren) return true;
    }
  }
  return false; // ❌ Not found
}


const addUnits = async (req, res) => {
  try {
    const { name, type, parentId } = req.body;

    // 🔍 Check if exists under the same parent
    const exists = await orgUnitStructure.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      type,
      parentId: parentId || null
    });

    if (exists) {
      return res
        .status(400)
        .json({ message: "A unit with the same name and type already exists under this parent" });
    }

    // ✅ Create new org unit
    const newOrgUnit = new orgUnitStructure({
      name,
      type,
      parentId: parentId || null
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
};


// const addUnits = async (req, res) =>{
//     try {
//     const { name, type, parentId } = req.body;

//     // create a new org unit
//     const newOrgUnit = new orgUnitStructure({
//       name,
//       type,
//       parentId: parentId || null // in case it's top level
//     });

//     await newOrgUnit.save();

//     res.status(201).json({
//       message: "Organization Unit created successfully",
//       orgUnit: newOrgUnit
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to create organization unit", error });
//   }
// }



// get each unit
 const getEachUnit = async (req, res) => {
  try {
    const units = await orgUnitStructure.find().lean(); // get all units

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
    const allUnits = await orgUnitStructure.find().lean();

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


const findBrachCascade = (req, res)=>{
  const {branchname} = req.params
console.log(branchname)
  try {
    orgUnitStructure.find({name:branchname})
    .then(async (result)=>{
      
     const resTree = await get_branchByID(result[0]._id.toString())
     console.log(resTree)
      res.status(200).json({resTree:resTree})
    }).catch((error)=>{
      console.log(error)
      res.status(403).json({error})
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({error})
    
  }

}

const get_branchByID = async (id) => {
  try {
    

    // 1️⃣ Get all units
    const allUnits = await orgUnitStructure.find().lean();

    // 2️⃣ Find the root unit (the one requested)
    const root = allUnits.find(u => String(u._id) === id);
    if (!root) {
      return { message: "OrgUnit not found" };
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

    return branch
  } catch (error) {
    console.error(error);
    return {message: "Failed to fetch branch", error};
  }
}


module.exports = {
    addUnits,
    getEachUnit,
    getbranchByID,
    findBrachCascade
}