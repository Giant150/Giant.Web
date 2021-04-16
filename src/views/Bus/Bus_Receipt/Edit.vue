<template>
  <a-drawer title="收货管理" placement="right" width="60%" :visible="visible" @close="()=>{this.visible=false}">
    <a-spin :spinning="loading">
      <a-form-model ref="form" :model="entity" :rules="rules" v-bind="layout">
        <a-row>
          <a-col :span="6">
            <a-form-model-item label="货主" prop="StorerId">
              <StorerSelect v-model="entity.StorerId" :type="['Storer']"></StorerSelect>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="编码" prop="Code">
              <CodeInput ref="codeInput" code="Bus_Receipt_Code" v-model="entity.Code" :para="{}"></CodeInput>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="收货类型" prop="RecType">
              <EnumSelect code="Bus_Receipt_RecType" v-model="entity.RecType"></EnumSelect>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="供应商" prop="StorerId">
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
        <a-button type="primary" v-action:Add icon="plus" @click="handleAdd">新建</a-button>
      </div>
      <a-table :columns="columns" :data-source="entity.ReceiptDetail" :scroll="{ x: 2500 }">
        <template slot="Code" slot-scope="text, record">
          <a-input v-model="record.Code" />
        </template>
        <template slot="SkuId" slot-scope="text, record">
          <SkuSelect v-model="record.SkuId" :storer="record.StorerId"></SkuSelect>
        </template>
        <template slot="QtyUomExpected" slot-scope="text, record">
          <a-input-number v-model="record.QtyUomExpected" style="width:100%" />
        </template>
        <template slot="UomCode" slot-scope="text, record">
          <SkuUomSelect v-model="record.UomCode" :sku="record.SkuId" style="width:100%"></SkuUomSelect>
        </template>
        <template slot="QtyUomReceived" slot-scope="text, record">
          <a-input-number v-model="record.QtyUomReceived" style="width:100%" />
        </template>
        <template slot="LocId" slot-scope="text, record">
          <LocSelect v-model="record.LocId"></LocSelect>
        </template>
        <template slot="TrayId" slot-scope="text, record">
          <TraySelect v-model="record.TrayId"></TraySelect>
        </template>
        <span slot="action" slot-scope="text, record">
          <template>
            <a v-action:Update @click="handleEdit(record)">修改</a>
            <a-divider v-action:Delete type="vertical" />
            <a v-action:Delete @click="handleDelete([record])">删除</a>
          </template>
        </span>
      </a-table>
    </a-spin>
  </a-drawer>
</template>

<script>
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'
import MainSvc from '@/api/Bus/Bus_ReceiptSvc'
import EnumSelect from '@/components/CF/EnumSelect'
import CodeInput from '@/components/CF/CodeInput'
import StorerSelect from '@/components/Bas/StorerSelect'
import TreeSelect from '@/components/CF/TreeSelect'
import CommonSelect from '@/components/CF/CommonSelect'
import LocSelect from '@/components/Bas/LocSelect'
import SkuSelect from '@/components/Bas/SkuSelect'
import SkuUomSelect from '@/components/Bas/SkuUomSelect'
import TraySelect from '@/components/Bas/TraySelect'

const columns = [
  { title: '编号', dataIndex: 'Code', width: 120, fixed: 'left', scopedSlots: { customRender: 'Code' } },
  { title: '物料', dataIndex: 'SkuId', width: 120, fixed: 'left', scopedSlots: { customRender: 'SkuId' } },
  { title: '预期数量', dataIndex: 'QtyUomExpected', width: 120, fixed: 'left', scopedSlots: { customRender: 'QtyUomExpected' } },
  { title: '单位', dataIndex: 'UomCode', width: 120, fixed: 'left', scopedSlots: { customRender: 'UomCode' } },
  { title: '已收数量', dataIndex: 'QtyUomReceived', scopedSlots: { customRender: 'QtyUomReceived' } },
  { title: '库位', dataIndex: 'LocId', width: 120, scopedSlots: { customRender: 'LocId' } },
  { title: '托盘', dataIndex: 'TrayId', width: 120, scopedSlots: { customRender: 'TrayId' } },
  { title: '操作', dataIndex: 'action', width: 150, fixed: 'right', scopedSlots: { customRender: 'action' } }
]

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
    TraySelect
  },
  props: {},
  data() {
    return {
      title: '新建',
      layout: { labelCol: { xs: { span: 24 }, sm: { span: 6 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 14 } } },
      rules: {
        Name: [{ required: true, message: '必填' }],
        Code: [{ required: true, message: '必填' }]
      },
      visible: false,
      loading: false,
      entity: {},
      columns,
      curDetailIndex: 0
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
      var enumItems = result.EnumItems
      var lotColumns = []
      var fileds = ['Lot01', 'Lot02', 'Lot03', 'Lot04', 'Lot05', 'Lot06', 'Lot07', 'Lot08', 'Lot09', 'Lot10']
      fileds.forEach(element => {
        var oneEnum = enumItems.find(w => w.Code === element)
        lotColumns.push({ title: oneEnum.Name, dataIndex: oneEnum.Code })
      })
      this.columns.splice(7, 0, ...lotColumns)
    })
  },
  methods: {
    moment,
    ...mapActions({ getConfig: 'getConfig', getEnum: 'getEnum' }),
    init() {
      this.loading = false
      this.visible = true
      this.entity = { ReceiptDetail: [], Id: '', WhseId: this.defaultWhseId, StorerId: this.defaultStorerId, Code: '', RecType: 'Standard', DocDate: moment(), RecDate: moment(), SupplierId: '', Remark: '', Status: 'Active' }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    openForm(id, title) {
      this.init()
      if (id) {
        MainSvc.Get(id).then(resJson => {
          this.entity = resJson.Data
        })
      }
    },
    handleAdd() {
      this.curDetailIndex += 1
      var detail = {
        Id: `new_${this.curDetailIndex}`, WhseId: this.defaultWhseId, StorerId: this.entity.StorerId, ReceiptId: this.entity.Id, Code: '', SkuId: '', QtyUomExpected: 0, UomCode: '',
        QtyExpected: 0, QtyUomReceived: 0, QtyReceived: 0, LocId: '', TrayId: '', LotId: '',
        Lot01: '', Lot02: '', Lot03: '', Lot04: '', Lot05: '', Lot06: '', Lot07: '', Lot08: '', Lot09: '', Lot10: '',
        ReceiptDate: moment(), SkuUomId: '', UomCnt: 0, UnitPrice: 0, TotalAmt: 0, Remark: '', Status: ''
      }
      this.entity.ReceiptDetail.push(detail)
    },
    handleSubmit() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        this.loading = true
        MainSvc.Save(this.entity).then(result => {
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
    }
  }
}
</script>
