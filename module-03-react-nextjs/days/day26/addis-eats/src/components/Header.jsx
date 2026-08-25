import '../style.css'
function Header() {

  return (
   <div>
    <nav class="navbar">
      <a href="#home" class="logo">Tomas Hailay-Portfolio</a>
      <ul class="nav-links">
        <li><a href="#about">About</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
   </div>
  )
}

export default Header
