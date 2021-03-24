<template>
  <a-drawer title="规则" placement="right" width="50%" :visible="visible" @close="()=>{this.visible=false}">
    <div class="table-operator">
      <a-button type="primary" v-action:Add icon="plus" @click="handleAdd">新建</a-button>
      <a-button type="primary" v-action:Delete icon="delete" @click="handleDelete()">批量删除</a-button>
    </div>

    <s-table ref="table" size="default" rowKey="Id" :columns="columns" :data="loadData" :rowSelection="rowSelection" showPagination="auto">
      <template slot="RuleType" slot-scope="text">
        <EnumName code="CF_CodeRule_Type" :value="text"></EnumName>
      </template>
      <span slot="action" slot-scope="text, record">
        <template>
          <a v-action:Update @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <a v-action:Delete @click="handleDelete([record])">删除</a>
        </template>
      </span>
    </s-table>
    <EditForm ref="editForm" @Success="()=>{this.$refs.table.refresh()}"></EditForm>
  </a-drawer>
</template>

<script>
import moment from 'moment'
import { STable } from '@/components'
import MainSvc from '@/api/CF/CF_CodeRuleSvc'
import EditForm from './Edit'
import EnumName from '@/components/CF/EnumName'

const columns = [
  { title: '类型', dataIndex: 'RuleType', scopedSlots: { customRender: 'RuleType' } },
  { title: '规则', dataIndex: 'Rule' },
  { title: '长度', dataIndex: 'Length' },
  { title: '排序', dataIndex: 'Sort', sorter: true },
  { title: '操作', dataIndex: 'action', width: '200px', scopedSlots: { customRender: 'action' } }
]

export default {
  components: {
    STable,
    MainSvc,
    EditForm,
    EnumName
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
      queryParam: { CodeTypeId: '' },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({ sortField: 'Sort', sortOrder: 'asc', Search: { ...this.queryParam } }, parameter)
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
    openForm(codeTypeId) {
      this.visible = true
      this.queryParam.CodeTypeId = codeTypeId
      this.$refs.table.refresh()
    },
    handleAdd() {
      this.mdl = null
      this.visible = true
      this.$refs.editForm.openForm(null, this.queryParam.CodeTypeId, '新增')
    },
    handleEdit(record) {
      this.visible = true
      this.mdl = { ...record }
      this.$refs.editForm.openForm(record.Id, this.queryParam.CodeTypeId, '修改')
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    resetSearchForm() { },
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
