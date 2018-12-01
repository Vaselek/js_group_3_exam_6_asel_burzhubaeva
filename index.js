$(function() {
    var myEmail = prompt('What is your email?');
    var baseUrl = `http://146.185.154.90:8000/blog/${myEmail}/`;
    var $editBtn = $('#edit-profile');
    var $addSubBtn = $('#add-sub');
    var $sendMsgBtn = $('#send-message');
    var dateTime;
    var user;
    var $messages = $('#messages');
    var handleErrors = function(error) {
        console.log(`Request failed: ${JSON.stringify(error)}`);
    };
    var renderMessages = function(response) {
        console.log(response);
        if (response.length > 0) {
            response.forEach(function (message) {
                var message = $(`<div class="well"><p><b>Author: ${message.user.firstName} ${message.user.lastName}</b></p></p><p>Text: ${message.message}</p><p><i>Time: ${new Date(message.datetime)}</i></p></div>`);
                $messages.prepend(message);
            });
            var lastElem = response[response.length - 1];
            dateTime = lastElem.datetime;
            localStorage.setItem('dateTime', dateTime);
        };
    };
    $sendMsgBtn.on('click', function() {
        var message = $('#message-txt').val();
        $.ajax({
            method: 'POST',
            url: baseUrl + 'posts',
            data: {
                'message': message,
            }
        }).then(function(response) {
            console.log("Request is successfull!")
        }).fail(handleErrors)
    });
    $editBtn.on('click', function(e) {
        e.preventDefault();
        this.blur();
        $('#change-profile').appendTo('body').modal();
        var $saveBtn = $('#save-profile');
        $saveBtn.on('click', function() {
            var firstName = $('#first-name').val();
            var lastName = $('#last-name').val();
            $.ajax({
                method: 'POST',
                url: baseUrl + 'profile',
                data: {
                    'firstName': firstName,
                    'lastName': lastName
                }
            }).then(function(user) {
                $('#user-name').text(user.firstName + ' ' + user.lastName)
            });

        })
    });
    $addSubBtn.on('click', function(e){
        e.preventDefault();
        this.blur();
        $('#subscribe').appendTo('body').modal();
        var $addEmail = $('#add-email');
        $addEmail.on('click', function() {
            var email = $('#email').val();
            console.log(email);
            $.ajax({
                method: 'POST',
                url: baseUrl + 'subscribe',
                data: {
                    'email': email,
                }
            }).then(function(response) {
                console.log(response)
            })

        })
    });
    setInterval(function() {
        $.ajax({
            method: 'GET',
            url: `${baseUrl}posts?datetime=${localStorage.getItem('dateTime')}`
        }).then(renderMessages).fail(handleErrors);
    }, 2000);
    $.ajax({
        method: 'GET',
        url: baseUrl + 'profile',
    }).then(function(response) {
        user = response;
        $('#user-name').text(user.firstName + ' ' + user.lastName);
    }).then(function() {
        $.ajax({
            method: 'GET',
            url: baseUrl + 'posts',
        }).then(renderMessages).fail(handleErrors);
    })
});