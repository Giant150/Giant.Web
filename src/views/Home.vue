<template>
  <div>
    <a-row>
      <a-col :span="8">
        <ChartCard :loading="loading" title="库存总数量" :total="invSummary.Qty">
          <a-tooltip title="当前仓库物料总数量" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <Trend flag="up" style="margin-right: 16px;"><span slot="term">已分配数量:</span><span>{{ invSummary.QtyAllocated }}</span></Trend>
            <Trend flag="up" style="margin-right: 16px;"><span slot="term">已拣货数量:</span><span>{{ invSummary.QtyPicked }}</span></Trend>
          </div>
          <template slot="footer">当前可用数量:<span> {{ invSummary.Qty - invSummary.QtyAllocated - invSummary.QtyPicked }}</span></template>
        </ChartCard>
      </a-col>
      <a-col :span="8">
        <ChartCard :loading="loading" title="入库帐龄" :total="storageLedgerAge | totalAge | NumberFormat">
          <a-tooltip title="7天内入库数量统计" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div class="antv-chart-mini">
            <div class="chart-wrapper" :style="{ height: 46 }">
              <v-chart :force-fit="true" :height="100" :data="storageChartData" :padding="[36, 0, 18, 0]">
                <v-tooltip />
                <v-smooth-area position="x*y" />
              </v-chart>
            </div>
          </div>
          <template slot="footer">当天入库数量:<span> {{ storageLedgerAge.Day0 | NumberFormat }}</span></template>
        </ChartCard>
      </a-col>
      <a-col :span="8">
        <ChartCard :loading="loading" title="出库帐龄" :total="outLedgerAge | totalAge | NumberFormat">
          <a-tooltip title="7天内出库数量统计" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div class="antv-chart-mini">
            <div class="chart-wrapper" :style="{ height: 46 }">
              <v-chart :force-fit="true" :height="100" :data="outChartData" :padding="[36, 0, 18, 0]">
                <v-tooltip />
                <v-smooth-area position="x*y" />
              </v-chart>
            </div>
          </div>
          <template slot="footer">当天出库数量:<span> {{ Math.abs(outLedgerAge.Day0) | NumberFormat }}</span></template>
        </ChartCard>
      </a-col>
    </a-row>
    <a-divider>更新历史</a-divider>
    <a-list item-layout="horizontal" rowKey="node_id" :dataSource="listCommit" :grid="{gutter: 24, lg: 4, md: 3, sm: 1, xs: 1}">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-card :hoverable="true">
          <a-card-meta>
            <a slot="title" :href="item.committer?item.committer.html_url:''" target="_blank">{{ item.commit.committer.name }}</a>
            <a-avatar class="card-avatar" slot="avatar" :src="item.committer?item.committer.avatar_url:''" size="large" />
            <div class="meta-content" slot="description" style="height:50px">
              <h1>{{ item.commit.message }}</h1>
            </div>
          </a-card-meta>
          <template class="ant-card-actions" slot="actions">
            <a :href="'mailto:'+item.commit.committer.email" target="_blank">{{ item.commit.committer.email }}</a>
            <a :href="item.html_url" target="_blank">{{ moment(item.commit.committer.date).format('lll') }}</a>
          </template>
        </a-card>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import InventorySvc from '@/api/Rpt/Rpt_InventorySvc'
