<template>
  <div :class="wrpCls">
    <SelectWhse :class="prefixCls"></SelectWhse>
    <avatar-dropdown :menu="showMenu" :current-user="currentUser" :class="prefixCls" />
    <!-- <select-lang :class="prefixCls" /> -->
  </div>
</template>

<script>
import storage from 'store'
import CacheWorker from '@/utils/cacheWorker'
import moment from 'moment'
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
    CacheWorker.Start(skuInit, (db) => {
      var version = moment().format('YYYYMMDD')
      storage.set(`Worker_Bas_Sku_Version`, version)
      db.transaction((ctx) => {
        const sql = `CREATE TABLE IF NOT EXISTS Bas_Sku (
  Id text NOT NULL,
  WhseId text NOT NULL,
  StorerId text NOT NULL,
  Code text NOT NULL,
  Name text NOT NULL,
  Spec text,
  LotStgId text,
  BaseUom text,
  Price real,
  RotateBy text,
  RotateType text,
  AllocStgId text,
  RackLife integer,
  Status text NOT NULL,
  Popular integer,
  PRIMARY KEY (Id)
)`
        ctx.executeSql(sql)
        const indexSql = `CREATE INDEX QueryIndex
ON Bas_Sku (
  WhseId COLLATE NOCASE ASC,
  StorerId COLLATE NOCASE ASC,
  Code COLLATE NOCASE ASC,
  Name COLLATE NOCASE ASC,
  Popular COLLATE NOCASE DESC
)`
        ctx.executeSql(indexSql)
      })
    })
  },
  beforeDestroy() {
    CacheWorker.Stop('Bas_Sku')
  },
  mounted() {
    this.currentUser = {
      name: this.$store.getters.nickname
    }
  }
}
</script>
