
document.addEventListener("DOMContentLoaded", function () {

  const publications = document.querySelectorAll(
    ".pub.reveal, .vorscorp-feature.reveal"
  );

  if (!("IntersectionObserver" in window)) {
    publications.forEach(item => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const index = Array.from(publications).indexOf(entry.target);
        entry.target.style.transitionDelay = `${index * 90}ms`;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  publications.forEach(item => observer.observe(item));

});
