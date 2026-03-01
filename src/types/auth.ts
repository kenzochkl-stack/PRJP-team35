export type Role = "student" | "teacher" | "parent";

export type User = {
  id: string;
  role: Role;
  token: string | null;
};