const buildOrgTree = (units, parentId = null) => {
  return units
    .filter(unit => String(unit.parentId) === String(parentId))
    .map(unit => ({
      _id: unit._id,
      name: unit.name,
      type: unit.type,
      children: buildOrgTree(units, unit._id)
    }));
};

module.exports = buildOrgTree;