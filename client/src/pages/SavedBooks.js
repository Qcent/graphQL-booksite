import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

//import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

import { useQuery, useMutation } from '@apollo/client';
// import the QUERY_ME query
import { QUERY_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';

const SavedBooks = () => {
  // use QUERY_ME to set userData
 const { loading, data } = useQuery(QUERY_ME, {});
 //****let userData = data?.me || {savedBooks: []};
  // destructure the removeBook function from the REMOVE_BOOK mutation
 const [removeBook] = useMutation(REMOVE_BOOK); 

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeBook( {
        variables:
            {
              'bookId': bookId
            },
        onError:(err)=>{
                //console.log(err);
                throw new Error('something went wrong! '+ err);
            }
      });
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
      //****remove from userData.savedBooks causeing a redraw of the page
      //****let newSavedBooks = userData.savedBooks.filter( book => book.bookId !== bookId);
      //******console.log(newSavedBooks);
      //*****data.me['savedBooks'] = newSavedBooks;
      //*****userData = {}
      //*****this.setState({});

    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {data.me.savedBooks.length
            ? `Viewing ${data.me.savedBooks.length} saved ${data.me.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {data.me.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
