// src/components/CookieConsentBanner.tsx

import React from 'react';
import CookieConsent from "react-cookie-consent";
import { Link } from 'react-router-dom'; // On utilise Link pour la navigation interne

const CookieConsentBanner: React.FC = () => {
    return (
        <CookieConsent
            location="bottom"
            buttonText="J'accepte"
            declineButtonText="Je refuse"
            enableDeclineButton
            cookieName="sportradar-cookie-consent"
            style={{
                background: "#2B373B",
                fontSize: "14px",
                textAlign: "left"
            }}
            buttonStyle={{
                color: "#FFFFFF",
                background: "#F97316", // Fond orange pour correspondre à votre thème
                fontSize: "14px",
                fontWeight: "bold",
                borderRadius: "5px"
            }}
            declineButtonStyle={{
                color: "#A0A0A0",
                background: "#4B5563", // Un gris neutre
                fontSize: "14px",
                borderRadius: "5px"
            }}
            expires={150} // Le choix de l'utilisateur sera conservé 150 jours
        >
            Ce site utilise des cookies pour améliorer l'expérience utilisateur. En continuant à naviguer, vous acceptez notre utilisation des cookies.{" "}
            <Link to="/privacy" style={{ color: "#FDBA74", textDecoration: 'underline' }}>
                En savoir plus
            </Link>
        </CookieConsent>
    );
};

export default CookieConsentBanner;
