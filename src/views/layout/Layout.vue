<template>
  <div>
    <el-container class="layout-container">
      <el-aside width="200px" class="aside">
        <side-bar></side-bar>
      </el-aside>
      <el-container>
        <el-header class="header">
          <div><i class="el-icon-s-unfold"></i> <span>xxx有限公司</span></div>
          <dropdown>
            <img slot="profile" :src="user.photo" alt="" class="avatar" />
            <span slot="dropdown-link">{{ user.name }}</span>
            <el-dropdown-item slot="dropdown-item">设置</el-dropdown-item>
            <el-dropdown-item slot="dropdown-item">退出</el-dropdown-item>
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
    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
}
</style>
