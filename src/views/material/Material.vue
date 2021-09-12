<template>
  <div>
    <el-card>
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <material-lists :isShowAdd="true" :isShowAction="true"></material-lists>
    </el-card>
  </div>
</template>

<script>
import MaterialLists from "@/components/materialLists/MaterialLists.vue";
export default {
  name: "Material",
  components: { MaterialLists },
  props: {
    
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang='less' scoped>
</style>
