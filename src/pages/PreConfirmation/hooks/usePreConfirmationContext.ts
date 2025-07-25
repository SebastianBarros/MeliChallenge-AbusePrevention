import { useContext } from "react"
import { PreConfirmationContext } from "../Context/PreConfirmationContext"

export const usePreConfirmationContext = () => {
    const ctx = useContext(PreConfirmationContext)
    if (!ctx) {
        throw new Error('You must in inside a <PreConfirmationContext /> to use this hook')
    }
    return ctx
}