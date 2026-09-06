const API_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  'http://localhost:3000';

export type IdentifyResult = {
  identified: boolean;
  commonName: string | null;
  scientificName: string | null;
  needsBetterPhoto: boolean;
  provider: 'gemini' | 'plantnet';
};

export async function identifyPlantPhoto(
  photoUri: string
): Promise<IdentifyResult> {
  const photoResponse = await fetch(photoUri);
  const rawBlob = await photoResponse.blob();

  /*
   * A blob read back from a local file:// URI often
   * comes through without a usable MIME type, which
   * makes the server's "must be an image" check reject
   * it. Force a known-good image type instead of
   * trusting whatever the blob picked up.
   */
  const photoBlob = new Blob([rawBlob], { type: 'image/jpeg' });

  const formData = new FormData();

  formData.append('image', photoBlob, 'plant.jpg');

  const response = await fetch(`${API_URL}/identify`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(
      `Plant identification request failed with status ${response.status}`
    );
  }

  return response.json() as Promise<IdentifyResult>;
}
