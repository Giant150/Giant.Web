<template>
  <a-tree-select v-model="curVal" :treeData="treeData" :replaceFields="replaceFields" @change="onChange" v-bind="$attrs"></a-tree-select>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {},
  props: {
    value: { type: String, required: true, default: '' },
    table: { type: String, required: true }
  },
  data() {
    return {
      curVal: '',
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
    onChange(value, node, extra) {
      this.$emit('input', value)
      this.$emit('change', value, node, extra)
    }
  }
}
</script>

<style>
</style>
