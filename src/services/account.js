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
    method: 'delete',
    data: {
      user_id: userID,
    },
  });
}

export async function updateUser(userID, newPassword) {
  return request(`${updateUserURL}/${userID}`, {
    method: 'put',
    data: {
      old_password: '',
      new_password: newPassword,
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
  return request(getUserURL, {
    method: 'get',
    params: {
      username: key,
    },
  });
}

export async function putSettings(formData) {
  const userID = formData.get('userID');
  return request.put(`${getUserURL}/${userID}`, formData);
}

export async function uploadAvatar(formData) {
  return request.post(uploadAvatarURL, formData);
}
