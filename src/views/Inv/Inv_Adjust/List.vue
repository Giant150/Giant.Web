<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-form-item label="货主">
              <StorerSelect v-model="queryParam.StorerId" :type="['Storer']" placeholder="货主"></StorerSelect>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="编码">
              <a-input v-model="queryParam.Keyword" placeholder="编码/关联单号" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="制单日期">
              <a-range-picker :value="[queryParam.DocDateStart,queryParam.DocDateEnd]" format="YYYY-MM-DD" @change="onDateChange" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="类型">
              <EnumSelect code="Inv_Adjust_Type" v-model="queryParam.Type"></EnumSelect>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" v-action:Query @click="()=>{this.$refs.table.refresh()}">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm()">重置</a-button>
              <!-- <a-switch style="margin-left: 120px" checked-children="ERP库存开" un-checked-children="ERP库存关" @click="handleAutoInv('0')"/> -->
              <a-button type="primary" shape="round" icon="interaction" style="margin-left: 120px" @click="handleAutoInv('1')">ERP库存调整</a-button>
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
        <EnumName code="Inv_Adjust_Type" :value="text"></EnumName>
      </template>
      <template slot="Status" slot-scope="text">
        <EnumName code="Inv_Adjust_Status" :value="text"></EnumName>
      </template>
      <span slot="action" slot-scope="text, record">
        <template>
          <a v-action:Query @click="handleEdit(record)">查看</a>
          <a-divider type="vertical" />
          <a-dropdown class="ant-dropdown-link" placement="bottomCenter">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">操作</a>
            <a-menu slot="overlay" @click="(e)=>{handleActionClick(e.key,record)}">
              <a-menu-item v-action:Print key="Print">打印调整单</a-menu-item>
              <a-menu-item v-action:Adjust key="Adjust" v-if="record.Status==='Active'">确认调整</a-menu-item>
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
import MainSvc from '@/api/Inv/Inv_AdjustSvc'
import EditForm from './Edit'
import EnumSelect from '@/components/CF/EnumSelect'
import EnumName from '@/components/CF/EnumName'
import StorerSelect from '@/components/Bas/StorerSelect'
import SkuSelect from '@/components/Bas/SkuSelect'
import LocSelect from '@/components/Bas/LocSelect'

const columns = [
  { title: '货主名称', dataIndex: 'Storer.Name' },
  { title: '货主编号', dataIndex: 'Storer.Code' },
  { title: '编号', dataIndex: 'Code', sorter: true },
  { title: '类型', dataIndex: 'Type', scopedSlots: { customRender: 'Type' } },
  { title: '制单日期', dataIndex: 'DocDate', sorter: true, customRender: (value) => { return moment(value).format('yyyy-MM-DD') } },
  { title: '调整日期', dataIndex: 'AdjDate', sorter: true, customRender: (value) => { return moment(value).format('yyyy-MM-DD') } },
  { title: '状态', dataIndex: 'Status', scopedSlots: { customRender: 'Status' } },
  { title: '修改时间', dataIndex: 'ModifyTime', sorter: true, customRender: (value) => { return moment(value).format('yyyy-MM-DD') } },
  { title: '操作', dataIndex: 'action', width: 200, scopedSlots: { customRender: 'action' } }
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
      queryParam: { WhseId: '', Keyword: '', StorerId: '', DocDateStart: null, DocDateEnd: null, Type: undefined },
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
    onDateChange(dates, dateStrings) {
      this.queryParam.DocDateStart = dates[0]
      this.queryParam.DocDateEnd = dates[1]
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
    handleActionClick(key, row) {
      console.log(key, row)
      if (key === 'Adjust') {
        MainSvc.Adjust(row.Id).then(result => {
          if (result.Success) {
            this.$message.success('操作成功!')
            this.$refs.table.refresh()
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
      }
    },
    resetSearchForm() {
      this.queryParam = { WhseId: this.defaultWhseId, Keyword: '', DocDateStart: moment(), DocDateEnd: moment().add(1, 'days'), Type: undefined }
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
    handleAutoInv(val) {
      MainSvc.AutoInv(val).then(result => {
          if (result.Success) {
            this.$message.success('操作成功!')
            this.$refs.table.refresh()
          } else {
            this.$message.error(result.Msg)
          }
        })
    }
  }
}
</script>
