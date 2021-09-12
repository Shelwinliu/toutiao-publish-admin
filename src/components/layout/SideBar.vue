<template>
  <div>
    <el-menu
      :default-active="$route.path"
      class="nav-menu"
      @open="handleOpen"
      @close="handleClose"
      background-color="#002033"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
      :collapse="isCollapse"
    >
      <el-menu-item index="/home">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/content">
        <i class="el-icon-document"></i>
        <span slot="title">内容管理</span>
      </el-menu-item>
      <el-menu-item index="/material" :class="{ 'menu-item': isCollapse }">
        <i class="iconfont icon-image"></i>
        <span slot="title">素材管理</span>
      </el-menu-item>
      <el-menu-item index="/publish" :class="{ 'menu-item': isCollapse }">
        <i class="iconfont icon-publish"></i>
        <span slot="title">发布文章</span>
      </el-menu-item>
      <el-menu-item index="/comment" :class="{ 'menu-item': isCollapse }">
        <i class="iconfont icon-Comment"></i>
        <span slot="title">评论管理</span>
      </el-menu-item>
      <el-menu-item index="/fans" :class="{ 'menu-item': isCollapse }">
        <i class="iconfont icon-fans"></i>
        <span slot="title">粉丝管理</span>
      </el-menu-item>
      <el-menu-item index="/settings">
        <i class="el-icon-setting"></i>
        <span slot="title">个人设置</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "SideBar",
  components: {},
  props: {
    isCollapse: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>

<style lang='less' scoped>
.nav-menu:not(.el-menu--collapse) {
  width: 200px;
  span {
    padding-right: 30px;
  }
  .iconfont {
    text-align: left;
    margin-left: 4px;
    margin-right: 9px;
  }
}
.menu-item {
  text-align: center;
}
</style>
