<template>
  <a-select v-model="curValue" @search="handlerSearch" @change="(val)=>{if(!val){this.$emit('input', undefined)}}" @select="handlerSelect" optionLabelProp="title" v-bind="$attrs" :showSearch="true" :filterOption="false" style="width: 100%" :dropdownMenuStyle="{minWidth:'300px'}" :dropdownMatchSelectWidth="false">
    <a-icon slot="suffixIcon" type="copy" @click="copy(selected?selected.Code:'')" title="复制编码" />
    <a-select-option v-for="item in data" :key="item.Id" :value="item.Id" :title="item.Code+'('+item.Name+')'" :disabled="item.Status==='Disable'">
      <a-row type="flex" justify="start" :gutter="10">
        <a-col flex="auto">{{ item.Code }}</a-col>
        <a-col flex="auto">{{ item.Name }}</a-col>
        <a-col flex="auto">{{ item.Spec }}</a-col>
        <a-col flex="auto">
          <a-button type="dashed" shape="circle" icon="copy" title="复制编码" size="small" @click="copy(item.Code)" />
        </a-col>
      </a-row>
    </a-select-option>
  </a-select>
</template>

<script>
import CacheWorker from '@/utils/cacheWorker'
import storage from 'store'
import moment from 'moment'
import copy from 'copy-to-clipboard'
import { mapGetters } from 'vuex'
import MainSvc from '@/api/Bas/Bas_SkuSvc'
import EnumName from '@/components/CF/EnumName'

export default {
  components: {
    EnumName
  },
  props: {
    value: String,
    storer: String
  },
  data() {
    return {
      curValue: undefined,
      timeout: undefined,
      keyword: undefined,
      data: []
    }
  },
  computed: {
    ...mapGetters({
      defaultWhseId: 'whseId',
      defaultStorerId: 'storerId'
    }),
    selected() {
      return this.data.find(w => w.Id === this.curValue)
    }
  },
  watch: {
    value(newVal) {
      if (this.curValue !== newVal) {
        this.curValue = newVal
        this.loadData()
      }
    },
    storer(newVal) {
      if (this.curStorer !== newVal) {
        this.curStorer = newVal
        this.loadData()
      }
    }
  },
  created() {
    this.curValue = this.value
    this.curStorer = this.storer
    this.loadData()
  },
  methods: {
    copy,
    loadData() {
      const last = storage.get(`Worker_Bas_Sku_LastModifyTime`) || '2000-01-01'
      if (moment(last, 'YYYY-MM-DD HH:mm:ss').isSameOrAfter(moment().format('YYYY-MM-DD'))) {
        var db = window.openDatabase(CacheWorker.Name, CacheWorker.Version, CacheWorker.Name, CacheWorker.Size)
        db.transaction((ctx) => {
          var sql = `SELECT * FROM (SELECT * FROM Bas_Sku WHERE WhseId='${this.defaultWhseId}'`
          if (this.storer) sql += ` AND StorerId='${this.storer}'`
          if (this.keyword) sql += ` AND (Code LIKE '%${this.keyword}%' OR Name LIKE '%${this.keyword}%')`
          sql += ' ORDER BY Popular DESC LIMIT 10)'
          if (this.curValue) sql += ` UNION SELECT * FROM Bas_Sku WHERE Id='${this.curValue}' ORDER BY Popular DESC`
          console.log('sql', sql)
          ctx.executeSql(sql, [], (c, r) => {
            var rows = r.rows
            var listData = []
            for (var i = 0; i < rows.length; i++) {
              listData.push({ ...rows[i] })
            }
            this.data = listData
          })
        })
      } else {
        MainSvc.GetBySearch(this.defaultWhseId, this.storer ? this.storer : '', this.curValue ? this.curValue : '', this.keyword ? this.keyword : '').then(result => {
          this.data = result.Data
        })
      }
    },
    handlerSearch(val) {
      if (this.timeout) {
        clearTimeout(this.timeout)
        this.timeout = null
      }
      this.keyword = val
      this.timeout = setTimeout(this.loadData, 500)
    },
    handlerSelect(val) {
      this.$emit('input', val)
      var item = this.data.find(w => w.Id === val)
      this.$emit('select', val, item)
      MainSvc.IncrementPopular([val])
    }
  }
}
</script>

<style>
</style>
