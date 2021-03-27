<template>
  <a-dropdown v-if="showWhse" placement="bottomRight">
    <span class="ant-pro-account-avatar">
      <a-avatar size="small" icon="appstore" class="antd-pro-global-header-index-avatar" />
      <span>{{ curWhse.Name }}({{ curWhse.Code }})</span>
    </span>
    <template v-slot:overlay>
      <a-menu class="ant-pro-drop-down menu">
        <a-menu-item v-for="item in listWhse" :key="item.Id" @click="handleWhse(item)">
          <a-icon type="appstore" />
          {{ item.Name }}({{ item.Code }})
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <span v-else>
    <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
  </span>
</template>

<script>
import WhseSvc from '@/api/Bas/Bas_WhseSvc'
import UserSvc from '@/api/Sys/Sys_UserSvc'
import { mapMutations, mapGetters } from 'vuex'
export default {
  data() {
    return {
      listWhse: []
    }
  },
  computed: {
    ...mapGetters({
      defaultWhseId: 'whseId',
      defaultStorerId: 'storerId'
    }),
    curWhse() {
      return this.listWhse.find(w => w.Id === this.defaultWhseId)
    },
    showWhse() {
      return this.listWhse.findIndex(w => w.Id === this.defaultWhseId) >= 0
    }
  },
  mounted() {
    WhseSvc.GetByUser().then(result => {
      this.listWhse = result.Data
    })
  },
  methods: {
    ...mapMutations({ setWhse: 'SET_WHSE' }),
    handleWhse(record) {
      this.setWhse(record.Id)
      UserSvc.UpdateCurWhse(record.Id).then(result => {
        this.$router.go(0)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  /deep/ .action {
    margin-right: 8px;
  }
  /deep/ .ant-dropdown-menu-item {
    min-width: 160px;
  }
}
</style>
