import { gql } from '@apollo/client';

const JWT_QUERY = gql`
    query decodeJwt($token: String!) {
        decodeJwt(token: $token) {
            userid
            username
        }
    }
`

export default JWT_QUERY;