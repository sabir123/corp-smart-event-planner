import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Alert from '@mui/material/Alert';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import HikingIcon from '@mui/icons-material/Hiking';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MovieIcon from '@mui/icons-material/Movie';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import PoolIcon from '@mui/icons-material/Pool';

const activityIcons = {
  'Swimming': <PoolIcon color="primary" />,
  'Beach day': <BeachAccessIcon color="primary" />,
  'Hiking': <HikingIcon color="primary" />,
  'Museum visit': <LocalLibraryIcon color="primary" />,
  'Cooking class': <RestaurantIcon color="primary" />,
  'Movie night': <MovieIcon color="primary" />,
  'Bowling': <SportsSoccerIcon color="primary" />,
  'Skiing': <AcUnitIcon color="primary" />,
  'default': <FitnessCenterIcon color="primary" />
};

const getActivityIcon = (activity) => {
  for (const [key, icon] of Object.entries(activityIcons)) {
    if (activity.includes(key)) {
      return icon;
    }
  }
  return activityIcons.default;
};

const ActivitySuggestions = ({ suggestions }) => {
  if (!suggestions) return null;

  const { outdoor, indoor, rainSuppressed, rainProb } = suggestions;
  const rainPercent = typeof rainProb === 'number' ? Math.round(rainProb * 100) : null;

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Activity Suggestions
      </Typography>
      {rainSuppressed && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Outdoor activities are hidden due to expected rain risk of {rainPercent ?? 30}% or higher on the selected date.
        </Alert>
      )}
      
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { md: '1fr 1fr' } }}>
        <Box>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            <Box display="flex" alignItems="center">
              <HikingIcon sx={{ mr: 1 }} />
              Outdoor Activities
            </Box>
          </Typography>
          {rainSuppressed ? (
            <Typography variant="body2" color="text.secondary">
              Outdoor suggestions are suppressed due to rain probability {rainPercent !== null ? `${rainPercent}%` : '≥ 30%' }.
            </Typography>
          ) : (
            <List dense>
              {outdoor.map((activity, index) => (
                <ListItem key={`outdoor-${index}`}>
                  <ListItemIcon>
                    {getActivityIcon(activity)}
                  </ListItemIcon>
                  <ListItemText primary={activity} />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
        
        <Box>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            <Box display="flex" alignItems="center">
              <LocalCafeIcon sx={{ mr: 1 }} />
              Indoor Activities
            </Box>
          </Typography>
          <List dense>
            {indoor.map((activity, index) => (
              <ListItem key={`indoor-${index}`}>
                <ListItemIcon>
                  {getActivityIcon(activity)}
                </ListItemIcon>
                <ListItemText primary={activity} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Paper>
  );
};

export default ActivitySuggestions;
