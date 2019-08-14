import { stringify } from 'qs';
import { apiPost, apiGet, apiDelete } from '@/utils/request';

export async function queryProjectNotice() {
  return apiGet('/api/project/notice');
}

export async function queryActivities() {
  return apiGet('/api/activities');
}

export async function queryRule(params) {
  return apiGet(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return apiPost('/api/rule', {
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return apiPost('/api/rule', {
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return apiPost(`/api/rule?${stringify(params.query)}`, {
    body: params,
  });
}

export async function fakeSubmitForm(params) {
  return apiPost('/api/forms', {
    body: params,
  });
}

export async function fakeChartData() {
  return apiGet('/api/fake_chart_data');
}

export async function queryTags() {
  return apiGet('/api/tags');
}

export async function queryBasicProfile(id) {
  return apiGet(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return apiGet('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return apiGet(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return apiDelete(`/api/fake_list?count=${count}`, {
    body: {
      ...restParams,
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return apiPost(`/api/fake_list?count=${count}`, {
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return apiPost(`/api/fake_list?count=${count}`, {
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export function fakeAccountLogin(params) {
  return apiPost('/api/login/account', {
    body: params,
  });
}

export function fakeRegister(params) {
  return apiPost('/api/register', {
    body: params,
  });
}

export function queryNotices(params = {}) {
  return apiGet(`/api/notices?${stringify(params)}`);
}

export function getFakeCaptcha(mobile) {
  return apiGet(`/api/captcha?mobile=${mobile}`);
}
