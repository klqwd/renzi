<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="width: 100%"
  >
    <!-- 左侧内容 -->
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <!-- 右侧内容 -->
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 放置下拉菜单 -->
          <el-dropdown @command="handleCommand">
            <!-- 内容 -->
            <span
              >操作
              <i class="el-icon-arrow-down" />
            </span>
            <!-- 具名插槽 -->
            <el-dropdown-menu slot="dropdown">
              <!-- 下拉选项 -->
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="isRoot" command="edit"
                >编辑部门</el-dropdown-item
              >
              <el-dropdown-item v-if="isRoot" command="del"
                >删除部门</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
      <!-- 右侧内容 -->
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "treetools",
  props: {
    treeNode: {
      type: Object,
      Array,
      required: true,
    },
    isRoot: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    handleCommand(type) {
      if (type === "add") {
        this.$emit("addDept", this.treeNode);
      } else if (type === "edit") {
      } else {
      }
    },
    handleAddDept() {
      this.dialogVisible = true;
    },
  },
};
</script>

<style></style>
