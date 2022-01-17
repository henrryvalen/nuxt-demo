import gql from "graphql-tag"

export const categories = gql`
        query {
          categories {
            data {
              id
              attributes {
                name
                icon
                slug
                img
              }
            }
          }
        }
      `
  export const category = gql`
        query ($id: ID!) {
          categorie(id: $id) {
            data {
              id
              attributes {
                description
              }
            }
          }
        }
      `