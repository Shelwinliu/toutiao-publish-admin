import { getArticleChannels } from '@/api/content.js'

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