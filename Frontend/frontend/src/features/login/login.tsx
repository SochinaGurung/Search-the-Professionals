import { useState, type ChangeEvent, type FormEvent } from "react"
import './login.css';
import { useNavigate } from "react-router-dom";
import type { AxiosResponse, AxiosError} from "axios";
import { loginApi } from "../../shared/config/api";



export default function Login(){
    const [formData, setFormData] = useState({username:'', password:''})
    const navigate=useNavigate()

    const handleChange= (e: ChangeEvent<HTMLInputElement>)=>{
        const {name, value} =e.target;
        setFormData({...formData, [name]:value})
    }
    const handleSubmit=(e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

       
        loginApi(formData).then((res: AxiosResponse)=>{
            console.log(res)
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('currentUser', JSON.stringify(res.data.user));
            navigate('/home');
        }
        ).catch((error: AxiosError) => {
            const message = (error.response?.data as { message?: string })?.message || 'Server Error';
            alert(message);
            }
        ).finally(()=>{
            console.log('Okay')  
        })
    }
    return(
        <div className="login-wrapper">
            <form onSubmit={handleSubmit}>
                <label className="Title"> LOGIN</label>
                <input name="username" onChange= {handleChange} value={formData.username} placeholder="Username" type="text"/>
                <input name="password" onChange= {handleChange} value={formData. password} placeholder="Password" type="password"/>
                <button type="submit"> Submit</button>
                <button type="button" onClick={() => navigate('/register')}>Go to Register Page</button>
            </form>
        </div>
    )
}
