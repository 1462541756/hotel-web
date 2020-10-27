import request from '@/utils/request'
//获取用户角色
export function getLoginInfo(id) {
  return request({
    url: '/admin/info',
    method: 'get'
  })
}
