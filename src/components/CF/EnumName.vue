<template>
  <span>{{ enumNameText }}</span>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    code: { type: String, required: true },
    value: { type: String, required: true }
  },
  data() {
    return {
      enumData: {}
    }
  },
  computed: {
    enumNameText() {
      if (!this.enumData.EnumItems) return ''
      var item = this.enumData.EnumItems.find(v => v.Code === this.value)
      if (item) {
        return item.Name
      } else {
        return ''
      }
    }
  },
  mounted() {
    this.getEnum(this.code).then(result => {
      this.enumData = result
    })
  },
  methods: {
    ...mapActions({ getEnum: 'getEnum' })
  }
}
</script>

<style>
</style>
