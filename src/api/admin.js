import request from '@/utils/request'
//获取用户角色
export function getLoginInfo() {
  return request({
    url: '/admin/info',
    method: 'get'
  })
}
