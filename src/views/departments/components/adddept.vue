<template>
  <el-dialog title="新增部门" :visible="dialogVisible" @close="handleClose">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form
      label-width="120px"
      :model="formData"
      :rules="rules"
      ref="addDeptForm"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          style="width: 80%"
          placeholder="1-50个字符"
          v-model="formData.name"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          style="width: 80%"
          placeholder="1-50个字符"
          v-model="formData.code"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="formData.manager"
          style="width: 80%"
          placeholder="请选择"
          @focus="getEmployee"
        >
          <el-option
            :label="item.username"
            :value="item.username"
            v-for="item in peoples"
            :key="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button
          type="primary"
          size="small"
          @click="submit"
          v-loading="loading"
          >确定</el-button
        >
        <el-button size="small" @click="handleClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments } from "@/api/department";
import { getEmployee } from "@/api/employee";

export default {
  props: {
    name: "HrsaasAddDept",
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    treeNode: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    //部门编码 在整个模块都不允许重复
    //拿出所有的部门数据 一个个的比较过去 如果出现重复 则校验不通过 否则校验通过
    // 检查编码重复
    const checkCodeRepeat = async (rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments();
      console.log("depts", depts);
      const isRepeat = depts.some((item) => item.code === value);
      isRepeat
        ? callback(new Error(`组织架构中已经有部门使用${value}编码`))
        : callback();
    };
    const nameCheck = async (rule, value, callback) => {
      const { depts } = await getDepartments();
      // 找同级部门
      const deptstj = depts.filter((item) => item.pid === this.treeNode.id);
      const isRepeat = deptstj.some((ele) => ele.name === value);
      isRepeat
        ? callback(new Error(`该部门下已经存在${value}部门名称`))
        : callback();
    };

    return {
      formData: {
        name: "", // 部门名称
        code: "", // 部门编码
        manager: "", // 部门管理者
        introduce: "", // 部门介绍
      },
      peoples: [],
      loading: false,
      rules: {
        name: [
          { required: true, message: "部门名称必填", trigger: "blur" },
          { min: 1, max: 50, message: "部门名称1-50个字符", trigger: "blur" },
          {
            trigger: "blur",
            validator: nameCheck,
          },
        ],
        code: [
          { required: true, message: "部门编码必填", trigger: "blur" },
          { min: 1, max: 50, message: "部门编码1-50个字符", trigger: "blur" },
          {
            trigger: "blur",
            validator: checkCodeRepeat,
          },
        ],
        manager: [{ required: true, message: "部门负责人必填" }],
        introduce: [
          { required: true, message: "部门介绍必填", trigger: "blur" },
          { min: 1, max: 300, message: "部门介绍1-300个字符", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    handleClose() {
      this.$emit("update:dialogVisible", false);
      this.$refs.addDeptForm.resetFields();
      this.formData = {
        name: "", // 部门名称
        code: "", // 部门编码
        manager: "", // 部门管理者
        introduce: "", // 部门介绍
      };
    },
    async getEmployee() {
      this.peoples = await getEmployee();
      console.log(peoples);
    },
    //提交数据
    async submit() {
      try {
        await this.$refs.addDeptForm.validate();
        //调用接口
        this.loading = true;
        await addDepartments({ ...this.formData, pid: this.treeNode.id });
        //提示成功
        this.$message("新增成功");
        //重新刷新页面
        this.$parent.getDepartments();
        //关闭页面
        this.handleClose();
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style></style>
