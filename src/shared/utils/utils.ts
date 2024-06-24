import { Role } from "../enums/role.enum";

export function getRoleByIndex(index: number): Role | undefined {
  const roleValues = Object.values(Role);
  return roleValues[index - 1];
}

export function isParse(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
}
