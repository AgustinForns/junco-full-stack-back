

const Instructions = () => {


    return (
        <div className='instructions'>
            <h3>Instructions</h3>
            <ul>
                <li>You first need to send the /install command in the Text Editor.</li>
                <li>Next, execute the /load command in the Text Editor to send a request to load the BlenderBot model from the Hugging Face library.</li>
                <li>To start a conversation with the model, use the /chat command followed by the message you want to send to the model. For example: /chat Hello, BlenderBot! How are you today?</li>
            </ul>
        </div>
    )
}

export default Instructions