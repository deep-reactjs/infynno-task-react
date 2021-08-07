import React, {useState} from "react";
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from "reactstrap";
import axios from 'axios';

const Posts = () => {
  const [modal, setModal] = useState(false);
  const [postData, setPostData] = useState();
  const [updatePostRecord, setUpdatePostRecord] = useState();
  const [usersData, setUsersData] = useState([]);
  const editPost = (post) => {
    setModal(true);
    setUpdatePostRecord(post);
  }
  const closePostPopup = () => {
    setUpdatePostRecord();
    setModal(false);
  }
  const fetchUsers = async () => {
    await axios("http://localhost:4000/graphql",{
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      data: {query: `query {users{
        id
        name
        email
      }}`}
    })
    .then((res) => setUsersData(res?.data?.data?.users))
    .catch((err) => console.log('users fetch error', err));
  }
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
          id
          name
        }
      }}`}
    })
    .then((res) => setPostData(res?.data?.data?.posts))
    .catch((err) => console.log('error in fetch posts data: ', err));
  }
  const createPost = async () => {
    await axios("http://localhost:4000/graphql",{
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      data: {query: `mutation{
        createPost(
          title: "${updatePostRecord?.title}",
          author: "${updatePostRecord?.author?.id}",
          content: "${updatePostRecord?.content}"){
          title
          id
        }
      }`}
    })
    .then((res) => {
      if (res?.data?.data?.createPost?.id) {
        fetchPosts();
        setUpdatePostRecord();
        closePostPopup();
      }    
    })
    .catch((err) => console.log('error in fetch posts data: ', err));
  }
  const updatePost = async () => {
    await axios("http://localhost:4000/graphql",{
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      data: {query: `mutation{
        updatePost(
          id: "${updatePostRecord?.id}",
          title: "${updatePostRecord?.title}",
          content: "${updatePostRecord?.content}",
          author: "${updatePostRecord?.author?.id}"){
          title
          id
        }
      }`}
    })
    .then((res) => {
      if (res?.data?.data?.updatePost?.id) {
        fetchPosts();
        setUpdatePostRecord();
        closePostPopup();
      }    
    })
    .catch((err) => console.log('error in fetch posts data: ', err));
  }
  const deletePost = async (postId) => {
    await axios("http://localhost:4000/graphql",{
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      data: {query: `mutation {
        deletePost(id: "${postId}"){
          id
        }
      }`}
    })
    .then((res) => {
      if (res?.data?.data?.deletePost?.id) {
        fetchPosts();
      }    
    })
    .catch((err) => console.log('error in fetch posts data: ', err));
  }
  React.useEffect(() => {
    fetchPosts();
    fetchUsers();
  }, []);
  return (
    <div>
      <h1>Posts</h1>
      {/* TODO: Create actions (View Post, Update Post, Create Post, Delete Post) */}
      <center>
      <Button color="primary" onClick={() => setModal(true)}>Create post</Button>
      </center>
      <br />
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
            <th>
            <Button color="success" size="sm" onClick={() => editPost(post)}>edit</Button>
            &nbsp;
            <Button color="danger" size="sm" onClick={() => deletePost(post.id)}>Delete</Button>
            </th>
          </tr>
          ))}
        </tbody>
      </Table>
      <div>
      <Modal isOpen={modal}>
        <ModalHeader>{updatePostRecord?.id ? 'Update Post' : 'Create Post'}</ModalHeader>
        <ModalBody>
        <Label for="title">Title</Label>
        <Input
          type="text"
          defaultValue={updatePostRecord?.title}
          id="title"
          placeholder="Enter title"
          onChange={(title) => setUpdatePostRecord({...updatePostRecord, title: title.target.value})}
          />
        <Label for="content">Content</Label>
        <Input
          type="text"
          defaultValue={updatePostRecord?.content}
          id="content"
          placeholder="Enter content"
          onChange={(content) => setUpdatePostRecord({...updatePostRecord, content: content.target.value})}
        />
        <Label for="select">Select User</Label>
        <Input
          onClick={(user) => setUpdatePostRecord({...updatePostRecord, author: {id: user.target.value}})}
          type="select"
          name="select"
          id="exampleSelect"
          defaultValue={updatePostRecord?.author?.id}
        >
        {usersData?.map((user) => (
          <option key={user.id} value={user.id}>{user.name}</option>
        ))}
        </Input>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => {if(updatePostRecord?.id) {updatePost();} else {createPost();}}}>{updatePostRecord?.id ? 'Update' : 'Create'}</Button>{' '}
          <Button color="secondary" onClick={closePostPopup}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
    </div>
  );
};

export default Posts;
