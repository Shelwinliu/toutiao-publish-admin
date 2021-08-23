import axios from 'axios'
import JSONbig from 'json-bigint'

const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net',

  transformResponse: [data => {
    // Do whatever you want to transform the data
    // console.log(data);

    // 后端返回的数据可能不是 JSON 格式字符串
    // 如果不是的话，那么 JSONbig.parse 调用就会报错
    // 所以我们使用 try-catch 来捕获异常，处理异常的发生
    try {
      return JSONbig.parse(data)
    } catch (error) {
      console.log('JSON对象转换失败', error);
      // 如果转换失败了，则进入这里
      // 我们在这里把数据原封不动的直接返回给请求使用
      return data
    }
  }],
})

// 请求拦截器
request.interceptors.request.use(config => {
  // 任何所有请求会经过这里
  // config 是当前请求相关的配置信息对象
  // config 是可以修改
  // console.log(config.headers.Authorization);
  const user = JSON.parse(window.localStorage.getItem('user'))
  // 如果有登录用户信息，则统一设置 token
  if (user) config.headers.Authorization = `Bearer ${user.token}`

  // Do something before request is sent
  // 当 return config 之后才会真正发出去
  return config;
}, err => {
  // Do something with request error
  return Promise.reject(error);
});

export default request