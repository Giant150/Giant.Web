<template>
  <a-modal :title="title" :width="800" :visible="visible" :confirmLoading="loading" @ok="handleSubmit" @cancel="()=>{this.visible=false}">
    <a-spin :spinning="loading">
      <a-form-model ref="form" :model="entity" :rules="rules" v-bind="layout">
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="编号" prop="Code">
              <a-input v-model="entity.Code" autocomplete="off" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="排序" prop="Sort">
              <a-input-number v-model="entity.Sort" style="width:100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item>
              <a-checkbox :checked="entity.CheckRestrictions" @change="(e)=>{entity.CheckRestrictions=e.target.checked}">检查限制条件</a-checkbox>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="上架类型" prop="PutawayType">
              <EnumSelect code="Stg_PutawayDetail_PutawayType" v-model="entity.PutawayType"></EnumSelect>
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
          <a-col :span="4">
            库位类型不含
          </a-col>
          <a-col :span="6">
            <EnumSelect code="Bas_Loc_Type" v-model="entity.LocTypeExclude01" :allowClear="true"></EnumSelect>
          </a-col>
          <a-col :span="6">
            <EnumSelect code="Bas_Loc_Type" v-model="entity.LocTypeExclude02" :allowClear="true"></EnumSelect>
          </a-col>
          <a-col :span="6">
            <EnumSelect code="Bas_Loc_Type" v-model="entity.LocTypeExclude03" :allowClear="true"></EnumSelect>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="4">
            库位类型包含
          </a-col>
          <a-col :span="6">
            <EnumSelect code="Bas_Loc_Type" v-model="entity.LocTypeInclude01" :allowClear="true"></EnumSelect>
          </a-col>
          <a-col :span="6">
            <EnumSelect code="Bas_Loc_Type" v-model="entity.LocTypeInclude02" :allowClear="true"></EnumSelect>
          </a-col>
          <a-col :span="6">
            <EnumSelect code="Bas_Loc_Type" v-model="entity.LocTypeInclude03" :allowClear="true"></EnumSelect>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="4">
            库位ABC包含
          </a-col>
          <a-col :span="6">
            <EnumSelect code="ABC" v-model="entity.LocABCInclude01" :allowClear="true"></EnumSelect>
          </a-col>
          <a-col :span="6">
            <EnumSelect code="ABC" v-model="entity.LocABCInclude02" :allowClear="true"></EnumSelect>
          </a-col>
          <a-col :span="6">
            <EnumSelect code="ABC" v-model="entity.LocABCInclude03" :allowClear="true"></EnumSelect>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="4">
            商品ABC包含
          </a-col>
          <a-col :span="6">
            <EnumSelect code="ABC" v-model="entity.SkuABCInclude01" :allowClear="true"></EnumSelect>
          </a-col>
          <a-col :span="6">
            <EnumSelect code="ABC" v-model="entity.SkuABCInclude02" :allowClear="true"></EnumSelect>
          </a-col>
          <a-col :span="6">
            <EnumSelect code="ABC" v-model="entity.SkuABCInclude03" :allowClear="true"></EnumSelect>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="4">
            上架区域不含
          </a-col>
          <a-col :span="6">
            <CommonSelect table="Bas_PutawayZone" v-model="entity.PutawayZoneExclude01" :allowClear="true"></CommonSelect>
          </a-col>
          <a-col :span="6">
            <CommonSelect table="Bas_PutawayZone" v-model="entity.PutawayZoneExclude02" :allowClear="true"></CommonSelect>
          </a-col>
          <a-col :span="6">
            <CommonSelect table="Bas_PutawayZone" v-model="entity.PutawayZoneExclude03" :allowClear="true"></CommonSelect>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="4">
            托盘类型不含
          </a-col>
          <a-col :span="6">
            <CommonSelect table="Bas_TrayType" v-model="entity.TrayTypeExclude01" :allowClear="true"></CommonSelect>
          </a-col>
          <a-col :span="6">
            <CommonSelect table="Bas_TrayType" v-model="entity.TrayTypeExclude02" :allowClear="true"></CommonSelect>
          </a-col>
          <a-col :span="6">
            <CommonSelect table="Bas_TrayType" v-model="entity.TrayTypeExclude03" :allowClear="true"></CommonSelect>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="4">
            库位限制条件
          </a-col>
          <a-col :span="6">
            <EnumSelect code="Stg_PutawayDetail_Restriction" v-model="entity.LocRestriction01" :allowClear="true"></EnumSelect>
          </a-col>
          <a-col :span="6">
            <EnumSelect code="Stg_PutawayDetail_Restriction" v-model="entity.LocRestriction02" :allowClear="true"></EnumSelect>
          </a-col>
          <a-col :span="6">
            <EnumSelect code="Stg_PutawayDetail_Restriction" v-model="entity.LocRestriction03" :allowClear="true"></EnumSelect>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MainSvc from '@/api/Stg/Stg_PutawayDetailSvc'
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
      this.entity = {
        Id: '', WhseId: this.defaultWhseId, PutawayStgId: this.parentEntity.Id, Code: '', Sort: 0, PutawayType: '', PutawayZoneId: '', PutawayLocId: '', CheckRestrictions: false,
        LocTypeExclude01: '', LocTypeExclude02: '', LocTypeExclude03: '', LocTypeInclude01: '', LocTypeInclude02: '', LocTypeInclude03: '',
        LocABCInclude01: '', LocABCInclude02: '', LocABCInclude03: '', SkuABCInclude01: '', SkuABCInclude02: '', SkuABCInclude03: '',
        PutawayZoneExclude01: '', PutawayZoneExclude02: '', PutawayZoneExclude03: '', TrayTypeExclude01: '', TrayTypeExclude02: '', TrayTypeExclude03: '',
        LocRestriction01: 'None', LocRestriction02: 'None', LocRestriction03: 'None'
      }
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
        if (!this.entity.PutawayZoneId) {
          this.entity.PutawayZoneId = null
        }
        if (!this.entity.PutawayLocId) {
          this.entity.PutawayLocId = null
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
