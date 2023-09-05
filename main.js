window.addEventListener("load", function () {
  const swiperWrapper = document.querySelector(".swiper-wrapper");
  const swiperSlide = document.querySelectorAll(".swiper-slide");
  const dotsItem = document.querySelectorAll(".swiper-button-dot-item");
  const prevBtn = document.querySelector(".swiper-button-prev");
  const nextBtn = document.querySelector(".swiper-button-next");

  const itemWidth = swiperSlide[0].offsetWidth;

  let positionX = 0,
    isDragging = false,
    isClick = false,
    startPos = 0,
    currentTranslate = 0,
    currentIndex = 0,
    prevTranslate = 0,
    animationID;

  if (!currentIndex) {
    prevBtn.classList.add("disable");
  }

  nextBtn.addEventListener("click", function () {
    isClick = true;
    if (currentIndex >= swiperSlide?.length - 1) return;
    currentIndex++;
    positionX = positionX - itemWidth;
    dotsItem.forEach((element) => element.classList.remove("active"));
    dotsItem[currentIndex].classList.add("active");
    swiperWrapper.style = `transform: translateX(${positionX}px)`;
    prevBtn.classList.remove("disable");

    if (currentIndex >= swiperSlide?.length - 1) {
      nextBtn.classList.add("disable");
    }

    setTimeout(() => {
      isClick = false;
    }, 1000);
  });

  prevBtn.addEventListener("click", function () {
    isClick = true;
    if (currentIndex === 0) return;
    currentIndex--;
    positionX = positionX + itemWidth;
    dotsItem.forEach((element) => element.classList.remove("active"));
    dotsItem[currentIndex].classList.add("active");
    swiperWrapper.style = `transform: translateX(${positionX}px)`;
    nextBtn.classList.remove("disable");

    if (!currentIndex) {
      prevBtn.classList.add("disable");
    }

    setTimeout(() => {
      isClick = false;
    }, 1000);
  });

  !isClick &&
    swiperSlide?.forEach((slide, index) => {
      slide.addEventListener("dragstart", (e) => e.preventDefault());

      //Touch Event
      slide.addEventListener("touchstart", touchStart(index));
      slide.addEventListener("touchend", touchEnd);
      slide.addEventListener("touchmove", touchMove);

      // Mouse events
      slide.addEventListener("mousedown", touchStart(index));
      slide.addEventListener("mouseup", touchEnd);
      slide.addEventListener("mouseleave", touchEnd);
      slide.addEventListener("mousemove", touchMove);

      // Disable context menu
      window.oncontextmenu = function (event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      };

      function touchStart(index) {
        return function (event) {
          currentIndex = index;
          startPos = getPositionX(event);
          isDragging = true;
          animationID = requestAnimationFrame(animation);
        };
      }

      function touchMove(event) {
        if (isDragging) {
          const currentPosition = getPositionX(event);
          currentTranslate = prevTranslate + currentPosition - startPos;
        }
      }

      function touchEnd() {
        cancelAnimationFrame(animationID);
        isDragging = false;
        const movedBy = currentTranslate - prevTranslate;

        // if moved enough negative then snap to next slide if there is one
        if (movedBy < -100 && currentIndex < swiperSlide.length - 1) {
          currentIndex += 1;
        }

        // if moved enough positive then snap to previous slide if there is one
        if (movedBy > 100 && currentIndex > 0) {
          currentIndex -= 1;
        }
        dotsItem.forEach((element) => element.classList.remove("active"));
        dotsItem[currentIndex].classList.add("active");
        prevBtn.classList.remove("disable");
        if (!currentIndex) {
          prevBtn.classList.add("disable");
        }
        nextBtn.classList.remove("disable");
        if (currentIndex >= swiperSlide?.length - 1) {
          nextBtn.classList.add("disable");
        }
        indexItem = currentIndex;
        setPositionByIndex();
      }

      function getPositionX(event) {
        return event.type.includes("mouse")
          ? event.clientX
          : event.touches[0].clientX;
      }

      function animation() {
        if (isDragging) {
          setSliderPosition();
          requestAnimationFrame(animation);
        }
      }

      function setPositionByIndex() {
        currentTranslate = currentIndex * -window.innerWidth;
        prevTranslate = currentTranslate;
        positionX = currentTranslate;
        setSliderPosition();
      }

      function setSliderPosition() {
        swiperWrapper.style = `transform: translateX(${currentTranslate}px)`;
      }
    });

  dotsItem.forEach((item) => {
    item.addEventListener("click", function (event) {
      dotsItem.forEach((element) => element.classList.remove("active"));
      event.target.classList.add("active");
      const sliderIndex = +event.target.dataset.index;
      currentIndex = sliderIndex;
      positionX = -1 * currentIndex * itemWidth;
      swiperWrapper.style = `transform: translateX(${positionX}px)`;
      prevBtn.classList.remove("disable");
      if (!currentIndex) {
        prevBtn.classList.add("disable");
      }
      nextBtn.classList.remove("disable");
      if (currentIndex >= swiperSlide?.length - 1) {
        nextBtn.classList.add("disable");
      }
    });
  });
});
