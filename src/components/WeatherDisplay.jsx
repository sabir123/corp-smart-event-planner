import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterIcon from '@mui/icons-material/Water';
import AirIcon from '@mui/icons-material/Air';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import UmbrellaIcon from '@mui/icons-material/Umbrella';
import { format } from 'date-fns';

const WeatherDisplay = ({ weather, location, loading }) => {
  if (loading) {
    return (
      <Card elevation={3} sx={{ p: 2, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body2" color="textSecondary">
          Loading weather data...
        </Typography>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card elevation={3} sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body1">
          Search for a location to see weather information
        </Typography>
      </Card>
    );
  }

  const { main, weather: weatherInfo, wind } = weather;
  const weatherCondition = weatherInfo[0].main.toLowerCase();
  const description = weatherInfo[0].description;
  const temp = Math.round(main.temp);
  const feelsLike = Math.round(main.feels_like);
  const humidity = main.humidity;
  const windSpeed = Math.round(wind.speed * 3.6); // Convert m/s to km/h

  const getWeatherIcon = () => {
    if (weatherCondition.includes('clear')) {
      return <WbSunnyIcon sx={{ fontSize: 60, color: '#FFD700' }} />;
    } else if (weatherCondition.includes('cloud')) {
      return <CloudIcon sx={{ fontSize: 60, color: '#757575' }} />;
    } else if (weatherCondition.includes('rain') || weatherCondition.includes('drizzle')) {
      return <UmbrellaIcon sx={{ fontSize: 60, color: '#2196F3' }} />;
    } else if (weatherCondition.includes('thunder')) {
      return <ThunderstormIcon sx={{ fontSize: 60, color: '#673AB7' }} />;
    } else if (weatherCondition.includes('snow')) {
      return <AcUnitIcon sx={{ fontSize: 60, color: '#90CAF9' }} />;
    }
    return <WbSunnyIcon sx={{ fontSize: 60, color: '#FFD700' }} />;
  };

  return (
    <Card elevation={3} sx={{ p: 2, mb: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h5" component="h2" fontWeight="bold">
              {location || 'Unknown Location'}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </Typography>
          </Box>
          <Box textAlign="center">
            {getWeatherIcon()}
            <Typography variant="h4" component="div" fontWeight="bold">
              {temp}°C
            </Typography>
            <Typography variant="body2" color="textSecondary" textTransform="capitalize">
              {description}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" justifyContent="space-between" mt={3}>
          <Box display="flex" alignItems="center">
            <ThermostatIcon color="action" sx={{ mr: 1 }} />
            <Box>
              <Typography variant="body2" color="textSecondary">Feels like</Typography>
              <Typography variant="body1">{feelsLike}°C</Typography>
            </Box>
          </Box>
          
          <Box display="flex" alignItems="center">
            <WaterIcon color="action" sx={{ mr: 1 }} />
            <Box>
              <Typography variant="body2" color="textSecondary">Humidity</Typography>
              <Typography variant="body1">{humidity}%</Typography>
            </Box>
          </Box>
          
          <Box display="flex" alignItems="center">
            <AirIcon color="action" sx={{ mr: 1 }} />
            <Box>
              <Typography variant="body2" color="textSecondary">Wind</Typography>
              <Typography variant="body1">{windSpeed} km/h</Typography>
            </Box>
          </Box>
        </Box>

        <Box mt={2}>
          <Typography variant="body2" color="textSecondary" fontStyle="italic">
            {getWeatherSuggestion(weatherCondition, temp)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const getWeatherSuggestion = (condition, temp) => {
  if (condition.includes('clear')) {
    if (temp > 25) {
      return "Perfect weather for outdoor activities! Don't forget your sunscreen.";
    } else if (temp > 15) {
      return "Great day to be outside! Enjoy the pleasant weather.";
    } else {
      return "Sunny but chilly. Dress in layers for comfort.";
    }
  } else if (condition.includes('cloud')) {
    return "Cloudy skies. Good day for both indoor and outdoor activities.";
  } else if (condition.includes('rain') || condition.includes('drizzle')) {
    return "Rainy day ahead. Perfect for indoor activities or a cozy day in.";
  } else if (condition.includes('thunder')) {
    return "Thunderstorms expected. Best to stay indoors today.";
  } else if (condition.includes('snow')) {
    return "Snowy conditions. Great for winter sports if you're prepared!";
  }
  return "Check the forecast for activity suggestions.";
};

export default WeatherDisplay;
