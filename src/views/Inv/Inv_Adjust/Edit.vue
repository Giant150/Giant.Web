<template>
  <a-drawer title="库存调整" placement="right" width="60%" :visible="visible" @close="()=>{this.visible=false}" :maskClosable="false" :body-style="{ paddingBottom: '80px' }">
    <a-spin :spinning="loading">
      <a-form-model ref="form" :model="entity" :rules="rules" v-bind="layout">
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="货主" prop="StorerId">
              <StorerSelect v-model="entity.StorerId" :type="['Storer']" placeholder="货主"></StorerSelect>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="编码" prop="Code">
              <CodeInput ref="codeInput" code="Inv_Adjust_Code" v-model="entity.Code" :para="{}" placeholder="编码"></CodeInput>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="制单日期" prop="DocDate">
              <a-date-picker v-model="entity.DocDate" valueFormat="YYYY-MM-DD"></a-date-picker>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="调整日期" prop="AdjDate">
              <a-date-picker v-model="entity.AdjDate" valueFormat="YYYY-MM-DD"></a-date-picker>
            </a-form-model-item>
          </a-col>
          <a-col :span="16">
            <a-form-model-item label="备注" prop="Remark">
              <a-input v-model="entity.Remark" autocomplete="off" />
            </a-form-model-item>
          </a-col>
          <template v-if="entity.Expand">
            <a-col :span="8" v-for="item in expand.EnumItems" :key="item.Code">
              <a-form-model-item :label="item.Name" :prop="item.Code">
                <ExpandInput v-model="entity.Expand[item.Code]" :enumitem="item" />
              </a-form-model-item>
            </a-col>
          </template>
        </a-row>
      </a-form-model>
      <div class="table-operator">
        <a-button type="primary" v-action:Add icon="plus" v-if="entity.Status==='Active'" @click="handleAdd()">新建</a-button>
      </div>
      <a-table ref="table" size="small" rowKey="Id" :columns="columns" :data-source="adjustDetail" :pagination="false">
        <template slot="QtyAdj" slot-scope="text, record">
          <a-input-number v-model="record.QtyAdj" style="width:100%" size="small" />
        </template>
        <template slot="Type" slot-scope="text, record">
          <EnumSelect code="Inv_AdjustDetail_Type" v-model="record.Type" style="width:100%" size="small"></EnumSelect>
        </template>
        <span slot="action" slot-scope="text, record">
          <template>
            <a v-action:Delete v-if="entity.Status==='Active'" @click="handleDelete(record)">删除</a>
          </template>
        </span>
      </a-table>
      <InvChoose type="radio" ref="invChoose" @choose="handlerInvChoose"></InvChoose>
    </a-spin>
    <div :style="{ position: 'absolute', bottom: 0, right: 0, width: '100%', borderTop: '1px solid #e9e9e9', padding: '10px 16px', background: '#fff', textAlign: 'right', zIndex: 1, }">
      <a-button :style="{ marginRight: '8px' }" type="default" v-action:Print @click="handlePrint">打印调整单</a-button>
      <a-button :style="{ marginRight: '8px' }" type="primary" v-action:Adjust v-if="entity.Status==='Active'" @click="handleAdjust">确认调整</a-button>
      <a-button :style="{ marginRight: '8px' }" type="primary" v-action:Update v-if="entity.Status==='Active'" @click="handleSubmit">保存</a-button>
      <a-button :style="{ marginRight: '8px' }" @click="()=>{this.visible=false}">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import moment from 'moment'
