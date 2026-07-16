'use client';
import { useState, use } from 'react';
import Link from 'next/link';
import { getCourse } from '@/data/courses';
import { PAYMENT_CONFIG, formatPrice, getEmiAmount } from '@/config/payment';
import { enrollUserInCourse } from '@/actions/enroll';
import styles from './checkout.module.css';

export default function CheckoutPage({ params }) {
  // In Next.js 15/16, params may be a Promise — unwrap with React.use()
  const { id: courseId } = use(params);
  const course = getCourse(courseId);

  const [form, setForm] = useState({ name: '', email: '', phone: '', linkedin: '', utr: '' });
  const [loading, setLoading] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('online');

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
    if (!form.name.trim()) errs.name = 'Full name is required.';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'A valid email is required.';
    if (!form.phone.trim() || !/^\+?[0-9]{10,13}$/.test(form.phone.replace(/\s/g, ''))) errs.phone = 'Enter a valid 10-digit phone number.';
    if (paymentMethod === 'bank' && !form.utr.trim()) errs.utr = 'Transaction ID (UTR) is required.';
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

    if (paymentMethod === 'bank') {
      setLoading(true);
      // Execute Server Action to save enrollment to Supabase
      const res = await enrollUserInCourse(course.id, form.utr, 'bank', course.price);
      
      if (res.success) {
        window.location.href = `/contact?enrolled=1&method=bank`;
      } else {
        alert(res.error || 'Failed to submit enrollment.');
        setLoading(false);
      }
      return;
    }

    if (!PAYMENT_CONFIG.isLive) {
      setShowFallback(true);
      return;
    }

    // ========================================================
    // RAZORPAY INTEGRATION — goes live once key is set
    // ========================================================
    setLoading(true);
    const options = {
      key: PAYMENT_CONFIG.razorpayKeyId,
      amount: course.price * 100, // paise
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
      handler: function (response) {
        // Payment success — redirect to thank you page
        window.location.href = `/contact?enrolled=1&payment_id=${response.razorpay_payment_id}`;
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

          <div className={styles.paymentToggle}>
            <button 
              type="button" 
              className={`${styles.toggleBtn} ${paymentMethod === 'online' ? styles.toggleBtnActive : ''}`}
              onClick={() => { setPaymentMethod('online'); setErrors({}); }}
            >
              Pay Online Instantly
            </button>
            <button 
              type="button" 
              className={`${styles.toggleBtn} ${paymentMethod === 'bank' ? styles.toggleBtnActive : ''}`}
              onClick={() => { setPaymentMethod('bank'); setErrors({}); }}
            >
              Direct Bank Transfer
            </button>
          </div>

          <form className={styles.form} onSubmit={handlePay} noValidate>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>Full Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                placeholder="e.g. Rahul Sharma"
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>Email Address *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
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

            {paymentMethod === 'bank' && (
              <>
                <div className={styles.bankDetailsBox}>
                  <h3>Company Bank Details</h3>
                  <div className={styles.bankRow}>
                    <span className={styles.bankLabel}>Beneficiary Name</span>
                    <span className={styles.bankValue}>Parastructure Pvt. Ltd.</span>
                  </div>
                  <div className={styles.bankRow}>
                    <span className={styles.bankLabel}>Account Number</span>
                    <span className={styles.bankValue}>1234 5678 9012</span>
                  </div>
                  <div className={styles.bankRow}>
                    <span className={styles.bankLabel}>IFSC Code</span>
                    <span className={styles.bankValue}>HDFC0001234</span>
                  </div>
                  <div className={styles.bankRow}>
                    <span className={styles.bankLabel}>Bank Name</span>
                    <span className={styles.bankValue}>HDFC Bank</span>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="utr" className={styles.label}>Transaction ID (UTR) *</label>
                  <input
                    id="utr"
                    name="utr"
                    type="text"
                    className={`${styles.input} ${errors.utr ? styles.inputError : ''}`}
                    placeholder="e.g. UTR1234567890"
                    value={form.utr}
                    onChange={handleChange}
                  />
                  {errors.utr && <span className={styles.errorMsg}>{errors.utr}</span>}
                </div>
              </>
            )}

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
                  : paymentMethod === 'bank' 
                    ? `Submit Details for ${formatPrice(course.price)}` 
                    : `Pay ${formatPrice(course.price)} Securely`}
              </button>
              <p className={styles.payNote}>
                {paymentMethod === 'bank' 
                  ? '🔒 We will verify your transaction manually and enroll you within 24 hours.' 
                  : '🔒 Secured by Razorpay · UPI · Cards · Net Banking · EMI'}
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
