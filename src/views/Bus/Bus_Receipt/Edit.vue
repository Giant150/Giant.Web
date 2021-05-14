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
              <CodeInput ref="codeInput" code="Bus_Receipt_Code" v-model="entity.Code" :para="{}" :disabled="isModify"></CodeInput>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="收货类型" prop="RecType">
              <EnumSelect code="Bus_Receipt_RecType" v-model="entity.RecType"></EnumSelect>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="供应商" prop="SupplierId">
              <StorerSelect v-model="entity.SupplierId" :type="['Supplier']"></StorerSelect>
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
            <a-form-model-item label="收货日期" prop="RecDate">
              <a-date-picker v-model="entity.RecDate" valueFormat="YYYY-MM-DD"></a-date-picker>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="备注" prop="Remark" :labelCol="{ xs: { span: 24 }, sm: { span: 3 } }" :wrapperCol="{ xs: { span: 24 }, sm: { span: 19 } }">
              <a-input v-model="entity.Remark"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <div class="table-operator">
        <a-button type="primary" v-action:Add icon="plus" @click="handleAdd(null)">新建</a-button>
      </div>
      <a-table ref="table" size="small" rowKey="Id" :columns="columns" :data-source="receiptDetail" :pagination="false" :scroll="{ x: 3000 }">
        <template slot="Code" slot-scope="text, record">
          <CodeInput code="Bus_ReceiptDetail_Code" v-model="record.Code" :para="{ReceiptCode:entity.Code}" size="small" :disabled="!!record.LotId"></CodeInput>
        </template>
        <template slot="SkuId" slot-scope="text, record">
          <SkuSelect v-model="record.SkuId" :storer="entity.StorerId" @select="(val,sku)=>{handleSkuSelect(record,sku)}" size="small" :disabled="!!record.LotId"></SkuSelect>
        </template>
        <template slot="QtyUomExpected" slot-scope="text, record">
          <a-input-number v-model="record.QtyUomExpected" :min="0" :disabled="!!record.LotId" style="width:100%" size="small" />
        </template>
        <template slot="UomCode" slot-scope="text, record">
          <SkuUomSelect v-model="record.UomCode" :sku="record.SkuId" @select="(val,uom)=>{handlerUomSelect(record,uom)}" :disabled="!!record.LotId" style="width:100%" size="small"></SkuUomSelect>
        </template>
        <template slot="QtyUomReceived" slot-scope="text, record">
          <a-input-number v-model="record.QtyUomReceived" :min="record.QtyUomReceivedMin" :disabled="!!record.LotId" style="width:100%" size="small" />
        </template>
        <template slot="LocId" slot-scope="text, record">
          <LocSelect v-model="record.LocId" size="small" :disabled="!!record.LotId"></LocSelect>
        </template>
        <template slot="TrayId" slot-scope="text, record">
          <TraySelect v-model="record.TrayId" :type="record.Sku?record.Sku.TrayTypeId:''" size="small" allowClear :disabled="!!record.LotId"></TraySelect>
        </template>
        <template slot="Lot01" slot-scope="text, record">
          <LotInput name="Lot01" :sku="record.Sku" v-model="record.Lot01" :disabled="!!record.LotId" size="small"></LotInput>
        </template>
        <template slot="Lot02" slot-scope="text, record">
          <LotInput name="Lot02" :sku="record.Sku" v-model="record.Lot02" :disabled="!!record.LotId" size="small"></LotInput>
        </template>
        <template slot="Lot03" slot-scope="text, record">
          <LotInput name="Lot03" :sku="record.Sku" v-model="record.Lot03" :disabled="!!record.LotId" size="small"></LotInput>
        </template>
        <template slot="Lot04" slot-scope="text, record">
          <LotInput name="Lot04" :sku="record.Sku" v-model="record.Lot04" :disabled="!!record.LotId" size="small"></LotInput>
        </template>
        <template slot="Lot05" slot-scope="text, record">
          <LotInput name="Lot05" :sku="record.Sku" v-model="record.Lot05" :disabled="!!record.LotId" size="small"></LotInput>
        </template>
        <template slot="Lot06" slot-scope="text, record">
          <LotInput name="Lot06" :sku="record.Sku" v-model="record.Lot06" :disabled="!!record.LotId" size="small"></LotInput>
        </template>
        <template slot="Lot07" slot-scope="text, record">
          <LotInput name="Lot07" :sku="record.Sku" v-model="record.Lot07" :disabled="!!record.LotId" size="small"></LotInput>
        </template>
        <template slot="Lot08" slot-scope="text, record">
          <LotInput name="Lot08" :sku="record.Sku" v-model="record.Lot08" :disabled="!!record.LotId" size="small"></LotInput>
        </template>
        <template slot="Lot09" slot-scope="text, record">
          <LotInput name="Lot09" :sku="record.Sku" v-model="record.Lot09" :disabled="!!record.LotId" size="small"></LotInput>
        </template>
        <template slot="Lot10" slot-scope="text, record">
          <LotInput name="Lot10" :sku="record.Sku" v-model="record.Lot10" :disabled="!!record.LotId" size="small"></LotInput>
        </template>
        <template slot="Remark" slot-scope="text, record">
          <a-input v-model="record.Remark" size="small" />
        </template>
        <span slot="action" slot-scope="text, record">
          <template>
            <a v-action:Add v-if="record.LotId" @click="handleAdd(record)">复制</a>
            <a v-action:Delete v-if="!record.LotId" @click="handleDelete(record)">删除</a>
            <a-divider v-action:Adjust v-if="record.LotId" type="vertical" />
            <a v-action:Adjust v-if="record.LotId" @click="handleAdjust(record)">回转</a>
          </template>
        </span>
      </a-table>
    </a-spin>
    <div :style="{ position: 'absolute', bottom: 0, right: 0, width: '100%', borderTop: '1px solid #e9e9e9', padding: '10px 16px', background: '#fff', textAlign: 'right', zIndex: 1, }">
      <a-button v-if="canPutawayTask" v-action:Putaway :style="{ marginRight: '8px' }" type="default" @click="handlePutaway">生成上架任务</a-button>
      <a-button v-action:Update :style="{ marginRight: '8px' }" type="primary" @click="handleSubmit">保存</a-button>
      <a-button :style="{ marginRight: '8px' }" @click="()=>{this.visible=false}">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'
