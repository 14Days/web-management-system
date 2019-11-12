import request from '@/utils/request';
import { getAllAccountURL, commitDeletaURL, updateUserURL } from '../utils/url';

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
