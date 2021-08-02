<template>
  <a-drawer title="发货管理" placement="right" width="70%" :visible="visible" @close="()=>{this.visible=false}" :maskClosable="false" :body-style="{ paddingBottom: '80px' }">
    <a-spin :spinning="loading">
      <a-form-model ref="form" :model="entity" :rules="rules" v-bind="layout">
        <a-row>
          <a-col :span="6">
            <a-form-model-item label="货主" prop="StorerId">
              <StorerSelect v-model="entity.StorerId" :type="['Storer']" :disabled="isModify"></StorerSelect>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="编码" prop="Code">
              <CodeInput ref="codeInput" code="Bus_Order_Code" v-model="entity.Code" :para="{}" :disabled="isModify"></CodeInput>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="订单类型" prop="Type">
              <EnumSelect code="Bus_Order_Type" v-model="entity.Type"></EnumSelect>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="收货人" prop="ConsigneeId">
              <StorerSelect v-model="entity.ConsigneeId" :type="['Consignee']" placeholder="收货人"></StorerSelect>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="6">
            <a-form-model-item label="单据日期" prop="DocDate">
              <a-date-picker v-model="entity.DocDate" valueFormat="YYYY-MM-DD"></a-date-picker>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="订单日期" prop="OrderDate">
              <a-date-picker v-model="entity.OrderDate" valueFormat="YYYY-MM-DD"></a-date-picker>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="备注" prop="Remark" :labelCol="{ xs: { span: 24 }, sm: { span: 3 } }" :wrapperCol="{ xs: { span: 24 }, sm: { span: 19 } }">
              <a-input v-model="entity.Remark"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <a-tabs :defaultActiveKey="activeKey" size="small" @change="handlerTabsChange" :animated="false" :tabBarStyle="{marginBottom:0}">
        <div slot="tabBarExtraContent">
          <a-button type="primary" v-action:Add icon="plus" @click="handleAdd" v-if="entity.Status==='Active' || entity.Status==='Allocate' || entity.Status==='Allocated'">新建</a-button>
        </div>
        <a-tab-pane key="OrderDetail" tab="发货明细" forceRender>
          <a-table ref="table" size="small" rowKey="Id" :columns="orderDetailColumn" :data-source="entity.OrderDetail" :rowSelection="orderRowSelection" :pagination="false" :scroll="{ x: 3500 }">
            <template slot="Code" slot-scope="text, record">
              <CodeInput code="Bus_OrderDetail_Code" v-model="record.Code" :para="{OrderCode:entity.Code}" size="small" :disabled="record.Status!=='Active'"></CodeInput>
            </template>
            <template slot="SkuId" slot-scope="text, record">
              <SkuSelect v-model="record.SkuId" :storer="entity.StorerId" @select="(val,sku)=>{handleSkuSelect(record,sku)}" size="small" :disabled="record.Status!=='Active'"></SkuSelect>
            </template>
            <template slot="QtyUom" slot-scope="text, record">
              <a-input-number v-model="record.QtyUom" @change="(val)=>{ record.Qty = val * record.UomCnt;record.TotalAmt = record.Qty * record.UnitPrice }" :min="record.Status==='Active'?0:record.QtyUom" style="width:100%" size="small" :disabled="!(record.Status==='Active' || record.Status==='Allocate' || record.Status==='Allocated')" />
            </template>
            <template slot="UomCode" slot-scope="text, record">
              <SkuUomSelect v-model="record.UomCode" :sku="record.SkuId" @select="(val,uom)=>{handlerUomSelect(record,uom)}" style="width:100%" size="small" :disabled="record.Status!=='Active'"></SkuUomSelect>
            </template>
            <template slot="Status" slot-scope="text">
              <EnumName code="Bus_Order_Status" :value="text"></EnumName>
            </template>
            <template slot="RotateBy" slot-scope="text, record">
              <EnumSelect code="Bas_Lot_Field" v-model="record.RotateBy" style="width:100%" size="small" :disabled="record.Status!=='Active'"></EnumSelect>
            </template>
            <template slot="RotateType" slot-scope="text, record">
              <EnumSelect code="Rotation" v-model="record.RotateType" style="width:100%" size="small" :disabled="record.Status!=='Active'"></EnumSelect>
            </template>
            <template slot="AllocStgId" slot-scope="text, record">
              <CommonSelect table="Stg_Allocate" v-model="record.AllocStgId" size="small" :disabled="record.Status!=='Active'"></CommonSelect>
            </template>
            <template slot="RackLife" slot-scope="text, record">
              <a-input-number v-model="record.RackLife" :min="0" style="width:100%" size="small" :disabled="record.Status!=='Active'" />
            </template>
            <template slot="LocId" slot-scope="text, record">
              <LocSelect v-model="record.LocId" size="small" allowClear :disabled="record.Status!=='Active'"></LocSelect>
            </template>
            <template slot="TrayId" slot-scope="text, record">
              <TraySelect v-model="record.TrayId" :type="record.Sku?record.Sku.TrayTypeId:''" size="small" allowClear :disabled="record.Status!=='Active'"></TraySelect>
            </template>
            <template slot="Lot01" slot-scope="text, record">
              <LotInput name="Lot01" :sku="record.Sku" v-model="record.Lot01" size="small" :disabled="record.Status!=='Active'"></LotInput>
            </template>
            <template slot="Lot02" slot-scope="text, record">
              <LotInput name="Lot02" :sku="record.Sku" v-model="record.Lot02" size="small" :disabled="record.Status!=='Active'"></LotInput>
            </template>
            <template slot="Lot03" slot-scope="text, record">
              <LotInput name="Lot03" :sku="record.Sku" v-model="record.Lot03" size="small" :disabled="record.Status!=='Active'"></LotInput>
            </template>
            <template slot="Lot04" slot-scope="text, record">
              <LotInput name="Lot04" :sku="record.Sku" v-model="record.Lot04" size="small" :disabled="record.Status!=='Active'"></LotInput>
            </template>
            <template slot="Lot05" slot-scope="text, record">
              <LotInput name="Lot05" :sku="record.Sku" v-model="record.Lot05" size="small" :disabled="record.Status!=='Active'"></LotInput>
            </template>
            <template slot="Lot06" slot-scope="text, record">
              <LotInput name="Lot06" :sku="record.Sku" v-model="record.Lot06" size="small" :disabled="record.Status!=='Active'"></LotInput>
            </template>
            <template slot="Lot07" slot-scope="text, record">
              <LotInput name="Lot07" :sku="record.Sku" v-model="record.Lot07" size="small" :disabled="record.Status!=='Active'"></LotInput>
            </template>
            <template slot="Lot08" slot-scope="text, record">
              <LotInput name="Lot08" :sku="record.Sku" v-model="record.Lot08" size="small" :disabled="record.Status!=='Active'"></LotInput>
            </template>
            <template slot="Lot09" slot-scope="text, record">
              <LotInput name="Lot09" :sku="record.Sku" v-model="record.Lot09" size="small" :disabled="record.Status!=='Active'"></LotInput>
            </template>
            <template slot="Lot10" slot-scope="text, record">
              <LotInput name="Lot10" :sku="record.Sku" v-model="record.Lot10" size="small" :disabled="record.Status!=='Active'"></LotInput>
            </template>
            <template slot="Remark" slot-scope="text, record">
              <a-input v-model="record.Remark" size="small" />
            </template>
            <template slot="action" slot-scope="text, record">
              <a v-action:Delete v-if="record.Status==='Active'" @click="handleDelete(record)">删除</a>
              <a v-action:Allocate v-if="record.Status==='Allocate' || record.Status==='Allocated'" @click="handleRejectAllocate(record.Id,'OrderDetail')">撤销配货</a>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="PickDetail" tab="拣货明细" forceRender v-if="entity.Id">
          <a-table ref="table" size="small" rowKey="Id" :columns="pickDetailColumn" :data-source="pickDetail" :pagination="false" :scroll="{ x: 3500 }">
            <template slot="Code" slot-scope="text, record">
              <CodeInput code="Bus_PickDetail_Code" v-model="record.Code" :para="{DetailCode:selectedOrderDetail.Code,DetailId:selectedOrderDetail.Id}" size="small" :disabled="!record.Id.startsWith('new_')"></CodeInput>
            </template>
            <template slot="LocId" slot-scope="text, record">
              <LocSelect v-model="record.LocId" size="small" :disabled="!record.Id.startsWith('new_')"></LocSelect>
            </template>
            <template slot="TrayId" slot-scope="text, record">
              <TraySelect v-model="record.TrayId" size="small" allowClear :disabled="!record.Id.startsWith('new_')"></TraySelect>
            </template>
            <template slot="SkuId" slot-scope="text, record">
              <SkuSelect v-model="record.SkuId" :storer="record.StorerId" size="small" :disabled="!record.Id.startsWith('new_')"></SkuSelect>
            </template>
            <template slot="Qty" slot-scope="text, record">
              <a-input-number v-model="record.Qty" style="width:100%" size="small" :disabled="!record.Id.startsWith('new_')" />
            </template>
            <template slot="Status" slot-scope="text">
              <EnumName code="Bus_PickDetail_Status" :value="text"></EnumName>
            </template>
            <template slot="ToLocId" slot-scope="text, record">
              <LocSelect v-model="record.ToLocId" size="small" :disabled="!record.Id.startsWith('new_')"></LocSelect>
            </template>
            <template slot="QtyUom" slot-scope="text, record">
              <a-input-number v-model="record.QtyUom" style="width:100%" size="small" :disabled="!record.Id.startsWith('new_')" />
            </template>
            <template slot="UomCode" slot-scope="text, record">
              <SkuUomSelect v-model="record.UomCode" :sku="record.SkuId" style="width:100%" size="small" :disabled="!record.Id.startsWith('new_')"></SkuUomSelect>
            </template>
            <template slot="Remark" slot-scope="text, record">
              <a-input v-model="record.Remark" size="small" :disabled="!record.Id.startsWith('new_')" />
            </template>
            <template slot="action" slot-scope="text, record">
              <a v-action:Add v-if="record.Id.startsWith('new_')" @click="handlePickSave(record)">保存</a>
              <a-divider v-action:Delete type="vertical" v-if="record.Status==='Active'" />
              <a v-action:Delete v-if="record.Status==='Active'" @click="handlePickDelete(record)">{{ record.Id.startsWith('new_')?'删除':'撤销配货' }}</a>
            </template>
          </a-table>
          <InvChoose type="radio" ref="invChoose" @choose="handlerInvChoose"></InvChoose>
        </a-tab-pane>
      </a-tabs>
    </a-spin>
    <div :style="{ position: 'absolute', bottom: 0, right: 0, width: '100%', borderTop: '1px solid #e9e9e9', padding: '10px 16px', background: '#fff', textAlign: 'right', zIndex: 1, }">
      <a-button :style="{ marginRight: '8px' }" type="primary" @click="handleAllocate" v-action:Allocate v-if="entity.Id && (entity.Status==='Active' || entity.Status==='Allocate')">配货</a-button>
      <a-button :style="{ marginRight: '8px' }" type="primary" @click="handleRejectAllocate(entity.Id,'Order')" v-action:Allocate v-if="entity.Status==='Allocate' || entity.Status==='Allocated'">撤销配货</a-button>
      <a-button :style="{ marginRight: '8px' }" type="primary" @click="handleRelease" v-action:Release v-if="entity.Status==='Allocated'">下发拣货任务</a-button>
      <a-button :style="{ marginRight: '8px' }" v-action:Release @click="handlePickPrint">打印拣货单</a-button>
      <!-- <a-button :style="{ marginRight: '8px' }" type="primary">拣货确认</a-button> -->
      <a-button :style="{ marginRight: '8px' }" type="primary" @click="handleShipping" v-action:Shipping v-if="entity.Status==='Picked'">发货确认</a-button>
      <a-button :style="{ marginRight: '8px' }" @click="handleShipPrint" v-action:Shipping v-if="entity.Status==='Shipped'">打印送货单</a-button>
      <a-button :style="{ marginRight: '8px' }" type="primary" @click="handleSubmit" v-action:Update v-if="entity.Status==='Active' || entity.Status==='Allocate' || entity.Status==='Allocated'">保存</a-button>
      <a-button :style="{ marginRight: '8px' }" @click="()=>{this.visible=false}">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import moment from 'moment'
