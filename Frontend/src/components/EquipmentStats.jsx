import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  LinearProgress,
  Chip,
  IconButton
} from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import "./equipmentStats.css"

const EquipmentStats = ({ stats, searchTerm }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 2;

  if (!stats) return null;

  const { categoryStats, nameStats, overall } = stats;

  // Filter items based on the search term
  const filteredItems = nameStats.filter(item => 
    item.name.toLowerCase().includes((searchTerm || "").toLowerCase())
  );

  // Calculate total pages based on filtered items
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  
  // Get current items after filtering
  const currentItems = filteredItems.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

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
          <Typography className='statisticsSubTopic' variant="h6" gutterBottom>Overall Statistics</Typography>
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
          {/* Title and Pagination in one line */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 2 
          }}>
            <Typography className='statisticsSubTopic'>Equipment by Name</Typography>
            
            {/* Pagination */}
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
          
          {/* Rest of your content... */}
          <Grid container spacing={2}>
            {currentItems.map((item) => (
              <Grid item xs={12} md={6} key={item.name}>
                <Box className="stats-card">
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
                    sx={{ 
                      mt: 1,
                      backgroundColor: '#ff2424', // Background color of the bar
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#00cc07', // Color of the progress bar
                      }
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
          
          {/* No Data Message */}
          {currentItems.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="body1" color="text.secondary">
                No equipment found matching your search
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default EquipmentStats;