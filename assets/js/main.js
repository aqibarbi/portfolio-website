/*=============== HOME SPLIT TEXT ===============*/
    const { animate, text , stagger } = anime;

    const animateProfessionLine = (el) => {
        const { chars } = text.split(el, { chars: { wrap: 'clip' } });
        animate(chars, {
            y: [
                { to: ['100%', '0%'] },
                { to: '-100%', delay: 4000, ease: 'in(3)' }
            ],
            duration: 900,
            ease: 'out(3)',
            delay: stagger(80),
            loop: true,
        });
    };

    document.querySelectorAll('.home__profession-1').forEach(animateProfessionLine);
    document.querySelectorAll('.home__profession-2').forEach(animateProfessionLine);
    // const { chars : chars1 } = splitText('p', {chars: { wrap: 'clip' },});

/*=============== PROJECTS slider ===============*/
const initSlider = (root, { delay = 3000 } = {}) => {
  const track = root.querySelector('.projects__track');
  const dotsEl = root.querySelector('.projects__dots');
  const slides = [...track.children];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let index = 0;
  let timer = null;
  let inView = false;
  let hovering = false;
  let raf = 0;

  // drag state
  let pressed = false;
  let dragging = false;
  let moved = false;
  let startX = 0;
  let startLeft = 0;

  // no native image/link ghost-drag
  track.querySelectorAll('img, a').forEach((el) => (el.draggable = false));

  /* ---------- dots ---------- */
  const dots = slides.map((_, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'projects__dot';
    btn.setAttribute('aria-label', `Go to project ${i + 1}`);
    btn.addEventListener('click', () => goTo(i));
    dotsEl.append(btn);
    return btn;
  });

  const setActive = (i) => {
    index = i;
    dots.forEach((d, n) => d.classList.toggle('is-active', n === i));
  };

  /* ---------- navigation ---------- */
  const atEnd = () =>
    Math.ceil(track.scrollLeft + track.clientWidth) >= track.scrollWidth - 1;

  const goTo = (i) => {
    const n = (i + slides.length) % slides.length;
    track.scrollTo({
      left: slides[n].offsetLeft,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  const next = () => (atEnd() ? goTo(0) : goTo(index + 1));

  // active dot follows scroll position (swipe, drag, autoplay, keyboard)
  track.addEventListener(
    'scroll',
    () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = track.scrollLeft;
        const closest = atEnd()
          ? slides.length - 1
          : slides.reduce(
              (best, s, n) =>
                Math.abs(s.offsetLeft - x) < Math.abs(slides[best].offsetLeft - x) ? n : best,
              0
            );
        setActive(closest);
      });
    },
    { passive: true }
  );

  /* ---------- autoplay ---------- */
  const stop = () => {
    clearInterval(timer);
    timer = null;
  };
  const play = () => {
    if (!timer && !reduceMotion) timer = setInterval(next, delay);
  };
  const sync = () => (inView && !hovering && !document.hidden ? play() : stop());

  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    sync();
  }, { threshold: 0.25 }).observe(root);

  root.addEventListener('mouseenter', () => { hovering = true; sync(); });
  root.addEventListener('mouseleave', () => { hovering = false; sync(); });
  root.addEventListener('focusin', () => { hovering = true; sync(); });
  root.addEventListener('focusout', () => { hovering = false; sync(); });
  document.addEventListener('visibilitychange', sync);

  /* ---------- mouse drag (touch uses native scroll) ---------- */
  track.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    pressed = true;
    moved = false;
    startX = e.clientX;
    startLeft = track.scrollLeft;
  });

  track.addEventListener('pointermove', (e) => {
    if (!pressed) return;
    const dx = e.clientX - startX;
    if (!dragging && Math.abs(dx) > 5) {
      dragging = true;
      moved = true;
      track.classList.add('is-dragging');
      track.setPointerCapture(e.pointerId); // capture only after threshold, plain clicks stay intact
    }
    if (dragging) track.scrollLeft = startLeft - dx;
  });

  const endDrag = () => {
    pressed = false;
    if (!dragging) return;
    dragging = false;
    track.classList.remove('is-dragging'); // snap re-enables, settles on nearest card
  };
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);

  // block link click right after a drag
  track.addEventListener(
    'click',
    (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    },
    true
  );

  setActive(0);
};

document.querySelectorAll('[data-slider]').forEach((el) => initSlider(el, { delay: 3000 }));

/*=============== WORK TABS ===============*/
const tabs= document.querySelectorAll('[data-target]'),
        tabContents =document.querySelectorAll('[data-content]');
    tabs.forEach((tab)=>{
        tab.addEventListener('click',()=>{
            const targetSelector= tab.dataset.target,
                    targetContent=document.querySelector(targetSelector)
        // disable all content and active tabs
        tabContents.forEach((content)=> content.classList.remove('work-active'))
        tabs.forEach((t)=>t.classList.remove('work-active'))
        // active the tab and corresponding content
        tab.classList.add('work-active')
        targetContent.classList.add('work-active')
        })
    })

/*=============== SERVICES ACCORDION ===============*/
const servicesButtons= document.querySelectorAll('.services__button');
servicesButtons.forEach(button=>{
    const heightInfo= document.querySelector('.services__info')
    heightInfo.style.height =heightInfo.scrollHeight + "px";
    button.addEventListener('click',()=>{
        const servicesCards= document.querySelectorAll('.services__card'),
        currentCard =button.parentNode,
        currentInfo =currentCard.querySelector('.services__info'),
        isCardOpen =currentCard.classList.contains('services-open')
        // close all other services info
        servicesCards.forEach(card =>{
            card.classList.replace('services-open','services-close')
            const info=card.querySelector('.services__info')
            info.style.height='0'
        })
        //open only if not already open
        if(!isCardOpen){
            currentCard.classList.replace('services-close' , 'services-open');
            currentInfo.style.height =currentInfo.scrollHeight + 'px'
        }
    })
})