import print from 'print-js'
import { mapActions, mapGetters } from 'vuex'
import MainSvc from '@/api/Bus/Bus_OrderSvc'
import DetailSvc from '@/api/Bus/Bus_OrderDetailSvc'
import PickSvc from '@/api/Bus/Bus_PickDetailSvc'
import EnumSelect from '@/components/CF/EnumSelect'
import EnumName from '@/components/CF/EnumName'
import CodeInput from '@/components/CF/CodeInput'
import StorerSelect from '@/components/Bas/StorerSelect'
import TreeSelect from '@/components/CF/TreeSelect'
import CommonSelect from '@/components/CF/CommonSelect'
import LocSelect from '@/components/Bas/LocSelect'
import SkuSelect from '@/components/Bas/SkuSelect'
import SkuUomSelect from '@/components/Bas/SkuUomSelect'
import TraySelect from '@/components/Bas/TraySelect'
import LotInput from '@/components/Stg/LotInput'
import LotSelect from '@/components/Inv/LotSelect'
import InvChoose from '@/components/Inv/InvChoose'
export default {
  components: {
    PickSvc,
    CodeInput,
    EnumSelect,
    EnumName,
    StorerSelect,
    TreeSelect,
    CommonSelect,
    LocSelect,
    SkuSelect,
    SkuUomSelect,
    TraySelect,
    LotInput,
    LotSelect,
    InvChoose
  },
  props: {},
  data() {
    return {
      title: '新建',
      layout: { labelCol: { xs: { span: 24 }, sm: { span: 6 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 14 } } },
      rules: {
        StorerId: [{ required: true, message: '必填' }],
        Type: [{ required: true, message: '必填' }],
        Code: [{ required: true, message: '必填' }]
      },
      visible: false,
      loading: false,
      enumItems: [],
      entity: {},
      curDetailIndex: 0,
      activeKey: 'OrderDetail',
      isModify: false, // 是否编辑
      selectedOrderDetail: null,
      defaultPickToLocId: '',
      orderRowSelection: {
        columnWidth: 20,
        type: 'radio',
        selectedRowKeys: [],
        hideDefaultSelections: true,
        onChange: (keys, rows) => {
          this.orderRowSelection.selectedRowKeys = keys
          console.log('orderRowSelection', keys)
          this.selectedOrderDetail = rows[0]
        }
      },
      orderDetailColumn: [
        { title: '编号', dataIndex: 'Code', width: 100, fixed: 'left', scopedSlots: { customRender: 'Code' } },
        { title: '物料', dataIndex: 'SkuId', width: 200, fixed: 'left', scopedSlots: { customRender: 'SkuId' } },
        { title: '订单数量', dataIndex: 'QtyUom', width: 80, fixed: 'left', scopedSlots: { customRender: 'QtyUom' } },
        { title: '单位', dataIndex: 'UomCode', width: 80, fixed: 'left', scopedSlots: { customRender: 'UomCode' } },
        { title: '物料数量', dataIndex: 'Qty', width: 80 },
        { title: '状态', dataIndex: 'Status', width: 120, scopedSlots: { customRender: 'Status' } },
        { title: '已分配', dataIndex: 'QtyAllocated', width: 80 },
        { title: '已拣货', dataIndex: 'QtyPicked', width: 80 },
        { title: '已发货', dataIndex: 'QtyShipped', width: 80 },
        { title: '循环规则', dataIndex: 'RotateBy', width: 120, scopedSlots: { customRender: 'RotateBy' } },
        { title: '优先规则', dataIndex: 'RotateType', width: 120, scopedSlots: { customRender: 'RotateType' } },
        { title: '发货策略', dataIndex: 'AllocStgId', width: 120, scopedSlots: { customRender: 'AllocStgId' } },
        { title: '货架寿命', dataIndex: 'RackLife', width: 80, scopedSlots: { customRender: 'RackLife' } },
        { title: '指定库位', dataIndex: 'LocId', width: 120, scopedSlots: { customRender: 'LocId' } },
        { title: '指定托盘', dataIndex: 'TrayId', width: 120, scopedSlots: { customRender: 'TrayId' } },
        // { title: '指定批次', dataIndex: 'LotId', width: 120, scopedSlots: { customRender: 'LotId' } },
        { title: () => { return this.cusHeaderTitle('Lot01') }, dataIndex: 'Lot01', width: 150, scopedSlots: { customRender: 'Lot01' } },
        { title: () => { return this.cusHeaderTitle('Lot02') }, dataIndex: 'Lot02', width: 150, scopedSlots: { customRender: 'Lot02' } },
        { title: () => { return this.cusHeaderTitle('Lot03') }, dataIndex: 'Lot03', width: 150, scopedSlots: { customRender: 'Lot03' } },
        { title: () => { return this.cusHeaderTitle('Lot04') }, dataIndex: 'Lot04', width: 150, scopedSlots: { customRender: 'Lot04' } },
        { title: () => { return this.cusHeaderTitle('Lot05') }, dataIndex: 'Lot05', width: 150, scopedSlots: { customRender: 'Lot05' } },
        { title: () => { return this.cusHeaderTitle('Lot06') }, dataIndex: 'Lot06', width: 150, scopedSlots: { customRender: 'Lot06' } },
        { title: () => { return this.cusHeaderTitle('Lot07') }, dataIndex: 'Lot07', width: 150, scopedSlots: { customRender: 'Lot07' } },
        { title: () => { return this.cusHeaderTitle('Lot08') }, dataIndex: 'Lot08', width: 150, scopedSlots: { customRender: 'Lot08' } },
        { title: () => { return this.cusHeaderTitle('Lot09') }, dataIndex: 'Lot09', width: 150, scopedSlots: { customRender: 'Lot09' } },
        { title: () => { return this.cusHeaderTitle('Lot10') }, dataIndex: 'Lot10', width: 150, scopedSlots: { customRender: 'Lot10' } },
        { title: '备注', dataIndex: 'Remark', scopedSlots: { customRender: 'Remark' } },
        { title: '操作', dataIndex: 'action', width: 100, fixed: 'right', scopedSlots: { customRender: 'action' } }
      ],
      pickDetailColumn: [
        { title: '编号', dataIndex: 'Code', width: 120, fixed: 'left', scopedSlots: { customRender: 'Code' } },
        { title: '库位', dataIndex: 'LocId', width: 120, scopedSlots: { customRender: 'LocId' } },
        { title: '托盘', dataIndex: 'TrayId', width: 120, scopedSlots: { customRender: 'TrayId' } },
        { title: '物料', dataIndex: 'SkuId', width: 200, scopedSlots: { customRender: 'SkuId' } },
        { title: '数量', dataIndex: 'Qty', width: 80, scopedSlots: { customRender: 'Qty' } },
        { title: '状态', dataIndex: 'Status', width: 120, scopedSlots: { customRender: 'Status' } },
        { title: '至库位', dataIndex: 'ToLocId', width: 120, scopedSlots: { customRender: 'ToLocId' } },
        { title: () => { return this.cusHeaderTitle('Lot01') }, dataIndex: 'Lot.Lot01', width: 150 },
        { title: () => { return this.cusHeaderTitle('Lot02') }, dataIndex: 'Lot.Lot02', width: 150 },
        { title: () => { return this.cusHeaderTitle('Lot03') }, dataIndex: 'Lot.Lot03', width: 150 },
        { title: () => { return this.cusHeaderTitle('Lot04') }, dataIndex: 'Lot.Lot04', width: 150 },
        { title: () => { return this.cusHeaderTitle('Lot05') }, dataIndex: 'Lot.Lot05', width: 150 },
        { title: () => { return this.cusHeaderTitle('Lot06') }, dataIndex: 'Lot.Lot06', width: 150 },
        { title: () => { return this.cusHeaderTitle('Lot07') }, dataIndex: 'Lot.Lot07', width: 150 },
        { title: () => { return this.cusHeaderTitle('Lot08') }, dataIndex: 'Lot.Lot08', width: 150 },
        { title: () => { return this.cusHeaderTitle('Lot09') }, dataIndex: 'Lot.Lot09', width: 150 },
        { title: () => { return this.cusHeaderTitle('Lot10') }, dataIndex: 'Lot.Lot10', width: 150 },
        { title: '拣货数量', dataIndex: 'QtyUom', width: 80, scopedSlots: { customRender: 'QtyUom' } },
        { title: '拣货单位', dataIndex: 'UomCode', width: 120, scopedSlots: { customRender: 'UomCode' } },
        { title: '备注', dataIndex: 'Remark', scopedSlots: { customRender: 'Remark' } },
        { title: '操作', dataIndex: 'action', width: 100, fixed: 'right', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  computed: {
    ...mapGetters({
      defaultWhseId: 'whseId',
      defaultStorerId: 'storerId'
    }),
    pickDetail() {
      return this.selectedOrderDetail?.PickDetail
    }
  },
  created() {
    this.getEnum({ whseId: this.defaultWhseId, code: 'Bas_Lot_Field' }).then(result => {
      this.enumItems = result.EnumItems
    })
    this.getConfig({ whseId: this.defaultWhseId, code: 'Bas_PutawayZone_PickToLocId_Default' }).then(result => {
      this.defaultPickToLocId = result.Val
    })
  },
  methods: {
    moment,
    ...mapActions({ getConfig: 'getConfig', getEnum: 'getEnum' }),
    init() {
      this.loading = false
      this.visible = true
      this.isModify = false
      this.selectedOrderDetail = null
      this.orderRowSelection.selectedRowKeys = []
      this.entity = { OrderDetail: [], Id: '', WhseId: this.defaultWhseId, StorerId: this.defaultStorerId, Code: '', RefCode: '', Type: 'Standard', DocDate: moment().format('YYYY-MM-DD'), OrderDate: moment().format('YYYY-MM-DD'), ConsigneeId: undefined, Remark: '', Status: 'Active' }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    openForm(id, title) {
      this.title = title || (id ? '新建' : '修改')
      this.init()
      if (id) {
        this.isModify = true
        this.loadData(id)
      } else {
        this.getConfig({ whseId: this.defaultWhseId, code: 'Bus_Order_Code_AutoGenerate' }).then(result => {
          if (result.Val === '1') {
            this.$refs.codeInput.Generate()
          }
        })
      }
    },
    loadData(id) {
      MainSvc.Get(id).then(resJson => {
        this.entity = resJson.Data
      })
    },
    handlerTabsChange(key) {
      this.activeKey = key
    },
    cusHeaderTitle(column) {
      return this.enumItems?.find(w => w.Code === column)?.Name
    },
    handleAdd() {
      if (this.activeKey === 'OrderDetail') {
        this.curDetailIndex += 1
        var detail = {
          Id: `new_${this.curDetailIndex}`, WhseId: this.defaultWhseId, OrderId: this.entity.Id, StorerId: this.entity.StorerId, Code: '',
          SkuId: '', QtyUom: 0, UomCode: '', UomCnt: 1, Qty: 0, QtyAllocated: 0, QtyPicked: 0, RotateBy: '', RotateType: '', AllocStgId: '', RackLife: 0,
          LocId: undefined, TrayId: undefined, LotId: undefined,
          Lot01: '', Lot02: '', Lot03: '', Lot04: '', Lot05: '', Lot06: '', Lot07: '', Lot08: '', Lot09: '', Lot10: '',
          UnitPrice: 0, TotalAmt: 0, Remark: '', Status: 'Active',
          Sku: undefined
        }
        this.entity.OrderDetail.push(detail)
      }
      if (this.activeKey === 'PickDetail') {
        this.$refs.invChoose.choose({
          StorerId: this.selectedOrderDetail.StorerId,
          SkuId: this.selectedOrderDetail.SkuId
        })
      }
    },
    handlerInvChoose(selectRows) {
      if (selectRows.length === 0) return
      var inv = selectRows[0]
      console.log('handlerInvChoose', inv)
      if (inv.StorerId !== this.selectedOrderDetail.StorerId || inv.SkuId !== this.selectedOrderDetail.SkuId) {
        this.$message.error('选择的物料不匹配')
        return
      }
      this.curDetailIndex += 1
      var detail = {
        Id: `new_${this.curDetailIndex}`, WhseId: this.defaultWhseId, OrderId: this.entity.Id, OrderDetailId: this.selectedOrderDetail.Id,
        StorerId: inv.StorerId, Code: '', SkuId: inv.SkuId, LotId: inv.LotId, LocId: inv.LocId, TrayId: inv.TrayId,
        QtyUom: inv.Qty, UomCode: 'EA', UomCnt: 1, Qty: inv.Qty, ToLocId: this.defaultPickToLocId,
        Status: 'Active', AllocateLocId: inv.LocId, InventoryId: inv.Id,
        Lot: inv.Lot, Sku: inv.Sku
      }
      console.log(detail)
      this.selectedOrderDetail.PickDetail.push(detail)
    },
    handleDelete(record) {
      if (this.activeKey === 'OrderDetail') {
        if (!record.Id.startsWith('new_')) {
          DetailSvc.Delete([record.Id])
        }
        var index = this.entity.OrderDetail.indexOf(record)
        this.entity.OrderDetail.splice(index, 1)
      }
    },
    handleRejectAllocate(id, type) {
      if (type === 'OrderDetail') {
        this.loading = true
        DetailSvc.RejectAllocate(id).then(result => {
          this.loading = false
          if (result.Success) {
            this.$message.success(result.Msg)
            this.visible = false
            this.$emit('Success')
          } else {
            this.$message.error(result.Msg)
          }
        })
      }
      if (type === 'Order') {
        this.loading = true
        MainSvc.RejectAllocate(id).then(result => {
          this.loading = false
          if (result.Success) {
            this.$message.success(result.Msg)
            this.visible = false
            this.$emit('Success')
          } else {
            this.$message.error(result.Msg)
          }
        })
      }
    },
    handleSkuSelect(record, sku) {
      record.Sku = sku
      record.UnitPrice = sku.Price
      record.RotateBy = sku.RotateBy
      record.RotateType = sku.RotateType
      record.AllocStgId = sku.AllocStgId
      record.RackLife = sku.RackLife
    },
    handlerUomSelect(record, uom) {
      // record.SkuUomId = uom.Id
      record.UomCnt = uom.UomCnt
      record.Qty = record.QtyUom * record.UomCnt
      record.TotalAmt = record.Qty * record.UnitPrice
    },
    handlePickSave(pick) {
      var postData = Object.assign({}, pick)
      postData.Sku = null
      postData.Lot = null
      PickSvc.Add(postData).then(result => {
        if (result.Success) {
          this.$message.success(result.Msg)
          for (const key in pick) {
            if (Object.hasOwnProperty.call(result.Data, key)) {
              pick[key] = result.Data[key]
            }
          }
          this.loadData(this.entity.Id)
        } else {
          this.$message.error(result.Msg)
        }
      })
    },
    handlePickDelete(pick) {
      if (!pick.Id.startsWith('new_')) {
        PickSvc.RejectAllocate(pick.Id).then(result => {
          if (result.Success) {
            this.$message.success(result.Msg)
            this.loadData(this.entity.Id)
          } else {
            this.$message.error(result.Msg)
          }
        })
      }
      var index = this.selectedOrderDetail.PickDetail.indexOf(pick)
      this.selectedOrderDetail.PickDetail.splice(index, 1)
    },
    handleSubmit() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          this.$message.error('数据验证失败')
          return
        }
        const list = this.entity.OrderDetail.map(detail => Object.assign({}, detail))
        const validMsg = []
        list.forEach(detail => {
          if (!detail.Code) validMsg.push(`收货明细编号必需输入`)
          if (!detail.SkuId) validMsg.push(`收货明细${detail.Code}中物料必需选择`)
          if (detail.QtyUom === 0) validMsg.push(`收货明细${detail.Code}中物料数量为0`)
          detail.Sku = null
          detail.PickDetail = null
          detail.Lot = null
        })
        if (validMsg.length > 0) {
          this.$message.error((h) => { return (<a-list size="small" split={false}>{validMsg.map(m => { return (<a-list-item>{m}</a-list-item>) })}</a-list>) })
          return
        }
        const postData = Object.assign({}, this.entity)
        postData.OrderDetail = list
        this.loading = true
        MainSvc.Save(postData).then(result => {
          this.loading = false
          if (result.Success) {
            this.$message.success(result.Msg)
            this.visible = false
            this.$emit('Success')
          } else {
            this.$message.error(result.Msg)
          }
        })
      })
    },
    handleAllocate() {
      this.loading = true
      MainSvc.Allocate(this.entity.Id).then(result => {
        this.loading = false
        if (result.Success) {
          this.$message.success(result.Msg)
          this.visible = false
          this.$emit('Success')
        } else {
          this.$message.error(result.Msg)
        }
      })
    },
    handleRelease() {
      this.loading = true
      MainSvc.Release(this.entity.Id).then(result => {
        this.loading = false
        if (result.Success) {
          this.$router.push({ path: '/Inv/Inv_Task', query: { RefTable: 'Bus_Order', RefId: this.entity.Id } })
          this.$message.success(result.Msg)
          this.visible = false
          this.$emit('Success')
        } else {
          this.$message.error(result.Msg)
        }
      })
    },
    handlePickPrint() {
      MainSvc.PickPrint(this.entity.Id).then(result => {
        if (result.Success) {
          var filePath = `${process.env.VUE_APP_API_BASE_URL}${result.Data}`
          print(filePath)
        } else {
          this.$message.error(result.Msg)
        }
      })
    },
    handleShipPrint() {
      MainSvc.ShipPrint(this.entity.Id).then(result => {
        if (result.Success) {
          var filePath = `${process.env.VUE_APP_API_BASE_URL}${result.Data}`
          print(filePath)
        } else {
          this.$message.error(result.Msg)
        }
      })
    },
    handleShipping() {
      this.loading = true
      MainSvc.Shipping(this.entity.Id).then(result => {
        this.loading = false
        if (result.Success) {
          this.$message.success(result.Msg)
          this.visible = false
          this.$emit('Success')
        } else {
          this.$message.error(result.Msg)
        }
      })
    }
  }
}
</script>
