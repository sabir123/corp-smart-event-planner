import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const activityTypes = [
  'Team Building',
  'Townhall / All-Hands',
  'Product Demo Stalls',
  'Workshop / Training',
  'Hackathon / Innovation Day',
  'Vendor Fair',
  'Leadership AMA / Fireside',
  'Wellness Session',
  'Department Offsite',
  'Quarterly Business Review (QBR)',
  'Other'
];

const EventForm = ({ 
  location, 
  onLocationChange, 
  onSearchLocation, 
  onAddEvent, 
  selectedDate,
  onEventDateChange,
  weather,
  loading 
}) => {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: selectedDate || new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().substring(0, 5),
    type: '',
    location: '',
    attendees: '',
    budget: '',
    venueType: 'Indoor',
    equipment: [],
    catering: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEquipmentToggle = (name) => (e) => {
    const checked = e.target.checked;
    setEventData(prev => {
      const current = new Set(prev.equipment);
      if (checked) current.add(name); else current.delete(name);
      return { ...prev, equipment: Array.from(current) };
    });
  };

  const handleCateringToggle = (event, value) => {
    if (value !== null) {
      setEventData(prev => ({ ...prev, catering: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventWithWeather = {
      ...eventData,
      id: Date.now(),
      weather: weather ? {
        temp: weather.main.temp,
        condition: weather.weather[0].main,
        icon: weather.weather[0].icon
      } : null
    };
    onAddEvent(eventWithWeather);
    
    // Reset form but keep location
    setEventData({
      title: '',
      description: '',
      date: selectedDate || new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().substring(0, 5),
      type: '',
      location: eventData.location, // Keep the location
      attendees: '',
      budget: '',
      venueType: 'Indoor',
      equipment: [],
      catering: false,
    });
  };

  const handleSearchLocation = (e) => {
    e.preventDefault();
    if (location.trim()) {
      onSearchLocation(location);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            label="Search Location"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchLocation(e)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Button 
                      type="button"
                      onClick={handleSearchLocation}
                      disabled={!location.trim()}
                    >
                      <SearchIcon />
                    </Button>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            name="title"
            label="Event Title (e.g., Team Building, Townhall, Demo Stalls)"
            value={eventData.title}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            name="date"
            label="Date"
            value={eventData.date}
            onChange={(e) => {
              handleInputChange(e);
              if (onEventDateChange) onEventDateChange(e.target.value);
            }}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EventIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="time"
            name="time"
            label="Time"
            value={eventData.time}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            name="type"
            label="Activity Type"
            value={eventData.type}
            onChange={handleInputChange}
            variant="outlined"
          >
            {activityTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="location"
            label="Event Location"
            value={eventData.location}
            onChange={handleInputChange}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            name="attendees"
            label="Expected Attendees"
            value={eventData.attendees}
            onChange={handleInputChange}
            variant="outlined"
            inputProps={{ min: 0 }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            name="budget"
            label="Budget"
            value={eventData.budget}
            onChange={handleInputChange}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
              inputProps: { min: 0, step: 100 }
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl component="fieldset" variant="standard" sx={{ width: '100%' }}>
            <FormLabel component="legend">Venue Type</FormLabel>
            <ToggleButtonGroup
              value={eventData.venueType}
              exclusive
              onChange={(e, value) => value && setEventData(prev => ({ ...prev, venueType: value }))}
              sx={{ mt: 1 }}
            >
              <ToggleButton value="Indoor">Indoor</ToggleButton>
              <ToggleButton value="Outdoor">Outdoor</ToggleButton>
            </ToggleButtonGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl component="fieldset" variant="standard" sx={{ width: '100%' }}>
            <FormLabel component="legend">Equipment Needed</FormLabel>
            <FormGroup row sx={{ mt: 1 }}>
              {['Projector','Microphone','Speakers','Stage','Demo Booth Tables','Power Strips','Wi‑Fi Booster'].map((eq) => (
                <FormControlLabel
                  key={eq}
                  control={<Checkbox checked={eventData.equipment.includes(eq)} onChange={handleEquipmentToggle(eq)} />}
                  label={eq}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl component="fieldset" variant="standard" sx={{ width: '100%' }}>
            <FormLabel component="legend">Catering</FormLabel>
            <ToggleButtonGroup
              value={eventData.catering}
              exclusive
              onChange={handleCateringToggle}
              sx={{ mt: 1 }}
            >
              <ToggleButton value={true}>Required</ToggleButton>
              <ToggleButton value={false}>Not Required</ToggleButton>
            </ToggleButtonGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            name="description"
            label="Description"
            value={eventData.description}
            onChange={handleInputChange}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DescriptionIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={!eventData.title || !eventData.type || !weather}
          >
            Add Event
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EventForm;
