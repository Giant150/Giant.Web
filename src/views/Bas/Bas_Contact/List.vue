<template>
  <a-drawer title="联系人" placement="right" width="80%" :visible="visible" @close="()=>{this.visible=false}">
    <div class="table-operator">
      <a-button type="primary" v-action:Add icon="plus" @click="handleAdd">新建</a-button>
      <a-button type="primary" v-action:Delete icon="delete" @click="handleDelete()">批量删除</a-button>
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
    </div>

    <s-table ref="table" size="default" rowKey="Id" :columns="columns" :data="loadData" :rowSelection="rowSelection" showPagination="auto">
      <template slot="IsDefault" slot-scope="text">
        <a-tag color="#2db7f5" v-if="text===true">默认</a-tag>
        <a-tag color="#919191" v-else>其他</a-tag>
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
  </a-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { STable } from '@/components'
import MainSvc from '@/api/Bas/Bas_ContactSvc'
import EditForm from './Edit'
import EnumSelect from '@/components/CF/EnumSelect'
import EnumName from '@/components/CF/EnumName'
import StorerSelect from '@/components/Bas/StorerSelect'
import SkuSelect from '@/components/Bas/SkuSelect'
import LocSelect from '@/components/Bas/LocSelect'

const columns = [
  { title: '编号', dataIndex: 'Code', sorter: true },
  { title: '名称', dataIndex: 'Name', sorter: true },
  { title: '电话', dataIndex: 'Phone', sorter: true },
  { title: '邮箱', dataIndex: 'Email', sorter: true },
  { title: '国家', dataIndex: 'Country.Name', sorter: true },
  { title: '省份', dataIndex: 'Province.Name', sorter: true },
  { title: '城市', dataIndex: 'City.Name', sorter: true },
  { title: '县区', dataIndex: 'District.Name', sorter: true },
  { title: '地址', dataIndex: 'Addr', sorter: true },
  { title: '是否默认', dataIndex: 'IsDefault', scopedSlots: { customRender: 'IsDefault' } },
  { title: '修改时间', dataIndex: 'ModifyTime', sorter: true, customRender: (value) => { return moment(value).format('yyyy-MM-DD') } },
  { title: '操作', dataIndex: 'action', width: '200px', scopedSlots: { customRender: 'action' } }
]

export default {
  components: {
    STable,
    MainSvc,
    EnumSelect,
    EnumName,
    EditForm,
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
      queryParam: { WhseId: '', StorerId: '', Keyword: '' },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        this.queryParam.WhseId = this.defaultWhseId
        const requestParameters = Object.assign({ sortField: 'ModifyTime', sortOrder: 'ASC', Search: { ...this.queryParam } }, parameter)
        console.log('loadData request parameters:', requestParameters)
        return MainSvc.GetPage(requestParameters)
      },
      selectedRowKeys: [],
      selectedRows: [],
      entity: {},
      uploadConfig: {
        action: '',
        data: { whseId: '' },
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
    this.uploadConfig.action = `${process.env.VUE_APP_API_BASE_URL}/api/Bas_Contact/Import?whseId=${this.defaultWhseId}`
  },
  methods: {
    moment,
    openForm(record) {
      this.entity = record
      // 这里的ParentId具体业务主表字段Id
      this.queryParam.StorerId = record.Id
      this.visible = true
      this.$nextTick(() => {
        this.$refs.table.refresh()
      })
    },
    handleAdd() {
      this.mdl = null
      this.visible = true
      this.$refs.editForm.openForm(null, this.entity, '新增')
    },
    handleEdit(record) {
      this.visible = true
      this.mdl = { ...record }
      this.$refs.editForm.openForm(record.Id, this.entity, '修改')
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    resetSearchForm() {
      this.queryParam = { WhseId: this.defaultWhseId, StorerId: this.entity.StorerId }
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
