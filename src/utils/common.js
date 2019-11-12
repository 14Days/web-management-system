import { notification } from 'antd';

export function showNotification(type, message) {
  notification[type]({
    message,
  });
}
