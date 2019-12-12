import request from '@/utils/request';
import { getFileURL, newFileURL, renameFileURL, deleteFileURL, getImgURL, moveImgURL, deleteImgURL } from '../utils/url';

// 获取文件夹表
export async function getFile() {
    return request.get(getFileURL, {
      params: {
        page: 0,
        limit: 300,
      },
    });
}

// 新建文件夹表
export async function newFile(name) {
    return request.post(newFileURL, {
      data: {
        name,
      },
    });
}

// 重命名文件夹
export async function renameFile(fileId, name) {
    return request.put(renameFileURL + fileId, {
      data: {
        name,
      },
    });
}

// 删除文件夹
export async function deleteFile(fileId) {
    return request.delete(deleteFileURL + fileId);
}

// 获取图片
export async function getImg(fileId, page, limit) {
    return request.get(getImgURL + fileId, {
      params: {
        page,
        limit,
      },
    });
}

// 更改图片文件夹
export async function moveImg(fileId, imgId) {
    return request.put(moveImgURL, {
      data: {
        file_id: fileId,
        img_id: imgId,
      },
    });
}

// 删除图片
export async function deleteImg(imgId) {
    return request.delete(deleteImgURL, {
      data: {
        img_id: imgId,
      },
    });
}
