<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.roleName" placeholder="请输入角色名称查询" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList('1')">查询</el-button>
        <el-button v-if="isAuth('sys:role:save')" type="primary" @click="addOrUpdateHandle('0')">新增</el-button>
        <!-- <el-button v-if="isAuth('sys:role:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
        <el-button v-if="isAuth('sys:role:delete')" type="warning" @click="addOrUpdateHandle()" :disabled="dataListSelections.length <= 0">修改</el-button>
        <el-button v-if="isAuth('sys:role:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      ref="multipleTable"
      highlight-current-row
      @row-click="handleRowClick"
      v-loading="dataListLoading"
      style="width: 100%;">
      <!-- <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column> -->
      <el-table-column
        type="index"
        header-align="center"
        align="center"
        width="80"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="roleName"
        header-align="center"
        align="center"
        label="角色名称">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="180"
        label="创建时间">
      </el-table-column>
      <!-- <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:role:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.roleId)">修改</el-button>
          <el-button v-if="isAuth('sys:role:delete')" type="text" size="small" @click="deleteHandle(scope.row.roleId)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './role-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          roleName: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    beforeRouteLeave(to, from, next) {
        this.dataListSelections = []
        next();
    },
    methods: {
      // 获取数据列表
      getDataList (num) {
        if(num == 1){
            this.pageIndex = 1
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/role/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'roleName': this.dataForm.roleName
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataListSelections = []
            this.dataList = data.result.list
            this.totalPage = data.result.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },

      handleRowClick(row, column, event) {
          console.log(row)
          this.dataListSelections = row
          this.$refs.multipleTable.toggleRowSelection(row);
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (num) {
        var id ='';
        if(num == 0){
            id = 0
        }else{
            id = this.dataListSelections
        }
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          // console.log("id1111",id)
          this.$refs.addOrUpdate.init(id.roleId)
        })
      },
      // 删除
      deleteHandle () {
        // var ids = id ? [id] : this.dataListSelections.map(item => {
        //   return item.roleId
        // })

        var ids = this.dataListSelections
        this.$confirm(`确定[${ids.roleId ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/role/delete'),
            method: 'post',
            data: this.$http.adornData([ids.roleId], false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      }
    }
  }
</script>

<style lang="scss">
.el-table__body tr.current-row>td{
  background-color: #fdf3ea;
  color: #f19944;
}
</style>

