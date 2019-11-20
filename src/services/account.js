import request from '@/utils/request';
import {
  commitDeletaURL,
  createAccountURL,
  getUserURL,
  updateUserURL,
  uploadAvatarURL,
} from '../utils/url';

export async function fetchtAllAccount() {
  return request.get(getUserURL);
}

export async function commitDelete(userID) {
  return request(commitDeletaURL, {
    method: 'post',
    data: {
      user_id: userID,
    },
  });
}

export async function updateUser(username, password) {
  return request(updateUserURL, {
    method: 'post',
    data: {
      username,
      password,
    },
  });
}

export async function createAccount(username, password) {
  return request(createAccountURL, {
    method: 'post',
    data: {
      username,
      password,
    },
  });
}

export async function fetchSearInfo(key) {
  return request.get(getUserURL, {
    username: key,
  });
}

export async function putSettings(formData) {
  const userID = formData.get('userID');
  return request.put(`${getUserURL}/${userID}`, formData);
}

export async function uploadAvatar(formData) {
  return request.post(uploadAvatarURL, formData);
}
