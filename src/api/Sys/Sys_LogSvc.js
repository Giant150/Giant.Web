import request from '@/utils/request'
/**
 * Sys_Log API接口服务
 */
export default {
    /**
     * 请求分页数据
     * @param {Object} parameter 查询参数
     * @returns 分页数据
     */
    GetPage(parameter) {
        return request({
            url: '/api/Sys_Log/GetPage',
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
            url: '/api/Sys_Log/Get?id=' + id,
            method: 'get'
        })
    }
}
