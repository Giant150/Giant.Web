import request from '@/utils/request'
/**
 * Rpt_Inventory API接口服务
 */
export default {
    /**
     * 请求分页数据
     * @param {String} whseId 仓库Id
     * @returns 分页数据
     */
     GetInvSummary(whseId) {
        return request({
            url: `/api/Rpt_Inventory/GetInvSummary?whseId=${whseId}`,
            method: 'get'
        })
    }
}
