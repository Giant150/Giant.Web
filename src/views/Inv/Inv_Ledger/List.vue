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
              <a-button type="primary" v-action:Query @click="() => {this.$refs.table.refresh()}">查询</a-button>
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

    <s-table
      ref="table"
      size="default"
      rowKey="Id"
      :columns="columns"
      :data="loadData"
      :rowSelection="rowSelection"
      showPagination="auto"
      :scroll="{ x: 4500 }"
    >
      <span slot="action" slot-scope="text, record">
        <template>
          <a v-action:Update @click="handleEdit(record)">修改</a>
          <a-divider v-action:Delete type="vertical" />
          <a v-action:Delete @click="handleDelete([record])">删除</a>
        </template>
      </span>
    </s-table>
    <EditForm
      ref="editForm"
      @Success="
        () => {
          this.$refs.table.refresh()
        }
      "
    ></EditForm>
  </a-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import { STable } from '@/components'
import MainSvc from '@/api/Inv/Inv_LedgerSvc'
import EditForm from './Edit'
import EnumSelect from '@/components/CF/EnumSelect'
import EnumName from '@/components/CF/EnumName'
import StorerSelect from '@/components/Bas/StorerSelect'
import SkuSelect from '@/components/Bas/SkuSelect'
import LocSelect from '@/components/Bas/LocSelect'

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
    return {
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: { WhseId: '', Keyword: '' },
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        this.queryParam.WhseId = this.defaultWhseId
        var _query = Object.assign({}, { ...this.queryParam })
        for (const key in _query) {
          if (moment.isMoment(_query[key])) {
            _query[key] = _query[key].format('YYYY-MM-DD')
          }
        }
        const requestParameters = Object.assign(
          { sortField: 'ModifyTime', sortOrder: 'desc', Search: _query },
          parameter
        )
        console.log('loadData request parameters:', requestParameters)
        return MainSvc.GetPage(requestParameters)
      },
      selectedRowKeys: [],
      selectedRows: [],
      enumItems: [],
      columns: [{ title: '台帐类型', dataIndex: 'Type', sorter: true },
        { title: '类别', dataIndex: 'Category', sorter: true },
        { title: '货主', dataIndex: 'StoreName', sorter: true },
        { title: '物料', dataIndex: 'SkuName', sorter: true },
        { title: '批次', dataIndex: 'LotCode', sorter: true },
        { title: '原库位', dataIndex: 'FromLocCode', sorter: true },
        { title: '目标库位', dataIndex: 'ToLocCode', sorter: true },
        { title: '原托盘', dataIndex: 'FromTrayCode', sorter: true },
        { title: '目标托盘', dataIndex: 'ToTrayCode', sorter: true },
        { title: '数量', dataIndex: 'Qty', sorter: true },
        { title: '来源业务', dataIndex: 'RefTable', sorter: true },
        { title: '来源业务Id', dataIndex: 'RefId', sorter: true },
        { title: () => { return this.cusHeaderTitle('Lot01') }, dataIndex: 'Lot01' },
        { title: () => { return this.cusHeaderTitle('Lot02') }, dataIndex: 'Lot02' },
        { title: () => { return this.cusHeaderTitle('Lot03') }, dataIndex: 'Lot03' },
        { title: () => { return this.cusHeaderTitle('Lot04') }, dataIndex: 'Lot04' },
        { title: () => { return this.cusHeaderTitle('Lot05') }, dataIndex: 'Lot05' },
        { title: () => { return this.cusHeaderTitle('Lot06') }, dataIndex: 'Lot06' },
        { title: () => { return this.cusHeaderTitle('Lot07') }, dataIndex: 'Lot07' },
        { title: () => { return this.cusHeaderTitle('Lot08') }, dataIndex: 'Lot08' },
        { title: () => { return this.cusHeaderTitle('Lot09') }, dataIndex: 'Lot09' },
        { title: () => { return this.cusHeaderTitle('Lot10') }, dataIndex: 'Lot10' },
        {
          title: '修改时间',
          dataIndex: 'ModifyTime',
          sorter: true,
          customRender: (value) => {
            return moment(value).format('yyyy-MM-DD')
          }
        }
      ]
    }
  },
  filters: {},
  created() {
    this.getEnum({ whseId: this.defaultWhseId, code: 'Bas_Lot_Field' }).then((result) => {
      this.enumItems = result.EnumItems
    })
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
    ...mapActions({ getConfig: 'getConfig', getEnum: 'getEnum' }),
    cusHeaderTitle(column) {
      return this.enumItems.find((w) => w.Code === column)?.Name
    },
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
      this.queryParam = { WhseId: this.defaultWhseId, Keyword: '' }
    },
    handleDelete(rows) {
      var thisObj = this
      var ids = rows.map((value) => value.Id)
      this.$confirm({
        title: '确认删除吗?',
        onOk() {
          return new Promise((resolve, reject) => {
            MainSvc.Delete(ids).then((result) => {
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
