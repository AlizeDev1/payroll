import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';
import { employeeService } from '../../services/employeeService';
import { Employee, Department, Designation } from '../../types';
import { Check, ArrowRight, ArrowLeft, UploadCloud } from 'lucide-react';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  designations: Designation[];
  onEmployeeCreated: (emp: Employee) => void;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  departments,
  designations,
  onEmployeeCreated,
}) => {
  const { success, error } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Personal
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '1995-05-15',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    address: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103',
    // Step 2: Employment
    employeeId: `EMP0${Math.floor(21 + Math.random() * 70)}`,
    joiningDate: new Date().toISOString().split('T')[0],
    departmentId: departments[0]?.id || 'dept-eng',
    designationId: designations[0]?.id || 'desig-01',
    reportingManagerName: 'Vikram Malhotra',
    employmentType: 'Full-Time' as Employee['employmentType'],
    workLocation: 'Bengaluru - Main Campus',
    salary: 85000,
    // Step 3: Bank
    bankName: 'HDFC Bank',
    accountNumber: '',
    ifscCode: 'HDFC0001755',
    // Step 4: Statutory
    panNumber: '',
    aadhaarNumber: '',
    uanNumber: '',
    esiNumber: 'N/A (Exempt)',
    taxRegime: 'New Regime (115BAC)' as 'New Regime (115BAC)' | 'Old Regime',
    // Step 5: Docs
    hasUploadedOfferLetter: true,
    hasUploadedKyc: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        error('Please provide name and email');
        return;
      }
    }
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const selectedDept = departments.find((d) => d.id === formData.departmentId) || departments[0];
      const selectedDesig = designations.find((d) => d.id === formData.designationId) || designations[0];

      const newEmp = await employeeService.createEmployee({
        employeeId: formData.employeeId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || '+91 98000 12345',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
        departmentId: selectedDept?.id || 'dept-general',
        departmentName: selectedDept?.name || 'General Operations',
        designationId: selectedDesig?.id || 'desig-general',
        designationTitle: selectedDesig?.title || 'Associate',
        joiningDate: formData.joiningDate,
        employmentType: formData.employmentType,
        status: 'Active',
        workLocation: formData.workLocation,
        salary: Number(formData.salary),
        ctcAnnual: Math.round(Number(formData.salary) * 12 * 1.15),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber || '50100452391024',
        ifscCode: formData.ifscCode,
        panNumber: formData.panNumber.toUpperCase() || 'ABCDE1234F',
        aadhaarNumber: formData.aadhaarNumber || '7890 1234 5678',
        uanNumber: formData.uanNumber || '100987654321',
        esiNumber: formData.esiNumber,
        taxRegime: formData.taxRegime,
      });

      onEmployeeCreated(newEmp);
      success('Employee Onboarded', `${newEmp.firstName} ${newEmp.lastName} (${newEmp.employeeId}) has been added.`);
      onClose();
      setCurrentStep(1);
    } catch {
      error('Failed to create employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Personal Info' },
    { number: 2, title: 'Employment' },
    { number: 3, title: 'Bank Account' },
    { number: 4, title: 'Statutory' },
    { number: 5, title: 'Review & Finish' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Employee"
      description="5-step onboarding wizard with statutory & salary structure assignment."
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto gap-2">
          {steps.map((s, idx) => (
            <div key={s.number} className="flex items-center gap-2 shrink-0">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  currentStep > s.number
                    ? 'bg-[#15803D] text-white'
                    : currentStep === s.number
                    ? 'bg-[#6D28D9] text-white ring-2 ring-purple-200 dark:ring-purple-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {currentStep > s.number ? <Check className="w-3.5 h-3.5" /> : s.number}
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap ${
                  currentStep === s.number
                    ? 'text-slate-900 dark:text-slate-100 font-bold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {s.title}
              </span>
              {idx < steps.length - 1 && (
                <div className="hidden sm:block w-4 h-px bg-slate-200 dark:border-slate-800 mx-1" />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Personal Details */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                required
                placeholder="e.g. Rahul"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                required
                placeholder="e.g. Verma"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Corporate Email *
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="e.g. rahul.v@alizesoftware.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Mobile Number
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Residential Address
              </label>
              <input
                type="text"
                name="address"
                placeholder="Flat / Building, Street, Area"
                value={formData.address}
                onChange={handleChange}
                className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                City & State
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="city"
                  placeholder="Bengaluru"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="Karnataka"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                PIN Code
              </label>
              <input
                type="text"
                name="pincode"
                placeholder="560103"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              />
            </div>
          </div>
        )}

        {/* Step 2: Employment Details */}
        {currentStep === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Employee ID
              </label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Date of Joining
              </label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Department
              </label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              >
                {departments.length > 0 ? (
                  departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.code})
                    </option>
                  ))
                ) : (
                  <option value="dept-general">General Operations</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Designation
              </label>
              <select
                name="designationId"
                value={formData.designationId}
                onChange={handleChange}
                className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              >
                {designations.length > 0 ? (
                  designations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title} ({d.level})
                    </option>
                  ))
                ) : (
                  <option value="desig-general">Associate (L1)</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Employment Type
              </label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Probation">Probation (6 Months)</option>
                <option value="Contract">Contract</option>
                <option value="Intern">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Work Location
              </label>
              <input
                type="text"
                name="workLocation"
                value={formData.workLocation}
                onChange={handleChange}
                className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Monthly Gross Salary (₹)
              </label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono tabular-nums focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Annual CTC will be structured automatically as ₹{(formData.salary * 12 * 1.15).toLocaleString('en-IN')}.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Bank Details */}
        {currentStep === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Bank Name
              </label>
              <select
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              >
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="ICICI Bank">ICICI Bank</option>
                <option value="State Bank of India">State Bank of India (SBI)</option>
                <option value="Axis Bank">Axis Bank</option>
                <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                IFSC Code
              </label>
              <input
                type="text"
                name="ifscCode"
                placeholder="HDFC0001755"
                value={formData.ifscCode}
                onChange={handleChange}
                className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 uppercase font-mono focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Account Number
              </label>
              <input
                type="text"
                name="accountNumber"
                placeholder="e.g. 50100234891102"
                value={formData.accountNumber}
                onChange={handleChange}
                className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              />
            </div>
          </div>
        )}

        {/* Step 4: Statutory Details */}
        {currentStep === 4 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Permanent Account Number (PAN) *
              </label>
              <input
                type="text"
                name="panNumber"
                placeholder="ABCDE1234F"
                value={formData.panNumber}
                onChange={handleChange}
                className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 uppercase font-mono focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Aadhaar Number (12 Digits)
              </label>
              <input
                type="text"
                name="aadhaarNumber"
                placeholder="7890 1234 5678"
                value={formData.aadhaarNumber}
                onChange={handleChange}
                className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Universal Account Number (EPFO UAN)
              </label>
              <input
                type="text"
                name="uanNumber"
                placeholder="100987654321"
                value={formData.uanNumber}
                onChange={handleChange}
                className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                ESI Insurance Number
              </label>
              <input
                type="text"
                name="esiNumber"
                value={formData.esiNumber}
                onChange={handleChange}
                className="w-full h-[40px] px-3 text-xs rounded-[8px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-[#6D28D9]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Income Tax Regime Election
              </label>
              <div className="grid grid-cols-2 gap-3 mt-1">
                <label className="flex items-center gap-2.5 p-3 rounded-[8px] border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <input
                    type="radio"
                    name="taxRegime"
                    value="New Regime (115BAC)"
                    checked={formData.taxRegime === 'New Regime (115BAC)'}
                    onChange={handleChange}
                    className="text-[#6D28D9] focus:ring-[#6D28D9]"
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      New Tax Regime (Section 115BAC)
                    </p>
                    <p className="text-[11px] text-slate-500">Concessional tax slabs (Default)</p>
                  </div>
                </label>
                <label className="flex items-center gap-2.5 p-3 rounded-[8px] border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <input
                    type="radio"
                    name="taxRegime"
                    value="Old Regime"
                    checked={formData.taxRegime === 'Old Regime'}
                    onChange={handleChange}
                    className="text-[#6D28D9] focus:ring-[#6D28D9]"
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      Old Tax Regime
                    </p>
                    <p className="text-[11px] text-slate-500">Eligible for 80C, 80D & HRA deductions</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review & Documents */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-[8px] border border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Employee Summary
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400">Name:</span>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{formData.firstName} {formData.lastName}</p>
                </div>
                <div>
                  <span className="text-slate-400">Employee ID:</span>
                  <p className="font-semibold font-mono text-slate-900 dark:text-slate-100">{formData.employeeId}</p>
                </div>
                <div>
                  <span className="text-slate-400">Email:</span>
                  <p className="font-semibold truncate text-slate-900 dark:text-slate-100">{formData.email}</p>
                </div>
                <div>
                  <span className="text-slate-400">Monthly Gross:</span>
                  <p className="font-semibold tabular-nums text-slate-900 dark:text-slate-100">₹{Number(formData.salary).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <span className="text-slate-400">Tax Regime:</span>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{formData.taxRegime}</p>
                </div>
                <div>
                  <span className="text-slate-400">Bank IFSC:</span>
                  <p className="font-semibold font-mono text-slate-900 dark:text-slate-100">{formData.ifscCode}</p>
                </div>
              </div>
            </div>

            <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-[8px] p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <UploadCloud className="w-8 h-8 text-[#6D28D9] dark:text-purple-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Upload Signed Employment Agreement & KYC (Optional)
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                PDF, JPG or PNG up to 10MB. Document will be indexed in Document Vault.
              </p>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleBack}
            disabled={currentStep === 1 || isSubmitting}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            {currentStep < 5 ? (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleNext}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                leftIcon={<Check className="w-4 h-4" />}
              >
                Complete Onboarding
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
