<template>
  <a-modal :title="title" width="60%" :visible="visible" :confirmLoading="loading" @ok="handleSubmit" @cancel="()=>{this.visible=false}">
    <a-spin :spinning="loading">
      <a-form-model ref="form" :model="entity" :rules="rules" v-bind="layout">
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="编号" prop="Code">
              <a-input v-model="entity.Code" autocomplete="off" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="类型" prop="Type">
              <EnumSelect code="Bas_Loc_Type" v-model="entity.Type"></EnumSelect>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="标志" prop="Flag">
              <EnumSelect code="Bas_Loc_Flag" v-model="entity.Flag"></EnumSelect>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="拣货路顺" prop="AllocCode">
              <a-input v-model="entity.AllocCode" autocomplete="off" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="上架路顺" prop="PutawayCode">
              <a-input v-model="entity.PutawayCode" autocomplete="off" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="工作区域" prop="WorkZone">
              <a-input v-model="entity.WorkZone" autocomplete="off" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="上架区域" prop="PutawayZoneId">
              <CommonSelect v-model="entity.PutawayZoneId" table="Bas_PutawayZone"></CommonSelect>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="托盘类型" prop="TrayTypeId">
              <CommonSelect v-model="entity.TrayTypeId" table="Bas_TrayType"></CommonSelect>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="巷道" prop="LanewayId">
              <CommonSelect v-model="entity.LanewayId" table="Bas_Laneway"></CommonSelect>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="ABC" prop="ABC">
              <EnumSelect code="ABC" v-model="entity.ABC"></EnumSelect>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="混放商品" prop="CommingleSku">
              <a-radio-group v-model="entity.CommingleSku">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="混放批次" prop="CommingleLot">
              <a-radio-group v-model="entity.CommingleLot">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="状态" prop="Status">
              <EnumSelect code="State" v-model="entity.Status"></EnumSelect>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="最大重量" prop="MaxCapacity">
              <a-input-number v-model="entity.MaxCapacity" style="width:100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="最大重量" prop="MaxWeight">
              <a-input-number v-model="entity.MaxWeight" style="width:100%" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MainSvc from '@/api/Bas/Bas_LocSvc'
import EnumSelect from '@/components/CF/EnumSelect'
import CodeInput from '@/components/CF/CodeInput'
import CommonSelect from '@/components/CF/CommonSelect'
export default {
  components: {
    MainSvc,
    CodeInput,
    EnumSelect,
    CommonSelect
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
  watch: {
    entity: {
      handler: function (newVal, oldVal) { },
      deep: true
    },
    'entity.Code': function (newVal, oldVal) {
      if (this.entity.Name === oldVal || this.entity.Name === '') {
        this.entity.Name = newVal
      }
      if (this.entity.AllocCode === oldVal || this.entity.AllocCode === '') {
        this.entity.AllocCode = newVal
      }
      if (this.entity.PutawayCode === oldVal || this.entity.PutawayCode === '') {
        this.entity.PutawayCode = newVal
      }
    },
    'entity.CommingleSku': function (newVal, oldVal) {
      this.entity.CommingleLot = newVal
    },
    'entity.CommingleLot': function (newVal, oldVal) {
      this.entity.CommingleSku = newVal
    }
  },
  created() { },
  methods: {
    ...mapActions({ getConfig: 'getConfig' }),
    init() {
      this.loading = false
      this.visible = true
      this.entity = { Id: '', WhseId: this.defaultWhseId, Code: '', Name: '', Type: 'Standard', Flag: 'None', AllocCode: '', PutawayCode: '', PutawayZoneId: null, TrayTypeId: null, LanewayId: null, WorkZone: '', ABC: 'B', MaxCapacity: 0, MaxWeight: 0, CommingleSku: true, CommingleLot: true, Status: 'Enable' }
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
        if (!this.entity.Id) {
          this.entity.Id = `${this.defaultWhseId}_${this.entity.Code}`
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
