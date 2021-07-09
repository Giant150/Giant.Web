<template>
  <a-drawer title="库存盘点" placement="right" width="60%" :visible="visible" @close="()=>{this.visible=false}" :maskClosable="false" :body-style="{ paddingBottom: '80px' }">
    <a-spin :spinning="loading">
      <a-form-model ref="form" :model="entity" :rules="rules" v-bind="layout">
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="编号" prop="Code">
              <a-input v-model="entity.Code" autocomplete="off" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="名称" prop="Name">
              <a-input v-model="entity.Name" autocomplete="off" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="盘点类型" prop="Type">
              <EnumSelect code="Inv_Check_Type" v-model="entity.Type"></EnumSelect>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="盘点日期" prop="CheckDate">
              <a-date-picker v-model="entity.CheckDate" valueFormat="YYYY-MM-DD"></a-date-picker>
            </a-form-model-item>
          </a-col>
          <a-col :span="16">
            <a-form-model-item label="备注" prop="Remark">
              <a-input v-model="entity.Remark" autocomplete="off" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <a-tabs :defaultActiveKey="activeKey" size="small" @change="handlerTabsChange" :animated="false" :tabBarStyle="{marginBottom:0}">
        <div slot="tabBarExtraContent">
          <a-button type="primary" v-action:Add icon="plus" @click="handleDetailAdd" v-if="activeKey==='CheckDetail'">新建</a-button>
          <a-button type="primary" v-action:Add icon="plus" @click="handleDetailDel" v-if="activeKey==='CheckDetail'">删除</a-button>
        </div>
        <a-tab-pane key="CheckConfig" tab="盘点配置">
          <a-form-model ref="configform" :model="config" v-bind="layout">
            <a-row>
              <a-col :span="8">
                <a-form-model-item label="货主" prop="StorerId">
                  <StorerSelect v-model="config.StorerId" :type="['Storer']" placeholder="货主"></StorerSelect>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="物料" prop="SkuId">
                  <SkuSelect v-model="config.SkuId" :storer="config.StorerId" @select="(val,sku)=>{this.querySku=sku}"></SkuSelect>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="变动日期" prop="ModifyDate">
                  <a-date-picker v-model="config.ModifyDate" valueFormat="YYYY-MM-DD"></a-date-picker>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="上架区域" prop="ZoneId">
                  <CommonSelect table="Bas_PutawayZone" v-model="config.ZoneId"></CommonSelect>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="所属巷道" prop="CheckDate">
                  <CommonSelect table="Bas_Laneway" v-model="config.LanewayId"></CommonSelect>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="库位" prop="LocId">
                  <LocSelect v-model="config.LocId" :zone="config.LocId"></LocSelect>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="批次" prop="LotId">
                  <LotSelect v-model="config.LotId" :storer="config.StorerId" :sku="config.SkuId"></LotSelect>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-item :label="cusHeaderTitle('Lot01')">
                  <LotInput name="Lot01" v-model="config.Lot01" :sku="querySku"></LotInput>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item :label="cusHeaderTitle('Lot02')">
                  <LotInput name="Lot02" v-model="config.Lot02" :sku="querySku"></LotInput>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item :label="cusHeaderTitle('Lot03')">
                  <LotInput name="Lot03" v-model="config.Lot03" :sku="querySku"></LotInput>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item :label="cusHeaderTitle('Lot04')">
                  <LotInput name="Lot04" v-model="config.Lot04" :sku="querySku"></LotInput>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item :label="cusHeaderTitle('Lot05')">
                  <LotInput name="Lot05" v-model="config.Lot05" :sku="querySku"></LotInput>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item :label="cusHeaderTitle('Lot06')">
                  <LotInput name="Lot06" v-model="config.Lot06" :sku="querySku"></LotInput>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item :label="cusHeaderTitle('Lot07')">
                  <LotInput name="Lot07" v-model="config.Lot07" :sku="querySku"></LotInput>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item :label="cusHeaderTitle('Lot08')">
                  <LotInput name="Lot08" v-model="config.Lot08" :sku="querySku"></LotInput>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item :label="cusHeaderTitle('Lot09')">
                  <LotInput name="Lot09" v-model="config.Lot09" :sku="querySku"></LotInput>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item :label="cusHeaderTitle('Lot10')">
                  <LotInput name="Lot10" v-model="config.Lot10" :sku="querySku"></LotInput>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form-model>
        </a-tab-pane>
        <a-tab-pane key="CheckDetail" tab="盘点明细">
          <a-table ref="table" size="default" rowKey="Id" :columns="columns" :dataSource="details" :rowSelection="rowSelection" :pagination="pagination" @change="handlerTableChange" :scroll="{ x: 3060 }">
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-spin>
    <div :style="{ position: 'absolute', bottom: 0, right: 0, width: '100%', borderTop: '1px solid #e9e9e9', padding: '10px 16px', background: '#fff', textAlign: 'right', zIndex: 1, }">
      <a-button :style="{ marginRight: '8px' }" type="primary" @click="handleSubmit" v-action:Update>保存</a-button>
      <a-button :style="{ marginRight: '8px' }" @click="()=>{this.visible=false}">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import MainSvc from '@/api/Inv/Inv_CheckSvc'
