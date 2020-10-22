import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/order/list/vip',
    method: 'get',
    params: params
  })
}

export function cancel(orderId) {
  return request({
    url: '/cancel/vip/'+orderId,
    method: 'get',
  })
}

export function getOrderById(params) {
  return request({
    url: '/getOrderById',
    method: 'get',
    params: params
  })
}
export function updateOrder(data) {
  return request({
    url: '/update',
    method: 'post',
    data: data
  })
}

export function addOrder(data) {
  return request({
    url: '/create',
    method: 'post',
    data: data
  })
}
