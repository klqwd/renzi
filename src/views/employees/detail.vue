<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <el-tabs v-model="activeName" @tab-click="tabClick">
          <el-tab-pane label="登录账户设置" name="first">
            <el-form
              ref="form"
              label-width="80px"
              :model="formLabelAlign"
              :rules="loginRule"
            >
              <el-form-item label="姓名" prop="username">
                <el-input v-model="formLabelAlign.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input
                  v-model="formLabelAlign.password"
                  type="password"
                ></el-input>
              </el-form-item>
              <el-button @click="updateEmployee">更新</el-button>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情" name="second">
            <user-info></user-info>
          </el-tab-pane>
          <el-tab-pane label="岗位信息" name="third">
            <job-info></job-info>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById, saveUserDetailById } from "@/api/user";
import JobInfo from "./components/job-info.vue";
import UserInfo from "./components/user-info.vue";
import Cookies from "js-cookie";
export default {
  components: {
    JobInfo,
    UserInfo,
  },
  data() {
    return {
      activeName: Cookies.get("activeName") || "first",
      formLabelAlign: {
        username: "",
        password: "",
      },
      validate: {},
      loginRule: {
        username: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 10, message: "长度在2到10个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 50, message: "长度在6到50个字符", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.loadEmployeesInfo();
  },
  methods: {
    // 获取用户信息
    async loadEmployeesInfo() {
      const res = await getUserDetailById(this.$route.params.id);
      this.formLabelAlign = res;
    },
    //更新用户信息
    async updateEmployee() {
      try {
        await this.$refs.form.validate();
        await saveUserDetailById(this.formLabelAlign);
        this.$message.success("更新成功");
      } catch (err) {
        console.log(err);
      }
    },
    tabClick() {
      console.log(this.activeName);
      Cookies.set("activeName", this.activeName);
    },
  },
};
</script>

<style></style>
