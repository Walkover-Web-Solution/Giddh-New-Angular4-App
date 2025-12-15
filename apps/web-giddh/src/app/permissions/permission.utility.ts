export interface GetAllPermissionResponse {
    body?: Permission[];
    status?: string;
    queryString?: any;
}

export interface Permission {
    name?: string;
    uniqueName?: string;
    scope?: string;
    isFixed?: boolean;
    isDefault?: boolean;
    parentUniqueName?: string;
    additional?: any;
}

export interface UserPermission {
    uniqueName?: string;
    allowed?: boolean;
    name?: string;
}

export interface PermissionRequest {
    page?: number;
    count?: number;
    q?: string;
}

export interface IPageStr {
    uniqueName?: string;
    name?: string;
    isSelected?: boolean;
    additional?: any;
}

export class PermissionUtility {
    static hasPermission(userPermissions: UserPermission[], requiredPermission: string): boolean {
        if (!userPermissions || !requiredPermission) {
            return false;
        }

        const permission = userPermissions.find(p => p.uniqueName === requiredPermission);
        return permission ? permission.allowed : false;
    }

    static filterPermissionsByScope(permissions: Permission[], scope: string): Permission[] {
        return permissions.filter(p => p.scope === scope);
    }
}
