import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import client from './feathers';
import Validation from 'react-validation'

class Review extends React.Component {
  constructor(props) {
    super();
     
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.state = {
      isEditing: false,
      warning: "",
      movie: {},
    }
  }

  componentWillMount() {
    const test = client.service('test');
    test.find({
      query: { review: "review" }
    }).then(messages => {
      let movie = messages.data[0];
      if (movie === undefined) {
        movie = {  
          "review": "review",
          "title": "People Places Things",
          "date": "14/08/2015",
          "duration": "85 minutes",
          "genre": "Comedy",
          "synopsis": "Will Henry is a newly single graphic novelist balancing parenting his young twin daughters and a classroom full of students while exploring and navigating the rich complexities of new love and letting go of the woman who left him." 
        }
        test.create(movie).then(messages => {
          test.find({
            query: { review: "review" }
          }).then(messages => {
            movie = messages.data[0];
            this.setState({movie});
          });
        });
      } else {
        this.setState({movie});
        console.log(movie)
      }
    });
  }

  handleEditClick() {
    this.setState({isEditing: true});
  }

  handleCancelClick() {
    this.setState({isEditing: false});
  }

  handleSaveClick(event) {
    const title = document.body.querySelector('[name="title"]');
    const date = document.body.querySelector('[name="date"]');
    const duration = document.body.querySelector('[name="duration"]');
    const genre = document.body.querySelector('[name="genre"]');
    const synopsis = document.body.querySelector('[name="synopsis"]');

    let newValues = [title, date, duration, genre, synopsis];
    let empty_flag = false;    

    for (let i = 0; i < newValues.length; i++ ) {
      if (newValues[i].value === "") {
        empty_flag = true;
        break
      }
    }

    if (empty_flag) {
      this.setState({warning: "Warning: Please fill in all fields"});
    } else {
      const delParams = {
        query: { review: "review" }
      } 
      client.service('test').remove(null, delParams);
      this.setState({movie: {}});
  
      let movie = {};
      movie.review = "review"
      movie.title = title.value;
      movie.date = date.value;
      movie.duration = duration.value;
      movie.genre = genre.value;
      movie.synopsis = synopsis.value;
      client.service('test').create(movie);

      this.setState({movie});
      this.setState({warning: ""});
      this.setState({isEditing: false});
    } 
  }
  
  render() {
    const isEditing = this.state.isEditing;

    console.log(this.state)

    let content = null;
    let button = null;
    let cancel = null;
    if (isEditing) {
      content = <EditReview movie={this.state.movie} />;
      button = <SaveButton onClick={this.handleSaveClick} />;
      cancel = <button onClick={this.handleCancelClick} >Cancel</button>
    } else {
      content = <ViewReview movie={this.state.movie} />;
      button = <EditButton onClick={this.handleEditClick} />;
    }
    
    return(
      <div>
        <div id="banner">
          <div id="container">
	    <span id="title1">AIP Movie Review</span>
	  </div>
        </div>
        <div id="content">
	  <Validation.components.Form>
            <table>   
              {content}
            </table>
            {button}{cancel}<span id="warning" >{this.state.warning}</span>
	  </Validation.components.Form>
        </div>
      </div>
    );
  }
}

function SaveButton(props) {
  return (
    <button onClick={props.onClick}>
      Save
    </button>
  );
}

function EditButton(props) {
  return (
    <button onClick={props.onClick}>
      Edit
    </button>
  );
}

function ViewReview(props) {
  return (
    <tbody>
      <tr>
	<td className="label">Title</td>
        <td>{props.movie.title}</td>
      </tr>
      <tr>
	<td className="label">Release Date</td>
	<td>{props.movie.date}</td>
      </tr>
      <tr>
	<td className="label">Duration</td>
	<td>{props.movie.duration}</td>
      </tr>
      <tr>
	<td className="label">Genre</td>
	<td>{props.movie.genre}</td>
      </tr>
      <tr id="bottomRow">
	<td className="label">Synopsis</td>
	<td>{props.movie.synopsis}</td>
      </tr>
    </tbody>
  );
}

function EditReview(props) {
  return (
    <tbody>
      <tr>
	<td className="label">Title</td>
        <td><Validation.components.Input type='text' value='' name='title' validations={['required']}/> </td>
      </tr>
      <tr>
	<td className="label">Release Date</td>
	<td><input type="text" name="date" /></td>
      </tr>
      <tr>
	<td className="label">Duration</td>
	<td><input type="text" name="duration" /></td>
      </tr>
      <tr>
	<td className="label">Genre</td>
	<td><input type="text" name="genre" /></td>
      </tr>
      <tr id="bottomRow">
	<td className="label">Synopsis</td>
	<td><textarea name="synopsis" id="synopsis" rows="5"></textarea></td>
      </tr>
    </tbody>
  );
}


ReactDOM.render(
  <Review />,
  document.getElementById('root')
);

