<template>
  <a-drawer title="用户角色" placement="right" width="40%" :visible="visible" @close="()=>{this.visible=false;this.$emit('close')}">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="12" :sm="24">
              <a-form-item label="角色">
                <a-input v-model="queryParam.RoleName" placeholder="角色" />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" v-action:Query @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="resetSearchForm()">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" v-action:Add icon="plus" @click="handleAdd()">增加</a-button>
        <a-button type="primary" v-action:Delete icon="delete" @click="handleDelete(selectedRows)">批量删除</a-button>
      </div>

      <s-table ref="table" size="default" rowKey="Id" :columns="columns" :data="loadData" :rowSelection="rowSelection" showPagination="auto">
        <span slot="action" slot-scope="text, record">
          <template>
            <a v-action:Delete @click="handleDelete([record])">删除</a>
          </template>
        </span>
      </s-table>
    </a-card>
    <RoleSelect ref="roleSelect" @select="handleRoleSelect"></RoleSelect>
  </a-drawer>
</template>

<script>
import { STable } from '@/components'
import MainSvc from '@/api/Sys/Sys_UserRoleSvc'
import RoleSelect from '../Sys_Role/RoleSelect'

const columns = [
  { title: '角色', dataIndex: 'Role.Name' },
  { title: '操作', dataIndex: 'action', width: '150px', scopedSlots: { customRender: 'action' } }
]

export default {
  components: {
    STable,
    MainSvc,
    RoleSelect
  },
  props: {},
  data() {
    this.columns = columns
    return {
      visible: false,
      confirmLoading: false,
      // 查询参数
      queryParam: { UserId: '', RoleName: '' },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({ Search: { ...this.queryParam } }, parameter)
        console.log('loadData request parameters:', requestParameters)
        return MainSvc.GetPage(requestParameters)
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    openForm(userId) {
      this.queryParam.UserId = userId
      this.visible = true
      this.$refs.table.refresh(true)
    },
    handleAdd() {
      this.$refs.roleSelect.openSelect()
    },
    handleRoleSelect(roleKeys, roles) {
      MainSvc.Save(this.queryParam.UserId, roleKeys).then(result => {
        this.$refs.table.refresh()
      })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    resetSearchForm() {
      this.queryParam.RoleName = ''
    },
    handleDelete(rows) {
      var thisObj = this
      var ids = rows.map(value => value.RoleId)
      this.$confirm({
        title: '确认删除吗?',
        onOk() {
          return new Promise((resolve, reject) => {
            MainSvc.Delete(thisObj.queryParam.UserId, ids).then(result => {
              resolve()
              if (result.Success) {
                thisObj.$message.success('操作成功!')
                thisObj.$refs.table.refresh()
              } else {
                thisObj.$message.error(result.Msg)
              }
            })
          })
        }
      })
    }
  }
}
</script>
