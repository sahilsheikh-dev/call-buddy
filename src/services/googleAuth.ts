declare global {
  interface Window {
    google: any;
  }
}

let cachedToken: string | null = null;
let tokenExpiry = 0;
let tokenClient: any = null;

export const getDriveAccessToken = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const now = Date.now();

    // ✅ Reuse token if still valid
    if (cachedToken && now < tokenExpiry) {
      resolve(cachedToken);
      return;
    }

    // ✅ Create token client only once
    if (!tokenClient) {
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: "https://www.googleapis.com/auth/drive.file",
        callback: (resp: any) => {
          if (!resp.access_token) {
            reject("Failed to obtain access token");
            return;
          }

          cachedToken = resp.access_token;
          tokenExpiry = Date.now() + resp.expires_in * 1000 - 60000; // 1 min buffer

          resolve(cachedToken);
        },
      });
    }

    // ✅ Silent if possible, popup only if needed
    tokenClient.requestAccessToken({ prompt: "" });
  });
};
