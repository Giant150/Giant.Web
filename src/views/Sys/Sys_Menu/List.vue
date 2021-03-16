<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button type="primary" v-action:Add icon="plus" @click="handleAdd">新建</a-button>
    </div>

    <a-table ref="table" size="default" rowKey="Id" :columns="columns" :dataSource="data" childrenColumnName="Children" :rowSelection="rowSelection" :pagination="false">
      <span slot="ModifyTime" slot-scope="text">
        {{ moment(text).format("yyyy-MM-DD") }}
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a v-action:Update @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <a v-action:Delete @click="handleDelete([record])">删除</a>
          <a-divider type="vertical" />
          <a v-action:Action @click="handleAction(record)">按钮</a>
        </template>
      </span>
    </a-table>
    <EditForm ref="editForm" @Success="loadData"></EditForm>
    <ActionList :menuId="menuId" :visible="actionVisible" @close="()=>{this.actionVisible=false}"></ActionList>
  </a-card>
</template>

<script>
import moment from 'moment'
import MainSvc from '@/api/Sys/Sys_MenuSvc'
import EditForm from './Edit'
import ActionList from '../Sys_Action/List'

const columns = [
  { title: '名称', dataIndex: 'Name' },
  { title: '编码', dataIndex: 'Code' },
  { title: '图标', dataIndex: 'Icon' },
  { title: '路径', dataIndex: 'Path' },
  { title: '排序', dataIndex: 'Seq' },
  { title: '修改时间', dataIndex: 'ModifyTime', scopedSlots: { customRender: 'ModifyTime' } },
  { title: '操作', dataIndex: 'action', width: '150px', scopedSlots: { customRender: 'action' } }
]

export default {
  components: {
    MainSvc,
    EditForm,
    ActionList
  },
  data() {
    this.columns = columns
    return {
      menuId: '',
      actionVisible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      data: [],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
  },
  mounted() {
    this.loadData()
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
    handleAction(record) {
      this.mdl = { ...record }
      this.menuId = record.Id
      this.actionVisible = true
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    resetSearchForm() {
      this.queryParam = {}
    },
    loadData() {
      MainSvc.GetTree().then(result => {
        this.data = result.Data
      })
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
                thisObj.loadData()
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
