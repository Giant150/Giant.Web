<template>
  <a-select v-model="curValue" @search="handlerSearch" @change="(val)=>{if(!val){this.$emit('input', undefined)}}" @select="handlerSelect" optionLabelProp="title" v-bind="$attrs" :showSearch="true" :filterOption="false" style="width: 100%" :dropdownMenuStyle="{minWidth:'300px'}" :dropdownMatchSelectWidth="false">
    <a-icon slot="suffixIcon" type="copy" @click="copy(selected?selected.Code:'')" title="复制编码" />
    <a-select-option v-for="item in data" :key="item.Id" :value="item.Id" :title="item.Name+'('+item.Code+')'">
      <a-row type="flex" justify="start" :gutter="10">
        <a-col flex="auto">{{ item.Name }}</a-col>
        <a-col flex="auto">{{ item.Code }}</a-col>
        <a-col flex="auto">
          <EnumName code="Bas_Storer_Type" :value="item.Type"></EnumName>
        </a-col>
        <a-col flex="auto">
          <a-button type="dashed" shape="circle" icon="copy" title="复制编码" size="small" @click="copy(item.Code)" />
        </a-col>
      </a-row>
    </a-select-option>
  </a-select>
</template>

<script>
import copy from 'copy-to-clipboard'
import { mapGetters } from 'vuex'
import MainSvc from '@/api/Bas/Bas_StorerSvc'
import EnumName from '@/components/CF/EnumName'
export default {
  components: {
    EnumName
  },
  props: {
    value: String,
    type: { type: Array, required: false, default: () => { return [] } },
    whse: { type: String, required: false, default: () => { return undefined } }
  },
  data() {
    return {
      curValue: undefined,
      timeout: undefined,
      keyword: undefined,
      data: []
    }
  },
  computed: {
    ...mapGetters({
      defaultWhseId: 'whseId',
      defaultStorerId: 'storerId'
    }),
    selected() {
      return this.data.find(w => w.Id === this.curValue)
    }
  },
  watch: {
    value(newVal) {
      if (this.curValue !== newVal) {
        this.curValue = newVal
        this.loadData()
      }
    }
  },
  created() {
    this.curValue = this.value
    this.loadData()
  },
  methods: {
    copy,
    loadData() {
      MainSvc.GetBySearch(this.defaultWhseId, this.curValue ? this.curValue : '', this.type, this.keyword ? this.keyword : '').then(result => {
        this.data = result.Data
      })
    },
    handlerSearch(val) {
      if (this.timeout) {
        clearTimeout(this.timeout)
        this.timeout = null
      }
      this.keyword = val
      this.timeout = setTimeout(this.loadData, 500)
    },
    handlerSelect(val) {
      this.$emit('input', val)
      var item = this.data.find(w => w.Id === val)
      this.$emit('select', val, item)
    }
  }
}
</script>

<style>
</style>
