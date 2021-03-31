import request from '@/utils/request'
/**
 * Bas_SkuType API接口服务
 */
export default {
    /**
     * 获取分类树
     * @param {String} whseId 仓库ID
     * @returns 分页数据
     */
    GetTree(whseId) {
        return request({
            url: `/api/Bas_SkuType/GetTree?whseId=${whseId}`,
            method: 'get'
        })
    },
    /**
     * 获取单个实体数据
     * @param {string} id 主键
     * @returns 实体数据
     */
    Get(id) {
        return request({
            url: '/api/Bas_SkuType/Get?id=' + id,
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
            url: '/api/Bas_SkuType/Save',
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
            url: '/api/Bas_SkuType/Delete',
            method: 'delete',
            data: ids
        })
    }
}
