import { useEffect, useState } from "react";

/* ── Scroll-reveal hook ──────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right",
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.1 },
    );
    for (const el of els) io.observe(el);
    return () => io.disconnect();
  }, []);
}

/* ── Sticky header scroll detection ─────────────────────────────────── */
function useScrolled(threshold = 60) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);
  return scrolled;
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

const STARS = [1, 2, 3, 4, 5];

/* ── Reusable section header (centered) ─────────────────────────────── */
function SectionHeading({
  eyebrow,
  title,
  light = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  light?: boolean;
}) {
  return (
    <div className="section-header text-center mb-16 reveal">
      <span className="section-rule" />
      <p
        className="font-body text-xs font-semibold tracking-[0.2em] uppercase mb-4"
        style={{ color: light ? "#E8BC45" : "#C9A227" }}
      >
        {eyebrow}
      </p>
      <h2
        className="font-display text-4xl sm:text-5xl font-bold leading-tight"
        style={{ color: light ? "#fff" : "#2A2A2A" }}
      >
        {title}
      </h2>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   HEADER
══════════════════════════════════════════════════════════════════════ */
function Header() {
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", id: "home" },
    { label: "Menu", id: "menu" },
    { label: "About", id: "about" },
    { label: "Reviews", id: "reviews" },
    { label: "Contact", id: "location" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled ? "bg-white shadow-nav py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => scrollTo("home")}
          data-ocid="nav.link"
          className="font-display text-2xl font-bold leading-tight"
          style={{ color: scrolled ? "#8B1E1E" : "#fff" }}
        >
          Papa&apos;s{" "}
          <span style={{ color: scrolled ? "#C9A227" : "#C9A227" }}>
            Cuisine
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.id}
              data-ocid="nav.link"
              onClick={() => scrollTo(link.id)}
              className={`font-body text-sm font-medium tracking-wide transition-colors ${
                scrolled
                  ? "text-gray-600 hover:text-[#8B1E1E]"
                  : "text-white/85 hover:text-white"
              }`}
            >
              {link.label}
            </button>
          ))}
          <a
            href="tel:03334191194"
            data-ocid="nav.order_button"
            className="ml-2 px-6 py-2.5 rounded-full text-sm font-semibold font-body transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5"
            style={{
              background: "#C9A227",
              color: "#fff",
              boxShadow: "0 2px 16px rgba(201,162,39,0.40)",
            }}
          >
            Order Now
          </a>
        </nav>

        <button
          type="button"
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="flex flex-col gap-[5px]">
            {[0, 1, 2].map((n) => (
              <span
                key={n}
                className={`block h-[2px] transition-all duration-200 ${
                  n === 0 && menuOpen ? "rotate-45 translate-y-[7px] w-5" : ""
                } ${n === 1 && menuOpen ? "opacity-0 w-5" : ""} ${
                  n === 2 && menuOpen ? "-rotate-45 -translate-y-[7px] w-5" : ""
                } ${
                  n === 0 ? "w-5" : n === 1 ? "w-4" : "w-3"
                } ${scrolled ? "bg-gray-800" : "bg-white"}`}
              />
            ))}
          </div>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.id}
                data-ocid="nav.link"
                onClick={() => {
                  scrollTo(link.id);
                  setMenuOpen(false);
                }}
                className="text-left px-3 py-3 rounded-lg text-gray-700 font-medium font-body hover:bg-gray-50 text-sm"
              >
                {link.label}
              </button>
            ))}
            <a
              href="tel:03334191194"
              data-ocid="nav.order_button"
              className="mt-2 px-5 py-3.5 rounded-full text-center text-sm font-semibold font-body"
              style={{ background: "#C9A227", color: "#fff" }}
            >
              Order Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   HERO  — P0 fix: staggered type scale burst
