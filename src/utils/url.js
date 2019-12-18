const baseURL = 'https://wghtstudio.cn/back';

// if (process.env.NODE_ENV === 'development') {
//   baseURL = 'http://yapi.wghtstudio.cn/mock/21';
// }

const userURL = `${baseURL}/user`;

// 获取所有的管理员用户信息
export const getUserURL = userURL;

// 提交删除
export const commitDeletaURL = userURL;

// 新建账号
export const createAccountURL = userURL;

// 修改个人信息
export const updateUserInfoUrl = userURL;

// 修改密码
export const changePwdURL = `${userURL}/password`;

// 登录
export const loginURL = `${baseURL}/login`;

// 获取统计信息
export const getRecordURL = 'http://yapi.wghtstudio.cn/mock/21/record';

// 获取推荐消息
export const getMessageURL = `${baseURL}/img`;

// 删除推荐消息
export const deleteMessageURL = `${baseURL}/img`;

// 获取公告信息
export const getNoticeURL = `${baseURL}/notice`;

// 发布新公告
export const commitNoticeURL = `${baseURL}/notice`;

// 获取公告详情（/必要）
export const detailNoticeURL = `${baseURL}/notice/`;

// 删除公告
export const deleteNoticeURL = `${baseURL}/notice`;

// 修改公告(/必要)
export const changeNoticeURL = `${baseURL}/notice/`;

// 上传推荐消息图片
export const uploadImgURL = `${baseURL}/img/upload`;

// 上传推荐消息
export const uploadMessageURL = `${baseURL}/img`;

// 上传头像
export const uploadAvatarURL = `${baseURL}/user/avatar`;

// 修改推荐消息
export const updateMessageURL = `${baseURL}/img`;

// 获取推荐消息详情
export const getMessageDetailURL = `${baseURL}/img`;

// 拉取web头像图片
export const pullWebAvaURL = 'http://pull.wghtstudio.cn/avatar/web/';

// 拉取app头像图片
export const pullAppAvaURL = 'http://pull.wghtstudio.cn/avatar/app/';

// 拉取素材图片
export const pullImgURL = 'http://pull.wghtstudio.cn/img/';

// 获取文件夹表
export const getFileURL = `${baseURL}/gallery`;

// 新建文件夹
export const newFileURL = `${baseURL}/gallery`;

// 更改文件夹名称
export const renameFileURL = `${baseURL}/gallery/`;

// 删除文件夹
export const deleteFileURL = `${baseURL}/gallery/`;

// 获取图片
export const getImgURL = `${baseURL}/gallery/`;

// 更改图片文件夹
export const moveImgURL = `${baseURL}/gallery/img/move`;

// 删除图片
export const deleteImgURL = `${baseURL}/gallery/img`;
