<template>
  <div>
    <el-container class="layout-container">
      <el-aside width="auto" class="aside">
        <side-bar :isCollapse="isCollapse"></side-bar>
      </el-aside>
      <el-container>
        <el-header class="header">
          <div class="header-left">
            <i
              :class="{
                'el-icon-s-fold': isCollapse,
                'el-icon-s-unfold': !isCollapse,
              }"
              class="icon-fold"
              @click="isCollapse = !isCollapse"
            ></i>
            <span>xxx有限公司</span>
          </div>
          <dropdown>
            <img slot="profile" :src="user.photo" alt="" class="avatar" />
            <span slot="dropdown-link">{{ user.name }}</span>
            <el-dropdown-item slot="dropdown-item">设置</el-dropdown-item>
            <el-dropdown-item slot="dropdown-item" @click.native="onLogout"
              >退出</el-dropdown-item
            >
          </dropdown>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import SideBar from "@/components/layout/SideBar";
import Dropdown from "@/components/layout/Dropdown";

import { getUserProfile } from "@/api/user";

export default {
  name: "Layout",
  components: {
    SideBar,
    Dropdown,
  },
  props: {},
  data() {
    return {
      user: {},
      isCollapse: false, // 侧边栏展开状态
    };
  },
  created() {
    this.loadUserProfile();
  },
  methods: {
    loadUserProfile() {
      getUserProfile().then((res) => {
        this.user = res.data.data;
      });
    },
    onLogout() {
      this.$confirm("确认退出吗？", "退出提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '退出成功'
          });
          // 把用户的登录状态清除
          window.localStorage.removeItem("user");

          // 跳转到登录页面
          this.$router.replace("/login");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出",
          });
        });
    },
  },
};
</script>

<style lang='less' scoped>
.layout-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .aside {
    background-color: #002033;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .header-left {
      height: 30px;
      line-height: 30px;
      .icon-fold {
        font-size: 130%;
        width: 30px;
        cursor: pointer;
        vertical-align: middle;
      }
      span {
        vertical-align: middle;
      }
    }
    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
}
</style>
