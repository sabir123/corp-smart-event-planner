import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { 
  getWeatherByLocation, 
  getActivitySuggestionsConsideringRain, 
  getWeatherByCoords,
  getForecastByCoords,
  getForecastByLocation,
  getRainProbabilityForDate
} from './services/weatherService';
import EventForm from './components/EventForm';
import WeatherDisplay from './components/WeatherDisplay';
import ActivitySuggestions from './components/ActivitySuggestions';
import EventList from './components/EventList';

function App() {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [rainProb, setRainProb] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load events from localStorage
    try {
      const saved = localStorage.getItem('corp-events');
      if (saved) setEvents(JSON.parse(saved));
    } catch (e) {
      console.warn('Failed to load events from localStorage', e);
    }
    // Try to get user's location for weather
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const weatherData = await getWeatherByCoords(latitude, longitude);
            setWeather(weatherData);
            const forecastData = await getForecastByCoords(latitude, longitude);
            setForecast(forecastData);
            const rp = getRainProbabilityForDate(forecastData, selectedDate);
            setRainProb(rp);
            setSuggestions(getActivitySuggestionsConsideringRain(weatherData, rp));
          } catch (err) {
            console.error('Error getting weather by coordinates:', err);
            setError('Unable to fetch weather for your location. Please search for a city manually or check your API key.');
          }
        },
        (err) => {
          console.warn('Geolocation error:', err);
          // Default to a major city if geolocation is denied
          fetchWeatherForLocation('London');
          setError('Location access denied. Showing London by default. You can search for your city above.');
        }
      );
    } else {
      // Fallback if geolocation is not supported
      fetchWeatherForLocation('London');
      setError('Geolocation not supported. Showing London by default. You can search for your city above.');
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('corp-events', JSON.stringify(events));
    } catch (e) {
      console.warn('Failed to save events to localStorage', e);
    }
  }, [events]);

  const fetchWeatherForLocation = async (loc) => {
    if (!loc) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const weatherData = await getWeatherByLocation(loc);
      setWeather(weatherData);
      setLocation(weatherData.name);
      // Forecast by location
      const forecastData = await getForecastByLocation(loc);
      setForecast(forecastData);
      const rp = getRainProbabilityForDate(forecastData, selectedDate);
      setRainProb(rp);
      setSuggestions(getActivitySuggestionsConsideringRain(weatherData, rp));
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('Could not fetch weather data. Please try another location.');
    } finally {
      setLoading(false);
    }
  };

  // Recompute suggestions when selectedDate, forecast, or weather changes
  useEffect(() => {
    if (weather && forecast && selectedDate) {
      const rp = getRainProbabilityForDate(forecast, selectedDate);
      setRainProb(rp);
      setSuggestions(getActivitySuggestionsConsideringRain(weather, rp));
    }
  }, [selectedDate, forecast, weather]);

  const handleAddEvent = (event) => {
    setEvents([...events, { ...event, id: Date.now() }]);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Corporate Event Planner (Weather-Aware)
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Plan team-building, townhalls, demo stalls, and workshops based on weather conditions
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { md: '1fr 1fr' } }}>
        <Box>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <EventForm 
              location={location}
              onLocationChange={setLocation}
              onSearchLocation={fetchWeatherForLocation}
              onAddEvent={handleAddEvent}
              selectedDate={selectedDate}
              onEventDateChange={setSelectedDate}
              weather={weather}
              loading={loading}
            />
            
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </Paper>

          {suggestions && (
            <ActivitySuggestions suggestions={suggestions} />
          )}
        </Box>

        <Box>
          {weather && (
            <WeatherDisplay 
              weather={weather} 
              location={location} 
              loading={loading} 
            />
          )}
          
          <EventList 
            events={events} 
            onDeleteEvent={handleDeleteEvent} 
            rainProb={rainProb}
            selectedDate={selectedDate}
            sx={{ mt: 4 }} 
          />
        </Box>
      </Box>
    </Container>
  );
}

export default App;
