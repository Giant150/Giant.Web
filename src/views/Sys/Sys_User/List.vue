<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="名称">
              <a-input v-model="queryParam.Name" placeholder="名称" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="帐号">
              <a-input v-model="queryParam.UserName" placeholder="帐号" />
            </a-form-item>
          </a-col>
          <a-col :md="!advanced && 6 || 24" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" v-action:Query @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm()">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" v-action:Add icon="plus" @click="handleAdd">新建</a-button>
      <a-button type="primary" v-action:Delete icon="delete" @click="handleAdd">批量删除</a-button>
    </div>

    <s-table ref="table" size="default" rowKey="Id" :columns="columns" :data="loadData" :rowSelection="rowSelection" showPagination="auto">
      <span slot="ModifyTime" slot-scope="text">
        {{ moment(text).format("yyyy-MM-DD") }}
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a v-action:Update @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <a v-action:Delete @click="handleSub(record)">删除</a>
        </template>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import moment from 'moment'
import { STable } from '@/components'
import MainSvc from '@/api/Sys/Sys_UserSvc'

const columns = [
  { title: '工号', dataIndex: 'Code', sorter: true },
  { title: '名称', dataIndex: 'Name', sorter: true },
  { title: '帐号', dataIndex: 'UserName', sorter: true },
  { title: '修改时间', dataIndex: 'ModifyTime', sorter: true, scopedSlots: { customRender: 'ModifyTime' } },
  { title: '操作', dataIndex: 'action', width: '150px', scopedSlots: { customRender: 'action' } }
]

export default {
  name: 'TableList',
  components: {
    STable,
    MainSvc
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
      queryParam: { Name: '', UserName: '' },
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
    },
    handleEdit(record) {
      this.visible = true
      this.mdl = { ...record }
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    resetSearchForm() {
      this.queryParam = {}
    }
  }
}
</script>
