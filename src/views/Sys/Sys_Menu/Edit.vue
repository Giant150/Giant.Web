<template>
  <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="loading" @ok="handleSubmit" @cancel="()=>{this.visible=false}">
    <a-spin :spinning="loading">
      <a-form-model ref="form" :model="entity" :rules="rules" v-bind="layout">
        <a-form-model-item label="上级菜单" prop="ParentId">
          <MenuSelect v-model="entity.ParentId" :allowClear="true"></MenuSelect>
        </a-form-model-item>
        <a-form-model-item label="菜单名称" prop="Name">
          <a-input v-model="entity.Name" autocomplete="off" />
        </a-form-model-item>
        <a-form-model-item label="菜单编码" prop="Code">
          <a-input v-model="entity.Code" autocomplete="off" />
        </a-form-model-item>
        <a-form-model-item label="菜单图标" prop="Icon">
          <a-input v-model="entity.Icon" autocomplete="off" />
        </a-form-model-item>
        <a-form-model-item label="菜单路径" prop="Path">
          <a-input v-model="entity.Path" autocomplete="off" />
        </a-form-model-item>
        <a-form-model-item label="菜单组件" prop="Component">
          <a-input v-model="entity.Component" autocomplete="off" />
        </a-form-model-item>
        <a-form-model-item label="跳转路径" prop="Redirect">
          <a-input v-model="entity.Redirect" autocomplete="off" />
        </a-form-model-item>
        <a-form-model-item label="排序" prop="Seq">
          <a-input-number v-model="entity.Seq" autocomplete="off" style="width:100%" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import MainSvc from '@/api/Sys/Sys_MenuSvc'
import MenuSelect from '@/components/Sys/SysMenuSelect'
export default {
  components: {
    MainSvc,
    MenuSelect
  },
  props: {},
  data() {
    return {
      title: '新建',
      layout: { labelCol: { xs: { span: 24 }, sm: { span: 7 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 13 } } },
      rules: {
        Name: [{ required: true, message: '必填' }],
        Code: [{ required: true, message: '必填' }],
        Path: [{ required: true, message: '必填' }],
        Component: [{ required: true, message: '必填' }]
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
      this.entity = { Id: '', Name: '' }
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
