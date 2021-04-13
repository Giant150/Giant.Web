<template>
  <a-auto-complete v-model="curValue" v-bind="$attrs" @search="handlerSearch" @change="(val)=>{if(!val){this.$emit('input', '')}}" @select="handlerSelect" optionLabelProp="title" :dropdownMenuStyle="{minWidth:'300px'}" :dropdownMatchSelectWidth="false">
    <template slot="dataSource">
      <a-select-option v-for="item in data" :key="item.Id" :value="item.Id" :title="item.Code">
        <a-row>
          <a-col :span="8">{{ item.Name }}</a-col>
          <a-col :span="8">{{ item.Code }}</a-col>
          <a-col :span="8">{{ item.Storer.Name }}</a-col>
        </a-row>
      </a-select-option>
    </template>
  </a-auto-complete>
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
    value: { type: String, required: true, default: '' },
    storer: { type: String, required: false, default: '' }
  },
  data() {
    return {
      curValue: null,
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
  mounted() {
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
          StorerId: this.storer
        }
      }).then(result => {
        this.data = result.Data
      })
    },
    handlerSearch(val) {
      this.keyword = val
      this.loadData()
    },
    handlerSelect(val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style>
</style>
