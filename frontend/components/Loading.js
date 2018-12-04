import styled from "styled-components";
import React from "react";

import PropTypes from "prop-types";

const LoadingStyles = styled.div`
  /* padding: 2rem;
  background: white;
  margin: 2rem 0;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-left: 5px solid red;
  p {
    margin: 0;
    font-weight: 100;
  }
  strong {
    margin-right: 1rem;
  } */
`;

const DisplayLoading = ({ loading }) => {
  if (!loading) return null;
  return (
    <LoadingStyles>
      <p data-test="graphql-loading">
        <strong>Loading ...</strong>
      </p>
    </LoadingStyles>
  );
};

DisplayLoading.defaultProps = {
  loading: false
};

DisplayLoading.propTypes = {
  loading: PropTypes.boolean
};

export default DisplayLoading;
