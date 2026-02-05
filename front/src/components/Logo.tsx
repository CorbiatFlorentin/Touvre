type LogoProps = {
  className?: string
}

function Logo({ className }: LogoProps) {
  return (
    <img
      className={className}
      src="/IMG_1812.jpeg"
      alt="Logo IMG 1812"
    />
  )
}

export default Logo
