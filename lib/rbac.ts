/**
 * Role-based access control utilities.
 * Define helper functions to check whether a user has permission to perform
 * certain actions. Keeping this logic in one place makes it easier to audit
 * and modify when requirements change.
 */

import { UserRole } from '@prisma/client';

export function isAdmin(role?: UserRole | string | null): boolean {
  return role === UserRole.ADMIN || role === 'ADMIN';
}

export function isRestaurantOwner(role?: UserRole | string | null): boolean {
  return role === UserRole.RESTAURANT_OWNER || role === 'RESTAURANT_OWNER';
}

export function isCustomer(role?: UserRole | string | null): boolean {
  return role === UserRole.CUSTOMER || role === 'CUSTOMER';
}

/**
 * Guard function to assert that a user has at least one of the allowed roles.
 * Throws an Error if the user does not have permission.
 */
export function assertRole(role: UserRole | string | undefined | null, allowed: UserRole[]): void {
  if (!role || !allowed.includes(role as UserRole)) {
    throw new Error('You do not have permission to perform this action.');
  }
}