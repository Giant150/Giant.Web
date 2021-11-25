<template>
  <a-select v-model="curValue" :placeholder="enumData.Name" @change="handleChange" @select="handleSelected" v-bind="$attrs">
    <a-select-option v-for="item in enumData.EnumItems" :key="item.Code" :value="item.Code">
      <span v-if="color" :style="{color:item.Color}">{{ item.Name }}</span>
      <span v-else>{{ item.Name }}</span>
    </a-select-option>
  </a-select>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    code: { type: String, required: true },
    value: String,
    color: { type: Boolean, required: false, default: false }
  },
  data() {
    return {
      curValue: undefined,
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
        this.$emit('input', undefined)
      }
    },
    handleSelected(val) {
      this.$emit('input', val)
      var item = this.enumData.EnumItems.find(w => w.Code === val)
      this.$emit('select', val, item)
    }
  }
}
</script>

<style>
</style>
