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
  // const user = JSON.parse(window.localStorage.getItem('user'))
  // console.log(user);
  return request({
    method: "Get",
    url: "/mp/v1_0/user/profile",
    // headers: {
      // 属性名和值都得看接口的要求
      // 属性名：Authorization，接口要求的
      // 属性值：Bearer空格token数据
    //   Authorization: `Bearer ${user.token}`
    // }
  })
}

// 编辑用户头像
export const editUserAvatar = photo => {
  return request({
    method: "PATCH",
    url: "/mp/v1_0/user/photo",
    data: photo
  })
}

// 编辑用户资料
export const editUserProfile = modifiedProfile => {
  return request({
    method: "PATCH",
    url: "/mp/v1_0/user/profile",
    data: modifiedProfile
  })
}

// 获取粉丝列表
export const getFansList = params => {
  return request({
    method: "GET",
    url: "/mp/v1_0/followers",
    params
  })
}