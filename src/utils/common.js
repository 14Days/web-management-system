import { notification } from 'antd';
import { pullAppAvaURL, pullWebAvaURL, pullImgURL } from './url';

export function showNotification(type, message) {
  notification[type]({
    message,
  });
}

export const formatWebAvaUrl = name => `${pullWebAvaURL}${name}`;

export const formatAppAvaUrl = name => `${pullAppAvaURL}${name}`;

export const formatImgUrl = name => `${pullImgURL}${name}`;
