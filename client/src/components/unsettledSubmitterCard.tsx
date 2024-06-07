import { SettlementStatus } from "../utils/globals"
import EditIcon from "../assets/edit.svg"

interface propsInterface{
    id: string,
    amount: string,
    status: SettlementStatus,
    onEditClick: (id: string, amount: string) => void
}
export default function UnSettledSubmitter({ amount, status, id , onEditClick}: propsInterface){
    return(
        <div className="block grow max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
            <div className="flex justify-between mb-3">
                <div className="text-lg font-bold">{amount}</div>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center gap-2" onClick={() => onEditClick(id, amount)}>
                    {/* <Image width={20} height={20} src="/edit.svg" alt="" /> */}
                    <img src={EditIcon} alt="add" width="20" height="20" />
                    <span>Edit</span>
                </button>
            </div>
            <div className="text-lg">{status}</div>
        </div>
    )
}