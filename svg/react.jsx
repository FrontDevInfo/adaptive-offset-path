const svgElement = (isSafariBrowser, isIPhoneBrowser, svg, lineWidth) => {
 
    const animateMotion = () => {
      return (
        <animateMotion 
          dur="10s" 
          repeatCount="indefinite" 
          calcMode="linear" 
          path="M20,50 C20,-50 180,150 180,50 C180-50 20,150 20,50 z" />
      )
    }
      return <svg  
                ref={svg} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 1172 1882" 
                stroke="none" 
                fill='none'>
                <path 
                  d="M20,50 C20,-50 180,150 180,50 C180-50 20,150 20,50 z" 
                  transform="translate(0.5 0.5)" 
                  id="theMotionPath2"/>

              <circle cx="0" cy="0" r="10" fill="#1CFFB3" opacity="1"> 
                  {animateMotion()}    
              </circle>     
            </svg>

  }