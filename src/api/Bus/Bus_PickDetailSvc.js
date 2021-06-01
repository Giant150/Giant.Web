import request from '@/utils/request'
/**
 * Bus_PickDetail API接口服务
 */
export default {
    /**
     * 请求分页数据
     * @param {Object} parameter 查询参数
     * @returns 分页数据
     */
    GetPage(parameter) {
        return request({
            url: '/api/Bus_PickDetail/GetPage',
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
            url: '/api/Bus_PickDetail/Get?id=' + id,
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
            url: '/api/Bus_PickDetail/Save',
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
            url: '/api/Bus_PickDetail/Delete',
            method: 'delete',
            data: ids
        })
    },
    /**
     * 新增拣货明细
     * @param {Object} data 要新增的实体
     * @returns 新增是否成功
     */
     Add(data) {
        return request({
            url: '/api/Bus_PickDetail/Add',
            method: 'post',
            data: data
        })
    },
    /**
     * 撤销配货
     * @param {String} id 数据主键
     * @returns 撤销配货是否成功
     */
     RejectAllocate(id) {
        return request({
            url: `/api/Bus_PickDetail/RejectAllocate?id=${id}`,
            method: 'delete'
        })
    }
}
