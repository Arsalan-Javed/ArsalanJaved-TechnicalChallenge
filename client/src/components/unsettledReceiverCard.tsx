import { SettlementStatus } from "../utils/globals"
import DoneIcon from "../assets/done.svg"
import CancelIcon from "../assets/cancel.svg"

interface propsInterface{
    id: string,
    amount: string,
    status: SettlementStatus,
    onDisputeClick: (id: string, status: SettlementStatus) => void,
    onSettleClick: (id: string, status: SettlementStatus) => void
}
export default function UnSettledReceiver({ amount, status, id , onDisputeClick, onSettleClick}: propsInterface){
    return(
        <div className="block grow max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
            <div className="flex justify-between">
                <div className="flex flex-col justify-between mb-2">
                    <div className="text-lg font-bold">{amount}</div>
                    <div className="text-lg">{status}</div>
                </div>
                <div className="flex flex-col gap-4">
                    <button className={`bg-green-200 hover:bg-green-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center gap-2 ${status === SettlementStatus.DISPUTED? 'opacity-50 cursor-not-allowed' : '' }`} onClick={() => onSettleClick(id, SettlementStatus.SETTLED)} disabled={status === SettlementStatus.DISPUTED}>
                        {/* <Image width={20} height={20} src="/done.svg" alt="" /> */}
                        <img src={DoneIcon} alt="add" width="20" height="20" />

                        <span>Agree</span>
                    </button>
                    <button className={`bg-red-200 hover:bg-red-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center gap-2 ${status === SettlementStatus.DISPUTED? 'opacity-50 cursor-not-allowed' : '' }`} onClick={() => onDisputeClick(id, SettlementStatus.DISPUTED)} disabled={status === SettlementStatus.DISPUTED}>
                        {/* <Image width={20} height={20} src="/cancel.svg" alt="" /> */}
                        <img src={CancelIcon} alt="add" width="20" height="20" />
                        <span>Dispute</span>
                    </button>
                </div>
            </div>
        </div>
    )
}