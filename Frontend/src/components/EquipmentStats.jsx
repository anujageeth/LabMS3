import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  LinearProgress,
  Chip,
  Button,
  IconButton
} from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const EquipmentStats = ({ stats }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 2;

  if (!stats) return null;

  const { categoryStats, nameStats, overall } = stats;

  // Calculate total pages
  const totalPages = nameStats ? Math.ceil(nameStats.length / itemsPerPage) : 0;
  
  // Get current items
  const currentItems = nameStats 
    ? nameStats.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage) 
    : [];

  // Navigation handlers
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  return (
    <Box sx={{ mt: 2 }}>
      {/* Overall Stats */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Overall Statistics</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Typography variant="subtitle2">Total Equipment</Typography>
              <Typography variant="h4">{overall?.totalEquipment || 0}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="subtitle2">Available</Typography>
              <Typography variant="h4" color="success.main">
                {overall?.totalAvailable || 0}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="subtitle2">Damaged</Typography>
              <Typography variant="h4" color="error.main">
                {overall?.totalDamaged || 0}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="subtitle2">In Use</Typography>
              <Typography variant="h4" color="info.main">
                {overall?.totalInUse || 0}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Name-wise Stats */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Equipment by Name</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                onClick={handlePrevPage} 
                disabled={currentPage === 0}
                size="small"
              >
                <KeyboardArrowLeftIcon />
              </IconButton>
              <Typography variant="body2" sx={{ mx: 1 }}>
                Page {currentPage + 1} of {totalPages}
              </Typography>
              <IconButton 
                onClick={handleNextPage} 
                disabled={currentPage >= totalPages - 1}
                size="small"
              >
                <KeyboardArrowRightIcon />
              </IconButton>
            </Box>
          </Box>
          
          <Grid container spacing={2}>
            {currentItems.map((item) => (
              <Grid item xs={12} md={6} key={item.name}>
                <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                  <Typography variant="subtitle1">{item.name}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    {item.categories.map((cat) => (
                      <Chip key={cat} label={cat} size="small" />
                    ))}
                  </Box>
                  <Typography variant="body2">
                    Total: {item.total} | Available: {item.available} | Damaged: {item.damaged}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={item.availabilityRate} 
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
          
          {/* Show a message if no items */}
          {currentItems.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="body1" color="text.secondary">
                No equipment data available
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default EquipmentStats;