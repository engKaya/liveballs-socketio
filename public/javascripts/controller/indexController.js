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

    function showBubble(id,message) {
        $('#'+id).find('.message').show().html(message)
        setTimeout(()=>{
            $('#'+id).find('.message').hide()
        },3000)

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
               $scope.players[data.id] = data
               $scope.$apply()
           })

            socket.on('clientMessage_fromserver',(data) => {
                $scope.messages.push(data)
                $scope.$apply()
                showBubble(data.usernameid,data.message_data)
                setTimeout(()=>{
                    const element = document.getElementById('chat-area')
                    element.scrollTop = element.scrollHeight
                },500)
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

               // $scope.messages.push(messageData)
               // $scope.$apply()
            })

            $scope.newMessage = () => {
               if (!$scope.message=='') {
                   let clientMessage = {
                       usernameid:socket.id,
                       username: $scope.players[socket.id].username,
                       type: {
                           code: 1
                       },
                       message_data: $scope.message
                   };
                   socket.emit('newMessage', clientMessage)
                   showBubble(socket.id,$scope.message)

                   $scope.message = ""

                   setTimeout(()=>{
                       const element = document.getElementById('chat-area')
                       element.scrollTop = element.scrollHeight
                   },500)

               }
            }

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