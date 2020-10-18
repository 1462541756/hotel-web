import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/room/list',
    method: 'get',
    params: params
  })
}

export function getRoomById(id) {
  return request({
    url: '/room/getRoomById/'+id,
    method: 'get'
  })
}

export function addRoom(data) {
  return request({
    url: '/room/addRoom',
    method: 'post',
    data: data
  });
}

export function updateRoom(data) {
  return request({
    url: '/room/updateRoom',
    method: 'post',
    data: data
  });
}

export function deleteRoomById(id) {
  return request({
    url: '/room/deleteById/'+id,
    method: 'get',
  });
}




