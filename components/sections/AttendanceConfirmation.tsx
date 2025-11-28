import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import {
  Phone,
  Heart,
  Sparkles,
  User,
  MessageCircle,
  Users,
  CheckCircle,
} from "lucide-react";
import { quinceMainData } from "@/components/sections/data/main-data";
import BackgroundCarrousel from "./BackgroundCarrousel";

const AttendanceConfirmation = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    numeroInvitados: 1,
    confirmacion: "si", // 'si' o 'no'
    mensaje: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPopupModal, setShowPopupModal] = useState(false);

  const { attendance, event } = quinceMainData;
  const parents = event.parents;

  // Número de WhatsApp de destino
  const whatsappNumber = attendance.whatsappNumber;

  // IntersectionObserver para animaciones escalonadas
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

  // Función para detectar si los pop-ups están bloqueados
  const checkPopupBlocked = () => {
    try {
      const popup = window.open('', '', 'width=1,height=1');
      if (popup && !popup.closed) {
        popup.close();
        return false; // No bloqueado
      }
      return true; // Bloqueado
    } catch {
      return true; // Error = bloqueado
    }
  };

  // Función para detectar dispositivo simplificada
  const getDeviceAndBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    
    return {
      isMobile,
      isIOS,
      isAndroid,
      userAgent,
    };
  };

  // Función para obtener instrucciones simplificadas
  const getBrowserInstructions = () => {
    const deviceInfo = getDeviceAndBrowserInfo();
    
    // Para móviles: siempre mostrar opción de copiar (más simple)
    if (deviceInfo.isMobile) {
      return {
        title: "📱 Dispositivo Móvil",
        message: "¡No te preocupes! Te ayudamos a enviar tu confirmación:",
        showCopyOption: true
      };
    }
    
    // Para desktop: instrucción simple
    return {
      title: "🖥️ Computadora",
      message: "Para abrir WhatsApp automáticamente, permite las ventanas emergentes en tu navegador.",
      showCopyOption: true
    };
  };

  // Función para copiar mensaje al portapapeles (simplificada)
  const copyMessageToClipboard = async () => {
    if (!formData.nombre.trim()) {
      alert("Por favor ingresa tu nombre primero");
      return;
    }

    const mensaje = buildWhatsAppMessage();

    try {
      await navigator.clipboard.writeText(mensaje);
      alert("✅ ¡Mensaje copiado! Ahora abre WhatsApp y envíalo a:\n+52 1 871 124 9363");
      setShowPopupModal(false);
      
      // Procesar confirmación automática en backend
      await processBackendConfirmation();
      handleSuccessState();
    } catch (error) {
      // Fallback si no funciona clipboard API
      prompt("Copia este mensaje y envíalo por WhatsApp:", mensaje);
      setShowPopupModal(false);
      await processBackendConfirmation();
      handleSuccessState();
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "numeroInvitados" ? parseInt(value) || 1 : value,
    }));
  };

  const handleConfirmAttendance = async (e: React.FormEvent) => {
    e.preventDefault();

    // Para móviles: intentar primero el intent nativo de WhatsApp
    const deviceInfo = getDeviceAndBrowserInfo();
    if (deviceInfo.isMobile) {
      await processConfirmationWithNativeIntent();
    } else {
      // Para desktop: verificar pop-ups bloqueados
      if (checkPopupBlocked()) {
        setShowPopupModal(true);
        return;
      }
      await processConfirmation();
    }
  };

  // Nueva función optimizada para móviles con intent nativo
  const processConfirmationWithNativeIntent = async () => {
    if (!formData.nombre.trim()) {
      alert("Por favor ingresa tu nombre");
      return;
    }

    setIsSubmitting(true);

    // Construir mensaje (igual que antes)
    const mensaje = buildWhatsAppMessage();
    
    // Procesar confirmación en backend primero
    await processBackendConfirmation();

    // Intent nativo para móviles (funciona sin pop-ups)
    const mensajeCodificado = encodeURIComponent(mensaje);
    const whatsappIntent = `whatsapp://send?phone=${whatsappNumber}&text=${mensajeCodificado}`;
    const whatsappWeb = `https://wa.me/${whatsappNumber}?text=${mensajeCodificado}`;

    console.log("📱 Intentando abrir WhatsApp nativo...");

    try {
      // Intentar intent nativo primero
      window.location.href = whatsappIntent;
      
      // Fallback a WhatsApp Web después de 2 segundos si no se abre la app
      setTimeout(() => {
        window.open(whatsappWeb, '_blank');
      }, 2000);

      handleSuccessState();
    } catch (error) {
      console.log("⚠️ Intent nativo falló, usando fallback...");
      // Fallback a copiar mensaje
      setShowPopupModal(true);
      setIsSubmitting(false);
    }
  };

  // Función helper para construir mensaje
  const buildWhatsAppMessage = () => {
    const confirmacionTexto = formData.confirmacion === "si" 
      ? "✅ ¡Confirmo mi asistencia!" 
      : "❌ No podré asistir";

    const invitadosTexto = formData.numeroInvitados === 1 
      ? "1 persona" 
      : `${formData.numeroInvitados} personas`;

    return `🎉 *CONFIRMACIÓN DE ASISTENCIA* 🎉

👤 *Nombre:* ${formData.nombre}
${formData.telefono ? `📱 *Teléfono:* ${formData.telefono}` : ""}

${confirmacionTexto}
👥 *Número de invitados:* ${invitadosTexto}

${formData.mensaje ? `💌 *Mensaje especial:*\n${formData.mensaje}` : ""}

¡Gracias por responder! 💖✨`;
  };

  // Función helper para procesar backend
  const processBackendConfirmation = async () => {
    try {
      const confirmationData = {
        name: formData.nombre.trim(),
        numberOfGuests: formData.numeroInvitados,
        willAttend: formData.confirmacion === "si",
        comments: formData.mensaje?.trim() || undefined,
        phone: formData.telefono?.trim() || undefined,
      };

      console.log("🎯 Enviando confirmación automática...", confirmationData);

      const response = await fetch("/api/guests/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(confirmationData),
      });

      const result = await response.json();

      if (result.success) {
        console.log("🎯 Confirmación procesada exitosamente:", {
          action: result.action,
          guest: result.guest.name,
          willAttend: confirmationData.willAttend,
          numberOfGuests: confirmationData.numberOfGuests,
        });
      }
    } catch (error) {
      console.error("❌ Error procesando confirmación automática:", error);
    }
  };

  // Función helper para estado de éxito
  const handleSuccessState = () => {
    setShowSuccess(true);
    setIsSubmitting(false);

    setTimeout(() => {
      setFormData({
        nombre: "",
        telefono: "",
        numeroInvitados: 1,
        confirmacion: "si",
        mensaje: "",
      });
      setShowSuccess(false);
    }, 3000);
  };

  const processConfirmation = async () => {
    // Validación simple
    if (!formData.nombre.trim()) {
      alert("Por favor ingresa tu nombre");
      return;
    }

    setIsSubmitting(true);

    const mensaje = buildWhatsAppMessage();
    await processBackendConfirmation();

    // Crear URL de WhatsApp para desktop
    const mensajeCodificado = encodeURIComponent(mensaje);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${mensajeCodificado}`;

    console.log("📱 Abriendo WhatsApp...", whatsappUrl);

    // Abrir WhatsApp (sin delay innecesario)
    const whatsappWindow = window.open(whatsappUrl, "_blank");

    if (whatsappWindow) {
      console.log("✅ WhatsApp abierto exitosamente");
      handleSuccessState();
    } else {
      console.error("❌ No se pudo abrir WhatsApp - posible bloqueador de pop-ups");
      
      // Mostrar modal simplificado para copiar
      setShowPopupModal(true);
      setIsSubmitting(false);
    }
  };

  // Componente Modal simplificado para Pop-up Blocker
  const PopupBlockerModal = () => {
    const instructions = getBrowserInstructions();
    const deviceInfo = getDeviceAndBrowserInfo();
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div 
          className="bg-white p-6 rounded-3xl max-w-md w-full text-center shadow-2xl border-2 max-h-[90vh] overflow-y-auto"
          style={{
            background: "linear-gradient(135deg, rgba(255, 179, 217, 0.15) 0%, rgba(248, 246, 240, 0.98) 25%, rgba(230, 217, 255, 0.15) 50%, rgba(255, 242, 204, 0.2) 75%, rgba(253, 252, 252, 0.98) 100%)",
            borderImage: "linear-gradient(45deg, var(--color-aurora-oro), var(--color-aurora-rosa), var(--color-aurora-lavanda)) 1",
          }}
        >
          {/* Ícono explicativo */}
          <div className="text-5xl mb-4">💌</div>
          
          <h3 
            className="text-xl font-bold mb-3"
            style={{ color: "var(--color-aurora-lavanda)" }}
          >
            {instructions.title}
          </h3>
          
          <p 
            className="text-base mb-6 leading-relaxed"
            style={{ color: "var(--color-aurora-rosa)" }}
          >
            {instructions.message}
          </p>
          
          {/* Botón principal: Copiar mensaje */}
          <div className="mb-4">
            <button
              onClick={copyMessageToClipboard}
              className="w-full px-6 py-4 rounded-2xl font-medium transition-all duration-300 hover:opacity-90 shadow-lg text-lg"
              style={{
                background: "linear-gradient(135deg, #10B981, #059669)",
                color: "white"
              }}
            >
              📋 Copiar mensaje y abrir WhatsApp
            </button>
            <p className="text-sm mt-2 opacity-75" style={{ color: "var(--color-aurora-lavanda)" }}>
              📱 WhatsApp: +52 1 871 124 9363
            </p>
          </div>
          
          {/* Botón secundario para desktop: Intentar de nuevo */}
          {!deviceInfo.isMobile && (
            <div className="mb-4">
              <button 
                onClick={() => {
                  setShowPopupModal(false);
                  processConfirmation();
                }}
                className="w-full px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:opacity-90 shadow-lg border-2"
                style={{
                  background: "linear-gradient(135deg, var(--color-aurora-rosa), var(--color-aurora-lavanda))",
                  color: "white",
                  borderColor: "rgba(255, 179, 217, 0.3)"
                }}
              >
                🔄 Ya permití pop-ups, intentar de nuevo
              </button>
            </div>
          )}
          
          {/* Botón cancelar */}
          <button 
            onClick={() => setShowPopupModal(false)}
            className="w-full px-6 py-2 rounded-2xl font-medium transition-all duration-300 hover:opacity-80 text-sm"
            style={{
              backgroundColor: "rgba(156, 163, 175, 0.6)",
              color: "white"
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      style={{
        /* backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url('${parents.backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat', */
        position: 'relative',
      }}
      className="relative py-20 px-4"
    >

      {/*<BackgroundCarrousel images={attendance.images} />*/}

      

      <div className="max-w-2xl mx-auto relative bg-slate-300 bg-opacity-30 rounded-3xl">
        <div
          className="rounded-3xl p-10 shadow-2xl border-2 relative overflow-hidden"
          
        >
          {/* Shimmer effect decorativo */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-aurora-oro to-transparent animate-vip-shimmer-aurora opacity-60"></div>

          {/* Header con icono y título */}
          <div className="text-center mb-8">
            <div
              className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-lg transition-all duration-1000 ${
                isVisible 
                  ? 'opacity-100 scale-100 animate-vip-pulse-aurora' 
                  : 'opacity-0 scale-50'
              }`}
              style={{
                background:
                  "linear-gradient(135deg, var(--color-aurora-rosa), var(--color-aurora-lavanda))",
                transitionDelay: '0ms'
              }}
            >
              <Heart className="w-10 h-10 text-white" />
            </div>

            <h3
              className={`text-4xl font-main-text font-bold mb-4 leading-tight text-purple-500 transition-all duration-1000 delay-1000 ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 -translate-y-8'
              }`}
              style={{
                background:
                  "linear-gradient(135deg, var(--color-aurora-lavanda), var(--color-aurora-rosa))",
                WebkitBackgroundClip: "text",
                //WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              💌 Confirma tu Asistencia
            </h3>

            <p
              className={`text-xl text-amber-900 bg-slate-300 bg-opacity-60 rounded-2xl p-6 leading-relaxed max-w-lg mx-auto transition-all duration-1000 delay-1000 ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 -translate-y-8'
              }`}
            
            >
              ¿Nos acompañarás en este día tan especial?
              <br />
              <span className="font-medium">
                Confirma tu asistencia y comparte este momento único
              </span>
            </p>
          </div>

          {/* Formulario mejorado */}
          <form onSubmit={handleConfirmAttendance} className="space-y-6">
            {/* Mensaje de éxito */}
            {showSuccess && (
              <div
                className="text-center p-4 rounded-2xl mb-6 animate-pulse"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255, 179, 217, 0.2), rgba(230, 217, 255, 0.2))",
                  border: "2px solid var(--color-aurora-rosa)",
                }}
              >
                <div className="text-2xl mb-2">✅ ¡Confirmación Enviada!</div>
                <p style={{ color: "var(--color-aurora-lavanda)" }}>
                  WhatsApp se abrirá automáticamente con tu mensaje de
                  confirmación
                </p>
              </div>
            )}

            {/* Campo Nombre */}
            <div className={`relative group transition-all duration-1000 delay-2000 ${
              isVisible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-12'
            }`}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-aurora-lavanda opacity-70" />
              </div>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Tu nombre completo"
                required
                disabled={isSubmitting}
                className="w-full text-black pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-3000 focus:outline-none focus:ring-0 text-lg placeholder-opacity-60 disabled:opacity-50"
                style={{
                  background: "rgba(253, 252, 252, 0.8)",
                  borderColor: "rgba(255, 242, 204, 0.4)",
                  //color: "var(--color-aurora-lavanda)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--color-aurora-rosa)";
                  e.target.style.boxShadow =
                    "0 0 20px rgba(255, 179, 217, 0.3)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 242, 204, 0.4)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Campo Teléfono */}
            <div className={`relative group transition-all duration-1000 delay-3000 ${
              isVisible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-12'
            }`}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-aurora-lavanda opacity-70" />
              </div>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                placeholder="Tu número de teléfono"
                disabled={isSubmitting}
                className="w-full text-black pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-3000 focus:outline-none focus:ring-0 text-lg placeholder-opacity-60 disabled:opacity-50"
                style={{
                  background: "rgba(253, 252, 252, 0.8)",
                  borderColor: "rgba(255, 242, 204, 0.4)",
                  //color: "var(--color-aurora-lavanda)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--color-aurora-rosa)";
                  e.target.style.boxShadow =
                    "0 0 20px rgba(255, 179, 217, 0.3)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 242, 204, 0.4)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Campo Confirmación de Asistencia */}
            <div className={`relative group transition-all duration-1000 delay-4000 ${
              isVisible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-12'
            }`}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <CheckCircle className="h-5 w-5 text-aurora-lavanda opacity-70" />
              </div>
              <select
                name="confirmacion"
                value={formData.confirmacion}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full text-black pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-3000 focus:outline-none focus:ring-0 text-lg disabled:opacity-50 appearance-none cursor-pointer"
                style={{
                  background: "rgba(253, 252, 252, 0.8)",
                  borderColor: "rgba(255, 242, 204, 0.4)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--color-aurora-rosa)";
                  e.target.style.boxShadow =
                    "0 0 20px rgba(255, 179, 217, 0.3)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 242, 204, 0.4)";
                  e.target.style.boxShadow = "none";
                }}
              >
                <option value="si">✅ Sí, confirmo mi asistencia</option>
                <option value="no">❌ No podré asistir</option>
              </select>
            </div>

            {/* Campo Número de Invitados */}
            <div className={`relative group transition-all duration-1000 delay-5000 ${
              isVisible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-12'
            }`}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-aurora-lavanda opacity-70" />
              </div>
              <select
                name="numeroInvitados"
                value={formData.numeroInvitados}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full text-black pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-3000 focus:outline-none focus:ring-0 text-lg disabled:opacity-50 appearance-none cursor-pointer"
                style={{
                  background: "rgba(253, 252, 252, 0.8)",
                  borderColor: "rgba(255, 242, 204, 0.4)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--color-aurora-rosa)";
                  e.target.style.boxShadow =
                    "0 0 20px rgba(255, 179, 217, 0.3)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 242, 204, 0.4)";
                  e.target.style.boxShadow = "none";
                }}
              >
                <option value={1}>1 persona</option>
                <option value={2}>2 personas</option>
                <option value={3}>3 personas</option>
                <option value={4}>4 personas</option>
                <option value={5}>5 personas</option>
                <option value={6}>6 personas</option>
                <option value={7}>7 personas</option>
                <option value={8}>8 personas</option>
                <option value={9}>9 personas</option>
                <option value={10}>10 personas</option>

              </select>
            </div>

            {/* Campo Mensaje */}
            <div className={`relative group transition-all duration-1000 delay-6000 ${
              isVisible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-12'
            }`}>
              <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
                <MessageCircle className="h-5 w-5 text-aurora-lavanda opacity-70" />
              </div>
              <textarea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleInputChange}
                placeholder="Mensaje especial (opcional)..."
                rows={4}
                disabled={isSubmitting}
                className="w-full text-black pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-3000 focus:outline-none focus:ring-0 text-lg placeholder-opacity-60 resize-none disabled:opacity-50"
                style={{
                  background: "rgba(253, 252, 252, 0.8)",
                  borderColor: "rgba(255, 242, 204, 0.4)",
                  //color: "var(--color-aurora-lavanda)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--color-aurora-rosa)";
                  e.target.style.boxShadow =
                    "0 0 20px rgba(255, 179, 217, 0.3)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 242, 204, 0.4)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Botón de confirmación mejorado */}
            <div className={`pt-4 text-center transition-all duration-1000 delay-7000 ${
              isVisible 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-75'
            }`}>
              <Button
                size="lg"
                type="submit"
                disabled={isSubmitting || showSuccess}
                className="relative overflow-hidden text-white rounded-full py-8 px-8 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 text-lg font-semibold group min-w-[200px] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                style={{
                  background: showSuccess
                    ? "linear-gradient(135deg, #4ade80, #22c55e, #16a34a)"
                    : "linear-gradient(135deg, #aaa 0%, #bbb 50%, #ccc 100%)",
                  border: "2px solid rgba(255, 242, 204, 0.5)",
                }}
              >
                {/* Efecto shimmer en el botón */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-3000"></div>

                <div className="relative flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Preparando mensaje...
                    </>
                  ) : showSuccess ? (
                    <>
                      <span className="text-2xl mr-2">✅</span>
                      <span>¡Enviado a WhatsApp!</span>
                    </>
                  ) : (
                    <>
                      <Phone className="w-5 h-5 mr-3 group-hover:animate-bounce" />
                      <h6 className="text-purple-700 flex flex-col md:flex-row gap-2 items-center justify-center">
                        <span>✨ Confirmar</span>
                        <span>Asistencia</span>
                      </h6>
                    </>
                  )}
                </div>
              </Button>

              {/* Texto informativo debajo del botón */}
              <p className={`mt-4 text-sm opacity-75 text-pink-500 bg-emerald-200 bg-opacity-50 p-4 rounded-xl transition-all duration-1000 delay-8000 ${
                isVisible 
                  ? 'opacity-75 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}>
                {showSuccess
                  ? "¡Gracias por confirmar! Te esperamos en esta celebración especial 🎉"
                  : "Al confirmar, recibirás todos los detalles por WhatsApp 💌"}
              </p>
            </div>
          </form>
        </div>
      </div>
      
      {/* Modal para Pop-up Blocker */}
      {showPopupModal && <PopupBlockerModal />}
    </section>
  );
};

export default AttendanceConfirmation;
