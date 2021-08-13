<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="货主">
              <StorerSelect v-model="queryParam.StorerId" :type="['Storer']"></StorerSelect>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="批次属性">
              <EnumSelect code="Bas_Lot_Field" v-model="queryParam.group" ></EnumSelect>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="物料">
              <SkuSelect v-model="queryParam.SkuId" :storer="queryParam.StorerId"></SkuSelect>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" v-action:Query @click="()=>{this.$refs.table.refresh()}">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm()">重置</a-button>
              <a-button style="margin-left: 8px" v-action:Export icon="export" @click="handleExport()">导出</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table ref="table" size="default" rowKey="LotCode" :columns="columns" :data="loadData" :rowSelection="rowSelection" showPagination="auto">
    </s-table>
  </a-card>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { STable } from '@/components'
import MainSvc from '@/api/Rpt/Rpt_InvSkuLotSvc'
import EnumSelect from '@/components/CF/EnumSelect'
import EnumName from '@/components/CF/EnumName'
import StorerSelect from '@/components/Bas/StorerSelect'
import SkuSelect from '@/components/Bas/SkuSelect'
import LocSelect from '@/components/Bas/LocSelect'

const columns = [
   { title: '货主编码', dataIndex: 'StorerCode', sorter: true },
   { title: '货主名称', dataIndex: 'StorerName', sorter: true },
   { title: '批次属性', dataIndex: 'LotCode', sorter: true },
   { title: '物料编码', dataIndex: 'SkuCode', sorter: true },
   { title: '物料名称', dataIndex: 'SkuName', sorter: true },
   { title: '库存数量', dataIndex: 'Qty', sorter: true },
   { title: '已分配', dataIndex: 'QtyAllocated' },
   { title: '已拣货', dataIndex: 'QtyPicked' }
]

export default {
  components: {
    STable,
    MainSvc,
    EnumSelect,
    EnumName,
    StorerSelect,
    SkuSelect,
    LocSelect
  },
  data() {
    this.columns = columns
    return {
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: { WhseId: '', StorerId: '', LotId: '', SkuId: '', group: 'LotCode' },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        this.queryParam.WhseId = this.defaultWhseId
        var _query = Object.assign({}, { ...this.queryParam })
        for (const key in _query) {
          if (moment.isMoment(_query[key])) {
            _query[key] = _query[key].format('YYYY-MM-DD')
          }
        }
        const requestParameters = Object.assign({ sortField: 'StorerCode', sortOrder: 'asc', Search: _query }, parameter)
        console.log('loadData request parameters:', requestParameters)
        return MainSvc.GetSummary(requestParameters)
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
  },
  created() {
    this.resetSearchForm()
  },
  computed: {
    ...mapGetters({
      defaultWhseId: 'whseId',
      defaultStorerId: 'storerId'
    }),
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    moment,
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    resetSearchForm() {
      this.queryParam = { WhseId: this.defaultWhseId, StorerId: this.defaultStorerId, LotId: '', SkuId: '', group: 'Code' }
    },
    handleExport() {
      this.queryParam.WhseId = this.defaultWhseId
      var _query = Object.assign({}, { ...this.queryParam })
      for (const key in _query) {
        if (moment.isMoment(_query[key])) {
          _query[key] = _query[key].format('YYYY-MM-DD')
        }
      }
      MainSvc.Export(_query).then(result => {
        if (result.Success) {
          var fileName = result.Data.substring(result.Data.lastIndexOf('/') + 1)
          var filePath = `${process.env.VUE_APP_API_BASE_URL}${result.Data}`
          console.log('handleExport', fileName, filePath)
          try {
            var elem = document.createElement('a')
            elem.download = fileName
            elem.href = filePath
            elem.style.display = 'none'
            document.body.appendChild(elem)
            elem.click()
            document.body.removeChild(elem)
          } catch (e) {
            this.$message.error('下载异常！')
          }
        } else {
          this.$message.error(result.Msg)
        }
      })
    }
  }
}
</script>
