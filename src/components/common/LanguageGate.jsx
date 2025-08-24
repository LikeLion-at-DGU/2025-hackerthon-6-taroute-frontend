// src/components/LanguageGate.jsx
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { languageState } from '../../contexts/recoil/languageState'
import i18n from '../../lang/i18n'

export function LanguageGate({ children }) {
    const [, setLang] = useRecoilState(languageState)

    useEffect(() => {
        const saved = localStorage.getItem("language") || "ko"
        setLang(saved)             // recoil atom 업데이트
        i18n.changeLanguage(saved) // i18n 전환
    }, [setLang])

    return children
}

export default LanguageGate  