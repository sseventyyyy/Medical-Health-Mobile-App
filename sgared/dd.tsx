import { useState, type CSSProperties, type ReactNode } from "react";

export const BLUE = "#2f5bff";
const SOFT = "#dde4ff", TEXT = "#1c2540", GRAY = "#7a849c";

const s: Record<string, CSSProperties> = {
  app: { background: "#2b2b2b", padding: 24, minHeight: "100vh", boxSizing: "border-box", fontFamily: "Urbanist, Arial, sans-serif" },
  navBtn: { background: "none", border: 0, color: "#fff", marginRight: 18, fontSize: 16, cursor: "pointer", fontFamily: "inherit" },
  title: { color: "#fff", background: BLUE, display: "inline-block", padding: "8px 24px", borderRadius: 30, margin: "0 0 16px", fontSize: 24 },
  row: { display: "flex", flexWrap: "wrap", gap: 24, marginBottom: 40 },
  caption: { color: "#aaa", fontSize: 13, marginBottom: 6 },
  phone: { width: 300, minHeight: 580, boxSizing: "border-box", background: "#fff", color: TEXT, borderRadius: 22, padding: 16, display: "flex", flexDirection: "column", gap: 12 },
  phoneBlue: { background: BLUE, color: "#fff", textAlign: "center" },
  top: { fontWeight: 800, fontSize: 18, textAlign: "left" },
  small: { color: GRAY, fontSize: 13 },
  card: { background: SOFT, color: TEXT, borderRadius: 14, padding: 12, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
  avatar: { fontSize: 34, background: "#fff", borderRadius: "50%", width: 52, height: 52, display: "grid", placeItems: "center" },
  avatarBig: { width: 90, height: 90, fontSize: 56, margin: "0 auto" },
  btn: { display: "block", width: "100%", boxSizing: "border-box", background: BLUE, color: "#fff", border: "1px solid " + BLUE, borderRadius: 20, padding: 12, fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit" },
  btnLight: { background: "#fff", color: BLUE },
  btnInCard: { width: "auto", flex: 1, padding: 8 },
  push: { marginTop: "auto" },
  chips: { display: "flex", gap: 8, flexWrap: "wrap" },
  chip: { padding: "6px 12px", borderRadius: 16, border: 0, background: SOFT, color: TEXT, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" },
  chipOn: { background: BLUE, color: "#fff" },
  label: { fontSize: 13, fontWeight: 800 },
  input: { width: "100%", boxSizing: "border-box", padding: 10, borderRadius: 10, border: "1px solid #ccd5f5", background: "#f1f4ff", fontFamily: "inherit" },
  item: { display: "flex", justifyContent: "space-between", fontSize: 14, padding: "4px 0" },
  box: { background: "#fff", color: TEXT, borderRadius: 14, padding: 14, textAlign: "left" },
  bottom: { display: "flex", justifyContent: "space-around", background: BLUE, borderRadius: 14, padding: 10 },
};

const m = (...a: (CSSProperties | false | undefined)[]): CSSProperties => Object.assign({}, ...a);

export const chipStyle = (on: boolean) => m(s.chip, on && s.chipOn);


export const Shell = ({ children }: { children: ReactNode }) => <div style={s.app}>{children}</div>;
export const Title = ({ children }: { children: ReactNode }) => <h1 style={s.title}>{children}</h1>;
export const Row = ({ children }: { children: ReactNode }) => <div style={s.row}>{children}</div>;
export const NavButton = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) => (
  <button style={m(s.navBtn, on && { fontWeight: 800, textDecoration: "underline" })} onClick={onClick}>{children}</button>
);

export function Phone({ title, children, blue = false }: { title: string; children: ReactNode; blue?: boolean }) {
  return (
    <figure style={{ margin: 0 }}>
      <figcaption style={s.caption}>{title}</figcaption>
      <div style={m(s.phone, blue && s.phoneBlue)}>{children}</div>
    </figure>
  );
}
export const Top = ({ children }: { children: ReactNode }) => <div style={s.top}>{children}</div>;
export const Small = ({ children }: { children: ReactNode }) => <small style={s.small}>{children}</small>;
export const Label = ({ children }: { children: ReactNode }) => <label style={s.label}>{children}</label>;


export const Input = ({ placeholder, type = "text" }: { placeholder: string; type?: string }) => <input style={s.input} placeholder={placeholder} type={type} />;
export const TextArea = ({ placeholder }: { placeholder: string }) => <textarea style={m(s.input, { minHeight: 90 })} placeholder={placeholder} />;
export const Radio = ({ name, text, checked = false }: { name: string; text: string; checked?: boolean }) => (
  <label style={s.label}><input type="radio" name={name} defaultChecked={checked} /> {text}</label>
);
export function Btn({ children, light, push, inCard, onClick }: { children: ReactNode; light?: boolean; push?: boolean; inCard?: boolean; onClick?: () => void }) {
  return <button onClick={onClick} style={m(s.btn, light && s.btnLight, inCard && s.btnInCard, push && s.push)}>{children}</button>;
}

export const Card = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => <div style={m(s.card, style)}>{children}</div>;
export const Avatar = ({ emoji, big }: { emoji: string; big?: boolean }) => <span style={m(s.avatar, big && s.avatarBig)}>{emoji}</span>;
export const Item = ({ label, value, boldValue }: { label: string; value: string; boldValue?: boolean }) => (
  <div style={s.item}>{boldValue ? <span>{label}</span> : <b>{label}</b>}{boldValue ? <b>{value}</b> : <span>{value}</span>}</div>
);
export const Box = ({ children }: { children: ReactNode }) => <div style={s.box}>{children}</div>;


export const DoctorCard = () => (
  <Card><Avatar emoji="👩‍⚕️" /><div><b>Dr. Olivia Turner, M.D.</b><br /><Small>Dermato-Endocrinology</Small></div></Card>
);

export const BottomBar = () => <div style={s.bottom}><span>🏠</span><span>💬</span><span>👤</span><span>📅</span></div>;


export function Chips({ options, start = 0, column = false }: { options: string[]; start?: number; column?: boolean }) {
  const [selected, setSelected] = useState(start); 
  return (
    <div style={m(s.chips, column && { flexDirection: "column" })}>
      {options.map((text, i) => (
        <button key={text} style={chipStyle(i === selected)} onClick={() => setSelected(i)}>{text}</button>
      ))}
    </div>
  );
}*