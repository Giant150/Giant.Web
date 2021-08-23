import request from '@/utils/request'
/**
 * Bas_Contact API接口服务
 */
export default {
    /**
     * 请求分页数据
     * @param {Object} parameter 查询参数
     * @returns 分页数据
     */
    GetPage(parameter) {
        return request({
            url: '/api/Bas_Contact/GetPage',
            method: 'post',
            data: parameter
        })
    },
    /**
     * 获取单个实体数据
     * @param {string} id 主键
     * @returns 实体数据
     */
    Get(id) {
        return request({
            url: '/api/Bas_Contact/Get?id=' + id,
            method: 'get'
        })
    },
    /**
     * 保存数据
     * @param {Object} data 要保存的实体
     * @returns 保存是否成功
     */
    Save(data) {
        return request({
            url: '/api/Bas_Contact/Save',
            method: 'post',
            data: data
        })
    },
    /**
     * 删除实体数据
     * @param {Array<String>} ids 要删除的实体主键
     * @returns 删除是否成功
     */
    Delete(ids) {
        return request({
            url: '/api/Bas_Contact/Delete',
            method: 'delete',
            data: ids
        })
    },
    /**
     * 导出模板
     * @returns 是否成功
     */
     Exporttemplet() {
        return request({
            url: '/api/Bas_Contact/Exporttemplet',
            method: 'get'
        })
    },
    /**
     * 导出数据
     * @param {Object} query 查询条件
     * @returns excel文件地址
     */
    Export(query) {
        return request({
            url: '/api/Bas_Contact/Export',
            method: 'post',
            data: query
        })
    }
}
