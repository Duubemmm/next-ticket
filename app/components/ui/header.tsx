// import Link from "next/link";

const Header = () => {
  const navLinks = [{
  name: "Home", Link: "/", id: 1
  },
{
  name: "Concert Week", Link: "/concert-week", id:2
},
{
  name: "All events", Link: "/all events", id:3
}
]
  return (
    <>
    {/* Logo Section */}
    <h1>
      Consartz
    </h1>
<nav>
  {navLinks.map((link) => (
    <li  key={link.id} >{link.name}</li>
  ))}
</nav>
    </>
  )
} 

export default Header;