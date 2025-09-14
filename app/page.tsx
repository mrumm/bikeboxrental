import { Container, Typography, Button, Box, Grid, Paper, Stack } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

export default function HomePage() {
  return (
    <>
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h1" component="h1" gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '3rem' } }}>
                Tommy&apos;s Bike Box Rental
              </Typography>
              <Typography variant="h5" component="p" sx={{ mb: 4, opacity: 0.95 }}>
                Professional bike travel case rentals in Hamilton, ON
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7 }}>
                Hi, I&apos;m Tommy Rummel! I&apos;m 5 years old and I&apos;m renting out my family&apos;s professional bike case
                to help cyclists travel safely with their bikes. Perfect for your next cycling adventure, race, or vacation!
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component={Link}
                  href="/booking"
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'grey.100' }
                  }}
                >
                  Book Now - $30/week
                </Button>
                <Button
                  component={Link}
                  href="/faq"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': { borderColor: 'grey.100', bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  View Specifications
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
                <Image
                  src="/Tommy.jpeg"
                  alt="Tommy Rummel"
                  width={600}
                  height={450}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  priority
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h2" component="h2" textAlign="center" gutterBottom>
          B&W International Bike Box II
        </Typography>
        <Typography variant="h6" component="p" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          Professional-grade protection for your valuable bicycle
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
              <Image
                src="/bikeboxBW2.jpg"
                alt="B&W International Bike Box II"
                width={600}
                height={400}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <DirectionsBikeIcon color="primary" fontSize="large" />
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Fits Most Bikes
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Accommodates road bikes up to 62cm frame size. Internal dimensions: 115 × 81 × 28 cm
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <LocalShippingIcon color="primary" fontSize="large" />
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Airline Approved
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Hard ABS shell with aluminum frame, 4 sturdy wheels, and secure latches. Weight: ~13kg empty
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <AttachMoneyIcon color="primary" fontSize="large" />
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Simple Weekly Pricing
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Just $30 per week. Book online, pay securely with Stripe, and pick up in Hamilton
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant="h4" component="p" gutterBottom>
            Ready for your next cycling adventure?
          </Typography>
          <Button
            component={Link}
            href="/booking"
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
          >
            Check Availability & Book
          </Button>
        </Box>
      </Container>
    </>
  );
}