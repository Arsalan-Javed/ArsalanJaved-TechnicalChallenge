import { UserModel, baseUrl } from "../utils/globals";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function Header(){
    const [user, setUser] = useState<UserModel | null>(null);
    const navigate = useNavigate();

    const getUserLogin = () => {
        const user = localStorage.getItem('user');
        if (user) {
            setUser(JSON.parse(user));
        }else{
            setUser(null);
        }
    }

    useEffect(() => {
      getUserLogin();

      setInterval(()=>{getUserLogin()}, 500);
    }, [])

    const addUsers = async ()=>{
        try {
            const users = await axios.get(`${baseUrl}auth/signup`);
            toast.success('Users Added Successfully!')
        } catch (error) {
            toast.error(JSON.stringify(error));
        }
    }

    const logout = () => {
        localStorage.removeItem('user');
        navigate('/signin')
    }

    return(
        <div className="bg-gray-800 p-6">
            <div className="flex justify-between">
                <div className="text-3xl font-bold text-white">
                    Technical Challenge 
                </div>
                { user && <div className="flex justify-end gap-3">
                    <div className="text-xl self-center text-white">
                        {user.username}
                    </div>
                    <div className="text-xl self-center text-white hover:text-gray-300 cursor-pointer" onClick={logout}>
                        logout
                    </div>
                </div>}
            </div>
            {/* <div className="text-end">
                <button className="bg-white hover:bg-grey-300 py-2 px-4 rounded" onClick={addUsers}>Add users</button>
            </div> */}
        </div>
    )
}
