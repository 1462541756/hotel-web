import request from '@/utils/request'

//登记入住
export function checkPeople(data) {
  return request({
    url: '/check/checkPeople',
    method: 'post',
    data: data
  })
}

//查询入住信息
export function checkOut(id) {
  return request({
    url: '/check/checkOut/'+id,
    method: 'post'
  })
}

//获取房间选项
export function fetchOptions() {
  return request({
    url: '/check/fetchOptions',
    method: 'get',
  })
}


//查询入住信息
export function getDetail(params) {
  return request({
    url: '/check/getDetail',
    method: 'get',
    params:params
  })
}

//获取入住信息列表
export function fetchList(params) {
  return request({
    url: '/check/fetchList/',
    method: 'get',
    params:params
  })
}



