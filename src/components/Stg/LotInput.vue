<template>
  <div>
    <a-input-number v-model="curVal" v-if="sku && sku.LotStg[`${name}Type`]==='Number'" v-bind="$attrs" style="width:100%" size="small" />
    <a-date-picker v-model="curVal" v-else-if="sku && sku.LotStg[`${name}Type`]==='Date'" v-bind="$attrs" valueFormat="YYYY-MM-DD" size="small" />
    <EnumSelect :code="sku.LotStg[`${name}Enum`]" v-model="curVal" v-else-if="sku && sku.LotStg[`${name}Type`]==='Enum'" v-bind="$attrs" style="width:100%" size="small"></EnumSelect>
    <a-input v-else v-model="curVal" v-bind="$attrs" size="small" />
  </div>
</template>

<script>
import EnumSelect from '@/components/CF/EnumSelect'
export default {
  components: {
    EnumSelect
  },
  props: {
    name: { type: String, required: true },
    sku: { type: Object, required: true },
    value: { type: String, required: true, default: '' }
  },
  data() {
    return {
      curVal: ''
    }
  },
  watch: {
    value(newVal) {
      if (this.curVal !== newVal) {
        this.curVal = this.value
      }
    },
    curVal(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit('input', newVal)
      }
    }
  },
  mounted() {
    this.curVal = this.value
  }
}
</script>

<style>
</style>
