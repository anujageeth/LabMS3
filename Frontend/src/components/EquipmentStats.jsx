import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  LinearProgress,
  Chip
} from '@mui/material';

const EquipmentStats = ({ stats }) => {
  if (!stats) return null;

  const { categoryStats, nameStats, overall } = stats;

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
          <Typography variant="h6" gutterBottom>Equipment by Name</Typography>
          <Grid container spacing={2}>
            {nameStats?.map((item) => (
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
        </CardContent>
      </Card>
    </Box>
  );
};

export default EquipmentStats;