import request from '@/utils/request'
/**
 * Rpt_InvSkuLot API接口服务
 */
export default {
    /**
     * 请求分页数据
     * @param {Object} parameter 查询参数
     * @returns 分页数据
     */
     GetSummary(parameter) {
        return request({
            url: '/api/Rpt_InvLot/GetSummary',
            method: 'post',
            data: parameter
        })
    },
    /**
     * 保存数据
     * @param {Object} data 要保存的实体
     * @returns 保存是否成功
     */
     Export(data) {
        return request({
            url: '/api/Rpt_InvLot/Export',
            method: 'post',
            data: data
        })
    }
}
