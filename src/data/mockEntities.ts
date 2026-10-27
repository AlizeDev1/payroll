export interface CorporateEntity {
  id: string;
  name: string;
  code: string;
  legalType: 'LLP' | 'Pvt Ltd' | 'Pte Ltd' | 'Inc';
  location: string;
  state: string;
  country: string;
  pan: string;
  tan: string;
  gstin: string;
  pfEstCode: string;
  esiCode: string;
  employeeCount: number;
  monthlyPayroll: number;
  currency: string;
  isHQ: boolean;
}

export const MOCK_CORPORATE_ENTITIES: CorporateEntity[] = [
  {
    id: 'ent-1',
    name: 'Alize Software Services LLP',
    code: 'ALIZE-HQ',
    legalType: 'LLP',
    location: 'Bangalore (Bellandur Tech Park)',
    state: 'Karnataka',
    country: 'India',
    pan: 'AAAFB1234K',
    tan: 'BLRA12345B',
    gstin: '29AAAFB1234K1ZV',
    pfEstCode: 'KNBNG0045892000',
    esiCode: '53000123450000001',
    employeeCount: 86,
    monthlyPayroll: 6840000,
    currency: 'INR (₹)',
    isHQ: true,
  },
  {
    id: 'ent-2',
    name: 'Alize Cloud Labs Pvt Ltd',
    code: 'ALIZE-MUM',
    legalType: 'Pvt Ltd',
    location: 'Mumbai (Bandra Kurla Complex)',
    state: 'Maharashtra',
    country: 'India',
    pan: 'AABCL9821M',
    tan: 'MUMA98214C',
    gstin: '27AABCL9821M1ZX',
    pfEstCode: 'MHBAN0098214000',
    esiCode: '31000982140000002',
    employeeCount: 42,
    monthlyPayroll: 3820000,
    currency: 'INR (₹)',
    isHQ: false,
  },
  {
    id: 'ent-3',
    name: 'Alize Digital FinTech Solutions',
    code: 'ALIZE-HYD',
    legalType: 'LLP',
    location: 'Hyderabad (Hitec City)',
    state: 'Telangana',
    country: 'India',
    pan: 'AACCD4819P',
    tan: 'HYDA48192D',
    gstin: '36AACCD4819P1ZU',
    pfEstCode: 'APHYD0048192000',
    esiCode: '52000481920000003',
    employeeCount: 28,
    monthlyPayroll: 2450000,
    currency: 'INR (₹)',
    isHQ: false,
  },
  {
    id: 'ent-4',
    name: 'Alize Global Tech Pte Ltd',
    code: 'ALIZE-SG',
    legalType: 'Pte Ltd',
    location: 'Singapore (Marina Bay Financial Center)',
    state: 'Singapore Central',
    country: 'Singapore',
    pan: 'N/A (UEN: 202418290G)',
    tan: 'N/A (IRAS Registered)',
    gstin: 'GST: M90382910X',
    pfEstCode: 'CPF: 10928419X',
    esiCode: 'N/A',
    employeeCount: 15,
    monthlyPayroll: 1170000,
    currency: 'SGD (S$)',
    isHQ: false,
  },
];
