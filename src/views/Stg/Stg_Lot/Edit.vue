<template>
  <a-modal :title="title" :width="650" :visible="visible" :confirmLoading="loading" @ok="handleSubmit" @cancel="()=>{this.visible=false}">
    <a-spin :spinning="loading">
      <a-form-model ref="form" :model="entity" :rules="rules" v-bind="layout">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="编号" prop="Code">
              <a-input v-model="entity.Code" autocomplete="off" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="名称" prop="Name">
              <a-input v-model="entity.Name" autocomplete="off" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="4">{{ 'Lot01' | fieldName(fields) }}</a-col>
          <a-col :span="5">
            <a-checkbox :checked="entity.Lot01Required" @change="(e)=>{entity.Lot01Required=e.target.checked}">需维护</a-checkbox>
          </a-col>
          <a-col :span="5">
            <a-checkbox :checked="entity.Lot01RequiredRF" @change="(e)=>{entity.Lot01RequiredRF=e.target.checked}">RF显示</a-checkbox>
          </a-col>
          <a-col :span="5">
            <EnumSelect size="small" code="Stg_Lot_DataType" v-model="entity.Lot01Type"></EnumSelect>
          </a-col>
          <a-col :span="5">
            <a-input size="small" v-model="entity.Lot01Enum" autocomplete="off" placeholder="枚举值" />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="4">{{ 'Lot02' | fieldName(fields) }}</a-col>
          <a-col :span="5">
            <a-checkbox :checked="entity.Lot02Required" @change="(e)=>{entity.Lot02Required=e.target.checked}">需维护</a-checkbox>
          </a-col>
          <a-col :span="5">
            <a-checkbox :checked="entity.Lot02RequiredRF" @change="(e)=>{entity.Lot02RequiredRF=e.target.checked}">RF显示</a-checkbox>
          </a-col>
          <a-col :span="5">
            <EnumSelect size="small" code="Stg_Lot_DataType" v-model="entity.Lot02Type"></EnumSelect>
          </a-col>
          <a-col :span="5">
            <a-input size="small" v-model="entity.Lot02Enum" autocomplete="off" placeholder="枚举值" />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="4">{{ 'Lot03' | fieldName(fields) }}</a-col>
          <a-col :span="5">
            <a-checkbox :checked="entity.Lot03Required" @change="(e)=>{entity.Lot03Required=e.target.checked}">需维护</a-checkbox>
          </a-col>
          <a-col :span="5">
            <a-checkbox :checked="entity.Lot03RequiredRF" @change="(e)=>{entity.Lot03RequiredRF=e.target.checked}">RF显示</a-checkbox>
          </a-col>
          <a-col :span="5">
            <EnumSelect size="small" code="Stg_Lot_DataType" v-model="entity.Lot03Type"></EnumSelect>
          </a-col>
          <a-col :span="5">
            <a-input size="small" v-model="entity.Lot03Enum" autocomplete="off" placeholder="枚举值" />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="4">{{ 'Lot04' | fieldName(fields) }}</a-col>
          <a-col :span="5">
            <a-checkbox :checked="entity.Lot04Required" @change="(e)=>{entity.Lot04Required=e.target.checked}">需维护</a-checkbox>
          </a-col>
          <a-col :span="5">
            <a-checkbox :checked="entity.Lot04RequiredRF" @change="(e)=>{entity.Lot04RequiredRF=e.target.checked}">RF显示</a-checkbox>
          </a-col>
          <a-col :span="5">
            <EnumSelect size="small" code="Stg_Lot_DataType" v-model="entity.Lot04Type"></EnumSelect>
          </a-col>
          <a-col :span="5">
            <a-input size="small" v-model="entity.Lot04Enum" autocomplete="off" placeholder="枚举值" />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="4">{{ 'Lot05' | fieldName(fields) }}</a-col>
          <a-col :span="5">
            <a-checkbox :checked="entity.Lot05Required" @change="(e)=>{entity.Lot05Required=e.target.checked}">需维护</a-checkbox>
          </a-col>
          <a-col :span="5">
            <a-checkbox :checked="entity.Lot05RequiredRF" @change="(e)=>{entity.Lot05RequiredRF=e.target.checked}">RF显示</a-checkbox>
          </a-col>
          <a-col :span="5">
            <EnumSelect size="small" code="Stg_Lot_DataType" v-model="entity.Lot05Type"></EnumSelect>
          </a-col>
          <a-col :span="5">
            <a-input size="small" v-model="entity.Lot05Enum" autocomplete="off" placeholder="枚举值" />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="4">{{ 'Lot06' | fieldName(fields) }}</a-col>
          <a-col :span="5">
            <a-checkbox :checked="entity.Lot06Required" @change="(e)=>{entity.Lot06Required=e.target.checked}">需维护</a-checkbox>
          </a-col>
          <a-col :span="5">
            <a-checkbox :checked="entity.Lot06RequiredRF" @change="(e)=>{entity.Lot06RequiredRF=e.target.checked}">RF显示</a-checkbox>
          </a-col>
          <a-col :span="5">
            <EnumSelect size="small" code="Stg_Lot_DataType" v-model="entity.Lot06Type"></EnumSelect>
          </a-col>
          <a-col :span="5">
            <a-input size="small" v-model="entity.Lot06Enum" autocomplete="off" placeholder="枚举值" />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="4">{{ 'Lot07' | fieldName(fields) }}</a-col>
          <a-col :span="5">
            <a-checkbox :checked="entity.Lot07Required" @change="(e)=>{entity.Lot07Required=e.target.checked}">需维护</a-checkbox>
          </a-col>
          <a-col :span="5">
            <a-checkbox :checked="entity.Lot07RequiredRF" @change="(e)=>{entity.Lot07RequiredRF=e.target.checked}">RF显示</a-checkbox>
          </a-col>
          <a-col :span="5">
            <EnumSelect size="small" code="Stg_Lot_DataType" v-model="entity.Lot07Type"></EnumSelect>
          </a-col>
          <a-col :span="5">
            <a-input size="small" v-model="entity.Lot07Enum" autocomplete="off" placeholder="枚举值" />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="4">{{ 'Lot08' | fieldName(fields) }}</a-col>
          <a-col :span="5">
            <a-checkbox :checked="entity.Lot08Required" @change="(e)=>{entity.Lot08Required=e.target.checked}">需维护</a-checkbox>
          </a-col>
          <a-col :span="5">
            <a-checkbox :checked="entity.Lot08RequiredRF" @change="(e)=>{entity.Lot08RequiredRF=e.target.checked}">RF显示</a-checkbox>
          </a-col>
          <a-col :span="5">
            <EnumSelect size="small" code="Stg_Lot_DataType" v-model="entity.Lot08Type"></EnumSelect>
          </a-col>
          <a-col :span="5">
            <a-input size="small" v-model="entity.Lot08Enum" autocomplete="off" placeholder="枚举值" />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="4">{{ 'Lot09' | fieldName(fields) }}</a-col>
          <a-col :span="5">
            <a-checkbox :checked="entity.Lot09Required" @change="(e)=>{entity.Lot09Required=e.target.checked}">需维护</a-checkbox>
          </a-col>
          <a-col :span="5">
            <a-checkbox :checked="entity.Lot09RequiredRF" @change="(e)=>{entity.Lot09RequiredRF=e.target.checked}">RF显示</a-checkbox>
          </a-col>
          <a-col :span="5">
            <EnumSelect size="small" code="Stg_Lot_DataType" v-model="entity.Lot09Type"></EnumSelect>
          </a-col>
          <a-col :span="5">
            <a-input size="small" v-model="entity.Lot09Enum" autocomplete="off" placeholder="枚举值" />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="4">{{ 'Lot10' | fieldName(fields) }}</a-col>
          <a-col :span="5">
            <a-checkbox :checked="entity.Lot10Required" @change="(e)=>{entity.Lot10Required=e.target.checked}">需维护</a-checkbox>
          </a-col>
          <a-col :span="5">
            <a-checkbox :checked="entity.Lot10RequiredRF" @change="(e)=>{entity.Lot10RequiredRF=e.target.checked}">RF显示</a-checkbox>
          </a-col>
          <a-col :span="5">
            <EnumSelect size="small" code="Stg_Lot_DataType" v-model="entity.Lot10Type"></EnumSelect>
          </a-col>
          <a-col :span="5">
            <a-input size="small" v-model="entity.Lot10Enum" autocomplete="off" placeholder="枚举值" />
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MainSvc from '@/api/Stg/Stg_LotSvc'
import EnumSelect from '@/components/CF/EnumSelect'
import CodeInput from '@/components/CF/CodeInput'
export default {
  components: {
    MainSvc,
    CodeInput,
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
      entity: {},
      fields: []
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
    'entity.Lot01Required': function (newVal, oldVal) {
      if (newVal) {
        this.entity.Lot01RequiredRF = newVal
      }
    },
    'entity.Lot02Required': function (newVal, oldVal) {
      if (newVal) {
        this.entity.Lot02RequiredRF = newVal
      }
    },
    'entity.Lot03Required': function (newVal, oldVal) {
      if (newVal) {
        this.entity.Lot03RequiredRF = newVal
      }
    },
    'entity.Lot04Required': function (newVal, oldVal) {
      if (newVal) {
        this.entity.Lot04RequiredRF = newVal
      }
    },
    'entity.Lot05Required': function (newVal, oldVal) {
      if (newVal) {
        this.entity.Lot05RequiredRF = newVal
      }
    },
    'entity.Lot06Required': function (newVal, oldVal) {
      if (newVal) {
        this.entity.Lot06RequiredRF = newVal
      }
    },
    'entity.Lot07Required': function (newVal, oldVal) {
      if (newVal) {
        this.entity.Lot07RequiredRF = newVal
      }
    },
    'entity.Lot08Required': function (newVal, oldVal) {
      if (newVal) {
        this.entity.Lot08RequiredRF = newVal
      }
    },
    'entity.Lot09Required': function (newVal, oldVal) {
      if (newVal) {
        this.entity.Lot09RequiredRF = newVal
      }
    },
    'entity.Lot10Required': function (newVal, oldVal) {
      if (newVal) {
        this.entity.Lot10RequiredRF = newVal
      }
    }
  },
  filters: {
    fieldName(filed, fields) {
      if (fields.length === 0) return filed
      var one = fields.find(v => v.Code === filed)
      if (one) {
        return one.Name
      } else {
        return filed
      }
    }
  },
  created() {
    this.getEnum({ whseId: this.defaultWhseId, code: 'Bas_Lot_Field' }).then(result => {
      this.fields = result.EnumItems
    })
  },
  methods: {
    ...mapActions({ getConfig: 'getConfig', getEnum: 'getEnum' }),
    init() {
      this.loading = false
      this.visible = true
      this.entity = {
        Id: '', WhseId: this.defaultWhseId, Code: '', Name: '',
        Lot01Required: false, Lot02Required: false, Lot03Required: false, Lot04Required: false, Lot05Required: false, Lot06Required: false, Lot07Required: false, Lot08Required: false, Lot09Required: false, Lot10Required: false,
        Lot01RequiredRF: false, Lot02RequiredRF: false, Lot03RequiredRF: false, Lot04RequiredRF: false, Lot05RequiredRF: false, Lot06RequiredRF: false, Lot07RequiredRF: false, Lot08RequiredRF: false, Lot09RequiredRF: false, Lot10RequiredRF: false,
        Lot01Type: 'String', Lot02Type: 'String', Lot03Type: 'String', Lot04Type: 'String', Lot05Type: 'String', Lot06Type: 'String', Lot07Type: 'String', Lot08Type: 'String', Lot09Type: 'String', Lot10Type: 'String',
        Lot01Enum: '', Lot02Enum: '', Lot03Enum: '', Lot04Enum: '', Lot05Enum: '', Lot06Enum: '', Lot07Enum: '', Lot08Enum: '', Lot09Enum: '', Lot10Enum: ''
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
