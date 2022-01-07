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
            <a-form-item label="关键字">
              <a-input v-model="queryParam.Keyword" placeholder="货主/物料/库位/批次" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="物料">
              <SkuSelect v-model="queryParam.SkuId" :storer="queryParam.StorerId" @select="(val,sku)=>{this.querySku=sku}"></SkuSelect>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="批次">
              <LotSelect v-model="queryParam.LotId" :storer="queryParam.StorerId" :sku="queryParam.SkuId"></LotSelect>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="库位">
              <LocSelect v-model="queryParam.LocId"></LocSelect>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="4" :sm="24">
              <a-form-item label="状态">
                <EnumSelect code="Inv_Inventory_Status" v-model="queryParam.Status" :color="true"></EnumSelect>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item label="托盘">
                <TraySelect v-model="queryParam.TrayId"></TraySelect>
              </a-form-item>
            </a-col>
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
    <div class="table-operator" v-if="!choose">
      <a-button type="primary" v-action:Update icon="edit" @click="handleUpdateStatus('Hold',selectedRowKeys)">批量冻结</a-button>
      <a-button type="primary" v-action:Update icon="edit" @click="handleUpdateStatus('None',selectedRowKeys)">批量解冻</a-button>
      <a-button type="default" v-action:Query icon="export" @click="handleExport()">导出</a-button>
    </div>
    <s-table ref="table" rowKey="Id" :columns="columns" :data="loadData" :alert="true" :rowSelection="rowSelection" showPagination="auto" :size="choose?'small':'default'" :scroll="{ x: 3060 }">
      <template slot="Status" slot-scope="text">
        <EnumName code="Inv_Inventory_Status" :value="text" :color="true"></EnumName>
      </template>
      <span slot="action" slot-scope="text, record">
        <template>
          <a v-if="!choose" v-action:Update @click="handleUpdateStatus(record.Status==='None'?'Hold':'None',[record.Id])">{{ record.Status==='None'?'冻结':'解冻' }}</a>
          <a-divider v-if="!choose" v-action:Move type="vertical" />
          <a v-if="!choose" v-action:Move @click="handleMove(record)">移动</a>
        </template>
      </span>
    </s-table>
    <MoveForm ref="moveForm" @success="$refs.table.refresh()"></MoveForm>
  </a-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
