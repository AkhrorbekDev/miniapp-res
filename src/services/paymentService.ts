import { api } from '@/services/api.ts'


const paymentService = () => {

  return {
    pay: (data: object) => api('/payment', {
      method: 'POST',
      body: data
    }),
    refund: (data: object) => api('/payment/refund', {
      method: 'POST',
      body: data
    })
  }
}

export default paymentService
