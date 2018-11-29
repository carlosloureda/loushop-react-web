import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import Error from "./ErrorMessage";

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  state = {
    item: {
      title: "",
      description: "",
      image: "",
      largeImage: "",
      price: ""
    },
    error: {}
  };

  handleChange = e => {
    const { name, type, value } = e.target;
    const val = val && type === "number" ? parseFloat(value) : value;
    this.setState({
      item: {
        ...this.state.item,
        [name]: val
      }
    });
  };
  //TODO: Lot of work with iamges, show loading when image is uploading
  uploadFile = async e => {
    console.log("upload file ...");
    const files = e.target.files;
    if (!e.target.files) return;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "loushop");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/carloslorueda/image/upload",
      {
        method: "POST",
        body: data
      }
    );
    const file = await res.json();
    //TODO: Error with maxium files, set waringin message on before loading
    if (file.error) {
      this.setState({ error: file.error });
      return;
    }
    this.setState({
      item: {
        ...this.state.item,
        image: file.secure_url,
        largeImage:
          file.eager && file.eager.length
            ? file.eager[0].secure_url
            : file.secure.url
      }
    });
  };
  render() {
    const { item } = this.state;
    return (
      <Mutation refetchQueries={} mutation={CREATE_ITEM_MUTATION} variables={item}>
        {/* {(createItem, payload) => { */}
        {/* {(createItem, {loading, error, called, data}) => { */}
        {(createItem, { loading, error }) => (
          <Form
            onSubmit={async e => {
              e.preventDefault();
              const res = await createItem();
              Router.push({
                pathname: "/item",
                query: { id: res.data.createItem.id }
              });
            }}
          >
            <Error error={error} />
            <Error error={this.state.error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="file">
                Image
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Upoad an image"
                  required
                  onClick={() => this.setState({ error: {} })}
                  onChange={this.uploadFile}
                />
                {item.image && (
                  <img width="200" src={item.image} alt="Upload preview" />
                )}
              </label>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  required
                  value={item.title}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="price">
                Price
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Price"
                  required
                  value={item.price}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="description">
                Description
                <textarea
                  id="description"
                  name="description"
                  placeholder="Description"
                  required
                  value={item.description}
                  onChange={this.handleChange}
                />
              </label>
            </fieldset>
            <button type="submit">Submit</button>
          </Form>
        )}
      </Mutation>
    );
  }
}
export default CreateItem;
export { CREATE_ITEM_MUTATION };
