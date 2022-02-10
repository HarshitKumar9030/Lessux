window.addEventListener('load', function() {
    // Add required icon after required input
    var requiredInputElements = document.querySelectorAll('input[required], textarea[required]');
    requiredInputElements.forEach(function(requiredElement, index) {
        let after = document.createElement('div');
        after.classList.add('input-alert');
        after.innerHTML = '!';
        after.style.position = `absolute`;
        after.style.top = `0.5rem`;
        after.style.right = `0.5rem`;
        // requiredElement.after(after)

        let inputWrapper = document.createElement('div');
        inputWrapper.classList.add('input-wrapper');
        inputWrapper.style.position = `relative`;
        requiredElement.before(inputWrapper)
        inputWrapper.appendChild(requiredElement)
        inputWrapper.appendChild(after)
    });

    // Subscription form
    var subscriptionForm = document.querySelector('#form-subscribe');
    subscriptionForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Setup the server API
        var server = subscriptionForm.getAttribute("action");
        if (!server) {
            // You can replace it with your default server
            server = 'ajaxserver/serverfile.php'
        }

        // Get form input data
        var name = subscriptionForm.querySelector("#name-subscribe").value;
        var email = subscriptionForm.querySelector("#email-subscribe").value;
        // Optional : you can add an email verification system here

        var user = {
            name: name,
            email: email,
            submit_email: 'submit_email',
        };
        _subscribeUser(user, server);
    })

    function _subscribeUser(user, server) {
        axios.post(server, user)
            .then(response => {
                var responseData = response.data;
                console.log(`POST success`, responseData);
                subscriptionForm.classList.add('form-success')
                // hide form here and replace with a sentence
            })
            .catch(error => {
                console.error(error)
                subscriptionForm.classList.add('form-error')
                // notify user about the error here
            })
    }

    // Message form
    var messageModal = new bootstrap.Modal(document.getElementById('messageModal'));
    var messageForm = document.querySelector('#form-message');
    messageForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Setup the server API
        var server = messageForm.getAttribute("action");
        if (!server) {
            // You can replace it with your default server
            server = 'ajaxserver/serverfile.php'
        }

        // Get form input data
        var name = messageForm.querySelector("#name-message").value;
        var email = messageForm.querySelector("#email-message").value;
        var message = messageForm.querySelector("#message-message").value;
        // Optional : you can add an email verification system here

        var content = {
            name: name,
            email: email,
            message: message,
            submit_message: 'submit_message',
        };
        _sendMessage(content, server);
    })

    function _sendMessage(content, server) {
        axios.post(server, content)
            .then(response => {
                var responseData = response.data;
                console.log(`POST success`, responseData);
                subscriptionForm.classList.add('form-success');
                messageModal.hide();
                messageForm.querySelectorAll('input, textarea').forEach(function(inputElement) {
                    inputElement.value = '';
                });
                // hide form here and replace with a sentence
            })
            .catch(error => {
                console.error(error)
                subscriptionForm.classList.add('form-error')
                // notify user about the error here
            })
    }
});