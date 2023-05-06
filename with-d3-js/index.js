
window.addEventListener(("DOMContentLoaded"), () => {
  const container = document.getElementById('container');
  const svgBox = document.createElement('div');

  class Meanderer {
    container
    height
    path
    threshold
    width
    svgBox
    constructor({ height, path, threshold = 0.2, width, svgBox }) {
      this.height = height
      this.path = path
      this.threshold = threshold
      this.width = width
      this.svgBox = svgBox
      // With what we are given create internal references
      this.aspect_ratio = width / height
      // Convert the path into a data set
      this.path_data =  this.convertPathToData(path, svgBox)
      this.maximums = this.getMaximums(this.path_data) 
      this.range_ratios =  this.getRatios(this.maximums, width, height)
    }
    // This is relevant for when we want to interpolate points to
    // the container scale. We need the minimum and maximum for both X and Y
    getMaximums = data => {
      const X_POINTS = data.map(point => point[0])
      const Y_POINTS = data.map(point => point[1])
      return [
        Math.max(...X_POINTS), // x2
        Math.max(...Y_POINTS), // y2
      ]
    }
    // Generate some ratios based on the data points and the path width and height
    getRatios = (maxs, width, height) => [maxs[0] / width, maxs[1] / height]
  
    /**
     * Initially convert the path to data. Should only be required
     * once as we are simply scaling it up and down. Only issue could be upscaling??
     * Create high quality paths initially
     */
    convertPathToData = (path, svgBox) => {
     // To convert the path data to points, we need an SVG path element.
     const svgContainer = svgBox;
     // To create one though, a quick way is to use innerHTML
     svgContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">
                               <path d="${path}"/>
                             </svg>`
     const pathElement = svgContainer.querySelector('path')
     // Now to gather up the path points using the SVGGeometryElement API 👍
     const DATA = []
     // Iterate over the total length of the path pushing the x and y into
     // a data set for d3 to handle 👍
     for (let p = 0; p < pathElement.getTotalLength(); p++) {
       const { x, y } = pathElement.getPointAtLength(p)
       DATA.push([x, y])
     }
     return DATA
    }
  
    /**
     * This is where the magic happens.
     * Use ratios etc. to interpolate our data set against our container bounds.
     */
    generatePath = (containerWidth, containerHeight) => {
      const {
        height,
        width,
        aspect_ratio: aspectRatio,
        path_data: data,
        maximums: [maxWidth, maxHeight],
        range_ratios: [widthRatio, heightRatio],
        threshold,
      } = this
      const OFFSETS = [0, 0]
      // Get the aspect ratio defined by the container
      const newAspectRatio = containerWidth / containerHeight
      // We only need to start applying offsets if the aspect ratio of the container is off 👍
      // In here we need to work out which side needs the offset. It's whichever one is smallest in order to centralize.
      // What if the container matches the aspect ratio...
      if (Math.abs(newAspectRatio - aspectRatio) > threshold) {
        // We know the tolerance is off so we need to work out a ratio
        // This works flawlessly. Now we need to check for when the height is less than the width
        if (width < height) {
          const ratio = (height - width) / height
          OFFSETS[0] = (ratio * containerWidth) / 2
        } else {
          const ratio = (width - height) / width
          OFFSETS[1] = (ratio * containerHeight) / 2
        }
      }
      // Create two d3 scales for X and Y
      const xScale = d3.scaleLinear()
        .domain([0, maxWidth])
        .range([OFFSETS[0], containerWidth * widthRatio - OFFSETS[0]])
      const yScale = d3.scaleLinear()
        .domain([0, maxHeight])
        .range([OFFSETS[1], containerHeight * heightRatio - OFFSETS[1]])
      // Map our data points using the scales
      const SCALED_POINTS = data.map(POINT => [
        xScale(POINT[0]),
        yScale(POINT[1]),
      ])
      return d3.line()(SCALED_POINTS)
    }
  }
      
    const path = 'M12.16,26.23C18.19,13.05,31.67,7.82,40.93,12,47.32,14.83,53,22.76,51,28.09,47.48,37.59,22.76,30.32,16.57,42c-3.33,6.27,0,15.55,5.33,20.07,9,7.61,25.56,3.17,32.6-5.45,6.69-8.19,2.35-17.16,9.75-22.39,4.84-3.43,11.74-3.15,16.47-.81C91.5,38.75,90.9,54.66,90.81,56.86,90.2,72.92,77.14,82.55,76.08,83.31c-17.49,12.47-44.19,6.16-45.71-.58-.62-2.76,2.74-6.59,6.27-7.89,6.74-2.48,11.18,5.41,21.11,4.64.89-.07,8.55-.77,12.88-6.61s3.15-13.66,2.9-15.2c-.7-4.21-2.2-5.43-1.74-9.05.41-3.24,2.32-7.7,5.22-8.12,3.5-.5,7.44,5,8.35,10a15.36,15.36,0,0,1-2.44,10.91'
    const height = 174.05
    const width = 313.61
    
    const responsive = new Meanderer({
        path,
        height,
        width,
        svgBox
    })
      
    const setPath = () => {
        if(container) {
            const scaledPath = responsive.generatePath(container.offsetWidth, container.offsetHeight)
            container.style.setProperty('--path', `"${scaledPath}"`)
            d3.select('.result path').attr('d', scaledPath)
        }
    }
      
    if(container) {
        const SizeObserver = new ResizeObserver(setPath)
        SizeObserver.observe(container)
    }
})

