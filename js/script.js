"use strict";

const menuBtn = document.querySelector(".menu__icon");
const mobMenu = document.querySelector(".menu");
const overlay = document.querySelector(".overlay");
const wrapper = document.querySelector(".wrapper");

menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("menu__icon--active");
  mobMenu.classList.toggle("menu--active");
  overlay.classList.toggle("overlay--active");
  if (wrapper.classList.contains("wrapper--active")) {
    wrapper.classList.remove("wrapper--active");
  } else {
    wrapper.classList.add("wrapper--active");
  }
});

const navLink = document.querySelectorAll(".menu__link");

navLink.forEach((item) => {
  item.addEventListener("click", function (e) {
    e.preventDefault();

    menuBtn.classList.remove("menu__icon--active");
    mobMenu.classList.remove("menu--active");
    overlay.classList.remove("overlay--active");
    wrapper.classList.remove("wrapper--active");

    const blockId = item.getAttribute("href").substring(1);

    document.getElementById(blockId).scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});
const headerHeight = document.querySelector(".header").offsetHeight;
const options = {
  root: null,
  rootMargin: `-${headerHeight}px 0px 0px 0px`,
  threshold: 0,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting && entry.boundingClientRect.top < headerHeight) {
      entry.target.classList.add("hidden");
    } else {
      entry.target.classList.remove("hidden");
    }
  });
}, options);

const menuItems = document.querySelectorAll(".menu__list li a");
menuItems.forEach((item) => observer.observe(item));

let documentActions = (e) => {
  const button = e.target.closest(".btn--action");

  if (button) {
    document.querySelectorAll(".btn--action").forEach((item) => {
      item.classList.remove("touch");
    });

    button.classList.add("touch");
  }
};
document.addEventListener("DOMContentLoaded", () => {
  const searchTrigger = document.querySelector(".header__search");
  const searchForm = document.querySelector(".search");
  const searchInput = document.querySelector(".search__input");

  if (searchTrigger && searchForm) {
    searchTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      searchTrigger.classList.toggle("active");
      searchForm.classList.toggle("active");

      if (searchForm.classList.contains("active")) {
        searchInput.focus();
      }
    });

    searchForm.addEventListener("submit", (e) => {
      if (searchInput.value.trim() === "") {
        e.preventDefault();
        searchTrigger.classList.remove("active");
        searchForm.classList.remove("active");
      }
    });

    document.addEventListener("click", (e) => {
      if (!searchForm.contains(e.target) && !searchTrigger.contains(e.target)) {
        searchTrigger.classList.remove("active");
        searchForm.classList.remove("active");
      }
    });
  }
});
function ibg() {
  let ibg = document.querySelectorAll(".ibg");
  for (let i = 0; i < ibg.length; i++) {
    if (ibg[i].querySelector("img")) {
      ibg[i].style.backgroundImage =
        "url(" + ibg[i].querySelector("img").getAttribute("src") + ")";
    }
  }
}

ibg();

document.addEventListener("click", (e) => {
  const button = e.target.closest(".chek__btn");
  if (!button) return;

  document.querySelector(".chek__btn.active")?.classList.remove("active");
  button.classList.add("active");
});

function DynamicAdapt(type) {
  this.type = type;
}

DynamicAdapt.prototype.init = function () {
  const _this = this;
  // массив объектов
  this.оbjects = [];
  this.daClassname = "_dynamic_adapt_";
  // массив DOM-элементов
  this.nodes = document.querySelectorAll("[data-da]");

  // наполнение оbjects объктами
  for (let i = 0; i < this.nodes.length; i++) {
    const node = this.nodes[i];
    const data = node.dataset.da.trim();
    const dataArray = data.split(",");
    const оbject = {};
    оbject.element = node;
    оbject.parent = node.parentNode;
    оbject.destination = document.querySelector(dataArray[0].trim());
    оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
    оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
    оbject.index = this.indexInParent(оbject.parent, оbject.element);
    this.оbjects.push(оbject);
  }

  this.arraySort(this.оbjects);

  // массив уникальных медиа-запросов
  this.mediaQueries = Array.prototype.map.call(
    this.оbjects,
    function (item) {
      return (
        "(" +
        this.type +
        "-width: " +
        item.breakpoint +
        "px)," +
        item.breakpoint
      );
    },
    this,
  );
  this.mediaQueries = Array.prototype.filter.call(
    this.mediaQueries,
    function (item, index, self) {
      return Array.prototype.indexOf.call(self, item) === index;
    },
  );

  // навешивание слушателя на медиа-запрос
  // и вызов обработчика при первом запуске
  for (let i = 0; i < this.mediaQueries.length; i++) {
    const media = this.mediaQueries[i];
    const mediaSplit = String.prototype.split.call(media, ",");
    const matchMedia = window.matchMedia(mediaSplit[0]);
    const mediaBreakpoint = mediaSplit[1];

    // массив объектов с подходящим брейкпоинтом
    const оbjectsFilter = Array.prototype.filter.call(
      this.оbjects,
      function (item) {
        return item.breakpoint === mediaBreakpoint;
      },
    );
    matchMedia.addListener(function () {
      _this.mediaHandler(matchMedia, оbjectsFilter);
    });
    this.mediaHandler(matchMedia, оbjectsFilter);
  }
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
  if (matchMedia.matches) {
    for (let i = 0; i < оbjects.length; i++) {
      const оbject = оbjects[i];
      оbject.index = this.indexInParent(оbject.parent, оbject.element);
      this.moveTo(оbject.place, оbject.element, оbject.destination);
    }
  } else {
    for (let i = 0; i < оbjects.length; i++) {
      const оbject = оbjects[i];
      if (оbject.element.classList.contains(this.daClassname)) {
        this.moveBack(оbject.parent, оbject.element, оbject.index);
      }
    }
  }
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
  element.classList.add(this.daClassname);
  if (place === "last" || place >= destination.children.length) {
    destination.insertAdjacentElement("beforeend", element);
    return;
  }
  if (place === "first") {
    destination.insertAdjacentElement("afterbegin", element);
    return;
  }
  destination.children[place].insertAdjacentElement("beforebegin", element);
};

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
  element.classList.remove(this.daClassname);
  if (parent.children[index] !== undefined) {
    parent.children[index].insertAdjacentElement("beforebegin", element);
  } else {
    parent.insertAdjacentElement("beforeend", element);
  }
};

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
  const array = Array.prototype.slice.call(parent.children);
  return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
  if (this.type === "min") {
    Array.prototype.sort.call(arr, function (a, b) {
      if (a.breakpoint === b.breakpoint) {
        if (a.place === b.place) {
          return 0;
        }

        if (a.place === "first" || b.place === "last") {
          return -1;
        }

        if (a.place === "last" || b.place === "first") {
          return 1;
        }

        return a.place - b.place;
      }

      return a.breakpoint - b.breakpoint;
    });
  } else {
    Array.prototype.sort.call(arr, function (a, b) {
      if (a.breakpoint === b.breakpoint) {
        if (a.place === b.place) {
          return 0;
        }

        if (a.place === "first" || b.place === "last") {
          return 1;
        }

        if (a.place === "last" || b.place === "first") {
          return -1;
        }

        return b.place - a.place;
      }

      return b.breakpoint - a.breakpoint;
    });
    return;
  }
};

