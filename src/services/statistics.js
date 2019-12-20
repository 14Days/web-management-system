import request from '@/utils/request';
import { getRecordURL } from '../utils/url';

export async function getRecord(start, end) {
  return request.get(getRecordURL, {
    params: {
      start,
      end,
    },
  });
}
