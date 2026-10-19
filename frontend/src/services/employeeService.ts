import { Employee, Department, Designation } from '../types';
import { MOCK_EMPLOYEES, MOCK_DEPARTMENTS, MOCK_DESIGNATIONS } from '../data/mockData';
import { apiClient } from './apiClient';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

// In-memory state for mock CRUD operations
let employees: Employee[] = [...MOCK_EMPLOYEES];
let departments: Department[] = [...MOCK_DEPARTMENTS];
let designations: Designation[] = [...MOCK_DESIGNATIONS];

export const employeeService = {
  async getEmployees(): Promise<Employee[]> {
    if (!USE_MOCK) {
      try {
        return await apiClient.get<Employee[]>('/employees');
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 80));
    return [...employees];
  },

  async getEmployeeById(id: string): Promise<Employee | undefined> {
    if (!USE_MOCK) {
      try {
        return await apiClient.get<Employee>(`/employees/${id}`);
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 60));
    return employees.find((e) => e.id === id || e.employeeId === id);
  },

  async createEmployee(data: Omit<Employee, 'id'>): Promise<Employee> {
    if (!USE_MOCK) {
      try {
        return await apiClient.post<Employee>('/employees', data);
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 120));
    const newEmployee: Employee = {
      ...data,
      id: `emp-${Date.now()}`,
    };
    employees.unshift(newEmployee);
    return newEmployee;
  },

  async updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee> {
    if (!USE_MOCK) {
      try {
        return await apiClient.patch<Employee>(`/employees/${id}`, updates);
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 100));
    const index = employees.findIndex((e) => e.id === id || e.employeeId === id);
    if (index === -1) throw new Error('Employee not found');
    employees[index] = { ...employees[index], ...updates };
    return employees[index];
  },

  async deleteEmployee(id: string): Promise<boolean> {
    if (!USE_MOCK) {
      try {
        await apiClient.delete(`/employees/${id}`);
        return true;
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 100));
    employees = employees.filter((e) => e.id !== id && e.employeeId !== id);
    return true;
  },

  async getDepartments(): Promise<Department[]> {
    if (!USE_MOCK) {
      try {
        return await apiClient.get<Department[]>('/departments');
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 60));
    return [...departments];
  },

  async createDepartment(dept: Omit<Department, 'id'>): Promise<Department> {
    if (!USE_MOCK) {
      try {
        return await apiClient.post<Department>('/departments', dept);
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 100));
    const newDept: Department = {
      ...dept,
      id: `dept-${Date.now()}`,
    };
    departments.push(newDept);
    return newDept;
  },

  async deleteDepartment(id: string): Promise<boolean> {
    if (!USE_MOCK) {
      try {
        await apiClient.delete(`/departments/${id}`);
        return true;
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 80));
    departments = departments.filter((d) => d.id !== id);
    return true;
  },

  async getDesignations(): Promise<Designation[]> {
    if (!USE_MOCK) {
      try {
        return await apiClient.get<Designation[]>('/designations');
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 60));
    return [...designations];
  },

  async createDesignation(desig: Omit<Designation, 'id'>): Promise<Designation> {
    if (!USE_MOCK) {
      try {
        return await apiClient.post<Designation>('/designations', desig);
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 100));
    const newDesig: Designation = {
      ...desig,
      id: `desig-${Date.now()}`,
    };
    designations.push(newDesig);
    return newDesig;
  },

  async deleteDesignation(id: string): Promise<boolean> {
    if (!USE_MOCK) {
      try {
        await apiClient.delete(`/designations/${id}`);
        return true;
      } catch (err) {
        console.warn('Real API unavailable, falling back to local memory store', err);
      }
    }
    await new Promise((res) => setTimeout(res, 80));
    designations = designations.filter((d) => d.id !== id);
    return true;
  },
};
