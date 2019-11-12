let baseURL = 'https://wghtstudio.cn/back';

if (process.env.NODE_ENV === 'development') {
  baseURL = 'http://yapi.wghtstudio.cn/mock/21';
}

// 获取所有的管理员用户信息
export const getAllAccountURL = `${baseURL}/user`;

// 提交删除
export const commitDeletaURL = `${baseURL}/user/delete`;
