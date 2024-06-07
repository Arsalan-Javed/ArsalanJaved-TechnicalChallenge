import { useEffect, useState } from "react";
import { LabelledInput } from "../shared/labelledInput";
import axios from "axios";
import { baseUrl } from "../utils/globals";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Signin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const signin = async () =>{
        try {
            const body = {
                username,
                password
            }
            const response = await axios.post(`${baseUrl}auth/signin`, body);

            localStorage.setItem('user', JSON.stringify(response.data.user));
            toast.success('Users Signed In Successfully!')

            navigate('/');
        } catch (error:any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
          navigate('/')
        }
    }, [])
    
    return <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center">
        <div className="block grow max-w-md p-8 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 ">
            <div>
                <div className="text-center">
                    <div className="text-3xl font-extrabold">
                        Sign in
                    </div>
                </div>
                <div className="pt-2">
                    <LabelledInput onChange={(e) => {
                            setUsername(e.target.value);
                        }} label="Username" placeholder="User name" value={username} />
                    <LabelledInput onChange={(e) => {
                            setPassword(e.target.value)
                        }} label="Password" type={"password"} placeholder="Password" value={password} />
                    <button type="button" className="mt-8 w-full text-white bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2" onClick={signin} >Sign in</button>
                </div>
            </div>
        </div>
        </div>
    </div>
}