<template>
  <div>
    <div class="departments-container" v-loading="loading">
      <el-card>
        <treetools
          :tree-node="company"
          :isRoot="false"
          @addDept="handleAddDept"
          @editDept="editDept"
        ></treetools>
      </el-card>
      <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
        <treetools
          slot-scope="{ data }"
          :tree-node="data"
          @addDept="handleAddDept"
          @editDept="editDept"
          @refreshList="getDepartments"
        ></treetools>
      </el-tree>
      <dept
        ref="addDept"
        :dialogVisible.sync="dialogVisible"
        :tree-node="currentNode"
      ></dept>
    </div>
  </div>
</template>

<script>
import { getDepartments } from "@/api/department";
import { tranListToTreeData } from "@/utils/index";
import treetools from "./components/treetools.vue";
import dept from "./components/adddept.vue";
export default {
  name: "HrsaasIndex",
  components: {
    treetools,
    dept,
  },
  data() {
    return {
      defaultProps: {
        label: "name",
      },

      departs: [
        {
          name: "总裁办",
          manager: "曹操",
          children: [{ name: "董事会", manager: "曹丕" }],
        },
        { name: "行政部", manager: "刘备" },
        { name: "人事部", manager: "孙权" },
      ],
      company: {
        name: "江苏传智播客教育科技股份有限公司",
        manager: "负责人",
      },
      dialogVisible: false,
      currentNode: {},
    };
  },
  created() {
    this.getDepartments(); // 调用自身的方法
  },
  methods: {
    //获取组织的数据
    async getDepartments() {
      try {
        const result = await getDepartments();
        this.company = {
          name: result.companyName,
          manager: result.companyManage,
          id: "",
        };
        this.departs = tranListToTreeData(result.depts, ""); // 需要将其转化成树形结构
        console.log(result);
      } finally {
        this.loading = false;
      }
    },
    //新增数据
    handleAddDept(node) {
      this.dialogVisible = true;
      this.currentNode = node;
    },
    //编辑数据
    editDept(node) {
      console.log(node);
      this.dialogVisible = true;
      this.currentNode = { ...node };
      //回现数据
      this.$refs.addDept.formData = { ...node };
    },
  },
};
</script>

<style lang="scss" scoped>
.departments-container {
  width: 900px;
  margin: 20px auto;
}
</style>
