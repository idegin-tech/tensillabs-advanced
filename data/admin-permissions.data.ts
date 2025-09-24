export interface Permission {
  name: string;
  description: string;
  slug: string;
}

export interface PermissionCategory {
  name: string;
  description: string;
  slug: string;
  permissions: Permission[];
}

export const adminPermissions: PermissionCategory[] = [
  {
    name: "Users",
    description: "Manage workspace users and their access",
    slug: "users",
    permissions: [
      {
        name: "Invite User",
        description: "Allow inviting new users to the workspace",
        slug: "invite_user"
      },
      {
        name: "Update User",
        description: "Allow updating user information and settings", 
        slug: "update_user"
      },
      {
        name: "Suspend User",
        description: "Allow suspending user access to the workspace",
        slug: "suspend_user"
      },
      {
        name: "Delete User",
        description: "Allow deleting users from the workspace",
        slug: "delete_user"
      }
    ]
  }
];