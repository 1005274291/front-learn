import React from 'react';
import { useSubscription } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import Query from './Query'

const subs = gql`
    subscription {
        subsBooks
    }
`;

function Subscription() {
    useSubscription(subs)//向后端发起订阅，每当后端的数据改变函数会重新执行，组件就会刷新
    return <Query/>
}

export default Subscription;
