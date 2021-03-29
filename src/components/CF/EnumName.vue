<template>
  <span>{{ enumNameText }}</span>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
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
    ...mapGetters({
      defaultWhseId: 'whseId',
      defaultStorerId: 'storerId'
    }),
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
    this.getEnum(this.defaultWhseId, this.code).then(result => {
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
