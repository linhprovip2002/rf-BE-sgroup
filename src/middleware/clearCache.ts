import { cacheService } from "../service/index";

export default async (req, res, next) => {
    await next();
    if(req.params.id){
        cacheService.delete('users',req.params.id);
    } else {
        cacheService.delete('users', 888);
    }
}