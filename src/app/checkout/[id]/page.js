'use client';
import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { getCourse } from '@/data/courses';
import { useUser, RedirectToSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { PAYMENT_CONFIG, formatPrice, getEmiAmount } from '@/config/payment';
import { temporaryDirectEnroll, checkEnrollmentStatus } from '@/actions/enroll';
import { createRazorpayOrder } from '@/actions/payment';
import styles from './checkout.module.css';

export default function CheckoutPage({ params }) {
  // In Next.js 15/16, params may be a Promise — unwrap with React.use()
  const { id: courseId } = use(params);
  const { isLoaded, isSignedIn, user } = useUser();
  const [course, setCourse] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', linkedin: '' });
  const [loading, setLoading] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    getCourse(courseId).then(setCourse);
  }, [courseId]);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // Auto-fill form
      setForm(f => ({
        ...f,
        name: user.fullName || '',
        email: user.primaryEmailAddress?.emailAddress || ''
      }));

      // Check if already enrolled
      checkEnrollmentStatus(courseId).then(res => {
        if (res.enrolled) {
          router.push(`/dashboard/learn/${courseId}`);
        }
      });
    }
  }, [isLoaded, isSignedIn, user, courseId, router]);

  if (!isLoaded) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading user details...</div>;
  if (!isSignedIn) return <RedirectToSignIn />;
  if (!course) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading course details...</div>;

  if (!course) {
    return (
      <div className={styles.notFound}>
        <h1>Course not found.</h1>
        <Link href="/#programs" className="btnPrimary">Back to Programs</Link>
      </div>
    );
  }

  const emiAmount = getEmiAmount(course.price, course.emiMonths);

  function validate() {
    const errs = {};
    if (!form.phone.trim() || !/^\+?[0-9]{10,13}$/.test(form.phone.replace(/\s/g, ''))) errs.phone = 'Enter a valid 10-digit phone number.';
    return errs;
  }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(errs => ({ ...errs, [e.target.name]: '' }));
  }

  async function handlePay(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    if (!PAYMENT_CONFIG.isLive) {
      setShowFallback(true);
      return;
    }

    // ========================================================
    // RAZORPAY INTEGRATION — SECURE SERVER SIDE ORDER
    // ========================================================
    setLoading(true);

    const orderRes = await createRazorpayOrder(course.id);
    
    if (!orderRes.success) {
      if (orderRes.error === 'PAYMENT_GATEWAY_NOT_CONFIGURED') {
        setShowFallback(true);
      } else {
        alert("Payment Error: " + orderRes.error);
      }
      setLoading(false);
      return;
    }

    const options = {
      key: PAYMENT_CONFIG.razorpayKeyId,
      amount: orderRes.amount, // Secured amount from server
      order_id: orderRes.orderId, // Secure Order ID
      currency: PAYMENT_CONFIG.currency,
      name: PAYMENT_CONFIG.company,
      description: course.title,
      image: PAYMENT_CONFIG.logo,
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      notes: {
        course: course.id,
        linkedin: form.linkedin,
      },
      theme: { color: '#C8A86B' },
      handler: async function (response) {
        try {
          // Temporary direct enrollment until webhook is configured
          const res = await temporaryDirectEnroll(course.id, response.razorpay_payment_id, orderRes.amount / 100);
          
          if (!res.success) {
            throw new Error(res.error || 'Failed to enroll');
          }
          
          window.location.href = `/dashboard/learn/${course.id}?success=1`;
        } catch (err) {
          console.error('Enrollment error:', err);
          alert('Payment succeeded but enrollment failed. Please contact support.');
          window.location.href = '/dashboard';
        }
      },
      modal: {
        ondismiss: () => setLoading(false),
      },
    };

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      const rzp = new window.Razorpay(options);
      rzp.open();
      setLoading(false);
    };
    document.body.appendChild(script);
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerSpacer} />

      <div className={styles.layout}>
        {/* ---- Order Summary ---- */}
        <aside className={styles.summary}>
          <Link href={`/courses/${course.id}`} className={styles.backLink}>
            ← Back to Course
          </Link>

          <div className={styles.summaryCard}>
            <div className={styles.summaryHeader} style={{ '--course-color': course.color }}>
              <div className={styles.summaryHeaderGlow} />
              <div className={styles.summaryBadge}>{course.badge}</div>
              <h2 className={styles.summaryTitle}>{course.title}</h2>
              <p className={styles.summaryTagline}>{course.tagline}</p>
            </div>

            <div className={styles.summaryBody}>
              <div className={styles.priceLine}>
                <span>Program Fee</span>
                <strong>{formatPrice(course.price)}</strong>
              </div>
              <div className={styles.emiLine}>
                EMI option: {formatPrice(emiAmount)}/mo × {course.emiMonths} months
              </div>
              <hr className={styles.divider}/>

              <ul className={styles.includesList}>
                {(course.features || [
                  course.sessions + ' live sessions',
                  course.hours + ' of recorded content',
                  'Real project reviews',
                  '1-on-1 mentorship access',
                  'Portfolio building',
                  '7-day money-back guarantee',
                ]).map(item => (
                  <li key={item} className={styles.includesItem}>
                    <span className={styles.includesCheck}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className={styles.cohortInfo}>
                <div className={styles.cohortRow}><span>Next Cohort</span><strong>June 15, 2026</strong></div>
                <div className={styles.cohortRow}><span>Batch Size</span><strong>Max 40 Students</strong></div>
                <div className={styles.cohortRow}><span>Mode</span><strong>{course.mode}</strong></div>
              </div>
            </div>
          </div>
        </aside>

        {/* ---- Enrollment Form ---- */}
        <main className={styles.formSection}>
          <h1 className={styles.formTitle}>Complete Your Enrollment</h1>
          <p className={styles.formSubtitle}>
            You're one step away from joining India's most advanced bridge engineering cohort.
          </p>

          <form className={styles.form} onSubmit={handlePay} noValidate>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>Full Name (From Profile) *</label>
              <input
                id="name"
                name="name"
                type="text"
                className={`${styles.input}`}
                value={form.name}
                disabled
                style={{ opacity: 0.7, cursor: 'not-allowed', background: 'rgba(255,255,255,0.05)' }}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>Email Address (From Profile) *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`${styles.input}`}
                  value={form.email}
                  disabled
                  style={{ opacity: 0.7, cursor: 'not-allowed', background: 'rgba(255,255,255,0.05)' }}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.label}>Phone Number *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={handleChange}
                />
                {errors.phone && <span className={styles.errorMsg}>{errors.phone}</span>}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="linkedin" className={styles.label}>LinkedIn Profile (Optional)</label>
              <input
                id="linkedin"
                name="linkedin"
                type="url"
                className={styles.input}
                placeholder="https://linkedin.com/in/yourname"
                value={form.linkedin}
                onChange={handleChange}
              />
            </div>
            <div className={styles.payButton}>
              <button
                type="submit"
                className="btnGold"
                style={{ width: '100%', fontSize: '1.125rem', padding: '1.125rem' }}
                disabled={loading}
                id="pay-now-btn"
              >
                {loading 
                  ? 'Processing...' 
                  : `Pay ${formatPrice(course.price)} Securely`}
              </button>
              <p className={styles.payNote}>
                🔒 Secured by Razorpay · UPI · Cards · Net Banking · EMI
              </p>
            </div>
          </form>
        </main>
      </div>

      {/* ---- Payment Not Live Fallback Modal ---- */}
      {showFallback && (
        <div className={styles.modalOverlay} onClick={() => setShowFallback(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowFallback(false)}>✕</button>
            <div className={styles.modalIcon}>🚀</div>
            <h2 className={styles.modalTitle}>Payment Gateway Coming Soon</h2>
            <p className={styles.modalDesc}>
              We're finalising our payment setup. In the meantime, apply via WhatsApp or email and we'll
              get you enrolled manually within 24 hours.
            </p>
            <div className={styles.modalActions}>
              <a
                href={`https://wa.me/${PAYMENT_CONFIG.whatsappNumber}?text=Hi, I'd like to enroll in the ${course.title} program.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btnGold"
                style={{ width: '100%', textAlign: 'center' }}
              >
                💬 Apply via WhatsApp
              </a>
              <a
                href={`mailto:${PAYMENT_CONFIG.supportEmail}?subject=Enrollment: ${course.title}&body=Name: ${form.name}%0AEmail: ${form.email}%0APhone: ${form.phone}`}
                className="btnSecondary"
                style={{ width: '100%', textAlign: 'center' }}
              >
                ✉️ Apply via Email
              </a>
            </div>
            <p className={styles.modalNote}>
              Your details have been noted. Our admissions team will contact you within 24 hours.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
