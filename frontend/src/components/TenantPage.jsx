// src/pages/TenantPage.jsx
import React, { useState, useEffect } from 'react';
import TenantList from '../components/TenantList';

const TenantPage = () => {
  const [tenants, setTenants] = useState(() => {
    const saved = localStorage.getItem('tenants');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('tenants', JSON.stringify(tenants));
  }, [tenants]);

  const addTenant = tenant => {
    setTenants(prev => [...prev, tenant]);
  };

  const removeTenant = idx => {
    setTenants(prev => prev.filter((_, i) => i !== idx));
  };

  const addPosId = (idx, newId) => {
    setTenants(prev => {
      const copy = [...prev];
      if (!Array.isArray(copy[idx].posIds)) {
        copy[idx].posIds = [];
      }
      copy[idx].posIds.push(newId);
      return copy;
    });
  };

  return (
    <TenantList
      tenants={tenants}
      addTenant={addTenant}
      removeTenant={removeTenant}
      addPosId={addPosId}
    />
  );
};

export default TenantPage;
