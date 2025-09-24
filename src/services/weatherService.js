import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeatherByLocation = async (location) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: location,
        appid: API_KEY,
        units: 'metric',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const getWeatherByCoords = async (lat, lon) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// 5 day / 3-hour forecast
export const getForecastByCoords = async (lat, lon) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    throw error;
  }
};

export const getForecastByLocation = async (location) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: location,
        appid: API_KEY,
        units: 'metric',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    throw error;
  }
};

// Compute rain probability (pop) for a given YYYY-MM-DD using max pop across the day
export const getRainProbabilityForDate = (forecast, dateStr) => {
  if (!forecast || !forecast.list) return null;
  const target = new Date(dateStr);
  const yyyy = target.getFullYear();
  const mm = String(target.getMonth() + 1).padStart(2, '0');
  const dd = String(target.getDate()).padStart(2, '0');
  const dayPrefix = `${yyyy}-${mm}-${dd}`;

  const entries = forecast.list.filter(item => item.dt_txt.startsWith(dayPrefix));
  if (entries.length === 0) return null;
  const maxPop = entries.reduce((max, item) => Math.max(max, item.pop ?? 0), 0);
  return maxPop; // 0..1
};

export const getActivitySuggestions = (weather) => {
  const { main, weather: weatherInfo } = weather;
  const temp = main.temp;
  const condition = weatherInfo[0].main.toLowerCase();

  const suggestions = {
    outdoor: [],
    indoor: []
  };

  // Outdoor corporate activities based on temperature
  if (temp > 25) {
    suggestions.outdoor.push(
      'Team Building Field Games (outdoor)',
      'Company Sports Day',
      'Outdoor Networking Mixer',
      'CSR Tree Plantation Drive',
      'Product Demo Booths (open-air)'
    );
  } else if (temp > 15) {
    suggestions.outdoor.push(
      'Team Building Scavenger Hunt',
      'Corporate Wellness Walk/5K',
      'Leadership Offsite (outdoor breakouts)',
      'Outdoor Townhall Setup',
      'Customer/Partner Meet & Greet (terrace garden)'
    );
  } else if (temp > 5) {
    suggestions.outdoor.push(
      'Campus Tour for New Joinees',
      'Brand Activation Kiosk (covered)',
      'Outdoor Photo Booth for Employer Branding',
      'Coffee Truck + Networking Corner',
      'Vendor Demo Stalls (weather-shielded)'
    );
  } else {
    suggestions.outdoor.push(
      'Short Outdoor Ribbon-cutting (with heaters)',
      'Winter CSR Drive (coat/blanket distribution)',
      'Team Photo Session (quick outdoor)'
    );
  }

  // Adjust for weather conditions
  if (condition.includes('rain') || condition.includes('drizzle')) {
    suggestions.outdoor = suggestions.outdoor.filter(activity => 
      !['Open-air', 'Outdoor', 'Terrace', 'Field'].some(noGo => activity.toLowerCase().includes(noGo.toLowerCase()))
    );
    suggestions.outdoor.push('Covered Walkway Demo Stalls', 'Indoor Product Showcase (move booths inside)');
  }

  // Indoor corporate activities (weather-agnostic but prioritize when cold/rainy)
  const indoorCore = [
    'All-Hands Townhall Meeting',
    'Quarterly Business Review (QBR)',
    'Product Demo Stalls (indoor expo)',
    'Innovation Day Hackathon',
    'Technical Workshop/Training',
    'Design Thinking Workshop',
    'Leadership AMA / Fireside Chat',
    'Department Offsite (indoor breakouts)',
    'Vendor Fair (booths)',
    'Wellness Session (yoga/stretching)',
    'Team Building Escape Room (onsite)',
    'Customer Showcase / Roadshow',
    'Security & Compliance Awareness Session',
    'New Hire Orientation Fair'
  ];

  if (temp < 15 || condition.includes('rain') || condition.includes('snow')) {
    suggestions.indoor.push(...indoorCore);
  } else {
    suggestions.indoor.push(
      'Townhall + Networking',
      'Product Demo Stalls (indoor)',
      'Skill-building Workshops',
      'Internal Tech Talks Series',
      'Cross-team Show-and-Tell'
    );
  }

  return suggestions;
};

// Wrapper to apply rain probability threshold
export const getActivitySuggestionsConsideringRain = (weather, rainProb) => {
  const base = getActivitySuggestions(weather);
  if (rainProb !== null && rainProb >= 0.3) {
    return {
      ...base,
      outdoor: [],
      rainSuppressed: true,
      rainProb,
    };
  }
  return { ...base, rainSuppressed: false, rainProb };
};
