
import Pathfit from './pathfit.js';

export const useAnimation = () => {
  const animation = async (container, line) => {
    try {
      const path = 'M20,50 C20,-50 180,150 180,50 C180-50 20,150 20,50 z';

      const base = {
        width: 1171,
        height: 1882
      };

      if(container) {
        const pathfitter = new Pathfit(base, undefined, path);
        const setPath = () => {
          if(pathfitter && line) {
            const scaled_path = pathfitter?.scale_with_aspect_ratio(container.offsetWidth, container.offsetHeight);
            line.style.offsetPath = `path('${scaled_path}')`;
          }  
        }

        const SizeObserver = new ResizeObserver(setPath)
        SizeObserver.observe(container)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return {
    animation
  };
};
