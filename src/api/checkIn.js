import request from '@/utils/request'

//登记入住
export function checkIn(params) {
  return request({
    url: '/order/list/vip',
    method: 'get',
    params: params
  })
}

//退房
export function quit(params) {
  return request({
    url: '/order/list/vip',
    method: 'get',
    params: params
  })
}

//续住
export function renew(params) {
  return request({
    url: '/order/list/vip',
    method: 'get',
    params: params
  })
}
