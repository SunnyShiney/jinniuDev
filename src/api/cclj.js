import request from '@/utils/request.js'
import { params } from "@/store/store.js";

export function getMainCclj() {  
    return request({
        url: '/cclj/mainInfo?token='+params.hwzyToken,
        method: 'get'
    })
}
