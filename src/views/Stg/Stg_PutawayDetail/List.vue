<template>
  <a-drawer title="上架策略明细" placement="right" width="60%" :visible="visible" @close="()=>{this.visible=false}">
    <div class="table-operator">
      <a-button type="primary" v-action:Add icon="plus" @click="handleAdd">新建</a-button>
      <a-button type="primary" v-action:Delete icon="delete" @click="handleDelete()">批量删除</a-button>
    </div>

    <s-table ref="table" size="default" rowKey="Id" :columns="columns" :data="loadData" :rowSelection="rowSelection" showPagination="auto">
      <template slot="PutawayType" slot-scope="text">
        <EnumName code="Stg_PutawayDetail_PutawayType" :value="text"></EnumName>
      </template>
      <span slot="action" slot-scope="text, record">
        <template>
          <a v-action:Update @click="handleEdit(record)">修改</a>
          <a-divider v-action:Delete type="vertical" />
          <a v-action:Delete @click="handleDelete([record])">删除</a>
        </template>
      </span>
    </s-table>
    <EditForm ref="editForm" @Success="()=>{this.$refs.table.refresh()}"></EditForm>
  </a-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { STable } from '@/components'
import MainSvc from '@/api/Stg/Stg_PutawayDetailSvc'
import EditForm from './Edit'
import EnumSelect from '@/components/CF/EnumSelect'
import EnumName from '@/components/CF/EnumName'

const columns = [
  { title: '编号', dataIndex: 'Code', sorter: true },
  { title: '上架类型', dataIndex: 'PutawayType', scopedSlots: { customRender: 'PutawayType' } },
  { title: '上架区域', dataIndex: 'PutawayZone.Name' },
  { title: '上架库位', dataIndex: 'PutawayLoc.Code' },
  { title: '排序', dataIndex: 'Sort', sorter: true },
  { title: '检查限制条件', dataIndex: 'CheckRestrictions', customRender: (value, row, index) => { return value ? '是' : '否' } },
  { title: '操作', dataIndex: 'action', width: '200px', scopedSlots: { customRender: 'action' } }
]

export default {
  components: {
    STable,
    MainSvc,
    EnumSelect,
    EnumName,
    EditForm
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
      // 查询参数 // 这里的ParentId具体业务主表字段Id
      queryParam: { WhseId: '', PutawayStgId: '', Keyword: '' },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        this.queryParam.WhseId = this.defaultWhseId
        const requestParameters = Object.assign({ sortField: 'Sort', sortOrder: 'asc', Search: { ...this.queryParam } }, parameter)
        console.log('loadData request parameters:', requestParameters)
        return MainSvc.GetPage(requestParameters)
      },
      selectedRowKeys: [],
      selectedRows: [],
      entity: {}
    }
  },
  filters: {
  },
  created() { },
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
    openForm(record) {
      this.entity = record
      // 这里的ParentId具体业务主表字段Id
      this.queryParam.PutawayStgId = record.Id
      this.visible = true
      this.$nextTick(() => {
        this.$refs.table.refresh()
      })
    },
    handleAdd() {
      this.mdl = null
      this.$refs.editForm.openForm(null, this.entity, '新增')
    },
    handleEdit(record) {
      this.mdl = { ...record }
      this.$refs.editForm.openForm(record.Id, this.entity, '修改')
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    resetSearchForm() {
      // 这里的ParentId具体业务主表字段Id
      this.queryParam = { WhseId: this.defaultWhseId, PutawayStgId: this.entity.Id, Keyword: '' }
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
