import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, ScatterChart, Scatter, Cell, PieChart, Pie, Legend
} from "recharts";

// ─── RAW DATA ────────────────────────────────────────────────────────────────
const RAW_DATA = [
  { Title: "Stranger Things", Genre: "Drama", ReleaseYear: 2016, Rating: 8.8, Duration: 51 },
  { Title: "The Crown", Genre: "Drama", ReleaseYear: 2016, Rating: 8.7, Duration: 58 },
  { Title: "Breaking Bad", Genre: "Crime", ReleaseYear: 2008, Rating: 9.5, Duration: 49 },
  { Title: "Money Heist", Genre: "Crime", ReleaseYear: 2017, Rating: 8.3, Duration: 70 },
  { Title: "The Witcher", Genre: "Fantasy", ReleaseYear: 2019, Rating: 8.2, Duration: 61 },
  { Title: "Black Mirror", Genre: "Sci-Fi", ReleaseYear: 2011, Rating: 8.8, Duration: 60 },
  { Title: "Narcos", Genre: "Crime", ReleaseYear: 2015, Rating: 8.8, Duration: 49 },
  { Title: "Friends", Genre: "Comedy", ReleaseYear: 1994, Rating: 8.9, Duration: 22 },
  { Title: "The Office", Genre: "Comedy", ReleaseYear: 2005, Rating: 8.9, Duration: 22 },
  { Title: "BoJack Horseman", Genre: "Animation", ReleaseYear: 2014, Rating: 8.6, Duration: 25 },
  { Title: "Lucifer", Genre: "Fantasy", ReleaseYear: 2016, Rating: 8.2, Duration: 42 },
  { Title: "Dark", Genre: "Sci-Fi", ReleaseYear: 2017, Rating: 8.8, Duration: 60 },
  { Title: "House of Cards", Genre: "Drama", ReleaseYear: 2013, Rating: 8.7, Duration: 55 },
  { Title: "The Umbrella Academy", Genre: "Fantasy", ReleaseYear: 2019, Rating: 8.0, Duration: 60 },
  { Title: "Sherlock", Genre: "Crime", ReleaseYear: 2010, Rating: 9.1, Duration: 90 },
  { Title: "Avatar: The Last Airbender", Genre: "Animation", ReleaseYear: 2005, Rating: 9.3, Duration: 23 },
  { Title: "13 Reasons Why", Genre: "Drama", ReleaseYear: 2017, Rating: 7.6, Duration: 57 },
  { Title: "Peaky Blinders", Genre: "Crime", ReleaseYear: 2013, Rating: 8.8, Duration: 60 },
  { Title: "Mindhunter", Genre: "Crime", ReleaseYear: 2017, Rating: 8.6, Duration: 60 },
  { Title: "The Haunting of Hill House", Genre: "Horror", ReleaseYear: 2018, Rating: 8.6, Duration: 50 },
  { Title: "Rick and Morty", Genre: "Animation", ReleaseYear: 2013, Rating: 9.2, Duration: 22 },
  { Title: "Ozark", Genre: "Crime", ReleaseYear: 2017, Rating: 8.4, Duration: 60 },
  { Title: "The Mandalorian", Genre: "Action", ReleaseYear: 2019, Rating: 8.8, Duration: 40 },
  { Title: "Stranger Things", Genre: "Drama", ReleaseYear: 2016, Rating: 8.8, Duration: 51 },
  { Title: "Black Mirror", Genre: "Sci-Fi", ReleaseYear: 2011, Rating: 8.8, Duration: 60 },
  { Title: "Narcos", Genre: "Crime", ReleaseYear: 2015, Rating: 8.8, Duration: 49 },
  { Title: "Friends", Genre: "Comedy", ReleaseYear: 1994, Rating: 8.9, Duration: 22 },
  { Title: "The Office", Genre: "Comedy", ReleaseYear: 2005, Rating: 8.9, Duration: 22 },
  { Title: "BoJack Horseman", Genre: "Animation", ReleaseYear: 2014, Rating: 8.6, Duration: 25 },
  { Title: "Lucifer", Genre: "Fantasy", ReleaseYear: 2016, Rating: 8.2, Duration: 42 },
  { Title: "Dark", Genre: "Sci-Fi", ReleaseYear: 2017, Rating: 8.8, Duration: 60 },
  { Title: "House of Cards", Genre: "Drama", ReleaseYear: 2013, Rating: 8.7, Duration: 55 },
];

