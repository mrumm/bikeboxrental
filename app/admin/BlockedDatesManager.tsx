'use client';

import { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

type BlockedDate = {
  id: number;
  date: string;
  reason: string | null;
  createdAt: string;
};

export default function BlockedDatesManager() {
  const [rows, setRows] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/blocked-dates', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setRows(data.blockedDates || []);
    } catch (e) {
      setError('Failed to load blocked dates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!startDate) {
      setError('Start date is required');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/blocked-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate,
          endDate: endDate || undefined,
          reason: reason || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to block dates');
      } else {
        setSuccess(`Blocked ${data.count} day${data.count === 1 ? '' : 's'}`);
        setStartDate('');
        setEndDate('');
        setReason('');
        await load();
      }
    } catch (e) {
      setError('Failed to block dates');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/admin/blocked-dates/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      await load();
    } catch (e) {
      setError('Failed to remove blocked date');
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Blocked Dates
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Block a single day or a date range to prevent bookings on those days.
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <TextField
            label="Start date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
            size="small"
          />
          <TextField
            label="End date (optional)"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            helperText="Leave empty to block a single day"
          />
          <TextField
            label="Reason (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            size="small"
            sx={{ minWidth: 240 }}
          />
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? 'Blocking...' : 'Block dates'}
          </Button>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : rows.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No blocked dates.
        </Typography>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Added</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.reason || '-'}</TableCell>
                  <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="remove"
                      size="small"
                      onClick={() => handleDelete(row.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}
