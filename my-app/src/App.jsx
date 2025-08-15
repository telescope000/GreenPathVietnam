import React, { useMemo, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Search, Plane, Hotel, ShoppingBag, Utensils, Leaf, Thermometer, Sun, MapPin, Star, ChevronRight, ChevronLeft, Home as HomeIcon, ShoppingCart, Settings as SettingsIcon, User, CheckCircle, Info, MessageCircle, Calendar, Heart, Share2 } from "lucide-react";

/**
 * Green Path Vietnam – Demo SPA
 * Single-file React component with Tailwind CSS + Recharts + Lucide icons.
 * All data is mocked locally to make the app fully interactive for a presentation.
 */

// ---------- Mock Data ----------
const DESTINATION = "Ho Chi Minh City, Vietnam";

const transports = [
  {
    id: "t1",
    title: "Plane to HCM — Cebu Pacific",
    time: "6 AM – 8:30 AM (2.5 hrs)",
    price: 219, // USD two-way (approx)
    emission: 115, // kg CO2 / ride
    delta: -7.8,
    type: "plane",
  },
  {
    id: "t2",
    title: "Plane to Manila — Vietnam Airlines",
    time: "8 AM – 10:30 AM (2.5 hrs)",
    price: 178,
    emission: 125,
    delta: -11.7,
    type: "plane",
  },
  {
    id: "t3",
    title: "E‑Van Rental — VINFAST",
    time: "Daily rental",
    price: 100,
    emission: 132,
    delta: -5,
    type: "van",
  },
];

const hotels = [
  {
    id: "h1",
    name: "New World Saigon Hotel",
    price: 150, // USD / night
    emission: 40, // kg CO2 / night
    delta: -25.92,
    img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "h2",
    name: "Grand Hyatt Saigon",
    price: 180,
    emission: 56,
    delta: +3.7,
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
  },
];

const shops = [
  { id: "s1", name: "Vietnamese Coffee – Ben Thanh", hours: "10 AM – 8 PM", emissionDaily: 8.0, delta: -20 },
  { id: "s2", name: "Walking Street – Vietnam Brands", hours: "10 AM – 8 PM", emissionDaily: 7.0, delta: -30 },
];

const restaurants = [
  { id: "r1", name: "Best Pho Viet Nam", hours: "6 PM – 10 PM", emissionPerDish: 7.2, delta: -10 },
  { id: "r2", name: "Local Eatery", hours: "11 AM – 9 PM", emissionPerDish: 8.2, delta: +2.5 },
];

const climateProjection = Array.from({ length: 11 }).map((_, i) => {
  const year = 2025 + i;
  return {
    year,
    businessAsUsual: 145 + i * 5 + (i > 4 ? 10 : 0),
    withGPV: 150 - i * 2 - (i > 5 ? 4 : 0),
  };
});

const posts = [
  {
    id: "p1",
    author: "Chris Cortez",
    time: "2h",
    title: "5 reasons why we must visit Can Gio Reserve",
    text:
      "UNESCO biosphere reserve with mangrove forests, wetlands, and abundant wildlife. Perfect for responsible eco‑tourism.",
    img: "https://images.unsplash.com/photo-1589556183130-530470785fab?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop",
  },
  {
    id: "p2",
    author: "Charan Irawi",
    time: "4h",
    title: "The Importance of Mangrove Trees",
    text:
      "Coastal protectors that reduce erosion, shield shorelines, and capture carbon dioxide. Let’s conserve them.",
    img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
  },
];

const challenges = [
  { id: "c1", title: "No‑Waste Hike Challenge", dates: ["MAR 8", "MAR 29"], reward: 1000 },
  { id: "c2", title: "River Clean‑Up Challenge", dates: ["MAR 3", "MAR 10", "MAR 24", "MAR 17"], reward: 500 },
  { id: "c3", title: "Urban Cultural Tours", dates: ["MAR 4", "MAR 25", "MAR 11", "MAR 18"], reward: 50 },
];

