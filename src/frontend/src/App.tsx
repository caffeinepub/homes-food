import type { backendInterface } from "@/backend";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import {
  Check,
  ChevronRight,
  Facebook,
  Instagram,
  Loader2,
  MapPin,
  Menu,
  Phone,
  Star,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SiWhatsapp } from "react-icons/si";

/* ─────────────── Types ─────────────── */
interface OrderForm {
  name: string;
  phone: string;
  address: string;
  items: string;
  notes: string;
}

interface MealPlanForm {
  name: string;
  phone: string;
  planType: string;
  address: string;
}

interface ContactForm {
  name: string;
  phone: string;
  message: string;
}

type ModalType = "order" | "mealplan" | "contact" | null;

/* ─────────────── Constants ─────────────── */
const DISHES = [
  {
    name: "Chicken Biryani",
    desc: "Aromatic basmati rice cooked with flavorful spices and tender chicken, delivering the authentic taste of traditional homemade biryani.",
    img: "/assets/generated/dish-biryani.dim_600x450.jpg",
  },
  {
    name: "Chicken Qorma",
    desc: "Slow-cooked chicken in a rich, velvety yogurt and cashew gravy — fragrant with cardamom and saffron, just like dadi's recipe.",
    img: "/assets/generated/dish-qorma.dim_600x450.jpg",
  },
  {
    name: "Traditional Desi Meals",
    desc: "A wholesome desi thali with dal, sabzi, chapati, and rice — the full homemade experience in every satisfying bite.",
    img: "/assets/generated/dish-desi-meal.dim_600x450.jpg",
  },
  {
    name: "Homestyle Rice & Curry",
    desc: "Fluffy steamed basmati paired with a robust karahi curry, slow-cooked with tomatoes, ginger, and aromatic whole spices.",
    img: "/assets/generated/dish-rice-curry.dim_600x450.jpg",
  },
  {
    name: "Daily Mess Meals",
    desc: "Freshly prepared daily mess meals with a rotating menu — nutritious, hygienic, and reliably delicious every single day.",
    img: "/assets/generated/dish-mess-meal.dim_600x450.jpg",
  },
];

const REVIEWS = [
  {
    text: "I'm a student and regularly order mess from Homes Food. The taste is consistent and quality is excellent. Chicken biryani and qorma are my favorites. It truly feels like homemade food.",
    author: "Ahmed K.",
    role: "University Student",
    initials: "AK",
  },
  {
    text: "As a working professional, I don't have time to cook. Homes Food has been my go-to for months. Fresh, hygienic, and tastes just like my mom makes. Highly recommend!",
    author: "Sara M.",
    role: "Young Professional",
    initials: "SM",
  },
  {
    text: "Ordered for my family during a busy week. Everyone loved it. The packaging is clean and the food arrives hot. This is the real deal — genuinely homemade quality.",
    author: "Zain A.",
    role: "Family Customer",
    initials: "ZA",
  },
  {
    text: "The mess plan is perfect for hostel life. Affordable, fresh every day, and the qorma is absolutely amazing. 10/10! Will never go back to canteen food.",
    author: "Bilal R.",
    role: "Hostel Student",
    initials: "BR",
  },
];

const FEATURES = [
  {
    icon: "🏠",
    title: "Real Homemade Taste",
    desc: "Meals cooked exactly the way they're prepared in a real home kitchen — with care, tradition, and love.",
  },
  {
    icon: "🧼",
    title: "Clean & Hygienic Packaging",
    desc: "Food packed carefully under strict hygiene standards to ensure freshness, safety, and quality.",
  },
  {
    icon: "⏰",
    title: "24 Hour Availability",
    desc: "Order whenever you need a comforting meal. We're here day and night, every day of the week.",
  },
  {
    icon: "💰",
    title: "Student Friendly Prices",
    desc: "Premium quality homemade food at prices that fit a student's budget — no compromises.",
  },
  {
    icon: "🚚",
    title: "Reliable Delivery",
    desc: "Fast, dependable home delivery service that ensures your food arrives fresh and on time.",
  },
];

/* ─────────────── Scroll Reveal Hook ─────────────── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // Trigger visible on all fade-in-up children
            for (const child of entry.target.querySelectorAll(".fade-in-up")) {
              child.classList.add("visible");
            }
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/* ─────────────── Star Rating ─────────────── */
const STAR_POSITIONS = [1, 2, 3, 4, 5] as const;

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {STAR_POSITIONS.slice(0, count).map((pos) => (
        <Star key={pos} className="w-4 h-4 fill-brand-gold text-brand-gold" />
      ))}
    </div>
  );
}

