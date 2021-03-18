<template>
  <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="loading" @ok="handleSubmit" @cancel="()=>{this.visible=false}">
    <a-spin :spinning="loading">
      <a-form-model ref="form" :model="entity" :rules="rules" v-bind="layout">
        <a-form-model-item label="名称" prop="Name">
          <a-input v-model="entity.Name" autocomplete="off" />
        </a-form-model-item>
        <a-form-model-item label="编码" prop="Code">
          <a-input v-model="entity.Code" autocomplete="off" />
        </a-form-model-item>
        <a-form-model-item label="排序" prop="Sort">
          <a-input-number v-model="entity.Sort" style="width:100%"></a-input-number>
        </a-form-model-item>
        <a-form-model-item label="备注" prop="Remark">
          <a-textarea v-model="entity.Remark" autocomplete="off"></a-textarea>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import MainSvc from '@/api/CF/CF_EnumItemSvc'
export default {
  components: {
    MainSvc
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
      this.entity = { Id: '', EnumId: '', Code: '', Name: '', Sort: 1, Remark: '', IsSystem: false }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    openForm(id, enumId, title) {
      this.title = title || (id ? '新建' : '修改')
      this.init()
      this.entity.EnumId = enumId
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
