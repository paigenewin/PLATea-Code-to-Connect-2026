export type CommunityReport = {
  id: string;
  treeId: string;
  message: string;
  createdAt: string;
};

const API_URL = 'http://10.13.4.53:3000';

export async function fetchTreeReports(
  treeId: string
): Promise<CommunityReport[]> {
  const response = await fetch(
    `${API_URL}/trees/${treeId}/reports`
  );

  if (!response.ok) {
    throw new Error('Failed to load reports');
  }

  return response.json();
}


export async function createReport(
  treeId: string,
  message: string
): Promise<CommunityReport> {
  const response = await fetch(
    `${API_URL}/reports`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        treeId,
        message,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to submit report');
  }

  return response.json();
}