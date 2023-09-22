import React , {useState} from 'react'
import MonacoEditor from 'react-monaco-editor'
import axios from 'axios'
import Instructions from './Instructions'



const TextEditor = () => {

    const [code, setCode] = useState()
    const [response, setResponse] = useState('')
    const [trigger, setTrigger] = useState(true)

    const apiUrl = 'https://junco-back.onrender.com'

    const handleEditorChange = (value) => {
        setCode(value)
    }

    const clearTextEditor = () => {
      setCode('')
      setTrigger(true)
    }

    const sendCommand = async (messageChat) => {
        try {
          const response = await axios.post(`${apiUrl}/execute`, {messageChat})
          setResponse(response.data.message)
        } catch (error) {
          console.error('Error: ', error)
          setResponse(`Error: ${error.message}`)
        } finally {
          setTrigger(true)
        }
      }

    const install = async () => {
      try {
        const response = await axios.post(`${apiUrl}/install`)
        setResponse(response.data.message)
      } catch (error) {
        console.error('Error: ', error)
        setResponse(`Error: ${error.message}`)

      } finally {
        clearTextEditor()
      }
    }

    const load = async () => {
      try {
        const response = await axios.post(`${apiUrl}/load`)
        setResponse(response.data.message)
      } catch (error) {
        console.error('Error: ', error)
        setResponse(`Error: ${error.message}`)
      } finally {
        clearTextEditor()
      }
    }
    
      const handleCommandExecution = () => {
        setTrigger(false)
        
        const command = extractCommandsFromCode(code)
        if (command !== null && command.length > 0) {
          if (command[0].command === '/install') {
            install()
          } else if ( command[0].command === '/load'){
              load()
          } else if ( command[0].command === '/chat') {
              sendCommand(command[0].args)
          } else {
              setResponse('Error: allowed commands are /install /load /chat')
              setTrigger(true)
          }
        } else {
          setResponse(`Error: any command. Allowed commands are /install, /load, and /chat`)
          setTrigger(true)
        }
        
      }

      const extractCommandsFromCode = (code) => {

        if ( code === undefined  ){
          return null
        }

        const lines = code.split('\n')
        
        const commands = []
      
        for (const line of lines) {
          if (line.trim().startsWith('/')) {
            const [command, ...args] = line.trim().split(' ')
            
            commands.push({
              command,
              args: args.join(' '),
            })
          }
        }
      
        return commands
      }

    return (
        <div className='container'>
            <MonacoEditor
                width="50%"
                height="100%"
                language="python"
                theme="vs-dark"
                value={code}
                onChange={(value, event) => {
                  handleEditorChange(value)}}
            />
            
            <div className='information'>
              <Instructions/>
              <div className='response'>
                {
                  trigger && (<button className='button' onClick={handleCommandExecution}>sendCommand</button>) 
                }
                {
                  !trigger && (<p>Working...</p>)
                }

                  {
                    response && (
                      <div>
                          <h3>Server Response:</h3>
                          <p>{response}</p>
                      </div>
                    )
                  }
                </div>   
            </div> 
        </div>

    )
}

export default TextEditor