import React,{useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
const Login = () => {
    const [values, setValues] = useState({
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
        try{
            const response = await axios.post('http://localhost:3000/api/login', values)
            if(response.status === 201) {
                setMessage('Login successful!');
                // Reset form and navigate after a delay
                setValues({ email: '', password: '' });
                localStorage.setItem('token', response.data.token)
                setTimeout(() => navigate('/'), 2000);
            }
        } catch(error){
            if (error.response && error.response.status === 404) {
                setMessage('User does not existed, Register.');
            }else if(error.response && error.response.status === 401){
                setMessage('Wrong Password!');
            } else {
                setMessage('An unexpected error occurred. Please try again later.');
            }
            console.log('Login error', error.message);
        }
        
    }

  return (
    <div className='flex justify-center items-center h-screen'>
        <div className='shadow-lg px-8 py-5 border w-96'>
            <h2 className='text-lg front-bold mb-4'>welcome back Login</h2>
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
                <p>Don't Have Account? </p>
                <Link to="/register" className='text-blue-500'>Register</Link>
            </div>
        </div>
    </div>
  )
}

export default Login