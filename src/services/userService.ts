// src/services/userService.js
import { api } from './api'

export const createUserService = () => {
  const authApi = api
  return {
    // Get user details
    getUserDetails: () => authApi('/users/me'),

    updateUserDetails: (data) => authApi('/questionnaire/', {
      method: 'PATCH',
      body: data
    }),

    getUserEvents: () => authApi(`/events/my-registrations/`),

    getUserAnket: () => authApi('/questionnaire/'),

    getUserPosition: () => api('/onboarding/position/'),
    changePosition: (position: number) => api('/onboarding/position/', {
      method: 'PATCH',
      body: {
        position: position
      }
    }),
    getUserEventsStats: () => api('/events/past/'),
    changeAvatar: (data: any) => api('/questionnaire/', {
      method: 'PATCH',
      body: data
    }),
    registerToEvent: (data: any) => api('/events/register/', {
      method: 'POST',
      body: data
    }),
    updateEvent: (data: any) => api('/events/update-registration/', {
      method: 'PATCH',
      body: data
    }),
    cancelEvent: (data: any) => api('/payments/refund/', {
      method: 'POST',
      body: data
    }),
    deleteUser: () => api('/account/delete/', {
      method: 'DELETE'
    }),
    getUserContacts: () => api('/user/contacts/'),
    getUserEventStats: (eventId?: number) => api(`/events/status/`),
  }
}
