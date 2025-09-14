'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDays, differenceInDays, format, startOfDay, isBefore, isAfter } from 'date-fns';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function BookingPage() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [bookedRanges, setBookedRanges] = useState<Array<{ start: string; end: string }>>([]);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const response = await fetch('/api/availability');
      const data = await response.json();
      setBlockedDates(data.blockedDates || []);
      setBookedRanges(data.bookedRanges || []);
    } catch (err) {
      console.error('Failed to fetch availability:', err);
    }
  };

  const isDateDisabled = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');

    if (isBefore(date, startOfDay(new Date()))) {
      return true;
    }

    if (blockedDates.includes(dateStr)) {
      return true;
    }

    for (const range of bookedRanges) {
      if (dateStr >= range.start && dateStr <= range.end) {
        return true;
      }
    }

    return false;
  };

  const calculateWeeks = () => {
    if (!startDate || !endDate) return 0;
    const days = differenceInDays(endDate, startDate) + 1;
    return Math.ceil(days / 7);
  };

  const calculatePrice = () => {
    const weeks = calculateWeeks();
    return weeks * 30;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      setLoading(false);
      return;
    }

    if (calculateWeeks() < 1) {
      setError('Minimum rental period is 1 week');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd'),
          notes,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw error;
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Book Your Bike Box
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Select your rental dates and complete the booking. Weekly pricing at $30/week.
      </Typography>

      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Rental Dates
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={setStartDate}
                  shouldDisableDate={isDateDisabled}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                  minDate={startDate ? addDays(startDate, 6) : undefined}
                  shouldDisableDate={isDateDisabled}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            {startDate && endDate && (
              <Grid item xs={12}>
                <Alert severity="info">
                  Rental Period: {calculateWeeks()} week{calculateWeeks() !== 1 ? 's' : ''}
                  {' '}• Total Price: ${calculatePrice()} CAD
                </Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Contact Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="email"
                label="Email Address"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Optional"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Special Requests or Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional - Let us know if you have any special requirements"
              />
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading || !startDate || !endDate || !customerName || !customerEmail}
              >
                {loading ? <CircularProgress size={24} /> : `Proceed to Payment - $${calculatePrice()}`}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          Booking Information
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Minimum rental period is 1 week
          <br />
          • Pick-up and drop-off location: Hamilton, ON (exact address provided after booking)
          <br />
          • Payment is processed securely through Stripe
          <br />
          • You&apos;ll receive a confirmation email with pick-up instructions
        </Typography>
      </Box>
    </Container>
  );
}