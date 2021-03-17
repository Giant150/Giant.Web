<template>
  <a-modal title="权限管理" :width="640" :visible="visible" :confirmLoading="loading" @ok="handleSubmit" @cancel="()=>{this.visible=false}" :bodyStyle="{height:'500px',overflow: 'scroll'}">
    <a-tree :treeData="treeData" :replaceFields="replaceFields" :checkable="true" v-model="checkedKeys" :checkStrictly="checkStrictly" @check="handleCheck"></a-tree>
  </a-modal>
</template>

<script>
import MainSvc from '@/api/Sys/Sys_RoleSvc'
export default {
  components: {
    MainSvc
  },
  data() {
    return {
      visible: false,
      loading: false,
      roleId: '',
      treeData: [],
      replaceFields: { children: 'Children', title: 'Text', key: 'Id' },
      checkedKeys: { checked: [], halfChecked: [] },
      checkedNodes: [],
      checkStrictly: true
    }
  },
  methods: {
    openForm(roleId) {
      this.roleId = roleId
      this.visible = true
      this.loading = false
      MainSvc.GetMenu().then(result => {
        this.treeData = result.Data
        MainSvc.GetAccess(roleId).then(result => {
          this.checkedKeys = result.Data
        })
      })
    },
    handleCheck(keys, e) {
      this.checkedNodes = e.checkedNodes.map((val) => { return { Key: val.key, Value: val.data.props.Value } })
    },
    handleSubmit() {
      if (this.checkedNodes.length === 0) {
        return
      }
      this.loading = true
      MainSvc.SaveAccess(this.roleId, this.checkedNodes).then(result => {
        this.loading = false
        if (result.Success) {
          this.$message.success(result.Msg)
          this.visible = false
        } else {
          this.$message.error(result.Msg)
        }
      })
    }
  }
}
</script>

<style>
</style>
