<template>
  <a-auto-complete v-model="curValue" v-bind="$attrs" @search="handlerSearch" @select="handlerSelect" optionLabelProp="title" :dropdownMenuStyle="{minWidth:'300px'}" :dropdownMatchSelectWidth="false">
    <template slot="dataSource">
      <a-select-option v-for="item in data" :key="item.Id" :value="item.Id" :title="item.Name+'('+item.Code+')'">
        <a-row>
          <a-col :span="8">{{ item.Name }}</a-col>
          <a-col :span="8">{{ item.Code }}</a-col>
          <a-col :span="8">
            <EnumName code="Bas_Storer_Type" :value="item.Type"></EnumName>
          </a-col>
        </a-row>
      </a-select-option>
    </template>
  </a-auto-complete>
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
      this.curValue = newVal
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
          Type: this.type
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
