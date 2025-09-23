import apiAxios from "../ApiConfig/ApiConfig";

const BASE = '/api/Resume'

export async function InitGame (roomcode:number ): Promise <void>{
    try{
        await apiAxios.post(`${BASE}/init/${roomcode}`);
    } catch (err){
        return Promise.reject(err);
    }
} 

export async function palyTurn(roomcode:number): Promise<void>{
    try{
        await apiAxios.post(`${BASE}/turn/${roomcode}`);
    } catch (err){
        return Promise.reject(err);
    }
}
