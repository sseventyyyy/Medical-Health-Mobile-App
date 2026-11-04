const BLUE = "#4f6bed";

function Phone({ title, blue, children }: any) {
  return <section style={{ width: 280, minHeight: 560, boxSizing: "border-box", padding: 20, border: "1px solid #e5e7eb", borderRadius: 28, background: blue ? BLUE : "#fff", color: blue ? "#fff" : "#111827", fontFamily: "Arial, sans-serif", display: "flex", flexDirection: "column", gap: 14 }}>
    <small style={{ textAlign: "center", fontWeight: 700 }}>{title}</small>
    {children}
  </section>;
}
function Top({ children }: any) { return <div style={{ fontWeight: 700 }}>{children}</div>; }
function Small({ children }: any) { return <small style={{ color: "#6b7280" }}>{children}</small>; }
function Label({ children }: any) { return <label style={{ display: "block", margin: "10px 0 6px", fontSize: 13, fontWeight: 600 }}>{children}</label>; }
function Input(props: any) { return <input {...props} style={{ width: "100%", boxSizing: "border-box", padding: 11, border: "1px solid #d1d5db", borderRadius: 8, ...props.style }} />; }
function Btn({ children, push, light }: any) { return <button style={{ marginTop: push ? "auto" : 0, padding: 13, border: 0, borderRadius: 9, background: light ? "#fff" : BLUE, color: light ? BLUE : "#fff", fontWeight: 700 }}>{children}</button>; }
function Card({ children, style }: any) { return <div style={{ padding: 16, borderRadius: 12, background: "#f3f4f6", display: "flex", alignItems: "center", ...style }}>{children}</div>; }
function Item({ label, value, boldValue }: any) { return <div style={{ display: "flex", justifyContent: "space-between", gap: 8, margin: "10px 0" }}><span>{label}</span><span style={{ fontWeight: boldValue ? 700 : 400 }}>{value}</span></div>; }
function Box({ children }: any) { return <div style={{ padding: 16, borderRadius: 12, background: "rgba(255,255,255,.92)", color: "#111827" }}>{children}</div>; }
function Chips({ options, start, column }: any) { return <div style={{ display: "flex", flexDirection: column ? "column" : "row", gap: 10 }}>{options.map((option: string, index: number) => <button key={option} style={{ padding: 12, textAlign: "left", border: "1px solid #e5e7eb", borderRadius: 9, background: index === start ? "#eef2ff" : "#fff" }}>{option}</button>)}</div>; }
function Title({ children }: any) { return <h2 style={{ fontFamily: "Arial, sans-serif" }}>{children}</h2>; }
function Row({ children }: any) { return <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start" }}>{children}</div>; }

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