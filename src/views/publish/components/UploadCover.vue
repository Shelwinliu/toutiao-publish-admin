<template>
  <div class="upload-cover" @click="dialogVisible = true">
    <div class="cover-wrapper">
      <img
        v-if="isShowPlusIcon"
        src="../../../assets/images/upload_cover/plus.png"
        style="width: 40px"
      />
      <img v-else class="cover-image" ref="cover-image" :src="value" />
    </div>

    <el-dialog
      title="选择封面"
      :visible.sync="dialogVisible"
      @closed="clearPreviewFile"
      append-to-body
    >
      <el-tabs type="card" v-model="activeName" @tab-click="">
        <el-tab-pane label="素材库" name="material">
          <material-lists
            :lg="6"
            :perPage="12"
            isShowSelected
            ref="materialLists"
          ></material-lists>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="upload">
          <div class="cover-wrapper" @click="$refs.upload.click()">
            <img
              v-if="!previewURL"
              src="../../../assets/images/upload_cover/plus.png"
              style="width: 40px"
            />
            <img
              v-else
              class="cover-image"
              ref="preview-image"
              :src="previewURL"
            />
          </div>

          <input
            type="file"
            v-show
            ref="upload"
            id="upload"
            @change="onFileChange"
          />
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onUploadCover" :loading="loading"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fileUploadMixin } from "@/utils/mixin.js";
import { formDataReq } from "@/utils/functions.js";

import { uploadImage } from "@/api/image.js";
import MaterialLists from "@/components/materialLists/MaterialLists.vue";

export default {
  name: "UploadCover",
  components: { MaterialLists },
  mixins: [fileUploadMixin],
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  // props: {
  //   coverSrc: {
  //     type: String,
  //     default: "",
  //   },
  // },
  data() {
    return {
      dialogVisible: false,
      radio: "全部",
      activeName: "material",
      // 第一次选择封面时不清空value
      uploadValueReset: false,
      loading: false,
      isShowPlusIcon: true,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    clearPreviewFile() {
      this.previewURL = "";
    },

    onUploadCover() {
      if (this.activeName === "upload") {
        const file = this.$refs.upload.files[0];
        if (!file) {
          this.$message("请选择封面");
          return;
        }

        this.loading = true;
        this.isShowPlusIcon = false
        uploadImage(formDataReq("image", file)).then((res) => {
          console.log(res);
          this.loading = false;
          this.dialogVisible = false;
          // 展示上传的图片
          this.$refs["cover-image"].src = this.previewURL;
          // 将图片地址发送给父组件
          // this.$emit("uploadCover", res.data.data.url);
          this.$emit("input", res.data.data.url);
          // 此时file已经上传完成，在此处清空value，解决更换图片执行onFileChange时的value始终为第一次上传的图片的value的问题
          // this.$refs.upload.value = "";
        });
      } else if (this.activeName === "material") {
        const materialLists = this.$refs.materialLists;
        const selected = materialLists.isSelected;
        if (materialLists.isSelected === null) {
          this.$message("请选择封面");
          return;
        }
        this.isShowPlusIcon = false
        this.dialogVisible = false;
        this.$emit("input", materialLists.imgLists[selected].url);
      }
    },
  },
};
</script>

<style lang='less' scoped>
.cover-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 150px;
  border: 1px dotted rgb(170, 116, 116);
  margin-right: 20px;
  cursor: pointer;
  .cover-image {
    height: 150px;
    width: 150px;
  }
}
.preview-cover {
  width: 150px;
  height: 150px;
  border: 1px solid black;
}
</style>
