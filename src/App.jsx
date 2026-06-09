import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import PremiumNavbar from './components/PremiumNavbar';
import Loader from './components/Loader';
import Hero from './components/Hero';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Jewelry = () => {
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState([]);

    const handleLoaded = (loadedImages) => {
        setImages(loadedImages);
        setLoading(false);
    };

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        // Keep GSAP ScrollTrigger in sync with Lenis smooth scroll
        lenis.on('scroll', ScrollTrigger.update);

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        if (!loading) {
            // Give everything a moment to settle then refresh ScrollTriggers (important for pinned canvas scrub)
            ScrollTrigger.refresh();
            const timer1 = setTimeout(() => ScrollTrigger.refresh(), 650);
            const timer2 = setTimeout(() => ScrollTrigger.refresh(), 1350);
            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
                lenis.destroy();
            };
        }
        return () => lenis.destroy();
    }, [loading]);

    const jewelryImages = {
        rings: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
        necklaces: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
        earrings: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80'
    };

    return (
        <>
            {loading && <Loader onLoaded={handleLoaded} />}
            <main style={{
                opacity: loading ? 0 : 1,
                transition: 'opacity 1s ease-in-out',
                pointerEvents: loading ? 'none' : 'auto',
                backgroundColor: '#0a0a0a',
                fontFamily: "'Manrope', sans-serif",
            }}>
                <PremiumNavbar
                    logo="MAISON DE LUXE"
                    links={['Essence', 'Craftsmanship', 'Collection']}
                    ctaText="Shop Now"
                />
                <Hero preloadedImages={images} />

                {/* The Collection */}
                <section style={{ backgroundColor: '#050505', padding: '8rem 4rem', position: 'relative', zIndex: 5 }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '3rem', color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginBottom: '4rem' }}>
                            The Collection
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                            {[
                                { title: 'Signature Rings', img: jewelryImages.rings, desc: 'Hand-forged bands featuring conflict-free diamonds and ethically sourced gemstones.' },
                                { title: 'Statement Necklaces', img: jewelryImages.necklaces, desc: 'Delicate chains and bold pendants crafted from 18K gold and platinum.' },
                                { title: 'Artisan Earrings', img: jewelryImages.earrings, desc: 'From subtle studs to dramatic drops. Each pair is meticulously crafted.' }
                            ].map((item, i) => (
                                <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ height: '300px', backgroundImage: `url(${item.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                                    <div style={{ padding: '2rem' }}>
                                        <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.5rem', color: '#D4AF37', marginBottom: '1rem' }}>{item.title}</h3>
                                        <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: '1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Precious Materials */}
                <section style={{ backgroundColor: '#0A0A0C', padding: '8rem 4rem', position: 'relative', zIndex: 5 }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                        <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '2.5rem', color: 'rgba(255,255,255,0.9)', marginBottom: '2rem' }}>Precious Materials</h2>
                        <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: '1.2rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: '4rem' }}>
                            We source only the finest materials from ethical suppliers around the world.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
                            {['Diamonds', '18K Gold', 'Platinum', 'Sapphires'].map((m, i) => (
                                <div key={i} style={{ textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '4px' }}>
                                    <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(212,175,55,0.3), rgba(212,175,55,0.1))', border: '1px solid rgba(212,175,55,0.4)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span style={{ color: '#D4AF37', fontSize: '1.5rem' }}>✦</span>
                                    </div>
                                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: '1.1rem', color: '#D4AF37', marginBottom: '0.5rem' }}>{m}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Gallery */}
                <section style={{ backgroundColor: '#050505', padding: '8rem 4rem', position: 'relative', zIndex: 5 }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '2.5rem', color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginBottom: '4rem' }}>Gallery</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gridTemplateRows: 'repeat(2,250px)', gap: '1rem' }}>
                            {[
                                'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
                                'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&q=80',
                                'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80',
                                'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&q=80',
                                'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&q=80'
                            ].map((url, idx) => (
                                <div key={idx} style={{ gridColumn: idx === 0 ? 'span 2' : 'span 1', gridRow: idx === 0 ? 'span 2' : 'span 1', backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '4px' }} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section style={{ backgroundColor: '#0A0A0C', padding: '10rem 4rem', position: 'relative', zIndex: 5, textAlign: 'center', backgroundImage: 'linear-gradient(rgba(5,5,5,0.85), rgba(5,5,5,0.85)), url(https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1200&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '3.5rem', color: 'rgba(255,255,255,0.9)', marginBottom: '1.5rem' }}>Begin Your Legacy</h2>
                    <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: '1.2rem', color: 'rgba(255,255,255,0.5)', marginBottom: '3rem' }}>
                        Book a private consultation with our master jewelers.
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button style={{ padding: '1.2rem 3rem', background: '#D4AF37', color: '#050505', border: 'none', fontFamily: "'Manrope', sans-serif", fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer' }}>Shop Collection</button>
                        <button style={{ padding: '1.2rem 3rem', background: 'transparent', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(212,175,55,0.4)', fontFamily: "'Manrope', sans-serif", fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer' }}>Book Consultation</button>
                    </div>
                </section>

                <footer style={{ backgroundColor: '#050505', padding: '3rem 4rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                    <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>
                        &copy; {new Date().getFullYear()} MAISON DE LUXE. All Rights Reserved.
                    </p>
                </footer>
            </main>
        </>
    );
};

export default Jewelry;
