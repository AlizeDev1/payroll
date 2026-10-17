import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CorporateEntity, MOCK_CORPORATE_ENTITIES } from '../data/mockEntities';

const DEFAULT_FALLBACK_ENTITY: CorporateEntity = {
  id: 'ent-default',
  name: 'Alize Technologies Private Limited',
  code: 'ALIZE-HQ',
  legalType: 'Pvt Ltd',
  location: 'Bengaluru, India',
  state: 'Karnataka',
  country: 'India',
  pan: 'ABCDE1234F',
  tan: 'BLRA12345B',
  gstin: '29ABCDE1234F1Z5',
  pfEstCode: 'KNBNG0045892000',
  esiCode: '53000458920001001',
  employeeCount: 0,
  monthlyPayroll: 0,
  currency: 'INR',
  isHQ: true,
};

interface EntityContextType {
  activeEntity: CorporateEntity;
  entities: CorporateEntity[];
  switchEntity: (entityId: string) => void;
  isConsolidatedModalOpen: boolean;
  setIsConsolidatedModalOpen: (open: boolean) => void;
}

const EntityContext = createContext<EntityContextType | undefined>(undefined);

export const EntityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [entities] = useState<CorporateEntity[]>(() => {
    return MOCK_CORPORATE_ENTITIES && MOCK_CORPORATE_ENTITIES.length > 0
      ? MOCK_CORPORATE_ENTITIES
      : [DEFAULT_FALLBACK_ENTITY];
  });

  const [activeEntity, setActiveEntity] = useState<CorporateEntity>(() => {
    return (MOCK_CORPORATE_ENTITIES && MOCK_CORPORATE_ENTITIES.length > 0)
      ? MOCK_CORPORATE_ENTITIES[0]
      : DEFAULT_FALLBACK_ENTITY;
  });

  const [isConsolidatedModalOpen, setIsConsolidatedModalOpen] = useState(false);

  const switchEntity = (entityId: string) => {
    const target = entities.find((e) => e.id === entityId);
    if (target) {
      setActiveEntity(target);
    }
  };

  return (
    <EntityContext.Provider
      value={{
        activeEntity: activeEntity || DEFAULT_FALLBACK_ENTITY,
        entities,
        switchEntity,
        isConsolidatedModalOpen,
        setIsConsolidatedModalOpen,
      }}
    >
      {children}
    </EntityContext.Provider>
  );
};

export const useEntity = (): EntityContextType => {
  const context = useContext(EntityContext);
  if (!context) {
    throw new Error('useEntity must be used within an EntityProvider');
  }
  return context;
};
