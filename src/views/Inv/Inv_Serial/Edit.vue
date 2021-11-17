<template>
  <a-modal :title="title" width="60%" :visible="visible" :confirmLoading="loading" @ok="handleSubmit" @cancel="()=>{this.visible=false}">
    <a-spin :spinning="loading">
      <a-form-model ref="form" :model="entity" :rules="rules" v-bind="layout">
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="货主" prop="StorerId">
              <StorerSelect v-model="entity.StorerId" :type="['Storer']" placeholder="货主"></StorerSelect>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="物料" prop="SkuId">
              <SkuSelect v-model="entity.SkuId" :storer="entity.StorerId" @select="(val,sku)=>{this.querySku=sku}"></SkuSelect>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="序列号" prop="Code">
              <CodeInput ref="codeInput" code="Inv_Serial_Code" v-model="entity.Code" :para="{}" placeholder="序列号"></CodeInput>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="cusHeaderTitle('Lot01')">
              <LotInput name="Lot01" v-model="entity.Lot01" :sku="querySku"></LotInput>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="cusHeaderTitle('Lot02')">
              <LotInput name="Lot02" v-model="entity.Lot02" :sku="querySku"></LotInput>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="cusHeaderTitle('Lot03')">
              <LotInput name="Lot03" v-model="entity.Lot03" :sku="querySku"></LotInput>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="cusHeaderTitle('Lot04')">
              <LotInput name="Lot04" v-model="entity.Lot04" :sku="querySku"></LotInput>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="cusHeaderTitle('Lot05')">
              <LotInput name="Lot05" v-model="entity.Lot05" :sku="querySku"></LotInput>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="cusHeaderTitle('Lot06')">
              <LotInput name="Lot06" v-model="entity.Lot06" :sku="querySku"></LotInput>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="cusHeaderTitle('Lot07')">
              <LotInput name="Lot07" v-model="entity.Lot07" :sku="querySku"></LotInput>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="cusHeaderTitle('Lot08')">
              <LotInput name="Lot08" v-model="entity.Lot08" :sku="querySku"></LotInput>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="cusHeaderTitle('Lot09')">
              <LotInput name="Lot09" v-model="entity.Lot09" :sku="querySku"></LotInput>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="cusHeaderTitle('Lot10')">
              <LotInput name="Lot10" v-model="entity.Lot10" :sku="querySku"></LotInput>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MainSvc from '@/api/Inv/Inv_SerialSvc'
import EnumSelect from '@/components/CF/EnumSelect'
import CodeInput from '@/components/CF/CodeInput'
import StorerSelect from '@/components/Bas/StorerSelect'
import TreeSelect from '@/components/CF/TreeSelect'
import CommonSelect from '@/components/CF/CommonSelect'
import LocSelect from '@/components/Bas/LocSelect'
import SkuSelect from '@/components/Bas/SkuSelect'
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
    LotInput
  },
  props: {},
  data() {
    return {
      title: '新建',
      layout: { labelCol: { xs: { span: 24 }, sm: { span: 6 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 14 } } },
      rules: {
        StorerId: [{ required: true, message: '必填' }],
        SkuId: [{ required: true, message: '必填' }],
        Code: [{ required: true, message: '必填' }]
      },
      visible: false,
      loading: false,
      entity: {},
      enumItems: [],
      querySku: null
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
    ...mapActions({ getConfig: 'getConfig', getEnum: 'getEnum' }),
    cusHeaderTitle(column) {
      return this.enumItems?.find(w => w.Code === column)?.Name
    },
    init() {
      this.loading = false
      this.visible = true
      this.entity = {
        Id: '', WhseId: this.defaultWhseId, StorerId: this.defaultStorerId, SkuId: null, Code: '', Status: 'Active', FromType: 'Manual', Remark: '',
        Lot01: '', Lot02: '', Lot03: '', Lot04: '', Lot05: '', Lot06: '', Lot07: '', Lot08: '', Lot09: '', Lot10: ''
      }
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
