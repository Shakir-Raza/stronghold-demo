import { useState, useMemo } from "react";
import {
  LayoutDashboard, Users, Truck, ArrowLeftRight, Landmark, Boxes,
  Table2, FileText, BarChart3, Settings, Search, Sun, Moon,
  TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight,
  Building2, ChevronRight, Bell, CircleDot, Plus, Filter, ArrowLeft,
  Phone, Mail, MapPin, User, Pencil, Clock, ReceiptText,
  CheckCircle2, AlertTriangle, Hourglass, PackageSearch
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, PieChart, Pie, Cell, BarChart, Bar
} from "recharts";

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------
const palette = {
  light: {
    bg: "#F5F4F1",
    surface: "#FFFFFF",
    surfaceAlt: "#FAFAF8",
    border: "#E3E1DA",
    text: "#1C2321",
    textMuted: "#6B6F6C",
    textFaint: "#9A9D99",
    primary: "#1B3A5C",
    primarySoft: "#EAF0F6",
    accent: "#C68A2E",
    accentSoft: "#FBF1DF",
    success: "#2E7D5B",
    successSoft: "#E7F3ED",
    danger: "#B3452F",
    dangerSoft: "#FBEBE6",
    sidebarBg: "#132436",
    sidebarText: "#B9C4CE",
    sidebarTextActive: "#FFFFFF",
    sidebarActiveBg: "#1B3A5C",
  },
  dark: {
    bg: "#0F1720",
    surface: "#16212C",
    surfaceAlt: "#1B2733",
    border: "#28353F",
    text: "#EDEFEF",
    textMuted: "#9AA5AC",
    textFaint: "#6C767D",
    primary: "#6E9BC4",
    primarySoft: "#1D2E3D",
    accent: "#D9A24B",
    accentSoft: "#2C2416",
    success: "#5CBE93",
    successSoft: "#17281F",
    danger: "#E08165",
    dangerSoft: "#2C1A16",
    sidebarBg: "#0B141C",
    sidebarText: "#8B98A2",
    sidebarTextActive: "#FFFFFF",
    sidebarActiveBg: "#1B3A5C",
  },
};

