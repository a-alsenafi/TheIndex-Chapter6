import React, { Component } from "react";
import { observer } from "mobx-react";
import axios from "axios";

// Components
import BookTable from "./BookTable";
import Loading from "./Loading";
import bookStore from "./stores/bookStore";
import authorStore from "./stores/AuthorStore";

const instance = axios.create({
  baseURL: "https://the-index-api.herokuapp.com"
});

class AuthorDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      author: {},
      loading: true
    };
  }

  componentDidMount() {
    this.getAuthor();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.authorID !== this.props.match.params.authorID) {
      this.getAuthor();
    }
  }

  getAuthor() {
    const authorID = this.props.match.params.authorID;
    this.setState({ loading: true });
    instance
      .get(`/api/authors/${authorID}`)
      .then(res => res.data)
      .then(author => this.setState({ author: author, loading: false }))
      .catch(err => console.error(err));
  }

  render() {
    let authorsBooks = bookStore.books.filter(book => book.authors);
    if (this.state.loading) {
      return <Loading />;
    } else {
      const author = this.state.author;
      return (
        <div className="author">
          <div>
            <h3>{author.first_name + " " + author.last_name}</h3>
            <img
              src={author.imageUrl}
              className="img-thumbnail img-fluid"
              alt={author.first_name + " " + author.last_name}
            />
          </div>
          <BookTable books={author.books} />
        </div>
      );
    }
  }
}

export default observer(AuthorDetail);
