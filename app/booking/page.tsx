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
      const response = await fetch('/api/availability', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      const data = await response.json();
      setBlockedDates(data.blockedDates || []);
      setBookedRanges(data.bookedRanges || []);
    } catch (err) {
      console.error('Failed to fetch availability:', err);
    }
  };

  const isDateDisabled = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');

    // Disable past dates
    if (isBefore(date, startOfDay(new Date()))) {
      return true;
    }

    // Check manually blocked dates
    if (blockedDates.includes(dateStr)) {
      return true;
    }

    // Check booked date ranges
    for (const range of bookedRanges) {
      if (dateStr >= range.start && dateStr <= range.end) {
        return true;
      }
    }

    return false;
  };

  const isEndDateDisabled = (date: Date) => {
    if (!startDate) return isDateDisabled(date);

    const dateStr = format(date, 'yyyy-MM-dd');
    const startStr = format(startDate, 'yyyy-MM-dd');

    // Must be at least 6 days after start date (minimum 1 week)
    if (isBefore(date, addDays(startDate, 6))) {
      return true;
    }

    // Check if there's any booked date between start and this date
    for (const range of bookedRanges) {
      // If there's a booking that starts after our start date and before this date
      // we can't book through it
      if (range.start > startStr && range.start <= dateStr) {
        return true;
      }
      // If there's a booking that ends after our start date and before this date
      if (range.end >= startStr && range.end < dateStr) {
        return true;
      }
    }

    return isDateDisabled(date);
  };

  const isStartDateDisabled = (date: Date) => {
    if (!endDate) return isDateDisabled(date);

    const dateStr = format(date, 'yyyy-MM-dd');
    const endStr = format(endDate, 'yyyy-MM-dd');

    // Must be at least 7 days before end date
    if (isAfter(date, addDays(endDate, -6))) {
      return true;
    }

    // Check if there's any booked date between this date and end
    for (const range of bookedRanges) {
      // If there's a booking between this start date and our end date
      if (range.start >= dateStr && range.start <= endStr) {
        return true;
      }
      if (range.end >= dateStr && range.end <= endStr) {
        return true;
      }
    }

    return isDateDisabled(date);
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

  const checkDateRangeAvailable = (start: Date, end: Date): boolean => {
    const startStr = format(start, 'yyyy-MM-dd');
    const endStr = format(end, 'yyyy-MM-dd');

    // Check if any booked range overlaps with selected dates
    for (const range of bookedRanges) {
      // Check for any overlap between ranges
      if (
        (startStr >= range.start && startStr <= range.end) || // Start date is within a booked range
        (endStr >= range.start && endStr <= range.end) || // End date is within a booked range
        (startStr <= range.start && endStr >= range.end) // Selected range encompasses a booked range
      ) {
        return false;
      }
    }

    // Check each day in the selected range
    let currentDate = new Date(start);
    while (currentDate <= end) {
      if (isDateDisabled(currentDate)) {
        return false;
      }
      currentDate = addDays(currentDate, 1);
    }

    return true;
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

    if (!checkDateRangeAvailable(startDate, endDate)) {
      setError('Selected dates are not available. Please choose a different date range.');
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
                  shouldDisableDate={isStartDateDisabled}
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
                  shouldDisableDate={isEndDateDisabled}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            {(startDate || endDate) && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {startDate && endDate && (
                    <Alert severity="info" sx={{ flex: 1 }}>
                      Rental Period: {calculateWeeks()} week{calculateWeeks() !== 1 ? 's' : ''}
                      {' '}• Total Price: ${calculatePrice()} CAD
                    </Alert>
                  )}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setStartDate(null);
                      setEndDate(null);
                    }}
                  >
                    Clear Dates
                  </Button>
                </Box>
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
          • Pick-up and drop-off location: Hamilton, ON (L8P 2M3 area - exact address provided after booking)
          <br />
          • Payment is processed securely through Stripe
          <br />
          • You&apos;ll receive a confirmation email with pick-up instructions
        </Typography>
      </Box>
    </Container>
  );
}