import request from '@/utils/request'

export function sentVerificationCode(params) {
  return request({
    url: '/mail/sentMailVerificationCode',
    method: 'get',
    params: params
  })
}






