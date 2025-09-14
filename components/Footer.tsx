import { Box, Container, Typography, Grid, Paper, Link } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: 'grey.100', pt: 6, pb: 4, mt: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOnIcon color="primary" />
              Pickup Location
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Hamilton, ON - L8P 2M3 Area
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Exact address will be provided 24 hours before your rental.
              Located in central Hamilton, easily accessible from the QEW and downtown.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <EmailIcon fontSize="small" />
              Contact: rummel.markus@gmail.com
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ overflow: 'hidden', borderRadius: 2 }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5806.080447842397!2d-79.87516602408562!3d43.25904897112925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882c9b10c4e0c6e5%3A0x7d2e44c6d5f5a5a6!2sHamilton%2C%20ON%20L8P%202M3%2C%20Canada!5e0!3m2!1sen!2sca!4v1694700000000!5m2!1sen!2sca"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Pickup area map"
              />
            </Paper>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Map shows approximate pickup area (L8P 2M3)
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Bike Box Rental Hamilton - A project by Tommy Rummel
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}