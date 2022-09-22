import { getUserController } from "../controllers/user";

/**
 * User routes
 *
 * @export
 * @param {*} app
 */
export function getUserRoutes(app: any): void {
    app.get('/users/:userUniqueName', getUserController);
}