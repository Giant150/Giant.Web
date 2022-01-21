<template>
  <div :class="wrpCls">
    <SelectWhse :class="prefixCls"></SelectWhse>
    <avatar-dropdown :menu="showMenu" :current-user="currentUser" :class="prefixCls" />
    <!-- <select-lang :class="prefixCls" /> -->
  </div>
</template>

<script>
import CacheWorker from '@/utils/cacheWorker'
import SelectWhse from '../Bas/SelectWhse'
import AvatarDropdown from './AvatarDropdown'
import { mapGetters } from 'vuex'
// import SelectLang from '@/components/SelectLang'

export default {
  name: 'RightContent',
  components: {
    AvatarDropdown,
    SelectWhse
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    },
    isMobile: {
      type: Boolean,
      default: () => false
    },
    topMenu: {
      type: Boolean,
      required: true
    },
    theme: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showMenu: true,
      currentUser: {}
    }
  },
  computed: {
    ...mapGetters({
      defaultWhseId: 'whseId',
      defaultStorerId: 'storerId',
      token: 'token'
    }),
    wrpCls() {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${(this.isMobile || !this.topMenu) ? 'light' : this.theme}`]: true
      }
    }
  },
  created() {
    const skuInit = { WhseId: this.defaultWhseId, BaseUrl: process.env.VUE_APP_API_BASE_URL, Token: this.token, EntityName: 'Bas_Sku' }
    CacheWorker.Start(skuInit)
    const locInit = { WhseId: this.defaultWhseId, BaseUrl: process.env.VUE_APP_API_BASE_URL, Token: this.token, EntityName: 'Bas_Loc' }
    CacheWorker.Start(locInit)
  },
  beforeDestroy() {
    CacheWorker.Stop('Bas_Sku')
    CacheWorker.Stop('Bas_Loc')
  },
  mounted() {
    this.currentUser = {
      name: this.$store.getters.nickname
    }
  }
}
</script>
