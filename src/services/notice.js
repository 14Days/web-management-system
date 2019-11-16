import request from '@/utils/request';
import { getNoticeURL, commitNoticeURL } from '../utils/url';

// 获取公告
export async function getNotice() {
  return request.get(getNoticeURL);
}

// 发送公告
export async function commitNotice(params) {
  return request.post(commitNoticeURL, {
    ...params,
  });
}
