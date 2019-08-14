import { apiGet } from '@/utils/request';

export default function queryError(code) {
  return apiGet(`/api/${code}`);
}
