import request from '@/utils/request'
/**
 * Bas_Whse API接口服务
 */
export default {
    /**
     * 请求分页数据
     * @param {Object} parameter 查询参数
     * @returns 分页数据
     */
    GetPage(parameter) {
        return request({
            url: '/api/Bas_Whse/GetPage',
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
            url: '/api/Bas_Whse/Get?id=' + id,
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
            url: '/api/Bas_Whse/Save',
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
            url: '/api/Bas_Whse/Delete',
            method: 'delete',
            data: ids
        })
    },
    /**
     * 修改实体状态
     * @param {String} id 要修改的实体主键
     * @param {String} status 实体状态
     * @returns 修改实体状态是否成功
     */
    UpdateStatus(id, status) {
        return request({
            url: `/api/Bas_Whse/UpdateStatus?id=${id}&status=${status}`,
            method: 'patch'
        })
    },
    /**
     * 获取当前用户有权限的仓库列表
     * @returns 仓库列表
     */
    GetByUser() {
        return request({
            url: '/api/Bas_Whse/GetByUser',
            method: 'get'
        })
    }
}