import LedgerSvc from '@/api/Rpt/Rpt_LedgerSvc'
import {
  ChartCard,
  MiniArea,
  MiniBar,
  MiniProgress,
  RankList,
  Bar,
  Trend,
  NumberInfo,
  MiniSmoothArea
} from '@/components'
import { mapGetters } from 'vuex'
export default {
  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar,
    Trend,
    NumberInfo,
    MiniSmoothArea
  },
  data() {
    return {
      loading: false,
      invSummary: { Qty: 0, QtyAllocated: 0, QtyPicked: 0 },
      ledger: [],
      commits: []
    }
  },
  computed: {
    ...mapGetters({
      defaultWhseId: 'whseId',
      defaultStorerId: 'storerId'
    }),
    listCommit() {
      return this.commits.slice(0).sort((a, b) => new Date(a) - new Date(b))
    },
    storageLedgerAge() {
      var item = this.ledger.find(w => w.Category === 'Storage')
      if (item) return item
      else return { Category: 'Storage', Day0: 0, Day1: 0, Day2: 0, Day3: 0, Day4: 0, Day5: 0, Day6: 0 }
    },
    storageChartData() {
      var item = this.storageLedgerAge
      return [
        { x: moment().add(0, 'days').format('YYYY-MM-DD'), y: item.Day0 },
        { x: moment().add(-1, 'days').format('YYYY-MM-DD'), y: item.Day1 },
        { x: moment().add(-2, 'days').format('YYYY-MM-DD'), y: item.Day2 },
        { x: moment().add(-3, 'days').format('YYYY-MM-DD'), y: item.Day3 },
        { x: moment().add(-4, 'days').format('YYYY-MM-DD'), y: item.Day4 },
        { x: moment().add(-5, 'days').format('YYYY-MM-DD'), y: item.Day5 },
        { x: moment().add(-6, 'days').format('YYYY-MM-DD'), y: item.Day6 }
      ]
    },
    outLedgerAge() {
      var item = this.ledger.find(w => w.Category === 'Out')
      if (item) return item
      else return { Category: 'Out', Day0: 0, Day1: 0, Day2: 0, Day3: 0, Day4: 0, Day5: 0, Day6: 0 }
    },
    outChartData() {
      var item = this.outLedgerAge
      return [
        { x: moment().add(0, 'days').format('YYYY-MM-DD'), y: Math.abs(item.Day0) },
        { x: moment().add(-1, 'days').format('YYYY-MM-DD'), y: Math.abs(item.Day1) },
        { x: moment().add(-2, 'days').format('YYYY-MM-DD'), y: Math.abs(item.Day2) },
        { x: moment().add(-3, 'days').format('YYYY-MM-DD'), y: Math.abs(item.Day3) },
        { x: moment().add(-4, 'days').format('YYYY-MM-DD'), y: Math.abs(item.Day4) },
        { x: moment().add(-5, 'days').format('YYYY-MM-DD'), y: Math.abs(item.Day5) },
        { x: moment().add(-6, 'days').format('YYYY-MM-DD'), y: Math.abs(item.Day6) }
      ]
    }
  },
  filters: {
    totalAge(item) {
      return Math.abs(item.Day0 + item.Day1 + item.Day2 + item.Day3 + item.Day4 + item.Day5 + item.Day6)
    },
    desc(item) {
      return `提交人:${item.commit.committer.name}(${item.commit.committer.email}) 提交时间:${item.commit.committer.date}`
    }
  },
  mounted() {
    this.loading = true
    this.getInvSummary()
    this.getLedgerAge()
    this.getGitLog()
    this.loading = false
  },
  methods: {
    moment,
    getInvSummary() {
      InventorySvc.GetInvSummary(this.defaultWhseId).then(result => {
        this.invSummary = result.Data
      })
    },
    getLedgerAge() {
      LedgerSvc.GetLedgerAge(this.defaultWhseId, moment().format('YYYY-MM-DD')).then(result => {
        this.ledger = result.Data
      })
    },
    getGitLog() {
      this.commits = []
      axios({
        url: '/repos/LiuJu150/Giant.Web/commits?per_page=6',
        method: 'get',
        baseURL: 'https://api.github.com',
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      }).then(result => {
        if (result.status === 200) {
          this.commits.push(result.data)
        }
      })
      axios({
        url: '/repos/LiuJu150/Giant.RF/commits?per_page=6',
        method: 'get',
        baseURL: 'https://api.github.com',
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      }).then(result => {
        if (result.status === 200) {
          this.commits.push(result.data)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.antv-chart-mini {
  position: relative;
  width: 100%;

  .chart-wrapper {
    position: absolute;
    bottom: -28px;
    width: 100%;

    /*    margin: 0 -5px;
    overflow: hidden;*/
  }
}
</style>
