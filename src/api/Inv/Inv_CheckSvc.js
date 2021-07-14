import request from '@/utils/request'
/**
 * Inv_Check API接口服务
 */
export default {
    /**
     * 请求分页数据
     * @param {Object} parameter 查询参数
     * @returns 分页数据
     */
    GetPage(parameter) {
        return request({
            url: '/api/Inv_Check/GetPage',
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
            url: '/api/Inv_Check/Get?id=' + id,
            method: 'get'
        })
    },
    /**
     * 保存数据
     * @param {Object} data 要保存的实体
     * @returns 保存是否成功
     */
    Save(data) {
        return request({
            url: '/api/Inv_Check/Save',
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
            url: '/api/Inv_Check/Delete',
            method: 'delete',
            data: ids
        })
    },
    /**
     * 开始盘点
     * @param {string} id 主键
     * @returns AjaxResut
     */
     Start(id) {
        return request({
            url: '/api/Inv_Check/Start?id=' + id,
            method: 'post'
        })
    },
    /**
     * 打印盘点报表
     * @param {string} id 主键
     * @returns AjaxResut
     */
     Print(id) {
        return request({
            url: '/api/Inv_Check/Print?id=' + id,
            method: 'get'
        })
    },
    /**
     * 生成盘点任务
     * @param {string} id 主键
     * @returns AjaxResut
     */
     CheckTask(id) {
        return request({
            url: '/api/Inv_Check/CheckTask?id=' + id,
            method: 'post'
        })
    },
    /**
     * 盘点确认
     * @param {string} id 主键
     * @returns AjaxResut
     */
     Checked(id) {
        return request({
            url: '/api/Inv_Check/Checked?id=' + id,
            method: 'post'
        })
    },
    /**
     * 复核
     * @param {string} id 主键
     * @returns AjaxResut
     */
     Confirmed(id) {
        return request({
            url: '/api/Inv_Check/Confirmed?id=' + id,
            method: 'post'
        })
    },
    /**
     * 生成调整单
     * @param {string} id 主键
     * @returns AjaxResut
     */
     Adjust(id) {
        return request({
            url: '/api/Inv_Check/Adjust?id=' + id,
            method: 'post'
        })
    },
    /**
     * 完成
     * @param {string} id 主键
     * @returns AjaxResut
     */
     Completed(id) {
        return request({
            url: '/api/Inv_Check/Completed?id=' + id,
            method: 'post'
        })
    },
    /**
     * 导出
     * @param {string} id 主键
     * @returns AjaxResut
     */
     Export(id) {
        return request({
            url: '/api/Inv_Check/Export?id=' + id,
            method: 'get'
        })
    }
}
