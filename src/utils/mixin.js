import { getArticleChannels } from '@/api/content.js'
import { getImages } from "@/api/image.js";

export const articleChannelMixin = {
  data() {
    return {
      channels: [], // 文章频道列表
    }
  },
  created() {
    this.loadChannels();
  },
  methods: {
    loadChannels() {
      getArticleChannels().then((res) => {
        this.channels = res.data.data.channels;
      });
    },
  },
}

export const paginationMixin = {
  data() {
    return {
      loading: true,
      perPage: 24,
      currentPage: 1,
      totalPages: 0,
    };
  },
  methods: {
    loadFansList(page = 1) {
      // 表单加载
      this.loading = true;
      this.currentPage = page;
      getImages({
        page,
        per_page: this.perPage,
      }).then((res) => {
        const { results, total_count: totalCount } = res.data.data;

        this.fansList = results;
        this.loading = false;
        this.totalPages = totalCount;
      });
    },
    onCurrentChange(page) {
      this.loadFansList(page);
    },
  },
}

export const fileUploadMixin = {
  data() {
    return {
      previewURL: null,
      dialogUploadVisible: false,
    };
  },
  methods: {
    // 图片预览
    onFileChange() {
      // Fetches the first file in the node's file list as a File object
      const previewFile = this.$refs.upload.files[0];
      // The URL.createObjectURL() static method creates a DOMString containing a URL representing the object given in the parameter.
      const blobData = URL.createObjectURL(previewFile);
      this.previewURL = blobData;

      // 展示弹出层，预览用户选择的图片
      this.dialogUploadVisible = true;

      // 解决选择相同文件时不触发change事件的问题
      // A file input's value attribute contains a DOMString that represents the path to the selected file(s)
      if (this.uploadValueReset)
        this.$refs.upload.value = "";
    },
  },
}