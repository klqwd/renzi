import request from '@/utils/request'

/** 
 * 获取组织架构数据
 **/
 export function getDepartments() {
    return request({
      url: '/company/department'
    })
  }
  /**
 *  新增部门接口
 *
 * ****/
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}
 /**
 *  编辑部门接口
 *
 * ****/
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
 /**
 *  删除部门接口
 *
 * ****/
  export function delDepartments(id) {
    return request({
      url: `/company/department/${id}`,
      method: 'delete'
    })
}
