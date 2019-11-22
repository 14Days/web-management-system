import { deleteMessageURL, getMessageURL, uploadImgURL, uploadMessageURL } from '../utils/url';
import request from '@/utils/request';

export async function fetchMessage() {
  return request.get(getMessageURL);
}

export async function deleteMessage(id) {
  // token
  return request(deleteMessageURL, {
    method: 'delete',
    data: {
      message_id: id,
    },
    params: {
      id,
    },
  });
}

export async function upload(img) {
  return request.post(uploadImgURL, img);
}

export async function uploadMessage(content, img) {
  return request.post(uploadMessageURL, {
    img,
    content,
  });
}
