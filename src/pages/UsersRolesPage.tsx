import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Shield,
  Search,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { userService } from '../services/userService';
import { UserAccount, RolePermissions, UserRole } from '../types';
import { useToast } from '../context/ToastContext';

export const UsersRolesPage: React.FC = () => {
  const { success } = useToast();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermissions[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'matrix'>('users');
  const [selectedRole, setSelectedRole] = useState<UserRole>('HR Manager');
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('Employee');
  const [newUserDept, setNewUserDept] = useState('Engineering');

  useEffect(() => {
    Promise.all([userService.getUsers(), userService.getRolePermissions()]).then(
      ([uData, rData]) => {
        setUsers(uData);
        setRolePermissions(rData);
      }
    );
  }, []);

  const handleTogglePermission = (
    module: keyof RolePermissions['permissions'],
    action: string,
    currentValue: boolean
  ) => {
    userService.updateRolePermission(selectedRole, module, action, !currentValue);
    setRolePermissions((prev) =>
      prev.map((roleConfig) => {
        if (roleConfig.role !== selectedRole) return roleConfig;
        const currentModule = (roleConfig.permissions as any)[module];
        return {
          ...roleConfig,
          permissions: {
            ...roleConfig.permissions,
            [module]: {
              ...currentModule,
              [action]: !currentValue,
            },
          },
        };
      })
    );
    success('Permission Updated', `Adjusted access for role: ${selectedRole}.`);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = await userService.createUser({
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      department: newUserDept,
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    });
    setUsers((prev) => [newUser, ...prev]);
    success('User Created', `Invited ${newUserName} as ${newUserRole}.`);
    setIsInviteModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeRoleConfig = rolePermissions.find((r) => r.role === selectedRole);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users & Role-Based Access Control (RBAC)"
        subtitle="Manage administrative accounts, invited personnel and module-level permission matrices."
        breadcrumb={['Overview', 'System', 'Users & Roles']}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsInviteModalOpen(true)}
            leftIcon={<UserPlus className="w-3.5 h-3.5" />}
          >
            Invite Team Member
          </Button>
        }
      />

      {/* Main Tab Toggle & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800/80 rounded-[8px] border border-slate-200 dark:border-slate-700/60 w-fit">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-1 text-xs font-semibold rounded-[6px] transition-colors ${
              activeTab === 'users'
                ? 'bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Team Accounts ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3.5 py-1 text-xs font-semibold rounded-[6px] transition-colors ${
              activeTab === 'matrix'
                ? 'bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Permission Matrix (8 Modules)
          </button>
        </div>

        {activeTab === 'users' && (
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search user, email or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-[8px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            />
          </div>
        )}
      </div>

      {/* View 1: Team Accounts Table */}
      {activeTab === 'users' ? (
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-[10px] shadow-[0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden">
          {filteredUsers.length === 0 ? (
            <EmptyState
              title="No Team Members Found"
              description="No user account matches your search query."
              actionLabel="Reset Search"
              onAction={() => setSearchQuery('')}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/90 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                    <th className="py-3 px-3.5">User</th>
                    <th className="py-3 px-3">Corporate Email</th>
                    <th className="py-3 px-3">System Role</th>
                    <th className="py-3 px-3">Department</th>
                    <th className="py-3 px-3">Last Login</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-3.5 font-medium text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                          />
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                        {user.email}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-[4px] text-[11px] font-semibold bg-purple-50 text-[#6D28D9] dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400 text-xs">
                        {user.department}
                      </td>
                      <td className="py-3 px-3 text-slate-400 font-mono tabular-nums text-[11px]">{user.lastLogin}</td>
                      <td className="py-3 px-3 text-center">
                        <Badge variant={user.status === 'Active' ? 'success' : 'neutral'}>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        <button
                          onClick={() => {
                            setSelectedRole(user.role);
                            setActiveTab('matrix');
                          }}
                          className="text-xs text-[#6D28D9] dark:text-purple-400 font-semibold hover:underline"
                        >
                          Inspect Permissions
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* View 2: Permission Matrix with Checkboxes */
        <div className="space-y-6">
          {/* Role selector buttons */}
          <div className="p-4 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-[10px] shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
              Configure Role Access:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {(
                [
                  'Company Admin',
                  'HR Manager',
                  'Payroll Manager',
                  'Accountant',
                  'Employee',
                ] as UserRole[]
              ).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold border transition-all ${
                    selectedRole === role
                      ? 'border-[#6D28D9] bg-purple-50 dark:bg-purple-950/60 text-[#6D28D9] dark:text-purple-300 ring-1 ring-[#6D28D9]'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
            {activeRoleConfig && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                {activeRoleConfig.description}
              </p>
            )}
          </div>

          {/* Granular Module Permission Matrix */}
          {activeRoleConfig && (
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-[10px] shadow-[0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/90 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                      <th className="py-3 px-3.5">System Module</th>
                      <th className="py-3 px-3">Action Privileges</th>
                      <th className="py-3 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {Object.entries(activeRoleConfig.permissions).map(([moduleName, actions]) => (
                      <tr
                        key={moduleName}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                      >
                        <td className="py-3 px-3.5 font-semibold capitalize text-slate-900 dark:text-slate-100">
                          {moduleName} Module
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-4 flex-wrap">
                            {Object.entries(actions).map(([actionName, isAllowed]) => (
                              <label
                                key={actionName}
                                className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 select-none text-xs"
                              >
                                <input
                                  type="checkbox"
                                  checked={Boolean(isAllowed)}
                                  disabled={selectedRole === 'Company Admin'} // Admin is always true
                                  onChange={() =>
                                    handleTogglePermission(
                                      moduleName as any,
                                      actionName,
                                      Boolean(isAllowed)
                                    )
                                  }
                                  className="rounded-[4px] text-[#6D28D9] focus:ring-[#6D28D9]"
                                />
                                <span className="capitalize">{actionName}</span>
                              </label>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="text-[11px] font-mono text-[#15803D] font-semibold">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Invite Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite New User Account"
        description="Grant access to the Alize Payroll management console."
        maxWidth="md"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Aditi Rao"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Corporate Email *
            </label>
            <input
              type="email"
              required
              placeholder="aditi.r@alizesoftware.com"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Assigned Role
              </label>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              >
                <option value="Company Admin">Company Admin</option>
                <option value="HR Manager">HR Manager</option>
                <option value="Payroll Manager">Payroll Manager</option>
                <option value="Accountant">Accountant</option>
                <option value="Employee">Employee (Self Service)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Department
              </label>
              <select
                value={newUserDept}
                onChange={(e) => setNewUserDept(e.target.value)}
                className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              >
                <option value="Engineering">Engineering</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance & Accounts">Finance & Accounts</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales & BD">Sales & BD</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Send Invitation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