/*=============== COPY EMAIL IN CONTACT ===============*/
const copyBtn =document.getElementById('contact-btn'),
        copyEmail=document.getElementById('contact-email').textContent;

    copyBtn.addEventListener('click',() =>{
        // use the clipbord API To Copy Text
        navigator.clipboard.writeText(copyEmail).then(()=>{
            copyBtn.innerHTML ='Email copied <i class="ri-check-line"></i>'
            // Restore the orignal Text
            setTimeout(()=>{
                copyBtn.innerHTML='Copy email <i class="ri-file-copy-line"></i>'
            }, 2000)
        })
    })

/*=============== CURRENT YEAR OF THE FOOTER ===============*/ 
const textYear=document.getElementById('footer-year'),
        currentYear=new Date().getFullYear()

        textYear.textContent=currentYear
/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections =document.querySelectorAll('section[id]')
const scrollActive =()=>{
    const scrollY = window.scrollY
    sections.forEach(section =>{
        const id =section.id, //id of each section
        top = section.offsetTop - 50, // distan from the top edge
        height = section.offsetHeight, // element height
        link = document.querySelector('.nav__menu a[href*=' + id + ']')
        if(!link)return
        link.classList.toggle('active-link' , scrollY > top && scrollY <= top + height)
    })
}
window.addEventListener('scroll', scrollActive)

/*=============== CUSTOM CURSOR ===============*/
const cursor =document.querySelector('.cursor')
let mouseX =0 , mouseY =0 // store mouse position

const cursorMove = () =>{
    // transform only: animating left/top is counted as layout shift (CLS)
    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`
    // update the cursor animation
    requestAnimationFrame(cursorMove)
}
document.addEventListener('mousemove', (e)=>{
    mouseX = e.clientX
    mouseY = e.clientY
})
cursorMove()

/* Hide custom cursor on links */
const a =document.querySelectorAll('a')

a.forEach(item=>{
    item.addEventListener('mouseover', ()=>{
        cursor.classList.add('hide-cursor')
    })
    item.addEventListener('mouseleave', ()=>{
        cursor.classList.remove('hide-cursor')
    })
})

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin:'top',
    distance:'60px',
    duration: 2000,
    delay:300,
    // reset:true //animation repeat
})
sr.reveal(`.projects__container,.work__container,
            .delivered__container,.certs__container,.contact__container`)
sr.reveal(`.home__data`,{delay:900, origin:'bottom'})
sr.reveal(`.home__info`,{delay:1200, origin:'bottom'})
sr.reveal(`.home__social, .home__cv`,{delay:1500})
sr.reveal(`.about__data`,{origin:'left'})
sr.reveal(`.about__image`,{origin:'right'})
sr.reveal(`.services__card`,{interval: 100})
sr.reveal(`.certs__card`,{interval: 150})


/*=============== IMAGE LIGHTBOX ===============*/
const lightbox = document.getElementById('lightbox')
const lightboxImage = document.getElementById('lightbox-image')
const lightboxClose = document.getElementById('lightbox-close')
const lightboxTriggers = document.querySelectorAll('.js-lightbox')

// open lightbox when a trigger link is clicked
lightboxTriggers.forEach(trigger =>{
    trigger.addEventListener('click', (e)=>{
        e.preventDefault() // stop the link from opening a new tab
        lightboxImage.src = trigger.getAttribute('href')
        lightbox.classList.add('active')
    })
})

// close lightbox on X click, overlay click, or Escape key
lightboxClose.addEventListener('click', ()=>{
    lightbox.classList.remove('active')
})
lightbox.addEventListener('click', (e)=>{
    if(e.target === lightbox){
        lightbox.classList.remove('active')
    }
})
document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){
        lightbox.classList.remove('active')
    }
})
/*=============== CONTACT FORM (Netlify AJAX submit) ===============*/
const contactForm = document.querySelector('form[name="contact"]')

if (contactForm) {
    const feedbackEl = document.getElementById('contact-form-feedback')
    const submitBtn = contactForm.querySelector('.contact__form-submit')
    const submitBtnDefaultHTML = submitBtn.innerHTML
    const subjectInput = document.getElementById('contact-subject')
    const nameInput = document.getElementById('contact-name')

    // subject line = "New portfolio message from <name>"
    nameInput.addEventListener('input', () => {
        const name = nameInput.value.trim()
        subjectInput.value = name
            ? `New portfolio message from ${name}`
            : 'New portfolio message'
    })

    const encodeFormData = (form) => {
        return new URLSearchParams(new FormData(form)).toString()
    }

    const showFeedback = (message, type) => {
        feedbackEl.textContent = message
        feedbackEl.classList.remove('contact__form-feedback--success', 'contact__form-feedback--error')
        feedbackEl.classList.add('show', `contact__form-feedback--${type}`)
    }

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault()

        submitBtn.disabled = true
        submitBtn.innerHTML = 'Sending...'
        feedbackEl.classList.remove('show')

        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: encodeFormData(contactForm)
        })
            .then((response) => {
                if (response.ok) {
                    showFeedback('Message sent! I\'ll get back to you soon.', 'success')
                    contactForm.reset()
                    subjectInput.value = 'New portfolio message'
                } else {
                    showFeedback('Something went wrong. Please try again or email me directly.', 'error')
                }
            })
            .catch(() => {
                showFeedback('Network error. Please check your connection and try again.', 'error')
            })
            .finally(() => {
                submitBtn.disabled = false
                submitBtn.innerHTML = submitBtnDefaultHTML
            })
    })
}