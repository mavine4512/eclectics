import React,{useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
const Register = () => {
    const [values, setValues] = useState({
        username:'',
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChanges = (e) => {
        setValues({...values, [e.target.name]: e.target.value});
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        setMessage('');
        try{
            const response = await axios.post('http://localhost:3000/api/register', values)
            console.log('response',response)
            if(response.status === 201) {
                setMessage('Registration successful!');
                // Reset form and navigate after a delay
                setValues({ username: '', email: '', password: '' });
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch(error){
            if (error.response && error.response.status === 409) {
                setMessage('User already exists. Please try a different email or username.');
            } else {
                setMessage('An unexpected error occurred. Please try again later.');
            }
            console.error('Register error:', error.message);
         } 
    }

  return (
    <div className='flex justify-center items-center h-screen'>
        <div className='shadow-lg px-8 py-5 border w-96'>
            <h2 className='text-lg front-bold mb-4'>Register</h2>
            {message && (
            <p
                className={`mb-4 text-center ${
                message.includes('successful') ? 'text-green-600' : 'text-red-600'
                }`}
            >
                {message}
            </p>
            )}
            <form onSubmit={handleSubmit}> 
                <div className='mb-4'>
                    <label htmlFor="username" className='block text-gray-700'>Username</label>
                    <input 
                    type="text" 
                    placeholder="Enter Username" 
                    className=' w-full px-3 py-2 border'
                    name="username"
                    onChange={handleChanges}
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor="email" className='block text-gray-700'>Email</label>
                    <input 
                    type="email" 
                    placeholder="Enter Email" 
                    className=' w-full px-3 py-2 border'
                    name="email"
                    onChange={handleChanges}
                    />
                </div>
                 <div className='mb-4'>
                    <label htmlFor="password" className='block text-gray-700'>Password</label>
                    <input 
                    type="password" 
                    placeholder="Enter Password" 
                    className=' w-full px-3 py-2 border'
                    name="password"
                    onChange={handleChanges}
                    />
                </div>
                <button className='w-full bg-green-600 text-white py-2 mb-4'>Submit</button>
            </form>
            <div className='text-center'>
                <p>Already Have Account? </p>
                <Link to="/login" className='text-blue-500'>Login</Link>
            </div>
        </div>
    </div>
  )
}

export default Register