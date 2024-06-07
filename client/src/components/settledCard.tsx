import { SettlementStatus } from "../utils/globals";

interface propsInterface{
    id: string,
    amount: string,
    status: SettlementStatus,
}
export default function Setteled({ amount, status, id }: propsInterface){
    return(
        <div className="block grow max-w-xs p-6 bg-green-200 border border-green-300 rounded-lg shadow hover:bg-green-100">
            <div className="flex justify-between mb-3">
                <div className="text-lg font-bold">{amount}</div>
            </div>
            <div className="text-lg">{status}</div>
        </div>
    )
}