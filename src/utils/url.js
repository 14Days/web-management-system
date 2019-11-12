let baseURL = 'https://wghtstudio.cn/back';

if (process.env.NODE_ENV === 'development') {
  baseURL = 'http://yapi.wghtstudio.cn/mock/21';
}

export const getAllAccountURL = `${baseURL}/user`;
