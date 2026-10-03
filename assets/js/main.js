/**
 * Utsaw Photography & Visual Studios - Main Client JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initPhotographerSwitcher();
  initGalleryFilter();
  initLightbox();
  initBookingForm();
  initFaqAccordion();
  initBackToTop();
  initDatePickerMin();
});

/* ==========================================================================
   1. Navbar Scroll & Active State
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-item');

  window.addEventListener('scroll', () => {
    // Scroll shadow effect
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    let currentSectionId = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   2. Mobile Hamburger Navigation
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close when clicking nav items
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   3. Photographer Dual-Portrait Switcher
   ========================================================================== */
function initPhotographerSwitcher() {
  const mainPhoto = document.getElementById('photographerMainPhoto');
  const thumbButtons = document.querySelectorAll('.thumb-btn');

  if (!mainPhoto || thumbButtons.length === 0) return;

  thumbButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      thumbButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const newSrc = btn.getAttribute('data-src');
      if (newSrc && mainPhoto.src !== newSrc) {
        mainPhoto.style.opacity = '0';
        setTimeout(() => {
          mainPhoto.src = newSrc;
          mainPhoto.style.opacity = '1';
        }, 200);
      }
    });
  });
}

/* ==========================================================================
   4. Gallery Category Filter
   ========================================================================== */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterVal === 'all' || itemCategory === filterVal) {
          item.classList.remove('hidden');
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.opacity = '1';
          }, 50);
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   5. Interactive Fullscreen Lightbox
   ========================================================================== */
function initLightbox() {
  const modal = document.getElementById('lightboxModal');
  const overlay = document.getElementById('lightboxOverlay');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  const modalImg = document.getElementById('lightboxImage');
  const captionEl = document.getElementById('lightboxCaption');

  if (!modal) return;

  let currentList = [];
  let currentIndex = 0;

  function updateLightboxList() {
    // Only select currently visible triggers
    currentList = Array.from(document.querySelectorAll('.lightbox-trigger')).filter(el => {
      const item = el.closest('.gallery-item');
      return !item || !item.classList.contains('hidden');
    });
  }

  function openLightbox(index) {
    updateLightboxList();
    if (currentList.length === 0) return;

    currentIndex = index;
    if (currentIndex < 0) currentIndex = currentList.length - 1;
    if (currentIndex >= currentList.length) currentIndex = 0;

    const currentTrigger = currentList[currentIndex];
    const imageSrc = currentTrigger.getAttribute('href');
    const captionText = currentTrigger.getAttribute('data-caption') || '';

    modalImg.src = imageSrc;
    captionEl.textContent = captionText;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Bind all triggers
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.lightbox-trigger');
    if (trigger) {
      e.preventDefault();
      updateLightboxList();
      const triggerIdx = currentList.indexOf(trigger);
      openLightbox(triggerIdx !== -1 ? triggerIdx : 0);
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (overlay) overlay.addEventListener('click', closeLightbox);

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(currentIndex + 1);
    });
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightbox(currentIndex - 1);
    if (e.key === 'ArrowRight') openLightbox(currentIndex + 1);
  });
}

/* ==========================================================================
   6. Contact & Booking Form with WhatsApp Integration
   ========================================================================== */
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  const submitBtn = document.getElementById('submitBtn');
  const feedback = document.getElementById('formFeedback');
  const whatsappDirectBtn = document.getElementById('sendWhatsappDirect');

  if (!form) return;

  const nameInput = document.getElementById('clientName');
  const phoneInput = document.getElementById('clientPhone');
  const emailInput = document.getElementById('clientEmail');
  const serviceInput = document.getElementById('serviceType');
  const dateInput = document.getElementById('eventDate');
  const locInput = document.getElementById('eventLocation');
  const msgInput = document.getElementById('clientMessage');

  function validate() {
    let isValid = true;

    // Reset error messages
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

    if (!nameInput.value.trim()) {
      document.getElementById('nameError').textContent = 'Please enter your name.';
      isValid = false;
    }

    const cleanPhone = phoneInput.value.replace(/[^0-9+]/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      document.getElementById('phoneError').textContent = 'Please provide a valid contact number.';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      document.getElementById('emailError').textContent = 'Please provide a valid email address.';
      isValid = false;
    }

    if (!serviceInput.value) {
      document.getElementById('serviceError').textContent = 'Please choose a photography category.';
      isValid = false;
    }

    return isValid;
  }

  // Regular Form Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validate()) {
      feedback.className = 'form-feedback error';
      feedback.style.display = 'block';
      feedback.textContent = 'Please fix the highlighted errors before submitting.';
      return;
    }

    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
    submitBtn.disabled = true;

    // Simulate reliable dispatch & store lead locally
    setTimeout(() => {
      const inquiryData = {
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        email: emailInput.value.trim(),
        service: serviceInput.value,
        date: dateInput.value,
        location: locInput.value.trim(),
        message: msgInput.value.trim(),
        timestamp: new Date().toISOString()
      };

      try {
        const saved = JSON.parse(localStorage.getItem('utsaw_inquiries') || '[]');
        saved.push(inquiryData);
        localStorage.setItem('utsaw_inquiries', JSON.stringify(saved));
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }

      btnText.style.display = 'inline-block';
      btnLoader.style.display = 'none';
      submitBtn.disabled = false;

      feedback.className = 'form-feedback success';
      feedback.style.display = 'block';
      feedback.innerHTML = `<strong>✨ Thank you, ${inquiryData.name}!</strong><br>Your booking inquiry for <strong>${inquiryData.service}</strong> has been received. Utsaw Anand will contact you at <strong>${inquiryData.phone}</strong> or <strong>${inquiryData.email}</strong> within 4 hours.`;

      form.reset();
    }, 1200);
  });

  // Direct WhatsApp dispatch button
  if (whatsappDirectBtn) {
    whatsappDirectBtn.addEventListener('click', () => {
      const name = nameInput.value.trim() || 'Client';
      const phone = phoneInput.value.trim() || 'Not specified';
      const service = serviceInput.value || 'General Inquiry';
      const date = dateInput.value || 'Flexible';
      const loc = locInput.value.trim() || 'Amhara, Bihta (Patna)';
      const notes = msgInput.value.trim() || 'None';

      const whatsappText = `Hello Utsaw Anand!%0A%0AI would like to inquire about a photography session:%0A• *Name:* ${encodeURIComponent(name)}%0A• *Phone:* ${encodeURIComponent(phone)}%0A• *Category:* ${encodeURIComponent(service)}%0A• *Preferred Date:* ${encodeURIComponent(date)}%0A• *Location:* ${encodeURIComponent(loc)}%0A• *Details:* ${encodeURIComponent(notes)}%0A%0APlease let me know availability!`;

      const targetUrl = `https://wa.me/919508502788?text=${whatsappText}`;
      window.open(targetUrl, '_blank');
    });
  }
}

/* ==========================================================================
   7. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      faqItems.forEach(other => other.classList.remove('active'));

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   8. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backBtn = document.getElementById('backToTop');
  if (!backBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  });

  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   9. Set Minimum Date for Booking Calendar
   ========================================================================== */
function initDatePickerMin() {
  const dateInput = document.getElementById('eventDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }
}
