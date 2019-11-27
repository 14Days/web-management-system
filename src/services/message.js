import {
  deleteMessageURL,
  getMessageURL,
  updateMessageURL,
  uploadImgURL,
  uploadMessageURL,
} from '../utils/url';
import request from '@/utils/request';

export async function fetchMessage() {
  return request.get(getMessageURL);
}

export async function deleteMessage(id) {
  return request(deleteMessageURL, {
    method: 'delete',
    data: {
      recommend_id: id,
    },
  });
}

export async function upload(img) {
  return request(uploadImgURL, {
    method: 'post',
    data: img,
  });
}

export async function uploadMessage(content, img) {
  return request(uploadMessageURL, {
    method: 'post',
    data: {
      img,
      content,
    },
  });
}

export async function updateMessge(content, img, old) {
  return request(updateMessageURL, {
    method: 'put',
    data: {
      content,
      new_img_id: img,
      old_img_id: old,
    },
  });
}
