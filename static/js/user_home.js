function toggleNavbarOnScroll() {
    let prevScrollY = window.scrollY;
    let navbar = document.querySelector(".navigation-bar");
    let navbarHeight = navbar.clientHeight;
  
    window.onscroll = function () {
      let currentScrollY = window.scrollY;
      if (prevScrollY > currentScrollY && currentScrollY < navbarHeight) {
        navbar.style.top = "0";
      } else {
        navbar.style.top = "-" + navbarHeight + "px";
      }
      prevScrollY = currentScrollY;
    };
  }
  
  window.onload = toggleNavbarOnScroll;
  