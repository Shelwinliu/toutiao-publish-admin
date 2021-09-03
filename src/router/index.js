import Vue from 'vue'
import VueRouter from 'vue-router'

import LogIn from '@/views/logIn/LogIn'
import Home from '@/views/home/Home'
import Layout from '@/views/layout/Layout'
import Content from '@/views/content/Content'
import Publish from '@/views/publish/Publish'
import Material from '@/views/material/Material'
import Comment from '@/views/comment/Comment'
import PersonalSettings from '@/views/personalSettings/PersonalSettings'
import Fans from '@/views/fans/Fans'

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: LogIn
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'home',
        name: 'home',
        component: Home
      },
      {
        path: 'content',
        name: 'content',
        component: Content
      },
      {
        path: 'publish',
        name: 'publish',
        component: Publish
      },
      {
        path: 'material',
        name: 'material',
        component: Material
      },
      {
        path: 'comment',
        name: 'comment',
        component: Comment
      },
      {
        path: 'settings',
        name: 'settings',
        component: PersonalSettings
      },
      {
        path: 'fans',
        name: 'fans',
        component: Fans
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由导航守卫：说白了所有页面的导航都会经过这里
// 守卫页面的导航的
// to：要去的路由信息
// from：来自哪里的路由信息
// next：放行方法
router.beforeEach((to, from, next) => {
  // 如果要访问的页面不是 /login，校验登录状态
  // 如果没有登录，则跳转到登录页面
  // 如果登录了，则允许通过
  // 允许通过
  // next()

  const user = JSON.parse(window.localStorage.getItem('user'))

  // 校验非登录页面的登录状态
  if (to.path !== '/login') {
    if (user) {
      // 已登录，允许通过
      next()
    } else {
      // 没有登录，跳转到登录页面
      next('/login')
    }
  } else {
    // 登录页面，正常允许通过
    next()
  }
})

export default router
