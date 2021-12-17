<template>
  <a-drawer title="收货管理" placement="right" width="85%" :visible="visible" @close="()=>{this.visible=false}" :maskClosable="false" :body-style="{ paddingBottom: '40px' }">
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
          <a-col :span="6">
            <a-form-model-item label="关联单号" prop="RefCode">
              <a-input v-model="entity.RefCode"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="备注" prop="Remark">
              <a-input v-model="entity.Remark"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <template v-if="entity.Expand">
            <a-col :span="6" v-for="item in expand.EnumItems" :key="item.Code">
              <a-form-model-item :label="item.Name" :prop="item.Code">
                <ExpandInput v-model="entity.Expand[item.Code]" :enumitem="item" />
              </a-form-model-item>
            </a-col>
          </template>
        </a-row>
      </a-form-model>
      <div class="table-operator">
        <a-button type="primary" v-action:Add icon="plus" @click="handleAdd(null)">新建</a-button>
      </div>
      <a-table ref="table" size="small" rowKey="Id" :columns="columns" :data-source="receiptDetail" :pagination="false" :scroll="tableScroll">
        <div slot="filterDropdown" slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }" style="padding: 8px">
          <a-input :placeholder="`查询 ${column.title}`" :value="selectedKeys[0]" style="width: 188px; margin-bottom: 8px; display: block;" @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])" @pressEnter="confirm" />
          <a-button type="primary" icon="search" size="small" style="width: 90px; margin-right: 8px" @click="confirm">查询</a-button>
          <a-button size="small" style="width: 90px" @click="clearFilters">重置</a-button>
        </div>
        <a-icon slot="filterIcon" slot-scope="filtered" type="search" :style="{ color: filtered ? '#108ee9' : undefined }" />
        <span slot="LocId">仓位&nbsp;&nbsp;&nbsp;&nbsp;<a-button type="link" size="small" title="填充" @click="handleLocFilling()">
          <a-icon type="line-height" />
        </a-button></span>
        <span slot="Lot01">仓库&nbsp;&nbsp;&nbsp;&nbsp;<a-button type="link" size="small" title="填充" @click="handleLot01Filling()">
          <a-icon type="line-height" />
        </a-button></span>
        <span slot="Lot02">项目号&nbsp;&nbsp;&nbsp;&nbsp;<a-button type="link" size="small" title="填充" @click="handleLot02Filling()">
          <a-icon type="line-height" />
        </a-button></span>
        <span slot="Remark">备注&nbsp;&nbsp;&nbsp;&nbsp;<a-button type="link" size="small" title="填充" @click="handleRemarkFilling()">
          <a-icon type="line-height" />
        </a-button></span>
        <span slot="QtyUomReceived">已收数量<a-button type="link" size="small" title="填充" @click="handleQtyUomFilling()">
          <a-icon type="line-height" />
        </a-button></span>
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
          <LocSelect v-model="record.LocId" @select="(val,loc)=>{cacheFilling.LocId=val}" size="small" :disabled="!!record.LotId"></LocSelect>
        </template>
        <template slot="TrayId" slot-scope="text, record">
          <TraySelect v-model="record.TrayId" :type="record.Sku?record.Sku.TrayTypeId:''" size="small" allowClear :disabled="!!record.LotId"></TraySelect>
        </template>
        <template slot="Lot01" slot-scope="text, record">
          <LotInput name="Lot01" :sku="record.Sku" v-model="record.Lot01" @select="(val,lot01)=>{cacheFilling.Lot01=val}" :disabled="!!record.LotId" :search="{StorerId:entity.StorerId}" size="small"></LotInput>
        </template>
        <template slot="Lot02" slot-scope="text, record">
          <LotInput name="Lot02" :sku="record.Sku" v-model="record.Lot02" @select="(val,lot02)=>{cacheFilling.Lot02=val}" :disabled="!!record.LotId" :search="{StorerId:entity.StorerId}" size="small"></LotInput>
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
          <a-input v-model="record.Remark" @change="()=>{cacheFilling.Remark=record.Remark}" size="small" />
        </template>
        <span slot="action" slot-scope="text, record">
          <template>
            <a v-action:Add v-if="record.LotId && entity.Status!=='Closed'" @click="handleAdd(record)">复制</a>
            <a v-action:Delete v-if="!record.LotId" @click="handleDelete(record)">删除</a>
            <a-divider v-action:Adjust v-if="record.LotId && entity.Status!=='Closed'" type="vertical" />
            <a v-action:Adjust v-if="record.LotId && entity.Status!=='Closed'" @click="handleAdjust(record)">回转</a>
          </template>
        </span>
      </a-table>
    </a-spin>
    <div :style="{ position: 'absolute', bottom: 0, right: 0, width: '100%', borderTop: '1px solid #e9e9e9', padding: '10px 16px', background: '#fff', textAlign: 'right', zIndex: 1, }">
      <a-button v-action:Close :style="{ marginRight: '8px' }" type="primary" v-if="entity.Status==='Receiving' || entity.Status==='Completed'" @click="handleClose">收货结束</a-button>
      <a-button :style="{ marginRight: '8px' }" v-if="isModify" type="default" @click="handlePrint">打印收货单</a-button>
      <a-button v-if="canPutawayTask" v-action:Putaway :style="{ marginRight: '8px' }" type="default" @click="handlePutaway">生成上架任务</a-button>
      <a-button v-action:Update :style="{ marginRight: '8px' }" type="primary" v-if="entity.Status!=='Closed'" @click="handleSubmit">保存</a-button>
      <a-button :style="{ marginRight: '8px' }" @click="()=>{this.visible=false}">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import moment from 'moment'