import MainSvc from '@/api/Bus/Bus_ReceiptSvc'
import DetailSvc from '@/api/Bus/Bus_ReceiptDetailSvc'
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
    MainSvc,
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
        RecType: [{ required: true, message: '必填' }],
        Code: [{ required: true, message: '必填' }],
        DocDate: [{ required: true, message: '必填' }],
        RecDate: [{ required: true, message: '必填' }]
      },
      visible: false,
      loading: false,
      enumItems: [],
      entity: {},
      columns: [
        { title: '编号', dataIndex: 'Code', width: 120, fixed: 'left', scopedSlots: { customRender: 'Code' } },
        { title: '物料', dataIndex: 'SkuId', width: 150, fixed: 'left', scopedSlots: { customRender: 'SkuId' } },
        { title: '预期数量', dataIndex: 'QtyUomExpected', width: 120, fixed: 'left', scopedSlots: { customRender: 'QtyUomExpected' } },
        { title: '单位', dataIndex: 'UomCode', width: 120, fixed: 'left', scopedSlots: { customRender: 'UomCode' } },
        { title: '已收数量', dataIndex: 'QtyUomReceived', width: 120, scopedSlots: { customRender: 'QtyUomReceived' } },
        { title: '库位', dataIndex: 'LocId', width: 120, scopedSlots: { customRender: 'LocId' } },
        { title: '托盘', dataIndex: 'TrayId', width: 120, scopedSlots: { customRender: 'TrayId' } },
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
      curDetailIndex: 0,
      defaultLocId: '', // 默认收货库位
      isModify: false // 是否编辑
    }
  },
  computed: {
    ...mapGetters({
      defaultWhseId: 'whseId',
      defaultStorerId: 'storerId'
    }),
    receiptDetail() {
      return this.entity.ReceiptDetail
    },
    canPutawayTask() {
      return this.entity?.ReceiptDetail?.find(w => w.LotId && !w.HasTask)
    }
  },
  watch: {
    receiptDetail: {
      handler: function (newval, oldval) {
        this.entity.ReceiptDetail.forEach(element => {
          this.handlerDetailChange(element)
        })
      },
      deep: true
    }
  },
  created() {
    this.getEnum({ whseId: this.defaultWhseId, code: 'Bas_Lot_Field' }).then(result => {
      this.enumItems = result.EnumItems
    })
    this.getConfig({ whseId: this.defaultWhseId, code: 'Bus_ReceiptDetail_LocId_Default' }).then(result => {
      this.defaultLocId = result.Val
    })
  },
  methods: {
    moment,
    ...mapActions({ getConfig: 'getConfig', getEnum: 'getEnum' }),
    init() {
      this.loading = false
      this.visible = true
      this.isModify = false
      this.entity = {
        ReceiptDetail: [], Id: '', WhseId: this.defaultWhseId, StorerId: this.defaultStorerId, Code: '', RecType: 'Standard',
        DocDate: moment().format('YYYY-MM-DD'), RecDate: moment().format('YYYY-MM-DD'), SupplierId: '', Remark: '', Status: 'Active'
      }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    openForm(id, title) {
      this.init()
      if (id) {
        this.isModify = true
        MainSvc.Get(id).then(resJson => {
          const tempData = resJson.Data
          tempData.ReceiptDetail.forEach(detail => {
            detail.QtyUomReceivedMin = detail.QtyUomReceived
          })
          this.entity = tempData
        })
      } else {
        this.getConfig({ whseId: this.defaultWhseId, code: 'Bus_Receipt_Code_AutoGenerate' }).then(result => {
          if (result.Val === '1') {
            this.$refs.codeInput.Generate()
          }
        })
      }
    },
    handleAdd(record) {
      this.curDetailIndex += 1
      var detail = {
        Id: `new_${this.curDetailIndex}`, WhseId: this.defaultWhseId, StorerId: this.entity.StorerId, ReceiptId: this.entity.Id, Code: '', SkuId: '', QtyUomExpected: 0, UomCode: '',
        QtyExpected: 0, QtyUomReceived: 0, QtyUomReceivedMin: 0, QtyReceived: 0, LocId: this.defaultLocId, TrayId: '', LotId: null,
        Lot01: '', Lot02: '', Lot03: '', Lot04: '', Lot05: '', Lot06: '', Lot07: '', Lot08: '', Lot09: '', Lot10: '',
        ReceiptDate: moment().format('YYYY-MM-DD'), SkuUomId: '', UomCnt: 0, UnitPrice: 0, TotalAmt: 0, Remark: '', Status: 'Active', HasTask: false,
        Sku: null
      }
      if (record) {
        var copyObj = {
          SkuId: record.SkuId, UomCode: record.UomCode, LocId: record.LocId, TrayId: record.TrayId,
          Lot01: record.Lot01, Lot02: record.Lot02, Lot03: record.Lot03, Lot04: record.Lot04, Lot05: record.Lot05,
          Lot06: record.Lot06, Lot07: record.Lot07, Lot08: record.Lot08, Lot09: record.Lot09, Lot10: record.Lot10,
          SkuUomId: record.SkuUomId, UomCnt: record.UomCnt, UnitPrice: record.UnitPrice,
          Sku: record.Sku
        }
        detail = Object.assign(detail, copyObj)
      }
      this.entity.ReceiptDetail.push(detail)
    },
    handleDelete(record) {
      var index = this.entity.ReceiptDetail.indexOf(record)
      this.entity.ReceiptDetail.splice(index, 1)
    },
    handleAdjust(record) {
      var thisObj = this
      var id = record.Id
      this.$confirm({
        title: '确认要进行收货回转?',
        onOk() {
          return new Promise((resolve, reject) => {
            DetailSvc.Adjustment(id).then(result => {
              resolve()
              if (result.Success) {
                thisObj.visible = false
                thisObj.$message.success('操作成功!')
              } else {
                thisObj.$message.error(result.Msg)
              }
            })
          })
        }
      })
    },
    cusHeaderTitle(column) {
      return this.enumItems?.find(w => w.Code === column)?.Name
    },
    handleSkuSelect(record, sku) {
      record.Sku = sku
      record.UnitPrice = sku.Price
    },
    handlerUomSelect(record, uom) {
      record.SkuUomId = uom.Id
      record.UomCnt = uom.UomCnt
    },
    handlerDetailChange(record) {
      // 数量/总价处理
      record.QtyExpected = record.QtyUomExpected * record.UomCnt
      record.QtyReceived = record.QtyUomReceived * record.UomCnt
      record.TotalAmt = record.QtyReceived * record.UnitPrice
      // 批属性处理
      if (record.Sku && record.Sku.LotStg) {
        for (const key in record.Sku.LotStg) {
          if (key.endsWith('Type') && record.Sku.LotStg[key] === 'Quote') {
            // (引用)
            const lotName = key.replace('Type', '')
            const quoteName = record.Sku.LotStg[`${lotName}Enum`]
            const colVal = this.entity[quoteName]
            record[lotName] = colVal
          } else if (key.endsWith('Type') && record.Sku.LotStg[key] === 'CalcExpiry') {
            // (计算到期)
            const lotName = key.replace('Type', '')
            const calcName = record.Sku.LotStg[`${lotName}Enum`]
            const sourceVal = record[calcName]
            if (!sourceVal) continue
            const calcVal = moment(sourceVal).add(record.Sku.ShelfLife, 'days').format('YYYY-MM-DD')
            record[lotName] = calcVal
          }
        }
      }
      // 批属性处理(计算)
    },
    handleSubmit() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          this.$message.error('数据验证失败')
          return
        }
        const list = this.entity.ReceiptDetail.map(detail => Object.assign({}, detail))
        const validMsg = []
        list.forEach(detail => {
          if (!detail.Code) validMsg.push(`收货明细编号必需输入`)
          if (!detail.SkuId) validMsg.push(`收货明细${detail.Code}中物料必需选择`)
          if (detail.QtyUomExpected === 0 && detail.QtyUomReceived === 0) validMsg.push(`收货明细${detail.Code}中 预期数量 和 已收数量 都为0`)
          const lotStg = Object.assign({}, detail?.Sku?.LotStg)
          // 批属性验证(必需)
          for (const key in lotStg) {
            if (key.endsWith('Required') && !key.endsWith('RFRequired') && lotStg[key]) {
              const lotName = key.replace('Required', '')
              const colVal = detail[lotName]
              if (!colVal) {
                validMsg.push(`收货明细${detail.Code}中${lotName}为必需`)
              }
            }
          }
          detail.Sku = null
          if (!detail.TrayId) detail.TrayId = null // 如果没有托盘
        })
        if (validMsg.length > 0) {
          this.$message.error((h) => { return (<a-list size="small" split={false}>{validMsg.map(m => { return (<a-list-item>{m}</a-list-item>) })}</a-list>) })
          return
        }
        const postData = Object.assign({}, this.entity)
        postData.ReceiptDetail = list
        if (!postData.SupplierId) postData.SupplierId = null // 如果没有供应商/客户
        console.log('handleSubmit', postData)
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
    handlePutaway() {
      var thisObj = this
      var id = this.entity.Id
      this.$confirm({
        title: '确认生成上架任务吗?',
        onOk() {
          return new Promise((resolve, reject) => {
            MainSvc.PutawayTask(id).then(result => {
              resolve()
              if (result.Success) {
                thisObj.visible = false
                thisObj.$message.success('操作成功!')
                thisObj.$router.push({ path: '/Inv/Inv_Task', query: { RefTable: 'Bus_Receipt', RefId: thisObj.entity.Id } })
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
