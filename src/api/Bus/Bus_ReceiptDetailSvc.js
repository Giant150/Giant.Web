import request from '@/utils/request'
/**
 * Bus_ReceiptDetail API接口服务
 */
export default {
    /**
     * 请求分页数据
     * @param {Object} parameter 查询参数
     * @returns 分页数据
     */
    GetPage(parameter) {
        return request({
            url: '/api/Bus_ReceiptDetail/GetPage',
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
            url: '/api/Bus_ReceiptDetail/Get?id=' + id,
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
            url: '/api/Bus_ReceiptDetail/Save',
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
            url: '/api/Bus_ReceiptDetail/Delete',
            method: 'delete',
            data: ids
        })
    },
    /**
     * 收货回转
     * @param {String} id 收货明细Id
     * @returns 收货回转是否成功
     */
    Adjustment(id) {
        return request({
            url: '/api/Bus_ReceiptDetail/Adjustment?id=' + id,
            method: 'post'
        })
    },
    /**
     * 生成序列号
     * @param {String} id 收货明细Id
     * @returns 序列号
     */
     GenerateSerial(id) {
        return request({
            url: '/api/Bus_ReceiptDetail/GenerateSerial?id=' + id,
            method: 'get'
        })
    }
}
