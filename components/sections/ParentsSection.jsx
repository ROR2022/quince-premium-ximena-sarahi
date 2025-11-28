// 👨‍👩‍👧‍👦 ParentsSection - Sección de información de padres

import React, {useState, useEffect, useRef, useCallback} from "react";
//import Image from "next/image";
import { quinceMainData } from "@/components/sections/data/main-data";

export default function ParentsSection() {
  //const { parents } = weddingData;
  const { parents, godparents } = quinceMainData.event;
  const sectionRef = useRef(null);
  
  // Estados para animaciones escalonadas
  const [isInView, setIsInView] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [parentsVisible, setParentsVisible] = useState(false);
  const [godparentsVisible, setGodparentsVisible] = useState(false);

  // Hook personalizado para IntersectionObserver
  const useIntersectionObserver = useCallback(() => {
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            // Secuencia de animaciones escalonadas
            setTimeout(() => setMessageVisible(true), 300);
            setTimeout(() => setParentsVisible(true), 700);
            setTimeout(() => setGodparentsVisible(true), 1100);
          } else {
            // Reset cuando sale de vista
            setIsInView(false);
            setMessageVisible(false);
            setParentsVisible(false);
            setGodparentsVisible(false);
          }
        },
        {
          threshold: 0.3,
          rootMargin: '-50px 0px'
        }
      );

      if (sectionRef.current) {
        observer.observe(sectionRef.current);
      }

      return () => observer.disconnect();
    }, []);
  }, []);

  useIntersectionObserver();

  // Función helper para clases de animación
  const getAnimationClass = (isVisible, animationType, delay = '') => {
    const baseClass = 'animate-on-scroll';
    const animClass = isVisible ? `animate-${animationType} ${delay}` : '';
    return `${baseClass} ${animClass}`.trim();
  };
  
  const basicClass="font-main-text text-5xl text-indigo-500 mb-4";
  const completeClass="font-main-text text-5xl text-indigo-500 mb-4 scale-up-center";
  

  return (
    <section 
      ref={sectionRef}
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${parents.backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
      id="parents" 
      className={`py-20 bg-muted/30 ${isInView ? 'bg-parallax' : ''}`}
    >
      {/* Elementos decorativos flotantes */}
      <div className="decorative-element top-10 left-10 animate-float delay-200">
        <span className="text-2xl heart-icon animate-sparkle delay-500">💖</span>
      </div>
      <div className="decorative-element top-20 right-16 animate-float delay-700">
        <span className="text-xl star-icon animate-sparkle delay-300">✨</span>
      </div>
      <div className="decorative-element bottom-20 left-20 animate-float delay-1000">
        <span className="text-xl heart-icon animate-sparkle delay-800">💝</span>
      </div>
      <div className="decorative-element bottom-16 right-10 animate-float delay-400">
        <span className="text-2xl star-icon animate-sparkle delay-600">⭐</span>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            
            <div className="relative p-6 rounded-2xl z-10 text-center space-y-8 py-12 text-white">
              
              {/* Mensaje principal con animación */}
              <div className={getAnimationClass(messageVisible, 'fade-in-up', 'delay-200')}>
                <p className="text-lg italic max-w-2xl mx-auto leading-relaxed text-glow">
                  {parents.message}
                </p>
              </div>

              <div className="space-y-8">
                
                {/* Card de Padres */}
                <div className={`${getAnimationClass(parentsVisible, 'slide-in-left', 'delay-400')} parent-card`}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300">
                    <div className="flex items-center justify-center mb-4">
                      <span className="text-3xl animate-heart-beat mr-2">👨‍👩‍👧</span>
                      <h3 className={parentsVisible ? completeClass : basicClass}>
                        Mis papás
                      </h3>
                      <span className="text-3xl animate-heart-beat ml-2">👨‍👩‍👧</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-lg">👨</span>
                        <p className="text-xl font-medium text-glow">
                          {parents.father}
                        </p>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-lg">👩</span>
                        <p className="text-xl font-medium text-glow">
                          {parents.mother}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card de Padrinos */}
                <div className={`${getAnimationClass(godparentsVisible, 'slide-in-right', 'delay-600')} parent-card`}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300">
                    <div className="flex items-center justify-center mb-4">
                      <span className="text-3xl animate-heart-beat mr-2">🤝</span>
                      <h3 className={godparentsVisible ? completeClass : basicClass}>
                        Mis padrinos
                      </h3>
                      <span className="text-3xl animate-heart-beat ml-2">🤝</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-lg">🤵</span>
                        <p className="text-xl font-medium text-glow">
                          {godparents.godfather}
                        </p>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-lg">👰</span>
                        <p className="text-xl font-medium text-glow">
                          {godparents.godmother}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