const reviews = [
  {
    id: "rv1",
    author: "App Developer",
    date: "Jan 17, 2024, 8:00 AM",
    text:
      "Bring an eco‑bag to reduce plastic. Walk when possible to save energy. Support local industries preserving ecosystems & culture.",
  },
  {
    id: "rv2",
    author: "Tourist",
    date: "Jan 10, 2024, 8:00 AM",
    text:
      "Super recommend! Clean and diverse. Supporting SDGs while celebrating a medley of cultures.",
  },
];

// ---------- Helpers ----------
const currency = (n) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD`;

function StatPill({ label, value, sub }) {
  return (
    <div className="rounded-2xl bg-lime-100 px-4 py-3 text-center shadow-sm">
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm text-gray-700">{label}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </div>
  );
}

function Card({ children, className = "" }) {
  return <div className={`rounded-3xl bg-white shadow-sm p-4 ${className}`}>{children}</div>;
}

function SectionTitle({ left, right }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-extrabold tracking-tight">{left}</h3>
      {right}
    </div>
  );
}

// ---------- Main App ----------
export default function GreenPathVietnamApp() {
  const [tab, setTab] = useState("home");
  const [query, setQuery] = useState(DESTINATION);

  // selections
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState({ r1: false, r2: false, s1: false, s2: false });

  const [xp, setXp] = useState(950);

  const totalCO2 = useMemo(() => {
    let total = 0;
    if (selectedTransport) total += selectedTransport.emission;
    if (selectedHotel) total += selectedHotel.emission;
    if (selectedActivities.r1) total += restaurants[0].emissionPerDish;
    if (selectedActivities.r2) total += restaurants[1].emissionPerDish;
    if (selectedActivities.s1) total += shops[0].emissionDaily;
    if (selectedActivities.s2) total += shops[1].emissionDaily;
    return Math.round(total);
  }, [selectedTransport, selectedHotel, selectedActivities]);

  const totalPrice = useMemo(() => {
    let total = 0;
    if (selectedTransport) total += selectedTransport.price;
    if (selectedHotel) total += selectedHotel.price;
    // Assume each selected activity costs a small fixed fee
    if (selectedActivities.r1) total += 12;
    if (selectedActivities.r2) total += 15;
    if (selectedActivities.s1) total += 10;
    if (selectedActivities.s2) total += 8;
    return Math.round(total);
  }, [selectedTransport, selectedHotel, selectedActivities]);

  const reductionPct = useMemo(() => {
    if (!selectedTransport && !selectedHotel && !selectedActivities.r1 && !selectedActivities.r2 && !selectedActivities.s1 && !selectedActivities.s2) return 0;
    // very rough illustrative calculation
    const baseline = 390; // hypothetical baseline kg CO2 for a typical short trip
    return Math.max(-100, Math.round(((totalCO2 - baseline) / baseline) * 100));
  }, [totalCO2]);

  const carbonCredits = Math.max(0, Math.round((Math.max(0, -reductionPct) * 30) / 10)); // playful formula

  const addChallengeXP = (amount) => {
    setXp((x) => Math.min(1200, x + amount));
  };

  // ---------- Renderers ----------
  const TopBar = (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <Leaf className="h-8 w-8 text-emerald-600" />
        <div className="font-bold text-emerald-700">Green Path Vietnam</div>
      </div>
      <div className="text-sm font-semibold">Total Carbon Footprint: {totalCO2} kg CO₂</div>
    </div>
  );

  const SearchBar = (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-full border border-gray-200 bg-white pl-12 pr-4 py-3 text-sm shadow-inner focus:outline-none"
        placeholder="Search destination"
      />
    </div>
  );

  const CategoryCard = ({ title, icon, children, className = "" }) => (
    <Card className={`min-h-[180px] ${className}`}>
      <SectionTitle left={
        <div className="flex items-center gap-2">{icon}{" "}<span className="font-extrabold">{title}</span></div>
      } right={<button className="text-emerald-700 text-sm hover:underline flex items-center">More<ChevronRight className="h-4 w-4"/></button>} />
      <div className="space-y-3">{children}</div>
    </Card>
  );

  const OptionRow = ({ checked, onToggle, primary, secondary, chip }) => (
    <button onClick={onToggle} className={`w-full text-left rounded-2xl p-3 transition border ${checked ? "border-emerald-400 bg-emerald-50" : "border-transparent hover:bg-gray-50"}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">{primary}</div>
          <div className="text-xs text-gray-600">{secondary}</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold">{chip}</div>
          {checked ? (
            <div className="flex items-center justify-end gap-1 text-emerald-600 text-xs"><CheckCircle className="h-4 w-4"/> Selected</div>
          ) : (
            <div className="text-xs text-gray-500">Tap to select</div>
          )}
        </div>
      </div>
    </button>
  );

  // Home Screen
  const HomeScreen = (
    <div className="space-y-4">
      {TopBar}
      {SearchBar}

      <div className="grid md:grid-cols-2 gap-4">
        <CategoryCard title="Transport" icon={<Plane className="h-5 w-5 text-sky-600"/>}>
          {transports.slice(0, 2).map((t) => (
            <OptionRow key={t.id}
              checked={selectedTransport?.id === t.id}
              onToggle={() => setSelectedTransport(selectedTransport?.id === t.id ? null : t)}
              primary={`${t.title}`}
              secondary={`${t.time} • ${currency(t.price)} • ${t.delta}% avg. emissions`}
              chip={`${t.emission} kg CO₂ / ride`}
            />
          ))}
          <div className="text-xs text-gray-500">Selecting an option updates your footprint.</div>
        </CategoryCard>

        <CategoryCard title="Hotels" icon={<Hotel className="h-5 w-5 text-teal-600"/>}>
          {hotels.map((h) => (
            <div key={h.id} className="flex gap-3 items-center">
              <img src={h.img} alt={h.name} className="h-16 w-24 object-cover rounded-xl"/>
              <OptionRow
                checked={selectedHotel?.id === h.id}
                onToggle={() => setSelectedHotel(selectedHotel?.id === h.id ? null : h)}
                primary={<span className="underline decoration-emerald-200 underline-offset-4">{h.name}</span>}
                secondary={`${currency(h.price)} / night • ${h.delta}% avg. emissions`}
                chip={`${h.emission} kg CO₂ / night`}
              />
            </div>
          ))}
        </CategoryCard>

        <CategoryCard title="Souvenir Shops" icon={<ShoppingBag className="h-5 w-5 text-emerald-700"/>} className="md:col-span-1">
          {shops.map((s) => (
            <OptionRow key={s.id}
              checked={selectedActivities[s.id]}
              onToggle={() => setSelectedActivities((prev) => ({ ...prev, [s.id]: !prev[s.id] }))}
              primary={s.name}
              secondary={`${s.hours} • ${s.delta}% avg. emissions`}
              chip={`${s.emissionDaily} kg CO₂ / daily`}
            />
          ))}
        </CategoryCard>

        <CategoryCard title="Restaurants" icon={<Utensils className="h-5 w-5 text-orange-600"/>} className="md:col-span-1">
          {restaurants.map((r) => (
            <OptionRow key={r.id}
              checked={selectedActivities[r.id]}
              onToggle={() => setSelectedActivities((prev) => ({ ...prev, [r.id]: !prev[r.id] }))}
              primary={<span className="font-semibold">{r.name}</span>}
              secondary={`${r.hours} • ${r.delta}% avg. emissions`}
              chip={`${r.emissionPerDish} kg CO₂ / dish`}
            />
          ))}
        </CategoryCard>
      </div>

      {/* Climate chart + quick stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <div className="text-sm text-gray-600 mb-2">Data populated from Intergovernmental Panel of Climate Change (illustrative)</div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={climateProjection} margin={{ left: 4, right: 12, top: 10, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="businessAsUsual" name="Business as Usual" stroke="#ef4444" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="withGPV" name="With GPV" stroke="#10b981" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <div className="grid gap-4">
          <Card>
            <div className="flex items-center gap-2 text-sm"><Sun className="h-4 w-4"/> Ave High: 32° C</div>
            <div className="flex items-center gap-2 text-sm mt-1"><Thermometer className="h-4 w-4"/> Ave Low: 24° C</div>
          </Card>
          <Card>
            <div className="text-sm">Expected T kg/CO₂ by 2035: <span className="font-bold text-red-600">190</span></div>
            <div className="text-sm">Kg/CO₂ by 2035 with GPV: <span className="font-bold text-emerald-600">130 (32% loss)</span></div>
          </Card>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <StatPill value="85%" label="flora & fauna species conserved" />
        <StatPill value="75%" label="preservation projects fulfilled" />
        <StatPill value="30%" label="tourism waste reduced" sub="(by weight)" />
      </div>

      <div className="flex justify-end">
        <button onClick={() => setTab("purchase")} className="rounded-full bg-emerald-600 text-white px-6 py-3 font-semibold shadow hover:bg-emerald-700 transition">
          Plan Your Package
        </button>
      </div>
    </div>
  );

  // Purchase Screen
  const PurchaseScreen = (
    <div className="space-y-4">
      {TopBar}
      <div className="max-w-3xl mx-auto">
        <div className="text-3xl font-extrabold tracking-tight">PACKAGE</div>
        <Card className="mt-2">
          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-emerald-700 font-semibold">{carbonCredits} carbon credits earned</div>
            <div className="rounded-2xl bg-gray-100 px-4 py-2 font-semibold">{currency(totalPrice)}</div>
            <div className={`rounded-2xl px-4 py-2 font-semibold ${reductionPct <= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>{reductionPct}% CO₂</div>
          </div>
        </Card>

        <div className="grid gap-3 mt-3">
          <Card>
            <SectionTitle left={<span className="text-emerald-700">Flight</span>} />
            <div className="text-sm text-gray-700">{selectedTransport ? selectedTransport.title : "No flight selected"}</div>
            <div className="flex justify-between text-sm mt-1">
              <div>{selectedTransport ? selectedTransport.time : ""}</div>
              <div className="font-semibold">{selectedTransport ? `${selectedTransport.emission} kg CO₂ / ride` : ""}</div>
            </div>
          </Card>
          <Card>
            <SectionTitle left={<span className="text-emerald-700">Transport</span>} />
            <div className="text-sm text-gray-700">E‑Van Rental — VINFAST</div>
            <div className="flex justify-between text-sm mt-1">
              <div>$100 USD / day</div>
              <div className="font-semibold">132 kg CO₂ / ride</div>
            </div>
          </Card>
          <Card>
            <SectionTitle left={<span className="text-emerald-700">Hotel</span>} />
            <div className="text-sm text-gray-700">{selectedHotel ? selectedHotel.name : "No hotel selected"}</div>
            <div className="flex justify-between text-sm mt-1">
              <div>{selectedHotel ? `${currency(selectedHotel.price)} / day (meals included?)` : ""}</div>
              <div className="font-semibold">{selectedHotel ? `${selectedHotel.emission} kg CO₂ / day` : ""}</div>
            </div>
          </Card>
          <Card>
            <SectionTitle left={<span className="text-emerald-700">Tourist Activities</span>} />
            <div className="text-sm">War Remnants Museum — <span className="text-gray-600">No emissions observed</span></div>
            <div className="text-sm">Book Street — <span className="text-gray-600">No emissions observed</span></div>
            <div className="text-sm">Ben Thanh — <span className="text-gray-600">No emissions observed</span></div>
          </Card>

          <div className="mt-4">
            <div className="text-2xl font-extrabold mb-2">REVIEWS</div>
            <div className="grid md:grid-cols-2 gap-3">
              {reviews.map((rv) => (
                <Card key={rv.id}>
                  <div className="flex items-center gap-2 text-sm font-semibold"><User className="h-4 w-4"/> {rv.author} <span className="text-gray-500 font-normal">— {rv.date}</span></div>
                  <div className="mt-2 text-sm leading-relaxed">{rv.text}</div>
                  <div className="mt-3 flex items-center gap-4 text-gray-500">
                    <div className="flex items-center gap-1"><Heart className="h-4 w-4"/> 24</div>
                    <div className="flex items-center gap-1"><MessageCircle className="h-4 w-4"/> 3</div>
                    <div className="flex items-center gap-1"><Share2 className="h-4 w-4"/> Share</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button onClick={() => setTab("home")} className="rounded-full bg-gray-100 px-5 py-3 font-semibold flex items-center gap-2"><ChevronLeft className="h-4 w-4"/> Back</button>
          <button className="rounded-full bg-emerald-600 text-white px-6 py-3 font-semibold shadow hover:bg-emerald-700 transition flex items-center gap-2"><ShoppingCart className="h-4 w-4"/> Purchase</button>
        </div>
      </div>
    </div>
  );

  // Go Green Screen
  const GoGreenScreen = (
    <div className="space-y-4">
      {TopBar}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Card>
            <div className="flex items-center gap-2"><User className="h-5 w-5 text-gray-600"/><input className="w-full bg-transparent outline-none" placeholder="Post something…"/></div>
            <div className="mt-2 flex gap-3 text-gray-500">
              <button className="text-sm flex items-center gap-1"><ImageIcon/> Photo</button>
              <button className="text-sm flex items-center gap-1"><MessageCircle className="h-4 w-4"/> Text</button>
              <button className="text-sm flex items-center gap-1"><VideoIcon/> Video</button>
            </div>
          </Card>

          {posts.map((p) => (
            <Card key={p.id}>
              <div className="flex items-center justify-between">
                <div className="font-semibold">{p.author}</div>
                <div className="text-xs text-gray-500">{p.time} ago</div>
              </div>
              <div className="mt-1 text-sm font-semibold">{p.title}</div>
              <div className="mt-1 text-sm text-gray-700">{p.text}</div>
              <img src={p.img} alt="post" className="mt-3 h-44 w-full object-cover rounded-2xl"/>
              <div className="mt-3 flex items-center gap-4 text-gray-500">
                <button className="flex items-center gap-1"><Heart className="h-4 w-4"/> Like</button>
                <button className="flex items-center gap-1"><MessageCircle className="h-4 w-4"/> Comment</button>
                <button className="flex items-center gap-1"><Share2 className="h-4 w-4"/> Share</button>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-3">
          <Card>
            <SectionTitle left={<div className="flex items-center gap-2"><Calendar className="h-4 w-4"/> Upcoming Challenges</div>} />
            <div className="space-y-3">
              {challenges.map((c) => (
                <div key={c.id} className="rounded-2xl bg-gray-50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{c.title}</div>
                    <div className="text-sm">Reward: {c.reward} XP</div>
                  </div>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {c.dates.map((d, idx) => (
                      <div key={idx} className="rounded-xl bg-white px-3 py-2 text-sm shadow">{d}</div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <button onClick={() => addChallengeXP(c.reward)} className="rounded-full bg-emerald-600 text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-700">Join & Earn</button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle left={<div className="flex items-center gap-2"><Star className="h-4 w-4"/> Progress</div>} />
            <div className="text-sm">XP: {xp}</div>
            <div className="w-full h-3 bg-gray-100 rounded-full mt-2">
              <div className="h-3 rounded-full bg-emerald-500" style={{ width: `${Math.min(100, (xp / 1000) * 100)}%` }} />
            </div>
            <div className="text-xs text-gray-600 mt-1">{Math.max(0, 1000 - xp)} XP left to get 10 carbon credits & be promoted to Eco‑Warrior Rank</div>
          </Card>
        </div>
      </div>
    </div>
  );

  const SettingsScreen = (
    <div className="space-y-4">
      {TopBar}
      <Card>
        <SectionTitle left={<div className="flex items-center gap-2"><SettingsIcon className="h-5 w-5"/> General</div>} />
        <div className="space-y-3 text-sm">
          <ToggleRow label="Dark Mode (presentation)" />
          <ToggleRow label="Use metric units" defaultChecked />
          <ToggleRow label="Show eco‑tips popups" defaultChecked />
        </div>
      </Card>
      <Card>
        <SectionTitle left={<div className="flex items-center gap-2"><Info className="h-5 w-5"/> About</div>} />
        <div className="text-sm text-gray-700 leading-relaxed">
          Green Path Vietnam helps travelers plan low‑carbon itineraries, track their footprint, and support local eco‑friendly businesses. This demo is for presentation purposes.
        </div>
      </Card>
    </div>
  );

  const AccountScreen = (
    <div className="space-y-4">
      {TopBar}
      <Card>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <User className="h-8 w-8 text-emerald-700"/>
          </div>
          <div>
            <div className="font-bold text-lg">Eco Traveler</div>
            <div className="text-sm text-gray-600">{DESTINATION}</div>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <StatPill value={`${carbonCredits}`} label="carbon credits" />
          <StatPill value={`${totalCO2} kg`} label="trip footprint" />
          <StatPill value={`${xp}`} label="XP" sub="Eco‑Warrior in progress" />
        </div>
      </Card>
      <Card>
        <SectionTitle left={<div className="flex items-center gap-2"><MapPin className="h-5 w-5"/> Recent Searches</div>} />
        <div className="flex gap-2 flex-wrap">
          {["Ho Chi Minh", "Ha Long Bay", "Can Gio Reserve", "Da Nang"].map((t) => (
            <div key={t} className="rounded-xl bg-gray-100 px-3 py-2 text-sm">{t}</div>
          ))}
        </div>
      </Card>
    </div>
  );

  // ---------- Shell ----------
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white text-gray-900">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-6">
        {tab === "home" && HomeScreen}
        {tab === "purchase" && PurchaseScreen}
        {tab === "gogreen" && GoGreenScreen}
        {tab === "settings" && SettingsScreen}
        {tab === "account" && AccountScreen}
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-gray-200">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-5 gap-2 py-2">
            <NavButton active={tab === "home"} onClick={() => setTab("home")} icon={<HomeIcon className="h-5 w-5"/>} label="Home" />
            <NavButton active={tab === "purchase"} onClick={() => setTab("purchase")} icon={<ShoppingCart className="h-5 w-5"/>} label="Purchase" />
            <NavButton active={tab === "gogreen"} onClick={() => setTab("gogreen")} icon={<Leaf className="h-5 w-5"/>} label="Go Green" />
            <NavButton active={tab === "settings"} onClick={() => setTab("settings")} icon={<SettingsIcon className="h-5 w-5"/>} label="Settings" />
            <NavButton active={tab === "account"} onClick={() => setTab("account")} icon={<User className="h-5 w-5"/>} label="Account" />
          </div>
        </div>
      </nav>
    </div> 
  );
}

// ---------- Small Components ----------
function NavButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-2xl py-2 transition ${
        active ? "text-emerald-700 bg-emerald-50" : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      {icon}
      <div className="text-xs font-semibold">{label}</div>
    </button>
  );
}

function ToggleRow({ label, defaultChecked }) {
  const [on, setOn] = useState(!!defaultChecked);
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-100 px-3 py-2">
      <div className="text-sm">{label}</div>
      <button
        onClick={() => setOn((v) => !v)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${on ? "bg-emerald-500" : "bg-gray-300"}`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${on ? "translate-x-5" : "translate-x-1"}`}
        />
      </button>
    </div>
  );
}

// Simple inline icons for photo/video to avoid extra imports
function ImageIcon(){return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>}
function VideoIcon(){return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="15" height="10" rx="2" ry="2"></rect><polygon points="23 7 16 12 23 17 23 7"></polygon></svg>}
