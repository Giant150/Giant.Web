<template>
  <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="loading" @ok="handleSubmit" @cancel="()=>{this.visible=false}">
    <a-spin :spinning="loading">
      <a-form-model ref="form" :model="entity" :rules="rules" v-bind="layout">
        <a-form-model-item label="货主" prop="StorerId">
          <StorerSelect v-model="entity.StorerId" :type="['Storer']"></StorerSelect>
        </a-form-model-item>
        <a-form-model-item label="物料" prop="SkuId">
          <SkuSelect v-model="entity.SkuId" :storer="entity.StorerId"></SkuSelect>
        </a-form-model-item>
        <a-form-model-item label="拣货库位" prop="PickLocId">
          <LocSelect v-model="entity.PickLocId"></LocSelect>
        </a-form-model-item>
        <a-form-model-item label="最大容量" prop="MaxCapacity">
          <a-input-number v-model="entity.MaxCapacity" style="width:100%" />
        </a-form-model-item>
        <a-form-model-item label="补货单位" prop="UomCode">
          <EnumSelect code="Unit" v-model="entity.UomCode"></EnumSelect>
        </a-form-model-item>
        <a-form-model-item label="补货触发点" prop="MinQty">
          <a-input-number v-model="entity.MinQty" style="width:100%" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MainSvc from '@/api/Bas/Bas_PickLocSvc'
import EnumSelect from '@/components/CF/EnumSelect'
import CodeInput from '@/components/CF/CodeInput'
import StorerSelect from '@/components/Bas/StorerSelect'
import TreeSelect from '@/components/CF/TreeSelect'
import CommonSelect from '@/components/CF/CommonSelect'
import LocSelect from '@/components/Bas/LocSelect'
import SkuSelect from '@/components/Bas/SkuSelect'
export default {
  components: {
    MainSvc,
    CodeInput,
    EnumSelect,
    StorerSelect,
    TreeSelect,
    CommonSelect,
    LocSelect,
    SkuSelect
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
      entity: {}
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
      this.entity = { Id: '', WhseId: this.defaultWhseId, StorerId: this.defaultStorerId, SkuId: '', PickLocId: '', MaxCapacity: 0, UomCode: 'EA', MinQty: 0 }
      this.getConfig({ whseId: this.defaultWhseId, code: 'Bas_PutawayZone_PickToLocId_Default' }).then(result => {
        this.entity.PickLocId = result.Val
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
