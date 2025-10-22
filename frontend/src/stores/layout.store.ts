import { MerchantEnvironmentType } from "../shared/enums/merchant-enviroment-type";
import { STORE_NAME } from "./constants";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface IProps {
    Environment?: MerchantEnvironmentType;
    setEnvironment: (environment: MerchantEnvironmentType) => void;
}

export const useLayoutStore = create(
    persist<IProps>(
        (set) => ({
            Environment: MerchantEnvironmentType.Sandbox,
            setEnvironment: (Environment) => {
                set({ Environment })
            },
        }),
        {
            name: STORE_NAME.LAYOUT,
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        }
    )
)