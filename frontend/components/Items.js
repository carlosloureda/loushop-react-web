import React, { Component } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import Item from "./Item";
import Pagination from "./Pagination";
import { perPage } from "../config";

const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY($skip: Int = 0, $first: Int = ${perPage}) {
    items(skip: $skip, first: $first, orderBy: createdAt_DESC) {
      id
      title
      price
      description
      image
      largeImage
    }
  }
`;

const Center = styled.div`
  text-align: center;
`;
const ItemList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`;
class Items extends Component {
  state = {};
  render() {
    return (
      <div>
        <Center>
          <Pagination page={this.props.page} />
          <Query
            query={ALL_ITEMS_QUERY}
            // fetchPolicy="network-only"
            variables={{
              skip: this.props.page * perPage - perPage,
              first: perPage
            }}
          >
            {({ data, error, loading }) => {
              if (loading) return <p>Loading ...</p>;
              if (error) return <p>Error: {error.message}</p>;
              return (
                <ItemList>
                  {data.items.map(item => {
                    return <Item item={item} key={item.id} />;
                  })}
                </ItemList>
              );
            }}
          </Query>
          <Pagination page={this.props.page} />
        </Center>
      </div>
    );
  }
}

Items.propTypes = {
  page: PropTypes.number.isRequired
};

export default Items;
export { ALL_ITEMS_QUERY };