/* ─────────────── Order Modal ─────────────── */
function OrderModal({
  open,
  onClose,
  prefillItem,
  actor,
}: {
  open: boolean;
  onClose: () => void;
  prefillItem?: string;
  actor: backendInterface | null;
}) {
  const [form, setForm] = useState<OrderForm>({
    name: "",
    phone: "",
    address: "",
    items: prefillItem || "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm((prev) => ({ ...prev, items: prefillItem || "" }));
      setSuccess(false);
      setError("");
    }
  }, [open, prefillItem]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.name || !form.phone || !form.address || !form.items) {
        setError("Please fill in all required fields.");
        return;
      }
      if (!actor) {
        setError("Service is loading. Please try again in a moment.");
        return;
      }
      setLoading(true);
      setError("");
      try {
        await actor.submitOrderRequest(
          form.name,
          form.phone,
          form.address,
          form.items,
          form.notes,
        );
        setSuccess(true);
      } catch {
        setError("Something went wrong. Please try again or call us directly.");
      } finally {
        setLoading(false);
      }
    },
    [form, actor],
  );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-md max-h-[90vh] overflow-y-auto"
        data-ocid="order.modal"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-brand-charcoal">
            Place Your Order
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div
            className="flex flex-col items-center gap-4 py-8 text-center"
            data-ocid="order.success_state"
          >
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-display text-xl font-semibold text-brand-charcoal">
              Order Received!
            </h3>
            <p className="text-brand-gray text-sm leading-relaxed">
              Thank you, <strong>{form.name}</strong>! We've received your order
              and will call you at <strong>{form.phone}</strong> to confirm
              within minutes.
            </p>
            <Button
              onClick={onClose}
              className="btn-gold px-8 py-2 rounded-full font-semibold mt-2"
              data-ocid="order.close_button"
            >
              Great, Thanks!
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="order-name"
                className="text-sm font-medium text-brand-charcoal"
              >
                Your Name <span className="text-brand-red">*</span>
              </Label>
              <Input
                id="order-name"
                placeholder="e.g. Ahmed Khan"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                className="border-border focus:border-brand-red"
                data-ocid="order.input"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="order-phone"
                className="text-sm font-medium text-brand-charcoal"
              >
                Phone Number <span className="text-brand-red">*</span>
              </Label>
              <Input
                id="order-phone"
                type="tel"
                placeholder="e.g. 0321 4854655"
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
                className="border-border focus:border-brand-red"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="order-address"
                className="text-sm font-medium text-brand-charcoal"
              >
                Delivery Address <span className="text-brand-red">*</span>
              </Label>
              <Input
                id="order-address"
                placeholder="Your full address in Lahore"
                value={form.address}
                onChange={(e) =>
                  setForm((p) => ({ ...p, address: e.target.value }))
                }
                className="border-border focus:border-brand-red"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="order-items"
                className="text-sm font-medium text-brand-charcoal"
              >
                Items / Dishes <span className="text-brand-red">*</span>
              </Label>
              <Textarea
                id="order-items"
                placeholder="e.g. Chicken Biryani x2, Chicken Qorma x1"
                value={form.items}
                onChange={(e) =>
                  setForm((p) => ({ ...p, items: e.target.value }))
                }
                className="border-border focus:border-brand-red resize-none"
                rows={3}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="order-notes"
                className="text-sm font-medium text-brand-charcoal"
              >
                Delivery Notes{" "}
                <span className="text-brand-gray text-xs font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                id="order-notes"
                placeholder="Any special instructions..."
                value={form.notes}
                onChange={(e) =>
                  setForm((p) => ({ ...p, notes: e.target.value }))
                }
                className="border-border focus:border-brand-red"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/5 px-3 py-2 rounded-md">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-border"
                data-ocid="order.close_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 btn-gold font-semibold"
                data-ocid="order.submit_button"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  "Place Order"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ─────────────── Meal Plan Modal ─────────────── */
function MealPlanModal({
  open,
  onClose,
  actor,
}: {
  open: boolean;
  onClose: () => void;
  actor: backendInterface | null;
}) {
  const [form, setForm] = useState<MealPlanForm>({
    name: "",
    phone: "",
    planType: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setSuccess(false);
      setError("");
    }
  }, [open]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.name || !form.phone || !form.planType || !form.address) {
        setError("Please fill in all required fields.");
        return;
      }
      if (!actor) {
        setError("Service is loading. Please try again in a moment.");
        return;
      }
      setLoading(true);
      setError("");
      try {
        await actor.submitMealPlanRequest(
          form.name,
          form.phone,
          form.planType,
          form.address,
        );
        setSuccess(true);
      } catch {
        setError("Something went wrong. Please try again or call us directly.");
      } finally {
        setLoading(false);
      }
    },
    [form, actor],
  );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md" data-ocid="mealplan.modal">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-brand-charcoal">
            Book Your Meal Plan
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div
            className="flex flex-col items-center gap-4 py-8 text-center"
            data-ocid="mealplan.success_state"
          >
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-display text-xl font-semibold text-brand-charcoal">
              Meal Plan Booked!
            </h3>
            <p className="text-brand-gray text-sm leading-relaxed">
              Thank you, <strong>{form.name}</strong>! Your{" "}
              <strong>{form.planType}</strong> meal plan is confirmed. We'll
              contact you at <strong>{form.phone}</strong> to finalize the
              details.
            </p>
            <Button
              onClick={onClose}
              className="btn-gold px-8 py-2 rounded-full font-semibold mt-2"
              data-ocid="mealplan.close_button"
            >
              Perfect, Thanks!
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="plan-name"
                className="text-sm font-medium text-brand-charcoal"
              >
                Your Name <span className="text-brand-red">*</span>
              </Label>
              <Input
                id="plan-name"
                placeholder="e.g. Sara Ahmed"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                className="border-border focus:border-brand-red"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="plan-phone"
                className="text-sm font-medium text-brand-charcoal"
              >
                Phone Number <span className="text-brand-red">*</span>
              </Label>
              <Input
                id="plan-phone"
                type="tel"
                placeholder="e.g. 0300 1234567"
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
                className="border-border focus:border-brand-red"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-brand-charcoal">
                Plan Type <span className="text-brand-red">*</span>
              </Label>
              <Select
                value={form.planType}
                onValueChange={(v) => setForm((p) => ({ ...p, planType: v }))}
              >
                <SelectTrigger
                  className="border-border"
                  data-ocid="mealplan.select"
                >
                  <SelectValue placeholder="Choose your plan..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily Plan</SelectItem>
                  <SelectItem value="Weekly">Weekly Plan</SelectItem>
                  <SelectItem value="Monthly">Monthly Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="plan-address"
                className="text-sm font-medium text-brand-charcoal"
              >
                Delivery Address <span className="text-brand-red">*</span>
              </Label>
              <Input
                id="plan-address"
                placeholder="Your full address in Lahore"
                value={form.address}
                onChange={(e) =>
                  setForm((p) => ({ ...p, address: e.target.value }))
                }
                className="border-border focus:border-brand-red"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/5 px-3 py-2 rounded-md">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                data-ocid="mealplan.close_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 btn-gold font-semibold"
                data-ocid="mealplan.submit_button"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  "Book Meal Plan"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ─────────────── Contact Modal ─────────────── */