import DetailSvc from '@/api/Inv/Inv_CheckDetailSvc'
import EnumSelect from '@/components/CF/EnumSelect'
import CodeInput from '@/components/CF/CodeInput'
import StorerSelect from '@/components/Bas/StorerSelect'
import TreeSelect from '@/components/CF/TreeSelect'
import CommonSelect from '@/components/CF/CommonSelect'
import LocSelect from '@/components/Bas/LocSelect'
import LotSelect from '@/components/Inv/LotSelect'
import SkuSelect from '@/components/Bas/SkuSelect'
import LotInput from '@/components/Stg/LotInput'
export default {
  components: {
    MainSvc,
    CodeInput,
    EnumSelect,
    StorerSelect,
    TreeSelect,
    CommonSelect,
    LocSelect,
    SkuSelect,
    LotInput,
    LotSelect
  },
  props: {},
  data() {
    return {
      title: '新建',
      layout: { labelCol: { xs: { span: 24 }, sm: { span: 6 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 14 } } },
      rules: {
        Name: [{ required: true, message: '必填' }],
        Code: [{ required: true, message: '必填' }]
      },
      visible: false,
      loading: false,
      entity: {},
      config: {},
      activeKey: 'CheckConfig',
      enumItems: [],
      querySku: undefined,
      details: [],
      pagination: { current: 1, pageSize: 10, total: 0 },
      columns: [
        { title: '编号', dataIndex: 'Code', width: 150, fixed: 'left' },
        { title: '库位', dataIndex: 'Loc.Code' },
        { title: '货主', dataIndex: 'Storer.Name' },
        { title: '物料名称', dataIndex: 'Sku.Name' },
        { title: '物料编号', dataIndex: 'Sku.Code' },
        { title: '批次号', dataIndex: 'Lot.Code' },
        { title: '托盘', dataIndex: 'Tray.Code' },
        { title: '库存数量', dataIndex: 'Qty' },
        { title: '盘点数量', dataIndex: 'QtyCheck' },
        { title: '盘点日期', dataIndex: 'CheckDate' },
        { title: '盘点人', dataIndex: 'CheckWho' },
        { title: '盘点状态', dataIndex: 'Status' },
        { title: '盘点确认', dataIndex: 'Confirmed' },
        { title: '备注', dataIndex: 'Remark' },
        { title: () => { return this.cusHeaderTitle('Lot01') }, dataIndex: 'Lot01' },
        { title: () => { return this.cusHeaderTitle('Lot02') }, dataIndex: 'Lot02' },
        { title: () => { return this.cusHeaderTitle('Lot03') }, dataIndex: 'Lot03' },
        { title: () => { return this.cusHeaderTitle('Lot04') }, dataIndex: 'Lot04' },
        { title: () => { return this.cusHeaderTitle('Lot05') }, dataIndex: 'Lot05' },
        { title: () => { return this.cusHeaderTitle('Lot06') }, dataIndex: 'Lot06' },
        { title: () => { return this.cusHeaderTitle('Lot07') }, dataIndex: 'Lot07' },
        { title: () => { return this.cusHeaderTitle('Lot08') }, dataIndex: 'Lot08' },
        { title: () => { return this.cusHeaderTitle('Lot09') }, dataIndex: 'Lot09' },
        { title: () => { return this.cusHeaderTitle('Lot10') }, dataIndex: 'Lot10' }
      ],
      selectedRowKeys: [],
      selectedRows: []
    }
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
  created() {
    this.getEnum({ whseId: this.defaultWhseId, code: 'Bas_Lot_Field' }).then(result => {
      this.enumItems = result.EnumItems
    })
  },
  methods: {
    ...mapActions({ getConfig: 'getConfig', getEnum: 'getEnum' }),
    moment,
    cusHeaderTitle(column) {
      return this.enumItems?.find(w => w.Code === column)?.Name
    },
    init() {
      this.loading = false
      this.visible = true
      this.entity = { Id: '', WhseId: this.defaultWhseId, Code: '', Name: '', Type: undefined, CheckDate: moment().format('YYYY-MM-DD'), Remark: '', Status: 'Active', ConfigVal: null }
      this.config = { WhseId: this.defaultWhseId, StorerId: '', SkuId: '', ModifyDate: '', ZoneId: '', LanewayId: '', LocId: '', LotId: '', Lot01: '', Lot02: '', Lot03: '', Lot04: '', Lot05: '', Lot06: '', Lot07: '', Lot08: '', Lot09: '', Lot10: '' }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    openForm(id) {
      this.title = '库存盘点'
      this.init()
      if (id) {
        MainSvc.Get(id).then(resJson => {
          this.entity = resJson.Data
          this.config = JSON.parse(resJson.Data.ConfigVal)
        })
      }
    },
    handlerTabsChange(key) {
      this.activeKey = key
      if (key === 'CheckDetail') this.getDetailList()
    },
    handleDetailAdd() { },
    handleDetailDel() { },
    handleSubmit() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        this.entity.ConfigVal = JSON.stringify(this.config)
        this.loading = true
        MainSvc.Save(this.entity).then(result => {
          this.loading = false
          if (result.Success) {
            this.$message.success(result.Msg)
            this.visible = false
            this.$emit('Success')
          } else {
            this.$message.error(result.Msg)
          }
        })
      })
    },
    handlerTableChange(pagination, filters, sorter) {
      this.pagination = { ...pagination }
      this.getDetailList()
    },
    getDetailList() {
      const requestParameters = { pageNo: this.pagination.current, pageSize: this.pagination.pageSize, sortField: 'Code', sortOrder: 'asc', Search: { WhseId: this.defaultWhseId, CheckId: this.entity.Id } }
      console.log('loadData request parameters:', requestParameters)
      DetailSvc.GetPage(requestParameters).then(result => {
        this.details = result.Data
        this.pagination.total = result.Total
      })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  }
}
</script>
