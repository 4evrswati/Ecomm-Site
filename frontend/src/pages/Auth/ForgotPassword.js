import React, {useState} from 'react'
import Layout from '../../components/Layout/Layout'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast';
import '../../styles/AuthStyles.css'

const ForgotPassword = () => {

    const [email, setEmail] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [answer, setAnswer] = useState("")

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/user/forgot-password', { email, answer, newPassword });
            if(res && res.data.success)
            {
                toast.success(res.data && res.data.message);
                
                navigate('/login');
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        }
    }

  return (
    <Layout title={"Forgot Password - Ecommerce App"}>
        <div className='form-container'>
            <form onSubmit={handleSubmit}>
            <h4 className='title'>RESET PASSWORD</h4>
            <div className="mb-3">
                <input type="email" className="form-control" id="exampleInputEmail" placeholder='Enter Your Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="mb-3">
                <input type="text" className="form-control" id="exampleInputAnswer" placeholder='What is your favourite Sports ? ' value={answer} onChange={(e) => setAnswer(e.target.value)} required />
            </div>

            <div className="mb-3">
                <input type="password" className="form-control" id="exampleInputPassword" placeholder='Enter Your Password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>

            <button type="submit" className="btn btn-primary">RESET</button>
            </form>
        </div>
    </Layout>
  )
}

export default ForgotPassword