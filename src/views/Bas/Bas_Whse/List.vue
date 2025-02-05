<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="关键字">
              <a-input v-model="queryParam.Keyword" placeholder="关键字" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" v-action:Query @click="()=>{this.$refs.table.refresh()}">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm()">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" v-action:Add icon="plus" @click="handleAdd">新建</a-button>
      <a-button type="primary" v-action:Delete icon="delete" @click="handleDelete()">批量删除</a-button>
    </div>

    <s-table ref="table" size="default" rowKey="Id" :columns="columns" :data="loadData" :rowSelection="rowSelection" showPagination="auto">
      <template slot="Type" slot-scope="text">
        <EnumName code="Bas_Whse_Type" :value="text"></EnumName>
      </template>
      <template slot="Status" slot-scope="text">
        <EnumName code="State" :value="text" :color="true"></EnumName>
      </template>
      <span slot="ModifyTime" slot-scope="text">
        {{ moment(text).format("yyyy-MM-DD") }}
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a v-action:Update @click="handleEdit(record)">修改</a>
          <a-divider v-action:Delete type="vertical" />
          <a v-action:Delete @click="handleDelete([record])">删除</a>
          <a-divider v-action:Update type="vertical" />
          <a v-action:Update @click="handleStatus(record)">{{ record.Status==='Enable'?'停用':'启用' }}</a>
          <a-divider v-action:Role type="vertical" />
          <a v-action:Role @click="handleRole(record)">所属角色</a>
        </template>
      </span>
    </s-table>
    <EditForm ref="editForm" @Success="()=>{this.$refs.table.refresh()}"></EditForm>
    <RoleWhse ref="roleWhse"></RoleWhse>
  </a-card>
</template>

<script>
import moment from 'moment'
import { STable } from '@/components'
import MainSvc from '@/api/Bas/Bas_WhseSvc'
import EditForm from './Edit'
import EnumSelect from '@/components/CF/EnumSelect'
import EnumName from '@/components/CF/EnumName'
import RoleWhse from '../Bas_RoleWhse/List'

const columns = [
  { title: '编号', dataIndex: 'Code', sorter: true },
  { title: '名称', dataIndex: 'Name', sorter: true },
  { title: '类型', dataIndex: 'Type', scopedSlots: { customRender: 'Type' } },
  { title: '状态', dataIndex: 'Status', scopedSlots: { customRender: 'Status' } },
  { title: '修改时间', dataIndex: 'ModifyTime', sorter: true, scopedSlots: { customRender: 'ModifyTime' } },
  { title: '操作', dataIndex: 'action', width: '250px', scopedSlots: { customRender: 'action' } }
]

export default {
  components: {
    STable,
    MainSvc,
    EditForm,
    EnumSelect,
    EnumName,
    RoleWhse
  },
  data() {
    this.columns = columns
    return {
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: { Keyword: '' },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({ sortField: 'Code', sortOrder: 'asc', Search: { ...this.queryParam } }, parameter)
        console.log('loadData request parameters:', requestParameters)
        return MainSvc.GetPage(requestParameters)
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
  },
  created() {
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
    moment,
    handleAdd() {
      this.mdl = null
      this.visible = true
      this.$refs.editForm.openForm(null, '新增')
    },
    handleEdit(record) {
      this.visible = true
      this.mdl = { ...record }
      this.$refs.editForm.openForm(record.Id, '修改')
    },
    handleRole(record) {
      this.$refs.roleWhse.openForm(record.Id)
    },
    handleStatus(record) {
      MainSvc.UpdateStatus(record.Id, record.Status === 'Enable' ? 'Disable' : 'Enable').then(result => {
        if (result.Success) {
          this.$message.success('操作成功!')
          this.$refs.table.refresh()
        } else {
          this.$message.error(result.Msg)
        }
      })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    resetSearchForm() {
      this.queryParam = {}
    },
    handleDelete(rows) {
      var thisObj = this
      var ids = rows.map(value => value.Id)
      this.$confirm({
        title: '确认删除吗?',
        onOk() {
          return new Promise((resolve, reject) => {
            MainSvc.Delete(ids).then(result => {
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
