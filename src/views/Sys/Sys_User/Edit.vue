<template>
  <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="loading" @ok="handleSubmit" @cancel="()=>{this.visible=false}">
    <a-spin :spinning="loading">
      <a-form-model ref="form" :model="entity" :rules="rules" v-bind="layout">
        <a-form-model-item label="工号" prop="Code">
          <CodeInput ref="codeInput" code="CF_User_Code" v-model="entity.Code" autocomplete="off"></CodeInput>
        </a-form-model-item>
        <a-form-model-item label="名称" prop="Name">
          <a-input v-model="entity.Name" autocomplete="off" />
        </a-form-model-item>
        <a-form-model-item label="帐号" prop="UserName">
          <a-input v-model="entity.UserName" autocomplete="off" />
        </a-form-model-item>
        <a-form-model-item label="密码" prop="Password">
          <a-input v-model="entity.Password" autocomplete="off" placeholder="不修改密码可为空" />
        </a-form-model-item>
        <a-form-model-item label="性别" prop="Sex">
          <EnumSelect code="Sex" v-model="entity.Sex"></EnumSelect>
        </a-form-model-item>
        <a-form-model-item label="所属组织" prop="OrgId">
          <OrgSelect v-model="entity.OrgId" autocomplete="off"></OrgSelect>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import md5 from 'md5'
import { mapActions, mapGetters } from 'vuex'
import MainSvc from '@/api/Sys/Sys_UserSvc'
import OrgSelect from '@/components/Sys/SysOrgSelect'
import EnumSelect from '@/components/CF/EnumSelect'
import CodeInput from '@/components/CF/CodeInput'
export default {
  components: {
    MainSvc,
    OrgSelect,
    EnumSelect,
    CodeInput
  },
  props: {},
  data() {
    return {
      title: '新建',
      layout: { labelCol: { xs: { span: 24 }, sm: { span: 6 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 14 } } },
      rules: {
        Name: [{ required: true, message: '必填' }],
        UserName: [{ required: true, message: '必填' }]
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
      this.entity = { Id: '', Code: '', Name: '', UserName: '', Password: '', Sex: '', OrgId: '', Status: 'Enable' }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    openForm(id, title) {
      this.title = title || (id ? '新建' : '修改')
      this.init()
      if (id) {
        MainSvc.Get(id).then(resJson => {
          resJson.Data.Password = ''
          this.entity = resJson.Data
        })
      } else {
        this.getConfig(this.defaultWhseId, 'Sys_User_Code_AutoGenerate').then(result => {
          if (result.Val === '1') {
            this.$refs.codeInput.Generate()
          }
        })
      }
    },
    handleSubmit() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        this.loading = true
        if (this.entity.Password) {
          this.entity.Password = md5(this.entity.Password)
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
