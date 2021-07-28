<template>
  <a-modal
    :title="title"
    width="60%"
    :visible="visible"
    :confirmLoading="loading"
    @ok="handleSubmit"
    @cancel="
      () => {
        this.visible = false
      }
    "
  >
    <a-spin :spinning="loading">
      <a-form-model ref="form" :model="entity" :rules="rules" v-bind="layout">
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="编号" prop="Code">
              <CodeInput code="Bas_Contact_Code" v-model="entity.Code" placeholder="编号"></CodeInput>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="名称" prop="Name">
              <a-input v-model="entity.Name" autocomplete="off" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="是否默认" prop="IsDefault">
              <a-switch checked-children="是" un-checked-children="否" v-model="entity.IsDefault" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="电话" prop="Phone">
              <a-input v-model="entity.Phone" autocomplete="off" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="邮箱" prop="Emai">
              <a-input v-model="entity.Email" autocomplete="off" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="邮编" prop="Zip">
              <a-input v-model="entity.Zip" auticomplete="off" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="省份" prop="ProvinceId">
              <DistrictSelect v-model="entity.ProvinceId" parent="100000"></DistrictSelect>
            </a-form-model-item>
          </a-col>
           <a-col :span="8">
            <a-form-model-item label="城市" prop="CityId">
              <DistrictSelect v-model="entity.CityId" :parent="entity.ProvinceId"></DistrictSelect>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="县区" prop="DistrictId">
              <DistrictSelect v-model="entity.DistrictId" :parent="entity.CityId"></DistrictSelect>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="地址" prop="addr">
              <a-textarea v-model="entity.Addr" auticomplete="off" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MainSvc from '@/api/Bas/Bas_ContactSvc'
import CodeInput from '@/components/CF/CodeInput'
import DistrictSelect from '@/components/CF/District'
export default {
  components: {
    MainSvc,
    CodeInput,
    DistrictSelect
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
    }
  },
  computed: {
    ...mapGetters({
      defaultWhseId: 'whseId',
      defaultStorerId: 'storerId',
    }),
  },
  created() {},
  methods: {
    ...mapActions({ getConfig: 'getConfig' }),
    init() {
      this.loading = false
      this.visible = true
      this.entity = { Id: '', WhseId: this.defaultWhseId, StorerId: this.parentEntity.Id, Code: '', Name: '' }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    openForm(id, main, title) {
      this.title = title || (id ? '新建' : '修改')
      this.parentEntity = main
      this.init()
      if (id) {
        MainSvc.Get(id).then((resJson) => {
          this.entity = resJson.Data
        })
      }
    },
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return
        }
        this.loading = true
        MainSvc.Save(this.entity).then((result) => {
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
  },
}
</script>
