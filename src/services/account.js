import request from '@/utils/request';
import { getAllAccountURL, commitDeletaURL } from '../utils/url';

export async function fetchtAllAccount() {
  return request.get(getAllAccountURL);
}

export async function commitDelete(userID) {
  return request.post(commitDeletaURL, {
    user_id: userID,
  });
}
