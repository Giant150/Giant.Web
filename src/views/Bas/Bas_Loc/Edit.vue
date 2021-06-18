<template>
  <a-modal :title="title" width="60%" :visible="visible" :confirmLoading="loading" @ok="handleSubmit" @cancel="()=>{this.visible=false}">
    <a-spin :spinning="loading">
      <a-form-model ref="form" :model="entity" :rules="rules" v-bind="layout">
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="编号" prop="Code">
              <a-input v-model="entity.Code" placeholder="编号" />
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
          <a-col :span="8">
            <a-form-model-item label="拣货路顺" prop="AllocCode">
              <a-input v-model="entity.AllocCode" placeholder="拣货路顺" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="上架路顺" prop="PutawayCode">
              <a-input v-model="entity.PutawayCode" placeholder="上架路顺" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="工作区域" prop="WorkZone">
              <a-input v-model="entity.WorkZone" placeholder="工作区域" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="上架区域" prop="PutawayZoneId">
              <CommonSelect v-model="entity.PutawayZoneId" table="Bas_PutawayZone" placeholder="上架区域"></CommonSelect>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="托盘类型" prop="TrayTypeId">
              <CommonSelect v-model="entity.TrayTypeId" table="Bas_TrayType" placeholder="托盘类型"></CommonSelect>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="巷道" prop="LanewayId">
              <CommonSelect v-model="entity.LanewayId" table="Bas_Laneway" placeholder="巷道"></CommonSelect>
            </a-form-model-item>
          </a-col>
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
          <template v-if="entity.Expand">
            <a-col :span="8" v-for="item in expand.EnumItems" :key="item.Code">
              <a-form-model-item :label="item.Name" :prop="item.Code">
                <ExpandInput v-model="entity.Expand[item.Code]" :enumitem="item" />
              </a-form-model-item>
            </a-col>
          </template>
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
import ExpandInput from '@/components/CF/ExpandInput'
export default {
  components: {
    MainSvc,
    CodeInput,
    EnumSelect,
    CommonSelect,
    ExpandInput
  },
  props: {},
  data() {
    return {
      title: '新建',
      layout: { labelCol: { xs: { span: 24 }, sm: { span: 6 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 14 } } },
      rules: {
        Code: [{ required: true, message: '必填' }],
        AllocCode: [{ required: true, message: '必填' }],
        PutawayCode: [{ required: true, message: '必填' }],
        PutawayZoneId: [{ required: true, message: '必填' }],
        Type: [{ required: true, message: '必填' }],
        Flag: [{ required: true, message: '必填' }]
      },
      visible: false,
      loading: false,
      entity: {},
      expand: {}
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
  created() {
    this.getEnum({ whseId: this.defaultWhseId, code: 'Bas_Loc_Expand' }).then(result => {
      this.expand = result
    })
  },
  methods: {
    ...mapActions({ getConfig: 'getConfig', getEnum: 'getEnum' }),
    init() {
      this.loading = false
      this.visible = true
      this.entity = {
        Id: '', WhseId: this.defaultWhseId, Code: '', Name: '', Type: 'Standard', Flag: 'None', AllocCode: '', PutawayCode: '', PutawayZoneId: undefined,
        TrayTypeId: undefined, LanewayId: undefined, WorkZone: '', ABC: 'B', MaxCapacity: 0, MaxWeight: 0, CommingleSku: true, CommingleLot: true, Status: 'Enable',
        Expand: {
          ExpStr1: undefined, ExpStr2: undefined, ExpStr3: undefined, ExpStr4: undefined, ExpStr5: undefined, ExpStr6: undefined,
          ExpEnum1: undefined, ExpEnum2: undefined, ExpEnum3: undefined, ExpEnum4: undefined, ExpEnum5: undefined, ExpEnum6: undefined,
          ExpInt1: undefined, ExpInt2: undefined, ExpInt3: undefined, ExpInt4: undefined, ExpInt5: undefined, ExpInt6: undefined,
          ExpNum1: undefined, ExpNum2: undefined, ExpNum3: undefined, ExpNum4: undefined, ExpNum5: undefined, ExpNum6: undefined,
          ExpDate1: undefined, ExpDate2: undefined, ExpDate3: undefined, ExpDate4: undefined, ExpDate5: undefined, ExpDate6: undefined
        }
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
