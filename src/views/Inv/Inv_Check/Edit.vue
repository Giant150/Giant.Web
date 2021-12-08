<template>
  <a-drawer title="库存盘点" placement="right" width="60%" :visible="visible" @close="()=>{this.visible=false}" :maskClosable="false" :body-style="{ paddingBottom: '80px' }">
    <a-spin :spinning="loading">
      <a-form-model ref="form" :model="entity" :rules="rules" v-bind="layout">
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="编号" prop="Code">
              <CodeInput ref="codeInput" code="Inv_Check_Code" v-model="entity.Code" :para="{}"></CodeInput>
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
          <a-col :span="8">
            <a-form-model-item label="关联单号" prop="RefCode">
              <a-input v-model="entity.RefCode" autocomplete="off" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="备注" prop="Remark">
              <a-input v-model="entity.Remark" autocomplete="off" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <template v-if="entity.Expand">
            <a-col :span="8" v-for="item in expand.EnumItems" :key="item.Code">
              <a-form-model-item :label="item.Name" :prop="item.Code">
                <ExpandInput v-model="entity.Expand[item.Code]" :enumitem="item" />
              </a-form-model-item>
            </a-col>
          </template>
        </a-row>
      </a-form-model>
      <a-tabs :activeKey="activeKey" size="small" @change="handlerTabsChange" :animated="false" :tabBarStyle="{marginBottom:0}">
        <div slot="tabBarExtraContent">
          <!-- <a-button type="primary" v-action:Add icon="plus" @click="handleDetailAdd" v-if="activeKey==='CheckDetail' && entity.Status==='Checking'" size="small">新建</a-button>
          <a-divider v-action:Delete type="vertical" v-if="activeKey==='CheckDetail' && entity.Status==='Active'" /> -->
          <a-button type="primary" v-action:Delete icon="delete" @click="handleDetailDel" v-if="activeKey==='CheckDetail' && entity.Status==='Active'" size="small">删除</a-button>
          <a-divider v-action:Import type="vertical" v-if="activeKey==='CheckDetail' && entity.Status==='Checking'" />
          <a-upload v-action:Import v-if="activeKey==='CheckDetail' && entity.Status==='Checking'" @change="handleDetailImport" :showUploadList="false" name="file" :action="uploadConfig.action" :data="uploadConfig.data" :headers="uploadConfig.headers">
            <a-button type="primary" icon="import" size="small">导入</a-button>
          </a-upload>
          <a-divider v-action:Export type="vertical" v-if="activeKey==='CheckDetail'" />
          <a-button type="primary" v-action:Export icon="export" @click="handleDetailExport" v-if="activeKey==='CheckDetail'" size="small">导出</a-button>
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
                  <LocSelect v-model="config.LocId"></LocSelect>
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
        <a-tab-pane key="CheckDetail" tab="盘点明细" v-if="entity.Id">
          <a-table ref="table" size="default" rowKey="Id" :columns="columns" :dataSource="details" :rowSelection="rowSelection" :pagination="pagination" @change="handlerTableChange" :scroll="{ x: 3060 }">
            <template slot="Status" slot-scope="text">
              <EnumName code="Inv_Check_Status" :value="text"></EnumName>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-spin>
    <div :style="{ position: 'absolute', bottom: 0, right: 0, width: '100%', borderTop: '1px solid #e9e9e9', padding: '10px 16px', background: '#fff', textAlign: 'right', zIndex: 1, }">
      <a-button :style="{ marginRight: '8px' }" type="primary" @click="handleCompleted" v-action:Update v-if="entity.Status==='Confirmed'">完成</a-button>
      <a-button :style="{ marginRight: '8px' }" type="primary" @click="handleAdjust" v-action:Adjust v-if="entity.Status==='Confirmed'">调整</a-button>
      <a-button :style="{ marginRight: '8px' }" type="primary" @click="handleConfirmed" v-action:Update v-if="entity.Status==='Checked'">复核</a-button>
      <a-button :style="{ marginRight: '8px' }" type="primary" @click="handleChecked" v-action:Update v-if="entity.Status==='Checking'">确认</a-button>
      <!-- <a-button :style="{ marginRight: '8px' }" type="primary" @click="handleCheckTask" v-action:Task v-if="entity.Status==='Checking'">下发任务</a-button> -->
      <a-button :style="{ marginRight: '8px' }" type="primary" @click="handlePrint" v-action:Print v-if="entity.Id">打印</a-button>
      <a-button :style="{ marginRight: '8px' }" type="primary" @click="handleStart" v-action:Update v-if="entity.Status==='Active' && entity.Id">开始</a-button>
      <a-button :style="{ marginRight: '8px' }" type="primary" @click="handleSubmit" v-action:Update v-if="entity.Status==='Active'">保存</a-button>
      <a-button :style="{ marginRight: '8px' }" @click="()=>{this.visible=false}">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import print from 'print-js'