function ContactModal({
  open,
  onClose,
  actor,
}: {
  open: boolean;
  onClose: () => void;
  actor: backendInterface | null;
}) {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setSuccess(false);
      setError("");
    }
  }, [open]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.name || !form.phone || !form.message) {
        setError("Please fill in all fields.");
        return;
      }
      if (!actor) {
        setError("Service is loading. Please try again in a moment.");
        return;
      }
      setLoading(true);
      setError("");
      try {
        await actor.submitContactRequest(form.name, form.phone, form.message);
        setSuccess(true);
      } catch {
        setError("Something went wrong. Please call us directly.");
      } finally {
        setLoading(false);
      }
    },
    [form, actor],
  );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md" data-ocid="contact.modal">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-brand-charcoal">
            Request a Callback
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-display text-xl font-semibold text-brand-charcoal">
              We'll Call You Back!
            </h3>
            <p className="text-brand-gray text-sm leading-relaxed">
              Thank you, <strong>{form.name}</strong>. We'll call you at{" "}
              <strong>{form.phone}</strong> very soon.
            </p>
            <Button
              onClick={onClose}
              className="btn-gold px-8 py-2 rounded-full font-semibold mt-2"
            >
              Sounds Good!
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="contact-name"
                className="text-sm font-medium text-brand-charcoal"
              >
                Your Name <span className="text-brand-red">*</span>
              </Label>
              <Input
                id="contact-name"
                placeholder="e.g. Bilal Hassan"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                className="border-border focus:border-brand-red"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="contact-phone"
                className="text-sm font-medium text-brand-charcoal"
              >
                Phone Number <span className="text-brand-red">*</span>
              </Label>
              <Input
                id="contact-phone"
                type="tel"
                placeholder="e.g. 0321 4854655"
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
                className="border-border focus:border-brand-red"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="contact-message"
                className="text-sm font-medium text-brand-charcoal"
              >
                Message <span className="text-brand-red">*</span>
              </Label>
              <Textarea
                id="contact-message"
                placeholder="How can we help you?"
                value={form.message}
                onChange={(e) =>
                  setForm((p) => ({ ...p, message: e.target.value }))
                }
                className="border-border focus:border-brand-red resize-none"
                rows={3}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/5 px-3 py-2 rounded-md">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 btn-gold font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ─────────────── Header ─────────────── */
