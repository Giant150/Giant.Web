import request from '@/utils/request'
/**
 * CF_CodeType API接口服务
 */
export default {
    /**
     * 请求分页数据
     * @param {Object} parameter 查询参数
     * @returns 分页数据
     */
    GetPage(parameter) {
        return request({
            url: '/api/CF_CodeType/GetPage',
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
            url: '/api/CF_CodeType/Get?id=' + id,
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
            url: '/api/CF_CodeType/Save',
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
            url: '/api/CF_CodeType/Delete',
            method: 'delete',
            data: ids
        })
    },
    /**
     * 生成编码
     * @param {String} whseId 仓库ID
     * @param {String} code 编码类型代码
     * @param {Object} para 编码参数
     */
    Generate(whseId, code, para) {
        return request({
            url: `/api/CF_CodeType/Generate?whseId=${whseId}&code=${code}`,
            method: 'post',
            data: para
        })
    }
}
