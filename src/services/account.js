import request from '@/utils/request';
import { commitDeletaURL, createAccountURL, getAllAccountURL, updateUserURL } from '../utils/url';

export async function fetchtAllAccount() {
  return request.get(getAllAccountURL);
}

export async function commitDelete(userID) {
  return request.post(commitDeletaURL, {
    user_id: userID,
  });
}

export async function updateUser(username, password) {
  return request.post(updateUserURL, {
    username,
    password,
  });
}

export async function createAccount(username, password) {
  return request.post(createAccountURL, {
    username,
    password,
  });
}

export async function fetchSearInfo(key) {
  return request.get(getAllAccountURL, {
    username: key,
  });
}
