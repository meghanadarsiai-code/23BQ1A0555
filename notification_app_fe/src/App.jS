import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Tabs, Tab, Card, CardContent, 
  Chip, Select, MenuItem, FormControl, InputLabel, Pagination 
} from '@mui/material';
import axios from 'axios';

const API_URL = "http://4.224.186.213/evaluation-service/notifications";
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyM2JxMWEwNTU1QHZ2aXQubmV0IiwiZXhwIjoxNzgwNjM5MjY5LCJpYXQiOjE3ODA2MzgzNjksImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI0MDdjZDA2OC1iOGZlLTRlOTgtYjg0Zi00ZTllOTc2ZGFmNjAiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJkYXJzaSBtZWdoYW5hIHNyaSIsInN1YiI6ImE0MTZiNzY1LWNjYWItNDkzOS05ZmE3LTZlYTlhYTAzYjQ5YiJ9LCJlbWFpbCI6IjIzYnExYTA1NTVAdnZpdC5uZXQiLCJuYW1lIjoiZGFyc2kgbWVnaGFuYSBzcmkiLCJyb2xsTm8iOiIyM2JxMWEwNTU1IiwiYWNjZXNzQ29kZSI6IlFRZEVZeSIsImNsaWVudElEIjoiYTQxNmI3NjUtY2NhYi00OTM5LTlmYTctNmVhOWFhMDNiNDliIiwiY2xpZW50U2VjcmV0IjoiWUNVWFZia2VyWGFoUVFVViJ9._2XLAw4XJ0kthZ057hyRI6MJTz7tRl9UoMJegYkmNjo";

function App() {
  const [tabIndex, setTabIndex] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  
  const [filterType, setFilterType] = useState('All');
  const [page, setPage] = useState(1);
  const limit = 10;

  const [viewedIds, setViewedIds] = useState(() => {
    const saved = localStorage.getItem('viewedNotifications');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const fetchParams = { limit, page };
    if (filterType !== 'All') fetchParams.notification_type = filterType;

    axios.get(API_URL, { 
      params: fetchParams,
      headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
    })
      .then(res => {
        const fetchedData = res.data.notifications || res.data || [];
        setNotifications(fetchedData);
        
        const weights = { "Placement": 3, "Result": 2, "Event": 1 };
        const sorted = [...fetchedData].sort((a, b) => {
          const wA = weights[a.Type] || 0;
          const wB = weights[b.Type] || 0;
          if (wA !== wB) return wB - wA;
          return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
        });
        setPriorityData(sorted.slice(0, 10));
      })
      .catch(err => console.error("API Error: ", err));
  }, [filterType, page]);

  const markAsViewed = (id) => {
    if (!viewedIds.includes(id)) {
      const updated = [...viewedIds, id];
      setViewedIds(updated);
      localStorage.setItem('viewedNotifications', JSON.stringify(updated));
    }
  };

  const getColor = (type) => {
    switch(type) {
      case 'Placement': return 'success';
      case 'Result': return 'info';
      case 'Event': return 'warning';
      default: return 'default';
    }
  };

  const NotificationList = ({ data }) => (
    <Box sx={{ mt: 2 }}>
      {data.map(notif => (
        <Card 
          key={notif.ID} 
          onClick={() => markAsViewed(notif.ID)}
          sx={{ 
            mb: 2, 
            cursor: 'pointer',
            backgroundColor: viewedIds.includes(notif.ID) ? '#f5f5f5' : '#ffffff',
            borderLeft: viewedIds.includes(notif.ID) ? '4px solid transparent' : '4px solid #1976d2'
          }}
        >
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">{notif.Message}</Typography>
              <Chip label={notif.Type} color={getColor(notif.Type)} size="small" />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {new Date(notif.Timestamp).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Campus Portal
      </Typography>

      <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)} centered>
        <Tab label="All Notifications" />
        <Tab label="Priority Inbox" />
      </Tabs>

      {tabIndex === 0 && (
        <Box sx={{ mt: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Filter by Type</InputLabel>
              <Select 
                value={filterType} 
                label="Filter by Type"
                onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
              >
                <MenuItem value="All">All Types</MenuItem>
                <MenuItem value="Placement">Placement</MenuItem>
                <MenuItem value="Result">Result</MenuItem>
                <MenuItem value="Event">Event</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <NotificationList data={notifications} />
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination count={5} page={page} onChange={(e, val) => setPage(val)} color="primary" />
          </Box>
        </Box>
      )}

      {tabIndex === 1 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Top 10 Important Updates
          </Typography>
          <NotificationList data={priorityData} />
        </Box>
      )}
    </Container>
  );
}

export default App;