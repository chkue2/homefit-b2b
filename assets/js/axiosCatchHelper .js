export default {
  alertIfHasMessage(error) {
    let errorData = null

    if (error.homefit) {
      errorData = error.homefit
    } else if (!error || !error.response || !error.response.data) {
      return null
    } else {
      errorData = error.response.data
    }

    if (errorData === null || !errorData.message) {
      return
    }

    alert(errorData.message)
  },
}
