<template>
  <a-auto-complete v-model="curValue" v-bind="$attrs" @search="handlerSearch" @select="handlerSelect" optionLabelProp="title" :dropdownMenuStyle="{minWidth:'300px'}" :dropdownMatchSelectWidth="false">
    <template slot="dataSource">
      <a-select-option v-for="item in data" :key="item.Id" :value="item.Id" :title="item.Code">
        <a-row>
          <a-col :span="12">{{ item.Code }}</a-col>
          <a-col :span="12">
            <EnumName code="Bas_Loc_Type" :value="item.Type"></EnumName>
          </a-col>
        </a-row>
      </a-select-option>
    </template>
  </a-auto-complete>
</template>

<script>
import { mapGetters } from 'vuex'
import MainSvc from '@/api/Bas/Bas_LocSvc'
import EnumName from '@/components/CF/EnumName'
export default {
  components: {
    EnumName
  },
  props: {
    value: { type: String, required: true },
    type: { type: String, required: false, default: '' }
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
