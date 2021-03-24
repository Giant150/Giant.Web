<template>
  <a-input v-model="curVal" v-bind="$attrs" @change="$emit('input', curVal)">
    <a-icon slot="addonAfter" type="redo" title="生成" @click="Generate" />
  </a-input>
</template>

<script>
import MainSvc from '@/api/CF/CF_CodeTypeSvc'
export default {
  components: {
    MainSvc
  },
  props: {
    value: { type: String, required: true },
    code: { type: String, required: true },
    para: { type: Object, required: false, default: () => { return {} } }
  },
  data() {
    return {
      curVal: ''
    }
  },
  mounted() {
    this.curVal = this.value
  },
  watch: {
    value(newVal) {
      this.curVal = newVal
    }
  },
  methods: {
    Generate() {
      MainSvc.Generate(this.code, this.para).then(result => {
        this.curVal = result.Data
        this.$emit('input', this.curVal)
      })
    }
  }
}
</script>

<style>
</style>
