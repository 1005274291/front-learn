const Koa = require('koa');
const { ApolloServer, gql, PubSub, withFilter } = require('apollo-server-koa');

const pubsub = new PubSub()

// Construct a schema, using GraphQL schema language 
//Schema定义
const typeDefs = gql`
  type Query {
    hello: String,
    books: [Book],
    book(id : String) : Book
  }

  type Book {
    id:String
    title: String
    author: String
  }


  type Mutation {
    createBook(id: ID!, title: String!, author: String!): Book!
  }

  type Subscription {
    subsBook(id: ID!): Book
  }

`;

// Provide resolver functions for your schema fields
//解释器实现
const resolvers = {
    Query: {
        hello: () => 'Hello world!',
        books: (parent, args) => {//查询数据库
            return [
                {
                    title: 'abc',
                    author: 'xxxx'
                }
            ]
        },
        book: (parent, { id }) => {//根据id查找

            console.log('parent', parent)//上一次数据查询的结果
            console.log('query books:', id)
            return {
                title: 'abc',
                author: 'xxxx'
            }

        }
    },

    Mutation: {

        createBook: (parent, args) => {
            console.log('createBook ....', args)
            pubsub.publish("UPDATE_BOOK",{
                //发布订阅
                subsBooks:true//传递的消息
            })
            return {
                id: '6666',
            }
        }
    },

    Subscription: {//前端在后端进行消息订阅
        subsBook: {
            subscribe: withFilter(
                (parent, { id }) => pubsub.asyncIterator('UPDATE_BOOK'),// 过滤后端发布的消息
                (payload, variables) => payload.subsBooks//确定发布消息正确后要返回给前端的东西
            ),
            resolve: (payload, variables) => {
                console.log('🚢 接收到数据： ', payload)
                return payload.subsBook
            }
        }
    }

};

setInterval(() => {
    pubsub.publish('UPDATE_BOOK', {
        subsUser: {
            title: 'abc',
            author: 'yyy'
        }
    })
}, 1000)

//创建服务器实例
const server = new ApolloServer({ typeDefs, resolvers });
//以插件的形式注册进koa
const app = new Koa();
server.applyMiddleware({ app });
//启动服务器
app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
);