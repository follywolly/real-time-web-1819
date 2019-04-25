const weather = {
  init(forecast) {
    this.els = document.querySelectorAll('.weather')
    this.update(forecast)
  },
  update(forecast) {
    forecast.weather = 'clear'
    let weather, color, duration, extra
    if (forecast.weather === 'rain') {
      weather = 'rain'
      color = '#666'
      duration = '1'
    }
    if (forecast.weather === 'thunderstorm') {
      weather = 'rain'
      color = '#000'
      duration = '0.4'
      extra = 'opacity: 0.4; background-size: 2000px'
    }
    if (forecast.weather === 'drizzle') {
      weather = 'rain'
      color = '#000'
      duration = '4'
      extra = 'background-size: cover;'
    }
    if (forecast.weather === 'mist' || forecast.weather === 'fog' || forecast.weather === 'haze' ) {
      weather = 'clouds'
      color = '#ccc'
      duration = '10'
      extra = 'background-size: 960px;'
    }
    if (forecast.weather === 'clouds') {
      weather = 'clouds'
      color = '#777'
      duration = '7'
      extra = 'background-size: 960px;'
    }
    if (forecast.weather === 'clear') {
      weather = 'clear'
      color = 'rgba(0,0,0,0)'
      duration = '0'
      extra = 'opacity: 1; background-size: cover;'
    }

    if (weather && color && duration) {
      this.els.forEach(el => {
        el.style = `background: ${color} url("/images/weather/${weather}.png") no-repeat center; animation-duration: ${duration}s; ${extra}`
      })
    }
  }
}

export default weather
