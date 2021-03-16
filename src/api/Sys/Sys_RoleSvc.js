import request from '@/utils/request'
/**
 * Sys_Role API接口服务
 */
export default {
    /**
     * 请求分页数据
     * @param {Object} parameter 查询参数
     * @returns 分页数据
     */
    GetPage(parameter) {
        return request({
            url: '/api/Sys_Role/GetPage',
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
            url: '/api/Sys_Role/Get?id=' + id,
            method: 'get'
        })
    },
    /**
    * 获取角色的权限菜单
    * @param {string} id 角色Id
    * @returns 实体数据
    */
    GetMenu(id) {
        return request({
            url: '/api/Sys_Role/GetMenu?roleId=' + id,
            method: 'get'
        })
    },
    /**
    * 获取角色的可有权限
    * @param {string} id 角色Id
    * @returns 实体数据
    */
    GetAccess(id) {
        return request({
            url: '/api/Sys_Role/GetAccess?roleId=' + id,
            method: 'get'
        })
    },
    /**
    * 保存权限
    * @param {string} id 角色Id
    * @param {Array} access 角色Id
    * @returns 实体数据
    */
    SaveAccess(id, access) {
        return request({
            url: '/api/Sys_Role/SaveAccess?roleId=' + id,
            method: 'post',
            data: access
        })
    },
    /**
     * 保存数据
     * @param {Object} data 要保存的实体
     * @returns 保存是否成功
     */
    Save(data) {
        return request({
            url: '/api/Sys_Role/Save',
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
            url: '/api/Sys_Role/Delete',
            method: 'delete',
            data: ids
        })
    }
}
