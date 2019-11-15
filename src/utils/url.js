let baseURL = 'https://wghtstudio.cn/back';

if (process.env.NODE_ENV === 'development') {
  baseURL = 'http://yapi.wghtstudio.cn/mock/21';
}

// 获取所有的管理员用户信息
export const getAllAccountURL = `${baseURL}/user`;

// 提交删除
export const commitDeletaURL = `${baseURL}/user/delete`;

// 修改密码
export const updateUserURL = `${baseURL}/user/update`;

// 新建账号
export const createAccountURL = `${baseURL}/user/add`;

// 登录
export const loginURL = `${baseURL}/login`;

// 获取统计信息
export const getRecordURL = `${baseURL}/record`;

// 获取推荐消息
export const getMessageURL = `${baseURL}/img`;

// 删除推荐消息
export const deleteMessageURL = `${baseURL}/img/delete`;
