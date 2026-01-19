// hooks/use-site-settings.ts
'use client';

import { useState, useEffect } from 'react';
import { getSiteInfo, getCandidateInfo, getSocialLinks, type SiteInfo, type CandidateInfo, type SocialLinks } from '@/lib/api';

export function useSiteSettings() {
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null);
  const [candidateInfo, setCandidateInfo] = useState<CandidateInfo | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLinks | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const [site, candidate, social] = await Promise.all([
          getSiteInfo(),
          getCandidateInfo(),
          getSocialLinks(),
        ]);
        setSiteInfo(site);
        setCandidateInfo(candidate);
        setSocialLinks(social);
      } catch (error) {
        console.error('Failed to load site settings:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  return {
    siteInfo,
    candidateInfo,
    socialLinks,
    loading,
  };
}