
window.addEventListener(("DOMContentLoaded"), () => {
  try {
    const container = document.getElementById('container');
    const path = 'M177.9,1l831.84-1C1098.46,2,1171,74.25,1170,158.17c-1,87.34-81.25,159.54-173.51,154.16l-823.68.28-18.37.72C70,318.28,5,383.34.3,458.49-4.9,541.16,63,625.79,165.65,625.67h14.28c277.29-.34,829.81,0,831.85,0,88.71,2,159.2,74.25,158.2,158.16-1,87.34-79.2,161.54-171.47,156.17l-823.68.28-18.37.72C72,946,5,1011,.29,1086.15c-5.37,85.35,65.27,167.3,162.29,167.18h3.06l845.13-1c88.71,2,160.22,74.25,159.22,158.17-1,87.34-83.12,157.14-175.56,157.17-265.74.08-820,1.28-820.61.28l-18.37-.28C71,1573.62,5,1638.67.3,1713.82-5.41,1804.51,70,1881.12,166.67,1881H816.84';

      const base = {
        width: 1171,
        height: 1882
      };

      const dot = container.querySelector('#ball');
      const pathfitter = new Pathfit(base, undefined, path);

      const setPath = () => {
        if(pathfitter && dot && container) {
          const scaled_path = pathfitter.scale_with_aspect_ratio(container.offsetWidth, container.offsetHeight);
          dot.style.offsetPath = `path('${scaled_path}')`;
        }  
      }
      

      window.addEventListener('resize', setPath)
  } catch (error) {
    console.log(error)
  }
  
})

