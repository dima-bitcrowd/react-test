import React from 'react'
import Weather from './Weather.js'
import logo from './logo.svg'
import './App.css'


class App extends React.Component {
  constructor() {
      super()
      this.state = {
        "weather": "load"
      }
  }

  componentDidMount() {
    var getPosition = function (options) {
      return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
      })
    }

    getPosition({timeout:10000})
      .then((position) => {
        this.loadWeatherData(position.coords.latitude, position.coords.longitude)
      })
      .catch((err) => {
        // Failed to get using geolocation. Try to get it using geoip service.
        const geoIpUrl = "http://api.ipstack.com/check?access_key=593a4b0360d0a50b3955f7bb888665ed"

        fetch(geoIpUrl)
        .then(response => response.json())
        .then(data => {
          if (typeof data.latitude === undefined)
            throw new Error('No location')

          this.loadWeatherData(data.latitude, data.longitude)
        })
        .catch((err) => {
          this.setState({'weather': 'error'})
        })     
      }) 
  }

  loadWeatherData(latitude, longitude)
  {
    const proxyUrl = "https://api.codetabs.com/v1/proxy/?quest="
    const url = "https://www.metaweather.com/api/location/search/?lattlong=" + latitude + "," + longitude
    const finalUrl = proxyUrl + encodeURI(url)

    fetch(finalUrl, { mode: 'cors' })
    .then(response => response.json())
    .then(data => {
      if (data.length === 0)
        throw new Error('No location')

      const woeid = data[0].woeid
      const url = "https://www.metaweather.com/api/location/" + woeid + "/"
      const finalUrl = proxyUrl + encodeURI(url)

      return fetch(finalUrl, { mode: 'cors' })
    })
    .then(response => response.json())
    .then(data => {
      if (typeof data.consolidated_weather === undefined)
        throw new Error('Invalid weather data')

      this.setState({'weather': data})
    })      
    .catch((err) => {
      this.setState({'weather': 'error'})
    }) 
  }
 
  render() {
    if (this.state.weather === 'load')
    {
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Loading data...
            </p>
          </header>
        </div>
      )      
    }
//    593a4b0360d0a50b3955f7bb888665ed
    if (this.state.weather === 'error')
    {
      return (
        <div className="App">
          <header className="App-header">
            <p>
              Weather forecast is not available now. Please retry later.
            </p>
          </header>
        </div>
      )      
    }    
    return (
      <div className="App">
        <Weather data={this.state.weather}/>
      </div>
    )
  }
}

export default App
