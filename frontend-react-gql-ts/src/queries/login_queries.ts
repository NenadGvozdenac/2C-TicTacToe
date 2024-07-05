import { gql } from '@apollo/client';

const LOGIN_QUERY = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            message
            token
            user {
                id
                username
            }
        }
    }
`

export default LOGIN_QUERY;