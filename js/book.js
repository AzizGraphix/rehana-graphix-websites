// Rehana Graphix — Book page: multi-select services with live offer note,
// WhatsApp deep link, and Web3Forms submission.
(function () {
  var WEB3FORMS_ACCESS_KEY = 'cd027ec0-de58-47ac-b1fa-dd98f5a0e1ad';
  var WHATSAPP_NUMBER = '923442274536';

  function ready(fn) {
    document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var form = document.getElementById('bookForm');
    var checks = Array.prototype.slice.call(document.querySelectorAll('[data-service-check] input'));
    var offerNote = document.getElementById('offerNote');
    var waLink = document.getElementById('waLink');
    var nameInput = document.getElementById('name');
    var whatsappInput = document.getElementById('whatsapp');
    var detailsInput = document.getElementById('details');
    var submitBtn = document.getElementById('submitBtn');
    var submitSpinner = document.getElementById('submitSpinner');
    var submitCheck = document.getElementById('submitCheck');
    var submitLabel = document.getElementById('submitLabel');
    var formStatus = document.getElementById('formStatus');

    function selectedServices() {
      return checks.filter(function (c) { return c.checked; }).map(function (c) { return c.value; });
    }

    function updateOfferNote() {
      var n = selectedServices().length;
      var text = 'Select the services you need.';
      if (n === 1) text = '14% OFF applied on this service.';
      if (n >= 2) text = 'Bundle offer: your cheapest Basic-package service is FREE.';
      offerNote.textContent = text;
      offerNote.style.animation = 'none';
      // eslint-disable-next-line no-unused-expressions
      offerNote.offsetHeight; // restart pop animation
      offerNote.style.animation = '';
    }

    function updateWaLink() {
      var services = selectedServices();
      var msg = "Hi Rehana Graphix! I'd like to enquire about: " +
        (services.join(', ') || 'a project') + '.' +
        (detailsInput.value ? ' Details: ' + detailsInput.value : '');
      waLink.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);
    }

    checks.forEach(function (chk) {
      chk.addEventListener('change', function () {
        chk.closest('[data-service-check]').classList.toggle('checked', chk.checked);
        updateOfferNote();
        updateWaLink();
      });
    });
    detailsInput.addEventListener('input', updateWaLink);
    updateOfferNote();
    updateWaLink();

    function setStatus(kind, message) {
      formStatus.textContent = message;
      formStatus.className = 'form-status show ' + kind;
    }
    function clearStatus() {
      formStatus.className = 'form-status';
      formStatus.textContent = '';
    }

    function setSubmitting(isLoading) {
      submitBtn.disabled = isLoading;
      submitSpinner.style.display = isLoading ? 'inline' : 'none';
      submitLabel.textContent = isLoading ? 'Sending…' : 'Submit project details';
    }
    function setDone() {
      submitSpinner.style.display = 'none';
      submitCheck.style.display = 'inline';
      submitLabel.textContent = 'Sent!';
      setTimeout(function () {
        submitCheck.style.display = 'none';
        submitLabel.textContent = 'Submit project details';
        submitBtn.disabled = false;
      }, 2600);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearStatus();

      if (!nameInput.value.trim() || !whatsappInput.value.trim()) {
        setStatus('err', 'Please fill in your name and WhatsApp number.');
        return;
      }

      var payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: 'New project enquiry — Rehana Graphix',
        from_name: 'Rehana Graphix website',
        name: nameInput.value.trim(),
        whatsapp: whatsappInput.value.trim(),
        email: document.getElementById('email').value.trim(),
        services: selectedServices().join(', ') || 'Not specified',
        details: detailsInput.value.trim(),
        budget: document.getElementById('budget').value,
        timeline: document.getElementById('timeline').value
      };

      setSubmitting(true);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          setSubmitting(false);
          if (data.success) {
            setDone();
            setStatus('ok', "Thanks! Your enquiry has been sent — we'll be in touch on WhatsApp or email.");
            form.reset();
            checks.forEach(function (c) { c.closest('[data-service-check]').classList.remove('checked'); });
            updateOfferNote();
            updateWaLink();
          } else {
            submitBtn.disabled = false;
            setStatus('err', data.message || 'Something went wrong sending your enquiry. Please try WhatsApp instead.');
          }
        })
        .catch(function () {
          setSubmitting(false);
          submitBtn.disabled = false;
          setStatus('err', 'Could not reach the server. Please try WhatsApp instead.');
        });
    });
  });
})();