function Header({
  onOrderClick,
}: {
  onOrderClick: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Menu", href: "#menu" },
    { label: "Meal Plans", href: "#meal-plans" },
    { label: "Why Us", href: "#why-us" },
    { label: "Contact", href: "#contact" },
  ];

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
        scrolled ? "header-scrolled" : "py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            onClick={() => handleNavClick("#home")}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-full bg-brand-red flex items-center justify-center text-white font-display font-bold text-sm">
              HF
            </div>
            <span className="font-display text-xl font-bold text-brand-red group-hover:text-brand-charcoal transition-colors">
              Homes Food
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-sm font-medium text-brand-charcoal hover:text-brand-red transition-colors"
                data-ocid={`nav.link.${i + 1}`}
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={onOrderClick}
              className="btn-gold px-6 py-2.5 rounded-full text-xs font-bold text-white uppercase tracking-wider"
              data-ocid="nav.primary_button"
            >
              Order Now
            </button>
          </nav>

          {/* Mobile Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((p) => !p)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-brand-charcoal hover:bg-brand-cream transition-colors"
            aria-label="Toggle navigation menu"
            data-ocid="nav.toggle"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileOpen ? "mobile-nav-open" : "mobile-nav-closed"
          }`}
        >
          <nav className="flex flex-col gap-1 pt-4 pb-4 border-t border-border mt-3">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium text-brand-charcoal hover:bg-brand-cream hover:text-brand-red transition-colors"
                data-ocid={`nav.link.${i + 1}`}
              >
                {link.label}
                <ChevronRight className="w-4 h-4 text-brand-gray" />
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOrderClick();
              }}
              className="btn-gold mt-2 py-3 rounded-xl text-xs font-bold text-white w-full uppercase tracking-wider"
              data-ocid="nav.primary_button"
            >
              Order Now
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

/* ─────────────── Hero Section ─────────────── */
function HeroSection({
  onOrderClick,
  onMenuClick,
}: {
  onOrderClick: () => void;
  onMenuClick: () => void;
}) {
  return (
    <section
      id="home"
      className="hero-grain relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/assets/generated/hero-food.dim_1600x900.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Multi-layer gradient for cinematic depth */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(20,12,8,0.25) 0%, rgba(30,15,10,0.45) 35%, rgba(15,8,5,0.88) 100%)",
        }}
      />
      {/* Vignette edges */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Decorative top band */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand-gold z-[3]" />

      <div className="relative z-[4] max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24">
        {/* Rating badge */}
        <div className="hero-animate inline-flex items-center gap-2.5 trust-badge px-5 py-2.5 rounded-full mb-8">
          <StarRating count={5} />
          <span className="text-white/90 text-xs font-semibold tracking-wider uppercase">
            5.0 Rated in Lahore
          </span>
        </div>

        {/* Editorial headline — two distinct lines with size contrast */}
        <h1 className="hero-animate delay-1 font-display text-white mb-2">
          <span className="hero-headline-primary block text-white/90 font-normal italic">
            Authentic Homemade
          </span>
          <span
            className="hero-headline-accent block text-brand-gold"
            style={{ textShadow: "0 2px 40px rgba(212,160,23,0.35)" }}
          >
            Food in Lahore
          </span>
        </h1>

        {/* Decorative rule between headline and sub */}
        <div className="hero-animate delay-2 hero-rule my-7" />

        {/* Subheadline */}
        <p className="hero-animate delay-2 text-base sm:text-lg text-white/75 max-w-xl mx-auto leading-relaxed mb-10 font-body tracking-wide">
          Freshly cooked desi meals prepared by a home chef — delivering the
          comfort of home directly to your doorstep.
        </p>

        {/* CTA Buttons */}
        <div className="hero-animate delay-3 flex flex-col sm:flex-row gap-3 justify-center mb-14">
          <button
            type="button"
            onClick={onOrderClick}
            className="btn-gold px-9 py-4 rounded-full text-sm font-bold text-white uppercase tracking-widest"
            data-ocid="hero.primary_button"
          >
            Order Now
          </button>
          <button
            type="button"
            onClick={onMenuClick}
            className="px-9 py-4 rounded-full text-sm font-bold text-white uppercase tracking-widest border-2 border-white/40 hover:border-white/70 hover:bg-white/10 transition-all duration-300"
            data-ocid="hero.secondary_button"
          >
            View Menu
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="hero-animate delay-4 flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
          {[
            { icon: "⭐", label: "5.0 Rating" },
            { icon: "🚚", label: "Fast Delivery" },
            { icon: "🍛", label: "Homemade Taste" },
            { icon: "🕒", label: "Open 24 Hours" },
          ].map((badge) => (
            <div
              key={badge.label}
              className="trust-badge flex items-center gap-2 px-4 py-2.5 rounded-full"
            >
              <span className="text-base">{badge.icon}</span>
              <span className="text-xs text-white/85 font-medium whitespace-nowrap">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 z-[4]">
        <div className="w-5 h-8 rounded-full border border-white/40 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-white/70 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}

/* ─────────────── About Section ─────────────── */
function AboutSection() {
  const ref = useScrollReveal();

  return (
    <section id="about" className="py-20 sm:py-28 bg-brand-cream" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <div>
            <p className="fade-in-up section-eyebrow text-brand-red text-xs font-bold tracking-widest uppercase mb-4">
              Our Story
            </p>
            <h2 className="fade-in-up delay-1 font-display text-3xl sm:text-4xl md:text-5xl font-bold text-brand-charcoal leading-tight mb-4">
              The Taste of Home,{" "}
              <em className="not-italic text-brand-red">Away From Home</em>
            </h2>
            <div className="spice-divider-left mb-8" />
            <div className="fade-in-up delay-2 space-y-4 text-brand-gray leading-relaxed font-body">
              <p>
                Homes Food is a home-chef kitchen dedicated to bringing
                authentic homemade meals to students, families, and
                professionals in Lahore. Every dish is prepared with care,
                hygiene, and traditional recipes that deliver the comforting
                taste of real home cooking.
              </p>
              <p>
                Whether you're a student missing home food or a busy
                professional looking for reliable meals, Homes Food ensures
                every order is fresh, flavorful, and satisfying. We cook with
                the same love and attention your family puts into every meal.
              </p>
              <p>
                Located in BOR Society, Lahore — we serve the entire city with
                consistent quality, reliable delivery, and student-friendly
                pricing that never compromises on taste.
              </p>
            </div>

            {/* Stats */}
            <div className="fade-in-up delay-3 grid grid-cols-3 gap-6 mt-10">
              {[
                { num: "5.0", label: "Customer Rating" },
                { num: "24/7", label: "Available" },
                { num: "100%", label: "Homemade" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-display text-3xl font-bold text-brand-red">
                    {stat.num}
                  </div>
                  <div className="text-xs text-brand-gray mt-1 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative right column */}
          <div className="fade-in-up delay-2 relative hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-sm">
              {/* Main decorative card */}
              <div
                className="relative rounded-3xl overflow-hidden shadow-red"
                style={{ aspectRatio: "4/5" }}
              >
                <img
                  src="/assets/generated/dish-biryani.dim_600x450.jpg"
                  alt="Authentic homemade biryani"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(158,42,43,0.7) 0%, transparent 60%)",
                  }}
                />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="font-display text-2xl font-bold text-white">
                    Chicken Biryani
                  </p>
                  <p className="text-white/80 text-sm mt-1">
                    Our signature dish
                  </p>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand-gold rounded-full flex flex-col items-center justify-center shadow-gold text-white text-center">
                <StarRating count={5} />
                <span className="font-display font-bold text-sm mt-1">
                  5.0/5
                </span>
              </div>

              {/* Bottom accent card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-card flex items-center gap-3">
                <span className="text-3xl">🍛</span>
                <div>
                  <p className="font-semibold text-brand-charcoal text-sm">
                    Open 24 Hours
                  </p>
                  <p className="text-brand-gray text-xs">Order anytime</p>
                </div>
              </div>
            </div>

            {/* Background pattern */}
            <div
              className="absolute inset-0 rounded-3xl -z-10"
              style={{
                background:
                  "radial-gradient(circle at 70% 40%, oklch(0.41 0.155 22 / 0.08) 0%, transparent 60%)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Menu Section ─────────────── */
function MenuSection({
  onOrderClick,
}: { onOrderClick: (item: string) => void }) {
  const ref = useScrollReveal();

  return (
    <section
      id="menu"
      className="py-20 sm:py-28 bg-white food-pattern"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="fade-in-up text-brand-red text-xs font-bold tracking-widest uppercase mb-4">
            What We Cook
          </p>
          <h2 className="fade-in-up delay-1 font-display text-3xl sm:text-4xl md:text-5xl font-bold text-brand-charcoal">
            Our Popular Dishes
          </h2>
          <div className="fade-in-up delay-2 spice-divider mt-5 mb-5" />
          <p className="fade-in-up delay-2 text-brand-gray max-w-xl mx-auto font-body text-base leading-relaxed">
            Every dish is prepared fresh daily using traditional recipes and the
            finest ingredients, delivering genuine homemade flavor in every
            bite.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {DISHES.map((dish, i) => (
            <article
              key={dish.name}
              className={`fade-in-up delay-${Math.min(i + 1, 5)} menu-card bg-white rounded-2xl overflow-hidden shadow-card border border-border`}
              data-ocid={`menu.item.${i + 1}`}
            >
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: "4/3" }}
              >
                <img
                  src={dish.img}
                  alt={dish.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(43,43,43,0.5) 0%, transparent 60%)",
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-brand-charcoal mb-2 leading-tight">
                  {dish.name}
                </h3>
                <p className="text-brand-gray text-sm leading-relaxed mb-5 font-body">
                  {dish.desc}
                </p>
                <button
                  type="button"
                  onClick={() => onOrderClick(dish.name)}
                  className="btn-gold w-full py-3 rounded-xl text-xs font-bold text-white uppercase tracking-wider"
                  data-ocid={`menu.order_button.${i + 1}`}
                >
                  Order Now
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Meal Plans Section ─────────────── */
function MealPlanSection({ onBookClick }: { onBookClick: () => void }) {
  const ref = useScrollReveal();

  const features = [
    "Daily fresh meals cooked to order",
    "Consistent taste and quality, every day",
    "Hygienic, clean packaging for every meal",
    "Reliable and punctual delivery service",
    "Budget-friendly pricing for students",
  ];

  return (
    <section
      id="meal-plans"
      className="py-20 sm:py-28 bg-brand-red relative overflow-hidden"
      ref={ref}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 50%, white 0%, transparent 40%), radial-gradient(circle at 75% 20%, white 0%, transparent 35%)",
        }}
      />

      {/* Decorative food icons */}
      <div className="absolute right-8 top-12 text-6xl opacity-10 hidden lg:block">
        🍛
      </div>
      <div className="absolute left-12 bottom-12 text-5xl opacity-10 hidden lg:block">
        🍽️
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <p className="fade-in-up text-brand-gold text-xs font-bold tracking-widest uppercase mb-4">
              Meal Plans
            </p>
            <h2 className="fade-in-up delay-1 font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Affordable Mess Plans
              <em className="not-italic block text-brand-gold font-normal">
                for Students
              </em>
            </h2>
            <p className="fade-in-up delay-2 text-white/80 text-base leading-relaxed mb-8 font-body max-w-lg">
              Homes Food offers convenient and affordable meal plans designed
              for students and professionals. Get fresh, home-cooked meals
              delivered daily — no cooking, no hassle, just great food.
            </p>

            <ul className="fade-in-up delay-3 space-y-3 mb-10">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-brand-gold" />
                  </div>
                  <span className="text-white/90 text-sm font-body">{f}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={onBookClick}
              className="fade-in-up delay-4 btn-gold px-10 py-4 rounded-full text-sm font-bold text-white uppercase tracking-wider"
              data-ocid="mealplan.primary_button"
            >
              Book Your Meal Plan
            </button>
          </div>

          {/* Plan Cards */}
          <div className="fade-in-up delay-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                plan: "Daily",
                desc: "Perfect for trying us out or occasional meals",
                popular: false,
              },
              {
                plan: "Weekly",
                desc: "Commit to a week of fresh homemade meals",
                popular: true,
              },
              {
                plan: "Monthly",
                desc: "Maximum savings, maximum convenience",
                popular: false,
              },
            ].map((p) => (
              <div
                key={p.plan}
                className={`relative rounded-2xl p-5 text-center transition-transform duration-300 hover:-translate-y-1 ${
                  p.popular
                    ? "bg-brand-gold text-white shadow-gold"
                    : "bg-white/10 backdrop-blur-sm border border-white/20 text-white"
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-charcoal text-white text-xs px-3 py-1 rounded-full font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="text-3xl mb-3">
                  {p.plan === "Daily" ? "🍱" : p.plan === "Weekly" ? "📅" : "🗓️"}
                </div>
                <h3
                  className={`font-display text-xl font-bold mb-2 ${p.popular ? "text-white" : ""}`}
                >
                  {p.plan} Plan
                </h3>
                <p
                  className={`text-xs leading-relaxed ${p.popular ? "text-white/80" : "text-white/70"}`}
                >
                  {p.desc}
                </p>
                <button
                  type="button"
                  onClick={onBookClick}
                  className={`mt-4 w-full py-2 rounded-xl text-xs font-semibold transition-colors ${
                    p.popular
                      ? "bg-white text-brand-gold hover:bg-white/90"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Why Choose Us Section ─────────────── */
function WhyUsSection() {
  const ref = useScrollReveal();

  return (
    <section id="why-us" className="py-20 sm:py-28 bg-brand-cream" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="fade-in-up text-brand-red text-xs font-bold tracking-widest uppercase mb-4">
            Our Promise
          </p>
          <h2 className="fade-in-up delay-1 font-display text-3xl sm:text-4xl md:text-5xl font-bold text-brand-charcoal">
            Why People{" "}
            <span className="italic font-normal text-brand-red">Love</span>{" "}
            Homes Food
          </h2>
          <div className="fade-in-up delay-2 spice-divider mt-5" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`fade-in-up delay-${Math.min(i + 1, 5)} feature-icon bg-white rounded-2xl p-7 shadow-card border border-border hover:border-brand-gold/30 transition-all duration-300 hover:shadow-card-hover cursor-default`}
            >
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="font-display text-lg font-bold text-brand-charcoal mb-2">
                {f.title}
              </h3>
              <p className="text-brand-gray text-sm leading-relaxed font-body">
                {f.desc}
              </p>
            </div>
          ))}

          {/* Testimonial accent card */}
          <div className="fade-in-up delay-5 bg-brand-red rounded-2xl p-7 text-white flex flex-col justify-between">
            <div>
              <StarRating count={5} />
              <p className="mt-4 text-white/90 text-sm leading-relaxed font-body italic">
                "Homes Food gave me the comfort of home food right here in
                Lahore. The taste, the hygiene, the delivery — everything is
                perfect."
              </p>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center text-white font-bold text-sm">
                AK
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Ahmed Khan</p>
                <p className="text-white/60 text-xs">
                  University Student, Lahore
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Reviews Section ─────────────── */
function ReviewsSection() {
  const ref = useScrollReveal();

  return (
    <section id="reviews" className="py-20 sm:py-28 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="fade-in-up text-brand-red text-xs font-bold tracking-widest uppercase mb-4">
            Customer Love
          </p>
          <h2 className="fade-in-up delay-1 font-display text-3xl sm:text-4xl md:text-5xl font-bold text-brand-charcoal">
            What Our Customers Say
          </h2>
          <div className="fade-in-up delay-2 flex justify-center gap-1 mt-5">
            <StarRating count={5} />
          </div>
          <p className="fade-in-up delay-3 text-brand-gray text-sm mt-2 font-body">
            Consistently rated 5.0 across all reviews
          </p>
        </div>

        {/* Reviews grid — horizontal scroll on mobile */}
        <div className="flex gap-5 overflow-x-auto reviews-scroll sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible pb-4 sm:pb-0">
          {REVIEWS.map((review, i) => (
            <div
              key={review.author}
              className={`fade-in-up delay-${Math.min(i + 1, 5)} review-card rounded-2xl p-6 flex-shrink-0 w-72 sm:w-auto flex flex-col gap-4`}
            >
              <StarRating count={5} />
              <p className="text-brand-gray text-sm leading-relaxed flex-1 font-body italic">
                "{review.text}"
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-brand-red flex items-center justify-center text-white font-bold text-xs font-body">
                  {review.initials}
                </div>
                <div>
                  <p className="font-semibold text-brand-charcoal text-sm">
                    {review.author}
                  </p>
                  <p className="text-brand-gray text-xs">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall rating */}
        <div className="fade-in-up delay-3 mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 py-8 bg-brand-cream rounded-3xl px-8">
          <div className="text-center">
            <div className="font-display text-6xl font-bold text-brand-red">
              5.0
            </div>
            <div className="text-brand-gray text-sm mt-1">Overall Rating</div>
          </div>
          <div className="hidden sm:block w-px h-16 bg-border" />
          <div className="flex flex-col gap-2">
            <StarRating count={5} />
            <p className="text-brand-charcoal font-medium text-sm">
              Based on customer reviews
            </p>
            <p className="text-brand-gray text-xs">
              BOR Society, Lahore, Pakistan
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Contact / Order Section ─────────────── */
function ContactSection({
  onOrderClick,
}: {
  onOrderClick: () => void;
}) {
  const ref = useScrollReveal();

  return (
    <section
      id="contact"
      className="py-24 sm:py-32 bg-brand-charcoal relative overflow-hidden"
      ref={ref}
    >
      {/* Decorative quote backdrop */}
      <div className="contact-deco absolute inset-0 pointer-events-none" />

      {/* Radial glow */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 50% 0%, white 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top eyebrow */}
        <div className="fade-in-up flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 text-brand-gold text-xs font-bold tracking-widest uppercase">
            <span className="block w-6 h-px bg-brand-gold/60" />
            Ready to Order
            <span className="block w-6 h-px bg-brand-gold/60" />
          </span>
        </div>

        <h2 className="fade-in-up delay-1 font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-5 leading-tight">
          Ready to Enjoy{" "}
          <span className="text-brand-gold italic font-normal">
            Homemade Food?
          </span>
        </h2>
        <p className="fade-in-up delay-2 text-white/60 text-lg mb-12 max-w-md mx-auto font-body leading-relaxed">
          Order now and enjoy fresh, delicious homemade meals delivered straight
          to your door.
        </p>

        {/* CTA Buttons */}
        <div className="fade-in-up delay-3 flex flex-col sm:flex-row gap-4 justify-center mb-14">
          <a
            href="tel:03214854655"
            className="flex items-center justify-center gap-3 px-9 py-4 rounded-full text-sm font-bold text-brand-charcoal bg-white hover:bg-brand-cream transition-all duration-300 shadow-lg uppercase tracking-wider hover:shadow-xl hover:-translate-y-0.5"
            data-ocid="contact.primary_button"
          >
            <Phone className="w-4 h-4" />
            Call to Order
          </a>
          <button
            type="button"
            onClick={onOrderClick}
            className="btn-gold flex items-center justify-center gap-3 px-9 py-4 rounded-full text-sm font-bold text-white uppercase tracking-wider"
            data-ocid="contact.secondary_button"
          >
            🚚 Book Delivery
          </button>
        </div>

        {/* Contact Info */}
        <div className="fade-in-up delay-4 flex flex-col sm:flex-row items-center justify-center gap-6 text-white/50 text-sm font-body">
          <a
            href="tel:03214854655"
            className="flex items-center gap-2 hover:text-brand-gold transition-colors"
          >
            <Phone className="w-4 h-4 text-brand-gold" />
            <span>0321 4854655</span>
          </a>
          <span className="hidden sm:block w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-gold" />
            <span>BOR Society, Lahore, Pakistan</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Delivery Area Section ─────────────── */
function DeliverySection() {
  const ref = useScrollReveal();

  return (
    <section id="delivery" className="py-20 sm:py-24 bg-brand-cream" ref={ref}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="fade-in-up text-brand-red text-sm font-semibold tracking-widest uppercase mb-3">
          Delivery
        </p>
        <h2 className="fade-in-up delay-1 font-display text-3xl sm:text-4xl font-bold text-brand-charcoal mb-5">
          Serving Lahore
        </h2>
        <p className="fade-in-up delay-2 text-brand-gray max-w-xl mx-auto mb-10 font-body leading-relaxed">
          Homes Food proudly serves customers across Lahore with fresh homemade
          meals and reliable delivery. Based in BOR Society, we deliver to your
          doorstep with care.
        </p>

        {/* Map placeholder card */}
        <div className="fade-in-up delay-3 relative bg-white rounded-3xl p-8 sm:p-12 shadow-card border border-border overflow-hidden">
          {/* Decorative background */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 50%, oklch(0.41 0.155 22) 0%, transparent 50%)
              `,
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                repeating-linear-gradient(0deg, oklch(0.41 0.155 22) 0px, oklch(0.41 0.155 22) 1px, transparent 1px, transparent 30px),
                repeating-linear-gradient(90deg, oklch(0.41 0.155 22) 0px, oklch(0.41 0.155 22) 1px, transparent 1px, transparent 30px)
              `,
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-brand-red/10 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-brand-red" />
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold text-brand-charcoal">
                📍 BOR Society, Lahore, Pakistan
              </h3>
              <p className="text-brand-gray mt-2 font-body">
                Board of Revenue Housing Society · Lahore 56000
              </p>
            </div>

            {/* Delivery radius indicators */}
            <div className="grid grid-cols-3 gap-4 mt-4 w-full max-w-sm">
              {[
                { label: "BOR Society", status: "Base" },
                { label: "DHA Lahore", status: "Delivery" },
                { label: "Gulberg", status: "Delivery" },
              ].map((area) => (
                <div
                  key={area.label}
                  className="bg-brand-cream rounded-xl py-3 px-2 text-center"
                >
                  <div className="w-2 h-2 rounded-full bg-brand-red mx-auto mb-2" />
                  <p className="text-brand-charcoal font-semibold text-xs">
                    {area.label}
                  </p>
                  <p className="text-brand-gray text-xs">{area.status}</p>
                </div>
              ))}
            </div>

            <a
              href="tel:03214854655"
              className="mt-2 inline-flex items-center gap-2 text-brand-red font-semibold text-sm hover:text-brand-charcoal transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call to confirm delivery to your area
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Footer ─────────────── */
function Footer({ onOrderClick }: { onOrderClick: () => void }) {
  const year = new Date().getFullYear();

  const quickLinks = [
    { label: "Menu", href: "#menu" },
    { label: "Order Now", action: onOrderClick },
    { label: "Contact", href: "#contact" },
    { label: "Location", href: "#delivery" },
  ];

  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-brand-red text-white">
      {/* Top decorative border */}
      <div className="h-1 bg-brand-gold" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-display font-bold">
                HF
              </div>
              <span className="font-display text-2xl font-bold">
                Homes Food
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed font-body max-w-xs">
              Authentic Homemade Taste, Delivered Fresh. Real home-cooked desi
              meals for students, families, and professionals in Lahore.
            </p>
            <div className="mt-4 flex items-center gap-1">
              <StarRating count={5} />
              <span className="text-white/80 text-sm ml-1">5.0 Rating</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              {quickLinks.map((link, i) =>
                link.action ? (
                  <button
                    key={link.label}
                    type="button"
                    onClick={link.action}
                    className="text-left text-white/70 hover:text-brand-gold transition-colors text-sm font-body"
                    data-ocid={`footer.link.${i + 1}`}
                  >
                    {link.label}
                  </button>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleScroll(link.href!);
                    }}
                    className="text-white/70 hover:text-brand-gold transition-colors text-sm font-body"
                    data-ocid={`footer.link.${i + 1}`}
                  >
                    {link.label}
                  </a>
                ),
              )}
            </nav>
          </div>

          {/* Contact + Social */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">
              Get In Touch
            </h3>
            <div className="flex flex-col gap-3 mb-6">
              <a
                href="tel:03214854655"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-body"
              >
                <Phone className="w-4 h-4 text-brand-gold" />
                0321 4854655
              </a>
              <div className="flex items-center gap-2 text-white/70 text-sm font-body">
                <MapPin className="w-4 h-4 text-brand-gold" />
                BOR Society, Lahore, Pakistan
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3">
              <button
                type="button"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-gold transition-colors flex items-center justify-center"
              >
                <Facebook className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-gold transition-colors flex items-center justify-center"
              >
                <Instagram className="w-4 h-4" />
              </button>
              <a
                href="https://wa.me/923214854655"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-gold transition-colors flex items-center justify-center"
              >
                <SiWhatsapp className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/60 text-sm font-body text-center sm:text-left">
            © {year} Homes Food — Homemade Taste in Lahore
          </p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 text-xs hover:text-white/60 transition-colors font-body"
          >
            Built with ♥ using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────── App Root ─────────────── */
export default function App() {
  const { actor } = useActor();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [orderPrefill, setOrderPrefill] = useState<string>("");

  const openOrder = useCallback((item?: string) => {
    setOrderPrefill(item || "");
    setActiveModal("order");
  }, []);

  const openMealPlan = useCallback(() => setActiveModal("mealplan"), []);
  const closeModal = useCallback(() => setActiveModal(null), []);

  const scrollToMenu = useCallback(() => {
    const el = document.querySelector("#menu");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen font-body">
      <Header onOrderClick={() => openOrder()} />

      <main>
        <HeroSection
          onOrderClick={() => openOrder()}
          onMenuClick={scrollToMenu}
        />
        <AboutSection />
        <MenuSection onOrderClick={openOrder} />
        <MealPlanSection onBookClick={openMealPlan} />
        <WhyUsSection />
        <ReviewsSection />
        <ContactSection onOrderClick={() => openOrder()} />
        <DeliverySection />
      </main>

      <Footer onOrderClick={() => openOrder()} />

      {/* Floating WhatsApp CTA */}
      <a
        href="https://wa.me/923214854655"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1"
        aria-label="Chat on WhatsApp"
      >
        <SiWhatsapp className="w-7 h-7 text-white" />
      </a>

      {/* Modals */}
      <OrderModal
        open={activeModal === "order"}
        onClose={closeModal}
        prefillItem={orderPrefill}
        actor={actor}
      />
      <MealPlanModal
        open={activeModal === "mealplan"}
        onClose={closeModal}
        actor={actor}
      />
      <ContactModal
        open={activeModal === "contact"}
        onClose={closeModal}
        actor={actor}
      />
    </div>
  );
}
