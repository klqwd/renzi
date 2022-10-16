<template>
  <div>
    <PageTools>
      <template #before>
        <span>共166条记录</span>
      </template>
      <template #after>
        <el-button size="small" type="warning" @click="$router.push('/import')"
          >导入</el-button
        >
        <el-button size="small" type="danger" @click="exportExcel"
          >导出</el-button
        >
        <el-button size="small" type="primary" @click="handleAdd"
          >新增员工</el-button
        >
      </template>
    </PageTools>

    <!-- 放置表格和分页 -->
    <el-card>
      <el-table border :data="list" v-loading="loading">
        <el-table-column label="序号" sortable="" width="80" type="index" />
        <el-table-column label="头像">
          <template slot-scope="{ row }">
            <img
              :src="row.staffPhoto"
              alt=""
              style="width: 100px; height: 100px"
              @click="genQrCode(row.staffPhoto)"
            />
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="username" />
        <el-table-column label="工号" prop="workNumber" />
        <el-table-column
          label="聘用形式"
          prop="formOfEmployment"
          :formatter="formatterFn"
        />
        <el-table-column label="部门" prop="departmentName" />
        <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
          <template slot-scope="{ row }">{{
            row.timeOfEntry | formatDate
          }}</template>
        </el-table-column>
        <el-table-column label="账户状态" prop="enableState">
          <template slot-scope="{ row }">
            <el-switch :value="row.enableState === 1" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="280">
          <template slot-scope="{ row }">
            <el-button type="text" size="small" @click="goDetail(row)"
              >查看</el-button
            >
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="del(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="end" align="middle" style="height: 60px">
        <el-pagination
          background
          layout="prev, pager, next, sizes, total"
          :current-page.sync="page.page"
          :page-size.sync="page.size"
          :page-sizes="[5, 10, 15, 20]"
          :total="total"
          @current-change="getEmployeeList"
          @size-change="getEmployeeList"
        />
      </el-row>
    </el-card>
    <addEmployee :dialogVisible.sync="dialogVisible"> </addEmployee>
    <el-dialog title="提示" :visible.sync="dialog" width="60%">
      <canvas ref="canvas"></canvas>
    </el-dialog>
  </div>
</template>

<script>
import addEmployee from "./components/add-employee.vue";
import EnunHireType from "@/api/constant/employees";
import { getEmployeeList, delEmployee } from "@/api/employee";
import PageTools from "@/components/PageTools/index.vue";
import QRCode from "qrcode";
export default {
  name: "HrsaasIndex",
  components: {
    PageTools,
    addEmployee,
  },
  data() {
    return {
      page: {
        page: 1, // 当前页码
        size: 10,
      },
      list: [], // 接数据的
      total: 0, // 总数
      loading: false,
      hireType: EnunHireType.hireType,
      dialogVisible: false,
      dialog: false,
    };
  },

  mounted() {
    this.getEmployeeList();
  },

  methods: {
    //获取员工列表
    async getEmployeeList() {
      this.loading = true;
      const { rows, total } = await getEmployeeList(this.page);
      this.list = rows;
      this.total = total;
      this.loading = false;
    },
    //文本格式化
    formatterFn(row, column, cellvalue) {
      const res = this.hireType.find((ele) => ele.id === cellvalue);
      // console.log(row);
      // console.log(column);
      // console.log(cellvalue);
      return (res && res.value) || "非正式";
    },
    handleAdd() {
      this.dialogVisible = true;
      console.log(this.dialogVisible);
    },
    //删除绑定点击事件
    async del(id) {
      try {
        await this.$confirm("确认删除该员工吗？", "提示", {
          type: "warning",
        });
        //调用删除接口
        await delEmployee(id);
        //需要刷新页面列表
        this.getEmployeeList();
      } catch (e) {
        console.log(e);
      }
    },
    async exportExcel() {
      const { export_json_to_excel } = await import("@/vendor/Export2Excel");
      const { rows } = await getEmployeeList({
        page: 1,
        size: this.page.total,
      });
      const exportExcelMapPath = {
        手机号: "mobile",
        姓名: "username",
        入职日期: "timeOfEntry",
        聘用形式: "formOfEmployment",
        转正日期: "correctionTime",
        工号: "workNumber",
        部门: "departmentName",
      };
      const header = Object.keys(exportExcelMapPath);
      const data = rows.map((item) => {
        return header.map((h) => {
          if (h === "聘用形式") {
            const find = this.hireType.find((hire) => {
              return hire.id == item[exportExcelMapPath[h]];
            });
            return find ? find.value : "位置";
          }
          return item[exportExcelMapPath[h]];
        });
      });
      export_json_to_excel({
        header,
        data, //具体数据 必填
        filename: "excel-list", //非必填
        autoWidth: true, //非必填
        bookType: "xlsx", //非必填
      });
    },
    goDetail(row) {
      console.log(row);
      this.$router.push("/employees/detail/" + row.id);
    },
    genQrCode(staffPhoto) {
      if (!staffPhoto) return this.$message.error("暂无头像");
      this.dialog = true;
      this.$nextTick(() => {
        QRCode.toCanvas(this.$refs.canvas, staffPhoto, function (error) {
          if (error) console.error(error);
          console.log("success!");
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
