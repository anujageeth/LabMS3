export const ROLES = {
  HOD: 'hod',
  TO: 'technical officer',
  LECTURER: 'lecturer',
  INSTRUCTOR: 'instructor',
  STUDENT: 'student'
};

export const hasFullAccess = (role) => {
  return [ROLES.HOD, ROLES.TO].includes(role.toLowerCase());
};

export const hasInventoryViewAccess = (role) => {
  return [ROLES.HOD, ROLES.TO, ROLES.LECTURER, ROLES.INSTRUCTOR].includes(role.toLowerCase());
};

export const hasBookingAccess = (role) => {
  return Object.values(ROLES).includes(role.toLowerCase());
};
// New function for equipment management access
export const hasEquipmentManagementAccess = (role) => {
    return Object.values(ROLES).includes(role.toLowerCase());
};