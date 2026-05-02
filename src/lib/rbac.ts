
export type Role = 'user' | 'pro' | 'moderator' | 'admin';

export type Permission = 
  | 'view:outfits'
  | 'create:wishlist'
  | 'create:analysis'
  | 'view:own_profile'
  | 'update:own_profile'
  | 'access:price_alerts'
  | 'access:wardrobe_builder'
  | 'access:meesho'
  | 'access:premium_filters'
  | 'view:all_profiles'
  | 'update:content_flags'
  | 'manage:users'
  | 'manage:roles'
  | 'view:analytics_dashboard';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  user: [
    'view:outfits',
    'create:wishlist',
    'create:analysis',
    'view:own_profile',
    'update:own_profile',
  ],
  pro: [
    'view:outfits',
    'create:wishlist',
    'create:analysis',
    'view:own_profile',
    'update:own_profile',
    'access:price_alerts',
    'access:wardrobe_builder',
    'access:meesho',
    'access:premium_filters',
  ],
  moderator: [
    'view:outfits',
    'create:wishlist',
    'create:analysis',
    'view:own_profile',
    'update:own_profile',
    'access:price_alerts',
    'access:wardrobe_builder',
    'access:meesho',
    'access:premium_filters',
    'view:all_profiles',
    'update:content_flags',
  ],
  admin: [
    'view:outfits',
    'create:wishlist',
    'create:analysis',
    'view:own_profile',
    'update:own_profile',
    'access:price_alerts',
    'access:wardrobe_builder',
    'access:meesho',
    'access:premium_filters',
    'view:all_profiles',
    'update:content_flags',
    'manage:users',
    'manage:roles',
    'view:analytics_dashboard',
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}
