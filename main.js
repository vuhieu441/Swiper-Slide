window.addEventListener("load", function () {
  const swiperWrapper = document.querySelector(".swiper-wrapper");
  const swiperSlide = document.querySelectorAll(".swiper-slide");
  const prevBtn = document.querySelector(".swiper-button-prev");
  const nextBtn = document.querySelector(".swiper-button-next");

  const itemWidth = swiperSlide[0].offsetWidth;

  let index = 0;
  let positionX = 0;

  if (!index) {
    prevBtn.classList.add("disable");
  }

  nextBtn.addEventListener("click", function () {
    if (index >= swiperSlide?.length - 1) return;
    index++;
    positionX = positionX - itemWidth;
    swiperWrapper.style = `transform: translateX(${positionX}px)`;
    prevBtn.classList.remove("disable");
    if (index >= swiperSlide?.length - 1) {
      nextBtn.classList.add("disable");
    }
  });

  prevBtn.addEventListener("click", function () {
    if (index === 0) return;
    index--;
    positionX = positionX + itemWidth;
    swiperWrapper.style = `transform: translateX(${positionX}px)`;
    nextBtn.classList.remove("disable");
    if (!index) {
      prevBtn.classList.add("disable");
    }
  });
});
