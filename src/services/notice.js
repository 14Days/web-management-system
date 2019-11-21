import request from '@/utils/request';
import { getNoticeURL, commitNoticeURL, changeNoticeURL, deleteNoticeURL, detailNoticeURL } from '../utils/url';

// 获取公告
export async function getNotice(limit, page) {
  return request.get(getNoticeURL, {
    params: {
      limit,
      page,
    },
  });
}

// 发送公告
export async function commitNotice(title, content, type, isTop) {
  return request.post(commitNoticeURL, {
    data: {
      title,
      content,
      type,
      is_top: isTop,
    },
  });
}

// 修改公告
export async function changeNotice(noticeId, title, content, type, isTop) {
  return request.put(changeNoticeURL + noticeId, {
    data: {
      title,
      content,
      type,
      is_top: isTop,
    },
  })
}

// 删除公告
export async function deleteNotcie(noticeId) {
  return request.delete(deleteNoticeURL, {
    data: {
      notice_id: [noticeId],
    },
  })
}

// 公告详情
export async function detailNotice(noticeId) {
  return request.get(detailNoticeURL + noticeId)
}

// 搜索公告
export async function searchNotice(limit, page, title) {
  return request.get(getNoticeURL, {
    params: {
      limit,
      page,
      title,
    },
  });
}
