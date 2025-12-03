// 🎁 GiftsSection - Sección de información de regalos

import React, { useState, useEffect, useRef } from "react";
import { Gift } from "lucide-react";
import { quinceMainData } from "@/components/sections/data/main-data";


export default function GiftsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const { event, gifts } = quinceMainData;
  const { parents } = event;
  const { giftsOptions } = gifts;

  // IntersectionObserver para animaciones escalonadas con reactivación
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '50px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        /* backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${parents.backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat', */
        position: 'relative',
      }}
      id="gifts"
      className="py-20"
    >
      

      <div className="container text-white mx-auto px-4 p-6 rounded-2xl">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          {/* Título con animación escalonada */}
          <div className={`transition-all duration-1000 delay-0 ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 -translate-y-12'
          }`}>
            <h2 
              style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
              className="font-main-text text-6xl text-amber-500"
            >
              Regalo
            </h2>
          </div>

          {/* Tarjeta central con animación escalonada */}
          <div className={`transition-all duration-1000 delay-1000 ${
            isVisible 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-75'
          }`}>
            <div className="bg-muted/50 rounded-2xl p-4 max-w-md mx-auto">
              <Gift className="w-16 h-16 text-amber-500 mx-auto mb-2" />
              <h3 
                style={{display:'none'}}
                className="font-script text-3xl text-pink-600 mb-2"
              >
                {gifts.type}
              </h3>
              <p className="text-amber-500 italic text-3xl font-semibold">{gifts.message}</p>
            </div>
          </div>
          {/* Cards de opciones con animaciones escalonadas */}
          <div className="flex flex-wrap justify-center items-center gap-2 mt-2">
            {giftsOptions.map((option, index) => {
              const delays = ['delay-2000', 'delay-3000', 'delay-4000', 'delay-5000', 'delay-6000'];
              const delayClass = delays[index] || 'delay-2000';
              
              return (
                <div 
                  key={option.id} 
                  className={`transition-all duration-1000 ${delayClass} ${
                    isVisible 
                      ? 'opacity-100 translate-x-0' 
                      : `opacity-0 ${index % 2 === 0 ? '-translate-x-12' : 'translate-x-12'}`
                  }`}
                >
                  <div className="bg-white/70 p-6 rounded-2xl w-64 text-black">
                    <h4 className="text-2xl font-semibold italic mb-2 text-amber-500">{option.name}</h4>
                    <p className="text-4xl">{option.icon}</p>
                    <p className=" text-amber-500 mt-2 italic text-2xl font-semibold">
                      {option.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
