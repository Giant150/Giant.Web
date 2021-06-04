<template>
  <a-modal :title="title" width="60%" :visible="visible" :confirmLoading="loading" @ok="handleSubmit" @cancel="()=>{this.visible=false}">
    <a-spin :spinning="loading">
      <a-form-model ref="form" :model="entity" :rules="rules" v-bind="layout">
        <a-descriptions title="库存信息" :column="3">
          <a-descriptions-item label="货主编号">{{ inventory.Storer.Code }}</a-descriptions-item>
          <a-descriptions-item label="货主名称">{{ inventory.Storer.Name }}</a-descriptions-item>
          <a-descriptions-item label="库位">{{ inventory.Loc.Code }}</a-descriptions-item>
          <a-descriptions-item label="物料编号">{{ inventory.Sku.Code }}</a-descriptions-item>
          <a-descriptions-item label="物料名称">{{ inventory.Sku.Name }}</a-descriptions-item>
          <a-descriptions-item label="托盘">{{ inventory.Tray?inventory.Tray.Code:'' }}</a-descriptions-item>
          <a-descriptions-item label="数量">{{ inventory.Qty }}</a-descriptions-item>
          <a-descriptions-item label="可用数量">{{ qtyUse }}</a-descriptions-item>
          <a-descriptions-item :label="cusHeaderTitle('Lot01')">{{ inventory.Lot.Lot01 }}</a-descriptions-item>
          <a-descriptions-item :label="cusHeaderTitle('Lot02')">{{ inventory.Lot.Lot02 }}</a-descriptions-item>
          <a-descriptions-item :label="cusHeaderTitle('Lot03')">{{ inventory.Lot.Lot03 }}</a-descriptions-item>
          <a-descriptions-item :label="cusHeaderTitle('Lot04')">{{ inventory.Lot.Lot04 }}</a-descriptions-item>
          <a-descriptions-item :label="cusHeaderTitle('Lot05')">{{ inventory.Lot.Lot05 }}</a-descriptions-item>
          <a-descriptions-item :label="cusHeaderTitle('Lot06')">{{ inventory.Lot.Lot06 }}</a-descriptions-item>
          <a-descriptions-item :label="cusHeaderTitle('Lot07')">{{ inventory.Lot.Lot07 }}</a-descriptions-item>
          <a-descriptions-item :label="cusHeaderTitle('Lot08')">{{ inventory.Lot.Lot08 }}</a-descriptions-item>
          <a-descriptions-item :label="cusHeaderTitle('Lot09')">{{ inventory.Lot.Lot09 }}</a-descriptions-item>
          <a-descriptions-item :label="cusHeaderTitle('Lot10')">{{ inventory.Lot.Lot10 }}</a-descriptions-item>
        </a-descriptions>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="至库位" prop="ToLocId">
              <LocSelect v-model="entity.ToLocId"></LocSelect>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="至托盘" prop="ToTrayId">
              <TraySelect v-model="entity.ToTrayId"></TraySelect>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="移动数量" prop="Qty">
              <a-input-number v-model="entity.Qty" :min="0" :max="qtyUse" style="width:100%" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MainSvc from '@/api/Inv/Inv_InventorySvc'
import EnumSelect from '@/components/CF/EnumSelect'
import CodeInput from '@/components/CF/CodeInput'
import StorerSelect from '@/components/Bas/StorerSelect'
import TreeSelect from '@/components/CF/TreeSelect'
import CommonSelect from '@/components/CF/CommonSelect'
import LocSelect from '@/components/Bas/LocSelect'
import SkuSelect from '@/components/Bas/SkuSelect'
import TraySelect from '@/components/Bas/TraySelect'
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
    TraySelect
  },
  props: {},
  data() {
    return {
      title: '新建',
      layout: { labelCol: { xs: { span: 24 }, sm: { span: 6 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 14 } } },
      rules: {
        ToLocId: [{ required: true, message: '必填' }]
      },
      visible: false,
      loading: false,
      inventory: {
        Id: '',
        StorerId: '', Storer: { Code: '', Name: '' },
        LocId: '', Loc: { Code: '' }, TryaId: '', Tray: { Code: '' },
        SkuId: '', Sku: { Code: '', Name: '' },
        Qty: 0, QtyAllocated: 0, QtyPicked: 0, Status: 'None',
        LotId: '', Lot: { Lot01: '', Lot02: '', Lot03: '', Lot04: '', Lot05: '', Lot06: '', Lot07: '', Lot08: '', Lot09: '', Lot10: '' }
      },
      entity: { Id: '', WhseId: '', ToLocId: '', ToTrayId: undefined, Qty: 0, IsAuto: false },
      enumItems: []
    }
  },
  computed: {
    ...mapGetters({
      defaultWhseId: 'whseId',
      defaultStorerId: 'storerId'
    }),
    qtyUse() {
      if (!this.inventory) return 0
      return this.inventory.Status === 'None' ? this.inventory.Qty - this.inventory.QtyAllocated - this.inventory.QtyPicked : 0
    }
  },
  created() {
    this.getEnum({ whseId: this.defaultWhseId, code: 'Bas_Lot_Field' }).then(result => {
      this.enumItems = result.EnumItems
    })
  },
  methods: {
    ...mapActions({ getConfig: 'getConfig', getEnum: 'getEnum' }),
    cusHeaderTitle(column) {
      return this.enumItems?.find(w => w.Code === column)?.Name
    },
    init() {
      this.loading = false
      this.visible = true
      this.entity = { Id: '', WhseId: this.defaultWhseId, ToLocId: '', ToTrayId: undefined, Qty: 0, IsAuto: false }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    openForm(id) {
      this.title = '库存移动'
      this.init()
      if (id) {
        MainSvc.Get(id).then(resJson => {
          this.inventory = resJson.Data
          this.entity.Id = this.inventory.Id
          this.entity.ToTrayId = this.inventory.TrayId
          this.$nextTick(() => {
            this.entity.Qty = this.qtyUse
          })
        })
      }
    },
    handleSubmit() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        this.loading = true
        MainSvc.Move(this.entity).then(result => {
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
