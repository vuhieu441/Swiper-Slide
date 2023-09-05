window.addEventListener("load", function () {
  const swiperWrapper = document.querySelector(".swiper-wrapper");
  const swiperSlide = document.querySelectorAll(".swiper-slide");
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
    swiperWrapper.style = `transform: translateX(${positionX}px)`;
    prevBtn.classList.remove("disable");
    if (currentIndex >= swiperSlide?.length - 1) {
      nextBtn.classList.add("disable");
    }
    setTimeout(() => {
      isClick = false;
    }, 2000);
  });

  prevBtn.addEventListener("click", function () {
    isClick = true;
    if (currentIndex === 0) return;

    currentIndex--;
    positionX = positionX + itemWidth;
    swiperWrapper.style = `transform: translateX(${positionX}px)`;
    nextBtn.classList.remove("disable");
    if (!currentIndex) {
      prevBtn.classList.add("disable");
    }
    setTimeout(() => {
      isClick = false;
    }, 2000);
  });

  !isClick &&
    swiperSlide?.forEach((slide, index) => {
      slide.addEventListener("dragstart", (e) => e.preventDefault());
      // pointer events
      slide.addEventListener("pointerdown", pointerDown(index));
      slide.addEventListener("pointerup", pointerUp);
      slide.addEventListener("pointerleave", pointerUp);
      slide.addEventListener("pointermove", pointerMove);

      //Touch Event
      slide.addEventListener("touchstart", pointerDown(index));
      slide.addEventListener("touchend", pointerUp);
      slide.addEventListener("touchmove", pointerMove);

      // Disable context menu
      window.oncontextmenu = function (event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      };

      function pointerDown(index) {
        return function (event) {
          currentIndex = index;
          startPos = event?.pointerType
            ? event.clientX
            : event?.touches[0].clientX;
          isDragging = true;
          animationID = requestAnimationFrame(animation);
          slide.classList.add("grabbing");
        };
      }

      function pointerMove(event) {
        if (isDragging) {
          const currentPosition = event.clientX;
          currentTranslate = prevTranslate + currentPosition - startPos;
        }
      }

      function pointerUp() {
        cancelAnimationFrame(animationID);
        isDragging = false;
        const movedBy = currentTranslate - prevTranslate;

        // if moved enough negative then snap to next slide if there is one
        if (movedBy < -100 && currentIndex < swiperSlide.length - 1) {
          currentIndex += 1;
          nextBtn.classList.remove("disable");
          if (currentIndex >= swiperSlide?.length - 1) {
            nextBtn.classList.add("disable");
          }
          prevBtn.classList.remove("disable");
          if (!currentIndex) {
            prevBtn.classList.add("disable");
          }
        }

        // if moved enough positive then snap to previous slide if there is one
        if (movedBy > 100 && currentIndex > 0) {
          currentIndex -= 1;
          prevBtn.classList.remove("disable");
          if (!currentIndex) {
            prevBtn.classList.add("disable");
          }
          nextBtn.classList.remove("disable");
          if (currentIndex >= swiperSlide?.length - 1) {
            nextBtn.classList.add("disable");
          }
        }
        indexItem = currentIndex;
        setPositionByIndex();
        slide.classList.remove("grabbing");
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
});
