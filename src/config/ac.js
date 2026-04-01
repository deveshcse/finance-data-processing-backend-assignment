// src/config/ac.js

function createAccessControl(statement) {
  // validate statement on creation
  for (const [resource, actions] of Object.entries(statement)) {
    if (!Array.isArray(actions)) {
      throw new Error(`Actions for resource "${resource}" must be an array`);
    }
  }

  return {
    newRole(permissions) {
      // validate that every resource and action in permissions exists in statement
      for (const [resource, actions] of Object.entries(permissions)) {
        if (!statement[resource]) {
          throw new Error(`Resource "${resource}" is not defined in statement`);
        }
        for (const action of actions) {
          if (!statement[resource].includes(action)) {
            throw new Error(
              `Action "${action}" is not defined for resource "${resource}"`
            );
          }
        }
      }

      return permissions;
    },

    can(rolePermissions, resource, action) {
      if (!rolePermissions[resource]) return false;
      return rolePermissions[resource].includes(action);
    },
  };
}

// ─── Statement ───────────────────────────────────────────────────────────────

const statement = {
  users:        ["create", "read", "update", "delete", "change-status"],
  transactions: ["create", "read", "update", "delete"],
  dashboard:    ["read"],
};

export const ac = createAccessControl(statement);

// ─── Roles ───────────────────────────────────────────────────────────────────

export const viewer = ac.newRole({
  transactions: ["read"],
  dashboard:    ["read"],
});

export const analyst = ac.newRole({
  transactions: ["read"],
  dashboard:    ["read"],
  users:        ["read"],
});

export const admin = ac.newRole({
  users:        ["create", "read", "update", "delete", "change-status"],
  transactions: ["create", "read", "update", "delete"],
  dashboard:    ["read"],
});

// ─── Role Map ─────────────────────────────────────────────────────────────────
// used by authorize middleware to look up permissions by role string

export const roles = {
  viewer,
  analyst,
  admin,
};