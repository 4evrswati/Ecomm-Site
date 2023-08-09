import React, {useState} from 'react'
import Layout from '../../components/Layout/Layout'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast';
import '../../styles/AuthStyles.css'
import { useAuth } from '../../context/auth';

const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [auth, setAuth] = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/user/login', { email, password });
            if(res && res.data.success)
            {
                toast.success('Login Successfully');
                setAuth({
                  ...auth,
                  user: res.data.userToReturn,
                  token: res.data.token
                })
                localStorage.setItem('auth', JSON.stringify(res.data));
                navigate(location.state || '/');
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        }
    }

  return (
    <Layout title={'Login - Ecommer App'}>
        <div className='form-container'>
            <form onSubmit={handleSubmit}>
            <h4 className='title'>LOGIN FORM</h4>
            <div className="mb-3">
                <input type="email" className="form-control" id="exampleInputEmail" placeholder='Enter Your Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
                <input type="password" className="form-control" id="exampleInputPassword" placeholder='Enter Your Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <button type="button" className="btn btn-primary" onClick={() => navigate('/forgot-password')} >Forget Password</button>
            <button type="submit" className="btn btn-primary">LOGIN</button>
            </form>
        </div>
    </Layout>
  )
}

export default Login