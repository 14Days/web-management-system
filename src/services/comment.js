// import request from '@/utils/request';
import { getDetail } from './message';
import request from '@/utils/request';
import { deleteCommentURL } from '../utils/url';

export { getDetail };

export async function deleteComment(level, commentID) {
  return request(deleteCommentURL, {
    method: 'delete',
    data: {
      level,
      comment_id: commentID,
    },
  });
}
