export const ADMIN_SESSION_COOKIE = "admin_session";

export function isValidAdminSession(cookieValue: string | undefined): boolean {
  const password = process.env.ADMIN_PASSWORD;
  return !!password && !!cookieValue && cookieValue === password;
}
