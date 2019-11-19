import request from '@/utils/request';
import { getNoticeURL, commitNoticeURL, changeNoticeURL, deleteNoticeURL, detailNoticeURL } from '../utils/url';

// 获取公告
export async function getNotice(limit, page, startTime, endTime) {
  return request.get(getNoticeURL, {
    limit,
    page,
    startTime,
    endTime,
  });
}

// 发送公告
export async function commitNotice(title, content, type, isTop) {
  return request.post(commitNoticeURL, {
    title,
    content,
    type,
    is_top: isTop,
  });
}

// 修改公告
export async function changeNotice(noticeId, title, content, type, isTop) {
  return request.put(changeNoticeURL, {
    notice_id: noticeId,
    title,
    content,
    type,
    is_top: isTop,
  })
}

// 删除公告
export async function deleteNotcie(noticeId) {
  return request.delete(deleteNoticeURL, {
    notice_id: noticeId,
  })
}

// 公告详情
export async function detailNotice(noticeId) {
  return request.get(detailNoticeURL, {
    notice_id: noticeId,
  })
}
