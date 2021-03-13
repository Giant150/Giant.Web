<template>
  <a-tree-select v-model="curVal" :treeData="treeData" :replaceFields="replaceFields" @change="onChange" v-bind="$attrs"></a-tree-select>
</template>

<script>
import MainSvc from '@/api/Sys/Sys_OrgSvc'
export default {
  components: {
    MainSvc
  },
  props: {
    value: {
      type: String,
      required: true,
      default: ''
    }
  },
  watch: {
    value(newVal) {
      this.curVal = newVal
    }
  },
  mounted() {
    this.curVal = this.value
    MainSvc.GetTree().then(result => {
      this.treeData = result.Data
    })
  },
  data() {
    return {
      curVal: '',
      treeData: [],
      replaceFields: { children: 'Children', title: 'Name', key: 'Id', value: 'Id' }
    }
  },
  methods: {
    onChange(value, node, extra) {
      this.$emit('input', value)
      this.$emit('change', value, node, extra)
    }
  }
}
</script>

<style>
</style>
