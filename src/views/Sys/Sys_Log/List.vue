<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-form-item label="日期">
              <a-date-picker v-model="queryParam.CreateTime" format="YYYY-MM-DD" :allowClear="false" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="时间">
              <a-time-picker v-model="queryParam.StartTime" :allowClear="false" />~
              <a-time-picker v-model="queryParam.EndTime" :allowClear="false" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="应用">
              <EnumSelect code="Sys_Log_AppName" v-model="queryParam.AppName" allowClear></EnumSelect>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="级别">
              <EnumSelect code="Sys_Log_Level" v-model="queryParam.Level" color allowClear></EnumSelect>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="关键字">
              <a-input v-model="queryParam.Keyword" placeholder="关键字" />
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
    <s-table ref="table" size="small" rowKey="Id" :columns="columns" :data="loadData" showPagination="auto" :scroll="{ x: 2000 }">
      <template slot="AppName" slot-scope="text">
        <EnumName code="Sys_Log_AppName" :value="text"></EnumName>
      </template>
      <template slot="Level" slot-scope="text">
        <EnumName code="Sys_Log_Level" :value="text"></EnumName>
      </template>
      <template slot="CreateTime" slot-scope="text">
        <span @click="handlerTimeClick(text)">{{ moment(text).format("HH:mm:ss") }}</span>
      </template>
      <span slot="action" slot-scope="text, record">
        <template>
          <a v-action:Query @click="handleEdit(record)">查看</a>
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
import MainSvc from '@/api/Sys/Sys_LogSvc'
import EditForm from './Edit'
import EnumSelect from '@/components/CF/EnumSelect'
import EnumName from '@/components/CF/EnumName'
import StorerSelect from '@/components/Bas/StorerSelect'
import SkuSelect from '@/components/Bas/SkuSelect'
import LocSelect from '@/components/Bas/LocSelect'

const columns = [
  { title: '应用', dataIndex: 'AppName', width: 100, fixed: 'left', scopedSlots: { customRender: 'AppName' } },
  { title: '级别', dataIndex: 'Level', width: 100, fixed: 'left', scopedSlots: { customRender: 'Level' } },
  { title: '时间', dataIndex: 'CreateTime', width: 100, fixed: 'left', sorter: true, scopedSlots: { customRender: 'CreateTime' } },
  { title: '内容', dataIndex: 'Msg', customRender: (value) => { return value ? value.substring(0, 200) : '' } },
  { title: '服务', dataIndex: 'Logger', width: 300 },
  { title: '用户', dataIndex: 'UserId', width: 120 },
  { title: 'IP', dataIndex: 'IP', width: 120 },
  { title: 'Url', dataIndex: 'Url', width: 300 },
  { title: '操作', dataIndex: 'action', width: 80, fixed: 'right', scopedSlots: { customRender: 'action' } }
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
      queryParam: { Keyword: '', CreateTime: null, StartTime: null, EndTime: null, AppName: undefined, Level: undefined },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        var _query = Object.assign({}, { ...this.queryParam })
        _query.CreateTime = _query.CreateTime?.format('YYYY-MM-DD')
        _query.StartTime = _query.StartTime?.format('HH:mm:ss')
        _query.EndTime = _query.EndTime?.format('HH:mm:ss')
        const requestParameters = Object.assign({ sortField: 'CreateTime', sortOrder: 'desc', Search: _query }, parameter)
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
    handleEdit(record) {
      this.visible = true
      this.mdl = { ...record }
      this.$refs.editForm.openForm(record, '日志信息')
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    resetSearchForm() {
      this.queryParam = { Keyword: '', CreateTime: moment(), StartTime: moment('00:00:00', 'HH:mm:ss'), EndTime: moment('23:59:59', 'HH:mm:ss'), AppName: undefined, Level: undefined }
    },
    handlerTimeClick(date) {
      console.log('handlerTimeClick:', date)
      this.queryParam.StartTime = moment(date).add(-5, 's')
      this.queryParam.EndTime = moment(date).add(5, 's')
    }
  }
}
</script>
