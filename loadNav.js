
document.addEventListener("DOMContentLoaded", function () {
  fetch("nav.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("nav-placeholder").innerHTML = data;

      
      const currentPage =
        window.location.pathname.split("/").pop() || "index.html";
      const navLinks = document.querySelectorAll(".nav-links a");

      navLinks.forEach((link) => {
        const linkPage = link.getAttribute("href");
        if (
          linkPage === currentPage ||
          (currentPage === "" && linkPage === "index.html") ||
          (currentPage === "/" && linkPage === "index.html")
        ) {
          link.classList.add("active");
        }
      });

      
      const headerIcons = document.querySelectorAll(".header-icons a");

      headerIcons.forEach((icon) => {
        const iconHref = icon.getAttribute("href");
        if (iconHref === "favorites.html" && currentPage === "favorites.html") {
          icon.classList.add("active");
        }
      });
    })
    .catch((error) => console.error("Error loading navigation:", error));
});
