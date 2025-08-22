const Logo = ({ className = '', ...props }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <rect width="32" height="32" rx="8" fill="currentColor" />
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="16" fill="white" fontFamily="Arial">
      SDQ
    </text>
  </svg>
);

export default Logo;
