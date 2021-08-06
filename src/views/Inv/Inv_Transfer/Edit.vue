<template>
  <a-drawer title="内部转移" placement="right" width="60%" :visible="visible" @close="()=>{this.visible=false}" :maskClosable="false" :body-style="{ paddingBottom: '80px' }">
    <a-spin :spinning="loading">
      <a-form-model ref="form" :model="entity" :rules="rules" v-bind="layout">
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="编号" prop="Code">
              <CodeInput ref="codeInput" code="Inv_Transfer_Code" v-model="entity.Code" :para="{}" placeholder="编码"></CodeInput>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="自货主" prop="FromStorerId">
              <StorerSelect v-model="entity.FromStorerId" :type="['Storer']" placeholder="自货主"></StorerSelect>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="至货主" prop="ToStorerId">
              <StorerSelect v-model="entity.ToStorerId" :type="['Storer']" placeholder="至货主"></StorerSelect>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="单据日期" prop="DocDate">
              <a-date-picker v-model="entity.DocDate" valueFormat="YYYY-MM-DD"></a-date-picker>
            </a-form-model-item>
          </a-col>
          <a-col :span="16">
            <a-form-model-item label="备注" prop="Remark">
              <a-input v-model="entity.Remark" autocomplete="off" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <div class="table-operator">
        <a-button type="primary" v-action:Add icon="plus" v-if="entity.Status==='Active'" @click="handleAdd()">新建</a-button>
      </div>
      <a-table ref="table" size="small" rowKey="Id" :columns="columns" :data-source="transferDetail" :pagination="false" :scroll="{ x: 3500 }">
        <template slot="Code" slot-scope="text, record">
          <CodeInput code="Inv_TransferDetail_Code" v-model="record.Code" :para="{TransferCode:entity.Code}" placeholder="编号" size="small"></CodeInput>
        </template>
        <template slot="FromSkuId" slot-scope="text, record">
          <SkuSelect v-model="record.FromSkuId" :storer="entity.FromStorerId" disabled size="small"></SkuSelect>
        </template>
        <template slot="FromLotId" slot-scope="text, record">
          <LotSelect v-model="record.FromLotId" :storer="entity.FromStorerId" :sku="record.FromSkuId" disabled size="small"></LotSelect>
        </template>
        <template slot="FromLocId" slot-scope="text, record">
          <LocSelect v-model="record.FromLocId" disabled size="small"></LocSelect>
        </template>
        <template slot="FromTrayId" slot-scope="text, record">
          <TraySelect v-model="record.FromTrayId" disabled size="small"></TraySelect>
        </template>
        <template slot="FromQty" slot-scope="text, record">
          <a-input-number v-model="record.FromQty" :min="0" size="small"></a-input-number>
        </template>
        <template slot="ToSkuId" slot-scope="text, record">
          <SkuSelect v-model="record.ToSkuId" :storer="entity.ToStorerId" @select="(val,sku) => { record.ToSku = sku }" size="small"></SkuSelect>
        </template>
        <template slot="ToLotId" slot-scope="text, record">
          <LotSelect v-model="record.ToLotId" :storer="entity.ToStorerId" :sku="record.ToSkuId" disabled size="small"></LotSelect>
        </template>
        <template slot="ToLocId" slot-scope="text, record">
          <LocSelect v-model="record.ToLocId" size="small"></LocSelect>
        </template>
        <template slot="ToTrayId" slot-scope="text, record">
          <TraySelect v-model="record.ToTrayId" size="small"></TraySelect>
        </template>
        <template slot="ToQty" slot-scope="text, record">
          <a-input-number v-model="record.ToQty" :min="0" size="small"></a-input-number>
        </template>
        <template slot="Lot01" slot-scope="text, record">
          <LotInput name="Lot01" :sku="record.ToSku" v-model="record.Lot01" size="small"></LotInput>
        </template>
        <template slot="Lot02" slot-scope="text, record">
          <LotInput name="Lot02" :sku="record.ToSku" v-model="record.Lot02" size="small"></LotInput>
        </template>
        <template slot="Lot03" slot-scope="text, record">
          <LotInput name="Lot03" :sku="record.ToSku" v-model="record.Lot03" size="small"></LotInput>
        </template>
        <template slot="Lot04" slot-scope="text, record">
          <LotInput name="Lot04" :sku="record.ToSku" v-model="record.Lot04" size="small"></LotInput>
        </template>
        <template slot="Lot05" slot-scope="text, record">
          <LotInput name="Lot05" :sku="record.ToSku" v-model="record.Lot05" size="small"></LotInput>
        </template>
        <template slot="Lot06" slot-scope="text, record">
          <LotInput name="Lot06" :sku="record.ToSku" v-model="record.Lot06" size="small"></LotInput>
        </template>
        <template slot="Lot07" slot-scope="text, record">
          <LotInput name="Lot07" :sku="record.ToSku" v-model="record.Lot07" size="small"></LotInput>
        </template>
        <template slot="Lot08" slot-scope="text, record">
          <LotInput name="Lot08" :sku="record.ToSku" v-model="record.Lot08" size="small"></LotInput>
        </template>
        <template slot="Lot09" slot-scope="text, record">
          <LotInput name="Lot09" :sku="record.ToSku" v-model="record.Lot09" size="small"></LotInput>
        </template>
        <template slot="Lot10" slot-scope="text, record">
          <LotInput name="Lot10" :sku="record.ToSku" v-model="record.Lot10" size="small"></LotInput>
        </template>
        <span slot="action" slot-scope="text, record">
          <template>
            <a v-action:Delete v-if="entity.Status==='Active'" @click="handleDelete(record)">删除</a>
          </template>
        </span>
      </a-table>
      <InvChoose type="checkbox" ref="invChoose" @choose="handlerInvChoose"></InvChoose>
    </a-spin>
    <div :style="{ position: 'absolute', bottom: 0, right: 0, width: '100%', borderTop: '1px solid #e9e9e9', padding: '10px 16px', background: '#fff', textAlign: 'right', zIndex: 1, }">
      <a-button :style="{ marginRight: '8px' }" type="primary" v-action:Execute v-if="entity.Status==='Active'" @click="handleTransfer">执行转移</a-button>
      <a-button :style="{ marginRight: '8px' }" type="primary" v-action:Update v-if="entity.Status==='Active'" @click="handleSubmit">保存</a-button>
      <a-button :style="{ marginRight: '8px' }" @click="()=>{this.visible=false}">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'
