//Verwendung installierter Packages
var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

//GraphQL Schema
var schema = buildSchema(`
  input MessageInput {
    content: String
    author: String
	  recipients: [RecipientInput]
  }
  
  input RecipientInput {
  	name: String
  }

  input PostInput {
    title: String
    creator: String
    likes: Int
    comments: [CommentsInput]
  }

  input CommentsInput {
    username: String
    text: String
  }

  type Message {
    id: ID!
    content: String
    author: String
	  recipients: [Recipient]
  }

  type Recipient {
    name: String
  }
  
  type Post {
	  id: ID
	  title: String
    creator: String
    likes: Int
    comments: [Comment]
  }

  type Comment {
    username: String
    text: String
  }

  type Query {
   	getMessage(id: ID!): Message
		getMessages: [Message]
	  getPost(id: ID!): Post
	  getPosts: [Post]
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
    deleteMessage(id: ID!): Message
    createPost(input: PostInput): Post
    updatePost(id: ID!, input: PostInput): Post
    deletePost(id: ID!): Post
  }
`);

//Klassen für neue Objekte
class Message {
  constructor(id, {content, author, recipients}) {
	  Object.assign(this, id, {content, author, recipients});
    this.id = id;
    this.content = content;
    this.author = author;
    this.recipients = recipients;
  }
}

class Post {
	constructor(id, {title, creator, likes, comments}) {
		Object.assign(this, id, {title, creator, likes, comments});
		this.id = id;
		this.title = title;
    this.cretor = creator;
    this.likes = likes;
    this.comments = comments;
	}
}


//"Datenbanken"
var messages = [
	{id: 0, content: 'Was geht ab?', author: 'Niklas', recipients: [{name: "Klaus"}, {name: "Olaf"}, {name: "Dieter"}]},
	{id: 1, content: 'Alles klar?', author: 'Melanie', recipients: [{name: "Olaf"}, {name: "Dieter"}]},
	{id: 2, content: 'Moin :)', author: 'Mirjam', recipients: [{name: "Klaus"}]}
];

var posts = [
	{id: 0, title: "Urlaub am Strand", creator: "Eduard", likes: 305, comments: [{username: "Richard", text: "Sehr schönes Foto!"}, {username: "Tim", text: "Viel Spaß euch!"}]},
	{id: 1, title: "Tiefseetauchen", creator: "Rainer", likes: 532, comments: [{username: "Georg", text: "Da ist ja ein Hai hinter euch :o"}]},
	{id: 2, title: "Die Rhön von oben", creator: "Gerhard", likes: 741, comments: [{username: "Lukas", text: "Ich kann mein Haus sehen :D"}, {username: "Daniel", text: "Habe dich beim Wandern von unten geshen :)"}, {username: "Dylan", text: "Die Wasserkuppe ist mega schön!"}]},
];


//Resolvers
var mid = messages.length; 
var pid = posts.length;

var root = {
  //Für Queries
  getMessage: ({id}) => {
    if (!messages[id]) {
      throw new Error('no message exists with id ' + id);
    }
    //return new Message(id, messages[id]);
	 //return new Message(messages.find(message => message.id === id));
    return messages[id]; 
  },
  getMessages: () => {
	  return messages;
  },
  
  getPost: ({id}) => {
	  if (!posts[id]) {
		  throw new Error('no post exists with id ' + id);
	  }
	  //return new Post(id, posts[id]);
	  //return new post(posts.find(post => post.id === id));
    return posts[id];
  },
  getPosts: () => {
	  return posts;
  },
  
  //Für Mutations
  createMessage: ({input}) => {
    mid = messages.length;
	 
	  const newMessage = new Message(mid, input);
	  messages.push(newMessage);
    return newMessage;
  },
  updateMessage: ({id, input}) => {
    if (!messages[id]) {
      throw new Error('no message exists with id ' + id);
    }
    const newMessage = new Message(id, input);
    messages[id] = newMessage;
    return newMessage;
  },
  deleteMessage: ({id}) => {
    if (!messages[id]) {
      throw new Error('no message exists with id ' + id);
    }
    for (let i = 0; i < messages.length; i++) {
      if (id == messages[i].id) {
        console.log(messages[i].id);
        messages.splice(i, 1);
        console.log(messages.length);
      }
    }
    return messages[id];
  },

  createPost: ({input}) => {
    pid = posts.length;

    const newPost = new Post(pid, input);
    posts.push(newPost);
    return newPost;
  },
  updatePost: ({id, input}) => {
    if (!posts[id]) {
      throw new Error('no post exists with id ' + id);
    }
    const newPost = new Post(id, input);
    posts[id] = newPost;
    return newPost;
  },
  deletePost: ({id}) => {
    if (!messages[id]) {
      throw new Error('no message exists with id ' + id);
    }
    for (let i = 0; i < posts.length; i++) {
      if (id == posts[i].id) {
        console.log(posts[i].id);
        posts.splice(i, 1);
        console.log(posts.length);
      }
    }
    return posts[id];
  }
};


//Servereinstellungen
var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000, () => {
  console.log('Running a GraphQL API server at localhost:4000/graphql');
});

//Express Server mit GraphQL Anleitung einfügen!
//Projekt bei GitHub hochladen