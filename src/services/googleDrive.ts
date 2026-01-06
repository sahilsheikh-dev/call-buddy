import { getDriveAccessToken } from "../services/googleAuth";

export const uploadToDrive = async (
  file: File,
  mobileNumber: string
): Promise<string> => {
  const accessToken = await getDriveAccessToken();

  const cleanMobile = mobileNumber.replace(/\D/g, "");
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace("T", "_")
    .slice(0, 15);

  const fileName = `${cleanMobile}_${timestamp}.mp3`;

  const metadata = {
    name: fileName,
    parents: [import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID],
  };

  const form = new FormData();
  form.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" })
  );
  form.append("file", file);

  const res = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    }
  );

  if (!res.ok) throw new Error(await res.text());

  const json = await res.json();

  await fetch(
    `https://www.googleapis.com/drive/v3/files/${json.id}/permissions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        role: "reader",
        type: "anyone",
      }),
    }
  );

  return json.webViewLink;
};
