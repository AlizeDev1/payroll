import { UserAccount, RolePermissions, UserRole } from '../types';
import { MOCK_USERS, MOCK_ROLE_PERMISSIONS } from '../data/mockData';

let users: UserAccount[] = [...MOCK_USERS];
let permissions: RolePermissions[] = [...MOCK_ROLE_PERMISSIONS];

export const userService = {
  async getUsers(): Promise<UserAccount[]> {
    await new Promise((res) => setTimeout(res, 40));
    return [...users];
  },

  async createUser(user: Omit<UserAccount, 'id' | 'lastLogin'>): Promise<UserAccount> {
    await new Promise((res) => setTimeout(res, 80));
    const newUser: UserAccount = {
      ...user,
      id: `user-${Date.now()}`,
      lastLogin: 'Never',
    };
    users.unshift(newUser);
    return newUser;
  },

  async updateUserRole(id: string, role: UserRole): Promise<UserAccount> {
    await new Promise((res) => setTimeout(res, 60));
    const u = users.find((x) => x.id === id);
    if (!u) throw new Error('User not found');
    u.role = role;
    return u;
  },

  async getRolePermissions(): Promise<RolePermissions[]> {
    await new Promise((res) => setTimeout(res, 40));
    return [...permissions];
  },

  async updateRolePermission(
    role: UserRole,
    module: keyof RolePermissions['permissions'],
    action: string,
    value: boolean
  ): Promise<void> {
    const roleConfig = permissions.find((p) => p.role === role);
    if (roleConfig && (roleConfig.permissions as any)[module]) {
      (roleConfig.permissions as any)[module][action] = value;
    }
  },
};
