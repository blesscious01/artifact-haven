'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Facebook, Instagram, Mail, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const [links, setLinks] = useState({
    facebook: '#',
    instagram: '#',
    email: 'admin@example.com',
    wa: '#'
  });

  // Fetch settingan global
  useEffect(() => {
    const fetchLinks = async () => {
      const { data } = await supabase.from('settings').select('*').single();
      if (data) {
        setLinks({
          facebook: data.facebook_link || '#',
          instagram: data.instagram_link || '#',
          email: data.contact_email || 'admin@example.com',
          wa: data.contact_wa ? `https://wa.me/${data.contact_wa}` : '#'
        });
      }
    };
    fetchLinks();
  }, []);

  return (
    <footer className="bg-black text-white py-20 rounded-t-[3rem] mt-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          
          {/* Brand */}
          <div className="max-w-sm">
            <h2 className="text-3xl font-black tracking-widest text-cyan-400 mb-6">ARTIFACT HAVEN</h2>
            <p className="text-gray-400 leading-relaxed">
              Your trusted bridge to Japan's finest anime figures and collectibles. 
              Authentic items, curated for true collectors.
            </p>
          </div>

          {/* Links Dinamis */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white">Connect With Us</h3>
            <div className="flex flex-col gap-4">
              <a href={links.facebook} target="_blank" className="flex items-center gap-3 text-gray-400 hover:text-cyan-400 transition-colors">
                <Facebook size={20} /> Facebook Page
              </a>
              <a href={links.wa} target="_blank" className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition-colors">
                <MessageCircle size={20} /> WhatsApp
              </a>
              <a href={`mailto:${links.email}`} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Mail size={20} /> {links.email}
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-right">
            <p className="text-gray-600 text-sm">© 2026 Artifact Haven.</p>
            <p className="text-gray-600 text-sm">All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}