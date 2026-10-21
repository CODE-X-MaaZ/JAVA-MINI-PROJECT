import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createFoodListing } from '../services/api.js';
import { ErrorMessage } from '../components/ui.jsx';

const DONOR_TYPES = ['RESTAURANT', 'HOSTEL', 'CATERER', 'OTHER'];

/** Returns a datetime-local string for "now + 24h" as the default deadline. */
function defaultDeadline() {
  const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
  // datetime-local input expects "YYYY-MM-DDTHH:MM"
  return d.toISOString().slice(0, 16);
}

const INITIAL_FORM = {
  foodName:       '',
  description:    '',
  quantity:       '',
  unit:           '',
  pickupLocation: '',
  pickupDeadline: defaultDeadline(),
  donorName:      '',
  donorType:      'RESTAURANT',
};

/**
 * Client-side validation.
 * Returns an object of field → error string. Empty object means valid.
 * Backend validation is authoritative; these checks improve UX only.
 */
function validate(values) {
  const errors = {};
  if (!values.foodName.trim())
    errors.foodName = 'Food name is required.';
  if (!values.description.trim())
    errors.description = 'Description is required.';
  const qty = parseFloat(values.quantity);
  if (values.quantity === '' || isNaN(qty))
    errors.quantity = 'Quantity is required.';
  else if (qty <= 0)
    errors.quantity = 'Quantity must be greater than zero.';
  if (!values.unit.trim())
    errors.unit = 'Unit is required (e.g. meals, kg, containers).';
  if (!values.pickupLocation.trim())
    errors.pickupLocation = 'Pickup location is required.';
  if (!values.pickupDeadline)
    errors.pickupDeadline = 'Pickup deadline is required.';
  else if (new Date(values.pickupDeadline) <= new Date())
    errors.pickupDeadline = 'Pickup deadline should be in the future.';
  if (!values.donorName.trim())
    errors.donorName = 'Donor name is required.';
  if (!values.donorType)
    errors.donorType = 'Donor type is required.';
  return errors;
}

