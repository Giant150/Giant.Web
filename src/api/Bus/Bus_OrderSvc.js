import request from '@/utils/request'
/**
 * Bus_Order API接口服务
 */
export default {
    /**
     * 请求分页数据
     * @param {Object} parameter 查询参数
     * @returns 分页数据
     */
    GetPage(parameter) {
        return request({
            url: '/api/Bus_Order/GetPage',
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
            url: '/api/Bus_Order/Get?id=' + id,
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
            url: '/api/Bus_Order/Save',
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
            url: '/api/Bus_Order/Delete',
            method: 'delete',
            data: ids
        })
    },
    /**
     * 配货
     * @param {String} id 主键
     * @returns 配货是否成功
     */
    Allocate(id) {
        return request({
            url: '/api/Bus_Order/Allocate?id=' + id,
            method: 'post'
        })
    },
    /**
     * 撤销配货
     * @param {String} id 主键
     * @returns 撤销配货是否成功
     */
     RejectAllocate(id) {
        return request({
            url: '/api/Bus_Order/RejectAllocate?id=' + id,
            method: 'post'
        })
    },
    /**
     * 释放拣货任务
     * @param {String} id 主键
     * @returns 释放拣货任务是否成功
     */
     Release(id) {
        return request({
            url: '/api/Bus_Order/Release?id=' + id,
            method: 'post'
        })
    },
    /**
     * 发货确认
     * @param {String} id 主键
     * @returns 发货确认是否成功
     */
     Shipping(id) {
        return request({
            url: '/api/Bus_Order/Shipping?id=' + id,
            method: 'post'
        })
    },
    /**
     * 打印拣货单
     * @param {string} id 主键
     * @returns 打印拣货单
     */
     PickPrint(id) {
        return request({
            url: '/api/Bus_Order/PickPrint?id=' + id,
            method: 'get'
        })
    },
    /**
     * 打印送货单
     * @param {string} id 主键
     * @returns 打印拣货单
     */
     ShipPrint(id) {
        return request({
            url: '/api/Bus_Order/ShipPrint?id=' + id,
            method: 'get'
        })
    }
}
