import { gql } from '@apollo/client';

const REGISTER_QUERY = gql`
    mutation register($username: String!, $password: String!, $confirmPassword: String!) {
        register(username: $username, password: $password, confirmPassword: $confirmPassword) {
            id
            username
        }
    }
`

export default REGISTER_QUERY;