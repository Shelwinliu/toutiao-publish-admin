<template>
  <div>
    <div class="topBtns">
      <el-radio-group
        v-model="isCollect"
        size="small"
        @change.native="loadImages(1)"
      >
        <el-radio-button :label="false">全部</el-radio-button>
        <el-radio-button :label="true">收藏</el-radio-button>
      </el-radio-group>

      <el-button
        type="success"
        size="small"
        @click="dialogUploadVisible = true"
        v-if="isShowAdd"
        >添加素材</el-button
      >
    </div>
    <!-- 素材列表 -->
    <el-form v-loading="loading">
      <el-row :gutter="20">
        <el-col
          :xs="12"
          :sm="6"
          :md="4"
          :lg="lg"
          :xl="3"
          v-for="(item, index) in imgLists"
          :key="index"
          style="position: relative"
          @click.native="isSelected = index"
        >
          <el-image
            style="width: 100%; height: 180px"
            :src="item.url"
            fit="fit"
          ></el-image>
          <div
            class="is-selected"
            v-if="isShowSelected && isSelected === index"
          ></div>
          <div class="image-action" v-if="isShowAction">
            <el-button
              type="warning"
              :icon="item.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
              @click="onCollect(item)"
              :loading="item.collect_loading"
              :disabled="item.del_loading"
              size="small"
              circle
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="onDelete(item)"
              :loading="item.del_loading"
              :disabled="item.collect_loading"
              size="small"
              circle
            ></el-button>

            <!-- <i
                :class="{
                  'el-icon-star-on': item.is_collected,
                  'el-icon-star-off': !item.is_collected,
                }"
                @click="onCollect(item)"
              ></i>
              <i class="el-icon-delete" @click="onDelete(item)"></i> -->
          </div>
        </el-col>
      </el-row>
    </el-form>
    <!-- 数据分页 -->
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
    <!-- el-upload 已自动设置content-type为multipart/form-data，不支持axios，需要手动设置请求头headers -->
    <!-- action 为完整接口地址，name 为参数名称 -->
    <el-dialog
      title="上传素材"
      :visible.sync="dialogUploadVisible"
      :append-to-body="true"
    >
    </el-dialog>
  </div>
</template>

<script>
import { getImages, collectImage, deleteImage } from "@/api/image.js";

export default {
  name: "MaterialLists",
  components: {},
  props: {
    isShowAdd: {
      type: Boolean,
      default: false,
    },
    isShowAction: {
      type: Boolean,
      default: false,
    },
    lg: {
      type: Number,
      default: 4,
    },
    perPage: {
      type: Number,
      default: 24,
    },
    isShowSelected: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const user = JSON.parse(window.localStorage.getItem("user"));
    return {
      isCollect: false,
      imgLists: [],
      loading: true,
      dialogUploadVisible: false,
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`,
      },
      currentPage: 1,
      totalPages: 0,
      isSelected: null,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadImages();
  },
  mounted() {},
  methods: {
    loadImages(page = 1) {
      // 表单加载
      this.loading = true;
      this.currentPage = page;
      getImages({
        collect: this.isCollect,
        page,
        per_page: this.perPage,
      }).then((res) => {
        const { results, total_count: totalCount } = res.data.data;
        results.forEach((img) => {
          img.collect_loading = false;
          img.del_loading = false;
        });
        this.imgLists = results;
        this.loading = false;
        this.totalPages = totalCount;
      });
    },

    onUploadSuccess() {
      this.isCollect = false;
      this.loadImages();
    },

    onCurrentChange(page) {
      this.loadImages(page);
    },

    onCollect(img) {
      img.collect_loading = true;
      collectImage(img.id, !img.is_collected).then((res) => {
        img.is_collected = !img.is_collected;
        img.collect_loading = false;
      });
    },

    onDelete(img) {
      this.$confirm("是否确定删除？", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          img.del_loading = true;
          deleteImage(img.id).then((res) => {
            console.log(res);
            this.loadImages(this.currentPage);
            img.del_loading = false;
          });

          this.$message({
            type: "success",
            message: "删除成功",
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
.topBtns {
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

.upload {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.el-card {
  margin-bottom: 30px;
  .el-pagination {
    margin-top: 10px;
  }
}

.is-selected {
  background: url(../../assets/images/upload_cover/icon-tick.png) no-repeat;
  background-size: 50%;
  width: 100px;
  height: 100px;
  position: absolute;
  top: 136px;
  left: 120px;
  right: 0;
  bottom: 0;
}
.image-action {
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 4px;
  height: 40px;
  background-color: rgba(204, 204, 204, 0.5);
  font-size: 20px;
  color: #fff;
}

// .image-action::before {
//   position: absolute;
//   bottom: 0;
//   content: "";
//   width: 100%;
//   height: 40px;
//   background-color: rgba(204, 204, 204, 0.5);
// }
</style>
