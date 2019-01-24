import { mount } from "enzyme";
import wait from "waait";
import { MockedProvider } from "react-apollo/test-utils";
import RequestReset, {
  REQUEST_RESET_MUTATION
} from "../components/RequestReset";
import { CURRENT_USER_QUERY } from "../components/User";
import toJSON from "enzyme-to-json";
import { fakeUser, fakeCartItem } from "../lib/testUtils";

const mocks = [
  {
    request: {
      query: REQUEST_RESET_MUTATION,
      variables: { email: "carloslouredaparrado@gmail.com" }
    },
    result: {
      data: { requestReset: { message: "success", __typename: "Message" } }
    }
  },
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem(), fakeCartItem(), fakeCartItem()]
        }
      }
    }
  }
];

// const signedInMocksWithCartItems = [
//   {
//     request: { query: CURRENT_USER_QUERY },
//     result: {
//       data: {
//         me: {
//           ...fakeUser(),
//           cart: [fakeCartItem(), fakeCartItem(), fakeCartItem()]
//         }
//       }
//     }
//   }
// ];

describe("<RequestRest />", () => {
  it("renders and matches snapshot", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RequestReset />
      </MockedProvider>
    );
    const form = wrapper.find('form[data-test="form"]');
    expect(toJSON(form)).toMatchSnapshot();
  });

  it("calls the mutation", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RequestReset />
      </MockedProvider>
    );
    // simulate typing an email
    wrapper.find("input").simulate("change", {
      target: { name: "email", value: "carloslouredaparrado@gmail.com" }
    });
    // submit the form
    wrapper.find("form").simulate("submit");
    await wait();
    wrapper.update();
    expect(wrapper.find("p").text()).toContain(
      "Success! Check your email for a reset link!"
    );
  });
});
