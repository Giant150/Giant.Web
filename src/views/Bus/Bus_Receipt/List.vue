<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="货主">
              <StorerSelect v-model="queryParam.StorerId" :type="['Storer']"></StorerSelect>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="单号">
              <a-input v-model="queryParam.Keyword" placeholder="单号/关联单号" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="收货日期">
              <a-range-picker :value="[queryParam.RecDateBegin,queryParam.RecDateEnd]" format="YYYY-MM-DD" @change="onDateChange" />
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="6" :sm="24">
              <a-form-item label="收货类型">
                <EnumSelect code="Bus_Receipt_RecType" v-model="queryParam.RecType"></EnumSelect>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="收货状态">
                <EnumSelect code="Bus_Receipt_Status" v-model="queryParam.Status"></EnumSelect>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" v-action:Query @click="()=>{this.$refs.table.refresh()}">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm()">重置</a-button>
              <a @click="()=>{this.advanced=!this.advanced}" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" v-action:Add icon="plus" @click="handleAdd">新建</a-button>
      <!-- <a-button type="primary" v-action:Delete icon="delete" @click="handleDelete()">批量删除</a-button> -->
    </div>

    <s-table ref="table" size="default" rowKey="Id" :columns="columns" :data="loadData" :rowSelection="rowSelection" showPagination="auto">
      <template slot="RecType" slot-scope="text">
        <EnumName code="Bus_Receipt_RecType" :value="text"></EnumName>
      </template>
      <template slot="Status" slot-scope="text">
        <EnumName code="Bus_Receipt_Status" :value="text" :color="true"></EnumName>
      </template>
      <span slot="action" slot-scope="text, record">
        <template>
          <a v-action:Query @click="handleEdit(record)">查看</a>
          <a-divider type="vertical" />
          <a-dropdown class="ant-dropdown-link" placement="bottomCenter">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">操作</a>
            <a-menu slot="overlay" @click="(e)=>{handleActionClick(e.key,record)}">
              <a-menu-item key="Print">打印收货单</a-menu-item>
              <a-menu-item v-action:Putaway key="Putaway">生成上架任务</a-menu-item>
              <a-menu-item v-action:Close key="Close" v-if="record.Status==='Receiving' || record.Status==='Completed'">收货结束</a-menu-item>
            </a-menu>
          </a-dropdown>
          <a-divider v-action:Delete v-if="record.Status==='Active'" type="vertical" />
          <a v-action:Delete v-if="record.Status==='Active'" @click="handleDelete([record])">删除</a>
        </template>
      </span>
    </s-table>
    <EditForm ref="editForm" @Success="()=>{this.$refs.table.refresh()}"></EditForm>
  </a-card>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import print from 'print-js'
import { STable } from '@/components'
import MainSvc from '@/api/Bus/Bus_ReceiptSvc'
import EditForm from './Edit'
import EnumSelect from '@/components/CF/EnumSelect'
import EnumName from '@/components/CF/EnumName'
import StorerSelect from '@/components/Bas/StorerSelect'
import SkuSelect from '@/components/Bas/SkuSelect'
import LocSelect from '@/components/Bas/LocSelect'

const columns = [
  { title: '货主', dataIndex: 'Storer.Name' },
  { title: '编号', dataIndex: 'Code', sorter: true },
  { title: '收货类型', dataIndex: 'RecType', scopedSlots: { customRender: 'RecType' } },
  { title: '单据日期', dataIndex: 'DocDate', sorter: true, customRender: (value) => { return moment(value).format('yyyy-MM-DD') } },
  { title: '收货日期', dataIndex: 'RecDate', sorter: true, customRender: (value) => { return moment(value).format('yyyy-MM-DD') } },
  { title: '供应商', dataIndex: 'Supplier.Name' },
  { title: '收货状态', dataIndex: 'Status', scopedSlots: { customRender: 'Status' } },
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
      queryParam: { WhseId: '', StorerId: '', Keyword: '', RecDateBegin: null, RecDateEnd: null, RecType: '', Status: '' },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        this.queryParam.WhseId = this.defaultWhseId
        var _query = Object.assign({}, { ...this.queryParam })
        for (const key in _query) {
          if (moment.isMoment(_query[key])) {
            _query[key] = _query[key].format('YYYY-MM-DD')
          }
        }
        const requestParameters = Object.assign({ sortField: 'Code', sortOrder: 'desc', Search: _query }, parameter)
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
    this.resetSearchForm()
  },
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
      this.queryParam = { WhseId: this.defaultWhseId, StorerId: this.defaultStorerId, Keyword: '', RecDateBegin: moment(), RecDateEnd: moment().add(1, 'days'), RecType: '', Status: '' }
    },
    onDateChange(dates, dateStrings) {
      this.queryParam.RecDateBegin = dates[0]
      this.queryParam.RecDateEnd = dates[1]
    },
    handleActionClick(key, row) {
      console.log(key, row)
      if (key === 'Putaway') {
        MainSvc.PutawayTask(row.Id).then(result => {
          if (result.Success) {
            this.$message.success('操作成功!')
            this.$router.push({ path: '/Inv/Inv_Task', query: { RefTable: 'Bus_Receipt', RefId: row.Id } })
          } else {
            this.$message.error(result.Msg)
          }
        })
      } else if (key === 'Print') {
        MainSvc.Print(row.Id).then(result => {
          if (result.Success) {
            var filePath = `${process.env.VUE_APP_API_BASE_URL}${result.Data}`
            print(filePath)
          } else {
            this.$message.error(result.Msg)
          }
        })
      } else if (key === 'Close') {
        MainSvc.Close(row.Id).then(result => {
          if (result.Success) {
            this.$message.success('操作成功!')
            this.$refs.table.refresh()
          } else {
            this.$message.error(result.Msg)
          }
        })
      }
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
