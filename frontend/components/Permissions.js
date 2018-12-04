import { Query } from "react-apollo";
import Error from "./ErrorMessage";
import Loading from "./Loading";
import gql from "graphql-tag";
import Table from "./styles/Table";
import SickButton from "./styles/SickButton";
import PropTypes from "prop-types";

const possiblePermissions = [
  "ADMIN",
  "USER",
  "ITEMCREATE",
  "ITEMUPDATE",
  "ITEMDELETE",
  "PERMISSIONUPDATE"
];
const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`;
const Permissions = props => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) => (
      <div>
        <Error error={error} />
        {loading && <Loading loading={loading} />}
        <div>
          <h2>Manage Permissions</h2>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {possiblePermissions.map(permission => (
                  <th key={permission}>{permission}</th>
                ))}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.users.map(user => <User user={user} key={user.id} />)}
            </tbody>
          </Table>
        </div>
      </div>
    )}
  </Query>
);

class User extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      permissions: PropTypes.array
    }).isRequired
  };
  state = {
    // not a good thing to set state with props , in this case yeah!
    permissions: this.props.user.permissions
  };
  handlePermissionChange = e => {
    const checked = e.target;
    let updatedPermissions = [...this.state.permissions]; //copy
    // need to add the new permission
    if (checked.checked) {
      updatedPermissions.push(checked.value);
    } else {
      //remove
      updatedPermissions = updatedPermissions.filter(
        permission => permission !== checked.value
      );
    }
    this.setState({
      permissions: updatedPermissions
    });
  };
  render() {
    const { user } = this.props;
    return (
      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        {possiblePermissions.map(permission => (
          <td key={permission}>
            <label htmlFor={`${user.id}-permission-${permission}`}>
              <input
                id={`${user.id}-permission-${permission}`}
                type="checkbox"
                checked={this.state.permissions.includes(permission)}
                onChange={this.handlePermissionChange}
                value={permission}
              />
            </label>
          </td>
        ))}
        <td>
          <SickButton>Update</SickButton>
        </td>
      </tr>
    );
  }
}

export default Permissions;
