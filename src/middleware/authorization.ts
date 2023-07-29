import authService from "../route/auth/auth.service";
import { cacheService } from "../service";
export default function checkAuthorization(permission: string) {
    return function (req, res, next) {
        const idUser: number = req.userToken.id;
        // console.log(idUser);
        
        cacheService.get('userPermission', idUser).then((result) => {
            if (result != null) {
                // console.log('get permission from cache', result);
                return result.includes(permission) ? next() : res.status(403).json('You do not have permission to access');
            } else {
                const userRoles = req.userToken.roles;
                const hasPermission = userRoles.some((role) => {
                    authService.findPermissionByRole(role)
                        .then((permissions) => {
                            if (permissions) {
                                const permissionName = permissions.map((row) => row.permission_name);
                                cacheService.set('userPermission', idUser, permissionName);
                                // console.log(permissionName.includes(permission));
                                return permissionName.includes(permission);
                            }
                        });
                });
                // console.log(hasPermission);
                if (hasPermission) {
                    next();
                } else {
                    res.status(403).json('You do not have permission to access');
                }
            }
        })
    }
}