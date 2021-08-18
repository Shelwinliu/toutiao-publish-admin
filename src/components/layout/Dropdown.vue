<template>
  <div>
    <el-dropdown class="dropdown">
      <div>
        <slot name="profile"></slot>
        <span class="el-dropdown-link">
          <slot name="dropdown-link"></slot>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
      </div>

      <el-dropdown-menu>
        <slot name="dropdown-item"></slot>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: "Dropdown",
  components: {},
  props: {},
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang='less' scoped>
.dropdown div {
  display: flex;
  align-items: center;
  cursor: pointer;
  .el-dropdown-link {
    color: #409eff;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
}
</style>
