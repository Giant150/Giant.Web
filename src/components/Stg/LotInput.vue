<template>
  <div>
    <a-input-number v-model="curVal" v-if="sku && sku.LotStg[`${name}Type`]==='Number'" style="width:100%" :size="size" />
    <a-date-picker v-model="curVal" v-else-if="sku && sku.LotStg[`${name}Type`]==='Date'" valueFormat="YYYY-MM-DD" :size="size" />
    <EnumSelect :code="sku.LotStg[`${name}Enum`]" v-model="curVal" v-else-if="sku && sku.LotStg[`${name}Type`]==='Enum'" style="width:100%" :size="size"></EnumSelect>
    <a-input v-else v-model="curVal" :size="size" />
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
    value: { type: String, required: true, default: '' },
    size: { type: String, default: '' }
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