const fonts = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');
    .sh-display { font-family: 'Space Grotesk', sans-serif; }
    .sh-body { font-family: 'IBM Plex Sans', sans-serif; }
    .sh-mono { font-family: 'IBM Plex Mono', monospace; }
  `}</style>
);

// ---------------------------------------------------------------------------
// Nav structure
// ---------------------------------------------------------------------------
const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, phase: 1 },
  { key: "customers", label: "Customers", icon: Users, phase: 1 },
  { key: "vendors", label: "Vendors", icon: Truck, phase: 1 },
  { key: "transactions", label: "Transactions", icon: ArrowLeftRight, phase: 1 },
  { key: "loans", label: "Loans", icon: Landmark, phase: 1 },
  { key: "assets", label: "Assets", icon: Boxes, phase: 1 },
  { key: "spreadsheet", label: "Spreadsheet", icon: Table2, phase: 1 },
  { key: "documents", label: "Documents", icon: FileText, phase: 1 },
  { key: "reports", label: "Reports", icon: BarChart3, phase: 1 },
  { key: "settings", label: "Settings", icon: Settings, phase: 1 },
];

// ---------------------------------------------------------------------------
// Seed data — Stronghold Pakistan (post-tensioning / construction subcontractor)
// ---------------------------------------------------------------------------
const monthlyActivity = [
  { month: "Feb", credit: 42, debit: 28 },
  { month: "Mar", credit: 55, debit: 34 },
  { month: "Apr", credit: 38, debit: 41 },
  { month: "May", credit: 61, debit: 30 },
  { month: "Jun", credit: 49, debit: 37 },
  { month: "Jul", credit: 67, debit: 44 },
  { month: "Aug", credit: 58, debit: 39 },
];

const loanDistribution = [
  { name: "Active", value: 3, key: "primary" },
  { name: "Paid", value: 3, key: "success" },
  { name: "Overdue", value: 2, key: "danger" },
  { name: "Pending", value: 2, key: "accent" },
];

const topOutstanding = [
  { name: "NESPAK", amount: 184 },
  { name: "Descon Eng.", amount: 156 },
  { name: "FWO", amount: 121 },
  { name: "Habib Constr.", amount: 98 },
  { name: "NHA", amount: 74 },
];

const recentActivity = [
  { text: "Credit added to NESPAK — Sukkur Barrage PT works", time: "2h ago", type: "credit" },
  { text: "Loan payment received from Descon Engineering", time: "5h ago", type: "success" },
  { text: "New vendor registered — Freyssinet Prestressing Systems", time: "Yesterday", type: "vendor" },
  { text: "Debit recorded — strand procurement, Lyari Expressway", time: "Yesterday", type: "debit" },
  { text: "Customer payment received from FWO — Zero Point Interchange", time: "2 days ago", type: "success" },
  { text: "New loan issued to Habib Construction Services", time: "3 days ago", type: "credit" },
];

function fmtCr(v) {
  return `Rs ${v.toFixed(2)} Cr`;
}

// ---------------------------------------------------------------------------
// Customers — seed data
// ---------------------------------------------------------------------------
const datePools = [
  ["14 Mar 2026", "02 May 2026", "19 Jun 2026", "27 Jul 2026"],
  ["08 Feb 2026", "21 Apr 2026", "11 Jun 2026", "30 Jul 2026"],
  ["22 Mar 2026", "15 May 2026", "03 Jul 2026", "05 Aug 2026"],
  ["03 Feb 2026", "28 Apr 2026", "24 Jun 2026", "01 Aug 2026"],
];

const customers = [
  { id: "C-1001", name: "NESPAK", type: "Government — Engineering Consultancy", project: "Sukkur Barrage Rehabilitation", contactPerson: "Eng. Faisal Mahmood", phone: "+92 51 9260112", email: "faisal.mahmood@nespak.com.pk", address: "NESPAK House, Sector G-8/4, Islamabad", status: "Active", paidTotal: 210, outstanding: 184, activeLoans: 1, dates: datePools[0] },
  { id: "C-1002", name: "Descon Engineering", type: "EPC Contractor", project: "Lyari Expressway — Girder Launching", contactPerson: "Ahsan Raza", phone: "+92 321 4456712", email: "ahsan.raza@desconeng.com", address: "26-N, Gulberg II, Lahore", status: "Active", paidTotal: 268, outstanding: 156, activeLoans: 2, dates: datePools[1] },
  { id: "C-1003", name: "FWO — Frontier Works Organization", type: "Government — Infrastructure", project: "Zero Point Interchange — PT Works", contactPerson: "Col (R) Imran Sheikh", phone: "+92 51 9260123", email: "coord@fwo.gov.pk", address: "FWO Headquarters, Rawalpindi", status: "Active", paidTotal: 198, outstanding: 121, activeLoans: 1, dates: datePools[2] },
  { id: "C-1004", name: "Habib Construction Services", type: "EPC Contractor", project: "Karachi Metrobus — Green Line Elevated Section", contactPerson: "Bilal Habib", phone: "+92 300 2219087", email: "bilal@habibconstruction.pk", address: "Plot 45, SITE Area, Karachi", status: "Active", paidTotal: 142, outstanding: 98, activeLoans: 1, dates: datePools[3] },
  { id: "C-1005", name: "NHA — National Highway Authority", type: "Government — Infrastructure Authority", project: "Multan–Sukkur Motorway Bridge Works", contactPerson: "Eng. Sana Tariq", phone: "+92 61 4512309", email: "projects@nha.gov.pk", address: "NHA Regional Office, Multan", status: "Active", paidTotal: 189, outstanding: 74, activeLoans: 0, dates: datePools[0] },
  { id: "C-1006", name: "CSCEC Pakistan", type: "EPC Contractor", project: "Karakoram Highway Phase II — Bridge Stressing", contactPerson: "Kamran Yousuf", phone: "+92 51 8351209", email: "kamran.yousuf@cscec.com.pk", address: "CSCEC Pakistan Office, Islamabad", status: "Active", paidTotal: 121, outstanding: 63, activeLoans: 1, dates: datePools[1] },
  { id: "C-1007", name: "Zahir Khan & Associates", type: "EPC Contractor", project: "Ravi River Bridge — Prestressed Girders", contactPerson: "Zahir Khan", phone: "+92 300 4471203", email: "info@zkassociates.pk", address: "Model Town, Lahore", status: "Active", paidTotal: 74, outstanding: 52, activeLoans: 0, dates: datePools[2] },
  { id: "C-1008", name: "Sukkur Barrage Irrigation Authority", type: "Government — Irrigation Department", project: "Weir Wall Rehabilitation — Sukkur Barrage", contactPerson: "Eng. Waseem Abbasi", phone: "+92 71 5630044", email: "irrigation@sindh.gov.pk", address: "Barrage Colony, Sukkur", status: "Active", paidTotal: 96, outstanding: 45, activeLoans: 0, dates: datePools[3] },
  { id: "C-1009", name: "Punjab Metro Bus Authority", type: "Government — Transit Authority", project: "Multan Metro — Elevated Corridor", contactPerson: "Ayesha Farooq", phone: "+92 61 4512309", email: "info@pma.punjab.gov.pk", address: "Metro Bus Authority, Multan", status: "Active", paidTotal: 112, outstanding: 38, activeLoans: 0, dates: datePools[0] },
  { id: "C-1010", name: "Al-Jomaih Construction Co.", type: "EPC Contractor", project: "Gulpur Hydropower — Spillway PT Works", contactPerson: "Omar Al-Rashid", phone: "+92 300 9981234", email: "pakistan@aljomaih.com", address: "Mirpur, AJ&K", status: "Active", paidTotal: 41, outstanding: 18, activeLoans: 0, dates: datePools[1] },
  { id: "C-1011", name: "K-Electric Infrastructure Projects", type: "Private Utility", project: "Transmission Tower Foundation — Landhi Grid", contactPerson: "Farhan Qureshi", phone: "+92 300 8825511", email: "farhan.qureshi@ke.com.pk", address: "K-Electric House, Karachi", status: "Active", paidTotal: 33, outstanding: 27, activeLoans: 0, dates: datePools[2] },
  { id: "C-1012", name: "Kohat Cement Infrastructure Division", type: "Materials & Infrastructure", project: "Bridge Deck Slab — Kohat Bypass", contactPerson: "Rashid Mehmood", phone: "+92 922 560341", email: "infra@kohatcement.com", address: "Kohat, KPK", status: "Inactive", paidTotal: 38, outstanding: 22, activeLoans: 0, dates: datePools[3] },
  { id: "C-1013", name: "Sindh Building Control Authority", type: "Government — Regulatory Authority", project: "High-Rise Structural Review — Clifton", contactPerson: "Nadia Iqbal", phone: "+92 21 99332215", email: "info@sbca.gos.pk", address: "SBCA Head Office, Karachi", status: "Active", paidTotal: 29, outstanding: 15, activeLoans: 0, dates: datePools[0] },
  { id: "C-1014", name: "NLC — National Logistics Cell", type: "Government — Logistics & Infrastructure", project: "Gwadar Port Access Road — Bridge Works", contactPerson: "Brig (R) Tariq Latif", phone: "+92 300 5567234", email: "gwadar@nlc.com.pk", address: "NLC House, Gwadar", status: "Active", paidTotal: 58, outstanding: 31, activeLoans: 1, dates: datePools[1] },
  { id: "C-1015", name: "Daewoo Pakistan Express Bus Service", type: "Private — Transport Infrastructure", project: "Lahore–Islamabad Motorway Rest Area Structures", contactPerson: "Suleman Chaudhry", phone: "+92 42 35789021", email: "suleman.c@daewoopk.com", address: "Daewoo Terminal, Lahore", status: "Inactive", paidTotal: 21, outstanding: 9, activeLoans: 0, dates: datePools[2] },
  { id: "C-1016", name: "Zulfiqar Industries (Pvt) Ltd", type: "Private — Industrial", project: "Factory Structural Retrofit — Korangi", contactPerson: "Zulfiqar Ahmed", phone: "+92 300 2214490", email: "info@zulfiqarindustries.pk", address: "Korangi Industrial Area, Karachi", status: "Inactive", paidTotal: 14, outstanding: 6, activeLoans: 0, dates: datePools[3] },
];

// ---------------------------------------------------------------------------
// Vendors — seed data
// ---------------------------------------------------------------------------
const vendors = [
  { id: "V-2001", name: "Freyssinet Prestressing Systems", type: "PT Equipment & Strand Supplier", project: "Multi-strand cables & anchorages", contactPerson: "Marc Dubois (local liaison: Asad Naveed)", phone: "+92 21 34530221", email: "asad.naveed@freyssinet.com.pk", address: "Sharae Faisal, Karachi", status: "Active", paidTotal: 88, outstanding: 42, activeLoans: 2, dates: datePools[0] },
  { id: "V-2002", name: "VSL International Pakistan", type: "PT Systems Supplier", project: "Stressing jacks & grouting systems", contactPerson: "Nabeel Aslam", phone: "+92 21 35123344", email: "nabeel.aslam@vsl.com.pk", address: "II Chundrigar Road, Karachi", status: "Active", paidTotal: 74, outstanding: 35, activeLoans: 1, dates: datePools[1] },
  { id: "V-2003", name: "DYWIDAG-Systems International", type: "PT Bar & Anchorage Supplier", project: "Post-tensioning bars", contactPerson: "Hassan Raheel", phone: "+92 42 35876601", email: "hassan.raheel@dywidag.com.pk", address: "Gulberg III, Lahore", status: "Active", paidTotal: 46, outstanding: 21, activeLoans: 0, dates: datePools[2] },
  { id: "V-2004", name: "Agha Steel Industries", type: "Steel Supplier", project: "Reinforcement steel bars", contactPerson: "Waqar Ahmed", phone: "+92 21 32550142", email: "waqar.ahmed@aghasteel.com", address: "Port Qasim, Karachi", status: "Active", paidTotal: 112, outstanding: 58, activeLoans: 1, dates: datePools[3] },
  { id: "V-2005", name: "International Steels Limited", type: "Steel Supplier", project: "Structural steel sheets", contactPerson: "Fahad Siddiqui", phone: "+92 21 35291122", email: "fahad.siddiqui@isl.com.pk", address: "SITE Area, Karachi", status: "Active", paidTotal: 40, outstanding: 19, activeLoans: 0, dates: datePools[0] },
  { id: "V-2006", name: "Lucky Cement", type: "Cement Supplier", project: "Bulk cement supply", contactPerson: "Imran Baig", phone: "+92 21 35624011", email: "imran.baig@lucky-cement.com", address: "Korangi Industrial Area, Karachi", status: "Active", paidTotal: 65, outstanding: 27, activeLoans: 0, dates: datePools[1] },
  { id: "V-2007", name: "Kohinoor Steel", type: "Steel Supplier", project: "PC strand & wire", contactPerson: "Adeel Farooq", phone: "+92 42 37120087", email: "adeel.farooq@kohinoorsteel.com", address: "Sundar Industrial Estate, Lahore", status: "Active", paidTotal: 31, outstanding: 14, activeLoans: 0, dates: datePools[2] },
  { id: "V-2008", name: "Master Group of Industries", type: "Equipment Supplier", project: "Hydraulic jacks & pumps", contactPerson: "Salman Tariq", phone: "+92 42 35761234", email: "salman.tariq@mastergroup.com.pk", address: "Multan Road, Lahore", status: "Active", paidTotal: 22, outstanding: 9, activeLoans: 0, dates: datePools[3] },
  { id: "V-2009", name: "Ittehad Chemicals", type: "Chemicals Supplier", project: "Grout additives & admixtures", contactPerson: "Bilal Sarwar", phone: "+92 21 32311098", email: "bilal.sarwar@ittehadchemicals.com", address: "West Wharf, Karachi", status: "Active", paidTotal: 15, outstanding: 6, activeLoans: 0, dates: datePools[0] },
  { id: "V-2010", name: "Bestway Cement", type: "Cement Supplier", project: "OPC cement", contactPerson: "Usman Ghani", phone: "+92 51 8352210", email: "usman.ghani@bestway.com.pk", address: "Blue Area, Islamabad", status: "Active", paidTotal: 24, outstanding: 11, activeLoans: 0, dates: datePools[1] },
  { id: "V-2011", name: "National Logistics Services", type: "Logistics & Transport", project: "Heavy equipment transport", contactPerson: "Kashif Rana", phone: "+92 300 8871234", email: "kashif.rana@nls.com.pk", address: "Super Highway, Karachi", status: "Inactive", paidTotal: 19, outstanding: 8, activeLoans: 0, dates: datePools[2] },
  { id: "V-2012", name: "Attock Cables", type: "Electrical & Cabling", project: "Site electrical cabling", contactPerson: "Naveed Iqbal", phone: "+92 42 36302298", email: "naveed.iqbal@attockcables.com", address: "Hattar Industrial Estate, Haripur", status: "Inactive", paidTotal: 9, outstanding: 4, activeLoans: 0, dates: datePools[3] },
];

function buildTransactions(cust) {
  const creditTotal = cust.paidTotal + cust.outstanding;
  const c1 = +(creditTotal * 0.38).toFixed(2);
  const c2 = +(creditTotal - c1).toFixed(2);
  const d1 = +(cust.paidTotal * 0.45).toFixed(2);
  const d2 = +(cust.paidTotal - d1).toFixed(2);
  let bal = 0;
  const rows = [];
  bal = +(bal + c1).toFixed(2);
  rows.push({ date: cust.dates[0], type: "credit", description: `Progress billing — ${cust.project}`, amount: c1, balance: bal });
  bal = +(bal - d1).toFixed(2);
  rows.push({ date: cust.dates[1], type: "debit", description: `Payment received — ${cust.project}`, amount: d1, balance: bal });
  bal = +(bal + c2).toFixed(2);
  rows.push({ date: cust.dates[2], type: "credit", description: `Progress billing — ${cust.project} (Stage 2)`, amount: c2, balance: bal });
  bal = +(bal - d2).toFixed(2);
  rows.push({ date: cust.dates[3], type: "debit", description: `Payment received — ${cust.project} (Stage 2)`, amount: d2, balance: bal });
  return { rows, creditTotal };
}

function buildActivity(cust, txns) {
  const events = [{ date: txns[0].date, text: `Customer onboarded — ${cust.project}` }];
  txns.forEach(t => {
    events.push({
      date: t.date,
      text: t.type === "credit" ? `Invoice raised — Rs ${t.amount} Cr` : `Payment received — Rs ${t.amount} Cr`,
    });
  });
  if (cust.activeLoans > 0) {
    events.push({ date: txns[txns.length - 1].date, text: `Active loan facility issued against ${cust.project}` });
  }
  return events;
}

// ---------------------------------------------------------------------------
// Loans — seed data
// ---------------------------------------------------------------------------
const loans = [
  { id: "LN-201", party: "NESPAK", kind: "customer", principal: 60, paid: 25, remaining: 35, interest: "N/A — advance", nextPayment: "20 Sep 2026", dueDate: "15 Dec 2026", status: "Active", history: [
    { date: "14 Mar 2026", amount: 15, method: "Bank transfer" },
    { date: "19 Jun 2026", amount: 10, method: "Cheque" },
  ]},
  { id: "LN-202", party: "Descon Engineering", kind: "customer", principal: 90, paid: 40, remaining: 50, interest: "8% p.a.", nextPayment: "05 Sep 2026", dueDate: "01 Feb 2027", status: "Active", history: [
    { date: "08 Feb 2026", amount: 20, method: "Bank transfer" },
    { date: "11 Jun 2026", amount: 20, method: "Bank transfer" },
  ]},
  { id: "LN-203", party: "Descon Engineering", kind: "customer", principal: 30, paid: 30, remaining: 0, interest: "6% p.a.", nextPayment: "—", dueDate: "10 Jun 2026", status: "Paid", history: [
    { date: "02 Mar 2026", amount: 15, method: "Cheque" },
    { date: "28 May 2026", amount: 15, method: "Bank transfer" },
  ]},
  { id: "LN-204", party: "FWO — Frontier Works Organization", kind: "customer", principal: 45, paid: 45, remaining: 0, interest: "N/A — advance", nextPayment: "—", dueDate: "22 May 2026", status: "Paid", history: [
    { date: "22 Mar 2026", amount: 25, method: "Bank transfer" },
    { date: "05 May 2026", amount: 20, method: "Bank transfer" },
  ]},
  { id: "LN-205", party: "Habib Construction Services", kind: "customer", principal: 38, paid: 10, remaining: 28, interest: "7.5% p.a.", nextPayment: "20 Jul 2026", dueDate: "30 Nov 2026", status: "Overdue", history: [
    { date: "03 Feb 2026", amount: 10, method: "Cheque" },
  ]},
  { id: "LN-206", party: "CSCEC Pakistan", kind: "customer", principal: 52, paid: 20, remaining: 32, interest: "6% p.a.", nextPayment: "18 Jul 2026", dueDate: "01 Oct 2026", status: "Overdue", history: [
    { date: "21 Apr 2026", amount: 20, method: "Bank transfer" },
  ]},
  { id: "LN-207", party: "NLC — National Logistics Cell", kind: "customer", principal: 25, paid: 5, remaining: 20, interest: "9% p.a.", nextPayment: "25 Sep 2026", dueDate: "20 Jan 2027", status: "Active", history: [
    { date: "21 Apr 2026", amount: 5, method: "Cheque" },
  ]},
  { id: "LN-208", party: "Freyssinet Prestressing Systems", kind: "vendor", principal: 15, paid: 15, remaining: 0, interest: "N/A — equipment financing", nextPayment: "—", dueDate: "02 Apr 2026", status: "Paid", history: [
    { date: "14 Mar 2026", amount: 15, method: "Bank transfer" },
  ]},
  { id: "LN-209", party: "Agha Steel Industries", kind: "vendor", principal: 20, paid: 0, remaining: 20, interest: "Pending disbursement terms", nextPayment: "TBD", dueDate: "TBD", status: "Pending", history: [] },
  { id: "LN-210", party: "VSL International Pakistan", kind: "vendor", principal: 12, paid: 0, remaining: 12, interest: "Pending disbursement terms", nextPayment: "TBD", dueDate: "TBD", status: "Pending", history: [] },
];

// ---------------------------------------------------------------------------
// Assets — seed data
// ---------------------------------------------------------------------------
const assets = [
  { id: "AS-301", name: "Stressing Jack 500t — Freyssinet", category: "Stressing Equipment", value: 18.5, status: "In Use", location: "Sukkur Barrage", purchaseDate: "12 Jan 2024", serial: "FJ-500-8841" },
  { id: "AS-302", name: "Stressing Jack 300t — VSL", category: "Stressing Equipment", value: 12.2, status: "In Use", location: "Lyari Expressway", purchaseDate: "03 Mar 2024", serial: "VSL-300-2219" },
  { id: "AS-303", name: "Hydraulic Pump Unit HP-90", category: "Pumps", value: 4.8, status: "Available", location: "Karachi Yard", purchaseDate: "18 Jun 2023", serial: "HP-90-1102" },
  { id: "AS-304", name: "PC Strand Coil 15.7mm (batch)", category: "Strand & Cable", value: 9.4, status: "In Use", location: "Zero Point Interchange", purchaseDate: "22 Feb 2026", serial: "STR-157-9401" },
  { id: "AS-305", name: "Anchorages Set — Multi-strand", category: "Anchorage Systems", value: 6.1, status: "In Use", location: "Sukkur Barrage", purchaseDate: "05 Jan 2026", serial: "ANC-MS-552" },
  { id: "AS-306", name: "Grouting Pump GP-12", category: "Pumps", value: 3.2, status: "Maintenance", location: "Lahore Workshop", purchaseDate: "14 Sep 2022", serial: "GP-12-087" },
  { id: "AS-307", name: "Strand Dispenser Reel", category: "Handling", value: 1.9, status: "Available", location: "Karachi Yard", purchaseDate: "30 Nov 2024", serial: "SDR-44" },
  { id: "AS-308", name: "Stressing Jack 250t — DYWIDAG", category: "Stressing Equipment", value: 10.5, status: "In Use", location: "Karakoram Highway Ph II", purchaseDate: "08 Aug 2025", serial: "DY-250-3310" },
  { id: "AS-309", name: "Mobile Generator 100kVA", category: "Power", value: 5.6, status: "Available", location: "Karachi Yard", purchaseDate: "19 Apr 2023", serial: "GEN-100-221" },
  { id: "AS-310", name: "Load Cell Calibration Set", category: "Instrumentation", value: 2.4, status: "Available", location: "Lahore Workshop", purchaseDate: "02 Jul 2025", serial: "LC-CAL-09" },
  { id: "AS-311", name: "PC Strand Coil 12.7mm (batch)", category: "Strand & Cable", value: 7.8, status: "In Use", location: "Karachi Metrobus Green Line", purchaseDate: "11 Mar 2026", serial: "STR-127-7712" },
  { id: "AS-312", name: "Flat Jack Set (bridge bearing)", category: "Specialised", value: 4.1, status: "Maintenance", location: "Lahore Workshop", purchaseDate: "27 Oct 2021", serial: "FJ-BR-18" },
];

const documents = [
  { id: "DOC-401", title: "Progress Billing — Sukkur Barrage PT Works", type: "Invoice", party: "NESPAK", project: "Sukkur Barrage Rehabilitation", date: "19 Jun 2026", status: "Issued", amount: 84 },
  { id: "DOC-402", title: "Payment Certificate — Lyari Expressway Stage 2", type: "Payment Certificate", party: "Descon Engineering", project: "Lyari Expressway — Girder Launching", date: "11 Jun 2026", status: "Approved", amount: 112 },
  { id: "DOC-403", title: "Material Delivery Note — PC Strand 15.7mm", type: "Delivery Note", party: "Freyssinet Prestressing Systems", project: "Multi-project stock", date: "22 Feb 2026", status: "Received", amount: 9.4 },
  { id: "DOC-404", title: "Loan Facility Agreement — Habib Construction", type: "Agreement", party: "Habib Construction Services", project: "Karachi Metrobus — Green Line", date: "03 Feb 2026", status: "Active", amount: 38 },
  { id: "DOC-405", title: "Stressing Record — Zero Point Interchange", type: "Site Record", party: "FWO — Frontier Works Organization", project: "Zero Point Interchange — PT Works", date: "05 May 2026", status: "Filed", amount: null },
  { id: "DOC-406", title: "Purchase Order — VSL Stressing Jacks", type: "Purchase Order", party: "VSL International Pakistan", project: "Equipment pool", date: "15 Jan 2025", status: "Fulfilled", amount: 12.2 },
  { id: "DOC-407", title: "Variation Order — Multan–Sukkur Bridge PT", type: "Variation Order", party: "NHA — National Highway Authority", project: "Multan–Sukkur Motorway Bridge Works", date: "28 Apr 2026", status: "Under Review", amount: 22 },
  { id: "DOC-408", title: "Equipment Hire Invoice — Generator 100kVA", type: "Invoice", party: "Internal", project: "Site power — multiple", date: "01 Aug 2026", status: "Draft", amount: 0.85 },
];

const spreadsheetSeed = [
  ["Item", "Unit", "Qty", "Rate (Rs)", "Amount (Rs Cr)", "Project"],
  ["PC Strand 15.7mm", "tonne", "42", "0.42", "17.64", "Sukkur Barrage"],
  ["PC Strand 12.7mm", "tonne", "28", "0.38", "10.64", "Metrobus Green Line"],
  ["Multi-strand Anchorage", "set", "120", "0.048", "5.76", "Sukkur Barrage"],
  ["Stressing Labour", "crew-day", "85", "0.09", "7.65", "Lyari Expressway"],
  ["Grout & Admixture", "bag", "2400", "0.0018", "4.32", "Zero Point"],
  ["Equipment Mobilisation", "ls", "1", "2.4", "2.4", "Karakoram Hwy"],
  ["Site Supervision", "month", "6", "1.1", "6.6", "All active"],
  ["Contingency (5%)", "%", "—", "—", "2.75", "—"],
  ["TOTAL", "", "", "", "57.76", ""],
];

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------
function StatCard({ c, icon: Icon, label, value, delta, deltaDir, accentKey = "primary" }) {
  const tone = {
    primary: { fg: c.primary, bg: c.primarySoft },
    success: { fg: c.success, bg: c.successSoft },
    danger: { fg: c.danger, bg: c.dangerSoft },
    accent: { fg: c.accent, bg: c.accentSoft },
  }[accentKey];

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{ background: c.surface, border: `1px solid ${c.border}` }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: tone.bg }}
        >
          <Icon size={17} style={{ color: tone.fg }} />
        </div>
        {delta && (
          <div
            className="flex items-center gap-1 text-xs sh-mono font-medium px-1.5 py-0.5 rounded"
            style={{
              color: deltaDir === "up" ? c.success : c.danger,
              background: deltaDir === "up" ? c.successSoft : c.dangerSoft,
            }}
          >
            {deltaDir === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {delta}
          </div>
        )}
      </div>
      <div>
        <div className="text-xs sh-body mb-1" style={{ color: c.textMuted }}>{label}</div>
        <div className="text-2xl sh-mono font-semibold" style={{ color: c.text }}>{value}</div>
      </div>
    </div>
  );
}

function SectionCard({ c, title, subtitle, right, children }) {
  return (
    <div className="rounded-xl p-5" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-sm sh-display font-semibold" style={{ color: c.text }}>{title}</div>
          {subtitle && <div className="text-xs sh-body mt-0.5" style={{ color: c.textMuted }}>{subtitle}</div>}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Party profile (shared by Customers and Vendors)
// ---------------------------------------------------------------------------
function PartyProfile({ c, party, kind, onBack }) {
  const { rows: txns, creditTotal } = useMemo(() => buildTransactions(party), [party]);
  const activity = useMemo(() => buildActivity(party, txns), [party, txns]);
  const active = party.status === "Active";
  const isVendor = kind === "vendor";

  return (
    <div className="flex flex-col gap-5">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs sh-body w-fit"
        style={{ color: c.textMuted }}
      >
        <ArrowLeft size={13} /> Back to {isVendor ? "vendors" : "customers"}
      </button>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center sh-display font-semibold text-base"
            style={{ background: c.primarySoft, color: c.primary }}
          >
            {party.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="sh-display text-lg font-semibold" style={{ color: c.text }}>{party.name}</div>
              <span
                className="text-[10px] sh-mono px-2 py-0.5 rounded-full"
                style={{ background: active ? c.successSoft : c.dangerSoft, color: active ? c.success : c.danger }}
              >
                {party.status}
              </span>
            </div>
            <div className="text-xs sh-body mt-0.5" style={{ color: c.textMuted }}>
              {party.id} · {party.type}
            </div>
          </div>
        </div>
        <button
          className="flex items-center gap-1.5 text-xs sh-body px-3 py-1.5 rounded-lg"
          style={{ background: c.surface, border: `1px solid ${c.border}`, color: c.text }}
        >
          <Pencil size={13} /> Edit
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1 flex flex-col gap-4">
          <SectionCard c={c} title="Contact Information">
            <div className="flex flex-col gap-3">
              {[
                { icon: User, label: "Contact", value: party.contactPerson },
                { icon: Phone, label: "Phone", value: party.phone },
                { icon: Mail, label: "Email", value: party.email },
                { icon: MapPin, label: "Address", value: party.address },
              ].map((row, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <row.icon size={14} className="mt-0.5" style={{ color: c.textFaint }} />
                  <div className="text-xs sh-body leading-snug" style={{ color: c.text }}>{row.value}</div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard c={c} title={isVendor ? "Primary Supply" : "Active Project"}>
            <div className="flex items-start gap-2.5">
              <ReceiptText size={14} className="mt-0.5" style={{ color: c.textFaint }} />
              <div className="text-xs sh-body leading-snug" style={{ color: c.text }}>{party.project}</div>
            </div>
          </SectionCard>
        </div>

        <div className="col-span-3 flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4">
            <StatCard c={c} icon={TrendingUp} label="Total Credit" value={fmtCr(creditTotal)} accentKey="success" />
            <StatCard c={c} icon={TrendingDown} label="Total Debit" value={fmtCr(party.paidTotal)} accentKey="danger" />
            <StatCard c={c} icon={Wallet} label="Total Paid" value={fmtCr(party.paidTotal)} accentKey="primary" />
            <StatCard c={c} icon={ArrowUpRight} label={isVendor ? "Outstanding Payable" : "Outstanding Balance"} value={fmtCr(party.outstanding)} accentKey="accent" />
            <StatCard c={c} icon={Landmark} label={isVendor ? "Open POs" : "Active Loans"} value={party.activeLoans} accentKey="primary" />
            <StatCard c={c} icon={Clock} label="Last Activity" value={txns[txns.length - 1].date} accentKey="success" />
          </div>

          <SectionCard c={c} title="Transaction History" subtitle="Chronological, running balance">
            <table className="w-full text-xs sh-body">
              <thead>
                <tr style={{ borderBottom: `1px solid ${c.border}` }}>
                  {["Date", "Type", "Description", "Amount", "Balance"].map((h, i) => (
                    <th
                      key={i}
                      className={`py-2 font-medium ${i >= 3 ? "text-right" : "text-left"}`}
                      style={{ color: c.textMuted }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {txns.map((t, i) => (
                  <tr key={i} style={{ borderBottom: i < txns.length - 1 ? `1px solid ${c.border}` : "none" }}>
                    <td className="py-2.5 sh-mono" style={{ color: c.textMuted }}>{t.date}</td>
                    <td className="py-2.5">
                      <span
                        className="text-[10px] sh-mono px-1.5 py-0.5 rounded"
                        style={{
                          color: t.type === "credit" ? c.success : c.danger,
                          background: t.type === "credit" ? c.successSoft : c.dangerSoft,
                        }}
                      >
                        {t.type === "credit" ? "CREDIT" : "DEBIT"}
                      </span>
                    </td>
                    <td className="py-2.5" style={{ color: c.text }}>{t.description}</td>
                    <td className="py-2.5 text-right sh-mono" style={{ color: c.text }}>Rs {t.amount} Cr</td>
                    <td className="py-2.5 text-right sh-mono font-medium" style={{ color: c.text }}>Rs {t.balance} Cr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>

          <SectionCard c={c} title="Activity Timeline">
            <div className="flex flex-col">
              {activity.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full mt-1.5" style={{ background: c.primary }} />
                    {i < activity.length - 1 && <div className="w-px flex-1" style={{ background: c.border }} />}
                  </div>
                  <div className="pb-4">
                    <div className="text-xs sh-body" style={{ color: c.text }}>{a.text}</div>
                    <div className="text-[10.5px] sh-mono mt-0.5" style={{ color: c.textFaint }}>{a.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Party list module (shared by Customers and Vendors)
// ---------------------------------------------------------------------------
function PartyListModule({ c, kind, data }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const isVendor = kind === "vendor";
  const label = isVendor ? "Vendor" : "Customer";

  if (selected) {
    return <PartyProfile c={c} party={selected} kind={kind} onBack={() => setSelected(null)} />;
  }

  const filtered = data.filter(p => {
    const matchesQuery =
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.project.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status.toLowerCase() === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="sh-display text-lg font-semibold" style={{ color: c.text }}>{label}s</div>
          <div className="text-xs sh-body mt-0.5" style={{ color: c.textMuted }}>{data.length} total · {data.filter(x => x.status === "Active").length} active</div>
        </div>
        <button
          className="flex items-center gap-1.5 text-xs sh-body font-medium px-3 py-2 rounded-lg"
          style={{ background: c.primary, color: "#fff" }}
        >
          <Plus size={14} /> Add {label}
        </button>
      </div>

      <div className="flex items-center gap-2.5">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 max-w-sm"
          style={{ background: c.surface, border: `1px solid ${c.border}` }}
        >
          <Search size={13} style={{ color: c.textFaint }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={`Search ${label.toLowerCase()}s or projects…`}
            className="bg-transparent outline-none text-xs flex-1 sh-body"
            style={{ color: c.text }}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter size={13} style={{ color: c.textFaint }} />
          {["all", "active", "inactive"].map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className="text-xs sh-body px-2.5 py-1.5 rounded-lg capitalize"
              style={{
                background: statusFilter === f ? c.primarySoft : "transparent",
                color: statusFilter === f ? c.primary : c.textMuted,
                border: `1px solid ${statusFilter === f ? c.primarySoft : c.border}`,
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
        <table className="w-full text-xs sh-body">
          <thead>
            <tr style={{ background: c.surfaceAlt, borderBottom: `1px solid ${c.border}` }}>
              {[label, "Type", "Contact", "Outstanding", "Status", ""].map((h, i) => (
                <th key={i} className={`py-2.5 px-4 font-medium ${i === 3 ? "text-right" : "text-left"}`} style={{ color: c.textMuted }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr
                key={p.id}
                onClick={() => setSelected(p)}
                className="cursor-pointer"
                style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${c.border}` : "none" }}
              >
                <td className="py-3 px-4">
                  <div style={{ color: c.text, fontWeight: 500 }}>{p.name}</div>
                  <div className="text-[10.5px] mt-0.5" style={{ color: c.textFaint }}>{p.project}</div>
                </td>
                <td className="py-3 px-4" style={{ color: c.textMuted }}>{p.type}</td>
                <td className="py-3 px-4" style={{ color: c.textMuted }}>{p.contactPerson}</td>
                <td className="py-3 px-4 text-right sh-mono" style={{ color: c.text }}>{fmtCr(p.outstanding)}</td>
                <td className="py-3 px-4">
                  <span
                    className="text-[10px] sh-mono px-2 py-0.5 rounded-full"
                    style={{
                      background: p.status === "Active" ? c.successSoft : c.dangerSoft,
                      color: p.status === "Active" ? c.success : c.danger,
                    }}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <ChevronRight size={14} style={{ color: c.textFaint }} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center" style={{ color: c.textMuted }}>
                  No {label.toLowerCase()}s match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Transactions module
