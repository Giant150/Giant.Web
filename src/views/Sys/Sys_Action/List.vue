<template>
  <a-drawer title="操作按钮" placement="right" width="60%" :visible="visible" @close="()=>{this.$emit('close')}">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="编码">
                <a-input v-model="queryParam.Code" placeholder="名称" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="名称">
                <a-input v-model="queryParam.Name" placeholder="名称" />
              </a-form-item>
            </a-col>
            <a-col :md="!advanced && 6 || 24" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" v-action:Query @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="resetSearchForm(selectedRows)">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" v-action:Add icon="plus" @click="handleAdd">新建</a-button>
        <a-button type="primary" v-action:Delete icon="delete" @click="handleDelete()">批量删除</a-button>
      </div>

      <s-table ref="table" size="default" rowKey="Id" :columns="columns" :data="loadData" :rowSelection="rowSelection" showPagination="auto">
        <span slot="action" slot-scope="text, record">
          <template>
            <a v-action:Update @click="handleEdit(record)">修改</a>
            <a-divider type="vertical" />
            <a v-action:Delete @click="handleDelete([record])">删除</a>
          </template>
        </span>
      </s-table>
      <EditForm ref="editForm" @Success="()=>{this.$refs.table.refresh()}"></EditForm>
    </a-card>
  </a-drawer>
</template>

<script>
import { STable } from '@/components'
import MainSvc from '@/api/Sys/Sys_ActionSvc'
import EditForm from './Edit'

const columns = [
  { title: '编码', dataIndex: 'Code', sorter: true },
  { title: '名称', dataIndex: 'Name', sorter: true },
  { title: '操作', dataIndex: 'action', width: '150px', scopedSlots: { customRender: 'action' } }
]

export default {
  components: {
    STable,
    MainSvc,
    EditForm
  },
  props: {
    visible: {
      type: Boolean,
      require: false,
      default: false
    },
    menuId: {
      type: String,
      required: true
    }
  },
  data() {
    this.columns = columns
    return {
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: { MenuId: '', Code: '', Name: '' },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({ sortField: 'Code', sortOrder: 'asc', Search: { ...this.queryParam } }, parameter)
        console.log('loadData request parameters:', requestParameters)
        return MainSvc.GetPage(requestParameters)
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
  },
  watch: {
    menuId(newId) {
      this.queryParam.MenuId = newId
      this.$refs.table.refresh()
    }
  },
  mounted() {
    this.queryParam.MenuId = this.menuId
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    handleAdd() {
      this.$refs.editForm.openForm(null, this.menuId, '新增')
    },
    handleEdit(record) {
      this.$refs.editForm.openForm(record.Id, this.menuId, '修改')
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    resetSearchForm() {
      this.queryParam.Name = ''
      this.queryParam.Code = ''
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
    }
  }
}
</script>
