'use client'

import { Box, Button, Stack, TextField } from '@mui/material'
import { useState, useRef, useEffect } from 'react'

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Ranger support assistant. How can I help you today?",
      avatar: '/assistant-avatar.png',
    },
  ])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true)

    if (!message.trim()) return;  // Don't send empty messages
  
    setMessage('')
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message,  avatar: '/user-avatar.png'},
      { role: 'assistant', content: '', avatar: '/assistant-avatar.png' },
    ])
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      })
  
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
  
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
  
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
      }      
    } catch (error) {
      console.error('Error:', error)
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', 
        content: "I'm sorry, but I encountered an error. Please try again later.", 
        avatar: '/assistant-avatar.png'
        },
      ])
    }
    setIsLoading(false)

  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])
  return (
    // <Box
    //   width="100vw"
    //   height="100vh"
    //   display="flex"
    //   flexDirection="column"
    //   justifyContent="center"
    //   alignItems="center"
    // >
    //   <Stack
    //     direction={'column'}
    //     width="500px"
    //     height="700px"
    //     border="1px solid black"
    //     p={2}
    //     spacing={3}
    //   >
    //     <Stack
    //       direction={'column'}
    //       spacing={2}
    //       flexGrow={1}
    //       overflow="auto"
    //       maxHeight="100%"
    //     >
    //       {messages.map((message, index) => (
    //         <Box
    //           key={index}
    //           display="flex"
    //           justifyContent={
    //             message.role === 'assistant' ? 'flex-start' : 'flex-end'
    //           }
    //         >
    //           <Box
    //             bgcolor={
    //               message.role === 'assistant'
    //                 ? 'primary.main'
    //                 : 'secondary.main'
    //             }
    //             color="white"
    //             borderRadius={16}
    //             p={3}
    //           >
    //             {message.content}
    //           </Box>
    //         </Box>
    //       ))}
    //       <div ref={messagesEndRef} />
    //     </Stack>
    //     <Stack direction={'row'} spacing={2}>
    //       <TextField
    //         label="Message"
    //         fullWidth
    //         value={message}
    //         onChange={(e) => setMessage(e.target.value)}
    //         onKeyPress={handleKeyPress}
    //         disabled={isLoading}
    //       />
    //       <Button 
    //         variant="contained" 
    //         onClick={sendMessage}
    //         disabled={isLoading}
    //       >
    //         {isLoading ? 'Sending...' : 'Send'}
    //       </Button>
    //     </Stack>
    //   </Stack>
    // </Box>

    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-700">
      <div className="flex flex-col w-full max-w-lg h-full max-h-[700px] border border-white bg-gray-200 shadow-white chad-2xl rounded-lg p-4">
        <div className="flex-1 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'assistant' ? 'justify-start' : 'justify-end'
              } mb-4`}
            >
              {message.role === 'assistant' && (
                <img
                  src={message.avatar}
                  alt="assistant avatar"
                  className="w-10 h-10 rounded-full mr-2"
                />
              )}
              <div
                className={`${
                  message.role === 'assistant'
                    ? 'bg-green-800 text-white'
                    : 'bg-gray-800 text-white'
                } rounded-lg px-4 py-2 max-w-xs`}
              >
                {message.content}
              </div>
              {message.role === 'user' && (
                <img
                  src={message.avatar}
                  alt="user avatar"
                  className="w-10 h-10 rounded-full ml-2"
                />
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="mt-4 flex">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Say something..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            className={`bg-green-800 text-white px-4 py-2 rounded-r-lg ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}