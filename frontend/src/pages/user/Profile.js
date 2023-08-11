import React, {useState, useEffect} from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import { useAuth } from '../../context/auth'
import axios from 'axios'
import toast from 'react-hot-toast'
import Password from 'antd/es/input/Password'

const Profile = () => {
    //context
    const [auth, setAuth] = useAuth()
    //state
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [mobile, setMobile] = useState("")
    const [address, setAddress] = useState("")

    //get user data
    useEffect(() => {
        const {email, name, mobile, address} = auth?.user
        setName(name)
        setEmail(email)
        setMobile(mobile)
        setAddress(address)
    },[auth?.user])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const {data} = await axios.put('/api/user/profile', {name, email, mobile, address, password});

            if(data?.error) {
                toast.error(data?.error)
            }
            else {
                setAuth({...auth, user: data?.updatedUser})
                let ls = localStorage.getItem('auth')
                ls = JSON.parse(ls)
                ls.user = data.updatedUser
                localStorage.setItem('auth', JSON.stringify(ls))
                toast.success('Profile Updated Successfully')
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        }
    }

  return (
    <Layout title={'Your Profile'}>
        <div className='container-fluid m-3 p-3'>
            <div className='row'>
                <div className='col-md-3'>
                    <UserMenu />
                </div>
                <div className='col-md-9'>
                    <div className='form-container'>
                        <form onSubmit={handleSubmit}>
                        <h4 className='title'>USER PROFILE</h4>
                        <div className="mb-3">
                            <input type="text" className="form-control" id="exampleInputName" placeholder='Enter Your Name' value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <input type="email" className="form-control" id="exampleInputEmail" placeholder='Enter Your Email' value={email} onChange={(e) => setEmail(e.target.value)} required disabled />
                        </div>
                        <div className="mb-3">
                            <input type="password" className="form-control" id="exampleInputPassword" placeholder='Enter Your Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" id="exampleInputPhone" placeholder='Enter Your Phone' value={mobile} onChange={(e) => setMobile(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" id="exampleInputAddress" placeholder='Enter your Address' value={address} onChange={(e) => setAddress(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary">UPDATE</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default Profile