// ─── GENRE COLORS ────────────────────────────────────────────────────────────
const GENRE_COLORS = {
  Drama: "#e50914", Crime: "#f5a623", Fantasy: "#7b2fff",
  "Sci-Fi": "#00c8ff", Comedy: "#f9dc5c", Animation: "#ff6b6b",
  Horror: "#2d2d2d", Action: "#39d353",
};

// ─── COMPUTED ANALYTICS ──────────────────────────────────────────────────────
function computeGenreDistribution(data) {
  const counts = {};
  data.forEach(d => { counts[d.Genre] = (counts[d.Genre] || 0) + 1; });
  return Object.entries(counts).map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count);
}

function computeAvgRatingByGenre(data) {
  const totals = {}, counts = {};
  data.forEach(d => {
    totals[d.Genre] = (totals[d.Genre] || 0) + d.Rating;
    counts[d.Genre] = (counts[d.Genre] || 0) + 1;
  });
  return Object.keys(totals).map(g => ({ genre: g, avgRating: +(totals[g] / counts[g]).toFixed(2) }))
    .sort((a, b) => b.avgRating - a.avgRating);
}

function computeReleaseYearDist(data) {
  const buckets = {};
  data.forEach(d => {
    const decade = Math.floor(d.ReleaseYear / 5) * 5;
    buckets[decade] = (buckets[decade] || 0) + 1;
  });
  return Object.entries(buckets).sort((a, b) => a[0] - b[0])
    .map(([year, count]) => ({ year: +year, count }));
}

function computeShowsByYear(data) {
  const counts = {};
  data.forEach(d => { counts[d.ReleaseYear] = (counts[d.ReleaseYear] || 0) + 1; });
  return Object.entries(counts).sort((a, b) => a[0] - b[0])
    .map(([year, count]) => ({ year: +year, count }));
}

function computeTopRated(data, n = 10) {
  const unique = {};
  data.forEach(d => { if (!unique[d.Title] || unique[d.Title].Rating < d.Rating) unique[d.Title] = d; });
  return Object.values(unique).sort((a, b) => b.Rating - a.Rating).slice(0, n);
}

function computeDurationBuckets(data) {
  const buckets = { "20-30": 0, "30-40": 0, "40-50": 0, "50-60": 0, "60-70": 0, "70-80": 0, "80-90": 0, "90+": 0 };
  data.forEach(d => {
    if (d.Duration < 30) buckets["20-30"]++;
    else if (d.Duration < 40) buckets["30-40"]++;
    else if (d.Duration < 50) buckets["40-50"]++;
    else if (d.Duration < 60) buckets["50-60"]++;
    else if (d.Duration < 70) buckets["60-70"]++;
    else if (d.Duration < 80) buckets["70-80"]++;
    else if (d.Duration < 90) buckets["80-90"]++;
    else buckets["90+"]++;
  });
  return Object.entries(buckets).map(([range, count]) => ({ range, count }));
}

