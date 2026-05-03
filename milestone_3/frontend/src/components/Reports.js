import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Download as DownloadIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

function Reports() {
  const [tabularData, setTabularData] = useState([]);
  const [emailTracking, setEmailTracking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailDialog, setEmailDialog] = useState(false);

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      const [tabularRes, emailRes] = await Promise.all([
        axios.get('/api/tabular-output'),
        axios.get('/api/email-tracking')
      ]);
      setTabularData(tabularRes.data.rows);
      setEmailTracking(emailRes.data.tracking_data);
    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data, filename) => {
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const tabularColumns = [
    { field: 'candidate_id', headerName: 'ID', width: 70 },
    { field: 'candidate_name', headerName: 'Name', width: 200 },
    { field: 'highest_qualification', headerName: 'Qualification', width: 150 },
    { field: 'experience_roles', headerName: 'Experience', width: 100, align: 'center' },
    { field: 'skill_alignment_ratio', headerName: 'Skill Alignment', width: 120, align: 'center' },
    { field: 'ranking_score', headerName: 'Ranking Score', width: 120, align: 'center' },
    { field: 'missing_fields', headerName: 'Missing Fields', width: 120, align: 'center' },
  ];

  const emailColumns = [
    { field: 'candidate_name', headerName: 'Candidate', width: 150 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'subject', headerName: 'Subject', width: 200 },
    { field: 'sent_at', headerName: 'Sent At', width: 150 },
    {
      field: 'opened',
      headerName: 'Opened',
      width: 100,
      align: 'center',
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Yes' : 'No'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    { field: 'opened_at', headerName: 'Opened At', width: 150 },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reports & Analytics
      </Typography>

      <Grid container spacing={3}>
        {/* Tabular Output */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Candidate Analysis Report
              </Typography>
              <Button
                startIcon={<DownloadIcon />}
                onClick={() => exportToCSV(tabularData, 'candidate_analysis_report.csv')}
                variant="outlined"
              >
                Export CSV
              </Button>
            </Box>
            <Box sx={{ height: 400 }}>
              <DataGrid
                rows={tabularData}
                columns={tabularColumns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                loading={loading}
                sortModel={[{ field: 'ranking_score', sort: 'desc' }]}
                getRowId={(row) => row.candidate_id}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Email Tracking */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Email Tracking Report
              </Typography>
              <Button
                startIcon={<EmailIcon />}
                onClick={() => setEmailDialog(true)}
                variant="outlined"
              >
                View Details
              </Button>
            </Box>
            <Box sx={{ height: 300 }}>
              <DataGrid
                rows={emailTracking}
                columns={emailColumns}
                pageSize={5}
                rowsPerPageOptions={[5, 10]}
                loading={loading}
                getRowId={(row) => row.tracking_id}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Summary Stats */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Report Summary
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell>Total Candidates</TableCell>
                    <TableCell align="right">{tabularData.length}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Average Ranking Score</TableCell>
                    <TableCell align="right">
                      {tabularData.length > 0
                        ? (tabularData.reduce((sum, row) => sum + (row.ranking_score || 0), 0) / tabularData.length).toFixed(1)
                        : '0.0'
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Emails Sent</TableCell>
                    <TableCell align="right">{emailTracking.length}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Emails Opened</TableCell>
                    <TableCell align="right">
                      {emailTracking.filter(email => email.opened).length}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Open Rate</TableCell>
                    <TableCell align="right">
                      {emailTracking.length > 0
                        ? ((emailTracking.filter(email => email.opened).length / emailTracking.length) * 100).toFixed(1) + '%'
                        : '0%'
                      }
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Top Performers */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top 5 Candidates by Ranking Score
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Rank</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Score</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tabularData
                    .sort((a, b) => (b.ranking_score || 0) - (a.ranking_score || 0))
                    .slice(0, 5)
                    .map((candidate, index) => (
                      <TableRow key={candidate.candidate_id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{candidate.candidate_name}</TableCell>
                        <TableCell align="right">{candidate.ranking_score || 0}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Email Details Dialog */}
      <Dialog open={emailDialog} onClose={() => setEmailDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Email Tracking Details</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Candidate</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Sent At</TableCell>
                  <TableCell>Opened</TableCell>
                  <TableCell>Opened At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {emailTracking.map((email) => (
                  <TableRow key={email.tracking_id}>
                    <TableCell>{email.candidate_name}</TableCell>
                    <TableCell>{email.email}</TableCell>
                    <TableCell>{email.subject}</TableCell>
                    <TableCell>{new Date(email.sent_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={email.opened ? 'Yes' : 'No'}
                        color={email.opened ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {email.opened_at ? new Date(email.opened_at).toLocaleString() : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmailDialog(false)}>Close</Button>
          <Button
            onClick={() => exportToCSV(emailTracking, 'email_tracking_report.csv')}
            startIcon={<DownloadIcon />}
            variant="contained"
          >
            Export CSV
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Reports;