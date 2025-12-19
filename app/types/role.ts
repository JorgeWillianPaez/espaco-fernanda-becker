export interface Module {
  id: number;
  name: string;
  displayName: string;
  description?: string;
  icon?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RolePermission {
  moduleId: number;
  moduleName: string;
  moduleDisplayName: string;
  canRead: boolean;
  canWrite: boolean;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions: RolePermission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NewRole {
  name: string;
  description?: string;
  permissions: {
    moduleId: number;
    canRead: boolean;
    canWrite: boolean;
  }[];
}
