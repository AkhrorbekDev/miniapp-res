import { api } from '@/services/api'


const promocodeService = () => {
  return {
    getPromocode: (query) => api('/events/promocode/', {
      method: 'POST',
      body: query
    })
  }
}

const eventsService = () => {


  return {
    getEvents: (query?) => api('/events/', {
      method: 'GET',
      params: query
    })
  }
}

const questionnaireService = () => {

  return {
    getDictionaries: () => api('/questionnaire/dictionaries/', {
      method: 'GET'
    })
  }
}



export {
  promocodeService,
  questionnaireService,
  eventsService
}
