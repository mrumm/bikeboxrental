'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Stack,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Link from 'next/link';

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await fetch(`/api/booking/${sessionId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch booking details');
        }

        const data = await response.json();
        setBookingDetails(data);
      } catch (err) {
        console.error('Error fetching booking details:', err);
        setError('Unable to load booking details. Please check your email for confirmation.');
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchBookingDetails();
    } else {
      setError('No session ID provided');
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading booking details...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom>
          Booking Confirmed!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Thank you for choosing Bike Box Rental Hamilton
        </Typography>
      </Box>

      {error ? (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
        bookingDetails && (
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Booking Details
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Customer Name
                  </Typography>
                  <Typography variant="body1">
                    {bookingDetails.customerName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {bookingDetails.customerEmail}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Rental Period
                  </Typography>
                  <Typography variant="body1">
                    {bookingDetails.startDate} to {bookingDetails.endDate}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Paid
                  </Typography>
                  <Typography variant="body1">
                    ${(bookingDetails.totalPrice / 100).toFixed(2)} CAD
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Paper>
        )
      )}

      <Paper sx={{ p: 4, bgcolor: 'primary.50' }}>
        <Typography variant="h6" gutterBottom>
          What&apos;s Next?
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          1. You&apos;ll receive a confirmation email shortly with all the details
          <br />
          2. We&apos;ll send you the exact pick-up location 24 hours before your rental starts
          <br />
          3. Please bring a valid ID when picking up the bike box
          <br />
          4. The bike box includes padding and instructions for packing your bike
        </Typography>
      </Paper>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            component={Link}
            href="/"
            variant="contained"
            size="large"
          >
            Back to Home
          </Button>
          <Button
            component={Link}
            href="/faq"
            variant="outlined"
            size="large"
          >
            View FAQ
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading...</Typography>
      </Container>
    }>
      <BookingSuccessContent />
    </Suspense>
  );
}