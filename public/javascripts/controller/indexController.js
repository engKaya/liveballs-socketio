app.controller('indexController', ['$scope','indexFactory' ,($scope,indexFactory) => {

    $scope.messages = []
    $scope.players = {  }

    $scope.init = () =>{
        const username = prompt('Enter username: ');

        if (username)
            initSocket(username);
        else
           return false
    }

    function initSocket(username) {

        const connectionOptions = {
            reconnectionAttempts:3,
            reconnectionDelay:600,
        }

        indexFactory.connectSocket('http://localhost:3000',connectionOptions)
        .then((socket) =>{
           socket.emit('newUser',{username})

            socket.on('initPlayers',(data) => {
                $scope.players = data
                $scope.$apply()
            })

           socket.on('newUser',data=>{
               const messageData = {
                   type: {
                       code:0, //server veya client mesajı belirtir
                       messageType:1 //giriş veya çıkış msajı olduğunu belirtir
                   },
                   username:data.username,
               }

               $scope.messages.push(messageData)
               $scope.players[data.id] =data
               $scope.$apply()
           })


            socket.on('animate',(data)=>{
                console.log(data)
                $('#' + data.socketid).animate({'left': data.x-40, 'top': data.y-40})
            })

            socket.on('disUser',(user)=>{
                const messageData = {
                    type: {
                        code:0,
                        messageType:0
                    },
                    username:user.username,
                }

                $scope.messages.push(messageData)
                $scope.$apply()
            })

            let animate = false
            $scope.onClickPlayer = $event => {
                if (!false && $event.offsetX>40 && $event.offsetY>40) {

                    let x = $event.offsetX;
                    let y = $event.offsetY;

                    socket.emit('animate',{x,y})

                    animate = true
                    $('#' + socket.id).animate({'left': x-40, 'top': y-40})
                    animate = false
                }
           }

        }).catch(err =>{
            console.log(err)
        });

    }
}])