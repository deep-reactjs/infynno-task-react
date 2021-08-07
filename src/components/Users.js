import React from 'react';
import { Table } from "reactstrap";
import axios from 'axios';

const Users = () => {
  const [usersData, setUsersData] = React.useState([]);
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
  React.useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <div>
      <h1>Users</h1>
      <Table bordered hover striped responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {usersData?.map((user) => (
            <tr>
            <th>{user.id}</th>
            <th>{user.name}</th>
            <th>{user.email}</th>
          </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Users;
