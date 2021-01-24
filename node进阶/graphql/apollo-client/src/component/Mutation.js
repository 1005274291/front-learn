import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
//创建书
const CREATE_BOOK = gql`
    mutation CreateBook($title:String!,$author:String!){
        createBook(title:$title,author:$author){
            id,
            title,
            author
        }
    }
`;
//清空书
const CLEAR_BOOK = gql`
    mutation {
        clearBook
    }
`;

function Mutation() {
    const [create, { data }] = useMutation(CREATE_BOOK);//data是返回的数据，create是调用mutation

    const [clear] = useMutation(CLEAR_BOOK)

    return (
        <div>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    create({
                        variables: {//参数
                            "title": 'Title' + (Math.random() * 100).toFixed(),
                            "author": 'Author'+ (Math.random() * 100).toFixed()
                        }
                    });
                    console.log('mutation:',data)
                }}
            >
                
                <button type="submit">Create</button>
            </form>
            <button onClick={ clear }>Clear</button>
        </div>
    );
}

export default Mutation;
