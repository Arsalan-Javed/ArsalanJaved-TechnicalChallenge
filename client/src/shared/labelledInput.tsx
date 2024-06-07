import { ChangeEventHandler } from "react";
interface LabelledInputType {
    label: string;
    placeholder: string;
    type?: string;
    value?:string;
    onChange: ChangeEventHandler<HTMLInputElement>
}

export function LabelledInput({ label, value = '', placeholder, type, onChange }: LabelledInputType) {
    const minAmount = type === "number"? 0 : undefined;
    return <div>
        <label className="block mb-2 text-sm text-black font-semibold pt-4">{label}</label>
        <input onChange={onChange} type={type || "text"} id={label} min={minAmount} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} value={value} required />
    </div>
}
