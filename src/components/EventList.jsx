import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton, 
  Typography, 
  Paper, 
  Box, 
  Divider,
  Chip,
  Stack,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import UmbrellaIcon from '@mui/icons-material/Umbrella';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { format, parseISO } from 'date-fns';

const EventList = ({ events, onDeleteEvent, rainProb, selectedDate }) => {
  if (events.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="textSecondary">
          No events planned yet. Add your first event above!
        </Typography>
      </Paper>
    );
  }

  const getWeatherIcon = (weatherCondition) => {
    if (!weatherCondition) return null;
    
    const condition = weatherCondition.toLowerCase();
    if (condition.includes('clear')) {
      return <WbSunnyIcon color="warning" sx={{ mr: 1 }} />;
    } else if (condition.includes('cloud')) {
      return <CloudIcon color="action" sx={{ mr: 1 }} />;
    } else if (condition.includes('rain') || condition.includes('drizzle')) {
      return <UmbrellaIcon color="primary" sx={{ mr: 1 }} />;
    } else if (condition.includes('snow')) {
      return <AcUnitIcon color="info" sx={{ mr: 1 }} />;
    }
    return null;
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Your Planned Events
      </Typography>
      <List>
        {events.map((event, index) => (
          <React.Fragment key={event.id}>
            <ListItem>
              <Box sx={{ width: '100%' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    {event.title}
                  </Typography>
                  <Box>
                    {event.weather && (
                      <Chip
                        size="small"
                        icon={getWeatherIcon(event.weather.condition)}
                        label={`${event.weather.temp}°C`}
                        variant="outlined"
                        sx={{ mr: 1 }}
                      />
                    )}
                    <Chip
                      label={event.type}
                      color="primary"
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>
                
                <Box display="flex" alignItems="center" mt={0.5} mb={1}>
                  <EventIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="textSecondary">
                    {format(parseISO(event.date), 'EEEE, MMM d, yyyy')} at {event.time}
                  </Typography>
                </Box>
                
                {event.location && (
                  <Box display="flex" alignItems="center" mb={1}>
                    <LocationOnIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="textSecondary">
                      {event.location}
                    </Typography>
                  </Box>
                )}
                
                {event.description && (
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {event.description}
                  </Typography>
                )}
                
                <Box display="flex" justifyContent="flex-end">
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => onDeleteEvent(event.id)}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </ListItem>
            {index < events.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default EventList;
