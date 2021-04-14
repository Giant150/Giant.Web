<template>
  <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="loading" @ok="handleSubmit" @cancel="()=>{this.visible=false}">
    <a-spin :spinning="loading">
      <a-form-model ref="form" :model="entity" :rules="rules" v-bind="layout">
        <a-form-model-item label="包装单位" prop="Uom">
          <EnumSelect code="Unit" v-model="entity.Uom" @select="handleUomSelect"></EnumSelect>
        </a-form-model-item>
        <a-form-model-item label="名称" prop="Name">
          <a-input v-model="entity.Name" autocomplete="off" />
        </a-form-model-item>
        <a-form-model-item label="转换率" prop="UomCnt">
          <a-input-number v-model="entity.UomCnt" style="width:100%" />
        </a-form-model-item>
        <a-form-model-item label="单位类型">
          <a-checkbox :checked="entity.IsBasUom" @change="(e)=>{entity.IsBasUom=e.target.checked}">是否基本单位</a-checkbox>
          <a-checkbox :checked="entity.IsTrayUom" @change="(e)=>{entity.IsTrayUom=e.target.checked}">是否托盘单位</a-checkbox>
        </a-form-model-item>
        <a-form-model-item label="物料条码" prop="Barcode">
          <a-input v-model="entity.Barcode" autocomplete="off" />
        </a-form-model-item>
        <a-form-model-item label="条码类型" prop="BarcodeType">
          <EnumSelect code="Bas_SkuUom_BarcodeType" v-model="entity.BarcodeType" :allowClear="true"></EnumSelect>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MainSvc from '@/api/Bas/Bas_SkuUomSvc'
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
      parentEntity: {}
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
      // 这里的ParentId为具体业务主表Id
      this.entity = { Id: '', WhseId: this.defaultWhseId, StorerId: this.parentEntity.StorerId, SkuId: this.parentEntity.Id, Name: '默认', Uom: 'EA', UomCnt: 1, IsBasUom: false, IsTrayUom: false, Barcode: '', BarcodeType: '' }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    openForm(id, main, title) {
      this.title = title || (id ? '新建' : '修改')
      this.parentEntity = main
      this.init()
      if (id) {
        MainSvc.Get(id).then(resJson => {
          this.entity = resJson.Data
        })
      }
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
    },
    handleUomSelect(val, option) {
      this.entity.Name = option.Name
    }
  }
}
</script>
