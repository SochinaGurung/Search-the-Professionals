import React from 'react';
import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import type {  User } from '../Interface/User';

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