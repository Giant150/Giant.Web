import request from '@/utils/request'
/**
 * Inv_Inventory API接口服务
 */
export default {
    /**
     * 请求分页数据
     * @param {Object} parameter 查询参数
     * @returns 分页数据
     */
    GetPage(parameter) {
        return request({
            url: '/api/Inv_Inventory/GetPage',
            method: 'post',
            data: parameter
        })
    },
    /**
     * 获取单个实体数据
     * @param {String} id 主键
     * @returns 实体数据
     */
    Get(id) {
        return request({
            url: '/api/Inv_Inventory/Get?id=' + id,
            method: 'get'
        })
    },
    /**
     * 冻结/解冻库存
     * @param {String} status None/Hold
     * @param {Array<String>} ids ids
     * @returns 冻结/解冻
     */
    UpdateStatus(status, ids) {
        return request({
            url: '/api/Inv_Inventory/UpdateStatus?status=' + status,
            method: 'post',
            data: ids
        })
    }
}
