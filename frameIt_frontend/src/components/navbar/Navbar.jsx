import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";

function Navbar() {
  return (
    <div>
      <div className="hidden md:block">
        <NavbarDesktop />
      </div>
      <div className="md:hidden">
        <NavbarMobile />
      </div>
    </div>
  );
}

export default Navbar;
