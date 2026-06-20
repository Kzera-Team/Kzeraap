export type AuthState =
  | 'not_initialized'
  | 'locked'
  | 'unlocked'
  | 'faceid_required'
  | 'password_required'
  | 'backup_required';
