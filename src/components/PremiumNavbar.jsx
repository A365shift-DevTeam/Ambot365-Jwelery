import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const PremiumNavbar = ({
    logo = "BRAND",
    links = ['Overview', 'Features', 'Gallery'],
    ctaText = "Contact",
    accentColor = '#6B8E78'
}) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: isScrolled ? '1.2rem 4rem' : '2rem 4rem',
                zIndex: 100,
                transition: 'all 0.4s ease',
                color: '#fff',
                background: isScrolled ? 'rgba(5, 8, 7, 0.6)' : 'transparent',
                backdropFilter: isScrolled ? 'blur(15px)' : 'none',
                WebkitBackdropFilter: isScrolled ? 'blur(15px)' : 'none',
                borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
            }}
        >
            <div style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '1.5rem',
                letterSpacing: '0.1em',
                fontWeight: 600,
                textTransform: 'uppercase'
            }}>
                {logo}
            </div>

            <div style={{ display: 'flex', gap: '3rem' }}>
                {links.map(link => (
                    <a
                        key={link}
                        href={`#${link.toLowerCase().replace(/\s/g, '-')}`}
                        style={{
                            textDecoration: 'none',
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '0.9rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            transition: 'color 0.3s',
                            fontFamily: "'Manrope', sans-serif"
                        }}
                        onMouseOver={(e) => e.target.style.color = '#fff'}
                        onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.7)'}
                    >
                        {link}
                    </a>
                ))}
            </div>

            <button
                style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.9)',
                    color: 'rgba(255,255,255,0.9)',
                    padding: '0.8rem 2rem',
                    fontFamily: "'Manrope', sans-serif",
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                    e.target.style.background = '#fff';
                    e.target.style.color = '#050807';
                }}
                onMouseOut={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = 'rgba(255,255,255,0.9)';
                }}
            >
                {ctaText}
            </button>
        </motion.nav>
    );
};

export default PremiumNavbar;
