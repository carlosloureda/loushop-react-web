import React, { Component } from "react";
import StripeCheckout from "react-stripe-checkout";
import calcTotalPrice from "../lib/calcTotalPrice";
import User, { CURRENT_USER_QUERY } from "./User";

const totalItems = cart =>
  cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);

const stripePublicKey = "pk_test_h4IkfdNKJXal2GPvNpu3Yzh3";

class Payment extends Component {
  onToken = res => {
    console.log("token is: ", res.id);
  };
  render() {
    return (
      <User>
        {({ data: { me } }) => (
          <StripeCheckout
            amount={calcTotalPrice(me.cart)}
            description={`Order of ${totalItems(me.cart)} items`}
            image={me.cart[0].item.image}
            currency="USD"
            stripeKey={stripePublicKey}
            email={me.email}
            token={res => this.onToken(res)}
          >
            {this.props.children}
          </StripeCheckout>
        )}
      </User>
    );
  }
}

export default Payment;
