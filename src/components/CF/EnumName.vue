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
      var item = this.enumData.EnumItems.find(v => v.Code === this.value)
      if (item) {
        return item.Name
      } else {
        return ''
      }
    }
  },
  mounted() {
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
    ...mapActions({ setEnum: 'setEnum' })
  }
}
</script>

<style>
</style>
