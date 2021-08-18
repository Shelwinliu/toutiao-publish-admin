// 用户请求相关模块

import request from '@/utils/request'

// 用户登录
export const logInApi = data => {
  return request({
    method: "POST",
    url: "/mp/v1_0/authorizations",
    data
    // data与上述data同名，可简写，相当于data: data
  })
}

// 获取用户个人资料
export const getUserProfile = () => {
  return request({
    method: "Get",
    url: "/mp/v1_0/user/profile",
    headers: {
      // 属性名和值都得看接口的要求
      // 属性名：Authorization，接口要求的
      // 属性值：Bearer空格token数据
      Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NjA3Mjk5MDMsInVzZXJfaWQiOjEsInJlZnJlc2giOmZhbHNlLCJ2ZXJpZmllZCI6dHJ1ZX0.Omr7NkdUp613IcU3KMadyvqHYKGXmzb3dyNU-EwVOYI'
    }
  })
}

