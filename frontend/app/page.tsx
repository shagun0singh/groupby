"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProfileButton } from "@/components/ui/profile-button";
import { getAuthToken } from "@/lib/api";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  useEffect(() => {
    setIsLoggedIn(!!getAuthToken());
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#F5F5F5]">
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-gray-200 flex justify-between items-center px-8 py-5">
        <Link href="/" className="text-3xl tracking-tight whitespace-nowrap text-black" style={{ fontFamily: 'var(--font-caveat-brush)' }}>
          GroupBy
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="/events" className="text-gray-700 hover:text-black transition-colors">
              Discover
            </Link>
            <Link href="/host" className="text-gray-700 hover:text-black transition-colors">
              Host Event
            </Link>
            {!isLoggedIn && (
              <Link href="/login" className="text-gray-700 hover:text-black transition-colors">
                Login
              </Link>
            )}
          </nav>
          <ProfileButton />
        </div>
      </header>

      <main className="relative w-full overflow-hidden" style={{ height: '100vh', paddingTop: '80px' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          
          <div className="relative" style={{ width: '1200px', height: '600px' }}>
            
            <div 
              className="absolute shadow-2xl overflow-hidden"
              style={{
                left: '-20px',
                top: '80px',
                width: '150px',
                height: '340px',
                background: '#FFEB3B',
                zIndex: 1
              }}
            >
              <div style={{ padding: '36px 28px', display: 'flex', alignItems: 'center', height: '100%' }}>
                <div style={{ 
                  fontSize: '54px', 
                  fontWeight: '900', 
                  lineHeight: '1',
                  fontFamily: 'Impact, sans-serif',
                  color: '#000',
                  transform: 'rotate(-90deg)',
                  whiteSpace: 'nowrap'
                }}>
                  CONNECT
                </div>
              </div>
            </div>

            <div 
              className="absolute shadow-2xl"
              style={{
                left: '80px',
                top: '20px',
                width: '360px',
                height: '560px',
                background: '#1A1A1A',
                zIndex: 2
              }}
            >
              <div style={{ padding: '36px' }}>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '18px', marginBottom: '32px', fontWeight: '500', letterSpacing: '0.05em' }}>
                  Community
                </div>
                
                {/* Grid 8x8 - represents diverse community */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '5px' }}>
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} style={{ aspectRatio: '1', background: `rgba(255,255,255,${Math.random() * 0.15 + 0.05})`, borderRadius: '3px' }}></div>
                  ))}
                </div>
              </div>
              
              {/* Bottom images - community events */}
              <div className="absolute" style={{ bottom: '36px', left: '36px', width: '110px', height: '75px', borderRadius: '16px', overflow: 'hidden' }}>
                <Image src="https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=200&h=150&fit=crop" alt="Workshop" fill className="object-cover" />
              </div>
              
              <div className="absolute" style={{ bottom: '36px', right: '36px', width: '170px', height: '170px', borderRadius: '20px', overflow: 'hidden' }}>
                <Image src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=250&h=250&fit=crop" alt="Meetup" fill className="object-cover" />
                <div style={{ position: 'absolute', bottom: '10px', left: '10px', fontSize: '10px', color: '#fff', background: 'rgba(0,0,0,0.7)', padding: '5px 10px', borderRadius: '6px', fontWeight: '500' }}>
                  • Local Meetups
                </div>
              </div>
            </div>

            <div 
              className="absolute shadow-2xl overflow-hidden"
              style={{
                left: '380px',
                top: '0',
                width: '440px',
                height: '600px',
                background: '#2B5278',
                zIndex: 3
              }}
            >
              {/* Dot pattern */}
              <div className="absolute" style={{ top: '60px', left: '40px', right: '40px' }}>
                {Array.from({ length: 14 }).map((_, row) => (
                  <div key={row} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    {Array.from({ length: 12 }).map((_, col) => (
                      <div key={col} style={{ width: '7px', height: '7px', background: 'rgba(255,255,255,0.3)', borderRadius: '50%' }}></div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Top right circle - Community member */}
              <div className="absolute" style={{ top: '40px', right: '40px', width: '130px', height: '130px', borderRadius: '50%', overflow: 'hidden', border: '6px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
                <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces" alt="Community member" fill className="object-cover" />
              </div>

              {/* White Hero Card - PROMINENT CENTER */}
              <div 
                className="absolute bg-white"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '1100px',
                  height: '500px',
                  padding: '80px 100px',
                  borderRadius: '48px',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
                }}
              >
                <h1 style={{ 
                  fontSize: '88px', 
                  fontWeight: '400', 
                  lineHeight: '1.1',
                  textAlign: 'left',
                  color: '#000',
                  margin: '0',
                  letterSpacing: '-0.02em',
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
                }}>
                  Make this design move
                </h1>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                  <Link
                    href="/events"
                    style={{ 
                      background: '#6366F1',
                      color: '#fff',
                      padding: '18px 52px',
                      borderRadius: '14px',
                      fontSize: '19px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      display: 'inline-block'
                    }}
                  >
                    Get started
                  </Link>
                </div>
              </div>

              {/* Bottom left circle - Community member */}
              <div className="absolute" style={{ bottom: '40px', left: '40px', width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', border: '6px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
                <Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&h=250&fit=crop&crop=faces" alt="Community member" fill className="object-cover" />
              </div>

              {/* Bottom right corner - Event photo */}
              <div className="absolute" style={{ bottom: '0', right: '0', width: '190px', height: '170px', borderTopLeftRadius: '28px', overflow: 'hidden' }}>
                <Image src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300&h=250&fit=crop" alt="Community gathering" fill className="object-cover" />
              </div>

              {/* Plus button */}
              <div className="absolute" style={{ bottom: '28px', right: '28px', width: '50px', height: '50px', background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.3)', zIndex: 5 }}>
                <span style={{ color: '#fff', fontSize: '28px', fontWeight: '300' }}>+</span>
              </div>
            </div>

            <div 
              className="absolute shadow-2xl"
              style={{
                right: '80px',
                top: '20px',
                width: '320px',
                height: '520px',
                background: '#3D1B5C',
                zIndex: 2
              }}
            >
              <div style={{ padding: '32px 28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', letterSpacing: '0.05em', fontWeight: '600' }}>EVENTS</div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'rgba(255,255,255,0.6)', fontWeight: '500' }}>
                    <span>Tech</span>
                    <span>Art</span>
                    <span>Music</span>
                  </div>
                </div>
                
                {/* Image grid - event photos */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="relative" style={{ height: '130px', borderRadius: '14px', overflow: 'hidden' }}>
                    <Image src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&h=200&fit=crop" alt="Tech Workshop" fill className="object-cover" />
                  </div>
                  <div className="relative" style={{ height: '130px', borderRadius: '14px', overflow: 'hidden' }}>
                    <Image src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=200&h=200&fit=crop" alt="Team Building" fill className="object-cover" />
                  </div>
                </div>

                <div className="relative" style={{ height: '190px', borderRadius: '14px', overflow: 'hidden', marginBottom: '14px' }}>
                  <Image src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=300&fit=crop" alt="Community Event" fill className="object-cover" />
                </div>

                <div className="relative" style={{ height: '90px', borderRadius: '14px', overflow: 'hidden' }}>
                  <Image src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=150&fit=crop" alt="Networking" fill className="object-cover" />
                </div>
              </div>
            </div>

            <div 
              className="absolute shadow-2xl"
              style={{
                right: '-20px',
                top: '100px',
                width: '160px',
                height: '360px',
                background: '#B8A8D8',
                zIndex: 1
              }}
            >
              <div style={{ padding: '32px 24px' }}>
                <div style={{ fontSize: '12px', color: '#3D1B5C', marginBottom: '28px', fontWeight: '600', letterSpacing: '0.02em' }}>This Month</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: '#3D1B5C' }}>150+</div>
                    <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.6)', marginTop: '4px', fontWeight: '500' }}>Active Events</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: '#3D1B5C' }}>2.5K</div>
                    <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.6)', marginTop: '4px', fontWeight: '500' }}>Participants</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: '#3D1B5C' }}>500+</div>
                    <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.6)', marginTop: '4px', fontWeight: '500' }}>Connections</div>
                  </div>
                </div>
              </div>

              <div className="absolute" style={{ bottom: '0', left: '0', right: '0', height: '130px', borderBottomLeftRadius: '28px', overflow: 'hidden' }}>
                <Image src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=250&h=200&fit=crop" alt="Community" fill className="object-cover" />
                <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(to top, rgba(61, 27, 92, 0.8), transparent)' }}></div>
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', color: '#fff', fontSize: '16px', fontWeight: '700' }}>Join Us</div>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
