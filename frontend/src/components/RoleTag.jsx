import React from "react";

export default function RoleTag({ role }) {
  const getRoleBadgeClass = (role) => {
    const roleMap = {
      admin: "role-badge-admin",
      manager: "role-badge-manager",
      technician: "role-badge-technician",
      service_advisor: "role-badge-service-advisor",
      cashier: "role-badge-cashier",
    };
    return roleMap[role] || "role-badge-service-advisor";
  };

  const getRoleDisplay = (role) => {
    if (!role) return "USER";
    return role.replace("_", " ").toUpperCase();
  };

  return (
    <span className={`${getRoleBadgeClass(role)} inline-block`}>
      {getRoleDisplay(role)}
    </span>
  );
}