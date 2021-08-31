// 素材请求相关模块
import request from '@/utils/request'

// 用户上传图片素材
export const uploadImage = image => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/user/images',
    data: image
  })
}

// 获取用户图片素材
export const getImages = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/images',
    params
  })
}

// 收藏图片素材
export const collectImage = (img_id, collect) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/user/images/${img_id}`,
    data: { collect }
  })
}

// 删除图片素材
export const deleteImage = (img_id) => {
  return request({
    method: 'DELETE',
    url: `/mp/v1_0/user/images/${img_id}`,
  })
}