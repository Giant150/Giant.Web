<template>
  <a-select v-model="curValue" :placeholder="enumData.Name" @change="handleChange" @select="handleSelected" v-bind="$attrs">
    <a-select-option v-for="item in enumData.EnumItems" :key="item.Code" :value="item.Code">{{ item.Name }}</a-select-option>
  </a-select>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
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
  computed: {
    ...mapGetters({
      defaultWhseId: 'whseId',
      defaultStorerId: 'storerId'
    })
  },
  watch: {
    value(value) {
      this.curValue = value
    }
  },
  mounted() {
    this.curValue = this.value
    this.getEnum({ whseId: this.defaultWhseId, code: this.code }).then(result => {
      this.enumData = result
    })
  },
  methods: {
    ...mapActions({ getEnum: 'getEnum' }),
    handleChange(val) {
      if (!val) {
        this.$emit('input', '')
      }
    },
    handleSelected(val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style>
</style>
