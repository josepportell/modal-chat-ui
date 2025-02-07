function chatInit(selector) {
    document.addEventListener('DOMContentLoaded', () => {
      if (!window.LIVE_CHAT_UI) {
        let chat = document.querySelector(selector);
        let toggles = chat.querySelectorAll('.toggle')
        let close = chat.querySelector('.close')
        const input = chat.querySelector('.chat-input');
        const messagesContainer = chat.querySelector('.messages');
        
        // Add message to chat
        function addMessage(text, isReply = false) {
          const messageDiv = document.createElement('div');
          messageDiv.className = `message${isReply ? ' reply' : ''}`;
          messageDiv.innerHTML = `<p class="text">${text}</p>`;
          messagesContainer.appendChild(messageDiv);
          
          // Scroll to bottom
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        
        // Handle API communication
        async function sendMessage(message) {
          try {
            const response = await fetch('/api/chat', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ message })
            });
            
            if (!response.ok) throw new Error('API error');
            const data = await response.json();
            addMessage(data.reply, true);
          } catch (error) {
            addMessage('Sorry, there was an error processing your request.', true);
          }
        }
        
        // Handle input submission
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter' && input.value.trim()) {
            const message = input.value.trim();
            addMessage(message);
            sendMessage(message);
            input.value = '';
          }
        });
        
        window.setTimeout(() => {
          chat.classList.add('is-active')
        }, 1000)
        
        toggles.forEach( toggle => {
          toggle.addEventListener('click', () => {
            chat.classList.add('is-active')
          })
        })
        
        close.addEventListener('click', () => {
          chat.classList.remove('is-active')
        })
        
        document.onkeydown = function(evt) {
            evt = evt || window.event;
            var isEscape = false;
            if ("key" in evt) {
                isEscape = (evt.key === "Escape" || evt.key === "Esc");
            } else {
                isEscape = (evt.keyCode === 27);
            }
            if (isEscape) {
                chat.classList.remove('is-active')
            }
        };
        
        window.LIVE_CHAT_UI = true
      }
    })
  }
  
  chatInit('#chat-app')
  