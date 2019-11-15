import { deleteMessageURL, getMessageURL } from '../utils/url';
import request from '@/utils/request';

export async function fetchMessage() {
  return request.get(getMessageURL);
}

export async function deleteMessage(id) {
  // token
  return request.post(deleteMessageURL, id);
}
