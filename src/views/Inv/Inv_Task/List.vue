<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-form-item label="货主">
              <StorerSelect v-model="queryParam.StorerId" :type="['Storer']"></StorerSelect>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="编码">
              <a-input v-model="queryParam.Keyword" placeholder="编码" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="类型">
              <EnumSelect code="Inv_Task_Type" v-model="queryParam.Type"></EnumSelect>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="物料">
              <SkuSelect v-model="queryParam.SkuId" :storer="queryParam.StorerId"></SkuSelect>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="所属业务">
              <EnumSelect code="Inv_Ledger_RefTable" v-model="queryParam.RefTable"></EnumSelect>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
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

    <s-table ref="table" size="default" rowKey="Id" :columns="columns" :data="loadData" :rowSelection="rowSelection" showPagination="auto" :scroll="{ x: 2000 }">
      <template slot="Type" slot-scope="text">
        <EnumName code="Inv_Task_Type" :value="text"></EnumName>
      </template>
      <template slot="Status" slot-scope="text">
        <EnumName code="Inv_Task_Status" :value="text"></EnumName>
      </template>
      <template slot="RefTable" slot-scope="text">
        <EnumName code="Inv_Ledger_RefTable" :value="text"></EnumName>
      </template>
      <span slot="action" slot-scope="text, record">
        <template>
          <a v-action:Update @click="handleEdit(record)">修改</a>
          <a-divider v-action:Delete type="vertical" />
          <a v-action:Delete @click="handleDelete([record])">删除</a>
          <a-divider v-action:Completed v-if="record.Status==='Active'" type="vertical" />
          <a v-action:Completed v-if="record.Status==='Active'" @click="handleCompleted(record)">完成</a>
        </template>
      </span>
    </s-table>
    <EditForm ref="editForm" @Success="()=>{this.$refs.table.refresh()}"></EditForm>
  </a-card>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { STable } from '@/components'
import MainSvc from '@/api/Inv/Inv_TaskSvc'
import EditForm from './Edit'
import EnumSelect from '@/components/CF/EnumSelect'
import EnumName from '@/components/CF/EnumName'
import StorerSelect from '@/components/Bas/StorerSelect'
import SkuSelect from '@/components/Bas/SkuSelect'
import LocSelect from '@/components/Bas/LocSelect'

const columns = [
  { title: '编号', dataIndex: 'Code', width: 120, fixed: 'left', sorter: true },
  { title: '类型', dataIndex: 'Type', width: 120, fixed: 'left', scopedSlots: { customRender: 'Type' } },
  { title: '状态', dataIndex: 'Status', width: 120, fixed: 'left', scopedSlots: { customRender: 'Status' } },
  { title: '货主', dataIndex: 'Storer.Name' },
  { title: '物料', dataIndex: 'Sku.Name' },
  { title: '批次', dataIndex: 'Lot.Code' },
  { title: '自库位', dataIndex: 'FromLoc.Code' },
  { title: '自库位路顺', dataIndex: 'FromLocCode' },
  { title: '自托盘', dataIndex: 'FromTray.Code' },
  { title: '数量', dataIndex: 'Qty' },
  { title: '至库位', dataIndex: 'ToLoc.Code' },
  { title: '至库位路顺', dataIndex: 'ToLocCode' },
  { title: '至托盘', dataIndex: 'ToTray.Code' },
  { title: '来源业务', dataIndex: 'RefTable', scopedSlots: { customRender: 'RefTable' } },
  { title: '修改时间', dataIndex: 'ModifyTime', sorter: true, customRender: (value) => { return moment(value).format('yyyy-MM-DD') } },
  { title: '操作', dataIndex: 'action', width: 150, fixed: 'right', scopedSlots: { customRender: 'action' } }
]

export default {
  components: {
    STable,
    MainSvc,
    EnumSelect,
    EnumName,
    EditForm,
    StorerSelect,
    SkuSelect,
    LocSelect
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
      queryParam: { WhseId: '', Keyword: '', StorerId: '', Type: '', SkuId: '', RefTable: '', RefId: '' },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        this.queryParam.WhseId = this.defaultWhseId
        var _query = Object.assign({}, { ...this.queryParam })
        for (const key in _query) {
          if (moment.isMoment(_query[key])) {
            _query[key] = _query[key].format('YYYY-MM-DD')
          }
        }
        const requestParameters = Object.assign({ sortField: 'ModifyTime', sortOrder: 'desc', Search: _query }, parameter)
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
    this.queryParam.WhseId = this.defaultWhseId
    // this.queryParam.StorerId = this.defaultStorerId
    const { RefTable, RefId } = this.$route.query
    if (RefTable) this.queryParam.RefTable = RefTable
    if (RefTable) this.queryParam.RefId = RefId
  },
  mounted() { },
  computed: {
    ...mapGetters({
      defaultWhseId: 'whseId',
      defaultStorerId: 'storerId'
    }),
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
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    resetSearchForm() {
      this.queryParam = { WhseId: this.defaultWhseId, Keyword: '', StorerId: '', Type: '', SkuId: '', RefTable: '', RefId: '' }
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
    },
    handleCompleted(record) {
      var thisObj = this
      var id = record.Id
      this.$confirm({
        title: '确认此任务已经完成?',
        onOk() {
          return new Promise((resolve, reject) => {
            MainSvc.Complete(id).then(result => {
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
