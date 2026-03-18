const tilForm = document.querySelector("#til-form");
const tilList = document.querySelector("#til-list");
const galleryItems = document.querySelectorAll(".gallery-item");

galleryItems.forEach(function (item) {
  const image = item.querySelector("img[alt]");
  if (image) {
    item.setAttribute("data-alt", image.alt);
  }
});

const hoverVideos = document.querySelectorAll(".work-hover-video");

hoverVideos.forEach(function (videoCard) {
  const frame = videoCard.querySelector(".work-hover-frame");
  const embedSrc = videoCard.getAttribute("data-embed-src");

  if (!frame || !embedSrc) {
    return;
  }

  let isPlaying = false;

  const startVideo = function () {
    if (isPlaying) {
      return;
    }

    frame.src = embedSrc;
    videoCard.classList.add("is-playing");
    isPlaying = true;
  };

  const stopVideo = function () {
    if (!isPlaying) {
      return;
    }

    videoCard.classList.remove("is-playing");
    frame.src = "";
    isPlaying = false;
  };

  videoCard.addEventListener("mouseenter", startVideo);
  videoCard.addEventListener("mouseleave", stopVideo);
  videoCard.addEventListener("focusin", startVideo);
  videoCard.addEventListener("focusout", function (event) {
    if (!videoCard.contains(event.relatedTarget)) {
      stopVideo();
    }
  });
});

if (tilForm && tilList) {
  tilForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const dateInput = tilForm.querySelector("#til-date");
    const titleInput = tilForm.querySelector("#til-title");
    const contentInput = tilForm.querySelector("#til-content");

    const dateValue = dateInput.value;
    const titleValue = titleInput.value.trim();
    const contentValue = contentInput.value.trim();

    if (!dateValue || !titleValue || !contentValue) {
      return;
    }

    const item = document.createElement("article");
    item.className = "til-item";

    const time = document.createElement("time");
    time.setAttribute("datetime", dateValue);
    time.textContent = dateValue;

    const heading = document.createElement("h3");
    heading.textContent = titleValue;

    const description = document.createElement("p");
    description.textContent = contentValue;

    item.append(time, heading, description);
    tilList.prepend(item);

    tilForm.reset();
  });
}

const minecraftBlock = document.querySelector("#minecraft-block");

if (minecraftBlock) {
  const requiredHoldMs = 1100;
  let isHolding = false;
  let holdStart = 0;
  let animationId = null;

  const stopMining = function () {
    isHolding = false;
    minecraftBlock.classList.remove("is-mining");
    minecraftBlock.style.setProperty("--mine-progress", "0");
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  };

  const finishMining = function () {
    isHolding = false;
    minecraftBlock.classList.remove("is-mining");
    minecraftBlock.classList.add("is-mined");
    minecraftBlock.style.setProperty("--mine-progress", "1");

    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }

    window.setTimeout(function () {
      minecraftBlock.classList.remove("is-mined");
      minecraftBlock.style.setProperty("--mine-progress", "0");
    }, 360);
  };

  const updateMining = function (timestamp) {
    if (!isHolding) {
      return;
    }

    const elapsed = timestamp - holdStart;
    const progress = Math.min(elapsed / requiredHoldMs, 1);
    minecraftBlock.style.setProperty("--mine-progress", String(progress));

    if (progress >= 1) {
      finishMining();
      return;
    }

    animationId = requestAnimationFrame(updateMining);
  };

  const startMining = function (event) {
    event.preventDefault();
    if (minecraftBlock.classList.contains("is-mined")) {
      return;
    }

    isHolding = true;
    holdStart = performance.now();
    minecraftBlock.classList.add("is-mining");
    minecraftBlock.style.setProperty("--mine-progress", "0");

    if (animationId !== null) {
      cancelAnimationFrame(animationId);
    }

    animationId = requestAnimationFrame(updateMining);
  };

  minecraftBlock.addEventListener("pointerdown", startMining);
  minecraftBlock.addEventListener("pointerup", stopMining);
  minecraftBlock.addEventListener("pointercancel", stopMining);
  minecraftBlock.addEventListener("pointerleave", stopMining);

  minecraftBlock.addEventListener("keydown", function (event) {
    if (event.code === "Space" || event.code === "Enter") {
      startMining(event);
    }
  });

  minecraftBlock.addEventListener("keyup", function (event) {
    if (event.code === "Space" || event.code === "Enter") {
      stopMining();
    }
  });
}

const winterImage = document.querySelector("#winter-image");
const snowOverlay = document.querySelector("#snow-overlay");

if (winterImage && snowOverlay) {
  const snowflakeCount = 56;

  const createSnowflakes = function () {
    if (snowOverlay.childElementCount > 0) {
      return;
    }

    const fragment = document.createDocumentFragment();

    for (let index = 0; index < snowflakeCount; index += 1) {
      const flake = document.createElement("span");
      flake.className = "snowflake";

      const size = 6 + Math.random() * 9;
      const opacity = 0.5 + Math.random() * 0.5;
      const left = Math.random() * 100;
      const drift = -50 + Math.random() * 100;
      const fallDuration = 6 + Math.random() * 6;
      const swayDuration = 2 + Math.random() * 3;
      const delay = Math.random() * -8;

      flake.style.setProperty("--flake-size", `${size}px`);
      flake.style.setProperty("--flake-opacity", opacity.toFixed(2));
      flake.style.setProperty("--flake-left", `${left}vw`);
      flake.style.setProperty("--flake-drift", `${drift}px`);
      flake.style.setProperty("--fall-duration", `${fallDuration.toFixed(2)}s`);
      flake.style.setProperty("--sway-duration", `${swayDuration.toFixed(2)}s`);
      flake.style.setProperty("--fall-delay", `${delay.toFixed(2)}s`);
      flake.style.setProperty("--sway-delay", `${(delay * 0.6).toFixed(2)}s`);

      fragment.appendChild(flake);
    }

    snowOverlay.appendChild(fragment);
  };

  const startSnowing = function () {
    createSnowflakes();
    document.body.classList.add("is-snowing");
  };

  const stopSnowing = function () {
    document.body.classList.remove("is-snowing");
    window.setTimeout(function () {
      if (!document.body.classList.contains("is-snowing")) {
        snowOverlay.replaceChildren();
      }
    }, 280);
  };

  winterImage.addEventListener("mouseenter", startSnowing);
  winterImage.addEventListener("mouseleave", stopSnowing);
  winterImage.addEventListener("focus", startSnowing);
  winterImage.addEventListener("blur", stopSnowing);
}
