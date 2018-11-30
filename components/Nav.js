import Link from "next/link";
import NavStyles from "./styles/NavStyles";
import User from "./User";
import Signout from "./Signout";
// if (me) return <p>{me.name}</p>; // return null; // )}
const Nav = () => (
  <User>
    {({ data: { me }, loading, error }) => (
      <NavStyles>
        <Link href="/items">
          <a>Shop</a>
        </Link>
        {me && (
          <>
            <Link href="/sell">
              <a>Sell</a>
            </Link>
            <Link href="/orders">
              <a>orders</a>
            </Link>
            <Link href="/me">
              <a>account</a>
            </Link>
            <Signout />
          </>
        )}
        {!me && (
          <Link href="/signup">
            <a>Sign In</a>
          </Link>
        )}
      </NavStyles>
    )}
  </User>
);

export default Nav;
