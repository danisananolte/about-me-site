const backToTopButton = document.getElementById("backToTop");

if (backToTopButton) {
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const menuToggle = document.querySelector(".menu-toggle");
const menuPanel = document.querySelector(".menu-panel");

if (menuToggle && menuPanel) {
  const closeMenu = () => {
    menuPanel.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuPanel.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    if (!menuPanel.contains(event.target) && !menuToggle.contains(event.target)) {
      closeMenu();
    }
  });

  menuPanel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

document.querySelectorAll("[data-toggle-target]").forEach((toggleButton) => {
  const targetId = toggleButton.getAttribute("data-toggle-target");
  const inlineId = toggleButton.getAttribute("data-toggle-inline");
  if (!targetId) {
    return;
  }

  const target = document.getElementById(targetId);
  const inlineTarget = inlineId ? document.getElementById(inlineId) : null;
  if (!target) {
    return;
  }

  // Always reset to hidden on page load/refresh.
  target.classList.add("hidden");
  if (inlineTarget) {
    inlineTarget.classList.add("hidden");
  }
  toggleButton.setAttribute("aria-expanded", "false");

  toggleButton.addEventListener("click", () => {
    const group = toggleButton.getAttribute("data-toggle-group");

    if (group) {
      const groupButtons = document.querySelectorAll(
        `[data-toggle-group="${group}"]`,
      );
      const shouldOpen = target.classList.contains("hidden");

      groupButtons.forEach((btn) => {
        const btnTargetId = btn.getAttribute("data-toggle-target");
        const btnInlineId = btn.getAttribute("data-toggle-inline");
        if (!btnTargetId) {
          return;
        }
        const btnTarget = document.getElementById(btnTargetId);
        const btnInlineTarget = btnInlineId
          ? document.getElementById(btnInlineId)
          : null;

        if (btnTarget) {
          btnTarget.classList.add("hidden");
        }
        if (btnInlineTarget) {
          btnInlineTarget.classList.add("hidden");
        }
        btn.setAttribute("aria-expanded", "false");
      });

      if (shouldOpen) {
        target.classList.remove("hidden");
        if (inlineTarget) {
          inlineTarget.classList.remove("hidden");
        }
        toggleButton.setAttribute("aria-expanded", "true");
      }
      return;
    }

    const isHidden = target.classList.toggle("hidden");
    if (inlineTarget) {
      inlineTarget.classList.toggle("hidden", isHidden);
    }
    toggleButton.setAttribute("aria-expanded", String(!isHidden));
  });
});

const confettiColors = ["#f09362", "#f5c2cb", "#f8e991", "#429393", "#ffffff"];

function launchConfetti(originElement) {
  const rect = originElement.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;
  const maxRange = Math.max(window.innerWidth, window.innerHeight) * 0.9;

  for (let i = 0; i < 140; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${originX}px`;
    piece.style.top = `${originY}px`;
    piece.style.background = confettiColors[i % confettiColors.length];
    const angle = Math.random() * Math.PI * 2;
    const distance = 120 + Math.random() * maxRange;
    piece.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    piece.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    piece.style.setProperty("--rot", `${Math.random() * 540}deg`);
    piece.style.animationDelay = `${Math.random() * 220}ms`;
    document.body.appendChild(piece);

    setTimeout(() => {
      piece.remove();
    }, 1900);
  }
}

document.querySelectorAll(".acting-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.getAttribute("aria-expanded") === "true") {
      launchConfetti(button);
    }
  });
});

const carouselTrack = document.getElementById("activities-cards");
const prevButton = document.querySelector('[data-carousel-prev="activities-cards"]');
const nextButton = document.querySelector('[data-carousel-next="activities-cards"]');
const indexLabel = document.getElementById("activities-card-index");
const totalLabel = document.getElementById("activities-card-total");

if (carouselTrack && prevButton && nextButton) {
  const cards = Array.from(carouselTrack.querySelectorAll(".flashcard"));
  let activeIndex = cards.findIndex((card) => card.classList.contains("is-active"));
  if (activeIndex < 0) {
    activeIndex = 0;
  }

  const updateCarousel = (newIndex) => {
    activeIndex = (newIndex + cards.length) % cards.length;
    cards.forEach((card, index) => {
      const isActive = index === activeIndex;
      card.classList.toggle("is-active", isActive);
      card.classList.toggle("hidden", !isActive);
    });

    if (indexLabel) {
      indexLabel.textContent = String(activeIndex + 1);
    }
    if (totalLabel) {
      totalLabel.textContent = String(cards.length);
    }
  };

  prevButton.addEventListener("click", () => {
    updateCarousel(activeIndex - 1);
  });

  nextButton.addEventListener("click", () => {
    updateCarousel(activeIndex + 1);
  });

  updateCarousel(activeIndex);
}

const quizQuestionCard = document.getElementById("quiz-question-card");
const quizQuestionText = document.getElementById("quiz-question-text");
const quizAnswers = document.getElementById("quiz-answers");
const quizProgressLabel = document.getElementById("quiz-progress-label");
const quizProgressFill = document.getElementById("quiz-progress-fill");
const quizResultOverlay = document.getElementById("quiz-result-overlay");
const quizResultTitle = document.getElementById("quiz-result-title");
const quizResultDescription = document.getElementById("quiz-result-description");
const quizRetake = document.getElementById("quiz-retake");
const quizResultPhoto = document.querySelector(".quiz-result-photo");

if (quizQuestionCard && quizQuestionText && quizAnswers) {
  const resultOrder = ["cookie", "stage", "camp", "gamer"];
  const resultContent = {
    cookie: {
      title: "Dani with a Cookie",
      description:
        "Soft, reliable, and everyone's favorite. You bring cozy energy into every room and people trust you because you are steady and kind.",
      image:
        "file:///Users/daninolte/.cursor/projects/Users-daninolte-about-me-site/assets/View_recent_photos-3443ebe5-1479-4a10-a2d7-99fc061d416c.png",
      placeholder: "🍪 Cozy Vibes Photo",
    },
    stage: {
      title: "Stage Dani",
      description:
        "High energy and main character energy all day. You light up groups, bring bold confidence, and make moments memorable.",
      image:
        "file:///Users/daninolte/.cursor/projects/Users-daninolte-about-me-site/assets/View_recent_photos-36f434d5-fd25-4626-90d7-77ab2a7fb984.png",
      placeholder: "🎭 Spotlight Photo",
    },
    camp: {
      title: "Camp Counselor Dani",
      description:
        "You love helping people and always have a game plan. You hype everyone up, keep teams moving, and make people feel seen.",
      image:
        "file:///Users/daninolte/.cursor/projects/Users-daninolte-about-me-site/assets/View_recent_photos-b435d5c7-19a2-49d3-8915-0bab81ec583d.png",
      placeholder: "🏕️ Team Hype Photo",
    },
    gamer: {
      title: "Gamer Dani",
      description:
        "Strategic, curious, and a little chronically online in the best way. You think in systems, solve problems fast, and probably have a favorite game queue ready.",
      images: [
        "file:///Users/daninolte/.cursor/projects/Users-daninolte-about-me-site/assets/View_recent_photos-81d8d0aa-f889-4d00-8f01-926e60056c7d.png",
        "file:///Users/daninolte/.cursor/projects/Users-daninolte-about-me-site/assets/View_recent_photos-65b0129e-3a0c-46bd-90a5-1880d73ede3d.png",
      ],
      placeholder: "🎮 Strategy Mode Photo",
    },
  };

  const quizQuestions = [
    {
      prompt: "Pick your ideal Friday night plan.",
      answers: [
        { text: "Host people and plan the whole hangout", type: "camp" },
        { text: "Game night and online chaos with friends", type: "gamer" },
        { text: "Cozy up and watch a comfort show", type: "cookie" },
        { text: "Open mic, karaoke, or anything with a stage", type: "stage" },
      ],
    },
    {
      prompt: "Your team has a hard project. Your default role?",
      answers: [
        { text: "Build the strategy and optimize the workflow", type: "gamer" },
        { text: "Keep morale calm and steady", type: "cookie" },
        { text: "Present the vision and get everyone excited", type: "stage" },
        { text: "Coordinate tasks and check in on everyone", type: "camp" },
      ],
    },
    {
      prompt: "Pick the phrase that fits you most.",
      answers: [
        { text: "If we're doing this, let's make it iconic.", type: "stage" },
        { text: "Everyone belongs here.", type: "camp" },
        { text: "Wait, I have a better system.", type: "gamer" },
        { text: "Consistency is love in action.", type: "cookie" },
      ],
    },
    {
      prompt: "What sounds most fun right now?",
      answers: [
        { text: "Pokemon or Minecraft marathon", type: "gamer" },
        { text: "Dressing up for a performance or event", type: "stage" },
        { text: "Coffee date with deep conversation", type: "cookie" },
        { text: "Mentoring someone younger than me", type: "camp" },
      ],
    },
    {
      prompt: "Your superpower in a friend group is...",
      answers: [
        { text: "Remembering details and taking care of people", type: "camp" },
        { text: "Loyal support when people need it most", type: "cookie" },
        { text: "Solving random problems instantly", type: "gamer" },
        { text: "Big personality that brings joy", type: "stage" },
      ],
    },
  ];

  let currentQuestion = 0;
  let scores = { cookie: 0, stage: 0, camp: 0, gamer: 0 };

  const updateProgress = () => {
    if (quizProgressLabel) {
      quizProgressLabel.textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
    }
    if (quizProgressFill) {
      const percent = ((currentQuestion + 1) / quizQuestions.length) * 100;
      quizProgressFill.style.width = `${percent}%`;
    }
  };

  const renderQuestion = () => {
    const question = quizQuestions[currentQuestion];
    quizQuestionText.textContent = question.prompt;
    quizAnswers.innerHTML = "";

    question.answers.forEach((answer) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-answer-btn";
      button.textContent = answer.text;
      button.addEventListener("click", () => {
        scores[answer.type] += 1;

        if (currentQuestion < quizQuestions.length - 1) {
          quizQuestionCard.classList.add("is-transitioning");
          window.setTimeout(() => {
            currentQuestion += 1;
            renderQuestion();
            quizQuestionCard.classList.remove("is-transitioning");
          }, 240);
          return;
        }

        const winner = resultOrder.reduce((best, key) =>
          scores[key] > scores[best] ? key : best,
        );
        const result = resultContent[winner];
        if (quizResultTitle) {
          quizResultTitle.textContent = result.title;
        }
        if (quizResultDescription) {
          quizResultDescription.textContent = result.description;
        }
        if (quizResultPhoto) {
          if (result.images && result.images.length) {
            quizResultPhoto.classList.add("has-image");
            quizResultPhoto.innerHTML = `<div class="quiz-result-photo-grid">${result.images
              .map((src) => `<img src="${src}" alt="${result.title}" />`)
              .join("")}</div>`;
          } else if (result.image) {
            quizResultPhoto.classList.add("has-image");
            quizResultPhoto.innerHTML = `<img src="${result.image}" alt="${result.title}" />`;
          } else {
            quizResultPhoto.classList.remove("has-image");
            quizResultPhoto.textContent = result.placeholder;
          }
        }
        if (quizResultOverlay) {
          quizResultOverlay.classList.remove("hidden");
        }
      });
      quizAnswers.appendChild(button);
    });
    updateProgress();
  };

  if (quizRetake) {
    quizRetake.addEventListener("click", () => {
      currentQuestion = 0;
      scores = { cookie: 0, stage: 0, camp: 0, gamer: 0 };
      if (quizResultOverlay) {
        quizResultOverlay.classList.add("hidden");
      }
      if (quizResultPhoto) {
        quizResultPhoto.classList.remove("has-image");
      }
      renderQuestion();
    });
  }

  renderQuestion();
}

document.querySelectorAll(".email-suggestion-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    const mailtoHref = link.getAttribute("href");
    const gmailCompose = link.getAttribute("data-gmail-compose");
    if (!mailtoHref || !gmailCompose) {
      return;
    }

    event.preventDefault();
    window.location.href = mailtoHref;

    // Fallback for systems without a configured default mail app.
    window.setTimeout(() => {
      window.open(gmailCompose, "_blank", "noopener,noreferrer");
    }, 700);
  });
});

function launchPinkSparkleConfetti() {
  const pinks = ["#ff5db1", "#ff8ecb", "#ffb3de", "#ffd4ec", "#ff4fa3", "#ffc8e8"];
  const originY = window.innerHeight - 24;

  for (let i = 0; i < 240; i += 1) {
    const piece = document.createElement("span");
    piece.className = "sparkle-confetti";
    piece.style.left = `${Math.random() * window.innerWidth}px`;
    piece.style.top = `${originY}px`;
    piece.style.background = pinks[i % pinks.length];
    const drift = (Math.random() - 0.5) * 360;
    const rise = -(220 + Math.random() * 420);
    piece.style.setProperty("--dx", `${drift}px`);
    piece.style.setProperty("--dy", `${rise}px`);
    piece.style.animationDelay = `${Math.random() * 220}ms`;
    document.body.appendChild(piece);

    window.setTimeout(() => {
      piece.remove();
    }, 1900);
  }
}

const mysteryTrigger = document.querySelector(".mystery-trigger");
const mysteryOverlay = document.getElementById("mystery-overlay");
const mysteryClose = document.getElementById("mystery-close");

if (mysteryTrigger && mysteryOverlay && mysteryClose) {
  mysteryTrigger.addEventListener("click", () => {
    mysteryOverlay.classList.remove("hidden");
    launchPinkSparkleConfetti();
  });

  mysteryClose.addEventListener("click", () => {
    mysteryOverlay.classList.add("hidden");
  });
}
