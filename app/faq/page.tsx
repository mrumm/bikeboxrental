import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const specifications = [
  { label: 'External Dimensions', metric: '119 × 89 × 29.5 cm', imperial: '46.9 × 35 × 11.6 in' },
  { label: 'Internal Dimensions', metric: '115 × 81 × 28 cm', imperial: '45.3 × 31.9 × 11 in' },
  { label: 'Weight (empty)', metric: '~13 kg', imperial: '~28 lb' },
  { label: 'Shell Material', metric: 'ABS plastic', imperial: 'ABS plastic' },
  { label: 'Frame', metric: 'Aluminum', imperial: 'Aluminum' },
  { label: 'Wheels', metric: '4 fixed casters', imperial: '4 fixed casters' },
  { label: 'Closures', metric: '4 latches + center strap', imperial: '4 latches + center strap' },
  { label: 'Max Frame Size', metric: 'Up to 62 cm', imperial: 'Up to 24.4 in' },
];

const faqs = [
  {
    question: 'How do I book the bike box?',
    answer: 'Simply click on "Book Now" from our homepage, select your rental dates (minimum 1 week), fill in your contact information, and complete the payment through our secure Stripe checkout. You\'ll receive an instant confirmation email.',
  },
  {
    question: 'What\'s included with the rental?',
    answer: 'The rental includes the B&W International Bike Box II, internal padding, and basic packing instructions. You\'ll need to provide your own tools for disassembling your bike (typically just Allen keys).',
  },
  {
    question: 'Where do I pick up and return the box?',
    answer: 'Pick-up and drop-off are in Hamilton, ON. The exact address will be provided via email 24 hours before your rental starts. We\'re conveniently located and easily accessible.',
  },
  {
    question: 'Will my bike fit?',
    answer: 'The box accommodates most road bikes up to 62cm frame size. Mountain bikes with standard handlebars typically fit as well. You\'ll need to remove wheels, pedals, and possibly handlebars depending on your bike size.',
  },
  {
    question: 'Is the box airline approved?',
    answer: 'Yes! The B&W International Bike Box II meets most airline requirements for sporting equipment. However, we recommend checking with your specific airline as fees and policies vary. The box weighs about 13kg empty.',
  },
  {
    question: 'What if I need to cancel or change dates?',
    answer: 'Please contact us as soon as possible. Cancellations made more than 48 hours before the rental start date receive a full refund. Changes are subject to availability.',
  },
  {
    question: 'How do I pack my bike?',
    answer: 'We provide basic instructions with the rental. Generally, you\'ll need to: remove wheels, remove pedals, lower or remove seat post, turn handlebars parallel to frame (or remove), and wrap the frame in the provided padding.',
  },
  {
    question: 'Can I extend my rental?',
    answer: 'Yes, subject to availability. Contact us before your rental ends to arrange an extension. Additional weeks are charged at the same $30/week rate.',
  },
  {
    question: 'Is there a damage deposit?',
    answer: 'No deposit is required. The rental fee covers normal wear and tear. You\'re responsible for any significant damage or loss of the box.',
  },
  {
    question: 'Do you deliver?',
    answer: 'Currently, we only offer pick-up and drop-off at our Hamilton location. Delivery options may be available in the future.',
  },
];

export default function FAQPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Frequently Asked Questions
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 6 }}>
        Everything you need to know about Bike Box Rental Hamilton
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            Common Questions
          </Typography>
          {faqs.map((faq, index) => (
            <Accordion key={index} defaultExpanded={index === 0}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h5" gutterBottom>
              Quick Info
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Rental Rate
              </Typography>
              <Typography variant="h6" gutterBottom>
                $30 CAD per week
              </Typography>

              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                Minimum Rental
              </Typography>
              <Typography variant="h6" gutterBottom>
                1 week
              </Typography>

              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                Location
              </Typography>
              <Typography variant="h6" gutterBottom>
                Hamilton, ON
              </Typography>

              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                Payment
              </Typography>
              <Typography variant="h6" gutterBottom>
                Secure via Stripe
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Technical Specifications
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Feature</strong></TableCell>
                <TableCell><strong>Metric</strong></TableCell>
                <TableCell><strong>Imperial</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {specifications.map((spec, index) => (
                <TableRow key={index}>
                  <TableCell>{spec.label}</TableCell>
                  <TableCell>{spec.metric}</TableCell>
                  <TableCell>{spec.imperial}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Paper sx={{ p: 4, mt: 6, bgcolor: 'primary.50', textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Still have questions?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Feel free to reach out to us at rummel.markus@gmail.com
        </Typography>
      </Paper>
    </Container>
  );
}