import MainSvc from '@/api/Inv/Inv_CheckSvc'
import DetailSvc from '@/api/Inv/Inv_CheckDetailSvc'
import EnumSelect from '@/components/CF/EnumSelect'
import EnumName from '@/components/CF/EnumName'
import CodeInput from '@/components/CF/CodeInput'
import StorerSelect from '@/components/Bas/StorerSelect'
import TreeSelect from '@/components/CF/TreeSelect'
import CommonSelect from '@/components/CF/CommonSelect'
import LocSelect from '@/components/Bas/LocSelect'
import LotSelect from '@/components/Inv/LotSelect'
import SkuSelect from '@/components/Bas/SkuSelect'
import LotInput from '@/components/Stg/LotInput'
import ExpandInput from '@/components/CF/ExpandInput'
export default {
  components: {
    MainSvc,
    CodeInput,
    EnumSelect,
    EnumName,
    StorerSelect,
    TreeSelect,
    CommonSelect,
    LocSelect,
    SkuSelect,
    LotInput,
    LotSelect,
    ExpandInput
  },
  props: {},
  data() {
    return {
      title: '新建',
      layout: { labelCol: { xs: { span: 24 }, sm: { span: 6 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 14 } } },
      rules: {
        Name: [{ required: true, message: '必填' }],
        Code: [{ required: true, message: '必填' }],
        Type: [{ required: true, message: '必填' }]
      },
      visible: false,
      loading: false,
      entity: {},
      config: {},
      activeKey: 'CheckConfig',
      enumItems: [],
      querySku: undefined,
      details: [],
      pagination: { current: 1, pageSize: 10, total: 0, showTotal: (total, range) => `总数:${total} 当前:${range[0]}~${range[1]}` },
      columns: [
        { title: '编号', dataIndex: 'Code', width: 160, fixed: 'left' },
        { title: '库位', dataIndex: 'Loc.Code' },
        { title: '货主', dataIndex: 'Storer.Name' },
        { title: '物料名称', dataIndex: 'Sku.Name' },
        { title: '物料编号', dataIndex: 'Sku.Code' },
        { title: '批次号', dataIndex: 'Lot.Code' },
        { title: '托盘', dataIndex: 'Tray.Code' },
        { title: '库存数量', dataIndex: 'Qty' },
        { title: '盘点数量', dataIndex: 'QtyCheck' },
        { title: '盘点日期', dataIndex: 'CheckDate', customRender: (value) => { return moment(value).format('yyyy-MM-DD') } },
        { title: '盘点人', dataIndex: 'CheckWho' },
        { title: '盘点状态', dataIndex: 'Status', scopedSlots: { customRender: 'Status' } },
        { title: '盘点确认', dataIndex: 'Confirmed', customRender: (value) => { return value ? '是' : '否' } },
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
      selectedRows: [],
      uploadConfig: {
        action: '',
        data: { whseId: '', checkId: '' },
        headers: { Authorization: '' }
      },
      expand: {}
    }
  },
  computed: {
    ...mapGetters({
      defaultWhseId: 'whseId',
      defaultStorerId: 'storerId',
      token: 'token'
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
    this.config.StorerId = this.defaultStorerId
    this.uploadConfig.data.whseId = this.defaultWhseId
    this.uploadConfig.headers.Authorization = `Bearer ${this.token}`
    this.getEnum({ whseId: this.defaultWhseId, code: 'Inv_Check_Expand' }).then(result => {
      this.expand = result
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
      this.activeKey = 'CheckConfig'
      this.details = []
      this.entity = {
        Id: '', WhseId: this.defaultWhseId, Code: '', RefCode: '', Name: '', Type: undefined, CheckDate: moment().format('YYYY-MM-DD'), Remark: '', Status: 'Active', ConfigVal: null,
        Expand: {
          ExpStr1: undefined, ExpStr2: undefined, ExpStr3: undefined, ExpStr4: undefined, ExpStr5: undefined, ExpStr6: undefined,
          ExpEnum1: undefined, ExpEnum2: undefined, ExpEnum3: undefined, ExpEnum4: undefined, ExpEnum5: undefined, ExpEnum6: undefined,
          ExpInt1: undefined, ExpInt2: undefined, ExpInt3: undefined, ExpInt4: undefined, ExpInt5: undefined, ExpInt6: undefined,
          ExpNum1: undefined, ExpNum2: undefined, ExpNum3: undefined, ExpNum4: undefined, ExpNum5: undefined, ExpNum6: undefined,
          ExpDate1: undefined, ExpDate2: undefined, ExpDate3: undefined, ExpDate4: undefined, ExpDate5: undefined, ExpDate6: undefined
        }
      }
      this.config = { WhseId: this.defaultWhseId, StorerId: this.defaultStorerId, SkuId: '', ModifyDate: '', ZoneId: '', LanewayId: '', LocId: '', LotId: '', Lot01: '', Lot02: '', Lot03: '', Lot04: '', Lot05: '', Lot06: '', Lot07: '', Lot08: '', Lot09: '', Lot10: '' }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    openForm(id) {
      this.title = '库存盘点'
      this.init()
      if (id) {
        this.uploadConfig.action = `${process.env.VUE_APP_API_BASE_URL}/api/Inv_Check/Import?whseId=${this.defaultWhseId}&checkId=${id}`
        this.uploadConfig.data.checkId = id
        MainSvc.Get(id).then(resJson => {
          this.entity = resJson.Data
          this.config = JSON.parse(resJson.Data.ConfigVal)
        })
      } else {
        this.$nextTick(() => {
          this.$refs.codeInput.Generate()
        })
      }
    },
    handlerTabsChange(key) {
      this.activeKey = key
      if (key === 'CheckDetail' && this.entity.Id) this.getDetailList()
    },
    handleDetailAdd() { },
    handleDetailDel() {
      DetailSvc.Delete(this.selectedRowKeys).then(result => {
        if (result.Success) {
          this.$message.success(result.Msg)
          this.getDetailList()
        } else {
          this.$message.error(result.Msg)
        }
      })
    },
    handleDetailImport(info) {
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name}上传成功`)
        this.getDetailList()
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name}上传失败`)
      }
    },
    handleDetailExport() {
      MainSvc.Export(this.entity.Id).then(result => {
        if (result.Success) {
          var fileName = result.Data.substring(result.Data.lastIndexOf('/') + 1)
          var filePath = `${process.env.VUE_APP_API_BASE_URL}${result.Data}`
          console.log('handleDetailExport', fileName, filePath)
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
    },
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
    handleStart() {
      this.loading = true
      MainSvc.Start(this.entity.Id).then(result => {
        this.loading = false
        if (result.Success) {
          this.$message.success(result.Msg)
          this.visible = false
          this.$emit('Success')
        } else {
          this.$message.error(result.Msg)
        }
      })
    },
    handlePrint() {
      MainSvc.Print(this.entity.Id).then(result => {
        if (result.Success) {
          var filePath = `${process.env.VUE_APP_API_BASE_URL}${result.Data}`
          print(filePath)
        } else {
          this.$message.error(result.Msg)
        }
      })
    },
    handleCheckTask() {
      this.loading = true
      MainSvc.CheckTask(this.entity.Id).then(result => {
        this.loading = false
        if (result.Success) {
          this.$message.success(result.Msg)
          this.visible = false
          this.$emit('Success')
        } else {
          this.$message.error(result.Msg)
        }
      })
    },
    handleChecked() {
      this.loading = true
      MainSvc.Checked(this.entity.Id).then(result => {
        this.loading = false
        if (result.Success) {
          this.$message.success(result.Msg)
          this.visible = false
          this.$emit('Success')
        } else {
          this.$message.error(result.Msg)
        }
      })
    },
    handleConfirmed() {
      this.loading = true
      MainSvc.Confirmed(this.entity.Id).then(result => {
        this.loading = false
        if (result.Success) {
          this.$message.success(result.Msg)
          this.visible = false
          this.$emit('Success')
        } else {
          this.$message.error(result.Msg)
        }
      })
    },
    handleAdjust() {
      this.loading = true
      MainSvc.Adjust(this.entity.Id).then(result => {
        this.loading = false
        if (result.Success) {
          this.$message.success(result.Msg)
          this.visible = false
          this.$emit('Success')
        } else {
          this.$message.error(result.Msg)
        }
      })
    },
    handleCompleted() {
      this.loading = true
      MainSvc.Completed(this.entity.Id).then(result => {
        this.loading = false
        if (result.Success) {
          this.$message.success(result.Msg)
          this.visible = false
          this.$emit('Success')
        } else {
          this.$message.error(result.Msg)
        }
      })
    }
  }
}
</script>
