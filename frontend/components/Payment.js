import React, { Component } from "react";
import StripeCheckout from "react-stripe-checkout";
import calcTotalPrice from "../lib/calcTotalPrice";
import User, { CURRENT_USER_QUERY } from "./User";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

const totalItems = cart =>
  cart.reduce(
    (tally, cartItem) => tally + cartItem.item.price * cartItem.quantity,
    0
  );

const stripePublicKey = "pk_test_h4IkfdNKJXal2GPvNpu3Yzh3";

class Payment extends Component {
  onToken = async (res, createOrder) => {
    console.log("token is: ", res.id);
    const order = await createOrder({
      variables: { token: res.id }
    }).catch(e => alert(e.message));
  };
  render() {
    return (
      <User>
        {({ data: { me } }) => (
          <Mutation
            mutation={CREATE_ORDER_MUTATION}
            refetchQueries={[{ query: CURRENT_USER_QUERY }]}
          >
            {createOrder => (
              <StripeCheckout
                amount={calcTotalPrice(me.cart)}
                description={`Order of ${totalItems(me.cart)} items`}
                image={me.cart && me.cart.length ? me.cart[0].item.image : null}
                currency="USD"
                stripeKey={stripePublicKey}
                email={me.email}
                token={res => this.onToken(res, createOrder)}
              >
                {this.props.children}
              </StripeCheckout>
            )}
          </Mutation>
        )}
      </User>
    );
  }
}

export default Payment;
