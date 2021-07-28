<template>
  <a-select v-model="curVal" @select="handlerSelect">
    <a-select-option v-for="distract in list" :key="distract.Id" :value="distract.Id">{{
      distract.Name
    }}</a-select-option>
  </a-select>
</template>

<script>
import { mapGetters } from 'vuex'
import MainSvc from '@/api/CF/CF_DistrictSvc'
export default {
  components: {},
  props: {
    value: { type: String, required: true },
    parent: { type: String, required: true }
  },
  data() {
    return {
      curVal: '',
      list: []
    }
  },
  mounted() {
        if (this.parent) {
        MainSvc.Get(this.parent).then(resJson => {
            this.list = resJson.Data
        })
        }
        this.curVal = this.value
    },
  computed: {
    ...mapGetters({
      defaultWhseId: 'whseId',
      defaultStorerId: 'storerId'
    })
  },
  watch: {
    value(newVal) {
      this.curVal = newVal
    },
    parent(newPid) {
      // this.curVal = ''
      // this.$emit('input', '')
      MainSvc.Get(this.parent).then(resJson => {
        this.list = resJson.Data
      })
    }
  },
  methods: {
    handlerSelect(val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style>
</style>
