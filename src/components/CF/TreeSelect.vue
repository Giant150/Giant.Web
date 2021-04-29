<template>
  <a-tree-select v-model="curVal" :treeData="treeData" :replaceFields="replaceFields" @select="onSelect" v-bind="$attrs"></a-tree-select>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {},
  props: {
    value: String,
    table: String
  },
  data() {
    return {
      curVal: undefined,
      treeData: [],
      replaceFields: { children: 'Children', title: 'Name', key: 'Id', value: 'Id' }
    }
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
    }
  },
  mounted() {
    this.curVal = this.value
    this.$http.get(`/api/${this.table}/GetTree?whseId=${this.defaultWhseId}`).then(result => {
      this.treeData = result.Data
    })
  },
  methods: {
    onSelect(value, node, extra) {
      this.$emit('input', value)
      this.$emit('select', value, node.dataRef, extra)
    }
  }
}
</script>

<style>
</style>
