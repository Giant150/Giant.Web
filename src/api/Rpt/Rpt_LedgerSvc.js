import request from '@/utils/request'
/**
 * Rpt_Ledger API接口服务
 */
export default {
    /**
     * 请求分页数据
     * @param {String} whseId 仓库Id
     * @param {String} date 当前日期
     * @returns 分页数据
     */
    GetLedgerAge(whseId, date) {
        return request({
            url: `/api/Rpt_Ledger/GetLedgerAge?whseId=${whseId}&date=${date}`,
            method: 'get'
        })
    }
}
