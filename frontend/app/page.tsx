"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProfileButton } from "@/components/ui/profile-button";
import { getAuthToken } from "@/lib/api";

export default function Home() {
  const [isLoggedIn] = useState<boolean>(() => !!getAuthToken());

  return (
    <div className="relative w-full min-h-screen bg-[#F5F5F5]">
      {/* Navbar */}
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

      {/* Hero Section */}
      <main className="relative w-full overflow-hidden" style={{ height: '100vh', paddingTop: '80px' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          
          {/* Bento Grid Container */}
          <div className="relative" style={{ width: '1200px', height: '600px' }}>
            
            {/* 1. Yellow WORK'S - Far Left */}
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
              <div style={{ padding: '36px 28px' }}>
                <div style={{ 
                  fontSize: '64px', 
                  fontWeight: '900', 
                  lineHeight: '0.8',
                  fontFamily: 'Impact, sans-serif',
                  color: '#000'
                }}>
                  WORK'S
                </div>
              </div>
            </div>

            {/* 2. Black collective - Left */}
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
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px', marginBottom: '32px', fontWeight: '300' }}>
                  collective
                </div>
                
                {/* Grid 8x8 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '5px' }}>
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} style={{ aspectRatio: '1', background: 'rgba(255,255,255,0.04)', borderRadius: '3px' }}></div>
                  ))}
                </div>
              </div>
              
              {/* Bottom images */}
              <div className="absolute" style={{ bottom: '36px', left: '36px', width: '110px', height: '75px', borderRadius: '16px', overflow: 'hidden' }}>
                <Image src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=150&fit=crop" alt="" fill className="object-cover" />
              </div>
              
              <div className="absolute" style={{ bottom: '36px', right: '36px', width: '170px', height: '170px', borderRadius: '20px', overflow: 'hidden' }}>
                <Image src="https://images.unsplash.com/photo-1506157786151-b8491531f063?w=250&h=250&fit=crop" alt="" fill className="object-cover" />
                <div style={{ position: 'absolute', bottom: '10px', left: '10px', fontSize: '9px', color: '#fff', background: 'rgba(0,0,0,0.7)', padding: '4px 8px', borderRadius: '6px' }}>
                  • Geological Formation Study
                </div>
              </div>
            </div>

            {/* 3. Blue Center with White Card */}
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

              {/* Top right circle */}
              <div className="absolute" style={{ top: '40px', right: '40px', width: '130px', height: '130px', borderRadius: '50%', overflow: 'hidden', border: '6px solid rgba(255,255,255,0.2)' }}>
                <Image src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop" alt="" fill className="object-cover" />
              </div>

              {/* White Hero Card - CENTERED */}
              <div 
                className="absolute bg-white shadow-2xl"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '850px',
                  padding: '56px 100px',
                  borderRadius: '48px',
                  zIndex: 10
                }}
              >
                <h1 style={{ 
                  fontSize: '64px', 
                  fontWeight: '700', 
                  lineHeight: '1',
                  textAlign: 'center',
                  color: '#000',
                  marginBottom: '40px'
                }}>
                  Make this design move
                </h1>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Link
                    href="/events"
                    style={{ 
                      background: '#5B5FEF',
                      color: '#fff',
                      padding: '18px 56px',
                      borderRadius: '14px',
                      fontSize: '18px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      display: 'inline-block'
                    }}
                  >
                    Get started
                  </Link>
                </div>
              </div>

              {/* Bottom left circle */}
              <div className="absolute" style={{ bottom: '40px', left: '40px', width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', border: '6px solid rgba(255,255,255,0.2)' }}>
                <Image src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=250&h=250&fit=crop" alt="" fill className="object-cover" />
              </div>

              {/* Bottom right corner */}
              <div className="absolute" style={{ bottom: '0', right: '0', width: '190px', height: '170px', borderTopLeftRadius: '28px', overflow: 'hidden' }}>
                <Image src="https://images.unsplash.com/photo-1545486332-9e0999c535b2?w=300&h=250&fit=crop" alt="" fill className="object-cover" />
              </div>

              {/* Plus button */}
              <div className="absolute" style={{ bottom: '28px', right: '28px', width: '50px', height: '50px', background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.3)', zIndex: 5 }}>
                <span style={{ color: '#fff', fontSize: '28px', fontWeight: '300' }}>+</span>
              </div>
            </div>

            {/* 4. Purple A/REPS - Right */}
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
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', letterSpacing: '0.1em' }}>A/REPS</div>
                  <div style={{ display: 'flex', gap: '14px', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                    <span>Artists</span>
                    <span>Categories</span>
                    <span>Contact</span>
                  </div>
                </div>
                
                {/* Image grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="relative" style={{ height: '130px', borderRadius: '14px', overflow: 'hidden' }}>
                    <Image src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200&h=200&fit=crop" alt="" fill className="object-cover" />
                  </div>
                  <div className="relative" style={{ height: '130px', borderRadius: '14px', overflow: 'hidden' }}>
                    <Image src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop" alt="" fill className="object-cover" />
                  </div>
                </div>

                <div className="relative" style={{ height: '190px', borderRadius: '14px', overflow: 'hidden', marginBottom: '14px' }}>
                  <Image src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop" alt="" fill className="object-cover" />
                </div>

                <div className="relative" style={{ height: '90px', borderRadius: '14px', overflow: 'hidden' }}>
                  <Image src="https://images.unsplash.com/photo-1485178575877-1a13bf489dfe?w=400&h=150&fit=crop" alt="" fill className="object-cover" />
                </div>
              </div>
            </div>

            {/* 5. Light Purple Stats - Far Right */}
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
                <div style={{ fontSize: '11px', color: '#3D1B5C', marginBottom: '28px', fontWeight: '500' }}>@Alex Carter</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <div style={{ fontSize: '22px', fontWeight: '700', color: '#000' }}>Editorial</div>
                    <div style={{ fontSize: '10px', color: 'rgba(0,0,0,0.5)', marginTop: '4px' }}>24</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '22px', fontWeight: '700', color: '#000' }}>Commercial</div>
                    <div style={{ fontSize: '10px', color: 'rgba(0,0,0,0.5)', marginTop: '4px' }}>22</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '22px', fontWeight: '700', color: '#000' }}>Personal</div>
                    <div style={{ fontSize: '10px', color: 'rgba(0,0,0,0.5)', marginTop: '4px' }}>16</div>
                  </div>
                </div>
              </div>

              <div className="absolute" style={{ bottom: '0', left: '0', right: '0', height: '130px', borderBottomLeftRadius: '28px', overflow: 'hidden' }}>
                <Image src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=250&h=200&fit=crop" alt="" fill className="object-cover" />
                <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}></div>
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', color: '#fff', fontSize: '19px', fontWeight: '700' }}>Editorial</div>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
