import React from 'react';
import './Weather.css';


function getDayName(date)
{
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const dayName = days[date.getDay()]
    
    return dayName
}

function WeatherDetails(props) {
    const data = props.data

    return (
        <div className="containter">
            <div className="row">
                <h6>{data.dateStr}</h6>
            </div>
            <div className="row">
                <div className="temperature-text">
                    {data.temperature}&#x00B0;
                </div>
                <div className="text-right-image">
                    <img width="48" height="48" alt="" src={data.stateImageUrl}/>
                </div>
            </div>
            <div className="row">
                <div>
                    {data.weatherState}. High {data.maxTemp}&#x00B0;. Low {data.minTemp}&#x00B0;. Winds {data.windDirection} at {data.windSpeed} mp/h.
                </div>
            </div>
            <div className="row margin-top-10">
                <div className="col d-flex">
                    <div className="d-flex align-items-center">
                        <img width="32" height="32" alt="" src="humidity.svg"/>
                    </div>
                    <div className="image-right-text">
                        <div>Humidity</div>
                        <div><b>{data.humidity}%</b></div>
                    </div>
                </div>
                <div className="col d-flex">
                    <div className="d-flex align-items-center">
                        <img width="32" height="32" alt="" src="barometer.svg"/>
                    </div>
                    <div className="image-right-text">
                        <div>Air pressure</div>
                        <div><b>{data.pressure} Mbar</b></div>
                    </div>
                </div>
                <div className="col d-flex">
                    <div className="d-flex align-items-center">
                        <img width="32" height="32" alt="" src="mist.svg"/>
                    </div>
                    <div className="image-right-text">
                        <div>Visibility</div>
                        <div><b>{data.visibility} miles</b></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function WeatherCard(data, cardIndex) {
    const idCard = "card" + cardIndex
    const idHeading = "heading" + cardIndex
    const idCollapse = "collapse" + cardIndex
    const hrefCollapse = "#" + idCollapse
    const date = new Date(data.applicable_date);
    
    const formattedData = {
        'temperature': Math.round(data.the_temp),
        'minTemp': Math.round(data.min_temp),
        'maxTemp': Math.round(data.max_temp),
        'weatherState': data.weather_state_name,
        'windSpeed': Math.round(data.wind_speed),
        'windDirection': data.wind_direction_compass,
        'dateStr': getDayName(date) + ' ' + date.getDate(),
        'stateImageUrl': "https://www.metaweather.com/static/img/weather/" + data.weather_state_abbr + ".svg",
        'humidity': data.humidity,
        'pressure': data.air_pressure,
        'visibility': Math.round(data.visibility)

    }

    var summaryMode = true
    var hrefStyle = "link-unstyled collapsed"
    var detailsClassName = "collapse"

    if (cardIndex === 0)
    {
        summaryMode = false
        hrefStyle = "link-unstyled"
        detailsClassName = "collapse show"    
    }

    return (
        <div className="card" key={idCard}>
            <h6 className="card-header" role="tab" id={idHeading}>
                <a className={hrefStyle} data-toggle="collapse" href={hrefCollapse} role="button" aria-expanded={!summaryMode} aria-controls="collapse1">
                    <div className="containter">
                        <div className="row">
                            <div className="col-2 col-sm-2 d-flex align-items-center collapsed-visible">{formattedData.dateStr}</div>
                            <div className="col-2 col-sm-2 d-flex align-items-center collapsed-visible">{formattedData.temperature}&#8451;</div>
                            <div className="col-3 col-sm-3 d-flex align-items-center collapsed-visible">
                                <img width="24" height="24" alt="" src={formattedData.stateImageUrl}/>
                                <span className="image-right-text">{formattedData.weatherState}</span>
                            </div>
                            <div className="col d-flex align-items-center collapsed-visible">
                                <img width="24" height="24" alt="" src="wind.svg"/>
                                <span className="image-right-text">{formattedData.windDirection} {formattedData.windSpeed} mp/h</span>
                            </div>
                            <div className="col-1 col-sm-1 d-flex align-items-center justify-content-end">
                                <div className="arrow-down">&#xf078;</div>
                                <div className="arrow-up">&#xf077;</div>
                            </div>
                        </div>
                    </div>
                </a>
            </h6>
            <div id={idCollapse} className={detailsClassName} aria-labelledby={idHeading}>
                <div className="card-body">
                    <WeatherDetails data={formattedData}/>
                </div>
            </div>
        </div>
    )
}

function Weather(props) {
    var location = props.data.title
    const daysCount = props.data.consolidated_weather.length

    if (props.data.parent !== undefined &&
        props.data.parent.title !== undefined)
        location += ", " + props.data.parent.title

    return (
        <div className="accordion" id="accordion">
            <div className="card">
                <div className="card-header"><h5>{daysCount} Day Weather</h5> - {location}</div>
            </div>
                {
                  props.data.consolidated_weather.map((value, index) => {
                    return WeatherCard(value, index)
                  })
                }
        </div>
    )
}


export default Weather