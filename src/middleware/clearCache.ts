import { cacheService } from "../service/index";

export default async (req, res, next) => {
    await next();
    if(req.params.id){
        cacheService.delete('users',req.params.id);
        cacheService.delete('users', 888);
    } else {
        console.log('clearing cache all users');
        cacheService.delete('users', 888);
    }
}