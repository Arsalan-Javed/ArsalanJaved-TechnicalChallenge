
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import io from "socket.io-client";
import { SettlementDataModel, SettlementStatus, UserModel, UserRoles, baseUrl, socketBaseUrl } from "../utils/globals";
import { LabelledInput } from "../shared/labelledInput";
import Setteled from "./settledCard";
import DoneIcon from '../assets/done.svg';
import AddIcon from '../assets/add.svg';
import CancelIcon from '../assets/cancel.svg';
import UnSettledReceiver from "./unsettledReceiverCard";
import UnSettledSubmitter from "./unsettledSubmitterCard";


export default function Dashboard() {
    const [socket, setSocket] = useState<any>(null)
    const [user, setUser] = useState<UserModel | null>(null);
    const [data, setData] = useState<{settled:SettlementDataModel[], not_settled:SettlementDataModel[]} | null>(null);
    const [id, setId] = useState<string | null>(null)
    const [amount, setAmount] = useState<string | null>(null)
    const [displayForm, setDisplayForm] = useState<boolean>(false);
    
    useEffect(() => {
        const u = localStorage.getItem('user');
        if (u) {
            setUser(JSON.parse(u));
        }
        const parsed_user  = JSON.parse(u as string);
        getSettlements();
            
        const socket = io(socketBaseUrl);
        setSocket(socket);

        if (parsed_user?.user_role === UserRoles.RECEIVER) {
            socket.on('connect', ()=> {
                console.log('Connected to server');
              });
            socket.on('get_settlement', (updated_data:any)=>{
                setData(updated_data)
                console.log(updated_data, "updated_data");
            });
        }
    }, [])
    
    const getSettlements = async () => {
        try {
            const response: any = await axios.get(`${baseUrl}settlement`);
            setData(response.data);
            console.log(response.data ?? null);
            
        } catch (error:any) {
            toast.error(error.response?.data.message);
        }
    }

    const handleEditClick = (id:string, amount:string) => {
        setId(id);
        setAmount(amount);
        setDisplayForm(true);
    };

    const onSaveClick = () =>{
        if (id) {
            updateSettlement();
        }else{
            saveSettlement();
        }
    }

    const saveSettlement=async ()=>{
        try {
            const body = {
                user_id: user?.id,
                amount: amount
            }
            const response = await axios.post(`${baseUrl}settlement`, body);
            if (response.data) {
                toast.success('Settlement added successfully');

                resetFields();

                getNewData();
            }
        } catch (error:any) {
            toast.error(error.response?.data.message)
        }
    }
    const updateSettlement=async ()=>{
        try {
            const body = {
                id: id,
                amount: amount
            }
            const response = await axios.patch(`${baseUrl}settlement`, body);
            if (response.data) {
                if (response.data?.type == 'warn') {
                    toast(response.data.message, {icon: '⚠️'});
                }
                toast.success('Settlement updated successfully');

                resetFields();

                getNewData();
            }
        } catch (error:any) {
            getNewData();
            resetFields();
            toast.error(error.response?.data.message)
        }
    }


    const updateSettlementClickReceiver=async (settlement_id: string, status: SettlementStatus)=>{
        try {
            const body = {
                id: settlement_id,
                status: status
            }
            const response = await axios.post(`${baseUrl}settlement/update`, body);
            if (response.data) {
                toast.success('Settlement updated successfully');
                getNewData();
            }
        } catch (error:any) {
            getSettlements();
            toast.error(error.response?.data?.message)
        }
    }

    const getNewData = () => {
        if (user?.user_role === UserRoles.SUBMITTER) {
            socket.emit('update_settlement', 'update happened')
            getSettlements();
        }else{
            socket.emit('update_settlement', 'update happened')
        }
    }

    const resetFields = () => {
        setId(null);
        setAmount(null);
        setDisplayForm(false);
    }

    return(
        <div className="p-6">
            {
                user?.user_role===UserRoles.SUBMITTER && (!displayForm
                ?<div className="flex justify-end cursor-pointer mb-4 pb-3" onClick={()=>{setDisplayForm(true)}}>
                    <div className="group relative">
                        <img src={AddIcon} alt="add" width="50" height="50" />
                        <span className="absolute top-12 scale-0 rounded bg-gray-800 p-2 text-ms text-white group-hover:scale-100 add-tooltip">Add New Settlement</span>
                    </div>
                </div>
                :<div className="flex justify-center gap-5 mb-3">
                    <div className="max-w-md grow">
                        <LabelledInput onChange={(e:any) => {
                            setAmount(e.target.value)
                        }} label="Amount" type={"number"} placeholder="Amount" value={amount as string} />
                    </div>
                    <div className="flex gap-4 self-end">
                        <button className="bg-green-200 hover:bg-green-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center gap-2" onClick={() => onSaveClick()}>
                            <img src={DoneIcon} alt="done" width="20" height="20" />
                            <span>{id ? 'Update' : 'Save'}</span>
                        </button>
                        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center gap-2" onClick={() => {resetFields()}}>
                            <img src={CancelIcon} alt="add" width="20" height="20" />
                            <span>Cancel</span>
                        </button>
                    </div>
                </div>)
            }
            <div>
                <div className="text-xl font-bold">
                Unsettled
                </div>
                {!data || !data?.not_settled || data?.not_settled?.length === 0 ?
                    <div className="flex justify-center align-center h-24"><span className="self-center">No Data To Display</span></div>:
                    <div className="mt-4 flex flex-wrap gap-4">
                        {user?.user_role === UserRoles.SUBMITTER ?
                            data.not_settled.map((item)=>(
                                <UnSettledSubmitter key={item.id} amount={item.amount} id={item.id} status={item.status} onEditClick={handleEditClick} />
                            ))
                            :data.not_settled.map((item)=>(
                                <UnSettledReceiver key={item.id} amount={item.amount} id={item.id} status={item.status} onDisputeClick={updateSettlementClickReceiver} onSettleClick={updateSettlementClickReceiver} />
                            ))
                        }
                    </div>
                }
            </div>
            <div className="mt-6 pt-6">
                <div className="text-xl font-bold">
                Settled
                </div>
                {!data || !data?.settled || data?.settled?.length === 0 ?
                    <div className="flex justify-center align-center h-24"><span className="self-center">No Data To Display</span></div>:
                    <div className="mt-4 flex flex-wrap gap-4">
                        {data.settled.map((item)=>(
                            <Setteled key={item.id} amount={item.amount} id={item.id} status={item.status}/>
                        ))}
                    </div>
                }
            </div>
        </div>
    )
}