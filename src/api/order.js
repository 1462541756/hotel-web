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
    url: '/order/cancel/vip/'+orderId,
    method: 'get',
  })
}

export function getOrderById(params) {
  return request({
    url: '/order/getOrderById/'+params,
    method: 'get',
  })
}
export function updateOrder(data) {
  return request({
    url: '/order/update',
    method: 'post',
    data: data
  })
}

export function addOrder(data) {
  return request({
    url: '/order/create',
    method: 'post',
    data: data
  })
}

export function commitOrder(data) {
  return request({
    url: '/order/commit',
    method: 'post',
    data: data
  })
}

export function commit(data) {
  return request({
    url: '/order/commit',
    method: 'post',
    params: data
  })
}
