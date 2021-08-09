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
            <a-form-item label="物料">
              <SkuSelect v-model="queryParam.SkuId" :storer="queryParam.StorerId" @select="(val,sku)=>{this.querySku=sku}"></SkuSelect>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="关键字">
              <a-input v-model="queryParam.Keyword" placeholder="批次编号" />
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="4" :sm="24">
              <a-form-item :label="cusHeaderTitle('Lot01')">
                <LotInput name="Lot01" v-model="queryParam.Lot01" :sku="querySku"></LotInput>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item :label="cusHeaderTitle('Lot02')">
                <LotInput name="Lot02" v-model="queryParam.Lot02" :sku="querySku"></LotInput>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item :label="cusHeaderTitle('Lot03')">
                <LotInput name="Lot03" v-model="queryParam.Lot03" :sku="querySku"></LotInput>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item :label="cusHeaderTitle('Lot04')">
                <LotInput name="Lot04" v-model="queryParam.Lot04" :sku="querySku"></LotInput>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item :label="cusHeaderTitle('Lot05')">
                <LotInput name="Lot05" v-model="queryParam.Lot05" :sku="querySku"></LotInput>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item :label="cusHeaderTitle('Lot06')">
                <LotInput name="Lot06" v-model="queryParam.Lot06" :sku="querySku"></LotInput>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item :label="cusHeaderTitle('Lot07')">
                <LotInput name="Lot07" v-model="queryParam.Lot07" :sku="querySku"></LotInput>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item :label="cusHeaderTitle('Lot08')">
                <LotInput name="Lot08" v-model="queryParam.Lot08" :sku="querySku"></LotInput>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item :label="cusHeaderTitle('Lot09')">
                <LotInput name="Lot09" v-model="queryParam.Lot09" :sku="querySku"></LotInput>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item :label="cusHeaderTitle('Lot10')">
                <LotInput name="Lot10" v-model="queryParam.Lot10" :sku="querySku"></LotInput>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="4" :sm="24">
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
    <s-table ref="table" size="default" rowKey="Id" :columns="columns" :data="loadData" :rowSelection="rowSelection" showPagination="auto" :scroll="{ x: 2000 }">
    </s-table>
    <EditForm ref="editForm" @Success="()=>{this.$refs.table.refresh()}"></EditForm>
  </a-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import { STable } from '@/components'
import MainSvc from '@/api/Inv/Inv_LotSvc'
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
        WhseId: '', Keyword: '', StorerId: '', SkuId: '',
        Lot01: '', Lot02: '', Lot03: '', Lot04: '', Lot05: '', Lot06: '', Lot07: '', Lot08: '', Lot09: '', Lot10: ''
      },
      querySku: undefined,
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
      selectedRows: [],
      enumItems: [],
      columns: [
        { title: '货主', dataIndex: 'Storer.Name', width: 120, fixed: 'left' },
        { title: '物料', dataIndex: 'Sku.Name', width: 120, fixed: 'left' },
        { title: '编号', dataIndex: 'Code', sorter: true, width: 120, fixed: 'left' },
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
        { title: '修改时间', dataIndex: 'ModifyTime', sorter: true, customRender: (value) => { return moment(value).format('yyyy-MM-DD') } }
        // { title: '操作', dataIndex: 'action', width: '200px', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  filters: {
  },
  created() {
    this.queryParam.WhseId = this.defaultWhseId
    this.queryParam.StorerId = this.defaultStorerId
    this.getEnum({ whseId: this.defaultWhseId, code: 'Bas_Lot_Field' }).then(result => {
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
      return this.enumItems.find(w => w.Code === column)?.Name
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
      this.querySku = undefined
      this.queryParam = {
        WhseId: this.defaultWhseId, Keyword: '', StorerId: this.defaultStorerId, SkuId: '',
        Lot01: '', Lot02: '', Lot03: '', Lot04: '', Lot05: '', Lot06: '', Lot07: '', Lot08: '', Lot09: '', Lot10: ''
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
