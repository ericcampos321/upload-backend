const PermissionRepository = require("../repository/PermissionRepository");

const permissionServices = {

  createPermission(permissionData) {
    return PermissionRepository.createPermission(permissionData);
  }
};

module.exports = {
  permissionServices,
}
