<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :file-list="fileList"
      :on-preview="onPreview"
      :on-remove="onRemove"
      :on-change="onchange"
      :http-request="onRequest"
      :limit="1"
      :before-upload="beforeupload"
      class="upload"
      v-loading="loading"
    >
      <i class="el-icon-plus"></i>
    </el-upload>

    <el-dialog
      title="图片预览"
      :visible.sync="previewDialog"
      width="60%"
      :before-close="handleClose"
      show-close
    >
      <img :src="previewImgUrl" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
import COS from "cos-js-sdk-v5";
console.log(COS);
const cos = new COS({
  SecretId: "AKIDnm1TBCIVsRA1vxyzwlQ09DB2qZCgBZq0",
  SecretKey: "18FJJBsMj2JSVQPNKBsa4nfgkr9uw9aB",
});
export default {
  name: "UploadImg",
  props: {
    defaultUrl: {
      type: String,
      default: () => "",
    },
  },
  watch: {
    defaultUrl() {
      this.fileList.push({
        name: "default",
        url: this.defaultUrl,
      });
    },
  },
  data() {
    return {
      fileList: [],
      previewDialog: false,
      previewImgUrl: "",
      loading: false,
    };
  },
  created() {},
  methods: {
    onPreview(file) {
      this.previewImgUrl = file.url;
      this.previewDialog = true;
    },
    onRemove(file, fileList) {
      console.log(file);
      console.log("点击删除");
      this.fileList = fileList;
    },
    //1.本地选择上传
    //2.请求上传
    onchange(file, fileList) {
      this.fileList.push(file);
    },

    onRequest({ file }) {
      this.loading = true;
      cos.putObject(
        {
          Bucket: "pyh-1314348498" /* 填写自己的bucket，必须字段 */,
          Region: "ap-shanghai" /* 存储桶所在地域，必须字段 */,
          Key: file.name,
          Body: file, // 上传文件对象
          onProgress: function (progressData) {
            console.log(JSON.stringify(progressData));
          },
        },
        (err, data) => {
          if (err) return this.$message.error("上传图片失败");
          this.loading = false;
          this.$emit("on-success", {
            imgUrl: "https://" + data.Location,
          });
        }
      );
    },

    handleClose() {
      this.previewDialog = false;
    },
    beforeupload(file) {
      const allowTypes = ["image/jpg", "image/gif", "image/png"];
      const ishas = allowTypes.includes(file.type);
      if (!ishas) {
        this.$message.error("只能上传" + allowTypes.join(",") + "类型文件");
        return false;
      }
      //   限制上传大小
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.$message.error("上传的图片不能超过5mb");
        return false;
      }
    },
  },
};
</script>

<style>
.upload {
  width: 148px;
  height: 148px;
  overflow: hidden;
}
</style>
