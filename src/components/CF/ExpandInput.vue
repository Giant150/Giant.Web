<template>
  <div>
    <a-input-number v-model="curVal" :placeholder="name" v-if="code.startsWith('ExpInt') || code.startsWith('ExpNum')" style="width:100%" v-bind="$attrs" />
    <a-date-picker v-model="curVal" :placeholder="name" v-else-if="code.startsWith('ExpDate')" valueFormat="YYYY-MM-DD" v-bind="$attrs" />
    <a-input v-else v-model="curVal" :placeholder="name" v-bind="$attrs" />
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    code: String,
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
