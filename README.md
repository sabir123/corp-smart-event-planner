# corp-smart-event-planner

A corporate, weather-aware event planner that helps organize team-building, townhalls, workshops, and demo stalls with indoor/outdoor recommendations based on forecast and rain probability.

## Features

- **Weather Integration**: Fetches real-time weather data for your location
- **Smart Suggestions**: Recommends activities based on current weather conditions
- **Event Management**: Plan and manage your events with details like date, time, and location
- **Responsive Design**: Works on both desktop and mobile devices
- **Modern UI**: Clean and intuitive user interface built with Material-UI

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenWeatherMap API key (free tier available)

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   - Create a `.env` file in the root directory
   - Add your OpenWeatherMap API key:
     ```
     VITE_OPENWEATHER_API_KEY=your_api_key_here
     ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open the app**
   Open your browser at [http://localhost:5173](http://localhost:5173)

## Available Scripts

- `npm run dev`: Runs the Vite dev server
- `npm run build`: Builds the app for production
- `npm run preview`: Preview the production build locally

## Technologies Used

- React
- Material-UI
- Axios for API requests
- date-fns for date manipulation
- OpenWeatherMap API for weather data

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons by [Material-UI](https://mui.com/material-ui/material-icons/)
# corp-smart-event-planner
