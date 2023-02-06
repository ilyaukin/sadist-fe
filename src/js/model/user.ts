import * as React from "react";

export type UserType = 'anon' | 'google';

export interface User {
    type: UserType;
    name?: string;
    avatar?: string | React.CSSProperties;
    extra?: any;
}

export interface UserContextData {
    /**
     * current user of the app
     */
    user: User;

    /**
     * if loading of the current user in progress
     */
    loading: boolean;

    /**
     * if login in progress
     */
    isLogin: boolean;

    /**
     * if logout in progress
     */
    isLogout: boolean;

    /**
     * if login dialog is shown to the user
     */
    isLoginDialogOpen: boolean;
}

export interface UserContextValue extends UserContextData {
    whoami(): Promise<User>;
    loginGoogle(): Promise<User>;
    logout(): Promise<User>;
    openLoginDialog(): void;
    closeLoginDialog(): void;
}