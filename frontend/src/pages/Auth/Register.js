import React, {useState} from 'react'
import Layout from '../../components/Layout/Layout'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast';
import '../../styles/AuthStyles.css'

const Register = () => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [mobile, setMobile] = useState("")
    const [address, setAddress] = useState("")
    const [answer, setAnswer] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/user/register', {name, email, password, mobile, address, answer});
            if(res && res.data.success)
            {
                toast.success('Register Successfully');
                navigate('/login');
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        }
    }

    const navigate = useNavigate();

  return (
    <Layout title={'Register - Ecommer App'}>
        <div className='form-container'>
            <form onSubmit={handleSubmit}>
            <h4 className='title'>REGISTER FORM</h4>
            <div className="mb-3">
                <input type="text" className="form-control" id="exampleInputName" placeholder='Enter Your Name' value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="mb-3">
                <input type="email" className="form-control" id="exampleInputEmail" placeholder='Enter Your Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
                <input type="password" className="form-control" id="exampleInputPassword" placeholder='Enter Your Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="mb-3">
                <input type="text" className="form-control" id="exampleInputPhone" placeholder='Enter Your Phone' value={mobile} onChange={(e) => setMobile(e.target.value)} required />
            </div>
            <div className="mb-3">
                <input type="text" className="form-control" id="exampleInputAddress" placeholder='Enter your Address' value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>
            <div className="mb-3">
                <input type="text" className="form-control" id="exampleInputAnswer" placeholder='What is your favourite sports ?' value={answer} onChange={(e) => setAnswer(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary">REGISTER</button>
            </form>
        </div>
    </Layout>
  )
}

export default Register