import request from '@/utils/request'
/**
 * Rtp_InvIn API接口服务
 */
export default {
    /**
     * 请求分页数据
     * @param {Object} parameter 查询参数
     * @returns 分页数据
     */
     GetSummary(parameter) {
        return request({
            url: '/api/Rpt_InvIn/GetSummary',
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
            url: '/api/Rpt_InvIn/Export',
            method: 'post'
        })
    }
}
