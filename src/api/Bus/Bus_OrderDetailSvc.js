import request from '@/utils/request'
/**
 * Bus_OrderDetail API接口服务
 */
export default {
    /**
     * 请求分页数据
     * @param {Object} parameter 查询参数
     * @returns 分页数据
     */
    GetPage(parameter) {
        return request({
            url: '/api/Bus_OrderDetail/GetPage',
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
            url: '/api/Bus_OrderDetail/Get?id=' + id,
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
            url: '/api/Bus_OrderDetail/Save',
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
            url: '/api/Bus_OrderDetail/Delete',
            method: 'delete',
            data: ids
        })
    },
    /**
     * 撤销配货
     * @param {String} id 主键
     * @returns 撤销配货是否成功
     */
     RejectAllocate(id) {
        return request({
            url: '/api/Bus_OrderDetail/RejectAllocate?id=' + id,
            method: 'post'
        })
    }
}
