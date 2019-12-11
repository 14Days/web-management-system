import {
  deleteMessageURL,
  getMessageDetailURL,
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

export async function updateMessge(messageID, content, img, old) {
  return request(`${updateMessageURL}/${messageID}`, {
    method: 'put',
    data: {
      content,
      new_img_id: img,
      old_img_id: old,
    },
  });
}

export async function getDetail(id) {
  return request(`${getMessageDetailURL}/${id}`, {
    method: 'get',
  });
}
