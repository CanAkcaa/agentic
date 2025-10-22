import { STORE_NAME } from "./constants";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { IUser } from "../shared/models/users";


interface IProps {
    user?: IUser;
    setUser: (user: IUser) => void;
}

export const useUserStore = create(
    persist<IProps>(
        (set) => ({
            user: undefined,
            setUser: (user) => {
                set({ user })
            },
        }),
        {
            name: STORE_NAME.USER,
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        }
    )
)