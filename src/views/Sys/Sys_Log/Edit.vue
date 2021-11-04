<template>
  <a-drawer title="日志信息" placement="right" width="50%" :visible="visible" @close="()=>{this.visible=false}">
    <a-descriptions layout="vertical">
      <a-descriptions-item label="日志应用">
        <EnumName code="Sys_Log_AppName" :value="entity.AppName"></EnumName>
      </a-descriptions-item>
      <a-descriptions-item label="日志级别">
        <EnumName code="Sys_Log_Level" :value="entity.Level"></EnumName>
      </a-descriptions-item>
      <a-descriptions-item label="日志时间">{{ entity.CreateTime }}</a-descriptions-item>
      <a-descriptions-item label="用户Id">{{ entity.UserId }}</a-descriptions-item>
      <a-descriptions-item label="IP">{{ entity.IP }}</a-descriptions-item>
      <a-descriptions-item label="请求Url">{{ entity.Url }}</a-descriptions-item>
      <a-descriptions-item label="日志内容" span="3">{{ entity.Msg }}</a-descriptions-item>
      <a-descriptions-item label="报错信息" v-if="entity.Exception" span="3">{{ entity.Exception }}</a-descriptions-item>
      <a-descriptions-item label="记录服务" span="3">{{ entity.Logger }}</a-descriptions-item>
    </a-descriptions>
  </a-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
import MainSvc from '@/api/Sys/Sys_LogSvc'
import EnumSelect from '@/components/CF/EnumSelect'
import EnumName from '@/components/CF/EnumName'
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
    EnumName,
    StorerSelect,
    TreeSelect,
    CommonSelect,
    LocSelect,
    SkuSelect
  },
  props: {},
  data() {
    return {
      title: '日志',
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
    init() {
      this.loading = false
      this.visible = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    openForm(record, title) {
      this.title = title
      this.init()
      this.entity = record
    }
  }
}
</script>
