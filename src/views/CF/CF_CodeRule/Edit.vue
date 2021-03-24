<template>
  <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="loading" @ok="handleSubmit" @cancel="()=>{this.visible=false}">
    <a-spin :spinning="loading">
      <a-form-model ref="form" :model="entity" :rules="rules" v-bind="layout">
        <a-form-model-item label="类型" prop="RuleType">
          <EnumSelect code="CF_CodeRule_Type" v-model="entity.RuleType"></EnumSelect>
        </a-form-model-item>
        <a-form-model-item label="规则" prop="Rule">
          <a-input v-model="entity.Rule" autocomplete="off" />
        </a-form-model-item>
        <a-form-model-item label="长度" prop="Length">
          <a-input-number v-model="entity.Length" autocomplete="off" style="width:100%" />
        </a-form-model-item>
        <a-form-model-item label="排序" prop="Sort">
          <a-input-number v-model="entity.Sort" autocomplete="off" style="width:100%" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import MainSvc from '@/api/CF/CF_CodeRuleSvc'
import EnumSelect from '@/components/CF/EnumSelect'
export default {
  components: {
    MainSvc,
    EnumSelect
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
  created() { },
  methods: {
    init() {
      this.loading = false
      this.visible = true
      this.entity = { Id: '', CodeTypeId: '', RuleType: '', Rule: '', Length: 0, Sort: 0 }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    openForm(id, codeTypeId, title) {
      this.title = title || (id ? '新建' : '修改')
      this.init()
      this.entity.CodeTypeId = codeTypeId
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
