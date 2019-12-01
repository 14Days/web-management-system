import request from '@/utils/request';
import { getRecordURL } from '../utils/url';

export async function getRecord(param) {
  return request.post(getRecordURL, {
    data: param,
  });
}
