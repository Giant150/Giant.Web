<template>
  <a-select v-model="curValue" @change="handleChange" @select="handleSelected" v-bind="$attrs">
    <a-select-option v-for="item in listData" :key="item.Uom" :value="item.Uom">{{ item.Name }}</a-select-option>
  </a-select>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import MainSvc from '@/api/Bas/Bas_SkuUomSvc'
export default {
  props: {
    sku: String,
    value: String
  },
  data() {
    return {
      curValue: undefined,
      listData: []
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
      if (newVal !== this.curValue) {
        this.curValue = newVal
      }
      var item = this.listData.find(w => w.Uom === newVal)
      if (item) this.$emit('select', newVal, item)
    },
    sku() {
      this.getListData()
    }
  },
  mounted() {
    this.curValue = this.value
    this.getListData()
  },
  methods: {
    ...mapActions({ getEnum: 'getEnum' }),
    getListData() {
      if (!this.sku) return
      MainSvc.GetBySku(this.sku).then(result => {
        this.listData = result.Data
        if (!this.curValue) {
          var plUom = this.listData.find(w => w.IsTrayUom)
          if (plUom) {
            this.curValue = plUom.Uom
            this.handleSelected(plUom.Uom)
          } else {
            var eaUom = this.listData.find(w => w.IsBasUom)
            if (eaUom) {
              this.curValue = eaUom.Uom
              this.handleSelected(eaUom.Uom)
            }
          }
        } else this.handleSelected(this.curValue)
      })
    },
    handleChange(val) {
      if (!val) {
        this.$emit('input', undefined)
      }
    },
    handleSelected(val) {
      this.$emit('input', val)
      var item = this.listData.find(w => w.Uom === val)
      this.$emit('select', val, item)
    }
  }
}
</script>

<style>
</style>
