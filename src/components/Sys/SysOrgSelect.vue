<template>
  <a-tree-select v-model="curVal" :treeData="treeData" :replaceFields="replaceFields" @select="onSelect" v-bind="$attrs"></a-tree-select>
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
    onSelect(value, node, extra) {
      this.$emit('input', value)
      this.$emit('select', value, node, extra)
    }
  }
}
</script>

<style>
</style>
