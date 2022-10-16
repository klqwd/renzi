import request from '@/utils/request'
export function getEmployee(){
    return request({
        url:"/sys/user/simple"
    })
}

  /**
 * 获取员工的综合列表数据
 * ***/
export function getEmployeeList(params) {
    return request({
      url: '/sys/user',
      params
    })
}
  /** **
 *  新增员工的接口
 * **/
export function addEmployee(data) {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}
/**
 * 删除员工接口
 * ****/

 export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}
/** *
 *  封装一个导入员工的接口
 *
 * ***/

 export function importEmployee(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

/**
 * 
 * 获取用户详细信息
 */
export function getUserDetail(id) {
  return request({
    url:`/sys/user/${id}`,
    methods:"get"
  })
}
/**
 * 获取员工信息
 */
export function getEmployeesInfo(id) {
  return request({
    url: `/employees/${id}/personalInfo`,
    methods:"get"
  })
}
/**
 * 更新员工信息
 */
export function updatePersonal(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data,
  })
}

/** **
 * 获取用户的岗位信息
 *
 * ****/
 export function getJobDetail(id) {
  return request({
    url: `/employees/${id}/jobs`,
  })
}
/**
 * 保存岗位信息
 */
 export function updateJob(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}
/**
 * 获取员工岗位信息
 */
export function getEmployeeJobInfo(id) {
  return request({
    url:`/employees/${id}/jobs`
  })
}