import print from 'print-js'
import { mapActions, mapGetters } from 'vuex'
import MainSvc from '@/api/Inv/Inv_AdjustSvc'
import DetailSvc from '@/api/Inv/Inv_AdjustDetailSvc'
import EnumSelect from '@/components/CF/EnumSelect'
import CodeInput from '@/components/CF/CodeInput'
import StorerSelect from '@/components/Bas/StorerSelect'
import TreeSelect from '@/components/CF/TreeSelect'
import CommonSelect from '@/components/CF/CommonSelect'
import LocSelect from '@/components/Bas/LocSelect'
import SkuSelect from '@/components/Bas/SkuSelect'
import InvChoose from '@/components/Inv/InvChoose'
import TraySelect from '@/components/Bas/TraySelect'
import ExpandInput from '@/components/CF/ExpandInput'
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
    ExpandInput
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
      curDetailIndex: 0,
      expand: {},
      columns: [
        { title: '物料编码', dataIndex: 'Sku.Code' },
        { title: '物料名称', dataIndex: 'Sku.Name' },
        { title: '批次', dataIndex: 'Lot.Code', width: 120 },
        { title: '库位', dataIndex: 'Loc.Code', width: 120 },
        { title: '托盘', dataIndex: 'Tray.Code', width: 120 },
        { title: '调整数量', dataIndex: 'QtyAdj', width: 100, scopedSlots: { customRender: 'QtyAdj' } },
        { title: '调整类型', dataIndex: 'Type', width: 150, scopedSlots: { customRender: 'Type' } },
        { title: '操作', dataIndex: 'action', width: 100, scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  computed: {
    ...mapGetters({
      defaultWhseId: 'whseId',
      defaultStorerId: 'storerId'
    }),
    adjustDetail() {
      return this.entity.AdjustDetail
    }
  },
  created() {
    this.getEnum({ whseId: this.defaultWhseId, code: 'Inv_Adjust_Expand' }).then(result => {
      this.expand = result
    })
  },
  methods: {
    moment,
    ...mapActions({ getConfig: 'getConfig', getEnum: 'getEnum' }),
    init() {
      this.loading = false
      this.visible = true
      this.entity = {
        AdjustDetail: [],
        Id: '', WhseId: this.defaultWhseId, StorerId: this.defaultStorerId, Code: '',
        DocDate: moment().format('YYYY-MM-DD'), AdjDate: moment().format('YYYY-MM-DD'), Remark: '', Status: 'Active',
        Expand: {
          ExpStr1: undefined, ExpStr2: undefined, ExpStr3: undefined, ExpStr4: undefined, ExpStr5: undefined, ExpStr6: undefined,
          ExpEnum1: undefined, ExpEnum2: undefined, ExpEnum3: undefined, ExpEnum4: undefined, ExpEnum5: undefined, ExpEnum6: undefined,
          ExpInt1: undefined, ExpInt2: undefined, ExpInt3: undefined, ExpInt4: undefined, ExpInt5: undefined, ExpInt6: undefined,
          ExpNum1: undefined, ExpNum2: undefined, ExpNum3: undefined, ExpNum4: undefined, ExpNum5: undefined, ExpNum6: undefined,
          ExpDate1: undefined, ExpDate2: undefined, ExpDate3: undefined, ExpDate4: undefined, ExpDate5: undefined, ExpDate6: undefined
        }
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
    handleAdd() {
      this.$refs.invChoose.choose({
        StorerId: this.entity.StorerId
      })
    },
    handlerInvChoose(selectRows) {
      if (selectRows.length === 0) return
      var inv = selectRows[0]
      console.log('handlerInvChoose', inv)
      if (inv.StorerId !== this.entity.StorerId) {
        this.$message.error('选择的货主不匹配')
        return
      }
      this.curDetailIndex += 1
      var detail = {
        Id: `new_${this.curDetailIndex}`, WhseId: this.defaultWhseId, StorerId: this.entity.StorerId, AdjustId: this.entity.Id,
        SkuId: inv.SkuId, LotId: inv.LotId, LocId: inv.LocId, TrayId: inv.TrayId, QtyAdj: 0, Type: '',
        Sku: inv.Sku, Lot: inv.Lot, Loc: inv.Loc, Tray: inv.Tray
      }
      console.log(detail)
      this.entity.AdjustDetail.push(detail)
    },
    handleDelete(record) {
      if (!record.Id.startsWith('new_')) {
        DetailSvc.Delete([record.Id]).then(result => {
          if (result.Success) {
            var index = this.entity.AdjustDetail.indexOf(record)
            this.entity.AdjustDetail.splice(index, 1)
          } else {
            this.$message.error(result.Msg)
          }
        })
      } else {
        var index = this.entity.AdjustDetail.indexOf(record)
        this.entity.AdjustDetail.splice(index, 1)
      }
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
    handleSubmit() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          this.$message.error('数据验证失败')
          return
        }
        const list = this.entity.AdjustDetail.map(detail => Object.assign({}, detail))
        const validMsg = []
        list.forEach(detail => {
          if (detail.QtyAdj === 0) validMsg.push(`调整数量不能为0`)
          detail.Sku = null
          detail.Lot = null
          detail.Loc = null
          detail.Tray = null
          if (!detail.TrayId) detail.TrayId = null // 如果没有托盘
        })
        if (validMsg.length > 0) {
          this.$message.error((h) => { return (<a-list size="small" split={false}>{validMsg.map(m => { return (<a-list-item>{m}</a-list-item>) })}</a-list>) })
          return
        }
        const postData = Object.assign({}, this.entity)
        postData.AdjustDetail = list
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
    }
  }
}
</script>
