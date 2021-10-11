<template>
  <a-select v-model="curValue" @search="handlerSearch" @change="(val)=>{if(!val){this.$emit('input', undefined)}}" @select="handlerSelect" optionLabelProp="title" v-bind="$attrs" :showSearch="true" :showArrow="false" :filterOption="false" style="width: 300px" :dropdownMenuStyle="{minWidth:'300px'}" :dropdownMatchSelectWidth="false">
    <a-select-option v-for="item in data" :key="item.Id" :value="item.Id" :title="item.Code+'('+item.Name+')'">
      <a-row>
        <a-col :span="6">{{ item.Code }}</a-col>
        <a-col :span="12">{{ item.Name }}</a-col>
        <a-col :span="6">{{ item.Storer.Name }}</a-col>
      </a-row>
    </a-select-option>
  </a-select>
</template>

<script>
import { mapGetters } from 'vuex'
import MainSvc from '@/api/Bas/Bas_SkuSvc'
import EnumName from '@/components/CF/EnumName'

export default {
  components: {
    EnumName
  },
  props: {
    value: String,
    storer: String
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
    },
    storer(newVal) {
      if (this.curStorer !== newVal) {
        this.curStorer = newVal
        this.loadData()
      }
    }
  },
  created() {
    this.curValue = this.value
    this.curStorer = this.storer
    this.loadData()
  },
  methods: {
    loadData() {
      MainSvc.GetPage({
        PageNo: 1,
        PageSize: 10,
        SortField: 'Code',
        Search: {
          Id: this.curValue,
          Keyword: this.keyword,
          WhseId: this.defaultWhseId,
          StorerId: this.storer
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
