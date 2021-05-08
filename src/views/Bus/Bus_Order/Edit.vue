<template>
  <a-drawer title="收货管理" placement="right" width="70%" :visible="visible" @close="()=>{this.visible=false}" :maskClosable="false" :body-style="{ paddingBottom: '80px' }">
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
          <a-button type="primary" v-action:Add icon="plus" @click="handleAdd">新建</a-button>
        </div>
        <a-tab-pane key="OrderDetail" tab="收货明细">
          <a-table ref="table" size="small" rowKey="Id" :columns="orderDetailColumn" :data-source="entity.OrderDetail" :pagination="false" :scroll="{ x: 3500 }">
            <template slot="Code" slot-scope="text, record">
              <CodeInput code="Bus_OrderDetail_Code" v-model="record.Code" :para="{OrderCode:entity.Code}" size="small"></CodeInput>
            </template>
            <template slot="SkuId" slot-scope="text, record">
              <SkuSelect v-model="record.SkuId" :storer="entity.StorerId" @select="(val,sku)=>{handleSkuSelect(record,sku)}" size="small"></SkuSelect>
            </template>
            <template slot="QtyUom" slot-scope="text, record">
              <a-input-number v-model="record.QtyUom" @change="(val)=>{ record.Qty = val * record.UomCnt;record.TotalAmt = record.Qty * record.UnitPrice }" :min="0" style="width:100%" size="small" />
            </template>
            <template slot="UomCode" slot-scope="text, record">
              <SkuUomSelect v-model="record.UomCode" :sku="record.SkuId" @select="(val,uom)=>{handlerUomSelect(record,uom)}" style="width:100%" size="small"></SkuUomSelect>
            </template>
            <template slot="RotateBy" slot-scope="text, record">
              <EnumSelect code="Bas_Lot_Field" v-model="record.RotateBy" style="width:100%" size="small"></EnumSelect>
            </template>
            <template slot="RotateType" slot-scope="text, record">
              <EnumSelect code="Rotation" v-model="record.RotateType" style="width:100%" size="small"></EnumSelect>
            </template>
            <template slot="AllocStgId" slot-scope="text, record">
              <CommonSelect table="Stg_Allocate" v-model="record.AllocStgId" size="small"></CommonSelect>
            </template>
            <template slot="RackLife" slot-scope="text, record">
              <a-input-number v-model="record.RackLife" :min="0" style="width:100%" size="small" />
            </template>
            <template slot="LocId" slot-scope="text, record">
              <LocSelect v-model="record.LocId" size="small" allowClear></LocSelect>
            </template>
            <template slot="TrayId" slot-scope="text, record">
              <TraySelect v-model="record.TrayId" :type="record.Sku?record.Sku.TrayTypeId:''" size="small" allowClear></TraySelect>
            </template>
            <template slot="Lot01" slot-scope="text, record">
              <LotInput name="Lot01" :sku="record.Sku" v-model="record.Lot01" size="small"></LotInput>
            </template>
            <template slot="Lot02" slot-scope="text, record">
              <LotInput name="Lot02" :sku="record.Sku" v-model="record.Lot02" size="small"></LotInput>
            </template>
            <template slot="Lot03" slot-scope="text, record">
              <LotInput name="Lot03" :sku="record.Sku" v-model="record.Lot03" size="small"></LotInput>
            </template>
            <template slot="Lot04" slot-scope="text, record">
              <LotInput name="Lot04" :sku="record.Sku" v-model="record.Lot04" size="small"></LotInput>
            </template>
            <template slot="Lot05" slot-scope="text, record">
              <LotInput name="Lot05" :sku="record.Sku" v-model="record.Lot05" size="small"></LotInput>
            </template>
            <template slot="Lot06" slot-scope="text, record">
              <LotInput name="Lot06" :sku="record.Sku" v-model="record.Lot06" size="small"></LotInput>
            </template>
            <template slot="Lot07" slot-scope="text, record">
              <LotInput name="Lot07" :sku="record.Sku" v-model="record.Lot07" size="small"></LotInput>
            </template>
            <template slot="Lot08" slot-scope="text, record">
              <LotInput name="Lot08" :sku="record.Sku" v-model="record.Lot08" size="small"></LotInput>
            </template>
            <template slot="Lot09" slot-scope="text, record">
              <LotInput name="Lot09" :sku="record.Sku" v-model="record.Lot09" size="small"></LotInput>
            </template>
            <template slot="Lot10" slot-scope="text, record">
              <LotInput name="Lot10" :sku="record.Sku" v-model="record.Lot10" size="small"></LotInput>
            </template>
            <template slot="Remark" slot-scope="text, record">
              <a-input v-model="record.Remark" size="small" />
            </template>
            <template slot="action" slot-scope="text, record">
              <a v-action:Delete @click="handleDelete(record)">删除</a>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="PickDetail" tab="拣货明细"></a-tab-pane>
      </a-tabs>
    </a-spin>
    <div :style="{ position: 'absolute', bottom: 0, right: 0, width: '100%', borderTop: '1px solid #e9e9e9', padding: '10px 16px', background: '#fff', textAlign: 'right', zIndex: 1, }">
      <a-button :style="{ marginRight: '8px' }" type="primary" @click="handleAllocate">配货</a-button>
      <a-button :style="{ marginRight: '8px' }" type="primary" @click="handleAllocate">释放拣货任务</a-button>
      <a-button :style="{ marginRight: '8px' }" type="primary" @click="handleAllocate">拣货确认</a-button>
      <a-button :style="{ marginRight: '8px' }" type="primary" @click="handleAllocate">发货确认</a-button>
      <a-button :style="{ marginRight: '8px' }" type="primary" @click="handleSubmit">保存</a-button>
      <a-button :style="{ marginRight: '8px' }" @click="()=>{this.visible=false}">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'
