import request from '@/utils/request';
import { loginURL } from '../utils/url';

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function login(username, password) {
  return request.post(loginURL, {
    username,
    password,
  });
}
