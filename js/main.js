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
        
        // Add this after selecting elements
        const sendButton = chat.querySelector('.icon.send');
        
        // Add typing indicator function
        function showTypingIndicator() {
          const typingDiv = document.createElement('div');
          typingDiv.className = 'message reply typing-indicator';
          typingDiv.innerHTML = `
            <div class="typing-dots">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
          `;
          messagesContainer.appendChild(typingDiv);
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
          return typingDiv;
        }
        
        // Handle API communication
        async function sendMessage(message) {
          const typingIndicator = showTypingIndicator();
          
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
            typingIndicator.remove();
            addMessage(data.reply, true);
          } catch (error) {
            typingIndicator.remove();
            addMessage('Sorry, there was an error processing your request.', true);
          }
        }
        
        // Add send button click handler
        sendButton.addEventListener('click', () => {
          if (input.value.trim()) {
            const message = input.value.trim();
            addMessage(message);
            sendMessage(message);
            input.value = '';
          }
        });
        
        // Handle input submission (Enter key)
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
        
        // Add this after the existing close event listeners
        document.addEventListener('click', (e) => {
          if (chat.classList.contains('is-active')) {
            const isClickInside = chat.querySelector('.chat-app_box').contains(e.target);
            const isToggleButton = Array.from(toggles).some(toggle => toggle.contains(e.target));
            
            if (!isClickInside && !isToggleButton) {
              chat.classList.remove('is-active');
            }
          }
        });
        
        window.LIVE_CHAT_UI = true
      }
    })
  }
  
  chatInit('#chat-app')
  