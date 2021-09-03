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