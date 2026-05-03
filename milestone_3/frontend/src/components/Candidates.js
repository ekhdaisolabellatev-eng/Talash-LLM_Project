import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress
} from '@mui/material';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport
} from '@mui/x-data-grid';
import {
  Upload as UploadIcon,
  Email as EmailIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get('/api/candidates');
      setCandidates(response.data.candidates);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadDialog(false);
      setSelectedFile(null);
      fetchCandidates(); // Refresh the list
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETE': return 'success';
      case 'REVIEW': return 'warning';
      default: return 'default';
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    { field: 'experience_count', headerName: 'Experience', width: 100, align: 'center' },
    { field: 'skills_count', headerName: 'Skills', width: 80, align: 'center' },
    {
      field: 'score',
      headerName: 'Score',
      width: 100,
      align: 'center',
      renderCell: (params) => (
        <Chip
          label={params.row.score_display}
          color={params.value >= 80 ? 'success' : params.value >= 60 ? 'warning' : 'error'}
          size="small"
        />
      ),
    },
    {
      field: 'ranking_score',
      headerName: 'Ranking',
      width: 100,
      align: 'center',
      renderCell: (params) => (
        <Chip
          label={params.row.ranking_display}
          color={params.value >= 80 ? 'success' : params.value >= 60 ? 'warning' : 'error'}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Button
            size="small"
            onClick={() => navigate(`/candidates/${params.row.id}`)}
            sx={{ mr: 1 }}
          >
            <AssessmentIcon fontSize="small" />
          </Button>
          <Button
            size="small"
            color="secondary"
            onClick={() => handleSendEmail(params.row.id)}
          >
            <EmailIcon fontSize="small" />
          </Button>
        </Box>
      ),
    },
  ];

  const handleSendEmail = async (candidateId) => {
    // This would open an email dialog - simplified for now
    console.log('Send email to candidate:', candidateId);
  };

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <Button
          startIcon={<UploadIcon />}
          onClick={() => setUploadDialog(true)}
          sx={{ mr: 2 }}
        >
          Upload CV
        </Button>
        <GridToolbarFilterButton />
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Candidates
      </Typography>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={candidates}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          loading={loading}
          components={{
            Toolbar: CustomToolbar,
          }}
          sortModel={[{ field: 'ranking_score', sort: 'desc' }]}
          onRowClick={(params) => navigate(`/candidates/${params.row.id}`)}
        />
      </Paper>

      {/* Upload Dialog */}
      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)}>
        <DialogTitle>Upload CV</DialogTitle>
        <DialogContent>
          <TextField
            type="file"
            inputProps={{ accept: '.pdf' }}
            onChange={(e) => setSelectedFile(e.target.files[0])}
            fullWidth
            sx={{ mt: 2 }}
          />
          {uploading && <LinearProgress sx={{ mt: 2 }} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
          <Button
            onClick={handleFileUpload}
            disabled={!selectedFile || uploading}
            variant="contained"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Candidates;