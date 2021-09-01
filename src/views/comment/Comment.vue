<template>
  <div>
    <el-card>
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-table
        :data="commentLists"
        style="width: 100%"
        height="520px"
        v-loading="loading"
      >
        <el-table-column prop="title" label="标题" width="300">
        </el-table-column>
        <el-table-column
          prop="total_comment_count"
          label="总评论数"
          width="200"
        >
        </el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝评论数">
        </el-table-column>
        <el-table-column label="评论状态">
          <template slot-scope="scope">
            {{ scope.row.comment_status ? "正常" : "关闭" }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.comment_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="onStatusChange(scope.row)"
              :disabled="scope.row.switch_disabled"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size.sync="perPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticles, modifyCommentStatus } from "@/api/content.js";

export default {
  name: "Comment",
  components: {},
  props: {},
  data() {
    return {
      currentPage: 1,
      loading: false,
      commentLists: [],
      total: 0,
      perPage: 10,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadComments();
  },
  mounted() {},
  methods: {
    loadComments(currentPage = 1) {
      this.loading = true;
      getArticles({
        page: currentPage,
        per_page: this.perPage,
        response_type: "comment",
      }).then((res) => {
        console.log(res.data);
        const { results, total_count: totalCount } = res.data.data;
        results.forEach((article) => {
          article.switch_disabled = false;
        });
        this.commentLists = results;
        this.total = totalCount;

        // 加载完成
        this.loading = false;
      });
    },

    // 修改评论状态
    onStatusChange(article) {
      article.switch_disabled = true;
      modifyCommentStatus(article.id.toString(), article.comment_status).then(
        (res) => {
          console.log(res);
          article.switch_disabled = false;
          this.$message({
            type: "success",
            message: article.comment_status
              ? "开启文章评论状态"
              : "关闭文章评论状态",
          });
        }
      );
    },

    // 分页处理
    handleSizeChange() {
      this.currentPage = 1
      this.loadComments();
    },
    handleCurrentChange(val) {
      this.loadComments(val);
    },
  },
};
</script>

<style lang='less' scoped>
.el-card {
  margin-bottom: 30px;
  .el-pagination {
    margin-top: 10px;
  }
}

.el-table td {
  padding-right: 30px !important;
}
</style>
