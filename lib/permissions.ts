// Tipos de roles
export enum AdminRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
}

// Permisos disponibles
export enum Permission {
  // Servicios
  VIEW_SERVICES = 'view_services',
  CREATE_SERVICES = 'create_services',
  EDIT_SERVICES = 'edit_services',
  DELETE_SERVICES = 'delete_services',

  // Reservas
  VIEW_BOOKINGS = 'view_bookings',
  CREATE_BOOKINGS = 'create_bookings',
  EDIT_BOOKINGS = 'edit_bookings',
  DELETE_BOOKINGS = 'delete_bookings',

  // Personal
  VIEW_STAFF = 'view_staff',
  CREATE_STAFF = 'create_staff',
  EDIT_STAFF = 'edit_staff',
  DELETE_STAFF = 'delete_staff',

  // Promociones
  VIEW_PROMOTIONS = 'view_promotions',
  CREATE_PROMOTIONS = 'create_promotions',
  EDIT_PROMOTIONS = 'edit_promotions',
  DELETE_PROMOTIONS = 'delete_promotions',

  // Portafolio
  VIEW_PORTFOLIO = 'view_portfolio',
  CREATE_PORTFOLIO = 'create_portfolio',
  DELETE_PORTFOLIO = 'delete_portfolio',

  // Administradores
  VIEW_ADMINS = 'view_admins',
  CREATE_ADMINS = 'create_admins',
  EDIT_ADMINS = 'edit_admins',
  DELETE_ADMINS = 'delete_admins',

  // Configuración
  MANAGE_SETTINGS = 'manage_settings',
}

// Permisos por rol
export const RolePermissions: Record<AdminRole, Permission[]> = {
  [AdminRole.SUPERADMIN]: Object.values(Permission), // Todos los permisos
  [AdminRole.ADMIN]: [
    // Servicios
    Permission.VIEW_SERVICES,
    Permission.CREATE_SERVICES,
    Permission.EDIT_SERVICES,

    // Reservas
    Permission.VIEW_BOOKINGS,
    Permission.CREATE_BOOKINGS,
    Permission.EDIT_BOOKINGS,

    // Personal
    Permission.VIEW_STAFF,

    // Promociones
    Permission.VIEW_PROMOTIONS,

    // Portafolio
    Permission.VIEW_PORTFOLIO,
    Permission.CREATE_PORTFOLIO,
  ],
};

// Verificar si un usuario tiene un permiso
export function hasPermission(userRole: AdminRole, permission: Permission, customPermissions?: string): boolean {
  // Si tiene permisos personalizados, verificar ahí primero
  if (customPermissions) {
    try {
      const permisos = JSON.parse(customPermissions);
      if (Array.isArray(permisos)) {
        return permisos.includes(permission);
      }
    } catch (e) {
      // Ignorar error de parsing
    }
  }

  // Verificar permisos del rol
  const rolePerms = RolePermissions[userRole] || [];
  return rolePerms.includes(permission);
}

// Verificar si es superadmin
export function isSuperAdmin(userRole: string): boolean {
  return userRole === AdminRole.SUPERADMIN;
}

// Obtener todos los permisos de un usuario
export function getUserPermissions(userRole: AdminRole, customPermissions?: string): Permission[] {
  if (customPermissions) {
    try {
      const permisos = JSON.parse(customPermissions);
      if (Array.isArray(permisos)) {
        return permisos;
      }
    } catch (e) {
      // Ignorar error de parsing
    }
  }

  return RolePermissions[userRole] || [];
}
