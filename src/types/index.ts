export interface User {
  username: string;
  password: string;
  role: 'caller' | 'admin';
}

export interface Lead {
  rowIndex: number;
  niche: string;
  country: string;
  state: string;
  mobile_number: string;
  status: string;
  comment: string;
  caller_username: string;
  calling_date_time: string;
  call_recording_url: string;
}

export interface CallFormData {
  status: string;
  comment: string;
  audioFile: File | null;
}

export interface GoogleConfig {
  sheetId: string;
  sheetName: string;
  driveFolderId: string;
  apiKey: string;
}

export interface AppConfig {
  appName: string;
  version: string;
}

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};
