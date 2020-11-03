import request from '@/utils/request'

//获取事件列表
export function fetchList(params) {
  return request({
    url: '/event/fetchList',
    method: 'get',
    params: params
  })
}
//事件上报/保存草稿
export function report(data) {
  return request({
    url: '/event/report',
    method: 'post',
    data: data
  })
}


//删除事件
export function deleteEventById(id) {
  return request({
    url: '/event/deleteEventById/'+id,
    method: 'get',
  })
}
//根据id获取事件
export function getEventById(id) {
  return request({
    url: '/event/getEventById/'+id,
    method: 'get',
  })
}
//根据id取消上报事件
export function cancelReportById(id) {
  return request({
    url: '/event/cancelReportById/'+id,
    method: 'post',
  })
}

//将事件草稿上报
export function reportFromDraft(id) {
  return request({
    url: '/event/reportFromDraft/'+id,
    method: 'post',
  })
}


//审核
export function check(data) {
  return request({
    url: '/event/check',
    method: 'post',
    data: data
  })
}
//改变任务状态：接受任务、取消任务、提交完成任务
export function changeStatus(data) {
  return request({
    url: '/event/changeStatus',
    method: 'post',
    data: data
  })
}
