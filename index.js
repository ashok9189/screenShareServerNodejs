const express = require('express')

const app = express()

const http = require("http")
const socket = require("websocket").server
// const server = http.createServer(() => {

// })

const server = http.createServer(app);
app.use('/', express.static('public'))


const port=process.env.PORT || 3000;



server.listen(port, () => {
    console.log("Server started on port"+ port);
});

const users = []

const Types = {
    SignIn: "SignIn",
    StartStreaming: "StartStreaming",
    UserFoundSuccessfully: "UserFoundSuccessfully",
    Offer: "Offer",
    Answer: "Answer",
    IceCandidates: "IceCandidates",
    EndCall: "EndCall",
}

const webSocket = new socket({httpServer: server})


webSocket.on('request', (req) => {
    const connection = req.accept();

    connection.on('message', (message) => {
        try {
            const data = JSON.parse(message.utf8Data);
            const currentUser = findUser(data.username)
            const userToReceive = findUser(data.target)
            console.log(data)

            switch (data.type) {
                case Types.SignIn:
                    if (currentUser) {
                        return
                    }

                    users.push({username: data.username, conn: connection, password: data.data})
                    break
                case Types.StartStreaming :
                    if (userToReceive) {
                            sendToConnection(userToReceive.conn, {
                                type: Types.StartStreaming,
                                username: currentUser.username,
                                target: userToReceive.username
                            })
                    }
                    break
                case Types.Offer :
                    if (userToReceive) {
                        sendToConnection(userToReceive.conn, {
                            type: Types.Offer, username: data.username, data: data.data
                        })
                    }
                    break
                case Types.Answer :
                    if (userToReceive) {
                        sendToConnection(userToReceive.conn, {
                            type: Types.Answer, username: data.username, data: data.data
                        })
                    }
                    break
                case Types.IceCandidates:
                    if (userToReceive) {
                        sendToConnection(userToReceive.conn, {
                            type: Types.IceCandidates, username: data.username, data: data.data
                        })
                    }
                    break
                case Types.EndCall:
                    if (userToReceive) {
                        sendToConnection(userToReceive.conn, {
                            type: Types.EndCall, username: data.username
                        })
                    }
                    break
            }
        } catch (e) {
            console.log(e.message)
        }

    });
    connection.on('close', () => {
        users.forEach(user => {
            if (user.conn === connection) {
                users.splice(users.indexOf(user), 1)
            }
        })
    })
});


const sendToConnection = (connection, message) => {
    connection.send(JSON.stringify(message))
}

const findUser = username => {
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username) return users[i]
    }
}






















// const express = require('express')
// const http = require("http")
// const socket = require("websocket").server

// const app = express()
// const server = http.createServer(app);
// app.use('/', express.static('public'))

// const port =3000
// server.listen(port, () => {
//   console.log(`Express server listening on port ${port}`)
// })

// let person = {
//     types: "SignIn",
//     username: "test1",
//     target: null,
//     data: null
//   };
  

// const users = []

// var pcConn=null

// var pertoConn=null

// const Types = {
//     SignIn: "SignIn",
//     StartStreaming: "StartStreaming",
//     UserFoundSuccessfully: "UserFoundSuccessfully",
//     Offer: "Offer",
//     Answer: "Answer",
//     IceCandidates: "IceCandidates",
//     EndCall: "EndCall",
// }

// const webSocket = new socket({httpServer: server})


// webSocket.on('request', (req) => {
//     const connection = req.accept();
//     console.log("message")

//     connection.on('open', (open) => {
//         console.log("connection open")

//     });
  
//     connection.on('message', (message) => {
//         try {
//             const data = JSON.parse(message.utf8Data);
//             const currentUser = findUser(data.username)
//             const userToReceive = findUser(data.target)
//             console.log(data)
            
//             switch (data.type) {

                
//                 case Types.SignIn:
//                     if(data.username=='pc'){

//                         pcConn=connection
//                         /*if(pertoConn !=null){
//                             pertoConn.send(message.utf8Data)
//                         }*/
//                     }
//                     else if(data.username=="perto"){
//                         pertoConn=connection
//                     }
                    

               
//                 // var myJsonString = JSON.stringify(users.data);
//             //    connection.send()
//                 // console.log(JSON.stringify(connection))
                
              
                   
//                     if (currentUser) {
                        
//                         return
//                     }

//                     users.push({username: data.username, conn: connection, password: data.data})
                    
//                     break
//                 case Types.StartStreaming :

//                 console.log("StartStreming in block")
//                     if (userToReceive) {
//                         pcConn.send(message.utf8Data)

//                             /*sendToConnection(pcConn, {
//                                 type: Types.StartStreaming,
//                                 username: currentUser.username,
//                                 target: userToReceive.username
//                             })*/
//                     }
//                     break
//                 case Types.Offer :
//                     //if pcConn=connection
//                     if (userToReceive) 
//                     {
//                         pertoConn.send(message.utf8Data)
//                         /*sendToConnection(pertoConn, {
//                             type: Types.Offer, username: "perto", data: data.data
//                         })*/
//                     }
//                     break
//                 case Types.Answer :
//                     if (userToReceive) {
//                         //pcConn.send(message.utf8Data)
//                         sendToConnection(pcConn, {
//                             type: "answer", username: data.username, data: {type:Types.Answer,sdp:data.data}
//                         })
//                     }
//                     break
//                 case Types.IceCandidates:
//                     console.log("sending ice candidates");
//                     if (userToReceive) {
//                         sendToConnection(pcConn, {
//                             type: Types.IceCandidates, username: data.username, data: data.data
//                         })
//                     }
//                     break
//                 case Types.EndCall:
//                     if (userToReceive) {
//                         sendToConnection(pcConn, {
//                             type: Types.EndCall, username: data.username
//                         })
//                     }
//                     break
//             }
//         } catch (e) {
//             console.log(" exception "+e.message)
//         }

//     });


//     connection.on('close', () => {
//         users.forEach(user => {
//             if (user.conn === connection) {
//                 users.splice(users.indexOf(user), 1)
//             }
//         })
//     })

//     console.log(users.length)
// });


// const sendToConnection = (connection, message) => {
//     connection.send(JSON.stringify(message))
// }

// const findUser = username => {
//     for (let i = 0; i < users.length; i++) {
//         if (users[i].username === username) return users[i]
//     }
// }

