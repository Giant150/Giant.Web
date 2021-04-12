<template>
  <a-modal :title="title" width="60%" :visible="visible" :confirmLoading="loading" @ok="handleSubmit" @cancel="()=>{this.visible=false}">
    <a-spin :spinning="loading">
      <a-form-model ref="form" :model="entity" :rules="rules" v-bind="layout">
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="货主" prop="StorerId">
              <StorerSelect v-model="entity.StorerId" :type="['Storer']"></StorerSelect>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="物料分类" prop="SkuTypeId">
              <TreeSelect table="Bas_SkuType" v-model="entity.SkuTypeId" @select="handleSkuTypeSelect"></TreeSelect>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="编号" prop="Code">
              <CodeInput code="Bas_Sku_Code" v-model="entity.Code" :para="{SkuType:this.skuType}"></CodeInput>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="名称" prop="Name">
              <a-input v-model="entity.Name" autocomplete="off" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="基本单位" prop="BasUom">
              <EnumSelect code="Unit" v-model="entity.BasUom"></EnumSelect>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="物料条码" prop="Barcode">
              <a-input v-model="entity.Barcode" autocomplete="off" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="物料规格" prop="Spec">
              <a-input v-model="entity.Spec" autocomplete="off" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="助记码" prop="PinYin">
              <a-input v-model="entity.PinYin" autocomplete="off" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="供应商" prop="SupplierId">
              <StorerSelect v-model="entity.SupplierId" :type="['Supplier']"></StorerSelect>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="保质期" prop="ShelfLife">
              <a-input-number v-model="entity.ShelfLife" autocomplete="off" style="width:100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="货架寿命" prop="RackLife">
              <a-input-number v-model="entity.RackLife" autocomplete="off" style="width:100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="ABC" prop="ABC">
              <EnumSelect code="ABC" v-model="entity.ABC"></EnumSelect>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="批次策略" prop="LotStgId">
              <CommonSelect table="Stg_Lot" v-model="entity.LotStgId"></CommonSelect>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="托盘类型" prop="TrayTypeId">
              <CommonSelect table="Bas_TrayType" v-model="entity.TrayTypeId"></CommonSelect>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="状态" prop="Status">
              <EnumSelect code="State" v-model="entity.Status"></EnumSelect>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="发货策略" prop="AllocStgId">
              <CommonSelect table="Stg_Allocate" v-model="entity.AllocStgId"></CommonSelect>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="循环规则" prop="RotateBy">
              <EnumSelect code="Bas_Lot_Field" v-model="entity.RotateBy"></EnumSelect>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="优先规则" prop="RotateType">
              <EnumSelect code="Rotation" v-model="entity.RotateType"></EnumSelect>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="上架策略" prop="PutawayStgId">
              <CommonSelect table="Stg_Putaway" v-model="entity.PutawayStgId"></CommonSelect>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="上架区域" prop="PutawayZoneId">
              <CommonSelect table="Bas_PutawayZone" v-model="entity.PutawayZoneId"></CommonSelect>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="上架库位" prop="PutawayLocId">
              <LocSelect v-model="entity.PutawayLocId"></LocSelect>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="价格" prop="Price">
              <a-input-number v-model="entity.Price" autocomplete="off" style="width:100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="重订购点" prop="ReOrderPoint">
              <a-input-number v-model="entity.ReOrderPoint" autocomplete="off" style="width:100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="重订购量" prop="ReOrderQty">
              <a-input-number v-model="entity.ReOrderQty" autocomplete="off" style="width:100%" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MainSvc from '@/api/Bas/Bas_SkuSvc'
import EnumSelect from '@/components/CF/EnumSelect'
import CodeInput from '@/components/CF/CodeInput'
import StorerSelect from '@/components/Bas/StorerSelect'
import TreeSelect from '@/components/CF/TreeSelect'
import CommonSelect from '@/components/CF/CommonSelect'
import LocSelect from '@/components/Bas/LocSelect'
export default {
  components: {
    MainSvc,
    CodeInput,
    EnumSelect,
    StorerSelect,
    TreeSelect,
    CommonSelect,
    LocSelect
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
      skuType: ''
    }
  },
  computed: {
    ...mapGetters({
      defaultWhseId: 'whseId',
      defaultStorerId: 'storerId'
    })
  },
  created() { },
  methods: {
    ...mapActions({ getConfig: 'getConfig' }),
    init() {
      this.loading = false
      this.visible = true
      this.entity = { Id: '', WhseId: this.defaultWhseId, StorerId: this.defaultStorerId, Code: '', Name: '', BasUom: 'EA', Barcode: '', Spec: '', PinYin: '', SupplierId: '', ShelfLife: 0, SkuTypeId: '', Price: 0, LotStgId: '', AllocStgId: '', RotateBy: 'Code', RotateType: 'FIFO', PutawayStgId: '', PutawayZoneId: '', PutawayLocId: '', ABC: 'A', ReOrderPoint: 0, ReOrderQty: 0, RackLife: 0, TrayTypeId: '', Status: 'Enable' }
      this.getConfig({ whseId: this.defaultWhseId, code: 'Bas_Sku_LotStgId_Default' }).then(result => {
        this.entity.LotStgId = result.Val
      })
      this.getConfig({ whseId: this.defaultWhseId, code: 'Bas_Sku_AllocStgId_Default' }).then(result => {
        this.entity.AllocStgId = result.Val
      })
      this.getConfig({ whseId: this.defaultWhseId, code: 'Bas_Sku_PutawayStgId_Default' }).then(result => {
        this.entity.PutawayStgId = result.Val
      })
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    openForm(id, title) {
      this.title = title || (id ? '新建' : '修改')
      this.init()
      if (id) {
        MainSvc.Get(id).then(resJson => {
          this.entity = resJson.Data
        })
      }
    },
    handleSkuTypeSelect(value, node, extra) {
      console.log('handleSkuTypeSelect', value, node, extra)
      this.skuType = node.Code
    },
    handleSubmit() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        this.loading = true
        if (!this.entity.PutawayLocId) {
          this.entity.PutawayLocId = null
        }
        if (!this.entity.PutawayZoneId) {
          this.entity.PutawayZoneId = null
        }
        if (!this.entity.SupplierId) {
          this.entity.SupplierId = null
        }
        if (!this.entity.TrayTypeId) {
          this.entity.TrayTypeId = null
        }
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
