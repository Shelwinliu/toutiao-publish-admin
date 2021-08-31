<template>
  <div>
    <el-card>
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{
            $route.query.id ? "编辑文章" : "发布文章"
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-form
        ref="publish-form"
        :model="article"
        :rules="rules"
        label-width="54px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <!-- <el-input type="textarea" v-model="article.content"></el-input> -->
          <el-tiptap
            v-model="article.content"
            :extensions="extensions"
            @onUpdate="onEditorUpdate"
            @onBlur="onBlur"
            lang="zh"
            placeholder="请输入内容 …"
            height="400"
          ></el-tiptap>
        </el-form-item>

        <el-form-item label="封面：">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="">
          <el-image></el-image>
        </el-form-item>

        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <template v-for="(item, index) in channels">
              <el-option
                :label="item.name"
                :value="item.id"
                :key="index"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">{{
            $route.query.id ? "修改" : "发布"
          }}</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { articleChannelMixin } from "@/utils/mixin";

import { addArticle, getSpecifiedArticle, editArticle } from "@/api/content.js";
import { uploadImage } from "@/api/image.js";

import {
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  Image,
  Indent,
  TodoItem,
  TodoList,
  TextAlign,
  HorizontalRule,
  FormatClear,
  Preview,
  Fullscreen,
} from "element-tiptap";
import "element-tiptap/lib/index.css";

export default {
  name: "Publish",
  components: {
    "el-tiptap": ElementTiptap,
  },
  props: {},
  mixins: [articleChannelMixin],
  data() {
    return {
      article: {
        title: "",
        content: "",
        cover: {
          // 文章封面
          type: 0, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: [""], // 封面图片的地址
        },
        channel_id: null,
      },

      rules: {
        title: [
          {
            required: true,
            message: "请输入标题",
            trigger: "blur",
          },
          {
            min: 5,
            max: 30,
            message: "长度应在 5 到 30 个字符",
            trigger: "blur",
          },
        ],
        content: [
          {
            required: true,
            message: "请输入内容",
          },
          {
            validator(rule, value, callback) {
              // console.log(value + '123');
              if (value) callback();
              else callback(new Error("请输入文章内容"));
            },
          },
        ],
        channel_id: [{ required: true, message: "请选择文章频道"}],
      },

      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // render command-button in bubble menu.
        new TextAlign(),
        new Image({
          uploadRequest(file) {
            // 如果接口要求 Content-Type 是 multipart/form-data，则请求体必须使用 FormData
            const fd = new FormData();
            fd.append("image", file);
            // 第1个 return 是返回 Promise 对象
            // 为什么？因为 axios 本身就是返回 Promise 对象
            return uploadImage(fd).then((res) => {
              return res.data.data.url;
            });
          },
        }),
        new Underline({ bubble: true, menubar: false }), // render command-button in bubble menu but not in menubar.
        new Italic(),
        new Strike(),
        new Indent(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new HorizontalRule(),
        new FormatClear(),
        new Preview(),
        new Fullscreen(),
      ],
    };
  },
  computed: {},
  watch: {},
  created() {
    if (this.$route.query.id) this.loadArticle();
  },
  mounted() {},
  methods: {
    onPublish(draft = false) {
      this.$refs["publish-form"].validate((valid) => {
        if (!valid) return;

        const articleId = this.$route.query.id;
        if (articleId) {
          editArticle(articleId, this.article, draft).then((res) => {
            this.$message({
              message: `${draft ? "已成功存入草稿" : "修改成功"}`,
              type: `${draft ? "info" : "success"}`,
            });
          });
          this.$router.push("/content");
        } else {
          addArticle(this.article, draft).then((res) => {
            console.log(res.data);
            this.$message({
              message: `${draft ? "已成功存入草稿" : "发布成功"}`,
              type: `${draft ? "info" : "success"}`,
            });
          });
          this.$router.push("/content");
        }
      });
    },

    // 加载指定文章
    loadArticle() {
      getSpecifiedArticle(this.$route.query.id).then((res) => {
        this.article = res.data.data;
      });
    },

    // 清空富文本编辑的内容后，去除其含有的html标签
    // https://blog.csdn.net/bigbear00007/article/details/80111998
    onEditorUpdate(html_content) {
      const content = html_content.replace(/<[^>]+>/g, "");
      if (!content) this.article.content = content;
    },

    // 富文本编辑器失去焦点后进行规则校验
    onBlur() {
      this.$refs["publish-form"].validate((valid) => {
        if (!valid) return;
      });
    },
  },
};
</script>

<style lang='less' scoped>
</style>
