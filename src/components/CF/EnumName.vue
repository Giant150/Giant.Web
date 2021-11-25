<template>
  <div>
    <a-tag v-if="color" :color="enumItem?enumItem.Color:''">{{ enumItem?enumItem.Name:'' }}</a-tag>
    <span v-else>{{ enumItem?enumItem.Name:'' }}</span>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    code: { type: String, required: true },
    value: { type: String, required: true },
    color: { type: Boolean, required: false, default: false }
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
    enumItem() {
      if (!this.enumData.EnumItems) return null
      return this.enumData.EnumItems.find(v => v.Code === this.value)
    }
  },
  mounted() {
    this.getEnum({ whseId: this.defaultWhseId, code: this.code }).then(result => {
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
