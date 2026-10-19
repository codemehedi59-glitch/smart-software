import React, { useEffect, useMemo, useState } from "react";

import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Stethoscope,
  FlaskConical,
  TicketCheck,
  MessageSquare,
  BarChart3,
  Settings,
  Search,
  RefreshCw,
  Plus,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  Download,
  ChevronRight,
  Headphones,
  MapPin,
  HeartPulse,
  Bell,
  UserPlus,
  CalendarClock,
  FileText,
  Activity,
  Trash2,
  Menu,
  X,
} from "lucide-react";

import doctors from "./doctors.js";

const CENTER_HOTLINE = "01722605942";

/* =========================================================
   DEFAULT DATA
========================================================= */

const base = {
  appointments: [],
  testBookings: [],
  patients: [],
  activity: [],
  settings: {
    centerName: "Smart Diagnostic Center",
    apiUrl: "https://smart-diagnostic-center.netlify.app",
    adminToken: "",
  },
};

const nav = [
  ["Dashboard", LayoutDashboard],
  ["Appointments", CalendarDays],
  ["Patients", Users],
  ["Doctors", Stethoscope],
  ["Test Bookings", FlaskConical],
  ["Serial Management", TicketCheck],
  ["Calendar", CalendarClock],
  ["Reports", BarChart3],
  ["Messages", MessageSquare],
  ["Settings", Settings],
];

const statusList = [
  "WAITING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
  "NO SHOW",
];

/* =========================================================
   LOCAL STORE
========================================================= */

const store = {
  async get() {
    if (window.desktopStore) {
      return await window.desktopStore.get();
    }

    return JSON.parse(localStorage.getItem("sdc-reception") || "null");
  },

  async set(value) {
    if (window.desktopStore) {
      return window.desktopStore.set(value);
    }

    localStorage.setItem("sdc-reception", JSON.stringify(value));

    return value;
  },
};

/* =========================================================
   HELPERS
========================================================= */

function isValidTime(value) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(String(value || ""));
}

function hasSerial(value) {
  return (
    value !== null &&
    value !== undefined &&
    String(value).trim() !== "" &&
    Number(value) > 0
  );
}

function normalizeStatus({ type, status, serial, time }) {
  let current = String(status || "WAITING").toUpperCase();

  if (current === "NEW") {
    current = "WAITING";
  }

  if (type !== "doctor") {
    return current;
  }

  const finalStates = ["COMPLETED", "CANCELLED", "NO SHOW"];

  if (finalStates.includes(current)) {
    return current;
  }

  const serialReady = hasSerial(serial);
  const timeReady = time && time !== "Pending" && isValidTime(time);

  /*
   * Doctor appointment cannot be CONFIRMED
   * until Serial + Reporting Time are available.
   */
  if (!serialReady || !timeReady) {
    return "WAITING";
  }

  if (current === "WAITING" || current === "NEW") {
    return "CONFIRMED";
  }

  return current;
}

function normalize(x = {}) {
  const type = x.appointmentType || x.type || "doctor";

  const reportingTime = x.reportingTime || x.time || "Pending";

  const serial = x.serial ?? "";

  const status = normalizeStatus({
    type,
    status: x.status,
    serial,
    time: reportingTime,
  });

  return {
    id: x.id || x.bookingId || "",

    patientName: x.patientName || "",

    phone: x.phone || x.mobile || "",

    email: x.email || "",

    date: x.date || "",

    time: reportingTime || "Pending",

    reportingTime: reportingTime || "Pending",

    type,

    doctor: x.doctor?.name || x.doctorName || x.doctor || "",

    test: x.diagnosticService?.testName || x.test || "",

    serial,

    status,

    receptionNote: x.receptionNote || x.note || "",

    source: x.source || "website",
  };
}

