<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item label="物料货主">
              <StorerSelect v-model="queryParam.StorerId" :type="['Storer']" aria-placeholder="货主"></StorerSelect>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="库存物料">
              <SkuSelect v-model="queryParam.SkuId" :storer="queryParam.StorerId" @select="(val,sku)=>{handleSkuSelect(sku)}" aria-placeholder="选择物料"></SkuSelect>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="库存库位">
              <LocSelect v-model="queryParam.LocId" aria-placeholder="库位"></LocSelect>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="模糊查询">
              <a-input v-model="queryParam.Keyword" placeholder="按货主、物料、库位查询" />
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

    <s-table ref="table" size="default" rowKey="Id" :columns="columns" :data="loadData" :rowSelection="rowSelection" showPagination="auto">
      <span slot="action" slot-scope="text, record">
        <template>
          <a v-action:Update @click="handleEdit(record)">修改</a>
          <a-divider v-action:Delete type="vertical" />
          <a v-action:Delete @click="handleDelete([record])">删除</a>
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
import MainSvc from '@/api/Inv/Inv_InventorySvc'
import EditForm from './Edit'
import EnumSelect from '@/components/CF/EnumSelect'
import EnumName from '@/components/CF/EnumName'
import StorerSelect from '@/components/Bas/StorerSelect'
import SkuSelect from '@/components/Bas/SkuSelect'
import LocSelect from '@/components/Bas/LocSelect'

const columns = [
  { title: '物料编码', dataIndex: 'SkuCode', sorter: true },
  { title: '物料', dataIndex: 'SkuName', sorter: true },
  { title: '批次', dataIndex: 'LotCode', sorter: true },
  { title: '库位', dataIndex: 'LocCode', sorter: true },
  { title: '托盘', dataIndex: 'TrayCode', sorter: true },
  { title: '库存数量', dataIndex: 'Qty', sorter: true },
  { title: '可用数量', dataIndex: 'QtyAvailable', sorter: true },
  { title: '已分配', dataIndex: 'QtyAllocated', sorter: true },
  { title: '已拣货', dataIndex: 'QtyPicked', sorter: true },
  { title: '库存状态', dataIndex: 'Status', sorter: true, customRender: (value) => { if(value=="Freeze") return "冻结"; else return "正常"; } },
  { title: '货主', dataIndex: 'StoreName', sorter: true },
  { title: '修改时间', dataIndex: 'ModifyTime', sorter: true, customRender: (value) => { return moment(value).format('yyyy-MM-DD') } },
  { title: '操作', dataIndex: 'action', width: '200px', scopedSlots: { customRender: 'action' } }
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
      queryParam: { WhseId: '', Keyword: '', StorerId: '', SkuId: '', LocId: '' },
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
      selectSku: null,
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
  },
  created() {},
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
    handleSkuSelect(sku) {
      this.selectSku = sku
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    resetSearchForm() {
      this.queryParam = { WhseId: this.defaultWhseId, Keyword: '' }
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
