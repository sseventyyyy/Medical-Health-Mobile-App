import { Phone, Top, Small, Label, Input, Btn, Card, Item, Box, Chips, Title, Row, BLUE } from "./shared";

function PaymentMethod() {
  return (
    <Phone title="Payment Method">
      <Top>‹ Payment Method</Top>
      <b>Credit &amp; Debit Card</b>
      <Card>💳 Add New Card</Card>
      <b>More Payment Option</b>
      <Chips options={["🍎 Apple Pay", "🅿️ Paypal", "🇬 Google Pay"]} start={-1} column />
    </Phone>
  );
}

function AddCard() {
  return (
    <Phone title="Add Card">
      <Top>‹ Add Card</Top>
      <Card style={{ background: BLUE, color: "#fff", height: 120, alignItems: "flex-end" }}>
        <b>000 000 000 00<br />John Doe</b>
      </Card>
      <Label>Card Holder Name</Label>
      <Input placeholder="John Doe" />
      <Label>Card Number</Label>
      <Input placeholder="0000 0000 0000 0000" />
      <div style={{ display: "flex", gap: 8 }}>
        <div><Label>Expiry Date</Label><Input placeholder="04/28" /></div>
        <div><Label>CVV</Label><Input placeholder="000" /></div>
      </div>
      <Btn push>Save Card</Btn>
    </Phone>
  );
}

function ReviewSummary() {
  return (
    <Phone title="Review Summary" blue>
      <Top>‹ Payment</Top>
      <h2 style={{ fontSize: 36, margin: 0 }}>$ 100.00</h2>
      <Box>
        <b>Dr. Olivia Turner, M.D.</b><br /><Small>Dermato-Endocrinology</Small><hr />
        <Item label="Date / Time" value="Oct 24, 10:00 AM" boldValue />
        <Item label="Duration" value="30 min" boldValue />
        <Item label="Amount" value="$100" boldValue />
        <Item label="Payment Method" value="Card" boldValue />
      </Box>
      <Btn light push>Pay Now</Btn>
    </Phone>
  );
}

function PaymentSuccess() {
  return (
    <Phone title="Payment Success" blue>
      <Top>‹</Top>
      <div style={{ fontSize: 90, marginTop: 80 }}>✅</div>
      <h2 style={{ margin: 0 }}>Congratulation</h2>
      <p style={{ margin: 0 }}>Payment is Successfully</p>
      <Box>
        <Small>Your appointment is booked with</Small><br />
        <b>Dr. Olivia Turner, M.D.</b><br />Oct 24 · 10:00 AM
      </Box>
    </Phone>
  );
}

export function PaymentPage() {
  return (
    <>
      <Title>10 Payment Method Options</Title>
      <Row><PaymentMethod /><AddCard /><ReviewSummary /><PaymentSuccess /></Row>
    </>
  );
}'