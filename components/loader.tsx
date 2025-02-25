const Loader = () => (
  <div className="flex justify-center items-center min-h-screen">
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(0 50 50)">
        <path fill="#ffcc66" stroke="#cc9900" strokeWidth="2"
          d="M30 70 Q50 90 70 70 L75 90 Q50 95 25 90 Z" />
        
        <path fill="#ff99cc" stroke="#cc6699" strokeWidth="2"
          d="M35 55 Q50 35 65 55 Q75 40 50 30 Q25 40 35 55 Z" />
        <circle cx="50" cy="28" r="5" fill="#ff3333" />
      </g>

      <animateTransform 
        attributeType="XML" 
        attributeName="transform" 
        type="rotate" 
        from="0 50 50" 
        to="360 50 50" 
        dur="1s" 
        repeatCount="indefinite"
      />
    </svg>
  </div>
);

export default Loader;