function formatSmsDate(value) {
  if (!value) return "";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatSmsTime(value) {
  if (!value || value === "Pending" || !isValidTime(value)) {
    return "Pending";
  }

  const [hour, minute] = value.split(":").map(Number);
  const date = new Date();

  date.setHours(hour, minute, 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function buildSmsMessage(row) {
  const patientName = row.patientName || "Patient";
  const dateText = formatSmsDate(row.date);

  if (row.type === "test") {
    return [
      "Smart Diagnostic Center",
      "",
      `Dear ${patientName},`,
      "Your diagnostic service request has been received.",
      "",
      row.test ? `Test/Service: ${row.test}` : "",
      dateText ? `Date: ${dateText}` : "",
      "",
      `Hotline: ${CENTER_HOTLINE}`,
    ]
      .filter((line) => line !== "")
      .join("\n");
  }

  const confirmed =
    hasSerial(row.serial) &&
    row.time &&
    row.time !== "Pending" &&
    isValidTime(row.time) &&
    row.status === "CONFIRMED";

  if (!confirmed) {
    return [
      "Smart Diagnostic Center",
      "",
      `Dear ${patientName},`,
      "Your appointment request has been received.",
      "",
      row.doctor ? `Doctor: ${row.doctor}` : "",
      dateText ? `Date: ${dateText}` : "",
      "",
      "Reception will confirm your serial number and reporting time.",
      "",
      `Hotline: ${CENTER_HOTLINE}`,
    ]
      .filter((line) => line !== "")
      .join("\n");
  }

  return [
    "Smart Diagnostic Center",
    "",
    `Dear ${patientName},`,
    "Your appointment is confirmed.",
    "",
    row.doctor ? `Doctor: ${row.doctor}` : "",
    dateText ? `Date: ${dateText}` : "",
    `Serial: ${row.serial}`,
    `Reporting Time: ${formatSmsTime(row.time)}`,
    "",
    "Please arrive 15 minutes early.",
    `Hotline: ${CENTER_HOTLINE}`,
  ]
    .filter((line) => line !== "")
    .join("\n");
}

async function copyTextToClipboard(value) {
  const text = String(value || "");

  if (!text) return false;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the legacy copy method below.
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";

    document.body.appendChild(textarea);
    textarea.select();

    const copied = document.execCommand("copy");

    document.body.removeChild(textarea);

    return copied;
  } catch {
    return false;
  }
}

/* =========================================================
   MAIN APP
========================================================= */

function App() {
  const [page, setPage] = useState("Dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [data, setData] = useState(base);

  const [q, setQ] = useState("");

  const [ready, setReady] = useState(false);

  const [modal, setModal] = useState(false);

  const [serialModal, setSerialModal] = useState(null);

  const [smsModal, setSmsModal] = useState(null);

  const [syncState, setSyncState] = useState("idle");

  const [lastSync, setLastSync] = useState("");

  /* =======================================================
     LOAD LOCAL DATA
  ======================================================= */

  useEffect(() => {
    let mounted = true;
    const startedAt = Date.now();

    async function loadLocalData() {
      try {
        const saved = await store.get();

        if (
          mounted &&
          saved &&
          (saved.appointments?.length ||
            saved.testBookings?.length ||
            saved.settings?.apiUrl)
        ) {
          setData({
            ...base,
            ...saved,
            settings: {
              ...base.settings,
              ...(saved.settings || {}),
            },
          });
        }
      } catch (error) {
        console.error("Could not load saved reception data:", error);
      } finally {
        const elapsed = Date.now() - startedAt;
        const remaining = Math.max(0, 650 - elapsed);
        window.setTimeout(() => {
          if (mounted) setReady(true);
        }, remaining);
      }
    }

    loadLocalData();
    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     AUTO SAVE LOCAL
  ======================================================= */

  useEffect(() => {
    if (ready) {
      store.set(data);
    }
  }, [data, ready]);

  /* =======================================================
     DATE
  ======================================================= */

  const now = new Date();

  const today =
    `${now.getFullYear()}-` +
    `${String(now.getMonth() + 1).padStart(2, "0")}-` +
    `${String(now.getDate()).padStart(2, "0")}`;

  const headerDate = now.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const headerTime = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  /* =======================================================
     DATA COLLECTION
  ======================================================= */

  const all = [...data.appointments, ...data.testBookings];

  const todayRows = all.filter((x) => x.date === today);

  const searchText = q.trim().toLowerCase();

  const filtered = all.filter((x) =>
    [x.patientName, x.phone, x.doctor, x.test, x.serial, x.id]
      .join(" ")
      .toLowerCase()
      .includes(searchText),
  );

  /* =======================================================
     TODAY DOCTOR COUNTS
  ======================================================= */

  const doctorCounts = useMemo(() => {
    const counts = data.appointments
      .filter((x) => x.date === today && x.status !== "CANCELLED")
      .reduce((acc, x) => {
        const doctor = x.doctor || "Unknown Doctor";

        acc[doctor] = (acc[doctor] || 0) + 1;

        return acc;
      }, {});

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [data.appointments, today]);

  /* =======================================================
     WEBSITE UPDATE
     Keep working admin-bookings endpoint
  ======================================================= */

  async function patchRemote(id, patch, type = "doctor") {
    const key = type === "test" ? "testBookings" : "appointments";

    const baseUrl = (data.settings.apiUrl || "").replace(/\/+$/, "");

    const token = data.settings.adminToken || "";

    if (!baseUrl || !token) {
      throw new Error("Settings এ Website URL এবং Reception API Token দিন।");
    }

    const response = await fetch(
      `${baseUrl}/.netlify/functions/admin-bookings`,
      {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          id,
          ...patch,
        }),
      },
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        result.error || result.message || `HTTP ${response.status}`,
      );
    }

    const row = normalize(
      result.booking || {
        id,
        ...patch,
      },
    );

    setData((current) => ({
      ...current,

      [key]: current[key].map((item) =>
        item.id === id
          ? {
              ...item,
              ...row,
            }
          : item,
      ),
    }));

    return row;
  }

  /* =======================================================
     DELETE ONE BOOKING
  ======================================================= */

  async function deleteBooking(row) {
    const confirmed = window.confirm(
      `Delete this booking permanently?\n\n` +
        `Patient: ${row.patientName || "Unknown"}\n` +
        `Booking ID: ${row.id}\n\n` +
        `This cannot be undone.`,
    );

    if (!confirmed) return;

    if (String(row.id || "").startsWith("LOCAL-")) {
      setData((current) => ({
        ...current,
        appointments: current.appointments.filter((x) => x.id !== row.id),
        testBookings: current.testBookings.filter((x) => x.id !== row.id),
      }));

      alert("Local booking deleted.");
      return;
    }

    const baseUrl = (data.settings.apiUrl || "").replace(/\/+$/, "");
    const token = data.settings.adminToken || "";

    if (!baseUrl || !token) {
      alert("Settings এ Website URL এবং Reception API Token দিন।");
      return;
    }

    try {
      const response = await fetch(
        `${baseUrl}/.netlify/functions/admin-bookings`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: row.id }),
        },
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.error || result.message || `HTTP ${response.status}`,
        );
      }

      setData((current) => ({
        ...current,
        appointments: current.appointments.filter((x) => x.id !== row.id),
        testBookings: current.testBookings.filter((x) => x.id !== row.id),
      }));

      await sync(false);
      alert("Booking deleted successfully.");
    } catch (error) {
      alert("Delete failed: " + error.message);
    }
  }

  /* =======================================================
     CLEAR ALL BOOKING DATA
  ======================================================= */

  async function clearAllBookings() {
    const typed = window.prompt(
      "WARNING: This will permanently delete ALL website appointments and test bookings.\n\n" +
        "Type CLEAR ALL to continue:",
    );

    if (typed !== "CLEAR ALL") {
      if (typed !== null) {
        alert("Cancelled. You must type CLEAR ALL exactly.");
      }
      return;
    }

    const finalCheck = window.confirm(
      "FINAL CONFIRMATION\n\n" +
        "Delete ALL appointments and test bookings permanently?\n\n" +
        "This cannot be undone.",
    );

    if (!finalCheck) return;

    const baseUrl = (data.settings.apiUrl || "").replace(/\/+$/, "");
    const token = data.settings.adminToken || "";

    if (!baseUrl || !token) {
      alert("Settings এ Website URL এবং Reception API Token দিন।");
      return;
    }

    try {
      const response = await fetch(
        `${baseUrl}/.netlify/functions/admin-bookings`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            action: "clear-all",
            confirmation: "CLEAR ALL",
          }),
        },
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.error || result.message || `HTTP ${response.status}`,
        );
      }

      setData((current) => ({
        ...current,
        appointments: [],
        testBookings: [],
        patients: [],
        activity: [],
      }));

      await sync(false);

      alert(
        `All booking data cleared successfully.\nDeleted: ${result.deleted ?? 0}`,
      );
    } catch (error) {
      alert("Clear All failed: " + error.message);
    }
  }

  /* =======================================================
     STATUS CHANGE
  ======================================================= */

  async function status(id, value, type) {
    const key = type === "test" ? "testBookings" : "appointments";

    const before = data[key].find((x) => x.id === id);

    if (!before) return;

    /*
     * Prevent CONFIRMED without
     * Serial + Reporting Time.
     */
    if (type === "doctor" && value === "CONFIRMED") {
      const readySerial = hasSerial(before.serial);

      const readyTime =
        before.time && before.time !== "Pending" && isValidTime(before.time);

      if (!readySerial || !readyTime) {
        alert(
          "আগে Serial / Time দিন। Serial এবং Reporting Time ছাড়া appointment Confirm করা যাবে না।",
        );

        return;
      }
    }

    setData((current) => ({
      ...current,

      [key]: current[key].map((x) =>
        x.id === id
          ? {
              ...x,
              status: value,
            }
          : x,
      ),
    }));

    try {
      await patchRemote(
        id,
        {
          status: value,
        },
        type,
      );
    } catch (error) {
      setData((current) => ({
        ...current,

        [key]: current[key].map((x) => (x.id === id ? before : x)),
      }));

      alert("Website update failed: " + error.message);
    }
  }

  /* =======================================================
     OPEN SERIAL MODAL
  ======================================================= */

  function assignSerial(row) {
    setSerialModal(row);
  }

  function openSms(row) {
    setSmsModal(row);
  }

  /* =======================================================
     SAVE SERIAL + TIME
  ======================================================= */

  async function saveSerialTime(row, serial, reportingTime) {
    const serialNumber = Number(serial);

    if (!Number.isInteger(serialNumber) || serialNumber < 1) {
      throw new Error("Serial number 1 বা তার বেশি পূর্ণ সংখ্যা হতে হবে।");
    }

    if (!isValidTime(reportingTime)) {
      throw new Error("Reporting Time HH:MM format হতে হবে। যেমন 15:30");
    }

    const updated = await patchRemote(
      row.id,
      {
        serial: serialNumber,

        reportingTime,

        time: reportingTime,

        status: "CONFIRMED",
      },
      row.type,
    );

    /*
     * Pull fresh website data
     * immediately after confirm.
     */
    await sync(false);

    return updated;
  }

  /* =======================================================
     WEBSITE SYNC
  ======================================================= */

  async function sync(showMessage = false) {
    const baseUrl = (data.settings.apiUrl || "").replace(/\/+$/, "");

    const token = data.settings.adminToken || "";

    if (!baseUrl || !token) {
      if (showMessage) {
        alert("Settings এ Website URL এবং Reception API Token দিন।");
      }

      return false;
    }

    setSyncState("syncing");

    try {
      const response = await fetch(
        `${baseUrl}/.netlify/functions/admin-bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,

            Accept: "application/json",
          },
        },
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.error || result.message || `HTTP ${response.status}`,
        );
      }

      const rows = Array.isArray(result.bookings) ? result.bookings : [];

      const normalized = rows.map(normalize);

      const uniquePatients = [
        ...new Map(
          normalized
            .filter((x) => x.phone)
            .map((x) => [
              x.phone,
              {
                name: x.patientName,

                phone: x.phone,

                email: x.email,
              },
            ]),
        ).values(),
      ];

      setData((current) => ({
        ...current,

        appointments: normalized.filter((x) => x.type === "doctor"),

        testBookings: normalized.filter((x) => x.type === "test"),

        patients: uniquePatients,
      }));

      setSyncState("online");

      setLastSync(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",

          minute: "2-digit",
        }),
      );

      if (showMessage) {
        alert(`Live sync complete. ${rows.length} booking পাওয়া গেছে।`);
      }

      return true;
    } catch (error) {
      console.error("Live sync failed:", error);

      setSyncState("error");

      if (showMessage) {
        alert("Sync failed: " + error.message);
      }

      return false;
    }
  }

  /* =======================================================
     AUTO SYNC EVERY 30 SECONDS
  ======================================================= */

  useEffect(() => {
    if (!ready || !data.settings.apiUrl || !data.settings.adminToken) {
      return;
    }

    sync(false);

    const timer = setInterval(() => sync(false), 30000);

    return () => clearInterval(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, data.settings.apiUrl, data.settings.adminToken]);

  /* =======================================================
     UI
  ======================================================= */

  return (
    <>
      <style>{`
        .sdc-startup-overlay { position: fixed; inset: 0; z-index: 99999; display: grid; place-items: center; padding: 24px; background: linear-gradient(145deg, #f5faf9 0%, #eaf5f2 100%); animation: sdcFadeIn 180ms ease-out; }
        .sdc-startup-card { width: min(290px, 88vw); padding: 28px 22px 24px; display: flex; flex-direction: column; align-items: center; gap: 13px; border: 1px solid rgba(11, 143, 121, .13); border-radius: 26px; background: rgba(255,255,255,.96); box-shadow: 0 22px 65px rgba(13,75,67,.13); text-align: center; }
        .sdc-startup-ring { width: 76px; height: 76px; border-radius: 50%; display: grid; place-items: center; border: 4px solid #dcefe9; border-top-color: #0b8f79; animation: sdcSpin 850ms linear infinite; }
        .sdc-startup-core { width: 54px; height: 54px; border-radius: 50%; display: grid; place-items: center; color: #0b8f79; background: #edf8f5; }
        .sdc-startup-title { margin: 2px 0 0; color: #153b39; font-size: 17px; font-weight: 800; letter-spacing: -.25px; }
        .sdc-startup-caption { margin: 0; color: #718381; font-size: 12px; }
        .sdc-startup-dots { display: flex; gap: 5px; margin-top: 1px; }
        .sdc-startup-dots span { width: 5px; height: 5px; border-radius: 50%; background: #0b8f79; animation: sdcDot 900ms ease-in-out infinite; }
        .sdc-startup-dots span:nth-child(2) { animation-delay: 140ms; }
        .sdc-startup-dots span:nth-child(3) { animation-delay: 280ms; }
        @keyframes sdcSpin { to { transform: rotate(360deg); } }
        @keyframes sdcDot { 0%, 60%, 100% { opacity: .35; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-3px); } }
        @keyframes sdcFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .sdc-startup-ring, .sdc-startup-dots span { animation: none; } }
      `}</style>
      {!ready && (
        <div className="sdc-startup-overlay" role="status" aria-live="polite">
          <div className="sdc-startup-card">
            <div className="sdc-startup-ring">
              <div className="sdc-startup-core">
                <HeartPulse size={28} strokeWidth={2.3} />
              </div>
            </div>
            <p className="sdc-startup-title">Smart Diagnostic Center</p>
            <p className="sdc-startup-caption">
              Preparing your reception dashboard…
            </p>
            <div className="sdc-startup-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      )}
      <div className={`app ${mobileMenuOpen ? "mobile-menu-open" : ""}`}>
        <aside className={mobileMenuOpen ? "sidebar-open" : ""}>
          <div className="sidebarScroll">
            <div className="brand">
              <div className="pulse">
                <HeartPulse size={24} />
              </div>

              <div>
                <b>
                  Smart Diagnostic
                  <br />
                  Center
                </b>

                <span>Reception Manager</span>
              </div>
            </div>

            <nav className="navList">
              {nav.map(([name, Icon]) => (
                <React.Fragment key={name}>
                  <button
                    className={page === name ? "active" : ""}
                    onClick={() => {
                      setPage(name);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Icon size={19} />

                    {name}

                    {name === "Appointments" && (
                      <em className="navBadge">{data.appointments.length}</em>
                    )}

                    <ChevronRight className="chev" size={15} />
                  </button>

                  {name === "Messages" && (
                    <div className="subNav">
                      <button
                        onClick={() => {
                          setPage("Messages");
                          setMobileMenuOpen(false);
                        }}
                      >
                        <MessageSquare size={14} />
                        SMS
                      </button>

                      <button
                        onClick={() => {
                          setPage("Messages");
                          setMobileMenuOpen(false);
                        }}
                      >
                        <Mail size={14} />
                        Email
                      </button>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </nav>

            <div className="supportCard">
              <Headphones size={25} />

              <div>
                <b>Need Help?</b>

                <span>Contact Support</span>
              </div>
            </div>

            <div className="addressCard">
              <MapPin size={17} />

              <span>
                <b>Smart Diagnostic Center</b>
                <br />
                Rajshahi, Bangladesh
              </span>

              <Phone size={16} />

              <span>01722605942</span>
            </div>
          </div>

          <div className="version">v1.3.1 Live</div>
        </aside>

        {mobileMenuOpen && (
          <button
            type="button"
            className="mobile-menu-backdrop"
            aria-label="Close navigation menu"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <main>
          <header>
            <button
              type="button"
              className="mobile-menu-toggle"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div className="search">
              <Search size={18} />

              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search patients, appointments, tests, doctors or serial..."
              />

              <kbd>Ctrl + K</kbd>
            </div>

            <div className="headerMeta">
              <button
                className="secondary"
                onClick={() => sync(true)}
                title="Sync website bookings"
              >
                <RefreshCw
                  size={16}
                  className={syncState === "syncing" ? "spin" : ""}
                />

                {syncState === "syncing"
                  ? " Syncing..."
                  : syncState === "online"
                    ? " Live Sync"
                    : syncState === "error"
                      ? " Sync Error"
                      : " Sync Now"}
              </button>

              <div className="headerDate">
                <CalendarDays size={18} />

                <div>
                  <b>{headerDate}</b>

                  <small>{headerTime}</small>
                </div>
              </div>

              <Bell size={19} />

              <div className="headerUser">
                <div className="avatar">R</div>

                <div>
                  <b>Reception User</b>

                  <small>Front Desk</small>
                </div>
              </div>
            </div>
          </header>

          {page === "Dashboard" && (
            <Dashboard
              rows={todayRows}
              doctorCounts={doctorCounts}
              setPage={setPage}
              setModal={setModal}
            />
          )}

          {page === "Appointments" && (
            <Table
              title="Doctor Appointments"
              rows={filtered.filter((x) => x.type === "doctor")}
              status={status}
              setModal={setModal}
              onAssign={assignSerial}
              onSms={openSms}
              onDelete={deleteBooking}
            />
          )}

          {page === "Test Bookings" && (
            <Table
              title="Test Bookings"
              rows={filtered.filter((x) => x.type === "test")}
              status={status}
              setModal={setModal}
              onAssign={assignSerial}
              onSms={openSms}
              onDelete={deleteBooking}
            />
          )}

          {page === "Patients" && <Patients rows={all} />}

          {page === "Doctors" && <Doctors />}

          {page === "Serial Management" && (
            <Serial rows={data.appointments} onAssign={assignSerial} />
          )}

          {page === "Messages" && <Messages rows={all} onSms={openSms} />}

          {page === "Calendar" && <CalendarPage rows={all} />}

          {page === "Reports" && <Reports rows={all} />}

          {page === "Settings" && (
            <SettingsPage
              data={data}
              setData={setData}
              onSync={() => sync(true)}
              syncState={syncState}
              lastSync={lastSync}
              onClearAll={clearAllBookings}
            />
          )}
        </main>

        {/* ADD BOOKING MODAL */}

        {modal && (
          <AddModal
            close={() => setModal(false)}
            add={(row) => {
              const key = row.type === "test" ? "testBookings" : "appointments";

              setData((current) => ({
                ...current,

                [key]: [...current[key], row],
              }));

              setModal(false);
            }}
          />
        )}

        {/* SERIAL / TIME MODAL */}

        {serialModal && (
          <SerialTimeModal
            row={serialModal}
            rows={data.appointments}
            close={() => setSerialModal(null)}
            save={saveSerialTime}
          />
        )}

        {/* MANUAL SMS / PHONE LINK MODAL */}

        {smsModal && (
          <SmsModal row={smsModal} close={() => setSmsModal(null)} />
        )}
      </div>
    </>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({ rows, doctorCounts, setPage, setModal }) {
  const ap = rows.filter((x) => x.type === "doctor");

  const tb = rows.filter((x) => x.type === "test");

  const upcoming = ap.filter((x) => x.status !== "CANCELLED").slice(0, 5);

  const dateLabel = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <section className="content dashboardContent">
      <div className="dashMain">
        <div className="hero">
          <div>
            <h1>Good Morning!</h1>

            <p>Here’s what’s happening at Smart Diagnostic Center today.</p>
          </div>

          <div className="heroScene">
            <span className="sceneCross">+</span>

            <div className="scenePeople">
              <i />
              <i />
              <i />
            </div>

            <b>
              SMART
              <br />
              DIAGNOSTIC
              <br />
              CENTER
            </b>
          </div>
        </div>

        <div className="kpis five">
          <K icon="▣" n={ap.length} t="Today's Appointments" />

          <K
            icon="●"
            n={new Set(rows.map((x) => x.phone)).size}
            t="Total Patients Today"
          />

          <K
            icon="✚"
            n={new Set(ap.map((x) => x.doctor)).size}
            t="Active Doctors"
          />

          <K icon="⚗" n={tb.length} t="Test Bookings" />

          <K
            icon="◷"
            n={ap.filter((x) => x.status === "WAITING").length}
            t="Waiting Patients"
          />
        </div>

        <div className="analyticsGrid">
          <div className="card flowCard">
            <div className="cardHead">
              <h3>Today's Patient Flow</h3>

              <button>Today⌄</button>
            </div>

            <div className="flowChart">
              <div className="chartGrid" />

              <svg viewBox="0 0 520 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#18a77b" stopOpacity=".25" />

                    <stop offset="1" stopColor="#18a77b" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <path
                  d="M20,132 C65,95 95,50 140,76 S210,35 255,64 S325,112 365,90 S440,45 500,58 L500,150 L20,150 Z"
                  fill="url(#fill)"
                />

                <path
                  d="M20,132 C65,95 95,50 140,76 S210,35 255,64 S325,112 365,90 S440,45 500,58"
                  fill="none"
                  stroke="#18a77b"
                  strokeWidth="4"
                />

                <g fill="#fff" stroke="#18a77b" strokeWidth="3">
                  <circle cx="90" cy="73" r="5" />

                  <circle cx="160" cy="70" r="5" />

                  <circle cx="255" cy="64" r="5" />

                  <circle cx="365" cy="90" r="5" />

                  <circle cx="450" cy="56" r="5" />
                </g>
              </svg>

              <div className="chartLabels">
                <span>8 AM</span>
                <span>10 AM</span>
                <span>12 PM</span>
                <span>2 PM</span>
                <span>4 PM</span>
                <span>6 PM</span>
                <span>8 PM</span>
              </div>
            </div>
          </div>

          <div className="card statusCard">
            <h3>Appointment Status</h3>

            <div className="donut">
              <div>
                <b>{rows.length}</b>

                <span>Today</span>
              </div>
            </div>

            <div className="legend">
              {["CONFIRMED", "WAITING", "COMPLETED", "CANCELLED"].map((s) => (
                <p key={s}>
                  <i className={s.toLowerCase()} />

                  {s[0] + s.slice(1).toLowerCase()}

                  <b>{rows.filter((x) => x.status === s).length}</b>
                </p>
              ))}
            </div>
          </div>

          <div className="card doctorCard">
            <div className="cardHead">
              <h3>Doctor-wise Patients</h3>

              <button>Today⌄</button>
            </div>

            {doctorCounts.map(([name, count], index) => (
              <div className="doctorBar" key={name}>
                <div className="miniAvatar">
                  {name.replace(/Dr\.|Prof\.|Asst\./g, "").trim()[0]}
                </div>

                <div>
                  <b>{name}</b>

                  <span>
                    <i
                      style={{
                        width: `${Math.min(100, count * 16 + 28)}%`,
                      }}
                    />
                  </span>
                </div>

                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="quickActions">
          <Quick
            I={CalendarDays}
            t="New Appointment"
            onClick={() => setModal(true)}
          />

          <Quick I={UserPlus} t="Add Patient" onClick={() => setModal(true)} />

          <Quick
            I={MessageSquare}
            t="Send SMS"
            onClick={() => setPage("Messages")}
          />

          <Quick I={Mail} t="Send Email" onClick={() => setPage("Messages")} />

          <Quick
            I={FlaskConical}
            t="Test Booking"
            onClick={() => setModal(true)}
          />

          <Quick
            I={CalendarClock}
            t="Doctor Schedule"
            onClick={() => setPage("Doctors")}
          />

          <Quick I={FileText} t="Reports" onClick={() => setPage("Reports")} />

          <Quick
            I={Settings}
            t="Settings"
            onClick={() => setPage("Settings")}
          />
        </div>

        <div className="card wide appointmentPanel">
          <div className="titleRow">
            <div>
              <h3>Today's Appointments</h3>
            </div>

            <div className="tableTools">
              <div className="miniSearch">
                <Search size={15} />
                Search by name, mobile or serial...
              </div>

              <button className="dateBtn">
                <CalendarDays size={15} />
                {dateLabel}
              </button>

              <button className="primary" onClick={() => setModal(true)}>
                <Plus size={17} />
                Add Appointment
              </button>
            </div>
          </div>

          <div className="statusTabs">
            <button className="selected">All ({rows.length})</button>

            <button>
              Confirmed ({rows.filter((x) => x.status === "CONFIRMED").length})
            </button>

            <button>
              Waiting ({rows.filter((x) => x.status === "WAITING").length})
            </button>

            <button>
              Completed ({rows.filter((x) => x.status === "COMPLETED").length})
            </button>

            <button>
              Cancelled ({rows.filter((x) => x.status === "CANCELLED").length})
            </button>
          </div>

          <MiniTable rows={rows} />
        </div>
      </div>

      <aside className="rightRail">
        <div className="quoteCard">
          <Stethoscope size={34} />

          <div>
            <b>
              “Better Health
              <br />
              Brighter Tomorrow”
            </b>

            <i />
          </div>
        </div>

        <div className="railCard">
          <div className="railTitle">
            <h3>Upcoming Appointments</h3>

            <button onClick={() => setPage("Appointments")}>View All</button>
          </div>

          <div className="timeline">
            {upcoming.map((x) => (
              <div className="timeItem" key={x.id}>
                <time>{x.time}</time>

                <div className="tinyAvatar">{x.patientName?.[0]}</div>

                <div>
                  <b>{x.patientName}</b>

                  <span>{x.doctor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="railCard">
          <div className="railTitle">
            <h3>Recent Activities</h3>

            <button>View All</button>
          </div>

          {rows.slice(0, 5).map((x, index) => (
            <div className="activityItem" key={x.id}>
              <div className={"activityIcon a" + index}>
                {x.type === "test" ? (
                  <FlaskConical size={15} />
                ) : (
                  <Activity size={15} />
                )}
              </div>

              <div>
                <b>
                  {x.type === "test" ? "Test booking" : "Appointment"} -{" "}
                  {x.patientName}
                </b>

                <span>Recent</span>
              </div>
            </div>
          ))}
        </div>

        <div className="healthArt">
          <div className="healthText">
            সুস্থ থাকুন
            <br />
            নিরাপদ থাকুন
          </div>

          <div className="docFigure">
            <i>+</i>
          </div>

          <div className="family">
            <i />
            <i />
          </div>
        </div>
      </aside>
    </section>
  );
}

/* =========================================================
   QUICK ACTION
========================================================= */

function Quick({ I, t, onClick }) {
  return (
    <button className="quick" onClick={onClick}>
      <div>
        <I size={27} />

        <Plus size={12} />
      </div>

      <span>{t}</span>
    </button>
  );
}

/* =========================================================
   KPI
========================================================= */

function K({ icon, n, t }) {
  return (
    <div className="kpi">
      <div className="kicon">{icon}</div>

      <div>
        <b>{n}</b>

        <span>{t}</span>
      </div>
    </div>
  );
}

/* =========================================================
   MINI TABLE
========================================================= */

function MiniTable({ rows }) {
  return (
    <div className="table">
      <div className="tr th">
        <span>#</span>

        <span>Patient</span>

        <span>Doctor / Test</span>

        <span>Time</span>

        <span>Serial</span>

        <span>Status</span>
      </div>

      {rows.slice(0, 7).map((x, index) => (
        <div className="tr" key={x.id}>
          <span>{index + 1}</span>

          <span>
            <b>{x.patientName}</b>

            <small>{x.phone}</small>
          </span>

          <span>{x.doctor || x.test}</span>

          <span>{x.time || "Pending"}</span>

          <span>{x.serial || "—"}</span>

          <span>
            <em
              className={
                "badge " +
                String(x.status || "WAITING")
                  .toLowerCase()
                  .replaceAll(" ", "-")
              }
            >
              {x.status || "WAITING"}
            </em>
          </span>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   APPOINTMENT TABLE
========================================================= */

function Table({ title, rows, status, setModal, onAssign, onSms, onDelete }) {
  return (
    <section className="content">
      <div className="pageTitle">
        <div>
          <h1>{title}</h1>

          <p>{rows.length} records</p>
        </div>

        <button className="primary" onClick={() => setModal(true)}>
          <Plus size={17} />
          Add New
        </button>
      </div>

      <div className="panel">
        <MiniTable rows={rows} />

        <div className="manage">
          {rows.map((x) => (
            <div key={x.id}>
              <b>{x.patientName}</b>

              <span>{x.id}</span>

              <select
                value={x.status || "WAITING"}
                onChange={(e) => status(x.id, e.target.value, x.type)}
              >
                {statusList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              {x.type === "doctor" && (
                <button onClick={() => onAssign(x)}>
                  <TicketCheck size={16} />
                  Serial / Time
                </button>
              )}

              <button onClick={() => onSms(x)}>
                <Phone size={16} />
                SMS
              </button>

              <button
                type="button"
                onClick={() => onDelete(x)}
                title="Delete this booking permanently"
                style={{
                  color: "#b91c1c",
                  border: "1px solid #fecaca",
                  background: "#fff7f7",
                }}
              >
                <Trash2 size={16} />
                Delete
              </button>

              {x.email && (
                <button
                  onClick={() =>
                    alert(
                      `Email provider connect করলে ${x.email} এ email যাবে.`,
                    )
                  }
                >
                  <Mail size={16} />
                  Email
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   PATIENTS
========================================================= */

function Patients({ rows }) {
  const map = [
    ...new Map(rows.filter((x) => x.phone).map((x) => [x.phone, x])).values(),
  ];

  return (
    <Simple title="Patients">
      <div className="cards">
        {map.map((x) => (
          <div className="person" key={x.phone}>
            <div className="avatar">{x.patientName?.[0] || "P"}</div>

            <div>
              <b>{x.patientName}</b>

              <span>{x.phone}</span>

              <small>{x.email || "No email"}</small>
            </div>
          </div>
        ))}
      </div>
    </Simple>
  );
}

/* =========================================================
   DOCTORS
========================================================= */

function Doctors() {
  return (
    <Simple title="Doctors">
      <div className="cards">
        {doctors.map((doctor) => (
          <div className="person" key={doctor.id}>
            <div className="avatar">
              {doctor.name.split(" ").pop()?.[0] || "D"}
            </div>

            <div>
              <b>{doctor.name}</b>

              <span>{doctor.department}</span>

              <small>{doctor.degree}</small>
            </div>
          </div>
        ))}
      </div>
    </Simple>
  );
}

/* =========================================================
   SERIAL MANAGEMENT
========================================================= */

function Serial({ rows, onAssign }) {
  const groups = Object.entries(
    rows.reduce((acc, x) => {
      const key = x.doctor || "Unknown Doctor";

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(x);

      return acc;
    }, {}),
  );

  return (
    <Simple title="Serial Management">
      <div className="serials">
        {groups.map(([doctor, records]) => (
          <div className="card" key={doctor}>
            <h3>{doctor}</h3>

            {[...records]
              .sort(
                (a, b) =>
                  Number(a.serial || 999999) - Number(b.serial || 999999),
              )
              .map((x) => (
                <p
                  key={x.id}
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => onAssign(x)}
                  title="Click to set Serial / Reporting Time"
                >
                  <strong>
                    {hasSerial(x.serial)
                      ? String(x.serial).padStart(2, "0")
                      : "—"}
                  </strong>

                  <span>{x.patientName}</span>

                  <small>{x.time || "Pending"}</small>
                </p>
              ))}
          </div>
        ))}
      </div>

      <p className="muted">
        Patient row-তে click করলে Serial Number ও Reporting Time assign করা
        যাবে। Save করলে live website database-এ update হবে।
      </p>
    </Simple>
  );
}

/* =========================================================
   MESSAGES
========================================================= */

function Messages({ rows, onSms }) {
  return (
    <Simple title="SMS & Email">
      <p className="muted">
        Manual SMS mode: SMS button চাপলে patient number এবং appointment message
        ready হবে। Copy করে Windows Phone Link-এর Messages থেকে পাঠান। SMS
        charge আপনার SIM/operator package অনুযায়ী কাটবে।
      </p>

      <div className="cards">
        {rows.map((x) => (
          <div className="person" key={x.id}>
            <div>
              <b>{x.patientName}</b>

              <span>{x.phone}</span>

              <small>
                {x.type === "doctor"
                  ? `${x.doctor || "Doctor"} · Serial ${x.serial || "Pending"} · ${
                      x.time || "Pending"
                    }`
                  : x.test || "Diagnostic service"}
              </small>
            </div>

            <button className="secondary" onClick={() => onSms(x)}>
              <Phone size={15} />
              SMS
            </button>
          </div>
        ))}
      </div>
    </Simple>
  );
}

/* =========================================================
   CALENDAR
========================================================= */

function CalendarPage({ rows }) {
  const now = new Date();

  const monthName = now.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const year = now.getFullYear();

  const month = now.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const firstDay = new Date(year, month, 1).getDay();

  const cells = Array.from(
    {
      length: Math.ceil((firstDay + daysInMonth) / 7) * 7,
    },
    (_, i) => {
      const day = i - firstDay + 1;

      return day >= 1 && day <= daysInMonth ? day : null;
    },
  );

  return (
    <Simple title="Calendar">
      <div className="calendarBox">
        <div className="calendarHead">
          <button>‹</button>

          <h2>{monthName}</h2>

          <button>›</button>
        </div>

        <div className="week">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((x) => (
            <b key={x}>{x}</b>
          ))}
        </div>

        <div className="days">
          {cells.map((day, index) => {
            if (!day) {
              return <div key={index} />;
            }

            const iso =
              `${year}-` +
              `${String(month + 1).padStart(2, "0")}-` +
              `${String(day).padStart(2, "0")}`;

            const count = rows.filter((x) => x.date === iso).length;

            const isToday = day === now.getDate();

            return (
              <div className={isToday ? "today" : ""} key={index}>
                <strong>{day}</strong>

                {count > 0 && <small>{count} bookings</small>}
              </div>
            );
          })}
        </div>
      </div>
    </Simple>
  );
}

/* =========================================================
   REPORTS
========================================================= */

function Reports({ rows }) {
  function exportCsv() {
    const csv =
      "Patient,Phone,Type,Doctor/Test,Date,Time,Serial,Status\n" +
      rows
        .map((x) =>
          [
            x.patientName,
            x.phone,
            x.type,
            x.doctor || x.test,
            x.date,
            x.time,
            x.serial,
            x.status,
          ]
            .map((value) => `"${String(value || "").replaceAll('"', '""')}"`)
            .join(","),
        )
        .join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], {
        type: "text/csv",
      }),
    );

    const link = document.createElement("a");

    link.href = url;

    link.download = "smart-diagnostic-report.csv";

    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <Simple title="Reports">
      <div className="kpis">
        <K n={rows.length} t="Total Records" />

        <K
          n={rows.filter((x) => x.status === "COMPLETED").length}
          t="Completed"
        />

        <K
          n={rows.filter((x) => x.type === "doctor").length}
          t="Doctor Appointments"
        />

        <K n={rows.filter((x) => x.type === "test").length} t="Test Bookings" />
      </div>

      <button className="secondary" onClick={exportCsv}>
        <Download size={16} />
        Export CSV
      </button>
    </Simple>
  );
}

/* =========================================================
   SETTINGS
========================================================= */

function SettingsPage({
  data,
  setData,
  onSync,
  syncState,
  lastSync,
  onClearAll,
}) {
  const settings = data.settings;

  return (
    <Simple title="Settings">
      <div className="settings">
        <label>
          Center Name
          <input
            value={settings.centerName}
            onChange={(e) =>
              setData((current) => ({
                ...current,

                settings: {
                  ...current.settings,

                  centerName: e.target.value,
                },
              }))
            }
          />
        </label>

        <label>
          Website URL
          <input
            placeholder="https://smart-diagnostic-center.netlify.app"
            value={settings.apiUrl}
            onChange={(e) =>
              setData((current) => ({
                ...current,

                settings: {
                  ...current.settings,

                  apiUrl: e.target.value,
                },
              }))
            }
          />
        </label>

        <label>
          Reception API Token
          <input
            type="password"
            placeholder="Netlify RECEPTION_API_TOKEN-এর একই value"
            value={settings.adminToken}
            onChange={(e) =>
              setData((current) => ({
                ...current,

                settings: {
                  ...current.settings,

                  adminToken: e.target.value,
                },
              }))
            }
          />
        </label>

        <p>
          Website booking প্রতি 30 seconds-এ auto-sync হবে। Netlify Environment
          Variables-এ <b>RECEPTION_API_TOKEN</b> থাকতে হবে।
        </p>

        <button className="primary" type="button" onClick={onSync}>
          <RefreshCw size={16} />

          {syncState === "syncing" ? "Syncing..." : "Test / Sync Now"}
        </button>

        {lastSync && (
          <p>
            Last sync: <b>{lastSync}</b>
          </p>
        )}

        <p>
          Data এই PC-তেও localভাবে save হয়। Website sync-এর জন্য internet
          প্রয়োজন।
        </p>

        <div
          style={{
            marginTop: "28px",
            padding: "18px",
            border: "1px solid #fecaca",
            borderRadius: "12px",
            background: "#fff7f7",
          }}
        >
          <h3 style={{ margin: "0 0 8px", color: "#b91c1c" }}>Danger Zone</h3>

          <p style={{ marginTop: 0, color: "#7f1d1d" }}>
            Permanently delete all website appointments and test bookings.
            Doctors, Settings, Website URL and API Token will not be deleted.
            Export a CSV backup first if you need the old records.
          </p>

          <button
            type="button"
            onClick={onClearAll}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "11px 16px",
              borderRadius: "9px",
              border: "1px solid #dc2626",
              background: "#dc2626",
              color: "#ffffff",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            <Trash2 size={16} />
            Clear All Booking Data
          </button>
        </div>
      </div>
    </Simple>
  );
}

/* =========================================================
   SIMPLE PAGE
========================================================= */

function Simple({ title, children }) {
  return (
    <section className="content">
      <div className="pageTitle">
        <div>
          <h1>{title}</h1>

          <p>Smart Diagnostic Center</p>
        </div>
      </div>

      <div className="panel">{children}</div>
    </section>
  );
}

/* =========================================================
   ADD BOOKING MODAL
========================================================= */

function AddModal({ close, add }) {
  const [form, setForm] = useState({
    patientName: "",

    phone: "",

    email: "",

    date: new Date().toISOString().slice(0, 10),

    time: "09:00",

    type: "doctor",

    doctor: doctors[0]?.name || "",

    test: "",

    status: "WAITING",
  });

  function submit(event) {
    event.preventDefault();

    add({
      ...form,

      id: "LOCAL-" + Date.now(),

      serial: "",

      source: "local",
    });
  }

  return (
    <div className="overlay">
      <form className="modal" onSubmit={submit}>
        <div className="titleRow">
          <h2>Add Booking</h2>

          <button type="button" className="icon" onClick={close}>
            <XCircle />
          </button>
        </div>

        <label>
          Patient Name
          <input
            required
            value={form.patientName}
            onChange={(e) =>
              setForm({
                ...form,

                patientName: e.target.value,
              })
            }
          />
        </label>

        <label>
          Mobile
          <input
            required
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,

                phone: e.target.value,
              })
            }
          />
        </label>

        <label>
          Email (optional)
          <input
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,

                email: e.target.value,
              })
            }
          />
        </label>

        <label>
          Type
          <select
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,

                type: e.target.value,
              })
            }
          >
            <option value="doctor">Doctor Appointment</option>

            <option value="test">Test Booking</option>
          </select>
        </label>

        {form.type === "doctor" ? (
          <label>
            Doctor
            <select
              value={form.doctor}
              onChange={(e) =>
                setForm({
                  ...form,

                  doctor: e.target.value,
                })
              }
            >
              {doctors.map((doctor) => (
                <option key={doctor.id}>{doctor.name}</option>
              ))}
            </select>
          </label>
        ) : (
          <label>
            Test
            <input
              required
              value={form.test}
              onChange={(e) =>
                setForm({
                  ...form,

                  test: e.target.value,
                })
              }
            />
          </label>
        )}

        <div className="two">
          <label>
            Date
            <input
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm({
                  ...form,

                  date: e.target.value,
                })
              }
            />
          </label>

          <label>
            Time
            <input
              type="time"
              value={form.time}
              onChange={(e) =>
                setForm({
                  ...form,

                  time: e.target.value,
                })
              }
            />
          </label>
        </div>

        <button className="primary" type="submit">
          <CheckCircle2 size={17} />
          Save Booking
        </button>
      </form>
    </div>
  );
}

