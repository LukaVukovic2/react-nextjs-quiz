import { MutableRefObject } from "react";
import Swiper from "swiper";

export const manageSlideTransition = (
  questionType: string,
  isTransitioning: boolean,
  swiperRef: MutableRefObject<Swiper | null>,
  timeoutRef: MutableRefObject<NodeJS.Timeout | null>
) => {
  if (!isTransitioning && swiperRef.current !== null) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (!swiperRef.current?.pagination) return;

      swiperRef.current.pagination.render();
      if (questionType === "Single choice") swiperRef.current.slideNext();
      timeoutRef.current = null;
    }, swiperRef.current.params.speed);
  }
};