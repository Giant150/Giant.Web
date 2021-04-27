import request from '@/utils/request'
/**
 * Bus_Receipt API接口服务
 */
export default {
    /**
     * 请求分页数据
     * @param {Object} parameter 查询参数
     * @returns 分页数据
     */
    GetPage(parameter) {
        return request({
            url: '/api/Bus_Receipt/GetPage',
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
            url: '/api/Bus_Receipt/Get?id=' + id,
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
            url: '/api/Bus_Receipt/Save',
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
            url: '/api/Bus_Receipt/Delete',
            method: 'delete',
            data: ids
        })
    },
    /**
     * 生成上架任务
     * @param {string} id 主键
     * @returns 实体数据
     */
     PutawayTask(id) {
        return request({
            url: '/api/Bus_Receipt/PutawayTask?id=' + id,
            method: 'post'
        })
    }
}
