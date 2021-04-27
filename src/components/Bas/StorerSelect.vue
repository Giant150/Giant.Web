<template>
  <a-select allowClear v-model="curValue" @search="handlerSearch" @change="(val)=>{if(!val){this.$emit('input', '')}}" @select="handlerSelect" optionLabelProp="title" v-bind="$attrs" :showSearch="true" :showArrow="false" :filterOption="false" style="width: 100%" :dropdownMenuStyle="{minWidth:'300px'}" :dropdownMatchSelectWidth="false">
    <a-select-option v-for="item in data" :key="item.Id" :value="item.Id" :title="item.Name+'('+item.Code+')'">
      <a-row>
        <a-col :span="8">{{ item.Name }}</a-col>
        <a-col :span="8">{{ item.Code }}</a-col>
        <a-col :span="8">
          <EnumName code="Bas_Storer_Type" :value="item.Type"></EnumName>
        </a-col>
      </a-row>
    </a-select-option>
  </a-select>
</template>

<script>
import { mapGetters } from 'vuex'
import MainSvc from '@/api/Bas/Bas_StorerSvc'
import EnumName from '@/components/CF/EnumName'
export default {
  components: {
    EnumName
  },
  props: {
    value: { type: String, required: true, default: '' },
    type: { type: Array, required: false, default: () => { return [] } }
  },
  data() {
    return {
      curValue: null,
      timeout: null,
      keyword: null,
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
    loadData() {
      MainSvc.GetPage({
        PageNo: 1,
        PageSize: 10,
        SortField: 'Code',
        Search: {
          Id: this.curValue,
          Keyword: this.keyword,
          WhseId: this.defaultWhseId,
          Type: this.type
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
