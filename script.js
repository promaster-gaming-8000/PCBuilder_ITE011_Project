// Announcement-bar marquee from the original PCBuilders website.
const announcement = document.getElementById("announcement");
if (announcement) {
  const text = "50% OFF FOR FIRST TIME CUSTOMERS";
  announcement.textContent = Array(20).fill(text).join("　");
  let position = 0;
  function scrollText() {
    position -= 1;
    if (position <= -announcement.scrollWidth / 2) position = 0;
    announcement.style.transform = `translateX(${position}px)`;
    requestAnimationFrame(scrollText);
  }
  requestAnimationFrame(scrollText);
}

// Preserve the original two-row customer-review marquee: top row moves left,
// the row with .scroll-reverse moves right.
const ratingRows = document.querySelectorAll(".infinite_scrolling_ratings");
const ratingScrollSpeed = 65;
const reduceRatingMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceRatingMotion) {
  ratingRows.forEach((ratingsContainer) => {
    const ratingsTrack = ratingsContainer.querySelector(".ratings_track");
    const ratingsGroup = ratingsContainer.querySelector(".ratings_group");
    if (!ratingsTrack || !ratingsGroup) return;

    const scrollReverse = ratingsContainer.classList.contains("scroll-reverse");
    const clonedGroup = ratingsGroup.cloneNode(true);
    clonedGroup.setAttribute("aria-hidden", "true");
    ratingsTrack.appendChild(clonedGroup);

    let position = 0;
    let groupWidth = 0;
    let previousTime = 0;

    function updateWidth() {
      groupWidth = ratingsGroup.getBoundingClientRect().width;
      position = scrollReverse ? -groupWidth : 0;
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);

    function scrollRatings(timestamp) {
      if (!previousTime) previousTime = timestamp;
      const elapsed = Math.min((timestamp - previousTime) / 1000, 0.05);
      previousTime = timestamp;

      if (groupWidth > 0) {
        if (scrollReverse) {
          position += ratingScrollSpeed * elapsed;
          if (position >= 0) position -= groupWidth;
        } else {
          position -= ratingScrollSpeed * elapsed;
          if (position <= -groupWidth) position += groupWidth;
        }
        ratingsTrack.style.transform = `translate3d(${position}px, 0, 0)`;
      }
      requestAnimationFrame(scrollRatings);
    }
    requestAnimationFrame(scrollRatings);
  });
}
