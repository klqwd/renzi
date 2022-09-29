<template>
  <div class="app-container">
    <el-card>
      <el-tabs v-model="activeName">
        <el-tab-pane label="角色管理" name="first">
          <el-row :gutter="10">
            <el-button
              type="primary"
              style="margin-left=10px"
              icon="el-icon-plus"
              @click="handleAdd"
            >
              新增角色
            </el-button>
            <addRole
              :dialog-visible.sync="dialogVisible"
              @refresh="getRoleList"
            />
          </el-row>
          <el-table v-loading="loading" style="width: 100%" :data="roleList">
            <el-table-column label="序号" width="120" type="index">
            </el-table-column>
            <el-table-column label="角色名称" width="240" prop="name">
            </el-table-column>
            <el-table-column label="描述" prop="description"> </el-table-column>
            <el-table-column label="操作" width="240">
              <template slot-scope="{ row }">
                <el-button size="small" type="success">分配权限</el-button>
                <el-button size="small" type="primary" @click="handleEdit(row)"
                  >编辑</el-button
                >
                <addRole
                  ref="roleDialog"
                  :dialog-visible.sync="dialogVisible"
                />
                <el-button size="small" type="danger" @click="delRow(row.id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-row :gutter="10">
            <el-col :span="6" :offset="12">
              <el-pagination
                background
                layout="prev, pager, next,sizes"
                :total="total"
                :current-page.sync="page.page"
                :page-size.sync="page.pagesize"
                :page-sizes="[3, 5, 7, 10]"
                @current-change="getRoleList"
                @size-change="getRoleList"
              >
              </el-pagination
            ></el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="second">
          <el-alert title="消息提示的文案" type="info" :closable="false">
          </el-alert>
          <el-form label-width="120px" style="margin-top: 50px">
            <el-form-item label="公司名称">
              <el-input v-model="formData.name" disabled style="width: 400px" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input
                v-model="formData.companyAddress"
                disabled
                style="width: 400px"
              />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input
                v-model="formData.mailbox"
                disabled
                style="width: 400px"
              />
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                v-model="formData.remarks"
                type="textarea"
                :rows="3"
                disabled
                style="width: 400px"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import addRole from "./components/addRole.vue";
import { mapGetters } from "vuex";
import { getRoleList, deleteRole, getCompanyInfo } from "@/api/setting";
export default {
  name: "HrsaasIndex",
  components: {
    addRole,
  },
  data() {
    return {
      dialogVisible: false,
      activeName: "",
      page: {
        page: 1,
        pagesize: 20,
      },
      total: 0,
      roleList: [],
      loading: false,
      formData: {
        name: "",
        companyAddress: "",
        mailbox: "",
        remarks: "",
      },
    };
  },
  mounted() {
    this.getRoleList();
  },
  methods: {
    //增加
    handleAdd() {
      this.dialogVisible = true;
    },
    //获取列表数据
    async getRoleList() {
      try {
        this.loading = true;
        const { rows, total } = await getRoleList(this.page);
        this.total = total;
        this.roleList = rows;
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    //编辑
    handleEdit(row) {
      this.$refs.roleDialog.roleForm = { ...row };
      this.dialogVisible = true;
    },
    //删除
    async delRow(id) {
      console.log(id);
      try {
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        await deleteRole(id);
        this.getRoleList();
        // if (total > 0) {
        //   this.page.page = this.page.page - 1;
        //   this.getRoleList();
        // }
      } catch (e) {
        console.log(e);
      }
    },

    // 获取公司信息
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId);
      console.log(this.formData);
    },
  },
  computed: {
    ...mapGetters(["companyId"]),
  },
  created() {
    this.getCompanyInfo();
  },
};
</script>

<style lang="scss" scoped></style>
