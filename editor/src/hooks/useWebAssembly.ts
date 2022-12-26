import { useState, useEffect } from 'react';

export type GenericModule<T> = {
    module: T | null,
    error: unknown | null
}

export type ModuleLoader<T> = () => Promise<T>;

export default function useWebAsembly<T>(moduleLoader: ModuleLoader<T>): GenericModule<T> {
    const [error, setError] = useState<unknown | null>(null);
    const [module, setModule] = useState<T | null>(null);

    useEffect(() => {
        moduleLoader().then((module: T) => {
            setModule(module);
        }).catch((error: unknown) => {
            setError(error);
        });
    }, []);

    return { module, error };
}