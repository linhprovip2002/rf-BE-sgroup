import authService from "../route/auth/auth.service";
import { cacheService } from "../service";
export default function checkAuthorization(permission: string) {
    return function (req, res, next) {
        const idUser: number = req.userToken.id;
        // console.log(idUser);
        console.log(idUser);
        
        cacheService.get('userPermission', idUser).then((result) => {
            if (result != null) {
                // console.log("hahahaha");
                // console.log('get permission from cache', result);
                return result.includes(permission) ? next() : res.status(403).json('You do not have permission to access');
            } else {
                const userRoles = req.userToken.roles;
                console.log(userRoles);
                
                const hasPermission = async () => {
                    for (const role of userRoles) {
                      const permissions = await authService.findPermissionByRole(role);
                      if (permissions) {
                        const permissionName = permissions.map((row) => row.permission_name);
                        cacheService.set('userPermission', idUser, permissionName);
                        console.log(permissionName.includes(permission));
                        return permissionName.includes(permission);
                      }
                    }
                    return false; // If no permissions found for any role, return false.
                  };
                  
                  hasPermission()
                    .then((result) => {
                      if (result) {
                        next();
                      } else {
                        res.status(403).json('You do not have permission to access');
                      }
                    });
            }
        })
    }
}