// ---------------------------------------------------------------------------
function parseTxDate(str) {
  const [d, mon, y] = str.split(" ");
  const months = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  return new Date(Number(y), months[mon], Number(d));
}

function buildAllParties() {
  return [
    ...customers.map(p => ({ ...p, kind: "customer" })),
    ...vendors.map(p => ({ ...p, kind: "vendor" })),
  ];
}

function TransactionsModule({ c }) {
  const allParties = useMemo(() => buildAllParties(), []);

  const seedTxns = useMemo(() => {
    const rows = [];
    allParties.forEach(p => {
      const { rows: txns } = buildTransactions(p);
      txns.forEach(t => rows.push({ ...t, id: `${p.id}-${t.date}-${t.type}`, partyId: p.id, partyName: p.name, partyKind: p.kind, reference: `${p.id}/2026` }));
    });
    return rows.sort((a, b) => parseTxDate(b.date) - parseTxDate(a.date));
  }, [allParties]);

  const [txns, setTxns] = useState(seedTxns);
  const [balances, setBalances] = useState(() => Object.fromEntries(allParties.map(p => [p.id, p.outstanding])));
  const [typeFilter, setTypeFilter] = useState("all");
  const [kindFilter, setKindFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ partyId: allParties[0]?.id || "", type: "credit", amount: "", date: "08 Aug 2026", description: "", reference: "" });

  const filtered = txns.filter(t => {
    const matchesType = typeFilter === "all" || t.type === typeFilter;
    const matchesKind = kindFilter === "all" || t.partyKind === kindFilter;
    const matchesQuery = t.partyName.toLowerCase().includes(query.toLowerCase()) || t.description.toLowerCase().includes(query.toLowerCase());
    return matchesType && matchesKind && matchesQuery;
  });

  function handleAdd() {
    const party = allParties.find(p => p.id === form.partyId);
    if (!party || !form.amount) return;
    const amt = +(parseFloat(form.amount)).toFixed(2);
    if (!amt) return;
    const current = balances[party.id] ?? party.outstanding;
    const newBalance = +(form.type === "credit" ? current + amt : current - amt).toFixed(2);
    const entry = {
      id: `${party.id}-${Date.now()}`,
      date: form.date || "08 Aug 2026",
      type: form.type,
      description: form.description || (form.type === "credit" ? "Manual credit entry" : "Manual debit entry"),
      amount: amt,
      balance: newBalance,
      partyId: party.id,
      partyName: party.name,
      partyKind: party.kind,
      reference: form.reference || "—",
    };
    setTxns([entry, ...txns]);
    setBalances({ ...balances, [party.id]: newBalance });
    setForm({ ...form, amount: "", description: "", reference: "" });
    setShowForm(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="sh-display text-lg font-semibold" style={{ color: c.text }}>Transactions</div>
          <div className="text-xs sh-body mt-0.5" style={{ color: c.textMuted }}>{txns.length} entries · Opening + Credit − Debit = Current Balance</div>
        </div>
        <button
          onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-1.5 text-xs sh-body font-medium px-3 py-2 rounded-lg"
          style={{ background: c.primary, color: "#fff" }}
        >
          <Plus size={14} /> Add Transaction
        </button>
      </div>

      {showForm && (
        <SectionCard c={c} title="New Transaction" subtitle="Credit increases balance, debit decreases it">
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-1">
              <div className="text-[10px] sh-mono mb-1" style={{ color: c.textFaint }}>PARTY</div>
              <select
                value={form.partyId}
                onChange={e => setForm({ ...form, partyId: e.target.value })}
                className="w-full text-xs sh-body px-2.5 py-2 rounded-lg outline-none"
                style={{ background: c.surfaceAlt, border: `1px solid ${c.border}`, color: c.text }}
              >
                {allParties.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.kind === "vendor" ? "Vendor" : "Customer"})</option>
                ))}
              </select>
            </div>
            <div className="col-span-1">
              <div className="text-[10px] sh-mono mb-1" style={{ color: c.textFaint }}>TYPE</div>
              <div className="flex gap-1.5">
                {["credit", "debit"].map(t => (
                  <button
                    key={t}
                    onClick={() => setForm({ ...form, type: t })}
                    className="flex-1 text-xs sh-mono px-2.5 py-2 rounded-lg capitalize"
                    style={{
                      background: form.type === t ? (t === "credit" ? c.successSoft : c.dangerSoft) : c.surfaceAlt,
                      color: form.type === t ? (t === "credit" ? c.success : c.danger) : c.textMuted,
                      border: `1px solid ${form.type === t ? "transparent" : c.border}`,
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-span-1">
              <div className="text-[10px] sh-mono mb-1" style={{ color: c.textFaint }}>AMOUNT (RS CR)</div>
              <input
                type="number"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                placeholder="0.00"
                className="w-full text-xs sh-mono px-2.5 py-2 rounded-lg outline-none"
                style={{ background: c.surfaceAlt, border: `1px solid ${c.border}`, color: c.text }}
              />
            </div>
            <div className="col-span-1">
              <div className="text-[10px] sh-mono mb-1" style={{ color: c.textFaint }}>DATE</div>
              <input
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full text-xs sh-mono px-2.5 py-2 rounded-lg outline-none"
                style={{ background: c.surfaceAlt, border: `1px solid ${c.border}`, color: c.text }}
              />
            </div>
            <div className="col-span-2">
              <div className="text-[10px] sh-mono mb-1" style={{ color: c.textFaint }}>DESCRIPTION</div>
              <input
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="e.g. Progress billing — Stage 3"
                className="w-full text-xs sh-body px-2.5 py-2 rounded-lg outline-none"
                style={{ background: c.surfaceAlt, border: `1px solid ${c.border}`, color: c.text }}
              />
            </div>
            <div className="col-span-1">
              <div className="text-[10px] sh-mono mb-1" style={{ color: c.textFaint }}>REFERENCE</div>
              <input
                value={form.reference}
                onChange={e => setForm({ ...form, reference: e.target.value })}
                placeholder="Optional"
                className="w-full text-xs sh-body px-2.5 py-2 rounded-lg outline-none"
                style={{ background: c.surfaceAlt, border: `1px solid ${c.border}`, color: c.text }}
              />
            </div>
            <div className="col-span-1 flex items-end">
              <button
                onClick={handleAdd}
                className="w-full text-xs sh-body font-medium py-2 rounded-lg"
                style={{ background: c.primary, color: "#fff" }}
              >
                Save Transaction
              </button>
            </div>
          </div>
        </SectionCard>
      )}

      <div className="flex items-center gap-2.5">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 max-w-sm"
          style={{ background: c.surface, border: `1px solid ${c.border}` }}
        >
          <Search size={13} style={{ color: c.textFaint }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search transactions…"
            className="bg-transparent outline-none text-xs flex-1 sh-body"
            style={{ color: c.text }}
          />
        </div>
        <div className="flex items-center gap-1.5">
          {["all", "credit", "debit"].map(f => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className="text-xs sh-body px-2.5 py-1.5 rounded-lg capitalize"
              style={{
                background: typeFilter === f ? c.primarySoft : "transparent",
                color: typeFilter === f ? c.primary : c.textMuted,
                border: `1px solid ${typeFilter === f ? c.primarySoft : c.border}`,
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          {["all", "customer", "vendor"].map(f => (
            <button
              key={f}
              onClick={() => setKindFilter(f)}
              className="text-xs sh-body px-2.5 py-1.5 rounded-lg capitalize"
              style={{
                background: kindFilter === f ? c.accentSoft : "transparent",
                color: kindFilter === f ? c.accent : c.textMuted,
                border: `1px solid ${kindFilter === f ? c.accentSoft : c.border}`,
              }}
            >
              {f === "all" ? "All parties" : `${f}s`}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
        <table className="w-full text-xs sh-body">
          <thead>
            <tr style={{ background: c.surfaceAlt, borderBottom: `1px solid ${c.border}` }}>
              {["Date", "Party", "Type", "Description", "Reference", "Amount", "Balance"].map((h, i) => (
                <th key={i} className={`py-2.5 px-4 font-medium ${i >= 5 ? "text-right" : "text-left"}`} style={{ color: c.textMuted }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 40).map((t, i) => (
              <tr key={t.id} style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${c.border}` : "none" }}>
                <td className="py-2.5 px-4 sh-mono" style={{ color: c.textMuted }}>{t.date}</td>
                <td className="py-2.5 px-4" style={{ color: c.text }}>
                  {t.partyName}
                  <span className="text-[10px] sh-mono ml-1.5" style={{ color: c.textFaint }}>
                    {t.partyKind === "vendor" ? "VENDOR" : "CUSTOMER"}
                  </span>
                </td>
                <td className="py-2.5 px-4">
                  <span
                    className="text-[10px] sh-mono px-1.5 py-0.5 rounded"
                    style={{
                      color: t.type === "credit" ? c.success : c.danger,
                      background: t.type === "credit" ? c.successSoft : c.dangerSoft,
                    }}
                  >
                    {t.type === "credit" ? "CREDIT" : "DEBIT"}
                  </span>
                </td>
                <td className="py-2.5 px-4" style={{ color: c.textMuted }}>{t.description}</td>
                <td className="py-2.5 px-4 sh-mono" style={{ color: c.textFaint }}>{t.reference}</td>
                <td className="py-2.5 px-4 text-right sh-mono" style={{ color: c.text }}>Rs {t.amount} Cr</td>
                <td className="py-2.5 px-4 text-right sh-mono font-medium" style={{ color: c.text }}>Rs {t.balance} Cr</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Loans module
// ---------------------------------------------------------------------------
const loanStatusStyle = {
  Active: { icon: CircleDot, tone: "primary" },
  Paid: { icon: CheckCircle2, tone: "success" },
  Overdue: { icon: AlertTriangle, tone: "danger" },
  Pending: { icon: Hourglass, tone: "accent" },
};

function LoanDetail({ c, loan, onBack }) {
  const st = loanStatusStyle[loan.status];
  return (
    <div className="flex flex-col gap-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs sh-body w-fit" style={{ color: c.textMuted }}>
        <ArrowLeft size={13} /> Back to loans
      </button>

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="sh-display text-lg font-semibold" style={{ color: c.text }}>{loan.id}</div>
            <span
              className="flex items-center gap-1 text-[10px] sh-mono px-2 py-0.5 rounded-full"
              style={{ background: c[st.tone + "Soft"], color: c[st.tone] }}
            >
              <st.icon size={11} /> {loan.status}
            </span>
          </div>
          <div className="text-xs sh-body mt-0.5" style={{ color: c.textMuted }}>{loan.party} · {loan.kind === "vendor" ? "Vendor financing" : "Customer loan"}</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard c={c} icon={Landmark} label="Principal" value={fmtCr(loan.principal)} accentKey="primary" />
        <StatCard c={c} icon={Wallet} label="Paid" value={fmtCr(loan.paid)} accentKey="success" />
        <StatCard c={c} icon={ArrowUpRight} label="Remaining" value={fmtCr(loan.remaining)} accentKey="accent" />
        <StatCard c={c} icon={Clock} label="Next Payment" value={loan.nextPayment} accentKey="danger" />
      </div>

      <SectionCard c={c} title="Terms" subtitle={`Due ${loan.dueDate}`}>
        <div className="text-xs sh-body" style={{ color: c.text }}>{loan.interest}</div>
      </SectionCard>

      <SectionCard c={c} title="Payment History">
        {loan.history.length === 0 ? (
          <div className="text-xs sh-body py-4 text-center" style={{ color: c.textMuted }}>No payments recorded yet — disbursement pending.</div>
        ) : (
          <table className="w-full text-xs sh-body">
            <thead>
              <tr style={{ borderBottom: `1px solid ${c.border}` }}>
                {["Date", "Method", "Amount"].map((h, i) => (
                  <th key={i} className={`py-2 font-medium ${i === 2 ? "text-right" : "text-left"}`} style={{ color: c.textMuted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loan.history.map((h, i) => (
                <tr key={i} style={{ borderBottom: i < loan.history.length - 1 ? `1px solid ${c.border}` : "none" }}>
                  <td className="py-2.5 sh-mono" style={{ color: c.textMuted }}>{h.date}</td>
                  <td className="py-2.5" style={{ color: c.text }}>{h.method}</td>
                  <td className="py-2.5 text-right sh-mono" style={{ color: c.text }}>Rs {h.amount} Cr</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SectionCard>
    </div>
  );
}

function LoansModule({ c }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  if (selected) {
    return <LoanDetail c={c} loan={selected} onBack={() => setSelected(null)} />;
  }

  const filtered = loans.filter(l => statusFilter === "all" || l.status.toLowerCase() === statusFilter);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="sh-display text-lg font-semibold" style={{ color: c.text }}>Loans</div>
          <div className="text-xs sh-body mt-0.5" style={{ color: c.textMuted }}>{loans.length} total facilities</div>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <Filter size={13} style={{ color: c.textFaint }} />
        {["all", "active", "paid", "overdue", "pending"].map(f => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className="text-xs sh-body px-2.5 py-1.5 rounded-lg capitalize"
            style={{
              background: statusFilter === f ? c.primarySoft : "transparent",
              color: statusFilter === f ? c.primary : c.textMuted,
              border: `1px solid ${statusFilter === f ? c.primarySoft : c.border}`,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filtered.map(loan => {
          const st = loanStatusStyle[loan.status];
          const pct = loan.principal ? Math.round((loan.paid / loan.principal) * 100) : 0;
          return (
            <div
              key={loan.id}
              onClick={() => setSelected(loan)}
              className="rounded-xl p-4 cursor-pointer flex flex-col gap-3"
              style={{ background: c.surface, border: `1px solid ${c.border}` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm sh-display font-semibold" style={{ color: c.text }}>{loan.id}</div>
                  <div className="text-xs sh-body mt-0.5" style={{ color: c.textMuted }}>{loan.party}</div>
                </div>
                <span
                  className="flex items-center gap-1 text-[10px] sh-mono px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: c[st.tone + "Soft"], color: c[st.tone] }}
                >
                  <st.icon size={11} /> {loan.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs sh-mono">
                <span style={{ color: c.textMuted }}>Rs {loan.paid} Cr paid</span>
                <span style={{ color: c.textMuted }}>Rs {loan.remaining} Cr left</span>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: c.surfaceAlt }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c[st.tone] }} />
              </div>
              <div className="flex items-center justify-between text-[10.5px] sh-mono" style={{ color: c.textFaint }}>
                <span>Next: {loan.nextPayment}</span>
                <span>Due: {loan.dueDate}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Assets module
// ---------------------------------------------------------------------------
const assetStatusStyle = {
  "In Use": { tone: "primary" },
  Available: { tone: "success" },
  Maintenance: { tone: "accent" },
};

function AssetsModule({ c }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const filtered = assets.filter(a => {
    const matchesQuery = a.name.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase()) || a.location.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesQuery && matchesStatus;
  });
  const totalValue = assets.reduce((s, a) => s + a.value, 0);
  if (selected) {
    const st = assetStatusStyle[selected.status] || { tone: "primary" };
    return (
      <div className="flex flex-col gap-5">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-xs sh-body w-fit" style={{ color: c.textMuted }}>
          <ArrowLeft size={13} /> Back to assets
        </button>
        <div>
          <div className="flex items-center gap-2">
            <div className="sh-display text-lg font-semibold" style={{ color: c.text }}>{selected.name}</div>
            <span className="text-[10px] sh-mono px-2 py-0.5 rounded-full" style={{ background: c[st.tone + "Soft"], color: c[st.tone] }}>{selected.status}</span>
          </div>
          <div className="text-xs sh-body mt-0.5" style={{ color: c.textMuted }}>{selected.id} · {selected.category}</div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <StatCard c={c} icon={Wallet} label="Book Value" value={fmtCr(selected.value)} accentKey="primary" />
          <StatCard c={c} icon={MapPin} label="Location" value={selected.location} accentKey="accent" />
          <StatCard c={c} icon={Clock} label="Purchase Date" value={selected.purchaseDate} accentKey="success" />
          <StatCard c={c} icon={PackageSearch} label="Serial" value={selected.serial} accentKey="primary" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="sh-display text-lg font-semibold" style={{ color: c.text }}>Assets</div>
          <div className="text-xs sh-body mt-0.5" style={{ color: c.textMuted }}>{assets.length} items · Book value {fmtCr(totalValue)}</div>
        </div>
        <button className="flex items-center gap-1.5 text-xs sh-body font-medium px-3 py-2 rounded-lg" style={{ background: c.primary, color: "#fff" }}>
          <Plus size={14} /> Add Asset
        </button>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 max-w-sm" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
          <Search size={13} style={{ color: c.textFaint }} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search assets, category, location…" className="bg-transparent outline-none text-xs flex-1 sh-body" style={{ color: c.text }} />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter size={13} style={{ color: c.textFaint }} />
          {["all", "in use", "available", "maintenance"].map(f => (
            <button key={f} onClick={() => setStatusFilter(f)} className="text-xs sh-body px-2.5 py-1.5 rounded-lg capitalize"
              style={{ background: statusFilter === f ? c.primarySoft : "transparent", color: statusFilter === f ? c.primary : c.textMuted, border: `1px solid ${statusFilter === f ? c.primarySoft : c.border}` }}>{f}</button>
          ))}
        </div>
      </div>
      <div className="rounded-xl overflow-hidden" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
        <table className="w-full text-xs sh-body">
          <thead>
            <tr style={{ background: c.surfaceAlt, borderBottom: `1px solid ${c.border}` }}>
              {["Asset", "Category", "Location", "Value", "Status", ""].map((h, i) => (
                <th key={i} className={`py-2.5 px-4 font-medium ${i === 3 ? "text-right" : "text-left"}`} style={{ color: c.textMuted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, i) => {
              const st = assetStatusStyle[a.status] || { tone: "primary" };
              return (
                <tr key={a.id} onClick={() => setSelected(a)} className="cursor-pointer" style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${c.border}` : "none" }}>
                  <td className="py-3 px-4">
                    <div style={{ color: c.text, fontWeight: 500 }}>{a.name}</div>
                    <div className="text-[10.5px] mt-0.5 sh-mono" style={{ color: c.textFaint }}>{a.serial}</div>
                  </td>
                  <td className="py-3 px-4" style={{ color: c.textMuted }}>{a.category}</td>
                  <td className="py-3 px-4" style={{ color: c.textMuted }}>{a.location}</td>
                  <td className="py-3 px-4 text-right sh-mono" style={{ color: c.text }}>{fmtCr(a.value)}</td>
                  <td className="py-3 px-4"><span className="text-[10px] sh-mono px-2 py-0.5 rounded-full" style={{ background: c[st.tone + "Soft"], color: c[st.tone] }}>{a.status}</span></td>
                  <td className="py-3 px-4 text-right"><ChevronRight size={14} style={{ color: c.textFaint }} /></td>
                </tr>
              );
            })}
            {filtered.length === 0 && <tr><td colSpan={6} className="py-10 text-center" style={{ color: c.textMuted }}>No assets match your search.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Spreadsheet module
// ---------------------------------------------------------------------------
function SpreadsheetModule({ c }) {
  const [grid, setGrid] = useState(() => spreadsheetSeed.map(row => [...row]));
  const [editCell, setEditCell] = useState(null);
  function updateCell(r, col, value) {
    setGrid(prev => {
      const next = prev.map(row => [...row]);
      next[r][col] = value;
      if (r > 0 && r < next.length - 1 && (col === 2 || col === 3)) {
        const qty = parseFloat(next[r][2]);
        const rate = parseFloat(next[r][3]);
        if (!isNaN(qty) && !isNaN(rate)) next[r][4] = (qty * rate).toFixed(2);
      }
      if (r > 0 && r < next.length - 1) {
        let sum = 0;
        for (let i = 1; i < next.length - 1; i++) {
          const v = parseFloat(next[i][4]);
          if (!isNaN(v)) sum += v;
        }
        next[next.length - 1][4] = sum.toFixed(2);
      }
      return next;
    });
  }
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="sh-display text-lg font-semibold" style={{ color: c.text }}>Spreadsheet</div>
        <div className="text-xs sh-body mt-0.5" style={{ color: c.textMuted }}>Project cost tracking — edit qty or rate to recalculate amounts</div>
      </div>
      <div className="rounded-xl overflow-auto" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
        <table className="w-full text-xs sh-body border-collapse">
          <thead>
            <tr style={{ background: c.surfaceAlt }}>
              {grid[0].map((h, i) => (
                <th key={i} className={`py-2.5 px-3 font-medium border-b ${i >= 2 && i <= 4 ? "text-right" : "text-left"}`}
                  style={{ color: c.textMuted, borderColor: c.border, minWidth: i === 0 ? 160 : i === 5 ? 140 : 90 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.slice(1).map((row, ri) => {
              const r = ri + 1;
              const isTotal = r === grid.length - 1;
              return (
                <tr key={r} style={{ borderBottom: r < grid.length - 1 ? `1px solid ${c.border}` : "none", background: isTotal ? c.primarySoft : "transparent" }}>
                  {row.map((cell, col) => {
                    const isEditable = !isTotal && col !== 4 && col !== 0;
                    const isEditing = editCell?.r === r && editCell?.col === col;
                    return (
                      <td key={col} className={`py-2 px-3 ${col >= 2 && col <= 4 ? "text-right sh-mono" : ""} ${isTotal ? "font-semibold" : ""}`}
                        style={{ color: isTotal ? c.primary : c.text }} onClick={() => isEditable && setEditCell({ r, col })}>
                        {isEditing ? (
                          <input autoFocus value={cell} onChange={e => updateCell(r, col, e.target.value)} onBlur={() => setEditCell(null)}
                            onKeyDown={e => e.key === "Enter" && setEditCell(null)}
                            className="w-full bg-transparent outline-none text-xs sh-mono text-right" style={{ color: c.text }} />
                        ) : (
                          <span className={isEditable ? "cursor-text hover:underline decoration-dotted" : ""}>
                            {col === 4 && cell !== "" && !isNaN(parseFloat(cell)) ? `Rs ${cell}` : cell}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="text-[10.5px] sh-mono" style={{ color: c.textFaint }}>Click a cell to edit. Qty × Rate auto-updates Amount. Total row recalculates on change.</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Documents module
// ---------------------------------------------------------------------------
function DocumentsModule({ c }) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const types = ["all", ...Array.from(new Set(documents.map(d => d.type)))];
  const filtered = documents.filter(d => {
    const matchesQuery = d.title.toLowerCase().includes(query.toLowerCase()) || d.party.toLowerCase().includes(query.toLowerCase()) || (d.project || "").toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (typeFilter === "all" || d.type === typeFilter);
  });
  if (selected) {
    return (
      <div className="flex flex-col gap-5">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-xs sh-body w-fit" style={{ color: c.textMuted }}>
          <ArrowLeft size={13} /> Back to documents
        </button>
        <div className="flex items-start justify-between">
          <div>
            <div className="sh-display text-lg font-semibold" style={{ color: c.text }}>{selected.title}</div>
            <div className="text-xs sh-body mt-0.5" style={{ color: c.textMuted }}>{selected.id} · {selected.type} · {selected.date}</div>
          </div>
          <span className="text-[10px] sh-mono px-2 py-0.5 rounded-full" style={{ background: c.primarySoft, color: c.primary }}>{selected.status}</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <StatCard c={c} icon={User} label="Party" value={selected.party} accentKey="primary" />
          <StatCard c={c} icon={ReceiptText} label="Project" value={selected.project || "—"} accentKey="accent" />
          <StatCard c={c} icon={Wallet} label="Amount" value={selected.amount != null ? fmtCr(selected.amount) : "—"} accentKey="success" />
        </div>
        <SectionCard c={c} title="Document Preview">
          <div className="rounded-lg p-6 flex flex-col gap-4" style={{ background: c.surfaceAlt, border: `1px solid ${c.border}` }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: c.accent }}><Building2 size={14} color="#0B141C" /></div>
                <div>
                  <div className="sh-display text-sm font-semibold" style={{ color: c.text }}>Stronghold Pakistan</div>
                  <div className="text-[10px] sh-mono" style={{ color: c.textFaint }}>POST-TENSIONING SPECIALISTS</div>
                </div>
              </div>
              <div className="text-right text-xs sh-body" style={{ color: c.textMuted }}>
                <div>{selected.type}</div>
                <div className="sh-mono mt-0.5">{selected.id}</div>
              </div>
            </div>
            <div className="h-px" style={{ background: c.border }} />
            <div className="grid grid-cols-2 gap-4 text-xs sh-body">
              <div>
                <div style={{ color: c.textFaint }}>To</div>
                <div className="mt-0.5 font-medium" style={{ color: c.text }}>{selected.party}</div>
                <div className="mt-1" style={{ color: c.textMuted }}>{selected.project}</div>
              </div>
              <div className="text-right">
                <div style={{ color: c.textFaint }}>Date</div>
                <div className="mt-0.5 sh-mono" style={{ color: c.text }}>{selected.date}</div>
              </div>
            </div>
            {selected.amount != null && (
              <div className="flex justify-end pt-2">
                <div className="text-right">
                  <div className="text-[10px] sh-mono" style={{ color: c.textFaint }}>AMOUNT</div>
                  <div className="text-xl sh-mono font-semibold" style={{ color: c.text }}>{fmtCr(selected.amount)}</div>
                </div>
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="sh-display text-lg font-semibold" style={{ color: c.text }}>Documents</div>
          <div className="text-xs sh-body mt-0.5" style={{ color: c.textMuted }}>{documents.length} records</div>
        </div>
        <button className="flex items-center gap-1.5 text-xs sh-body font-medium px-3 py-2 rounded-lg" style={{ background: c.primary, color: "#fff" }}>
          <Plus size={14} /> New Document
        </button>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 max-w-sm" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
          <Search size={13} style={{ color: c.textFaint }} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search documents…" className="bg-transparent outline-none text-xs flex-1 sh-body" style={{ color: c.text }} />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {types.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)} className="text-xs sh-body px-2.5 py-1.5 rounded-lg capitalize"
              style={{ background: typeFilter === t ? c.primarySoft : "transparent", color: typeFilter === t ? c.primary : c.textMuted, border: `1px solid ${typeFilter === t ? c.primarySoft : c.border}` }}>{t}</button>
          ))}
        </div>
      </div>
      <div className="rounded-xl overflow-hidden" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
        <table className="w-full text-xs sh-body">
          <thead>
            <tr style={{ background: c.surfaceAlt, borderBottom: `1px solid ${c.border}` }}>
              {["Document", "Type", "Party", "Date", "Amount", "Status", ""].map((h, i) => (
                <th key={i} className={`py-2.5 px-4 font-medium ${i === 4 ? "text-right" : "text-left"}`} style={{ color: c.textMuted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, i) => (
              <tr key={d.id} onClick={() => setSelected(d)} className="cursor-pointer" style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${c.border}` : "none" }}>
                <td className="py-3 px-4">
                  <div style={{ color: c.text, fontWeight: 500 }}>{d.title}</div>
                  <div className="text-[10.5px] mt-0.5" style={{ color: c.textFaint }}>{d.project}</div>
                </td>
                <td className="py-3 px-4" style={{ color: c.textMuted }}>{d.type}</td>
                <td className="py-3 px-4" style={{ color: c.textMuted }}>{d.party}</td>
                <td className="py-3 px-4 sh-mono" style={{ color: c.textMuted }}>{d.date}</td>
                <td className="py-3 px-4 text-right sh-mono" style={{ color: c.text }}>{d.amount != null ? fmtCr(d.amount) : "—"}</td>
                <td className="py-3 px-4"><span className="text-[10px] sh-mono px-2 py-0.5 rounded-full" style={{ background: c.primarySoft, color: c.primary }}>{d.status}</span></td>
                <td className="py-3 px-4 text-right"><ChevronRight size={14} style={{ color: c.textFaint }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reports module — numbers derived from live seed data
// ---------------------------------------------------------------------------
function ReportsModule({ c }) {
  const [period, setPeriod] = useState("ytd");
  const totalCredit = customers.reduce((s, p) => s + p.paidTotal + p.outstanding, 0) + vendors.reduce((s, p) => s + p.paidTotal + p.outstanding, 0);
  const totalDebit = customers.reduce((s, p) => s + p.paidTotal, 0) + vendors.reduce((s, p) => s + p.paidTotal, 0);
  const totalReceivables = customers.reduce((s, p) => s + p.outstanding, 0);
  const totalPayables = vendors.reduce((s, p) => s + p.outstanding, 0);
  const loanPrincipal = loans.reduce((s, l) => s + l.principal, 0);
  const loanRemaining = loans.reduce((s, l) => s + l.remaining, 0);
  const assetValue = assets.reduce((s, a) => s + a.value, 0);
  const loanByStatus = [
    { name: "Active", value: loans.filter(l => l.status === "Active").length, key: "primary" },
    { name: "Paid", value: loans.filter(l => l.status === "Paid").length, key: "success" },
    { name: "Overdue", value: loans.filter(l => l.status === "Overdue").length, key: "danger" },
    { name: "Pending", value: loans.filter(l => l.status === "Pending").length, key: "accent" },
  ];
  const topReceivables = [...customers].sort((a, b) => b.outstanding - a.outstanding).slice(0, 6).map(p => ({ name: p.name.length > 18 ? p.name.slice(0, 16) + "…" : p.name, amount: p.outstanding }));
  const topPayables = [...vendors].sort((a, b) => b.outstanding - a.outstanding).slice(0, 5).map(p => ({ name: p.name.length > 18 ? p.name.slice(0, 16) + "…" : p.name, amount: p.outstanding }));
  const pieColors = { primary: c.primary, success: c.success, danger: c.danger, accent: c.accent };
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="sh-display text-lg font-semibold" style={{ color: c.text }}>Reports</div>
          <div className="text-xs sh-body mt-0.5" style={{ color: c.textMuted }}>Derived from live module data · As of 8 August 2026</div>
        </div>
        <div className="flex items-center gap-1.5">
          {["ytd", "q2", "q3", "all"].map(p => (
            <button key={p} onClick={() => setPeriod(p)} className="text-xs sh-body px-2.5 py-1.5 rounded-lg uppercase"
              style={{ background: period === p ? c.primarySoft : "transparent", color: period === p ? c.primary : c.textMuted, border: `1px solid ${period === p ? c.primarySoft : c.border}` }}>{p}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <StatCard c={c} icon={TrendingUp} label="Total Credit Exposure" value={fmtCr(totalCredit)} accentKey="success" />
        <StatCard c={c} icon={TrendingDown} label="Total Debit / Paid" value={fmtCr(totalDebit)} accentKey="danger" />
        <StatCard c={c} icon={ArrowUpRight} label="Receivables" value={fmtCr(totalReceivables)} accentKey="accent" />
        <StatCard c={c} icon={ArrowDownRight} label="Payables" value={fmtCr(totalPayables)} accentKey="danger" />
        <StatCard c={c} icon={Landmark} label="Loan Principal" value={fmtCr(loanPrincipal)} accentKey="primary" />
        <StatCard c={c} icon={Wallet} label="Loan Remaining" value={fmtCr(loanRemaining)} accentKey="accent" />
        <StatCard c={c} icon={Boxes} label="Asset Book Value" value={fmtCr(assetValue)} accentKey="primary" />
        <StatCard c={c} icon={Users} label="Active Customers" value={customers.filter(x => x.status === "Active").length} accentKey="success" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <SectionCard c={c} title="Top Receivables" subtitle="Outstanding by customer, Rs (Cr)">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topReceivables} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={c.border} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: c.textMuted }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11, fill: c.text }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="amount" radius={[0, 4, 4, 0]} fill={c.primary} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>
        <SectionCard c={c} title="Loan Status Mix">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={loanByStatus} dataKey="value" nameKey="name" innerRadius={42} outerRadius={68} paddingAngle={3}>
                {loanByStatus.map((d, i) => <Cell key={i} fill={pieColors[d.key]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {loanByStatus.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs sh-body" style={{ color: c.textMuted }}>
                <CircleDot size={10} style={{ color: pieColors[d.key] }} />
                {d.name} <span className="sh-mono" style={{ color: c.text }}>({d.value})</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <SectionCard c={c} title="Top Payables" subtitle="Outstanding to vendors">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topPayables} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={c.border} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: c.textMuted }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11, fill: c.text }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]} fill={c.accent} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
        <SectionCard c={c} title="Credit vs Debit Trend">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyActivity}>
              <defs>
                <linearGradient id="rCredit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={c.primary} stopOpacity={0.35} /><stop offset="100%" stopColor={c.primary} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rDebit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={c.accent} stopOpacity={0.3} /><stop offset="100%" stopColor={c.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={c.border} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: c.textMuted }} axisLine={{ stroke: c.border }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: c.textMuted }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="credit" stroke={c.primary} fill="url(#rCredit)" strokeWidth={2} name="Credit" />
              <Area type="monotone" dataKey="debit" stroke={c.accent} fill="url(#rDebit)" strokeWidth={2} name="Debit" />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Settings module
// ---------------------------------------------------------------------------
function SettingsModule({ c, theme, setTheme }) {
  const [company, setCompany] = useState({
    name: "Stronghold Pakistan",
    tagline: "Post-Tensioning Specialists since 1985",
    city: "Karachi",
    phone: "+92 21 3456 7890",
    email: "info@strongholdpk.com",
    currency: "PKR (Crore)",
    fiscalYear: "July – June",
  });
  return (
    <div className="flex flex-col gap-5 max-w-3xl">
      <div>
        <div className="sh-display text-lg font-semibold" style={{ color: c.text }}>Settings</div>
        <div className="text-xs sh-body mt-0.5" style={{ color: c.textMuted }}>Company profile and demo preferences</div>
      </div>
      <SectionCard c={c} title="Appearance">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs sh-body font-medium" style={{ color: c.text }}>Theme</div>
            <div className="text-[10.5px] sh-body mt-0.5" style={{ color: c.textMuted }}>Light or dark surface</div>
          </div>
          <div className="flex gap-1.5">
            {["light", "dark"].map(t => (
              <button key={t} onClick={() => setTheme(t)} className="text-xs sh-body px-3 py-1.5 rounded-lg capitalize"
                style={{ background: theme === t ? c.primary : c.surfaceAlt, color: theme === t ? "#fff" : c.textMuted, border: `1px solid ${theme === t ? c.primary : c.border}` }}>
                {t === "light" ? "Light" : "Dark"}
              </button>
            ))}
          </div>
        </div>
      </SectionCard>
      <SectionCard c={c} title="Company Profile">
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: "name", label: "Company name" },
            { key: "tagline", label: "Tagline" },
            { key: "city", label: "City" },
            { key: "phone", label: "Phone" },
            { key: "email", label: "Email" },
            { key: "currency", label: "Display currency" },
            { key: "fiscalYear", label: "Fiscal year" },
          ].map(field => (
            <div key={field.key} className={field.key === "tagline" ? "col-span-2" : ""}>
              <div className="text-[10px] sh-mono mb-1" style={{ color: c.textFaint }}>{field.label.toUpperCase()}</div>
              <input value={company[field.key]} onChange={e => setCompany({ ...company, [field.key]: e.target.value })}
                className="w-full text-xs sh-body px-2.5 py-2 rounded-lg outline-none"
                style={{ background: c.surfaceAlt, border: `1px solid ${c.border}`, color: c.text }} />
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button className="text-xs sh-body font-medium px-3 py-2 rounded-lg" style={{ background: c.primary, color: "#fff" }}>Save changes</button>
        </div>
      </SectionCard>
      <SectionCard c={c} title="Demo Build" subtitle="Stronghold Business Suite">
        <div className="text-xs sh-body" style={{ color: c.textMuted }}>
          All 10 modules implemented · Seeded with Stronghold Pakistan project data
          <div className="sh-mono text-[10.5px] mt-1" style={{ color: c.textFaint }}>Frontend demo complete · Ready for Flask + Supabase wiring</div>
        </div>
      </SectionCard>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function StrongholdDemo() {
  const [theme, setTheme] = useState("light");
  const [active, setActive] = useState("dashboard");
  const c = palette[theme];

  const pieColors = useMemo(() => ({
    primary: c.primary, success: c.success, danger: c.danger, accent: c.accent,
  }), [c]);

  const activeNav = NAV.find(n => n.key === active);

  return (
    <div
      className="sh-body w-full min-h-[820px] flex overflow-hidden rounded-2xl"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
    >
      {fonts}

      {/* Sidebar */}
      <aside className="w-60 shrink-0 flex flex-col py-5" style={{ background: c.sidebarBg }}>
        <div className="flex items-center gap-2.5 px-5 mb-7">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
            style={{ background: c.accent }}
          >
            <Building2 size={16} color={c.sidebarBg} />
          </div>
          <div>
            <div className="sh-display text-[13.5px] font-semibold tracking-tight text-white leading-tight">Stronghold</div>
            <div className="text-[10px] sh-mono tracking-wide" style={{ color: c.sidebarText }}>BUSINESS SUITE</div>
          </div>
        </div>

        <nav className="flex-1 px-3 flex flex-col gap-0.5">
          {NAV.map(item => {
            const isActive = item.key === active;
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors"
                style={{
                  background: isActive ? c.sidebarActiveBg : "transparent",
                  color: isActive ? c.sidebarTextActive : c.sidebarText,
                }}
              >
                <Icon size={15} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.phase > 1 && (
                  <span
                    className="text-[9px] sh-mono px-1.5 py-0.5 rounded"
                    style={{ background: "rgba(255,255,255,0.06)", color: c.sidebarText }}
                  >
                    P{item.phase}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="px-5 pt-4 mt-2" style={{ borderTop: `1px solid rgba(255,255,255,0.06)` }}>
          <div className="text-[10px] sh-mono" style={{ color: c.sidebarText }}>DEMO BUILD — COMPLETE</div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header
          className="flex items-center justify-between px-6 py-3.5 shrink-0"
          style={{ borderBottom: `1px solid ${c.border}`, background: c.surface }}
        >
          <div className="flex items-center gap-2 text-sm sh-body" style={{ color: c.textMuted }}>
            <span>Stronghold Pakistan</span>
            <ChevronRight size={14} style={{ color: c.textFaint }} />
            <span style={{ color: c.text, fontWeight: 500 }}>{activeNav.label}</span>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg w-64"
              style={{ background: c.surfaceAlt, border: `1px solid ${c.border}` }}
            >
              <Search size={14} style={{ color: c.textFaint }} />
              <input
                placeholder="Search customers, vendors, transactions…"
                className="bg-transparent outline-none text-xs flex-1 sh-body"
                style={{ color: c.text }}
              />
            </div>
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center relative"
              style={{ background: c.surfaceAlt, border: `1px solid ${c.border}` }}
            >
              <Bell size={14} style={{ color: c.textMuted }} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: c.danger }} />
            </button>
            <button
              onClick={() => setTheme(t => (t === "light" ? "dark" : "light"))}
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: c.surfaceAlt, border: `1px solid ${c.border}` }}
            >
              {theme === "light" ? <Moon size={14} style={{ color: c.textMuted }} /> : <Sun size={14} style={{ color: c.textMuted }} />}
            </button>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs sh-mono font-semibold"
              style={{ background: c.primary, color: "#fff" }}
            >
              SR
            </div>
          </div>
        </header>

        {/* Body */}
        <main className="flex-1 overflow-auto p-6" style={{ background: c.bg }}>
          {active === "customers" ? (
            <PartyListModule c={c} kind="customer" data={customers} />
          ) : active === "vendors" ? (
            <PartyListModule c={c} kind="vendor" data={vendors} />
          ) : active === "transactions" ? (
            <TransactionsModule c={c} />
          ) : active === "loans" ? (
            <LoansModule c={c} />
          ) : active === "assets" ? (
            <AssetsModule c={c} />
          ) : active === "spreadsheet" ? (
            <SpreadsheetModule c={c} />
          ) : active === "documents" ? (
            <DocumentsModule c={c} />
          ) : active === "reports" ? (
            <ReportsModule c={c} />
          ) : active === "settings" ? (
            <SettingsModule c={c} theme={theme} setTheme={setTheme} />
          ) : (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="sh-display text-lg font-semibold" style={{ color: c.text }}>Financial Overview</div>
                  <div className="text-xs sh-body mt-0.5" style={{ color: c.textMuted }}>As of 8 August 2026</div>
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-4">
                <StatCard c={c} icon={Wallet} label="Total Assets" value={fmtCr(assets.reduce((s, a) => s + a.value, 0))} delta="4.2%" deltaDir="up" accentKey="primary" />
                <StatCard c={c} icon={TrendingUp} label="Total Credit" value={fmtCr(customers.reduce((s, p) => s + p.paidTotal + p.outstanding, 0) + vendors.reduce((s, p) => s + p.paidTotal + p.outstanding, 0))} delta="6.8%" deltaDir="up" accentKey="success" />
                <StatCard c={c} icon={TrendingDown} label="Total Debit" value={fmtCr(customers.reduce((s, p) => s + p.paidTotal, 0) + vendors.reduce((s, p) => s + p.paidTotal, 0))} delta="2.1%" deltaDir="down" accentKey="danger" />
                <StatCard c={c} icon={Landmark} label="Total Loans" value={fmtCr(loans.reduce((s, l) => s + l.principal, 0))} accentKey="accent" />
                <StatCard c={c} icon={ArrowUpRight} label="Outstanding Receivables" value={fmtCr(customers.reduce((s, p) => s + p.outstanding, 0))} accentKey="success" />
                <StatCard c={c} icon={ArrowDownRight} label="Outstanding Payables" value={fmtCr(vendors.reduce((s, p) => s + p.outstanding, 0))} accentKey="danger" />
              </div>

              {/* Charts row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <SectionCard c={c} title="Credit vs Debit" subtitle="Monthly activity, Rs (Cr)">
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={monthlyActivity}>
                        <defs>
                          <linearGradient id="creditGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={c.primary} stopOpacity={0.35} />
                            <stop offset="100%" stopColor={c.primary} stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="debitGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={c.accent} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={c.accent} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={c.border} vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: c.textMuted }} axisLine={{ stroke: c.border }} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: c.textMuted }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 8, fontSize: 12 }}
                        />
                        <Area type="monotone" dataKey="credit" stroke={c.primary} fill="url(#creditGrad)" strokeWidth={2} name="Credit" />
                        <Area type="monotone" dataKey="debit" stroke={c.accent} fill="url(#debitGrad)" strokeWidth={2} name="Debit" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </SectionCard>
                </div>

                <SectionCard c={c} title="Loan Distribution" subtitle="By status">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={loanDistribution}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={48}
                        outerRadius={72}
                        paddingAngle={3}
                      >
                        {loanDistribution.map((d, i) => (
                          <Cell key={i} fill={pieColors[d.key]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 8, fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {loanDistribution.map((d, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs sh-body" style={{ color: c.textMuted }}>
                        <CircleDot size={10} style={{ color: pieColors[d.key] }} />
                        {d.name} <span className="sh-mono" style={{ color: c.text }}>({d.value})</span>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </div>

              {/* Bottom row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <SectionCard c={c} title="Outstanding Balances" subtitle="Top receivables by customer, Rs (Cr)">
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={topOutstanding} layout="vertical" margin={{ left: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={c.border} horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 11, fill: c.textMuted }} axisLine={false} tickLine={false} />
                        <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11.5, fill: c.text }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 8, fontSize: 12 }} />
                        <Bar dataKey="amount" radius={[0, 4, 4, 0]} fill={c.primary} barSize={16} />
                      </BarChart>
                    </ResponsiveContainer>
                  </SectionCard>
                </div>

                <SectionCard c={c} title="Recent Activity" subtitle="Latest events across the business">
                  <div className="flex flex-col gap-3.5 max-h-[210px] overflow-auto pr-1">
                    {recentActivity.map((a, i) => {
                      const tone = {
                        credit: c.primary, debit: c.accent, success: c.success, vendor: c.textMuted,
                      }[a.type];
                      return (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: tone }} />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs sh-body leading-snug" style={{ color: c.text }}>{a.text}</div>
                            <div className="text-[10.5px] sh-mono mt-0.5" style={{ color: c.textFaint }}>{a.time}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </SectionCard>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