import MainSvc from '@/api/Bus/Bus_OrderSvc'
import DetailSvc from '@/api/Bus/Bus_OrderDetailSvc'
import PickSvc from '@/api/Bus/Bus_PickDetailSvc'
import EnumSelect from '@/components/CF/EnumSelect'
import CodeInput from '@/components/CF/CodeInput'
import StorerSelect from '@/components/Bas/StorerSelect'
import TreeSelect from '@/components/CF/TreeSelect'
import CommonSelect from '@/components/CF/CommonSelect'
import LocSelect from '@/components/Bas/LocSelect'
import SkuSelect from '@/components/Bas/SkuSelect'
import SkuUomSelect from '@/components/Bas/SkuUomSelect'
import TraySelect from '@/components/Bas/TraySelect'
import LotInput from '@/components/Stg/LotInput'
export default {
  components: {
    PickSvc,
    CodeInput,
    EnumSelect,
    StorerSelect,
    TreeSelect,
    CommonSelect,
    LocSelect,
    SkuSelect,
    SkuUomSelect,
    TraySelect,
    LotInput
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
      orderDetailColumn: [
        { title: '编号', dataIndex: 'Code', width: 100, fixed: 'left', scopedSlots: { customRender: 'Code' } },
        { title: '物料', dataIndex: 'SkuId', width: 200, fixed: 'left', scopedSlots: { customRender: 'SkuId' } },
        { title: '订单数量', dataIndex: 'QtyUom', width: 80, fixed: 'left', scopedSlots: { customRender: 'QtyUom' } },
        { title: '单位', dataIndex: 'UomCode', width: 80, fixed: 'left', scopedSlots: { customRender: 'UomCode' } },
        { title: '物料数量', dataIndex: 'Qty', width: 80 },
        { title: '已分配', dataIndex: 'QtyAllocated', width: 80 },
        { title: '已拣货', dataIndex: 'QtyPicked', width: 80 },
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
      pickDetailColumn: []
    }
  },
  computed: {
    ...mapGetters({
      defaultWhseId: 'whseId',
      defaultStorerId: 'storerId'
    })
  },
  created() {
    this.getEnum({ whseId: this.defaultWhseId, code: 'Bas_Lot_Field' }).then(result => {
      this.enumItems = result.EnumItems
    })
  },
  methods: {
    moment,
    ...mapActions({ getConfig: 'getConfig', getEnum: 'getEnum' }),
    init() {
      this.loading = false
      this.visible = true
      this.isModify = false
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
        MainSvc.Get(id).then(resJson => {
          this.entity = resJson.Data
        })
      } else {
        this.getConfig({ whseId: this.defaultWhseId, code: 'Bus_Order_Code_AutoGenerate' }).then(result => {
          if (result.Val === '1') {
            this.$refs.codeInput.Generate()
          }
        })
      }
    },
    handlerTabsChange(key) {
      this.activeKey = key
    },
    cusHeaderTitle(column) {
      return this.enumItems?.find(w => w.Code === column)?.Name
    },
    handleAdd() {
      this.curDetailIndex += 1
      if (this.activeKey === 'OrderDetail') {
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
        } else {
          this.$message.error(result.Msg)
        }
      })
    }
  }
}
</script>