const da = new DynamicAdapt("max");
da.init();

const swiper = new Swiper(".tools__items", {
  slidesPerView: 5,
  spaceBetween: 10,
  centeredSlides: true,
  loop: true,
  autoheight: true,
  effect: "coverflow",

  coverflowEffect: {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    scale: 0.9,
    slideShadows: false,
  },

  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },

  navigation: {
    nextEl: ".slider-tools-right",
    prevEl: ".slider-tools-left",
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    480: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
    },
    1024: {
      slidesPerView: 4,
    },
  },
});

const saySlider = new Swiper(".say__slider-hero", {
  slidesPerView: 1,
  spaceBetween: 10,
  centeredSlides: true,
  loop: true,
  loopedSlides: 3,
  autoHeight: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  effect: "coverflow",
  coverflowEffect: {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    scale: 0.9,
    slideShadows: false,
  },
  navigation: {
    nextEl: ".say-right",
    prevEl: ".say-left",
  },
});

const sayprewiev = new Swiper(".prewiev-say__body", {
  slidesPerView: 2,
  spaceBetween: 10,
  loop: true,
  loopedSlides: 3,
  autoHeight: true,
  effect: "coverflow",
  coverflowEffect: {
    rotate: 20,
    stretch: 0,
    depth: 100,
    modifier: 1,
    scale: 0.9,
    slideShadows: false,
  },
});
saySlider.controller.control = sayprewiev;
sayprewiev.controller.control = saySlider;

const TrainerSlider = new Swiper(".trainer__items", {
  slidesPerView: 4,
  spaceBetween: 20,
  loopedSlides: 3,
  loop: true,
  autoHeight: true,

  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },

  navigation: {
    nextEl: ".slider-trainer-right",
    prevEl: ".slider-trainer-left",
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    480: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
    },
    1024: {
      slidesPerView: 4,
    },
  },
});

document.addEventListener("DOMContentLoaded", () => {
  const triggers = document.querySelectorAll(".faq__spoiler-top");
  const textStorage = new Map();
  const typingTimers = new Map();

  document.querySelectorAll(".spoiler-asked__inner").forEach((container) => {
    const cleanText = container.textContent.replace(/\s+/g, " ").trim();

    textStorage.set(container, cleanText);
    container.textContent = "";
  });

  function startTyping(textContainer, contentBlock) {
    if (typingTimers.has(textContainer)) {
      clearInterval(typingTimers.get(textContainer));
    }

    const fullText = textStorage.get(textContainer);
    textContainer.textContent = "";
    contentBlock.style.maxHeight = "300px";

    let index = 0;
    const speed = 2;

    const interval = setInterval(() => {
      if (index < fullText.length) {
        textContainer.textContent += fullText.charAt(index);
        index++;
        contentBlock.style.maxHeight = contentBlock.scrollHeight + "px";
      } else {
        clearInterval(interval);
        typingTimers.delete(textContainer);
      }
    }, speed);

    typingTimers.set(textContainer, interval);
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const parent = trigger.closest(".faq__spoiler");
      if (!parent) return;

      const content = parent.querySelector(".faq__spoiler-text p");
      const textContainer = parent.querySelector(".spoiler-asked__inner");
      if (!content || !textContainer) return;

      trigger.classList.toggle("faq__spoiler--open");

      if (trigger.classList.contains("faq__spoiler--open")) {
        startTyping(textContainer, content);
      } else {
        if (typingTimers.has(textContainer)) {
          clearInterval(typingTimers.get(textContainer));
        }
        content.style.maxHeight = "0px";

        setTimeout(() => {
          if (!trigger.classList.contains("faq__spoiler--open")) {
            textContainer.textContent = "";
          }
        }, 300);
      }
    });
  });
});
