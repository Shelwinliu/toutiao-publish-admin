<template>
  <div>
    <el-card body-style="height: 500px">
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-row>
        <el-col :span="10">
          <el-form :model="user" label-width="80px" :rules="formRules">
            <el-form-item label="编号">{{ user.id }}</el-form-item>
            <el-form-item label="手机"> {{ user.mobile }} </el-form-item>
            <el-form-item label="媒体名称" prop="name">
              <el-input v-model="user.name"></el-input>
            </el-form-item>

            <el-form-item label="媒体介绍">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="user.email"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                @click="onUpdateProfile"
                :loading="updateProfileLoading"
                >保存</el-button
              >
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </el-col>

        <el-col :span="8" :push="3">
          <p>当前头像</p>
          <el-avatar
            shape="circle"
            :size="200"
            fit="cover"
            :src="user.photo"
          ></el-avatar>
          <!-- <el-button type="text">Click to open the Message Box</el-button> -->
        </el-col>

        <el-col :span="4" :push="1">
          <p style="color: #2e9afe">编辑头像</p>
          <label for="upload">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </label>
          <input
            type="file"
            v-show
            id="upload"
            ref="upload"
            @change="onFileChange"
          />
        </el-col>
      </el-row>
    </el-card>

    <el-dialog
      title="修改头像"
      width="30%"
      :visible.sync="dialogUploadVisible"
      append-to-body
      @opened="dialogFullyOpened"
    >
      <div class="preview-img-wrapper">
        <img class="preview-img" :src="previewURL" ref="preview_image" />
      </div>
      <div class="dialog-footer">
        <el-button @click="dialogUploadVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="onUpdateAvatar"
          :loading="updateAvatarLoading"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserProfile, editUserAvatar, editUserProfile } from "@/api/user.js";

import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";

import { EventBus } from "@/utils/event-bus.js";
import { fileUploadMixin } from "@/utils/mixin.js";
import { formDataReq } from "@/utils/functions.js";

export default {
  name: "PersonalSettings",
  components: {},
  props: {},
  mixins: [fileUploadMixin],
  data() {
    const user = JSON.parse(window.localStorage.getItem("user"));
    return {
      user: {},
      imageUrl: "",
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`,
      },
      cropper: null, // 裁切器示例
      updateAvatarLoading: false,
      updateProfileLoading: false,
      formRules: {
        name: [
          { required: true, message: "用户名不能为空" },
          {
            pattern: /^.{1,7}$/,
            message: "用户名必须为 1~7 位",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "change" },
          {
            pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
            message: "请输入正确的邮箱格式",
            trigger: "change",
          },
        ],
      },
      uploadValueReset: true
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadSettings();
  },
  mounted() {},
  methods: {
    loadSettings() {
      getUserProfile().then((res) => {
        // console.log(res.data);
        this.user = res.data.data;
      });
    },

    dialogFullyOpened() {
      // 图片裁切器必须基于 img 进行初始化
      // 注意：img 必须是可见状态才能正常完成初始化
      //       因为我们这里要在对话框里面初始化裁切器
      //       所以务必要在对话框完全打开的状态去进行初始化。
      // 获取图片 DOM 节点
      const image = this.$refs["preview_image"];

      if (this.cropper) {
        this.cropper.replace(this.previewURL);
        return;
      }
      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        crop(event) {
          // console.log(event.detail.x);
          // console.log(event.detail.y);
          // console.log(event.detail.width);
          // console.log(event.detail.height);
          // console.log(event.detail.rotate);
          // console.log(event.detail.scaleX);
          // console.log(event.detail.scaleY);
        },
      });
    },

    onUpdateAvatar() {
      this.updateAvatarLoading = true;
      this.cropper.getCroppedCanvas().toBlob((blob) => {
        // const formData = new FormData();
        // formData.append("photo", blob);

        editUserAvatar(formDataReq("photo", blob)).then(
          (res) => {
            console.log(res);
            this.dialogUploadVisible = false;
            // 直接把裁切结果的文件对象转为 blob 数据本地预览
            this.user.photo = URL.createObjectURL(blob);
            this.$notify({
              title: "更新成功",
              message: "用户头像更新成功",
              type: "success",
            });
            this.updateAvatarLoading = false;
          },
          (err) => {
            this.$notify.error({
              title: "更新失败",
              message: "用户头像更新失败，请重试",
            });
            this.updateAvatarLoading = false;
          }
        );
      });
    },

    // 更新全部资料
    onUpdateProfile() {
      this.updateProfileLoading = true;
      const { name, intro, email } = this.user;
      editUserProfile({
        name,
        intro,
        email,
      }).then(
        (res) => {
          // 发布总线，用户资料已修改
          EventBus.$emit("updateProfile", this.user);
          this.$notify({
            title: "保存成功",
            message: "用户资料更新成功",
            type: "success",
          });
          this.updateProfileLoading = false;
        },
        (err) => {
          this.$notify.error({
            title: "保存失败",
            message: "用户资料保存失败，请重试",
          });
          this.updateProfileLoading = false;
        }
      );
    },
  },
};
</script>

<style lang='less' scoped>
p {
  margin: 0 0 30px 66px;
}

.avatar-uploader-icon {
  margin: 10px 0 0 8px;
  overflow: hidden;
  cursor: pointer;
  font-size: 28px;
  color: #8c939d;
  width: 180px;
  height: 180px;
  line-height: 180px;
  border-radius: 20%;
  text-align: center;
  background-color: rgba(192, 192, 192, 0.6);
}

.preview-img-wrapper {
  display: flex;
  justify-content: center;
  height: 280px;
  .preview-img {
    display: block;
    /* This rule is very important, please don't ignore this */
    max-width: 50%;
  }
}
.dialog-footer {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>