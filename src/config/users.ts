import { User } from '@/types';

/**
 * Hardcoded users for authentication
 * In production, replace these with your actual caller credentials
 */
export const USERS: User[] = [
  { username: "agent1", password: "pass123", role: "caller" },
  { username: "agent2", password: "pass456", role: "caller" },
  { username: "agent3", password: "pass789", role: "caller" },
];