import print from 'print-js'
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
import ExpandInput from '@/components/CF/ExpandInput'
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
    LotInput,
    ExpandInput
  },
  props: {},
  data() {
    return {
      title: '新建',
      tableScroll: { x: 1830, y: document.body.clientHeight - 337 },
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
      expand: {},
      columns: [
        { title: '编号', dataIndex: 'Code', width: 80, fixed: 'left', scopedSlots: { customRender: 'Code' }, defaultSortOrder: 'ascend', sorter: (a, b) => parseInt(a.Code) - parseInt(b.Code) },
        { title: '物料', dataIndex: 'SkuId', width: 120, fixed: 'left', scopedSlots: { customRender: 'SkuId' } },
        { title: '预期数量', dataIndex: 'QtyUomExpected', width: 80, fixed: 'left', scopedSlots: { customRender: 'QtyUomExpected' } },
        { title: '单位', dataIndex: 'UomCode', width: 100, fixed: 'left', scopedSlots: { customRender: 'UomCode' } },
        { title: '物料编码', dataIndex: 'Sku.Code', width: 150, scopedSlots: { filterDropdown: 'filterDropdown', filterIcon: 'filterIcon' }, onFilter: (value, record) => record.Sku.Code.toString().includes(value) },
        { title: '物料名称', dataIndex: 'Sku.Name', scopedSlots: { filterDropdown: 'filterDropdown', filterIcon: 'filterIcon' }, onFilter: (value, record) => record.Sku.Name.toString().includes(value) },
        { title: '物料规格', dataIndex: 'Sku.Spec', scopedSlots: { filterDropdown: 'filterDropdown', filterIcon: 'filterIcon' }, onFilter: (value, record) => record.Sku.Spec.toString().includes(value) },
        { dataIndex: 'QtyUomReceived', slots: { title: 'QtyUomReceived' }, width: 110, scopedSlots: { customRender: 'QtyUomReceived' } },
        { dataIndex: 'Lot01', slots: { title: 'Lot01' }, width: 120, scopedSlots: { customRender: 'Lot01' } },
        { dataIndex: 'LocId', slots: { title: 'LocId' }, width: 150, scopedSlots: { customRender: 'LocId' } },
        { dataIndex: 'Remark', slots: { title: 'Remark' }, width: 150, scopedSlots: { customRender: 'Remark' } },
        { dataIndex: 'Lot02', slots: { title: 'Lot02' }, width: 150, scopedSlots: { customRender: 'Lot02' } },
        { title: () => { return this.cusHeaderTitle('Lot03') }, dataIndex: 'Lot03', width: 150, scopedSlots: { customRender: 'Lot03' } },
        // { title: () => { return this.cusHeaderTitle('Lot04') }, dataIndex: 'Lot04', width: 150, scopedSlots: { customRender: 'Lot04' } },
        // { title: () => { return this.cusHeaderTitle('Lot05') }, dataIndex: 'Lot05', width: 150, scopedSlots: { customRender: 'Lot05' } },
        // { title: () => { return this.cusHeaderTitle('Lot06') }, dataIndex: 'Lot06', width: 150, scopedSlots: { customRender: 'Lot06' } },
        // { title: () => { return this.cusHeaderTitle('Lot07') }, dataIndex: 'Lot07', width: 150, scopedSlots: { customRender: 'Lot07' } },
        // { title: () => { return this.cusHeaderTitle('Lot08') }, dataIndex: 'Lot08', width: 150, scopedSlots: { customRender: 'Lot08' } },
        // { title: () => { return this.cusHeaderTitle('Lot09') }, dataIndex: 'Lot09', width: 150, scopedSlots: { customRender: 'Lot09' } },
        // { title: () => { return this.cusHeaderTitle('Lot10') }, dataIndex: 'Lot10', width: 150, scopedSlots: { customRender: 'Lot10' } },
        // { title: '托盘', dataIndex: 'TrayId', width: 120, scopedSlots: { customRender: 'TrayId' } },
        { title: '操作', dataIndex: 'action', width: 100, fixed: 'right', scopedSlots: { customRender: 'action' } }
      ],
      curDetailIndex: 0,
      defaultLocId: '', // 默认收货库位
      defaultProductDateLot: 'Lot01', // 默认的生产日期的批次字段
      isModify: false, // 是否编辑
      cacheFilling: { LocId: null, Lot01: null, Lot02: null, Remark: null }
    }
  },
  computed: {
    ...mapGetters({
      defaultWhseId: 'whseId',
      defaultStorerId: 'storerId',
      lotStgList: 'lotStgs'
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
    this.getConfig({ whseId: this.defaultWhseId, code: 'Stg_Lot_ProductionDate_Default' }).then(result => {
      this.defaultProductDateLot = result.Val
    })
    this.getEnum({ whseId: this.defaultWhseId, code: 'Bus_Receipt_Expand' }).then(result => {
      this.expand = result
    })
  },
  methods: {
    moment,
    ...mapActions({ getConfig: 'getConfig', getEnum: 'getEnum', getLotStg: 'getLotStg' }),
    init() {
      this.loading = false
      this.visible = true
      this.isModify = false
      this.entity = {
        ReceiptDetail: [], Id: '', WhseId: this.defaultWhseId, StorerId: this.defaultStorerId, Code: '', RefCode: '', RecType: 'Standard',
        DocDate: moment().format('YYYY-MM-DD'), RecDate: moment().format('YYYY-MM-DD'), SupplierId: '', Remark: '', Status: 'Active',
        Expand: {
          ExpStr1: undefined, ExpStr2: undefined, ExpStr3: undefined, ExpStr4: undefined, ExpStr5: undefined, ExpStr6: undefined,
          ExpEnum1: undefined, ExpEnum2: undefined, ExpEnum3: undefined, ExpEnum4: undefined, ExpEnum5: undefined, ExpEnum6: undefined,
          ExpInt1: undefined, ExpInt2: undefined, ExpInt3: undefined, ExpInt4: undefined, ExpInt5: undefined, ExpInt6: undefined,
          ExpNum1: undefined, ExpNum2: undefined, ExpNum3: undefined, ExpNum4: undefined, ExpNum5: undefined, ExpNum6: undefined,
          ExpDate1: undefined, ExpDate2: undefined, ExpDate3: undefined, ExpDate4: undefined, ExpDate5: undefined, ExpDate6: undefined
        }
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
            // if (detail.Status === 'Active') {
            //   detail.QtyUomReceived = detail.QtyUomExpected
            // }
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
    handlePrint() {
      MainSvc.Print(this.entity.Id).then(result => {
        if (result.Success) {
          var filePath = `${process.env.VUE_APP_API_BASE_URL}${result.Data}`
          print(filePath)
        } else {
          this.$message.error(result.Msg)
        }
      })
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
      record.UomCode = sku.BaseUom
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
      if (record.Sku && record.Sku.LotStgId) {
        this.getLotStg(record.Sku.LotStgId).then(lotStg => {
          for (const key in lotStg) {
            if (key.endsWith('Type') && lotStg[key] === 'Quote') {
              // (引用)
              const lotName = key.replace('Type', '')
              const quoteName = lotStg[`${lotName}Enum`]
              const colVal = quoteName.startsWith('Expand.') ? this.entity.Expand[quoteName.replace('Expand.', '')] : this.entity[quoteName]
              record[lotName] = colVal
            } else if (key.endsWith('Type') && lotStg[key] === 'CalcExpiry') {
              // (计算到期)
              const lotName = key.replace('Type', '')
              // const calcName = record.Sku.LotStg[`${lotName}Enum`]
              const sourceVal = record[this.defaultProductDateLot]
              if (!sourceVal) continue
              const calcVal = moment(sourceVal).add(record.Sku.ShelfLife, 'days').format('YYYY-MM-DD')
              record[lotName] = calcVal
            }
            // 处理默认值
            if (key.endsWith('Default') && lotStg[key]) {
              const lotName = key.replace('Default', '')
              if (!record[lotName]) {
                let defaultVal = lotStg[key]
                switch (defaultVal) {
                  case '$Date$': defaultVal = moment().format('YYYY-MM-DD'); break
                  default: break
                }
                record[lotName] = defaultVal
              }
            }
          }
        })
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
          if (!detail.Code) validMsg.push(`收货明细“编号”必需输入`)
          if (!detail.SkuId) validMsg.push(`收货明细${detail.Code}中“物料”必需选择`)
          if (!detail.Lot01) validMsg.push(`收货明细${detail.Lot01}中“所属仓库”必需选择`)
          if (detail.LocId === 'WH1_Stage') validMsg.push(`收货明细${detail.Code}中“库位”输入错误,重新选择!`)
          if (detail.QtyUomExpected === 0 && detail.QtyUomReceived === 0) validMsg.push(`收货明细${detail.Code}中 预期数量 和 已收数量 都为0`)
          if (detail.QtyUomReceived > 0) { // 只有真实的收货的时候，才验证批次属性
            const lotStg = this.lotStgList.find(v => v.Id === detail.Sku.LotStgId)
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
    },
    handleClose() {
      var thisObj = this
      var id = this.entity.Id
      this.$confirm({
        title: '确认结束此收货单吗?',
        onOk() {
          return new Promise((resolve, reject) => {
            MainSvc.Close(id).then(result => {
              resolve()
              if (result.Success) {
                thisObj.visible = false
                thisObj.$message.success('操作成功!')
                thisObj.$emit('Success')
              } else {
                thisObj.$message.error(result.Msg)
              }
            })
          })
        }
      })
    },
    handleLocFilling() {
      if (this.cacheFilling.LocId) {
        this.entity.ReceiptDetail.forEach(detail => {
          console.log(detail.LocId)
          detail.LocId = this.cacheFilling.LocId
        })
      }
    },
    handleLot01Filling() {
      if (this.cacheFilling.Lot01) {
        this.entity.ReceiptDetail.forEach(detail => {
          console.log(detail.Lot01)
          detail.Lot01 = this.cacheFilling.Lot01
        })
      }
    },
    handleLot02Filling() {
      if (this.cacheFilling.Lot02) {
        this.entity.ReceiptDetail.forEach(detail => {
          console.log(detail.Lot02)
          detail.Lot02 = this.cacheFilling.Lot02
        })
      }
    },
    handleQtyUomFilling() {
      this.entity.ReceiptDetail.forEach(detail => {
        detail.QtyUomReceived = detail.QtyUomExpected
      })
    },
    handleRemarkFilling() {
      if (this.cacheFilling.Remark) {
        this.entity.ReceiptDetail.forEach(detail => {
          console.log(detail.Remark)
          detail.Remark = this.cacheFilling.Remark
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-form-item {
  margin-bottom: 0;
}
/deep/ .ant-drawer-body {
  padding: 12px;
}
/deep/ .table-operator {
  margin-bottom: 4px;
}
</style>
