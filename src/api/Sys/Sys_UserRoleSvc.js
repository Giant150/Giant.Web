import request from '@/utils/request'
/**
 * Sys_UserRole API接口服务
 */
export default {
    /**
     * 请求分页数据
     * @param {Object} parameter 查询参数
     * @returns 分页数据
     */
    GetPage(parameter) {
        return request({
            url: '/api/Sys_UserRole/GetPage',
            method: 'post',
            data: parameter
        })
    },
    /**
     * 保存数据
     * @param {String} userId 用户ID
     * @param {Array<String>} roleIds 用户所属角色
     * @returns 保存是否成功
     */
    Save(userId, roleIds) {
        return request({
            url: '/api/Sys_UserRole/Save?userId=' + userId,
            method: 'post',
            data: roleIds
        })
    },
    /**
     * 删除实体数据
     * @param {String} userId 用户ID
     * @param {Array<String>} roleIds 用户所属角色
     * @returns 删除是否成功
     */
    Delete(userId, roleIds) {
        return request({
            url: '/api/Sys_UserRole/Delete?userId=' + userId,
            method: 'delete',
            data: roleIds
        })
    }
}
