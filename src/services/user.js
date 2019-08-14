import { apiGet } from '@/utils/request';

export function query() {
  return apiGet('/api/users');
}

export function queryCurrent() {
  return apiGet('/api/currentUser');
}
