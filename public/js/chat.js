let socket_id_admin = null;
let emailUser = null;
let socket = null;

document.querySelector("#start_chat").addEventListener("click", (event) => {
  const chat_help = document.getElementById('chat_help');
  chat_help.style.display = 'none';

  const chat_in_support = document.getElementById('chat_in_support');
  chat_in_support.style.display = 'block';

  socket = io();
  const msg = document.querySelector('#txt_help').value;
  const email = document.querySelector('#email').value;
  emailUser = email

  
  socket.on('connect', () => {
    const params = { msg, email };
    socket.emit('client_first_access', params, (call,err)=>{
      if(err){
        console.error(err);
      }else{
        console.log(call);
      }
    })
  })  

  socket.on('client_list_allmessages', (messages) => {
    let template_client = document.getElementById('message-user-template').innerHTML;
    let template_admin = document.getElementById('admin-template').innerHTML;

    messages.forEach( message => {
      if (!message.admin_id){
        const rendered = Mustache.render(template_client,{
          message: message.text,
          email
        });

        document.getElementById("messages").innerHTML += rendered;
      }else{
        const rendered = Mustache.render(template_admin,{
          message_admin: message.text,
        });

        document.getElementById("messages").innerHTML += rendered;
      }

    })
  })

  
  socket.on('admin_send_to_client', params => {
    socket_id_admin = params.socket_id;
    let template_admin = document.getElementById('admin-template').innerHTML;
    const rendered = Mustache.render(template_admin,{
      message_admin: params.text,
    });

    document.getElementById("messages").innerHTML += rendered;

  });
});


document.querySelector('#send_message_button').addEventListener('click', (event) => {

  const text = document.getElementById('message_user');

  const params = {
    text: text.value,
    socket_id_admin
  }
  
  socket.emit('client_send_to_admin', params);

  let template_client = document.getElementById('message-user-template').innerHTML;
  const rendered = Mustache.render(template_client,{
    message: text.value,
    email: emailUser
  });
  document.getElementById("messages").innerHTML += rendered;

  text.value = '';
})