export default function PostFood() {
  const navigate = useNavigate();
  const [values, setValues]   = useState(INITIAL_FORM);
  const [errors, setErrors]   = useState({});
  const [submitting, setSub]  = useState(false);
  const [apiError, setApiErr] = useState(null);

  const set = (field) => (e) =>
    setValues((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiErr(null);

    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Move focus to first error for accessibility
      const firstErr = document.querySelector('[aria-invalid="true"]');
      firstErr?.focus();
      return;
    }
    setErrors({});

    setSub(true);
    try {
      const payload = {
        ...values,
        quantity: parseFloat(values.quantity),
      };
      const created = await createFoodListing(payload);
      // Navigate to the newly created listing
      navigate(`/listings/${created.id}`, {
        state: { justCreated: true },
      });
    } catch (err) {
      setApiErr(err);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSub(false);
    }
  };

  const field = (name) => ({
    id: `field-${name}`,
    name,
    value: values[name],
    onChange: set(name),
    'aria-invalid': errors[name] ? 'true' : undefined,
    'aria-describedby': errors[name] ? `err-${name}` : undefined,
    className: `form__input${errors[name] ? ' form__input--error' : ''}`,
  });

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 720 }}>
        <div className="page-header">
          <h1 className="page-header__title">Post Surplus Food</h1>
          <p className="page-header__subtitle">
            Fill in the details below. All fields marked <span aria-hidden="true">*</span> are required.
            The backend will validate your submission.
          </p>
        </div>

        {/* API-level error (e.g. backend validation failure or network error) */}
        {apiError && (
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <ErrorMessage
              title={
                apiError.status === 400
                  ? 'Validation failed (server)'
                  : apiError.status === 0
                  ? 'Cannot reach server'
                  : 'Submission failed'
              }
              message={apiError.message}
            />
          </div>
        )}

        <form
          id="post-food-form"
          className="form"
          onSubmit={handleSubmit}
          noValidate
          aria-label="Post surplus food form"
        >
          {/* ── Food name ──────────────────────────────── */}
          <div className="form__group">
            <label htmlFor="field-foodName" className="form__label form__label--required">
              Food Name
            </label>
            <input
              type="text"
              {...field('foodName')}
              placeholder="e.g. Vegetable Pulao"
              maxLength={120}
              autoComplete="off"
            />
            {errors.foodName && (
              <span id="err-foodName" className="form__error" role="alert">⚠ {errors.foodName}</span>
            )}
          </div>

          {/* ── Description ───────────────────────────── */}
          <div className="form__group">
            <label htmlFor="field-description" className="form__label form__label--required">
              Description
            </label>
            <textarea
              id="field-description"
              name="description"
              className={`form__textarea${errors.description ? ' form__textarea--error' : ''}`}
              value={values.description}
              onChange={set('description')}
              placeholder="Freshly prepared surplus meals from today's service"
              rows={3}
              aria-invalid={errors.description ? 'true' : undefined}
              aria-describedby={errors.description ? 'err-description' : undefined}
            />
            {errors.description && (
              <span id="err-description" className="form__error" role="alert">⚠ {errors.description}</span>
            )}
          </div>

          {/* ── Quantity & Unit ────────────────────────── */}
          <div className="form__row">
            <div className="form__group">
              <label htmlFor="field-quantity" className="form__label form__label--required">
                Quantity
              </label>
              <input
                type="number"
                {...field('quantity')}
                placeholder="20"
                min="0.01"
                step="0.01"
              />
              {errors.quantity && (
                <span id="err-quantity" className="form__error" role="alert">⚠ {errors.quantity}</span>
              )}
            </div>

            <div className="form__group">
              <label htmlFor="field-unit" className="form__label form__label--required">
                Unit
              </label>
              <input
                type="text"
                {...field('unit')}
                placeholder="e.g. meals, kg, containers"
                maxLength={30}
              />
              {errors.unit && (
                <span id="err-unit" className="form__error" role="alert">⚠ {errors.unit}</span>
              )}
              <span className="form__hint">Free text — agree a convention with recipients.</span>
            </div>
          </div>

          {/* ── Pickup location ────────────────────────── */}
          <div className="form__group">
            <label htmlFor="field-pickupLocation" className="form__label form__label--required">
              Pickup Location
            </label>
            <input
              type="text"
              {...field('pickupLocation')}
              placeholder="e.g. College Hostel Gate 2, Main Road"
              maxLength={255}
            />
            {errors.pickupLocation && (
              <span id="err-pickupLocation" className="form__error" role="alert">⚠ {errors.pickupLocation}</span>
            )}
          </div>

          {/* ── Pickup deadline ────────────────────────── */}
          <div className="form__group">
            <label htmlFor="field-pickupDeadline" className="form__label form__label--required">
              Pickup Deadline
            </label>
            <input
              type="datetime-local"
              {...field('pickupDeadline')}
            />
            {errors.pickupDeadline && (
              <span id="err-pickupDeadline" className="form__error" role="alert">⚠ {errors.pickupDeadline}</span>
            )}
            <span className="form__hint">
              Recipients must collect food before this time. Confirm food
              safety and handling directly with the recipient.
            </span>
          </div>

          {/* ── Donor name & type ──────────────────────── */}
          <div className="form__row">
            <div className="form__group">
              <label htmlFor="field-donorName" className="form__label form__label--required">
                Donor Name
              </label>
              <input
                type="text"
                {...field('donorName')}
                placeholder="e.g. Central Campus Mess / Grand Hotel"
                maxLength={120}
              />
              {errors.donorName && (
                <span id="err-donorName" className="form__error" role="alert">⚠ {errors.donorName}</span>
              )}
            </div>

            <div className="form__group">
              <label htmlFor="field-donorType" className="form__label form__label--required">
                Donor Type
              </label>
              <select
                id="field-donorType"
                name="donorType"
                className={`form__select${errors.donorType ? ' form__select--error' : ''}`}
                value={values.donorType}
                onChange={set('donorType')}
                aria-invalid={errors.donorType ? 'true' : undefined}
                aria-describedby={errors.donorType ? 'err-donorType' : undefined}
              >
                {DONOR_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.donorType && (
                <span id="err-donorType" className="form__error" role="alert">⚠ {errors.donorType}</span>
              )}
            </div>
          </div>

          {/* ── Actions ────────────────────────────────── */}
          <div className="form__actions">
            <button
              type="submit"
              id="submit-post-form"
              className="btn btn--primary btn--lg"
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting ? '⏳ Posting…' : '📤 Post Food Listing'}
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => { setValues(INITIAL_FORM); setErrors({}); setApiErr(null); }}
              disabled={submitting}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