══════════════════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <img
        src="/assets/generated/hero-food.dim_1600x900.jpg"
        alt="Papa's Cuisine dishes"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      {/* Richer two-stop overlay — more dramatic bottom darkness */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(165deg, rgba(8,3,3,0.60) 0%, rgba(8,3,3,0.25) 45%, rgba(8,3,3,0.85) 100%)",
        }}
      />

      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 pt-24">
        {/* Eyebrow pill */}
        <span
          className="inline-block mb-8 px-5 py-2 rounded-full text-[11px] font-semibold font-body tracking-[0.22em] uppercase"
          style={{
            background: "rgba(201,162,39,0.18)",
            border: "1px solid rgba(201,162,39,0.45)",
            color: "#E8BC45",
          }}
        >
          ⭐ Rated 5.0 · Johar Town, Lahore
        </span>

        {/*
          P0 FIX — Staggered type scale:
          • "Rich Taste."  = medium  (text-5xl / 6xl)
          • "Real Homemade" = HUGE italic (text-7xl / 8xl / 9xl)
          • "Flavor."       = medium  (text-5xl / 6xl)
          Creates a true poster hierarchy moment.
        */}
        <h1 className="font-display font-bold leading-none mb-8 tracking-tight">
          <span
            className="block text-4xl sm:text-5xl lg:text-6xl"
            style={{ letterSpacing: "-0.01em", opacity: 0.92 }}
          >
            Rich Taste.
          </span>
          <em
            className="block text-6xl sm:text-8xl lg:text-[108px] not-italic my-1"
            style={{
              color: "#C9A227",
              fontStyle: "italic",
              letterSpacing: "-0.025em",
              lineHeight: "1",
              textShadow: "0 2px 40px rgba(201,162,39,0.25)",
            }}
          >
            Real Homemade
          </em>
          <span
            className="block text-4xl sm:text-5xl lg:text-6xl"
            style={{ letterSpacing: "-0.01em", opacity: 0.92 }}
          >
            Flavor.
          </span>
        </h1>

        <p className="font-body text-base sm:text-lg text-white/75 max-w-lg mx-auto mb-11 leading-relaxed">
          Discover authentic Asian cuisine loved by the Johar Town community.
          Freshly prepared meals, reliable delivery, and flavors that feel like
          home.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
          <a
            href="tel:03334191194"
            data-ocid="hero.primary_button"
            className="px-9 py-4 rounded-full text-base font-semibold font-body transition-all duration-250 hover:-translate-y-0.5 hover:brightness-110"
            style={{
              background: "#C9A227",
              color: "#fff",
              boxShadow: "0 6px 28px rgba(201,162,39,0.50)",
            }}
          >
            🛵 Order Now
          </a>
          <button
            type="button"
            data-ocid="hero.secondary_button"
            onClick={() => scrollTo("menu")}
            className="px-9 py-4 rounded-full text-base font-semibold font-body border border-white/50 text-white hover:bg-white/10 transition-all duration-200"
          >
            View Menu →
          </button>
        </div>

        {/* Trust badges — tighter, more refined */}
        <div className="flex flex-wrap justify-center gap-2.5">
          {[
            { icon: "⭐", text: "5.0 Rating" },
            { icon: "🍽", text: "Dine-In" },
            { icon: "🚗", text: "Drive Through" },
            { icon: "🛵", text: "Home Delivery" },
          ].map((badge) => (
            <div
              key={badge.text}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-body font-medium"
              style={{
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.18)",
                backdropFilter: "blur(10px)",
                letterSpacing: "0.01em",
              }}
            >
              <span>{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Animated scroll cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div
          className="w-[1px] h-10 animate-pulse"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(255,255,255,0.4))",
          }}
        />
        <span
          className="text-[10px] font-body tracking-[0.25em] uppercase"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          Scroll
        </span>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   ABOUT — P1 fix: editorial gold rule, more breathing room
