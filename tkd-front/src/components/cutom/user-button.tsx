export function Userbutton({ btnText, btnFunction, selected = false }
    : {
        btnText: string,
        btnFunction: (...args: any[]) => any,
        selected: boolean
    }) {
    
    return (
        <button className={"text-center w-full " + (selected && "border-b")} onClick={btnFunction}>
            { btnText }
        </button>
    )
}
