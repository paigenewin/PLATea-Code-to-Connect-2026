import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  CommunityReport,
  createReport,
  fetchTreeReports,
} from '@/services/communityApi';

export function useCommunityReport(treeId?: string) {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [showContribution, setShowContribution] = useState(false);
  const [contributionText, setContributionText] = useState('');

  useEffect(() => {
    if (!treeId) {
      return;
    }

    fetchTreeReports(treeId)
      .then((data) => {
        setReports(data);
      })
      .catch((error) => {
        console.error('Failed to load community reports:', error);
      });
  }, [treeId]);

  async function submitContribution() {
    const cleanText = contributionText.trim();

    if (!cleanText) {
      Alert.alert('Empty contribution', 'Please write something first.');
      return;
    }

    if (!treeId) {
      Alert.alert('Missing tree ID', 'This tree does not have an ID.');
      return;
    }

    try {
      const newReport = await createReport(treeId, cleanText);

      setReports((currentReports) => [newReport, ...currentReports]);
      setContributionText('');
      setShowContribution(false);

      Alert.alert('Submitted', 'Your contribution was added.');
    } catch (error) {
      console.error('Failed to submit contribution:', error);
      Alert.alert('Submit failed', 'Could not connect to the server.');
    }
  }

  return {
    reports,
    showContribution,
    setShowContribution,
    contributionText,
    setContributionText,
    submitContribution,
  };
}