══════════════════════════════════════════════════════════════════════ */
function About() {
  return (
    <section id="about" className="py-28 lg:py-36 cream-texture">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Text */}
          <div className="reveal-left">
            {/* Left-aligned editorial header */}
            <div className="section-header-left mb-8">
              <span className="section-rule" />
              <p
                className="font-body text-xs font-semibold tracking-[0.2em] uppercase mb-4"
                style={{ color: "#C9A227" }}
              >
                Our Story
              </p>
              <h2
                className="font-display text-4xl sm:text-5xl lg:text-[52px] font-bold leading-[1.08]"
                style={{ color: "#2A2A2A", letterSpacing: "-0.01em" }}
              >
                A Local Favorite
                <br />
                for{" "}
                <em
                  style={{
                    color: "#8B1E1E",
                    fontStyle: "italic",
                  }}
                >
                  Authentic Taste
                </em>
              </h2>
            </div>

            <div className="space-y-5 font-body text-gray-600 leading-[1.8] text-[15px] max-w-lg">
              <p>
                Papa&apos;s Cuisine is known for serving rich, flavorful Asian
                dishes made with care and passion. Located in Johar Town,
                Lahore, the restaurant has earned a reputation for quality food,
                warm service, and reliable delivery.
              </p>
              <p>
                Whether you&apos;re dining in with family or ordering from home,
                every dish is prepared to deliver comforting homemade flavor and
                unforgettable taste. From our signature Mutanjan to hearty daily
                specials, each meal carries the warmth of tradition.
              </p>
            </div>

            {/* Stats — refined with a thin rule separator */}
            <div
              className="mt-10 pt-10 flex gap-12"
              style={{ borderTop: "1px solid rgba(42,42,42,0.08)" }}
            >
              {[
                { value: "5.0★", label: "Customer Rating" },
                { value: "4", label: "Services" },
                { value: "Johar", label: "Town Favorite" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    className="font-display text-3xl font-bold"
                    style={{ color: "#8B1E1E" }}
                  >
                    {stat.value}
                  </div>
                  <div className="font-body text-xs text-gray-400 mt-1 tracking-wide uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="reveal-right">
            <div className="relative">
              <img
                src="/assets/generated/dish-spread.dim_600x500.jpg"
                alt="Food spread at Papa's Cuisine"
                className="w-full rounded-3xl object-cover"
                style={{
                  height: "520px",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.18)",
                }}
              />
              {/* Floating badge — positioned for grid-breaking overlap */}
              <div
                className="absolute -bottom-6 -right-4 lg:-right-8 px-6 py-5 rounded-2xl"
                style={{
                  background: "#8B1E1E",
                  boxShadow: "0 12px 40px rgba(139,30,30,0.40)",
                }}
              >
                <div className="font-display text-3xl font-bold text-white leading-none">
                  5.0
                </div>
                <div className="flex gap-0.5 mt-1">
                  {STARS.map((n) => (
                    <span key={n} className="text-yellow-400 text-xs">
                      ★
                    </span>
                  ))}
                </div>
                <div className="font-body text-[11px] text-white/70 mt-1 tracking-wide">
                  Google Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   MENU
══════════════════════════════════════════════════════════════════════ */
const menuItems = [
  {
    name: "Mutanjan",
    desc: "Traditional sweet rice, richly spiced with saffron and garnished with dry fruits. A true taste of heritage.",
    img: "/assets/generated/dish-mutanjan.dim_600x500.jpg",
    tag: "Heritage Special",
  },
  {
    name: "Chef's Special Rice",
    desc: "Aromatic basmati slow-cooked with premium spices. Every grain tells a story of authentic flavor.",
    img: "/assets/generated/dish-rice.dim_600x500.jpg",
    tag: "Chef's Pick",
  },
  {
    name: "Homestyle Curry",
    desc: "Rich, golden curry simmered to perfection with fresh ingredients and traditional family recipes.",
    img: "/assets/generated/dish-curry.dim_600x500.jpg",
    tag: "Family Recipe",
  },
  {
    name: "Seasonal Specials",
    desc: "Curated seasonal specialties prepared fresh each day using the finest local ingredients.",
    img: "/assets/generated/dish-spread.dim_600x500.jpg",
    tag: "Daily Fresh",
  },
];

function Menu() {
  return (
    <section id="menu" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="What We Serve" title="Our Signature Dishes" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {menuItems.map((item, i) => (
            <div
              key={item.name}
              className="reveal menu-card group rounded-2xl overflow-hidden bg-white"
              style={{
                boxShadow:
                  "0 2px 20px rgba(42,42,42,0.06), 0 0 0 1px rgba(42,42,42,0.04)",
                transitionDelay: `${i * 90}ms`,
              }}
            >
              <div className="overflow-hidden relative">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full object-cover transition-transform duration-600 group-hover:scale-[1.07]"
                  style={{ height: "230px" }}
                />
                {/* Gradient fade at bottom of image for seamless card integration */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-12"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(255,255,255,0.15), transparent)",
                  }}
                />
                <span
                  className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-semibold font-body"
                  style={{
                    background: "rgba(201,162,39,0.92)",
                    color: "#fff",
                    letterSpacing: "0.01em",
                  }}
                >
                  {item.tag}
                </span>
              </div>
              <div className="p-6">
                <h3
                  className="font-display text-[19px] font-bold mb-2 leading-snug"
                  style={{ color: "#2A2A2A" }}
                >
                  {item.name}
                </h3>
                <p className="font-body text-[13px] text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-14 reveal">
          <button
            type="button"
            data-ocid="menu.view_menu_button"
            onClick={() => scrollTo("location")}
            className="btn-outline-red px-10 py-4 rounded-full font-body font-semibold text-sm"
          >
            <span>View Full Menu →</span>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   WHY CHOOSE US — P2 fix: editorial numbered rows, no emoji boxes
══════════════════════════════════════════════════════════════════════ */
const features = [
  {
    num: "01",
    title: "Authentic Taste",
    desc: "Traditional recipes with rich flavors passed down through generations of family cooking.",
  },
  {
    num: "02",
    title: "Quality Ingredients",
    desc: "Only the freshest, highest-quality ingredients go into every dish we prepare.",
  },
  {
    num: "03",
    title: "Reliable Delivery",
    desc: "Hot food delivered fresh and on time, straight to your doorstep.",
  },
  {
    num: "04",
    title: "Friendly Service",
    desc: "Every guest is treated like family — warmth and care in every interaction.",
  },
];

function Features() {
  return (
    <section id="features" className="py-24 cream-texture">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Promise"
          title={<>Why Papa&apos;s Cuisine?</>}
        />

        {/*
          P2 FIX — Editorial numbered layout:
          Large italic serif step numbers as visual anchors.
          Horizontal rows with a thin rule separator.
          No emoji. No centered boxes.
        */}
        <div className="grid sm:grid-cols-2 gap-0">
          {features.map((f, i) => (
            <div
              key={f.num}
              className="reveal group flex gap-8 items-start px-8 py-10"
              style={{
                borderTop: "1px solid rgba(42,42,42,0.08)",
                borderRight:
                  i % 2 === 0 ? "1px solid rgba(42,42,42,0.08)" : "none",
                transitionDelay: `${i * 80}ms`,
              }}
            >
              {/* Large editorial number */}
              <span
                className="font-display font-bold flex-shrink-0 leading-none select-none transition-colors duration-300 group-hover:opacity-100"
                style={{
                  fontSize: "clamp(3rem, 5vw, 4.5rem)",
                  color: "rgba(139,30,30,0.12)",
                  fontStyle: "italic",
                  letterSpacing: "-0.03em",
                  marginTop: "-4px",
                }}
              >
                {f.num}
              </span>
              <div>
                <h3
                  className="font-display text-xl font-bold mb-2"
                  style={{ color: "#2A2A2A" }}
                >
                  {f.title}
                </h3>
                <p className="font-body text-[14px] text-gray-500 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   REVIEWS
══════════════════════════════════════════════════════════════════════ */
const reviews = [
  {
    text: "A home of quality and rich taste. Every time I order, the food arrives hot and delicious. Truly feels like homemade.",
    author: "Adeel R.",
    location: "Johar Town",
  },
  {
    text: "The Mutanjan is absolutely divine. I've never tasted anything quite like it. Papa's Cuisine is our family's go-to!",
    author: "Sara M.",
    location: "Lahore",
  },
  {
    text: "Delivery was on time and the food tasted amazing. Professional service and authentic flavors. Highly recommend!",
    author: "Usman K.",
    location: "Lahore",
  },
];

function Reviews() {
  return (
    <section id="reviews" className="py-28" style={{ background: "#8B1E1E" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Customer Love"
          title="What Our Customers Say"
          light
        />

        {/* 5.0 rating — sits between header and cards */}
        <div className="flex justify-center -mt-4 mb-12">
          <div
            className="inline-flex items-center gap-4 px-8 py-4 rounded-full"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <span className="font-display text-4xl font-bold text-white leading-none">
              5.0
            </span>
            <div>
              <div className="flex gap-0.5">
                {STARS.map((n) => (
                  <span key={n} className="text-yellow-400 text-lg">
                    ★
                  </span>
                ))}
              </div>
              <div className="font-body text-xs text-white/55 mt-0.5 tracking-wide">
                Google Rating
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <div
              key={r.author}
              className="reveal p-8 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.10)",
                transitionDelay: `${i * 110}ms`,
              }}
            >
              {/* Large decorative quote mark */}
              <div
                className="font-display font-bold mb-3 leading-none select-none"
                style={{
                  fontSize: "4rem",
                  color: "rgba(201,162,39,0.35)",
                  lineHeight: "1",
                  marginTop: "-8px",
                }}
              >
                &ldquo;
              </div>
              <p className="font-body text-white/85 text-[15px] leading-[1.75] mb-7">
                {r.text}
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-white text-sm flex-shrink-0"
                  style={{ background: "rgba(201,162,39,0.45)" }}
                >
                  {r.author.charAt(0)}
                </div>
                <div>
                  <div className="font-body font-semibold text-white text-sm">
                    {r.author}
                  </div>
                  <div className="font-body text-white/50 text-xs">
                    {r.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   SERVICES
══════════════════════════════════════════════════════════════════════ */
const services = [
  {
    icon: "🍽",
    title: "Dine-In",
    desc: "Enjoy a warm, welcoming atmosphere right at our restaurant in Johar Town.",
  },
  {
    icon: "🚗",
    title: "Drive Through",
    desc: "Quick and convenient — pick up your order without leaving your car.",
  },
  {
    icon: "🛵",
    title: "Home Delivery",
    desc: "Fresh, hot meals delivered straight to your doorstep, on time.",
  },
  {
    icon: "📦",
    title: "No-Contact Delivery",
    desc: "Safe, hygienic contactless delivery for your peace of mind.",
  },
];

function Services() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Flexible Options"
          title={<>Enjoy Papa&apos;s Cuisine Your Way</>}
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {services.map((s, i) => (
            <div
              key={s.title}
              className="reveal group p-8 rounded-2xl text-center transition-all duration-350 hover:-translate-y-1.5 hover:shadow-card-hover"
              style={{
                background: "#FDFAF6",
                border: "1px solid rgba(42,42,42,0.06)",
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5 transition-colors duration-300"
                style={{ background: "rgba(139,30,30,0.06)" }}
              >
                {s.icon}
              </div>
              <h3
                className="font-display text-lg font-bold mb-2.5"
                style={{ color: "#2A2A2A" }}
              >
                {s.title}
              </h3>
              <p className="font-body text-[13px] text-gray-500 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center reveal">
          <a
            href="tel:03334191194"
            data-ocid="services.call_button"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-body font-semibold text-base transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105"
            style={{
              background: "#C9A227",
              color: "#fff",
              boxShadow: "0 6px 28px rgba(201,162,39,0.42)",
            }}
          >
            📞 Call to Order · 0333 4191194
          </a>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   LOCATION
══════════════════════════════════════════════════════════════════════ */
function Location() {
  return (
    <section id="location" className="py-28 lg:py-32 cream-texture">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Find Us"
          title={<>Visit Papa&apos;s Cuisine</>}
        />

        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          <div className="reveal-left space-y-7">
            {[
              {
                icon: "📍",
                title: "Address",
                content: (
                  <>
                    <p>404, behind Bilal Masjid</p>
                    <p>Block E2, Phase 1 Johar Town</p>
                    <p>Lahore, Pakistan — 54000</p>
                  </>
                ),
              },
              {
                icon: "📞",
                title: "Phone",
                content: (
                  <a
                    href="tel:03334191194"
                    className="font-semibold hover:underline"
                    style={{ color: "#8B1E1E" }}
                  >
                    0333 4191194
                  </a>
                ),
              },
              {
                icon: "🕐",
                title: "Working Hours",
                content: (
                  <p>
                    <span className="font-semibold">Mon – Sun:</span> 8:00 AM –
                    7:00 PM
                  </p>
                ),
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-5">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: "rgba(139,30,30,0.07)" }}
                >
                  {item.icon}
                </div>
                <div>
                  <h4
                    className="font-display font-bold text-base mb-1"
                    style={{ color: "#2A2A2A" }}
                  >
                    {item.title}
                  </h4>
                  <div className="font-body text-gray-500 text-[14px] leading-relaxed">
                    {item.content}
                  </div>
                </div>
              </div>
            ))}

            <a
              href="https://maps.google.com/maps?q=Block+E2+Johar+Town+Lahore+Pakistan"
              target="_blank"
              rel="noreferrer"
              data-ocid="location.directions_button"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-body font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: "#8B1E1E",
                color: "#fff",
                boxShadow: "0 6px 24px rgba(139,30,30,0.28)",
              }}
            >
              🗺 Get Directions
            </a>
          </div>

          <div
            className="reveal-right rounded-3xl overflow-hidden"
            style={{
              boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
              minHeight: "400px",
            }}
          >
            <iframe
              src="https://maps.google.com/maps?q=Johar+Town+Lahore+Pakistan&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, display: "block", minHeight: "400px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Papa's Cuisine location map"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   FINAL CTA
══════════════════════════════════════════════════════════════════════ */
function FinalCTA() {
  return (
    <section className="relative py-36 overflow-hidden">
      <img
        src="/assets/generated/cta-bg.dim_1600x700.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(8,2,2,0.65) 0%, rgba(8,2,2,0.78) 100%)",
        }}
      />
      <div className="relative z-10 text-center text-white max-w-2xl mx-auto px-4 reveal">
        <span
          className="inline-block mb-5 text-[11px] font-body font-semibold tracking-[0.22em] uppercase"
          style={{ color: "#E8BC45" }}
        >
          Ready to Order?
        </span>
        <h2
          className="font-display text-5xl sm:text-6xl font-bold mb-5 leading-tight"
          style={{ letterSpacing: "-0.02em" }}
        >
          Craving Authentic
          <br />
          <em style={{ color: "#C9A227", fontStyle: "italic" }}>Flavor?</em>
        </h2>
        <p className="font-body text-base text-white/65 mb-11 leading-relaxed">
          Order now and enjoy the rich taste of Papa&apos;s Cuisine.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="tel:03334191194"
            data-ocid="cta.order_button"
            className="px-9 py-4 rounded-full font-body font-semibold text-base transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
            style={{
              background: "#C9A227",
              color: "#fff",
              boxShadow: "0 6px 28px rgba(201,162,39,0.45)",
            }}
          >
            🛵 Order Now
          </a>
          <a
            href="tel:03334191194"
            data-ocid="cta.call_button"
            className="px-9 py-4 rounded-full font-body font-semibold text-base border border-white/40 text-white hover:bg-white/10 transition-all duration-200"
          >
            📞 Call Restaurant
          </a>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════════════════════ */
function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer style={{ background: "#2A2A2A" }} className="pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <div
              className="font-display text-2xl font-bold mb-3"
              style={{ color: "#C9A227" }}
            >
              Papa&apos;s Cuisine
            </div>
            <p className="font-body text-sm text-gray-400 leading-relaxed mb-6">
              Authentic Asian cuisine served with passion in the heart of Johar
              Town, Lahore.
            </p>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: "rgba(201,162,39,0.12)",
                border: "1px solid rgba(201,162,39,0.25)",
              }}
            >
              <span className="font-display font-bold text-white">5.0</span>
              <span className="text-yellow-400">★★★★★</span>
              <span className="font-body text-xs text-gray-500">Google</span>
            </div>
          </div>

          <div>
            <h4 className="font-body font-semibold text-white/90 mb-5 text-xs tracking-[0.15em] uppercase">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Home", id: "home" },
                { label: "Menu", id: "menu" },
                { label: "About Us", id: "about" },
                { label: "Reviews", id: "reviews" },
                { label: "Contact", id: "location" },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(link.id)}
                    className="font-body text-sm text-gray-500 hover:text-yellow-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-body font-semibold text-white/90 mb-5 text-xs tracking-[0.15em] uppercase">
              Contact
            </h4>
            <ul className="space-y-3 font-body text-sm text-gray-500">
              <li className="flex gap-2.5 leading-relaxed">
                <span className="mt-0.5">📍</span>
                <span>
                  404 behind Bilal Masjid, Block E2, Johar Town, Lahore
                </span>
              </li>
              <li>
                <a
                  href="tel:03334191194"
                  className="flex gap-2.5 hover:text-yellow-400 transition-colors"
                >
                  <span>📞</span> 0333 4191194
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-body font-semibold text-white/90 mb-5 text-xs tracking-[0.15em] uppercase">
              Hours
            </h4>
            <div className="font-body text-sm text-gray-500 space-y-2">
              <div className="flex justify-between gap-4">
                <span>Mon – Sun</span>
                <span className="text-white/80">8:00 AM – 7:00 PM</span>
              </div>
              <div
                className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full text-xs"
                style={{ background: "rgba(139,30,30,0.25)", color: "#FCA5A5" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Currently Serving
              </div>
            </div>
          </div>
        </div>

        <div
          className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <p className="font-body text-xs text-gray-600">
            © {year} Papa&apos;s Cuisine – Lahore. All rights reserved.
          </p>
          <p className="font-body text-xs text-gray-700">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-gray-500 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════════════════════════════════ */
export default function App() {
  useReveal();

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <About />
        <Menu />
        <Features />
        <Reviews />
        <Services />
        <Location />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
