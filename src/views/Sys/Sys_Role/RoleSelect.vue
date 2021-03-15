<template>
  <a-modal title="角色选择" :width="640" :visible="visible" :confirmLoading="loading" @ok="handleSelect()" @cancel="()=>{this.visible=false}">
    <RoleList :inModal="true" @onSelectChange="onSelectChange"></RoleList>
  </a-modal>
</template>

<script>
import RoleList from './List'
export default {
  components: {
    RoleList
  },
  data() {
    return {
      loading: false,
      visible: false,
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  methods: {
    openSelect() {
      this.visible = true
    },
    handleSelect() {
      this.$emit('select', this.selectedRowKeys, this.selectedRows)
      this.visible = false
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  }
}
</script>

<style>
</style>