import MainSvc from '@/api/Inv/Inv_TransferSvc'
import EnumSelect from '@/components/CF/EnumSelect'
import CodeInput from '@/components/CF/CodeInput'
import StorerSelect from '@/components/Bas/StorerSelect'
import TreeSelect from '@/components/CF/TreeSelect'
import CommonSelect from '@/components/CF/CommonSelect'
import LocSelect from '@/components/Bas/LocSelect'
import SkuSelect from '@/components/Bas/SkuSelect'
import InvChoose from '@/components/Inv/InvChoose'
import TraySelect from '@/components/Bas/TraySelect'
import LotSelect from '@/components/Inv/LotSelect'
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
    InvChoose,
    TraySelect,
    LotSelect,
    LotInput
  },
  props: {},
  data() {
    return {
      title: '新建',
      layout: { labelCol: { xs: { span: 24 }, sm: { span: 6 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 14 } } },
      rules: {
        Code: [{ required: true, message: '' }],
        FromStorerId: [{ required: true, message: '' }],
        ToStorerId: [{ required: true, message: '' }],
        DocDate: [{ required: true, message: '' }]
      },
      visible: false,
      loading: false,
      entity: {},
      curDetailIndex: 0,
      enumItems: [],
      columns: [
        { title: '编号', dataIndex: 'Code', width: 100, scopedSlots: { customRender: 'Code' } },
        { title: '自物料', dataIndex: 'FromSkuId', width: 150, scopedSlots: { customRender: 'FromSkuId' } },
        { title: '自批次', dataIndex: 'FromLotId', width: 150, scopedSlots: { customRender: 'FromLotId' } },
        { title: '自库位', dataIndex: 'FromLocId', width: 150, scopedSlots: { customRender: 'FromLocId' } },
        { title: '自托盘', dataIndex: 'FromTrayId', width: 150, scopedSlots: { customRender: 'FromTrayId' } },
        { title: '自数量', dataIndex: 'FromQty', width: 150, scopedSlots: { customRender: 'FromQty' } },
        { title: '至物料', dataIndex: 'ToSkuId', width: 150, scopedSlots: { customRender: 'ToSkuId' } },
        { title: '至批次', dataIndex: 'ToLotId', width: 150, scopedSlots: { customRender: 'ToLotId' } },
        { title: '至库位', dataIndex: 'ToLocId', width: 150, scopedSlots: { customRender: 'ToLocId' } },
        { title: '至托盘', dataIndex: 'ToTrayId', width: 150, scopedSlots: { customRender: 'ToTrayId' } },
        { title: '至数量', dataIndex: 'ToQty', width: 150, scopedSlots: { customRender: 'ToQty' } },
        { title: () => { return this.cusHeaderTitle('Lot01') }, dataIndex: 'Lot01', width: 150, scopedSlots: { customRender: 'Lot01' } },
        { title: () => { return this.cusHeaderTitle('Lot02') }, dataIndex: 'Lot02', width: 150, scopedSlots: { customRender: 'Lot02' } },
        { title: () => { return this.cusHeaderTitle('Lot03') }, dataIndex: 'Lot03', width: 150, scopedSlots: { customRender: 'Lot03' } },
        { title: () => { return this.cusHeaderTitle('Lot04') }, dataIndex: 'Lot04', width: 150, scopedSlots: { customRender: 'Lot04' } },
        { title: () => { return this.cusHeaderTitle('Lot05') }, dataIndex: 'Lot05', width: 150, scopedSlots: { customRender: 'Lot05' } },
        { title: () => { return this.cusHeaderTitle('Lot06') }, dataIndex: 'Lot06', width: 150, scopedSlots: { customRender: 'Lot06' } },
        { title: () => { return this.cusHeaderTitle('Lot07') }, dataIndex: 'Lot07', width: 150, scopedSlots: { customRender: 'Lot07' } },
        { title: () => { return this.cusHeaderTitle('Lot08') }, dataIndex: 'Lot08', width: 150, scopedSlots: { customRender: 'Lot08' } },
        { title: () => { return this.cusHeaderTitle('Lot09') }, dataIndex: 'Lot09', width: 150, scopedSlots: { customRender: 'Lot09' } },
        { title: () => { return this.cusHeaderTitle('Lot10') }, dataIndex: 'Lot10', width: 150, scopedSlots: { customRender: 'Lot10' } },
        { title: '操作', dataIndex: 'action', width: 100, fixed: 'right', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  computed: {
    ...mapGetters({
      defaultWhseId: 'whseId',
      defaultStorerId: 'storerId'
    }),
    transferDetail() {
      return this.entity.TransferDetail
    }
  },
  created() {
    this.getEnum({ whseId: this.defaultWhseId, code: 'Bas_Lot_Field' }).then(result => {
      this.enumItems = result.EnumItems
    })
  },
  methods: {
    moment,
    ...mapActions({ getConfig: 'getConfig', getEnum: 'getEnum' }),
    init() {
      this.loading = false
      this.visible = true
      this.entity = {
        TransferDetail: [],
        Id: '', WhseId: this.defaultWhseId, Code: '', FromStorerId: null, ToStorerId: null,
        DocDate: moment().format('YYYY-MM-DD'), TransferDate: undefined, Remark: '', Status: 'Active'
      }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    openForm(id, title) {
      this.title = title || (id ? '新建' : '修改')
      this.init()
      if (id) {
        MainSvc.Get(id).then(resJson => {
          this.entity = resJson.Data
        })
      } else {
        this.$nextTick(() => {
          this.$refs.codeInput.Generate()
        })
      }
    },
    cusHeaderTitle(column) {
      return this.enumItems?.find(w => w.Code === column)?.Name
    },
    handleAdd() {
      if (!this.entity.FromStorerId || !this.entity.ToStorerId) {
        this.$message.error('请选择货主')
        return
      }
      this.$refs.invChoose.choose({
        StorerId: this.entity.FromStorerId
      })
    },
    handlerInvChoose(selectRows) {
      if (selectRows.length === 0) return
      selectRows.forEach(row => {
        var inv = row
        if (inv.StorerId !== this.entity.FromStorerId) {
          this.$message.error('选择的货主不匹配')
          return
        }
        this.curDetailIndex += 1
        var detail = {
          ToSku: undefined,
          Id: `new_${this.curDetailIndex}`, WhseId: this.defaultWhseId, TransferId: this.entity.Id, Code: '',
          FromStorerId: this.entity.FromStorerId, FromSkuId: inv.SkuId, FromLotId: inv.LotId, FromLocId: inv.LocId, FromTrayId: inv.TrayId, FromQty: inv.Qty,
          ToStorerId: this.entity.ToStorerId, ToSkuId: null, ToLotId: null, ToLocId: inv.LocId, ToTrayId: inv.TrayId, ToQty: inv.Qty,
          Lot01: inv.Lot.Lot01, Lot02: inv.Lot.Lot02, Lot03: inv.Lot.Lot03, Lot04: inv.Lot.Lot04, Lot05: inv.Lot.Lot05, Lot06: inv.Lot.Lot06, Lot07: inv.Lot.Lot07, Lot08: inv.Lot.Lot08, Lot09: inv.Lot.Lot09, Lot10: inv.Lot.Lot10,
          Status: 'Active'
        }
        this.entity.TransferDetail.push(detail)
      })
    },
    handleSubmit() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        const list = this.entity.TransferDetail.map(detail => Object.assign({}, detail))
        const validMsg = []
        list.forEach(detail => {
          if (!detail.Code) validMsg.push(`转移明细编号必需输入`)
          if (!detail.ToSkuId) validMsg.push(`转移明细${detail.Code}中至物料必需选择`)
          const lotStg = Object.assign({}, detail?.ToSku?.LotStg)
          // 批属性验证(必需)
          for (const key in lotStg) {
            if (key.endsWith('Required') && !key.endsWith('RFRequired') && lotStg[key]) {
              const lotName = key.replace('Required', '')
              const colVal = detail[lotName]
              if (!colVal) {
                validMsg.push(`转移明细${detail.Code}中${lotName}为必需`)
              }
            }
          }
          detail.ToSku = null
          if (!detail.ToTrayId) detail.TrayId = null // 如果没有托盘
        })
        if (validMsg.length > 0) {
          this.$message.error((h) => { return (<a-list size="small" split={false}>{validMsg.map(m => { return (<a-list-item>{m}</a-list-item>) })}</a-list>) })
          return
        }
        const postData = Object.assign({}, this.entity)
        postData.TransferDetail = list
        this.loading = true
        MainSvc.Save(postData).then(result => {
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
    handleTransfer() {
      this.loading = true
      MainSvc.Transfer(this.entity.Id).then(result => {
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
