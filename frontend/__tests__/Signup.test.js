import { mount } from "enzyme";
import wait from "waait";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "react-apollo/test-utils";
import { ApolloConsumer } from "react-apollo";
import SignUp, { SIGNUP_MUTATION } from "../components/Signup";
import { CURRENT_USER_QUERY } from "../components/User";
import { fakeUser, fakeCartItem } from "../lib/testUtils";

function type(wrapper, name, value) {
  wrapper.find(`input[name="${name}"]`).simulate("change", {
    target: { name, value }
  });
}

const me = fakeUser();

const mocks = [
  // signup mock mutation
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        name: me.name,
        email: me.email,
        password: "123456"
      }
    },
    result: {
      data: {
        signup: {
          __typename: "User",
          id: "abc123",
          email: me.email,
          name: me.name
        }
      }
    }
  },
  //   current user mock

  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me } }
  }
];

describe("<Signup />", () => {
  it("renders and matches snapshot", async () => {
    const wrapper = mount(
      <MockedProvider>
        <SignUp />
      </MockedProvider>
    );
    expect(toJSON(wrapper.find("form"))).toMatchSnapshot();
  });

  it("calls the mutation properly", async () => {
    let apolloClient;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client;
            return <SignUp />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    type(wrapper, "email", me.email);
    type(wrapper, "name", me.name);
    type(wrapper, "password", "123456");
    wrapper.update();
    // console.log("wrapper", wrapper.debug());
    wrapper.find("form").simulate("submit");
    await wait();
    // query the user out of the apollo client

    const user = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(user.data.me).toMatchObject(me);
  });
});
