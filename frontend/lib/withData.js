import withApollo from "next-with-apollo"; //HOC that exposes ApolloClient via a prop
import ApolloClient from "apollo-boost";
import { endpoint, prodEndpoint } from "../config";
import { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION } from "../components/Cart";

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === "development" ? endpoint : prodEndpoint,
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: "include"
        },
        headers
      });
    },
    // local data
    clientState: {
      resolvers: {
        Mutation: {
          toggleCart(_, variables, { cache }) {
            // read the cartOpen from the cache
            const { cartOpen } = cache.readQuery({ query: LOCAL_STATE_QUERY });
            // write the cartState to the opossite
            const data = { data: { cartOpen: !cartOpen } };
            cache.writeData(data);
            return data;
          }
        }
      },
      defaults: {
        cartOpen: false
      }
    }
  });
}

export default withApollo(createClient);
