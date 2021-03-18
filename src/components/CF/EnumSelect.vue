<template>
  <a-select v-model="curValue" :placeholder="enumData.Name" @select="handleSelected" v-bind="$attrs">
    <a-select-option v-for="item in enumData.EnumItems" :key="item.Code" :value="item.Code">{{ item.Name }}</a-select-option>
  </a-select>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    code: { type: String, required: true },
    value: { type: String, required: false, default: '' }
  },
  data() {
    return {
      curValue: '',
      enumData: {}
    }
  },
  watch: {
    value(value) {
      this.curValue = value
    }
  },
  mounted() {
    this.curValue = this.value
    var storeData = this.$store.getters.getEnum(this.code)
    if (!storeData) {
      this.setEnum(this.code).then(result => {
        this.enumData = result
      })
    } else {
      this.enumData = storeData
    }
  },
  methods: {
    ...mapActions({ setEnum: 'setEnum' }),
    handleSelected(val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style>
</style>
