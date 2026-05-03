import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Email as EmailIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function CandidateDetail() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [skillAlignment, setSkillAlignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailDialog, setEmailDialog] = useState(false);
  const [emailData, setEmailData] = useState({ subject: '', body: '' });
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    fetchCandidateData();
  }, [id]);

  const fetchCandidateData = async () => {
    try {
      const [candidateRes, analysisRes, skillRes] = await Promise.all([
        axios.get(`/api/candidate/${id}`),
        axios.get(`/api/analysis-output/${id}`),
        axios.get(`/api/skill-alignment/${id}`)
      ]);
      setCandidate(candidateRes.data);
      setAnalysis(analysisRes.data);
      setSkillAlignment(skillRes.data);
    } catch (error) {
      console.error('Error fetching candidate data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    setSendingEmail(true);
    try {
      await axios.post(`/api/send-missing-info-email/${id}`, emailData);
      setEmailDialog(false);
      setEmailData({ subject: '', body: '' });
      alert('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email');
    } finally {
      setSendingEmail(false);
    }
  };

  const loadDraftEmail = async () => {
    try {
      const response = await axios.get(`/api/missing-info-email/${id}`);
      setEmailData({
        subject: `TALASH: Additional Information Required - ${candidate?.name}`,
        body: response.data.draft_email
      });
      setEmailDialog(true);
    } catch (error) {
      console.error('Error loading draft email:', error);
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  if (!candidate) {
    return <Typography>Candidate not found</Typography>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          {candidate.name}
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AssessmentIcon />}
            onClick={() => fetchCandidateData()}
            sx={{ mr: 1 }}
          >
            Refresh Analysis
          </Button>
          <Button
            variant="outlined"
            startIcon={<EmailIcon />}
            onClick={loadDraftEmail}
          >
            Send Email
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Basic Info */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Typography><strong>Email:</strong> {candidate.email}</Typography>
              <Typography><strong>Phone:</strong> {candidate.phone || 'N/A'}</Typography>
              <Typography><strong>Ranking Score:</strong> {candidate.ranking_score}/100</Typography>
              <Box mt={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Skills ({candidate.skills?.length || 0})
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {candidate.skills?.slice(0, 5).map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill.skill_name || skill}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                  {candidate.skills?.length > 5 && (
                    <Chip label={`+${candidate.skills.length - 5} more`} size="small" />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Analysis Summary */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Analysis Summary
              </Typography>
              {analysis && (
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="textSecondary">
                      Education
                    </Typography>
                    <Typography variant="h6">
                      {analysis.education_analysis?.highest_qualification || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="textSecondary">
                      Experience
                    </Typography>
                    <Typography variant="h6">
                      {analysis.experience_analysis?.employment_history_count || 0} roles
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="textSecondary">
                      Skill Alignment
                    </Typography>
                    <Typography variant="h6">
                      {skillAlignment?.skill_alignment?.alignment_ratio || '0%'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="textSecondary">
                      Missing Info
                    </Typography>
                    <Typography variant="h6">
                      {analysis.missing_information?.missing_fields?.length || 0} items
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Detailed Analysis */}
        <Grid item xs={12}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Education Analysis</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {analysis?.education_analysis ? (
                <Box>
                  <Typography><strong>Highest Qualification:</strong> {analysis.education_analysis.highest_qualification}</Typography>
                  <Typography><strong>Educational Gaps:</strong> {analysis.education_analysis.educational_gaps?.join(', ') || 'None'}</Typography>
                  <Typography><strong>Institutional Quality:</strong> {analysis.education_analysis.institutional_quality}</Typography>
                </Box>
              ) : (
                <Typography>No education analysis available</Typography>
              )}
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Professional Experience</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {analysis?.experience_analysis ? (
                <Box>
                  <Typography><strong>Employment History:</strong> {analysis.experience_analysis.employment_history_count} roles</Typography>
                  <Typography><strong>Career Progression:</strong> {analysis.experience_analysis.career_progression}</Typography>
                  <Typography><strong>Timeline Overlaps:</strong> {analysis.experience_analysis.timeline_overlaps?.join(', ') || 'None'}</Typography>
                  <Typography><strong>Professional Gaps:</strong> {analysis.experience_analysis.professional_gaps?.join(', ') || 'None'}</Typography>
                </Box>
              ) : (
                <Typography>No experience analysis available</Typography>
              )}
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Skill Alignment</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {skillAlignment?.skill_alignment ? (
                <Box>
                  <Typography><strong>Alignment Ratio:</strong> {skillAlignment.skill_alignment.alignment_ratio}</Typography>
                  <Typography variant="subtitle2" sx={{ mt: 2 }}>Matched Skills:</Typography>
                  <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                    {skillAlignment.skill_alignment.matched_skills?.map((skill, index) => (
                      <Chip key={index} label={skill} color="success" size="small" />
                    ))}
                  </Box>
                  <Typography variant="subtitle2">Missing Skills:</Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {skillAlignment.skill_alignment.missing_skills?.map((skill, index) => (
                      <Chip key={index} label={skill} color="warning" size="small" />
                    ))}
                  </Box>
                </Box>
              ) : (
                <Typography>No skill alignment data available</Typography>
              )}
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Ranking Analysis (Extra Credit)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {analysis?.ranking_analysis ? (
                <Box>
                  <Typography><strong>Overall Score:</strong> {analysis.ranking_analysis.overall_score}/100</Typography>
                  <Typography variant="subtitle2" sx={{ mt: 2 }}>Score Breakdown:</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Education"
                        secondary={`${analysis.ranking_analysis.breakdown.education_score}/30 points`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Experience"
                        secondary={`${analysis.ranking_analysis.breakdown.experience_score}/25 points`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Skills"
                        secondary={`${analysis.ranking_analysis.breakdown.skills_score}/20 points`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Research"
                        secondary={`${analysis.ranking_analysis.breakdown.research_score}/15 points`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Certifications"
                        secondary={`${analysis.ranking_analysis.breakdown.certifications_score}/5 points`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Missing Info Penalty"
                        secondary={`${analysis.ranking_analysis.breakdown.missing_penalty} points`}
                      />
                    </ListItem>
                  </List>
                </Box>
              ) : (
                <Typography>No ranking analysis available</Typography>
              )}
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>

      {/* Email Dialog */}
      <Dialog open={emailDialog} onClose={() => setEmailDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Send Email to {candidate.name}</DialogTitle>
        <DialogContent>
          <TextField
            label="Subject"
            fullWidth
            value={emailData.subject}
            onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            label="Message"
            multiline
            rows={10}
            fullWidth
            value={emailData.body}
            onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
          />
          {sendingEmail && <LinearProgress sx={{ mt: 2 }} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmailDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSendEmail}
            variant="contained"
            disabled={sendingEmail}
          >
            {sendingEmail ? 'Sending...' : 'Send Email'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CandidateDetail;