<template>
  <el-dialog
    :title="title"
    width="60%"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
  >
    <el-form
      ref="roleDialogForm"
      label-width="80px"
      :model="roleForm"
      :rules="rules"
    >
      <el-form-item prop="name" label="角色">
        <el-input v-model="roleForm.name" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="roleForm.description" type="textarea" row="3" />
      </el-form-item>
    </el-form>
    <el-row
      slot="footer"
      type="flex"
      justify="center"
      align="middle"
      class="dialog-footer"
    >
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleAdd" v-loading="loading"
        >确 定</el-button
      >
    </el-row>
  </el-dialog>
</template>

<script>
import { addRole, updateRole } from "@/api/setting";
export default {
  name: "HrsaasRoleDialog",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      loading: false,
      roleForm: {
        name: "",
        description: "",
      },
      rules: {
        name: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //关闭
    handleClose() {
      // 表单效果重置
      this.$refs.roleDialogForm.resetFields();
      this.$emit("update:dialogVisible", false);
      this.roleForm = {
        name: "",
        description: "",
      };
    },
    //新增
    async handleAdd() {
      console.log(this.roleForm.id);

      try {
        this.loading = true;
        await this.$refs.roleDialogForm.validate();
        this.roleForm.id
          ? await updateRole(this.roleForm)
          : await addRole(this.roleForm);
        this.$message.success(this.roleForm.id ? "编辑成功" : "新增成功");
        this.$emit("refresh");
        this.handleClose();
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },
  },
  computed: {
    title() {
      return this.roleForm.id ? "编辑角色" : "新增角色";
    },
  },
};
</script>
