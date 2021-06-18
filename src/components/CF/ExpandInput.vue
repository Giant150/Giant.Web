<template>
  <div>
    <a-input-number v-model="curVal" :placeholder="enumitem.Name" v-if="enumitem.Code.startsWith('ExpInt') || enumitem.Code.startsWith('ExpNum')" style="width:100%" v-bind="$attrs" />
    <a-date-picker v-model="curVal" :placeholder="enumitem.Name" v-else-if="enumitem.Code.startsWith('ExpDate')" valueFormat="YYYY-MM-DD" style="width:100%" v-bind="$attrs" />
    <EnumSelect v-model="curVal" :code="enumitem.Config" v-else-if="enumitem.Code.startsWith('ExpEnum')" v-bind="$attrs"></EnumSelect>
    <CommonSelect v-model="curVal" :table="enumitem.Config" v-else-if="enumitem.Code.startsWith('ExpSelect')" v-bind="$attrs"></CommonSelect>
    <a-input v-else v-model="curVal" :placeholder="enumitem.Name" v-bind="$attrs" />
  </div>
</template>

<script>
import EnumSelect from '@/components/CF/EnumSelect'
import CommonSelect from '@/components/CF/CommonSelect'
export default {
  components: {
    EnumSelect,
    CommonSelect
  },
  props: {
    enumitem: Object,
    value: [String, Number]
  },
  data() {
    return {
      curVal: undefined
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
