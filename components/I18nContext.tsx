"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type RouteTranslations = Record<string, string>;

interface I18nContextType {
    routeTranslations: RouteTranslations;
    setRouteTranslations: (translations: RouteTranslations) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [routeTranslations, setRouteTranslations] = useState<RouteTranslations>({});

    return (
        <I18nContext.Provider value={{ routeTranslations, setRouteTranslations }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
}

/**
 * Bu bileşen, sayfa bazlı dinamik URL çevirilerini I18nContext'e kaydeder.
 * Örn: Blog yazısı sayfasında kullanılır.
 */
export function RouteTranslator({ slugs }: { slugs: RouteTranslations }) {
    const { setRouteTranslations } = useI18n();

    useEffect(() => {
        setRouteTranslations(slugs);
        // Sayfadan ayrılınca temizle
        return () => setRouteTranslations({});
    }, [slugs, setRouteTranslations]);

    return null;
}
