// hooks/use-settings.ts
'use client';

import { useState, useEffect } from 'react';
import { getCategories, getUpazilas, getUnions, type SettingsOption } from '@/lib/api';

export function useSettings() {
  const [categories, setCategories] = useState<SettingsOption[]>([]);
  const [upazilas, setUpazilas] = useState<SettingsOption[]>([]);
  const [unions, setUnions] = useState<Record<string, SettingsOption[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const [categoriesData, upazilasData, unionsData] = await Promise.all([
          getCategories(),
          getUpazilas(),
          getUnions(),
        ]);
        setCategories(categoriesData);
        setUpazilas(upazilasData);
        setUnions(unionsData);
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const getUnionsByUpazila = (upazilaValue: string): SettingsOption[] => {
    return unions[upazilaValue] || [];
  };

  return {
    categories,
    upazilas,
    unions,
    getUnionsByUpazila,
    loading,
  };
}