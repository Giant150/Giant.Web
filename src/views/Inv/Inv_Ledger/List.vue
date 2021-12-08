<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="台账类型">
              <EnumSelect v-model="queryParam.Type" code="Inv_Ledger_Type"></EnumSelect>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="台账类别">
              <EnumSelect v-model="queryParam.Category" code="Inv_Ledger_Category"></EnumSelect>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="物料货主">
              <StorerSelect v-model="queryParam.StorerId" :type="['Storer']" aria-placeholder="货主"></StorerSelect>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="台账物料">
              <SkuSelect
                v-model="queryParam.SkuId"
                :storer="queryParam.StorerId"
                @select="
                  (val, sku) => {
                    handleSkuSelect(sku)
                  }
                "
                aria-placeholder="物料"
              ></SkuSelect>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="台账库位">
              <LocSelect v-model="queryParam.LocId"></LocSelect>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="模糊查询">
              <a-input v-model="queryParam.Keyword" placeholder="按货主、物料、台账类型、类别、库位查询" />
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="6" :sm="24">
              <a-form-item :label="cusHeaderTitle('Lot01')">
                <LotInput v-model="queryParam.Lot01" name="Lot01" :sku="selectSku"></LotInput>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item :label="cusHeaderTitle('Lot02')">
                <LotInput v-model="queryParam.Lot02" name="Lot02" :sku="selectSku"></LotInput>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item :label="cusHeaderTitle('Lot03')">
                <LotInput v-model="queryParam.Lot03" name="Lot03" :sku="selectSku"></LotInput>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item :label="cusHeaderTitle('Lot04')">
                <LotInput v-model="queryParam.Lot04" name="Lot04" :sku="selectSku"></LotInput>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item :label="cusHeaderTitle('Lot05')">
                <LotInput v-model="queryParam.Lot05" name="Lot05" :sku="selectSku"></LotInput>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item :label="cusHeaderTitle('Lot06')">
                <LotInput v-model="queryParam.Lot06" name="Lot06" :sku="selectSku"></LotInput>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item :label="cusHeaderTitle('Lot07')">
                <LotInput v-model="queryParam.Lot07" name="Lot07" :sku="selectSku"></LotInput>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item :label="cusHeaderTitle('Lot08')">
                <LotInput v-model="queryParam.Lot08" name="Lot08" :sku="selectSku"></LotInput>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item :label="cusHeaderTitle('Lot09')">
                <LotInput v-model="queryParam.Lot09" name="Lot09" :sku="selectSku"></LotInput>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item :label="cusHeaderTitle('Lot10')">
                <LotInput v-model="queryParam.Lot10" name="Lot10" :sku="selectSku"></LotInput>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" v-action:Query @click=" () => { this.$refs.table.refresh()}">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm()">重置</a-button>
              <a @click="() => {this.advanced = !this.advanced}" style="margin-left: 8px">{{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
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
      <template slot="Type" slot-scope="text">
        <EnumName code="Inv_Ledger_Type" :value="text"></EnumName>
      </template>
      <template slot="Category" slot-scope="text">
        <EnumName code="Inv_Ledger_Category" :value="text"></EnumName>
      </template>

      <span slot="action" slot-scope="text, record">
        <template>
          <a v-action:Update @click="handleEdit(record)">修改</a>
          <a-divider v-action:Delete type="vertical" />
          <a v-action:Delete @click="handleDelete([record])">删除</a>
        </template>
      </span>
    </s-table>
    <EditForm ref="editForm" @Success="() => {this.$refs.table.refresh()}"></EditForm>
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
import LotInput from '@/components/Stg/LotInput'

export default {
  components: {
    STable,
    MainSvc,
    EnumSelect,
    EnumName,
    EditForm,
    StorerSelect,
    SkuSelect,
    LocSelect,
    LotInput
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
      queryParam: {
        WhseId: '',
        Type: undefined,
        Category: undefined,
        StorerId: '',
        SkuId: '',
        Keyword: '',
        LocId: '',
        Lot01: '',
        Lot02: '',
        Lot03: '',
        Lot04: '',
        Lot05: '',
        Lot06: '',
        Lot07: '',
        Lot08: '',
        Lot09: '',
        Lot10: ''
      },
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
      selectSku: null,
      selectedRowKeys: [],
      selectedRows: [],
      enumItems: [],
      columns: [
        { title: '货主', dataIndex: 'Storer.Name', sorter: true, width: 120, fixed: 'left' },
        { title: '台帐类型', dataIndex: 'Type', sorter: true, width: 120, fixed: 'left', scopedSlots: { customRender: 'Type' } },
        { title: '类别', dataIndex: 'Category', sorter: true, width: 120, fixed: 'left', scopedSlots: { customRender: 'Category' } },
        { title: '物料编码', dataIndex: 'Sku.Code', sorter: true, width: 120 },
        { title: '物料', dataIndex: 'Sku.Name', sorter: true, width: 150 },
        { title: '批次', dataIndex: 'Lot.Code', sorter: true },
        { title: '原库位', dataIndex: 'FromLoc.Code', sorter: true },
        { title: '目标库位', dataIndex: 'ToLoc.Code', sorter: true },
        { title: '原托盘', dataIndex: 'FromTray.Code', sorter: true },
        { title: '目标托盘', dataIndex: 'ToTray.Code', sorter: true },
        { title: '数量', dataIndex: 'Qty', sorter: true },
        { title: '来源业务', dataIndex: 'RefTable', sorter: true },
        { title: '来源业务Id', dataIndex: 'RefId', sorter: true },
        { title: () => { return this.cusHeaderTitle('Lot01') }, dataIndex: 'Lot.Lot01' },
        { title: () => { return this.cusHeaderTitle('Lot02') }, dataIndex: 'Lot.Lot02' },
        { title: () => { return this.cusHeaderTitle('Lot03') }, dataIndex: 'Lot.Lot03' },
        { title: () => { return this.cusHeaderTitle('Lot04') }, dataIndex: 'Lot.Lot04' },
        { title: () => { return this.cusHeaderTitle('Lot05') }, dataIndex: 'Lot.Lot05' },
        { title: () => { return this.cusHeaderTitle('Lot06') }, dataIndex: 'Lot.Lot06' },
        { title: () => { return this.cusHeaderTitle('Lot07') }, dataIndex: 'Lot.Lot07' },
        { title: () => { return this.cusHeaderTitle('Lot08') }, dataIndex: 'Lot.Lot08' },
        { title: () => { return this.cusHeaderTitle('Lot09') }, dataIndex: 'Lot.Lot09' },
        { title: () => { return this.cusHeaderTitle('Lot10') }, dataIndex: 'Lot.Lot10' },
        { title: '修改时间', dataIndex: 'ModifyTime', sorter: true, customRender: (value) => { return moment(value).format('yyyy-MM-DD') }
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
