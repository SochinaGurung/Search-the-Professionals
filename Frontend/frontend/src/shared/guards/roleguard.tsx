import { Navigate } from "react-router-dom";
import type { JSX } from "react";

interface User{
    role:string;
    username:string;
    email:string;
    _id:string;
    //can add other properties if needed
}

interface RoleGuardProps {
    allowedRoles: string[];
    children: JSX.Element;
}

const RoleGuard = ({ allowedRoles, children }: RoleGuardProps) => {
    const token = localStorage.getItem('token');
    const user:User = JSON.parse(localStorage.getItem('currentUser')!);

    if (!token || !user) {
        return <Navigate to="/" replace />;
    }

    if(!allowedRoles.includes(user.role)) {
        return <Navigate to="/home" replace />;
    }

    return children;
};


export default RoleGuard;