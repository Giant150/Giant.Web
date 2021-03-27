import request from '@/utils/request'
/**
 * Bas_RoleWhse API接口服务
 */
export default {
    /**
     * 请求分页数据
     * @param {Object} parameter 查询参数
     * @returns 分页数据
     */
    GetPage(parameter) {
        return request({
            url: '/api/Bas_RoleWhse/GetPage',
            method: 'post',
            data: parameter
        })
    },
    /**
     * 保存数据
     * @param {String} whseId 用户ID
     * @param {Array<String>} roleIds 用户所属角色
     * @returns 保存是否成功
     */
    Save(whseId, roleIds) {
        return request({
            url: '/api/Bas_RoleWhse/Save?whseId=' + whseId,
            method: 'post',
            data: roleIds
        })
    },
    /**
     * 删除实体数据
     * @param {String} whseId 用户ID
     * @param {Array<String>} roleIds 用户所属角色
     * @returns 删除是否成功
     */
    Delete(whseId, roleIds) {
        return request({
            url: '/api/Bas_RoleWhse/Delete?whseId=' + whseId,
            method: 'delete',
            data: roleIds
        })
    }
}