import { STable } from '@/components'
import MainSvc from '@/api/Inv/Inv_InventorySvc'
import EnumSelect from '@/components/CF/EnumSelect'
import EnumName from '@/components/CF/EnumName'
import StorerSelect from '@/components/Bas/StorerSelect'
import SkuSelect from '@/components/Bas/SkuSelect'
import LocSelect from '@/components/Bas/LocSelect'
import LotSelect from '@/components/Inv/LotSelect'
import TraySelect from '@/components/Bas/TraySelect'
import LotInput from '@/components/Stg/LotInput'
import MoveForm from './Move'
export default {
  components: {
    STable,
    MainSvc,
    EnumSelect,
    EnumName,
    StorerSelect,
    SkuSelect,
    LocSelect,
    LotSelect,
    TraySelect,
    LotInput,
    MoveForm
  },
  props: {
    choose: { type: Boolean, required: false, default: false },
    type: { type: String, required: false, default: 'checkbox' },
    query: { type: Object, required: false, default: () => { return {} } }
  },
  data() {
    return {
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      querySku: undefined,
      // 查询参数
      queryParam: {
        WhseId: '', Keyword: '', StorerId: '', SkuId: '', LotId: '', LocId: '', TrayId: '', Status: '',
        Lot01: '', Lot02: '', Lot03: '', Lot04: '', Lot05: '', Lot06: '', Lot07: '', Lot08: '', Lot09: '', Lot10: ''
      },
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
      selectedRows: [],
      enumItems: [],
      columns: [
        { title: '货主', dataIndex: 'StorerId', width: 120, fixed: 'left', customRender: (value, record) => { return record.Storer.Name } },
        { title: '物料', dataIndex: 'SkuId', sorter: true, width: 200, fixed: 'left', customRender: (value, record) => { return `${record.Sku.Name}(${record.Sku.Code})` } },
        { title: '批次', dataIndex: 'LotId', sorter: true, width: 120, customRender: (value, record) => { return record.Lot.Code } },
        { title: '库位', dataIndex: 'LocId', sorter: true, width: 120, customRender: (value, record) => { return record.Loc.Code } },
        { title: '托盘', dataIndex: 'TrayId', sorter: true, width: 120, customRender: (value, record) => { return record?.Tray?.Code } },
        { title: '库存数量', dataIndex: 'Qty', sorter: true, width: 120, needTotal: true },
        { title: '可用数量', width: 100, customRender: (value, record) => { return record.Status === 'Hold' ? 0 : (record.Qty - record.QtyAllocated - record.QtyPicked) } },
        { title: '已分配', dataIndex: 'QtyAllocated', width: 100, needTotal: true },
        { title: '已拣货', dataIndex: 'QtyPicked', width: 100, needTotal: true },
        { title: '库存状态', dataIndex: 'Status', width: 120, scopedSlots: { customRender: 'Status' } },
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
        { title: '修改时间', dataIndex: 'ModifyTime', width: 120, sorter: true, customRender: (value) => { return moment(value).format('YYYY-MM-DD') } },
        { title: '操作', dataIndex: 'action', width: 120, fixed: 'right', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  watch: {
    query(newVal) {
      Object.assign(this.queryParam, newVal)
      this.$refs.table.refresh()
    }
  },
  filters: {
  },
  created() {
    this.queryParam.WhseId = this.defaultWhseId
    this.queryParam.StorerId = this.defaultStorerId
    Object.assign(this.queryParam, this.query)
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
        onChange: this.onSelectChange,
        type: this.type
      }
    }
  },
  methods: {
    ...mapActions({ getConfig: 'getConfig', getEnum: 'getEnum' }),
    moment,
    cusHeaderTitle(column) {
      return this.enumItems?.find(w => w.Code === column)?.Name
    },
    handleAdd() {
      this.mdl = null
      this.visible = true
      this.$refs.editForm.openForm(null, '新增')
    },
    handleSkuSelect(sku) {
      this.selectSku = sku
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    resetSearchForm() {
      this.querySku = undefined
      this.queryParam = {
        WhseId: this.defaultWhseId, Keyword: '', StorerId: this.defaultStorerId, SkuId: '', LotId: '', LocId: '', TrayId: '', Status: '',
        Lot01: '', Lot02: '', Lot03: '', Lot04: '', Lot05: '', Lot06: '', Lot07: '', Lot08: '', Lot09: '', Lot10: ''
      }
    },
    handleUpdateStatus(status, ids) {
      MainSvc.UpdateStatus(status, ids).then(result => {
        if (result.Success) {
          this.$message.success('操作成功!')
          this.$refs.table.refresh()
        } else {
          this.$message.error(result.Msg)
        }
      })
    },
    handleMove(record) {
      this.$refs.moveForm.openForm(record.Id)
    },
    handleExport() {
      this.queryParam.WhseId = this.defaultWhseId
      var _query = Object.assign({}, { ...this.queryParam })
      for (const key in _query) {
        if (moment.isMoment(_query[key])) {
          _query[key] = _query[key].format('YYYY-MM-DD')
        }
      }
      MainSvc.Export(_query).then(result => {
        if (result.Success) {
          var fileName = result.Data.substring(result.Data.lastIndexOf('/') + 1)
          var filePath = `${process.env.VUE_APP_API_BASE_URL}${result.Data}`
          console.log('handleExport', fileName, filePath)
          try {
            var elem = document.createElement('a')
            elem.download = fileName
            elem.href = filePath
            elem.style.display = 'none'
            document.body.appendChild(elem)
            elem.click()
            document.body.removeChild(elem)
          } catch (e) {
            this.$message.error('下载异常！')
          }
        } else {
          this.$message.error(result.Msg)
        }
      })
    }
  }
}
</script>
