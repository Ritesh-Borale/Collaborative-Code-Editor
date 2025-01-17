import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const runCode = async (req, res) => {
    const { code, language, input } = req.body;

    const languageMap = {
        'python': 'python3',
        'cpp': 'cpp17',
        'java': 'java',
        'javascript': 'nodejs',
        'c': 'c'
    };
    console.log(languageMap[language.toLowerCase()])
    const data = {
        script: code,       
        language: languageMap[language.toLowerCase()] || 'python3',
        stdin: input,     
        clientId: process.env.JDOODLE_API_CLIENT_ID,
        clientSecret: process.env.JDOODLE_API_KEY
    };

    try {
        const response = await axios.post('https://api.jdoodle.com/engine/execute-api', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const { output, error } = response.data;

        if (error) {
            return res.status(500).json({ message: 'Error executing code', error });
        }

        res.json({ output });
    } catch (error) {
        console.error('Error executing code:', error);
        res.status(500).json({ message: 'Error executing code', error: error.message });
    }
};

