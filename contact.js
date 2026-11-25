const enquiryForm = document.querySelector('#enquiry');
const enquiryStatus = document.querySelector('#enquiry-status');
const enquiryFields = enquiryForm.querySelector('fieldset');

enquiryForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const details = new FormData(enquiryForm);
  enquiryFields.disabled = true;
  enquiryStatus.textContent = 'Sending your enquiry…';

  try {
    const response = await fetch(enquiryForm.action, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: details,
      signal: AbortSignal.timeout(15000),
    });
    const result = await response.json();
    if (!response.ok || result.success !== true) {
      throw new Error('Web3Forms did not confirm submission.');
    }
    enquiryForm.reset();
    enquiryStatus.textContent = 'Thanks. Your enquiry was submitted.';
  } catch {
    enquiryStatus.textContent = 'We couldn’t confirm your submission. Please use the email link to contact us directly.';
  } finally {
    enquiryFields.disabled = false;
  }
});

enquiryForm.addEventListener('input', () => {
  enquiryStatus.textContent = '';
});

const packageSelect = enquiryForm.querySelector('#package');
const packageOptions = new Map([
  ['simple-start', 'Simple Start — one page, from $450'],
  ['multi-page', 'Multi-Page — 3–5 pages, from $900'],
]);
const requestedPackage = new URLSearchParams(window.location.search).get('package');
const packageValue = packageOptions.get(requestedPackage);
if (packageValue && Array.from(packageSelect.options).some(option => option.value === packageValue)) {
  packageSelect.value = packageValue;
}

enquiryFields.disabled = false;
