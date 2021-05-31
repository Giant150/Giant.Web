<template>
  <a-modal :visible="visible" title="库存选择" okText="选择" width="70%" @ok="handleChoose" @cancel="()=>{this.visible=false}" :bodyStyle="{padding:0}">
    <InvList ref="invList" :choose="true" :type="type" :query="query"></InvList>
  </a-modal>
</template>

<script>
import InvList from '@/views/Inv/Inv_Inventory/List'
export default {
  components: {
    InvList
  },
  props: {
    type: String
  },
  data() {
    return {
      query: {},
      visible: false
    }
  },
  methods: {
    choose(query) {
      this.query = query
      this.visible = true
    },
    handleChoose() {
      var selectRows = this.$refs.invList.selectedRows
      this.visible = false
      this.$emit('choose', selectRows)
    }
  }
}
</script>

<style>
</style>