/* =========================================================
   SERIAL / TIME MODAL
========================================================= */

function SerialTimeModal({ row, rows, close, save }) {
  /*
   * Suggest next serial for
   * same doctor + same date.
   */
  const suggestedSerial = useMemo(() => {
    const sameDay = rows.filter(
      (x) =>
        x.id !== row.id &&
        x.doctor === row.doctor &&
        x.date === row.date &&
        x.status !== "CANCELLED",
    );

    const maximum = sameDay.reduce((max, x) => {
      const number = Number(x.serial || 0);

      return Math.max(max, Number.isFinite(number) ? number : 0);
    }, 0);

    return maximum + 1;
  }, [row, rows]);

  const [serial, setSerial] = useState(
    hasSerial(row.serial) ? String(row.serial) : String(suggestedSerial),
  );

  const [reportingTime, setReportingTime] = useState(
    row.time && row.time !== "Pending" && isValidTime(row.time)
      ? row.time
      : "09:00",
  );

  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();

    const serialNumber = Number(serial);

    if (!Number.isInteger(serialNumber) || serialNumber < 1) {
      alert("Serial number 1 বা তার বেশি পূর্ণ সংখ্যা দিন।");

      return;
    }

    if (!isValidTime(reportingTime)) {
      alert("Reporting Time ঠিকভাবে দিন। যেমন 15:30");

      return;
    }

    try {
      setSaving(true);

      await save(row, serialNumber, reportingTime);

      alert(
        `Appointment Confirmed!\n\n` +
          `Patient: ${row.patientName}\n` +
          `Doctor: ${row.doctor}\n` +
          `Serial: ${serialNumber}\n` +
          `Reporting Time: ${reportingTime}`,
      );

      close();
    } catch (error) {
      alert("Update failed: " + error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="overlay">
      <form className="modal" onSubmit={submit}>
        <div className="titleRow">
          <div>
            <h2>Assign Serial & Time</h2>

            <p className="muted">Website appointment confirmation</p>
          </div>

          <button
            type="button"
            className="icon"
            onClick={close}
            disabled={saving}
          >
            <XCircle />
          </button>
        </div>

        <div
          style={{
            padding: "14px 16px",

            marginBottom: "16px",

            borderRadius: "12px",

            background: "#f1faf7",

            border: "1px solid #d6eee7",
          }}
        >
          <b>{row.patientName}</b>

          <div
            style={{
              marginTop: "6px",

              fontSize: "12px",

              color: "#637b89",
            }}
          >
            {row.phone}
          </div>

          <div
            style={{
              marginTop: "6px",

              fontSize: "12px",
            }}
          >
            {row.doctor}
          </div>

          <div
            style={{
              marginTop: "4px",

              fontSize: "12px",

              color: "#637b89",
            }}
          >
            Date: {row.date}
          </div>
        </div>

        <div className="two">
          <label>
            Serial Number
            <input
              type="number"
              min="1"
              required
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
            />
          </label>

          <label>
            Reporting Time
            <input
              type="time"
              required
              value={reportingTime}
              onChange={(e) => setReportingTime(e.target.value)}
            />
          </label>
        </div>

        <p className="muted">
          Confirm করলে Serial Number, Reporting Time এবং Status = CONFIRMED live
          website database-এ save হবে।
        </p>

        <div
          style={{
            display: "flex",

            gap: "10px",

            marginTop: "16px",
          }}
        >
          <button
            type="button"
            className="secondary"
            onClick={close}
            disabled={saving}
          >
            Cancel
          </button>

          <button type="submit" className="primary" disabled={saving}>
            <CheckCircle2 size={17} />

            {saving ? "Saving..." : "Confirm Serial"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* =========================================================
   MANUAL SMS / PHONE LINK MODAL
========================================================= */

function SmsModal({ row, close }) {
  const [message, setMessage] = useState(() => buildSmsMessage(row));
  const [copied, setCopied] = useState("");

  const phone = String(row.phone || "").trim();

  const confirmedDoctorAppointment =
    row.type === "doctor" &&
    hasSerial(row.serial) &&
    row.time &&
    row.time !== "Pending" &&
    isValidTime(row.time) &&
    row.status === "CONFIRMED";

  async function copyValue(value, label) {
    const ok = await copyTextToClipboard(value);

    if (!ok) {
      alert("Copy করা যায়নি। Text manually select করে copy করুন।");
      return;
    }

    setCopied(label);

    window.setTimeout(() => {
      setCopied("");
    }, 1800);
  }

  function openPhoneLink() {
    /*
     * Windows exposes a Phone Link settings URI.
     * Chromium/Electron may show a confirmation before handing it to Windows.
     */
    const uri = "ms-settings:mobile-devices-addphone-direct";

    try {
      window.open(uri, "_blank");
    } catch {
      window.location.href = uri;
    }
  }

  return (
    <div className="overlay">
      <div className="modal">
        <div className="titleRow">
          <div>
            <h2>Send SMS</h2>
            <p className="muted">
              Manual SMS via your Android SIM / Phone Link
            </p>
          </div>

          <button type="button" className="icon" onClick={close}>
            <XCircle />
          </button>
        </div>

        <div
          style={{
            padding: "14px 16px",
            marginBottom: "16px",
            borderRadius: "12px",
            background: "#f1faf7",
            border: "1px solid #d6eee7",
          }}
        >
          <b>{row.patientName || "Patient"}</b>

          <div
            style={{
              marginTop: "6px",
              fontSize: "12px",
              color: "#637b89",
            }}
          >
            Mobile: {phone || "No mobile number"}
          </div>

          {row.type === "doctor" && (
            <>
              <div style={{ marginTop: "6px", fontSize: "12px" }}>
                {row.doctor || "Doctor not selected"}
              </div>

              <div
                style={{
                  marginTop: "4px",
                  fontSize: "12px",
                  color: "#637b89",
                }}
              >
                Serial: {row.serial || "Pending"} · Reporting Time:{" "}
                {row.time || "Pending"}
              </div>
            </>
          )}
        </div>

        {row.type === "doctor" && !confirmedDoctorAppointment && (
          <div
            style={{
              marginBottom: "14px",
              padding: "11px 13px",
              borderRadius: "10px",
              background: "#fff8e8",
              border: "1px solid #f4dfad",
              color: "#875b16",
              fontSize: "12px",
              lineHeight: 1.55,
            }}
          >
            Serial/Reporting Time এখনো confirmed নয়। তাই message-এ appointment
            request received লেখা হয়েছে; confirmed serial/time লেখা হয়নি।
          </div>
        )}

        <label>
          Patient Mobile
          <input value={phone} readOnly />
        </label>

        <label style={{ marginTop: "14px" }}>
          SMS Message
          <textarea
            rows={12}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            style={{
              width: "100%",
              resize: "vertical",
              marginTop: "7px",
              border: "1px solid #dbe7e4",
              borderRadius: "10px",
              padding: "12px",
              lineHeight: 1.55,
              outline: "none",
            }}
          />
        </label>

        <div
          style={{
            marginTop: "14px",
            padding: "11px 13px",
            borderRadius: "10px",
            background: "#f7faf9",
            border: "1px solid #e2ece9",
            color: "#61717d",
            fontSize: "12px",
            lineHeight: 1.6,
          }}
        >
          এই mode-এ কোনো SMS gateway payment নেই। SMS আপনার paired Android
          phone-এর SIM থেকে যাবে, তাই শুধু mobile operator-এর normal SMS charge
          বা SMS package প্রযোজ্য।
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "9px",
            marginTop: "16px",
          }}
        >
          <button
            type="button"
            className="secondary"
            disabled={!phone}
            onClick={() => copyValue(phone, "number")}
          >
            <Phone size={15} />
            {copied === "number" ? "Number Copied" : "Copy Number"}
          </button>

          <button
            type="button"
            className="secondary"
            onClick={() => copyValue(message, "message")}
          >
            <MessageSquare size={15} />
            {copied === "message" ? "Message Copied" : "Copy Message"}
          </button>

          <button
            type="button"
            className="secondary"
            disabled={!phone}
            onClick={() => copyValue(`To: ${phone}\n\n${message}`, "all")}
          >
            <CheckCircle2 size={15} />
            {copied === "all" ? "Copied" : "Copy Number + Message"}
          </button>

          <button type="button" className="primary" onClick={openPhoneLink}>
            <Phone size={16} />
            Open Phone Link
          </button>
        </div>

        <p className="muted" style={{ marginTop: "14px" }}>
          Recommended: Copy Number → Copy Message → Open Phone Link → Messages →
          New message → paste number/message → Send.
        </p>
      </div>
    </div>
  );
}

export default App;
