import axios from "axios"
import { environment } from "./environment"

const createAuthService = () => {
    const login = async (password: string) => {
        const res = await axios.post(`${environment.api}/auth`, {password})
        return res.data
    }
    return {
       login
    }
}

export const authService = createAuthService()