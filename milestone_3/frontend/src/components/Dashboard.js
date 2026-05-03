import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Button,
  Chip
} from '@mui/material';
import {
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import { LineChart, BarChart } from '@mui/x-charts';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState({});
  const [reportsData, setReportsData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, reportsRes] = await Promise.all([
        axios.get('/api/dashboard-stats'),
        axios.get('/api/reports-data')
      ]);
      setStats(statsRes.data);
      setReportsData(reportsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIngestFolder = async () => {
    try {
      await axios.post('/api/ingest-folder');
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error ingesting folder:', error);
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PeopleIcon color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Candidates
                  </Typography>
                  <Typography variant="h4">
                    {stats.total_candidates || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AssessmentIcon color="secondary" sx={{ mr: 1 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Analysis Complete
                  </Typography>
                  <Typography variant="h4">
                    {stats.analysis_complete || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Avg Ranking Score
                  </Typography>
                  <Typography variant="h4">
                    {stats.average_ranking_score || '0.0'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <UploadIcon color="warning" sx={{ mr: 1 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Completion Rate
                  </Typography>
                  <Typography variant="h4">
                    {stats.completion_rate || '0%'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Score Distribution
            </Typography>
            <BarChart
              xAxis={[{ scaleType: 'band', data: reportsData.score_distribution?.labels || [] }]}
              series={[{ data: reportsData.score_distribution?.values || [] }]}
              height={300}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Ranking Score Distribution
            </Typography>
            <BarChart
              xAxis={[{ scaleType: 'band', data: reportsData.ranking_distribution?.labels || [] }]}
              series={[{ data: reportsData.ranking_distribution?.values || [] }]}
              height={300}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top Skills
            </Typography>
            <Box sx={{ mt: 2 }}>
              {reportsData.top_skills?.labels?.map((skill, index) => (
                <Box key={skill} sx={{ mb: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2">{skill}</Typography>
                    <Chip
                      label={reportsData.top_skills.values[index]}
                      size="small"
                      color="primary"
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(reportsData.top_skills.values[index] / Math.max(...reportsData.top_skills.values)) * 100}
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Pipeline Status
            </Typography>
            <LineChart
              xAxis={[{ scaleType: 'point', data: reportsData.pipeline_status?.labels || [] }]}
              series={[
                { data: reportsData.pipeline_status?.completed || [], label: 'Completed' },
                { data: reportsData.pipeline_status?.processing || [], label: 'Processing' }
              ]}
              height={300}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          onClick={handleIngestFolder}
          size="large"
        >
          Process CV Folder
        </Button>
      </Box>
    </Box>
  );
}

export default Dashboard;