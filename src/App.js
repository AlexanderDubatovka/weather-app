import React, { useState, useEffect } from 'react'
import keys from './keys'
import Loader from './Loader'

const api = {
  key: keys.API_KEY,
  base: keys.BASE_URL,
}

function App() {

  const [query, setQuery] = useState('')
  const [data, setData] = useState()
  const [degree, setDegree] = useState(true)
  const [loading, setLoading] = useState(true)
  const [frame, setFrame] = useState(false)

  const degreeCelChange = event => {
    event.preventDefault()
    setDegree(false)
  }

  const degreeFarChange = event => {
    event.preventDefault()
    setDegree(true)
  }

  const dateBuild = d => {
    let date = String(new window.Date())
    date = date.slice(3, 21)
    return date
  }

  let c = localStorage.getItem('lastSelectedLocation')

  useEffect(() => {
    if (c !== null) { 
      fetch(`${api.base}key=${api.key}&q=${c}&days=3`)
      .then(res => res.json())
      .then(result => {
        setData(result)
        localStorage.setItem('lastSelectedLocation', `${result.location.name}`)
        setLoading(false)
        setFrame(true)
      })
    } else if (!navigator.geolocation) {
      fetch(`${api.base}key=${api.key}&q=London&days=3`)
      .then(res => res.json())
      .then(result => {
        setData(result)
        localStorage.setItem('lastSelectedLocation', `${result.location.name}`)
        setLoading(false)
        setFrame(true)
     }) 
    } else {
    navigator.geolocation.getCurrentPosition(position => {
      let a = position.coords.latitude
      let b = position.coords.longitude
        fetch(`${api.base}key=${api.key}&q=${a},${b}&days=3`)
        .then(res => res.json())
        .then(result => {
          setData(result)
          localStorage.setItem('lastSelectedLocation', `${result.location.name}`)
          setLoading(false)
          setFrame(true)
       })
    })
    }
  }, [c])
  
  const search = event => {
    if (event.key === 'Enter') {

      function handleErrors(res) {
        if (!res.ok) {
            throw Error(res)
        }
        return res;
      }

      fetch(`${api.base}key=${api.key}&q=${query}&days=3`)
        .then(handleErrors)
        .then(res => res.json())
        .then(result => {
          setQuery('')
          setData(result)
          localStorage.setItem('lastSelectedLocation', `${result.location.name}`)
          setLoading(false)
          setFrame(true)
        })
        .catch(res => {
          setQuery('')
          alert('Invalid City Name, Please try again!')
        })
    }
  }


  return (

    <div className={'App'}>
      <main>
      {loading && <Loader />}
      { frame &&
      <div>
        <div className='search-container'>
          <input
            type='text'
            placeholder='Weather in your city...'
            className='search-bar'
            onChange={event => setQuery(event.target.value)}
            value={query}
            onKeyPress={search}
          />
        </div>

        <div className='location-container'>
          <div className='location'>
              {data && data.location.name + ','} {data && data.location.country}
          </div>
          <div className='date'> {dateBuild(new Date())}</div>
        </div>
        <div className='weather-container'>
          {degree === true ? (
          <div className='temperature'>
            {data && Math.round(data.current.temp_c) }°C
            <button onClick={degreeCelChange}>°F</button>
          </div> 
          ) : (
          <div className='temperature'>
            {data && Math.round(data.current.temp_f) }°F
            <button onClick={degreeFarChange}>°C</button>
          </div>
          )}
          {data && data.forecast.forecastday.map(item => (
            <div key={item.day.mintemp_c.toString()}>
              <div className='date'>{data && item.date}</div>
              {degree === true ? (
              <div className='weather'>{data && item.day.mintemp_c}°C - {data && item.day.maxtemp_c}°C</div>
              ) : (
              <div className='weather'>{data && item.day.mintemp_f}°F - {data && item.day.maxtemp_f}°F</div>
              )}
              <div className='weather'>{data && item.day.condition.text}</div>
              <div className='weather'>wind speed {data && Math.round(item.day.maxwind_kph / 3.6)} m/s</div>
              <br /><br /><br /><br /><br />
            </div>
          ))}
        </div>
      </div>
      }
      </main>
    </div>
    
  )
}

export default App