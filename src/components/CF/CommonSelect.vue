<template>
  <a-select v-model="curValue" @search="handlerSearch" @change="(val)=>{if(!val){this.$emit('input', undefined)}}" @select="handlerSelect" optionLabelProp="title" v-bind="$attrs" :showSearch="true" :filterOption="false" style="width: 100%" :dropdownMenuStyle="{minWidth:'300px'}" :dropdownMatchSelectWidth="false">
    <a-icon slot="suffixIcon" type="copy" @click="copy()" title="复制编码" />
    <a-select-option v-for="item in data" :key="item.Id" :value="item.Id" :title="item.Name+'('+item.Code+')'">
      <a-row type="flex" justify="start" :gutter="10">
        <a-col flex="auto">{{ item.Name }}</a-col>
        <a-col flex="auto">{{ item.Code }}</a-col>
        <a-col flex="auto">
          <a-button type="dashed" shape="circle" icon="copy" title="复制编码" size="small" @click="copy(item.Code)" />
        </a-col>
      </a-row>
    </a-select-option>
  </a-select>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {},
  props: {
    value: String,
    table: String,
    search: { type: Object, required: false, default: () => { return {} } }
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
    })
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
    copy(val) {
      if (!val) {
        var item = this.data.find(w => w.Id === this.curValue)
        if (item) navigator.clipboard.writeText(item.Code)
      } else {
        navigator.clipboard.writeText(val)
      }
    },
    loadData() {
      this.$http.post(`/api/${this.table}/GetPage`, {
        PageNo: 1,
        PageSize: 10,
        SortField: 'Code',
        Search: {
          Id: this.curValue,
          Keyword: this.keyword,
          WhseId: this.defaultWhseId,
          ...this.search
        }
      }).then(result => {
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
