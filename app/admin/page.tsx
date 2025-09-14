import { redirect } from 'next/navigation';
import { db, bookings, type Booking } from '@/lib/db';
import { desc } from 'drizzle-orm';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Alert,
} from '@mui/material';

async function getBookings() {
  try {
    if (!db) {
      return [];
    }

    const allBookings = await db
      .select()
      .from(bookings)
      .orderBy(desc(bookings.createdAt));

    return allBookings;
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return [];
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'expired':
      return 'error';
    default:
      return 'default';
  }
}

export default async function AdminPage() {
  const adminKey = process.env.ADMIN_SECRET_KEY;

  if (!adminKey) {
    redirect('/');
  }

  const allBookings = await getBookings();

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        View all bookings and their status
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        This is a simplified admin view. For full payment details and management, use your Stripe Dashboard.
      </Alert>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Total ($)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allBookings.map((booking: Booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.customerName}</TableCell>
                <TableCell>{booking.customerEmail}</TableCell>
                <TableCell>{booking.customerPhone || '-'}</TableCell>
                <TableCell>{booking.startDate}</TableCell>
                <TableCell>{booking.endDate}</TableCell>
                <TableCell>${(booking.totalPrice / 100).toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={booking.paymentStatus}
                    color={getStatusColor(booking.paymentStatus) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(booking.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>{booking.notes || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {allBookings.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" color="text.secondary">
            No bookings yet
          </Typography>
        </Box>
      )}

      <Paper sx={{ p: 3, mt: 4, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>
          Admin Notes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Payment Status: &quot;completed&quot; means payment was successful
          <br />
          • Use Stripe Dashboard for refunds and detailed payment information
          <br />
          • Customer will receive automatic email confirmation for completed bookings
          <br />
          • Access this page with proper authentication in production
        </Typography>
      </Paper>
    </Container>
  );
}