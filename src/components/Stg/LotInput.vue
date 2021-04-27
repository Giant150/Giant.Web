<template>
  <div>
    <a-input-number v-model="curVal" v-if="sku && sku.LotStg[`${name}Type`]==='Number'" style="width:100%" v-bind="$attrs" />
    <a-date-picker v-model="curVal" v-else-if="sku && sku.LotStg[`${name}Type`]==='Date'" valueFormat="YYYY-MM-DD" v-bind="$attrs" />
    <EnumSelect :code="sku.LotStg[`${name}Enum`]" v-model="curVal" v-else-if="sku && sku.LotStg[`${name}Type`]==='Enum'" style="width:100%" v-bind="$attrs"></EnumSelect>
    <a-input v-else v-model="curVal" v-bind="$attrs" />
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
