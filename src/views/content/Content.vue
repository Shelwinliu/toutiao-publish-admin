<template>
  <div>
    <el-card class="filter-box">
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-form ref="form" :model="form" label-width="40px" v-loading="loading">
        <el-form-item label="状态">
          <el-radio-group v-model="status" @change="loadArticles(1)">
            <!--
              el-radio 默认把 label 作为文本和选中之后的 value 值
             -->
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select
            v-model="channelId"
            placeholder="请选择频道"
            @change="loadArticles(1)"
          >
            <el-option label="全部" :value="null"></el-option>
            <template v-for="(item, index) in channels">
              <el-option
                :label="item.name"
                :value="item.id"
                :key="index"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="loadArticles(1)"
          >
          </el-date-picker>
        </el-form-item>
        <!--
            button 按钮的 click 事件有个默认参数
            当你没有指定参数的时候，它会默认传递一个没用的数据
           -->
        <!-- <el-form-item>
          <el-button type="primary" @click="loadArticles(1)">查询</el-button>
        </el-form-item> -->
      </el-form>
    </el-card>

    <el-card>
      <div slot="header">根据筛选条件共查询到 {{ totalPages }} 条结果：</div>
      <el-table :data="articleLists" style="width: 100%" v-loading="loading">
        <el-table-column label="封面" width="180">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.cover.images[0]"
              fit="fill"
              lazy
            >
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div></el-image
            >
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="180">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag :type="articleStatus[scope.row.status].type">{{
              articleStatus[scope.row.status].text
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              size="small"
              type="primary"
              circle
            ></el-button>
            <el-button
              icon="el-icon-delete"
              size="small"
              type="danger"
              circle
              @click="onDeleteArticle(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        layout="prev, pager, next"
        background
        :total="totalPages"
        :page-size="perPage"
        :current-page.sync="currentPage"
        @current-change="onCurrentChange"
        :disabled="loading"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import {
  getArticles,
  getArticleChannels,
  deleteArticle,
} from "@/api/content.js";

export default {
  name: "Content",
  components: {},
  props: {},
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      articleLists: [],
      articleStatus: [
        { status: 0, text: "草稿", type: "info" }, // 0
        { status: 1, text: "待审核", type: "" }, // 1
        { status: 2, text: "审核通过", type: "success" }, // 2
        { status: 3, text: "审核失败", type: "warning" }, // 3
        { status: 4, text: "已删除", type: "danger" }, // 4
      ],
      totalPages: 0,
      perPage: 10,
      status: null, // 查询文章的状态，不传就是全部
      channels: [], // 文章频道列表
      channelId: null,
      dateRange: null,
      loading: true,
      currentPage: 1,
      // img: require("@/assets/images/logIn/login_bg.jpg"),
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticles();
    this.loadChannels();
  },
  mounted() {},
  methods: {
    loadArticles(page = 1) {
      this.currentPage = page; // 用户每进行一次筛选，Pagination 的当前页数应重新变回1，否则有可能会出现第n页显示第一页的数据
      this.loading = true;
      getArticles({
        page,
        per_page: this.perPage,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.dateRange ? this.dateRange[0] : null,
        end_pubdate: this.dateRange ? this.dateRange[1] : null,
      }).then((res) => {
        // console.log(res.data.data.results);
        // this.articleLists = res.data.data.results;
        // this.totalPages = res.data.data.total_count;

        const { results, total_count: totalCount } = res.data.data;
        this.articleLists = results;
        this.totalPages = totalCount;
        // 关闭加载中loading
        this.loading = false;
      });
    },

    loadChannels() {
      getArticleChannels().then((res) => {
        this.channels = res.data.data.channels;
      });
    },

    onCurrentChange(page) {
      this.loadArticles(page);
    },

    onDeleteArticle(articleId) {
      console.log(articleId);
      console.log(articleId.toString());

      this.$confirm("确认删除吗？", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功",
          });
          deleteArticle(articleId.toString()).then((res) => {
            console.log(res);
            this.loadArticles(this.currentPage)
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消删除",
          });
        });
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
</style>
