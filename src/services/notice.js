import request from '@/utils/request';
import { getNoticeURL, commitNoticeURL } from '../utils/url';

// 获取公告
export async function getNotice(params) {
  return request.get(getNoticeURL, {
    ...params,
  });
}

// 发送公告
export async function commitNotice(params) {
  return request.post(commitNoticeURL, {
    ...params,
  });
}
