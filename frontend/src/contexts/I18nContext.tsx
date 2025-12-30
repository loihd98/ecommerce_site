'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import translations from '@/locales/translations.json';

type Locale = 'en' | 'vi';
type Translations = typeof translations;

interface I18nContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('vi');

    useEffect(() => {
        const savedLocale = localStorage.getItem('locale') as Locale;
        if (savedLocale && (savedLocale === 'en' || savedLocale === 'vi')) {
            setLocaleState(savedLocale);
        } else {
            // Set Vietnamese as default if no saved locale
            localStorage.setItem('locale', 'vi');
        }
    }, []);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem('locale', newLocale);
    };

    const t = (key: string): string => {
        const keys = key.split('.');
        let value: any = translations[locale];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return key;
            }
        }

        return typeof value === 'string' ? value : key;
    };

    return (
        <I18nContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (context === undefined) {
        // Return default values during SSR
        if (typeof window === 'undefined') {
            return {
                locale: 'en' as Locale,
                setLocale: () => { },
                t: (key: string) => key,
            };
        }
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
}