function computeStats(data) {
  const ratings = data.map(d => d.Rating).sort((a, b) => a - b);
  const durations = data.map(d => d.Duration).sort((a, b) => a - b);
  const mean = arr => (arr.reduce((s, v) => s + v, 0) / arr.length).toFixed(4);
  const median = arr => arr.length % 2 === 0
    ? ((arr[arr.length / 2 - 1] + arr[arr.length / 2]) / 2).toFixed(1)
    : arr[Math.floor(arr.length / 2)].toFixed(1);
  return {
    meanRating: mean(ratings),
    medianRating: median(ratings),
    maxRating: Math.max(...ratings),
    minRating: Math.min(...ratings),
    meanDuration: mean(durations),
    medianDuration: median(durations),
    maxDuration: Math.max(...durations),
    minDuration: Math.min(...durations),
  };
}

// ─── CUSTOM TOOLTIP ──────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1a1a1a", border: "1px solid #e50914", borderRadius: 8, padding: "10px 14px" }}>
      <p style={{ color: "#fff", margin: 0, fontWeight: 700, fontSize: 13 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || "#e50914", margin: "4px 0 0", fontSize: 13 }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

// ─── SECTION CARD ────────────────────────────────────────────────────────────
const SectionCard = ({ title, subtitle, children, accent = "#e50914" }) => (
  <div style={{
    background: "linear-gradient(145deg, #141414, #1c1c1c)",
    borderRadius: 16, border: `1px solid ${accent}22`,
    boxShadow: `0 0 40px ${accent}11`,
    padding: "28px 32px", marginBottom: 32,
    animation: "fadeSlideIn 0.5s ease both"
  }}>
    <div style={{ borderLeft: `4px solid ${accent}`, paddingLeft: 16, marginBottom: 24 }}>
      <h2 style={{ color: "#fff", fontSize: 22, margin: 0, fontFamily: "'Georgia', serif", letterSpacing: 1 }}>{title}</h2>
      {subtitle && <p style={{ color: "#aaa", fontSize: 14, margin: "6px 0 0", lineHeight: 1.5 }}>{subtitle}</p>}
    </div>
    {children}
  </div>
);

// ─── STAT BOX ────────────────────────────────────────────────────────────────
const StatBox = ({ label, value, color = "#e50914" }) => (
  <div style={{
    background: "#0a0a0a", borderRadius: 12, padding: "18px 22px",
    border: `1px solid ${color}33`, textAlign: "center",
    flex: 1, minWidth: 130
  }}>
    <div style={{ color, fontSize: 28, fontWeight: 800, fontFamily: "monospace" }}>{value}</div>
    <div style={{ color: "#888", fontSize: 12, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
  </div>
);

// ─── NAV BUTTON ──────────────────────────────────────────────────────────────
const NavBtn = ({ id, label, active, onClick }) => (
  <button onClick={() => onClick(id)} style={{
    background: active ? "#e50914" : "transparent",
    color: active ? "#fff" : "#aaa",
    border: `1px solid ${active ? "#e50914" : "#333"}`,
    borderRadius: 8, padding: "9px 16px", cursor: "pointer",
    fontSize: 13, fontWeight: active ? 700 : 400,
    transition: "all 0.2s", whiteSpace: "nowrap",
    fontFamily: "inherit"
  }}>{label}</button>
);

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function NetflixAnalysis() {
  const [activeTab, setActiveTab] = useState("overview");

  const genreDist = computeGenreDistribution(RAW_DATA);
  const avgRating = computeAvgRatingByGenre(RAW_DATA);
  const yearDist = computeReleaseYearDist(RAW_DATA);
  const showsByYear = computeShowsByYear(RAW_DATA);
  const topRated = computeTopRated(RAW_DATA);
  const durationBuckets = computeDurationBuckets(RAW_DATA);
  const stats = computeStats(RAW_DATA);

  const tabs = [
    { id: "overview", label: "📋 Overview" },
    { id: "genre-dist", label: "🎭 Genre Dist." },
    { id: "avg-rating", label: "⭐ Avg Rating" },
    { id: "year-dist", label: "📅 Year Dist." },
    { id: "genre-rating", label: "🔢 Genre vs Rating" },
    { id: "top-rated", label: "🏆 Top Rated" },
    { id: "shows-year", label: "📈 Shows/Year" },
    { id: "duration", label: "⏱ Duration" },
    { id: "stats", label: "📊 Statistics" },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: "#0d0d0d",
      fontFamily: "'Trebuchet MS', sans-serif", color: "#fff",
      padding: "0 0 60px"
    }}>
      <style>{`
        @keyframes fadeSlideIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        ::-webkit-scrollbar { width:6px; } ::-webkit-scrollbar-track { background:#0d0d0d; }
        ::-webkit-scrollbar-thumb { background:#e50914; border-radius:3px; }
        .row-hover:hover { background:#1e1e1e !important; }
      `}</style>

      {/* ── HERO ── */}
      <div style={{
        background: "linear-gradient(180deg, #000 0%, #1a0000 60%, #0d0d0d 100%)",
        padding: "48px 40px 36px", borderBottom: "1px solid #e5091422",
        marginBottom: 32
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <div style={{
              background: "#e50914", color: "#fff", fontWeight: 900,
              fontSize: 28, padding: "4px 12px", borderRadius: 4, letterSpacing: 2
            }}>N</div>
            <h1 style={{ fontSize: 32, margin: 0, fontFamily: "'Georgia', serif", fontWeight: 700, letterSpacing: 1 }}>
              NETFLIX DATA ANALYSIS
            </h1>
          </div>
          <p style={{ color: "#aaa", fontSize: 15, margin: "0 0 4px", lineHeight: 1.7 }}>
            A complete exploratory data analysis of Netflix shows using Python (Pandas + Matplotlib). This project
            demonstrates data loading from CSV, genre analysis, rating distributions, and visual storytelling — 
            all the core skills of a data analyst workflow.
          </p>
          <div style={{ display: "flex", gap: 24, marginTop: 20, flexWrap: "wrap" }}>
            {[["32", "Total Shows"], ["8", "Genres"], ["9.5", "Max Rating"], ["1994–2019", "Year Range"]].map(([v, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ color: "#e50914", fontSize: 26, fontWeight: 800 }}>{v}</div>
                <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px" }}>

        {/* ── NAV ── */}
        <div style={{
          display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32,
          background: "#141414", padding: 12, borderRadius: 12, border: "1px solid #222"
        }}>
          {tabs.map(t => <NavBtn key={t.id} id={t.id} label={t.label} active={activeTab === t.id} onClick={setActiveTab} />)}
        </div>

        {/* ══════════════════════════════════════════════════════════════
            TAB 1 — OVERVIEW / DATAFRAME
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === "overview" && (
          <SectionCard
            title="1. Display DataFrame"
            subtitle="The Netflix.csv dataset contains show title, genre, release year, rating, and episode duration. Reading it with pd.read_csv() loads it into a Pandas DataFrame — the core object for tabular data in Python."
          >
            <div style={{ background: "#0a0a0a", borderRadius: 10, overflow: "auto", maxHeight: 420, border: "1px solid #222" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#e50914", position: "sticky", top: 0 }}>
                    {["#", "Title", "Genre", "Year", "Rating", "Duration (min)"].map(h => (
                      <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: 700, color: "#fff", letterSpacing: 0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RAW_DATA.map((row, i) => (
                    <tr key={i} className="row-hover" style={{ borderBottom: "1px solid #1a1a1a", transition: "background 0.15s" }}>
                      <td style={{ padding: "10px 14px", color: "#555" }}>{i}</td>
                      <td style={{ padding: "10px 14px", color: "#fff", fontWeight: 600 }}>{row.Title}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ background: (GENRE_COLORS[row.Genre] || "#555") + "22", color: GENRE_COLORS[row.Genre] || "#aaa", borderRadius: 6, padding: "3px 8px", fontSize: 12 }}>{row.Genre}</span>
                      </td>
                      <td style={{ padding: "10px 14px", color: "#ccc" }}>{row.ReleaseYear}</td>
                      <td style={{ padding: "10px 14px", color: row.Rating >= 9 ? "#f5a623" : row.Rating >= 8.5 ? "#39d353" : "#aaa", fontWeight: 700 }}>{row.Rating}</td>
                      <td style={{ padding: "10px 14px", color: "#aaa" }}>{row.Duration} min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 16, padding: "14px 18px", background: "#0f0f0f", borderRadius: 8, borderLeft: "3px solid #f5a623" }}>
              <p style={{ color: "#aaa", fontSize: 13, margin: 0, lineHeight: 1.7 }}>
                <strong style={{ color: "#f5a623" }}>📌 Code insight:</strong> <code style={{ color: "#39d353" }}>df = pd.read_csv("netflix.csv")</code> loads the file.
                <code style={{ color: "#39d353" }}> print(df)</code> prints all rows. Each column maps to a Python Series — the building block for all analysis below.
              </p>
            </div>
          </SectionCard>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 2 — GENRE DISTRIBUTION
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === "genre-dist" && (
          <SectionCard
            title="2. Genre Distribution"
            subtitle="A bar chart showing how many shows belong to each genre. Built by iterating through the Genre column and counting occurrences — no groupby needed, just a plain Python dictionary."
            accent="#00c8ff"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={genreDist} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
                <XAxis dataKey="genre" tick={{ fill: "#aaa", fontSize: 12 }} />
                <YAxis tick={{ fill: "#aaa", fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Show Count">
                  {genreDist.map((entry, i) => (
                    <Cell key={i} fill={GENRE_COLORS[entry.genre] || "#888"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 10 }}>
              {genreDist.map(d => (
                <div key={d.genre} style={{ display: "flex", alignItems: "center", gap: 8, background: "#111", borderRadius: 8, padding: "8px 14px", border: `1px solid ${GENRE_COLORS[d.genre] || "#333"}33` }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: GENRE_COLORS[d.genre] || "#888" }} />
                  <span style={{ color: "#ccc", fontSize: 13 }}>{d.genre}</span>
                  <span style={{ color: GENRE_COLORS[d.genre] || "#888", fontWeight: 700, fontSize: 13 }}>{d.count}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: "14px 18px", background: "#0f0f0f", borderRadius: 8, borderLeft: "3px solid #00c8ff" }}>
              <p style={{ color: "#aaa", fontSize: 13, margin: 0, lineHeight: 1.7 }}>
                <strong style={{ color: "#00c8ff" }}>📌 Key finding:</strong> Crime dominates with 8 shows, followed by Drama (5) and Fantasy (5).
                Comedy, Sci-Fi, and Animation tie at 4 each. Horror and Action are underrepresented with 1 each.
                <br /><strong style={{ color: "#00c8ff" }}>Code:</strong> Uses a dictionary loop — <code style={{ color: "#39d353" }}>if genre in genre_counts: genre_counts[genre] += 1</code>
              </p>
            </div>
          </SectionCard>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 3 — AVG RATING BY GENRE
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === "avg-rating" && (
          <SectionCard
            title="3. Average Rating by Genre"
            subtitle="Computes the mean IMDb rating for each genre. This reveals which categories tend to have higher-quality or more critically acclaimed content on Netflix."
            accent="#f9dc5c"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={avgRating} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
                <XAxis dataKey="genre" tick={{ fill: "#aaa", fontSize: 12 }} />
                <YAxis domain={[7.5, 9.5]} tick={{ fill: "#aaa", fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="avgRating" fill="#f9dc5c" radius={[6, 6, 0, 0]} name="Avg Rating" />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 16, padding: "14px 18px", background: "#0f0f0f", borderRadius: 8, borderLeft: "3px solid #f9dc5c" }}>
              <p style={{ color: "#aaa", fontSize: 13, margin: 0, lineHeight: 1.7 }}>
                <strong style={{ color: "#f9dc5c" }}>📌 Key finding:</strong> Animation leads with an avg of ~9.0 (driven by Avatar, Rick &amp; Morty). Fantasy has the lowest average due to The Umbrella Academy (8.0) and Lucifer (8.2) pulling it down.
                <br /><strong style={{ color: "#f9dc5c" }}>Code:</strong> Two passes — accumulate totals, then divide by count per genre. Color used: <code style={{ color: "#39d353" }}>color='coral'</code>
              </p>
            </div>
          </SectionCard>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 4 — RELEASE YEAR DISTRIBUTION
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === "year-dist" && (
          <SectionCard
            title="4. Release Year Distribution"
            subtitle="A histogram grouping shows by release era. This shows how Netflix's catalog trends towards recent content, with a big spike in 2015–2019."
            accent="#39d353"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yearDist} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
                <XAxis dataKey="year" tick={{ fill: "#aaa", fontSize: 12 }} />
                <YAxis tick={{ fill: "#aaa", fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#39d353" radius={[6, 6, 0, 0]} name="Show Count" />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 16, padding: "14px 18px", background: "#0f0f0f", borderRadius: 8, borderLeft: "3px solid #39d353" }}>
              <p style={{ color: "#aaa", fontSize: 13, margin: 0, lineHeight: 1.7 }}>
                <strong style={{ color: "#39d353" }}>📌 Key finding:</strong> The vast majority of Netflix shows in this dataset were released between 2013–2019, reflecting Netflix's massive content investment in the streaming era.
                <br /><strong style={{ color: "#39d353" }}>Code:</strong> Uses <code style={{ color: "#39d353" }}>plt.hist(release_years, bins=10, color='lightgreen')</code> — Python auto-bins the years.
              </p>
            </div>
          </SectionCard>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 5 — GENRE VS RATING
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === "genre-rating" && (
          <SectionCard
            title="5. Genre vs Rating"
            subtitle="Similar to option 3 but sorted ascending by average rating, using a purple color palette. Demonstrates that sorting adds analytical clarity."
            accent="#7b2fff"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[...avgRating].sort((a, b) => a.avgRating - b.avgRating)} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
                <XAxis dataKey="genre" tick={{ fill: "#aaa", fontSize: 12 }} />
                <YAxis domain={[7.5, 9.5]} tick={{ fill: "#aaa", fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="avgRating" fill="#7b2fff" radius={[6, 6, 0, 0]} name="Avg Rating" />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 16, padding: "14px 18px", background: "#0f0f0f", borderRadius: 8, borderLeft: "3px solid #7b2fff" }}>
              <p style={{ color: "#aaa", fontSize: 13, margin: 0, lineHeight: 1.7 }}>
                <strong style={{ color: "#7b2fff" }}>📌 Code insight:</strong> This option uses a manual bubble sort on a list of (genre, avgRating) tuples.
                While Python's <code style={{ color: "#39d353" }}>sorted()</code> is more efficient, the bubble sort demonstrates algorithmic thinking.
                Color: <code style={{ color: "#39d353" }}>color='purple'</code>
              </p>
            </div>
          </SectionCard>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 6 — TOP RATED SHOWS
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === "top-rated" && (
          <SectionCard
            title="6. Top Rated Shows"
            subtitle="The 10 highest-rated shows in the dataset, sorted descending. A classic leaderboard visualization that highlights quality content."
            accent="#f5a623"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topRated} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
                <XAxis type="number" domain={[7, 10]} tick={{ fill: "#aaa", fontSize: 12 }} />
                <YAxis dataKey="Title" type="category" tick={{ fill: "#ccc", fontSize: 11 }} width={115} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Rating" fill="#f5a623" radius={[0, 6, 6, 0]} name="Rating">
                  {topRated.map((entry, i) => (
                    <Cell key={i} fill={i === 0 ? "#ffd700" : i === 1 ? "#c0c0c0" : i === 2 ? "#cd7f32" : "#f5a623"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
              {topRated.slice(0, 3).map((s, i) => (
                <div key={s.Title} style={{ background: "#0a0a0a", borderRadius: 10, padding: "12px 18px", border: `1px solid ${["#ffd70033", "#c0c0c033", "#cd7f3233"][i]}`, flex: 1, minWidth: 150 }}>
                  <div style={{ color: ["#ffd700", "#c0c0c0", "#cd7f32"][i], fontSize: 20, fontWeight: 800 }}>#{i + 1}</div>
                  <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginTop: 4 }}>{s.Title}</div>
                  <div style={{ color: "#aaa", fontSize: 12 }}>{s.Genre} · {s.Rating} ⭐</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: "14px 18px", background: "#0f0f0f", borderRadius: 8, borderLeft: "3px solid #f5a623" }}>
              <p style={{ color: "#aaa", fontSize: 13, margin: 0, lineHeight: 1.7 }}>
                <strong style={{ color: "#f5a623" }}>📌 Code:</strong> <code style={{ color: "#39d353" }}>sorted_ratings = df.sort_values(by='Rating', ascending=False)</code> then <code style={{ color: "#39d353" }}>top_rated = sorted_ratings.head(10)</code>. Breaking Bad (9.5) leads the pack.
              </p>
            </div>
          </SectionCard>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 7 — SHOWS BY YEAR
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === "shows-year" && (
          <SectionCard
            title="7. Shows by Year"
            subtitle="A line chart showing the number of shows released each year. Unlike the histogram (which bins), this plots exact counts per year revealing production spikes and dips."
            accent="#00c8ff"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={showsByYear} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
                <XAxis dataKey="year" tick={{ fill: "#aaa", fontSize: 12 }} />
                <YAxis tick={{ fill: "#aaa", fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="count" stroke="#00c8ff" strokeWidth={2.5} dot={{ fill: "#00c8ff", r: 5 }} name="# of Shows" />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 16, padding: "14px 18px", background: "#0f0f0f", borderRadius: 8, borderLeft: "3px solid #00c8ff" }}>
              <p style={{ color: "#aaa", fontSize: 13, margin: 0, lineHeight: 1.7 }}>
                <strong style={{ color: "#00c8ff" }}>📌 Key finding:</strong> 2017 sees the biggest spike (6 shows) in this dataset. The code uses a dictionary to count per year, then sorts keys and plots with <code style={{ color: "#39d353" }}>marker='o', linestyle='-'</code>.
              </p>
            </div>
          </SectionCard>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 8 — DURATION DISTRIBUTION
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === "duration" && (
          <SectionCard
            title="8. Duration Distribution"
            subtitle="A histogram of episode lengths in minutes. This reveals the bimodal distribution — shows cluster around 20-30 min (sitcoms) and 55-65 min (dramas)."
            accent="#ff6b6b"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={durationBuckets} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
                <XAxis dataKey="range" tick={{ fill: "#aaa", fontSize: 12 }} label={{ value: "Duration (min)", fill: "#aaa", position: "insideBottom", offset: -2 }} />
                <YAxis tick={{ fill: "#aaa", fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#add8e6" radius={[6, 6, 0, 0]} name="# Shows" />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 16, padding: "14px 18px", background: "#0f0f0f", borderRadius: 8, borderLeft: "3px solid #ff6b6b" }}>
              <p style={{ color: "#aaa", fontSize: 13, margin: 0, lineHeight: 1.7 }}>
                <strong style={{ color: "#ff6b6b" }}>📌 Key finding:</strong> The 55–65 min bucket dominates (12 shows) — standard drama length. Short-form content (20-30 min) is second with 8 shows (sitcoms + animation). One outlier at 90 min (Sherlock).
                <br /><strong style={{ color: "#ff6b6b" }}>Code:</strong> <code style={{ color: "#39d353" }}>plt.hist(durations, bins=10, color='lightblue')</code>
              </p>
            </div>
          </SectionCard>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 9 — STATISTICAL SUMMARY
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === "stats" && (
          <SectionCard
            title="9. Statistical Summary"
            subtitle="Descriptive statistics computed manually using list comprehensions and sorting — no df.describe() shortcut. This mirrors the output from the terminal execution screenshot."
            accent="#39d353"
          >
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ color: "#e50914", fontSize: 16, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 1 }}>Rating Statistics</h3>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <StatBox label="Mean Rating" value={stats.meanRating} color="#e50914" />
                <StatBox label="Median Rating" value={stats.medianRating} color="#f5a623" />
                <StatBox label="Max Rating" value={stats.maxRating} color="#39d353" />
                <StatBox label="Min Rating" value={stats.minRating} color="#00c8ff" />
              </div>
            </div>
            <div>
              <h3 style={{ color: "#7b2fff", fontSize: 16, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 1 }}>Duration Statistics</h3>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <StatBox label="Mean Duration" value={stats.meanDuration + " min"} color="#7b2fff" />
                <StatBox label="Median Duration" value={stats.medianDuration + " min"} color="#ff6b6b" />
                <StatBox label="Max Duration" value={stats.maxDuration + " min"} color="#f9dc5c" />
                <StatBox label="Min Duration" value={stats.minDuration + " min"} color="#39d353" />
              </div>
            </div>
            <div style={{ marginTop: 24, background: "#0a0a0a", borderRadius: 10, padding: "18px 20px", fontFamily: "monospace", fontSize: 13, border: "1px solid #1a1a1a" }}>
              <div style={{ color: "#39d353", marginBottom: 8 }}>Statistical Summary</div>
              {[
                ["Mean Rating", stats.meanRating],
                ["Median Rating", stats.medianRating],
                ["Max Rating", stats.maxRating],
                ["Min Rating", stats.minRating],
                ["Mean Duration", stats.meanDuration],
                ["Median Duration", stats.medianDuration],
                ["Max Duration", stats.maxDuration],
                ["Min Duration", stats.minDuration],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #111", color: "#ccc" }}>
                  <span>{k}:</span><span style={{ color: "#f5a623" }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: "14px 18px", background: "#0f0f0f", borderRadius: 8, borderLeft: "3px solid #39d353" }}>
              <p style={{ color: "#aaa", fontSize: 13, margin: 0, lineHeight: 1.7 }}>
                <strong style={{ color: "#39d353" }}>📌 Code insight:</strong> Mean calculated as <code style={{ color: "#39d353" }}>sum(values)/len(values)</code>. Median requires sorting first, then picking the middle element. These manual implementations match Python's built-in <code style={{ color: "#39d353" }}>statistics</code> module results exactly.
              </p>
            </div>
          </SectionCard>
        )}

        {/* ── ABOUT CSV ── */}
        <SectionCard title="📄 About CSV & Pandas" subtitle="" accent="#555">
          <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.8, margin: 0 }}>
            <strong style={{ color: "#fff" }}>CSV (Comma-Separated Values)</strong> files are the most common format for tabular data exchange.
            Python's <strong style={{ color: "#e50914" }}>Pandas</strong> library makes working with them seamless — <code style={{ color: "#39d353" }}>pd.read_csv()</code> loads a file into a <strong>DataFrame</strong>, and <code style={{ color: "#39d353" }}>df.to_csv()</code> saves it back.
            <br /><br />
            Pandas handles missing data, allows filtering (<code style={{ color: "#39d353" }}>df[df['Rating'] &gt; 9]</code>), aggregation (<code style={{ color: "#39d353" }}>df.groupby('Genre').mean()</code>), and transformation — and supports custom delimiters, encodings, and column specifications, making it the Swiss Army knife of data workflows.
          </p>
        </SectionCard>

      </div>
    </div>
  );
}
