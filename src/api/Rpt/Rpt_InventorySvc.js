import request from '@/utils/request'
/**
 * Rpt_Inventory API接口服务
 */
export default {
    /**
     * 获取库存统计
     * @param {String} whseId 仓库Id
     * @returns 统计
     */
    GetInvSummary(whseId) {
        return request({
            url: `/api/Rpt_Inventory/GetInvSummary?whseId=${whseId}`,
            method: 'get'
        })
    },
    /**
     * 获取前10位物料类型
     * @param {String} whseId 仓库Id
     * @returns 统计
     */
     GetSummaryBySkuType(whseId) {
        return request({
            url: `/api/Rpt_Inventory/GetSummaryBySkuType?whseId=${whseId}`,
            method: 'get'
        })
    },
    /**
     * 获取上架区域统计
     * @param {String} whseId 仓库Id
     * @returns 统计
     */
     GetSummaryByPutaway(whseId) {
        return request({
            url: `/api/Rpt_Inventory/GetSummaryByPutaway?whseId=${whseId}`,
            method: 'get'
        })
    },
    /**
     * 获取货主统计
     * @param {String} whseId 仓库Id
     * @returns 统计
     */
     GetSummaryByStorer(whseId) {
        return request({
            url: `/api/Rpt_Inventory/GetSummaryByStorer?whseId=${whseId}`,
            method: 'get'
        })
    }
}
