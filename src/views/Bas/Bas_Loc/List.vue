<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="关键字">
              <a-input v-model="queryParam.Keyword" placeholder="关键字" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="库位类型">
              <EnumSelect code="Bas_Loc_Type" v-model="queryParam.Type" placeholder="库位类型"></EnumSelect>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" v-action:Query @click="()=>{this.$refs.table.refresh()}">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm()">重置</a-button>
            </span>
          </a-col>
          <a-dropdown >
            <a-menu slot="overlay" >
              <a-menu-item key="1">
                <a-button type="primary" icon="download" @click="handleExport">导出</a-button>
              </a-menu-item>
              <a-menu-item key="2">
                <a-upload name="file" :multiple="true" :action="uploadConfig.action" :headers="uploadConfig.headers" @change="handleChange">
                  <a-button type="primary" icon="upload" >导入</a-button>
                </a-upload>
              </a-menu-item>
              <a-menu-item key="3">
                <a-button type="primary" icon="export" @click="handleExportTemplet" size="small">下载模板</a-button>
              </a-menu-item>
            </a-menu>
            <a-button> 导入\出 <a-icon type="cloud-download" /> </a-button>
          </a-dropdown>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" v-action:Add icon="plus" @click="handleAdd">新建</a-button>
      <a-button type="primary" v-action:Delete icon="delete" @click="handleDelete()">批量删除</a-button>
    </div>

    <s-table ref="table" size="default" rowKey="Id" :columns="columns" :data="loadData" :rowSelection="rowSelection" showPagination="auto" :scroll="{ x: 2000 }">
      <template slot="Type" slot-scope="text">
        <EnumName code="Bas_Loc_Type" :value="text"></EnumName>
      </template>
      <template slot="Flag" slot-scope="text">
        <EnumName code="Bas_Loc_Flag" :value="text"></EnumName>
      </template>
      <template slot="ABC" slot-scope="text">
        <EnumName code="ABC" :value="text"></EnumName>
      </template>
      <template slot="Status" slot-scope="text">
        <EnumName code="State" :value="text"></EnumName>
      </template>
      <span slot="action" slot-scope="text, record">
        <template>
          <a v-action:Update @click="handleEdit(record)">修改</a>
          <a-divider v-action:Delete type="vertical" />
          <a v-action:Delete @click="handleDelete([record])">删除</a>
        </template>
      </span>
    </s-table>
    <EditForm ref="editForm" @Success="()=>{this.$refs.table.refresh()}"></EditForm>
  </a-card>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { STable } from '@/components'
import MainSvc from '@/api/Bas/Bas_LocSvc'
import EditForm from './Edit'
import EnumSelect from '@/components/CF/EnumSelect'
import EnumName from '@/components/CF/EnumName'

const columns = [
  { title: '编号', dataIndex: 'Code', sorter: true, width: 150, fixed: 'left' },
  { title: '类型', dataIndex: 'Type', scopedSlots: { customRender: 'Type' } },
  { title: '标志', dataIndex: 'Flag', scopedSlots: { customRender: 'Flag' } },
  { title: '拣货路顺', dataIndex: 'AllocCode', sorter: true },
  { title: '上架路顺', dataIndex: 'PutawayCode', sorter: true },
  { title: '上架区域', dataIndex: 'PutawayZone.Name' },
  { title: '巷道', dataIndex: 'Laneway.Name' },
  { title: '工作区域', dataIndex: 'WorkZone' },
  { title: 'ABC', dataIndex: 'ABC', scopedSlots: { customRender: 'ABC' } },
  { title: '最大容量', dataIndex: 'MaxCapacity' },
  { title: '最大重量', dataIndex: 'MaxWeight' },
  { title: '混放商品', dataIndex: 'CommingleSku', customRender: (value, row, index) => { return value ? '是' : '否' } },
  { title: '混放批次', dataIndex: 'CommingleLot', customRender: (value, row, index) => { return value ? '是' : '否' } },
  { title: '空库位', dataIndex: 'IsEmpty', customRender: (value, row, index) => { return value ? '是' : '否' } },
  { title: '有托盘', dataIndex: 'HasTray', customRender: (value, row, index) => { return value ? '是' : '否' } },
  { title: '状态', dataIndex: 'Status', scopedSlots: { customRender: 'Status' } },
  { title: '操作', dataIndex: 'action', width: 120, fixed: 'right', scopedSlots: { customRender: 'action' } }
]

export default {
  components: {
    STable,
    MainSvc,
    EnumSelect,
    EnumName,
    EditForm
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
      queryParam: { WhseId: '', Keyword: '', Type: undefined },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        this.queryParam.WhseId = this.defaultWhseId
        const requestParameters = Object.assign({ sortField: 'Code', sortOrder: 'asc', Search: { ...this.queryParam } }, parameter)
        console.log('loadData request parameters:', requestParameters)
        return MainSvc.GetPage(requestParameters)
      },
      selectedRowKeys: [],
      selectedRows: [],
      uploadConfig: {
        action: '',
        data: { whseId: '', checkId: '' },
        headers: { Authorization: '' }
      }
    }
  },
  filters: {
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
    this.uploadConfig.data.whseId = this.defaultWhseId
    this.uploadConfig.headers.Authorization = `Bearer ${this.token}`
    this.uploadConfig.action = `${process.env.VUE_APP_API_BASE_URL}/api/Bas_Loc/Import?whseId=${this.defaultWhseId}`
   },
  methods: {
    moment,
    handleAdd() {
      this.mdl = null
      this.visible = true
      this.$refs.editForm.openForm(null, '新增')
    },
    handleEdit(record) {
      this.visible = true
      this.mdl = { ...record }
      this.$refs.editForm.openForm(record.Id, '修改')
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    resetSearchForm() {
      this.queryParam = { WhseId: this.defaultWhseId, Keyword: '', Type: undefined }
    },
    handleDelete(rows) {
      var thisObj = this
      var ids = rows.map(value => value.Id)
      this.$confirm({
        title: '确认删除吗?',
        onOk() {
          return new Promise((resolve, reject) => {
            MainSvc.Delete(ids).then(result => {
              resolve()
              if (result.Success) {
                thisObj.$message.success('操作成功!')
                thisObj.$refs.table.refresh()
              } else {
                thisObj.$message.error(result.Msg)
              }
            })
          })
        }
      })
    },
    handleExportTemplet() {
      MainSvc.Exporttemplet().then(result => {
        if (result.Success) {
          var fileName = result.Data.substring(result.Data.lastIndexOf('/') + 1)
          var filePath = `${process.env.VUE_APP_API_BASE_URL}${result.Data}`
          console.log('handleExportTemplet', fileName, filePath)
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
    },
    handleChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        if (info.file.response.Success === false) {
          this.$message.error(`${info.file.name}文件,${info.file.response.Msg},请检查文件内容！ `)
        } else {
            this.$message.success(`${info.file.name}  文件上传成功！`)
        }
        this.visible = false
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 文件上传失败！`)
      }
    }
  }
}
</script>
