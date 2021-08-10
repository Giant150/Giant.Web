import request from '@/utils/request'
/**
 * Rpt_InvSku API接口服务
 */
export default {
    /**
     * 获取物料汇总数据
     * @param {Object} parameter 查询参数
     * @returns 汇总数据
     */
     GetSummary(parameter) {
        return request({
            url: '/api/Rpt_InvSku/GetSummary',
            method: 'post',
            data: parameter
        })
    },
    /**
     * 导出数据
     * @param {Object} query 查询条件
     * @returns excel文件地址
     */
    Export(query) {
        return request({
            url: '/api/Rpt_InvSku/Export',
            method: 'post',
            data: query
        })
    }
}
