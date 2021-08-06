import React from "react";
import { Table } from "reactstrap";
import axios from 'axios';

const Posts = () => {
  const [postData, setPostData] = React.useState();
  const fetchPosts = async () => {
    await axios("http://localhost:4000/graphql",{
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      data: {query: `query {posts{
        id
        title
        content
        createdAt
        author{
          name
        }
      }}`}
    })
    .then((res) => setPostData(res?.data?.data?.posts))
    .catch((err) => console.log('error in fetch posts data: ', err));
  }
  React.useEffect(() => {
    fetchPosts();
  }, []);
  return (
    <div>
      <h1>Posts</h1>
      {/* TODO: Create actions (View Post, Update Post, Create Post, Delete Post) */}
      <Table bordered hover striped responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Content</th>
            <th>Author Name</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {postData?.map((post) => (
            <tr>
            <th>{post.id}</th>
            <th>{post.title}</th>
            <th>{post.content}</th>
            <th>{post?.author?.name}</th>
            <th>{post?.createdAt}</th>
            <th><button>Edit</button>&nbsp;<button>Delete</button></th>
          </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Posts;
