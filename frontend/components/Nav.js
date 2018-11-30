import Link from "next/link";
import NavStyles from "./styles/NavStyles";
import User from "./User";

const Nav = () => (
  <NavStyles>
    <User>
      {/* Interesting detructuration */}
      {({ data: { me }, loading, error }) => {
        console.log(me);
        if (me) return <p>{me.name}</p>;
        return null;
      }}
    </User>
    <Link href="/items">
      <a>Shop</a>
    </Link>
    <Link href="/sell">
      <a>Sell!</a>
    </Link>
    <Link href="/signup">
      <a>signup</a>
    </Link>
    <Link href="/orders">
      <a>orders</a>
    </Link>
    <Link href="/me">
      <a>account</a>
    </Link>
  </NavStyles>
);

export default Nav;
