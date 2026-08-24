'use client';

import { useState } from "react";
import {
  ArrowLeft,
  Search,
  Video,
  MapPin,
  BadgeCheck,
  MessageCircle,
  CalendarClock,
  GraduationCap,
  Languages,
  Clock,
  ChevronRight,
  X,
  Star,
  UserCheck,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

import { shareClinicalReportPDF } from '@/utils/exportUtils';
import { Share2 } from 'lucide-react';

export interface Psychologist {
  id: number | string;
  nombre: string;
  titulo: string;
  colegiado: string;
  ubicacion: string;
  disponible: boolean;
  tags: string[];
  bio: string;
  avatarColor: string;
  iniciales: string;
  rating: number;
  reseñas: number;
  precio: string;
  duracion: string;
  idiomas: string[];
  formacion: string[];
  enfoque: string;
  horarios: string[];
  whatsapp?: string;
  bookingUrl?: string;
}

const psicologos: Psychologist[] = [
  {
    id: 1,
    nombre: "Dra. Elena Rostova",
    titulo: "Psicóloga Sanitaria · Especialista TCC",
    colegiado: "Nº M-28491",
    ubicacion: "Madrid / Online",
    disponible: true,
    tags: ["Ansiedad Generalizada", "Ataques de Pánico", "Agorafobia"],
    bio: "Especialista en tratamiento de la ansiedad y trastornos de pánico mediante Terapia Cognitivo-Conductual y exposición gradual guiada.",
    avatarColor: "from-indigo-500 to-purple-600",
    iniciales: "ER",
    rating: 4.9,
    reseñas: 132,
    precio: "60€ / sesión",
    duracion: "50 min",
    idiomas: ["Español", "Inglés", "Ruso"],
    formacion: [
      "Doctora en Psicología Clínica · Universidad Complutense de Madrid",
      "Certificación Oficial en Terapia Cognitivo-Conductual · ISCTCC",
      "Máster en Intervención en Crisis y Ataques de Pánico",
    ],
    enfoque:
      "Mi trabajo se centra en un enfoque estructurado y cercano mediante Terapia Cognitivo-Conductual (TCC). Combinamos reestructuración de pensamientos ansiosos, regulación fisiológica mediante respiración y exposición progresiva. Desde la primera sesión diseñamos un plan claro y medible.",
    horarios: ["Lunes a Viernes: 09:00 - 14:00", "Martes y Jueves: 16:00 - 20:00"],
    whatsapp: "34600000000",
    bookingUrl: "https://calendly.com",
  },
  {
    id: 2,
    nombre: "Lic. Marc Soler",
    titulo: "Psicólogo Clínico · Terapeuta ACT",
    colegiado: "Nº B-19320",
    ubicacion: "Barcelona / Online",
    disponible: true,
    tags: ["Fobia Social", "Pensamientos Rumiativos", "Terapia ACT"],
    bio: "Enfocado en Terapia de Aceptación y Compromiso para aprender a relacionarte de forma saludable con la ansiedad sin paralizar tu día a día.",
    avatarColor: "from-teal-400 to-emerald-600",
    iniciales: "MS",
    rating: 4.8,
    reseñas: 97,
    precio: "55€ / sesión",
    duracion: "45 min",
    idiomas: ["Español", "Catalán"],
    formacion: [
      "Licenciado en Psicología · Universitat de Barcelona",
      "Formación Avanzada en Terapia de Aceptación y Compromiso · Contextual Psychology",
      "Especialista en Mindfulness y Rumiación Cognitiva",
    ],
    enfoque:
      "Utilizo la Terapia ACT (Aceptación y Compromiso) para cambiar la relación con los pensamientos de angustia. En lugar de gastar energía intentando 'eliminar' la ansiedad, trabajamos en herramientas de defusión cognitiva y compromisos de valor para que recuperes el timón de tu vida.",
    horarios: ["Lunes, Miércoles y Viernes: 10:00 - 19:00"],
    whatsapp: "34600000000",
    bookingUrl: "https://calendly.com",
  },
  {
    id: 3,
    nombre: "Dra. Laura Morales",
    titulo: "Psicóloga Sanitaria · Activación Conductual",
    colegiado: "Nº V-31045",
    ubicacion: "Valencia / Online",
    disponible: true,
    tags: ["Depresión", "Apatía", "Activación Conductual", "Ansiedad Comórbida"],
    bio: "Especializada en regulación del estado de ánimo, tratamiento de la depresión y recuperación de la motivación diaria mediante programas de Activación Conductual.",
    avatarColor: "from-amber-400 to-teal-600",
    iniciales: "LM",
    rating: 4.9,
    reseñas: 114,
    precio: "60€ / sesión",
    duracion: "50 min",
    idiomas: ["Español", "Inglés"],
    formacion: [
      "Máster en Psicología General Sanitaria · Universitat de València",
      "Especialista en Activación Conductual para la Depresión · AEPCCC",
      "Investigación en Intervención Dual Ansiedad-Depresión",
    ],
    enfoque:
      "Acompaño a personas que atraviesan desánimo, apatía o ansiedad comórbida mediante Activación Conductual (BA). Diseñamos micro-pasos medibles de placer y logro para romper la parálisis y recuperar el bienestar emocional de forma progresiva.",
    horarios: ["Lunes a Jueves: 10:00 - 20:00"],
    whatsapp: "34600000000",
    bookingUrl: "https://calendly.com",
  },
];

function Avatar({ colors, iniciales }: { colors: string; iniciales: string }) {
  return (
    <div
      className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${colors} text-sm font-semibold text-white shadow-lg shadow-indigo-950/40`}
    >
      {iniciales}
      <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#090D16] bg-emerald-400">
        <BadgeCheck className="h-3.5 w-3.5 text-[#090D16]" strokeWidth={3} />
      </span>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11.5px] font-medium text-slate-300">
      {children}
    </span>
  );
}

function PsicologoCard({ p, onOpen }: { p: Psychologist; onOpen: (p: Psychologist) => void }) {
  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const num = p.whatsapp || "34600000000";
    const msg = encodeURIComponent(`Hola ${p.nombre}, te contacto desde la app Ansioff para solicitar información.`);
    window.open(`https://wa.me/${num}?text=${msg}`, '_blank');
  };

  return (
    <div
      onClick={() => onOpen(p)}
      className="group relative cursor-pointer rounded-3xl border border-white/15 bg-[#121829] p-6 shadow-xl shadow-black/50 transition-all duration-200 hover:border-indigo-400/40 hover:bg-[#161e33]"
    >
      {/* Header Info */}
      <div className="flex items-start gap-4">
        <Avatar colors={p.avatarColor} iniciales={p.iniciales} />

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-[18px] font-medium text-white transition-colors group-hover:text-indigo-200">
              {p.nombre}
            </h3>
            <ShieldCheck className="h-4 w-4 shrink-0 text-indigo-400" />
          </div>
          <p className="mt-0.5 text-[13px] font-medium text-indigo-300">{p.titulo}</p>
          <p className="mt-1 text-[11px] font-mono tracking-wider text-slate-500">
            Col. {p.colegiado}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen(p);
          }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition-colors group-hover:border-indigo-400/40 group-hover:bg-indigo-500/10 group-hover:text-indigo-300"
          title="Ver ficha completa"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Badges row */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12.5px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-indigo-400" />
          {p.ubicacion}
        </span>
        {p.disponible && (
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Online disponible
          </span>
        )}
        <span className="flex items-center gap-1 text-amber-300 font-medium">
          <Star className="h-3.5 w-3.5 fill-amber-300" />
          {p.rating} <span className="text-slate-500 text-[11.5px]">({p.reseñas})</span>
        </span>
      </div>

      {/* Specialties Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        {p.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>

      {/* Short Bio */}
      <p className="mt-4 text-[13.5px] leading-relaxed text-slate-300 line-clamp-2">
        {p.bio}
      </p>

      {/* Action Bar */}
      <div className="mt-5 flex items-center justify-between gap-3 pt-4 border-t border-white/[0.08]">
        <button
          onClick={() => onOpen(p)}
          className="text-[12.5px] font-medium text-indigo-300 hover:text-indigo-200 transition-colors flex items-center gap-1"
        >
          <span>Ver ficha y detalles</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-3.5 py-2 text-[12.5px] font-medium text-emerald-300 transition-colors hover:bg-emerald-400/20 active:scale-[0.98]"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpen(p);
            }}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2 text-[12.5px] font-medium text-white shadow-md shadow-indigo-500/20 transition-all hover:shadow-indigo-500/35 active:scale-[0.98]"
          >
            <CalendarClock className="h-4 w-4" />
            Pedir cita
          </button>
        </div>
      </div>
    </div>
  );
}

function PsicologoDetalleModal({ p, onClose }: { p: Psychologist; onClose: () => void }) {
  const handleWhatsApp = () => {
    const num = p.whatsapp || "34600000000";
    const msg = encodeURIComponent(`Hola ${p.nombre}, te contacto desde la app Ansioff para solicitar información sobre consulta.`);
    window.open(`https://wa.me/${num}?text=${msg}`, '_blank');
  };

  const handleCita = () => {
    const url = p.bookingUrl || "https://calendly.com";
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-[#0B0E17] text-white shadow-2xl">
        {/* Header Modal */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[0.08] bg-[#0B0E17]/95 px-6 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-indigo-300 text-[13px] font-medium">
            <UserCheck className="h-4 w-4" />
            <span>Ficha del Especialista</span>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-slate-300 transition-colors hover:bg-white/[0.1]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 pb-8 pt-6 space-y-6">
          {/* Main Info Box */}
          <div className="flex gap-4">
            <div
              className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${p.avatarColor} text-xl font-semibold text-white shadow-lg shadow-indigo-950/50`}
            >
              {p.iniciales}
            </div>
            <div className="min-w-0 flex-1 pt-1">
              <div className="flex items-center gap-1.5">
                <h2 className="font-serif text-[22px] font-medium leading-tight text-white">
                  {p.nombre}
                </h2>
                <BadgeCheck className="h-4 w-4 shrink-0 text-indigo-400" />
              </div>
              <p className="mt-1 text-[13.5px] font-medium text-indigo-300">
                {p.titulo}
              </p>
              <p className="mt-0.5 text-[11px] font-mono tracking-wider text-slate-500">
                Col. {p.colegiado}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[12.5px] text-amber-300 font-medium">
                <Star className="h-4 w-4 fill-amber-300" />
                <span>{p.rating}</span>
                <span className="text-slate-500 font-normal">
                  ({p.reseñas} reseñas de pacientes)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3 text-center">
              <p className="text-[14px] font-semibold text-white">{p.precio}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">Precio Sesión</p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3 text-center">
              <p className="text-[14px] font-semibold text-white">
                {p.duracion}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">Duración</p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3 text-center">
              <p className="flex items-center justify-center gap-1.5 text-[14px] font-semibold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Online
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                {p.ubicacion.split(" / ")[0]}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h4 className="text-[12px] uppercase tracking-wider font-semibold text-slate-400 mb-2.5">
              Áreas de Especialidad
            </h4>
            <div className="flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </div>

          {/* Enfoque Terapéutico */}
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.04] p-4">
            <h3 className="text-[14px] font-semibold text-indigo-200 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              Enfoque Terapéutico
            </h3>
            <p className="mt-2.5 text-[13.5px] leading-relaxed text-slate-300">
              {p.enfoque}
            </p>
          </div>

          {/* Formación */}
          <div>
            <h3 className="flex items-center gap-2 text-[14px] font-semibold text-white mb-2.5">
              <GraduationCap className="h-4 w-4 text-indigo-400" />
              Formación y Acreditaciones
            </h3>
            <ul className="space-y-2">
              {p.formacion.map((f, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-[13px] leading-relaxed text-slate-300"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Horarios */}
          <div>
            <h3 className="flex items-center gap-2 text-[14px] font-semibold text-white mb-2.5">
              <Clock className="h-4 w-4 text-indigo-400" />
              Horarios de Consulta
            </h3>
            <ul className="space-y-1.5">
              {p.horarios.map((h, i) => (
                <li key={i} className="text-[13px] text-slate-300 flex items-center gap-2">
                  <span className="text-slate-500">•</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>

          {/* Idiomas */}
          <div>
            <h3 className="flex items-center gap-2 text-[14px] font-semibold text-white mb-2.5">
              <Languages className="h-4 w-4 text-indigo-400" />
              Idiomas de Atención
            </h3>
            <div className="flex flex-wrap gap-2">
              {p.idiomas.map((i) => (
                <Tag key={i}>{i}</Tag>
              ))}
            </div>
          </div>

          {/* Botones Acción Modal */}
          <div className="pt-4 flex gap-3 border-t border-white/[0.08]">
            <button
              onClick={handleWhatsApp}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 py-3.5 text-[13.5px] font-semibold text-emerald-300 transition-colors hover:bg-emerald-400/20 active:scale-[0.98]"
            >
              <MessageCircle className="h-4 w-4" />
              Consultar WhatsApp
            </button>
            <button
              onClick={handleCita}
              className="flex flex-[1.4] cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 py-3.5 text-[13.5px] font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-indigo-500/40 active:scale-[0.98]"
            >
              <CalendarClock className="h-4 w-4" />
              Reservar Cita
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PsychologistsScreenProps {
  onBack?: () => void;
}

export default function PsychologistsScreen({ onBack }: PsychologistsScreenProps) {
  const [tab, setTab] = useState("Todos");
  const [query, setQuery] = useState("");
  const [seleccionado, setSeleccionado] = useState<Psychologist | null>(null);
  const tabs = ["Todos", "Consulta Online", "Presencial"];

  const filteredPsicologos = psicologos.filter((p) => {
    const q = query.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.nombre.toLowerCase().includes(q) ||
      p.titulo.toLowerCase().includes(q) ||
      p.ubicacion.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      (p.bio && p.bio.toLowerCase().includes(q)) ||
      (p.enfoque && p.enfoque.toLowerCase().includes(q));

    const matchesTab =
      tab === "Todos" ||
      (tab === "Consulta Online" && p.disponible) ||
      (tab === "Presencial" && !p.ubicacion.toLowerCase().includes("online solo"));

    return matchesSearch && matchesTab;
  });

  return (
    <div className="relative min-h-screen w-full overflow-y-auto bg-[#070A12] text-white">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[120px]" />

      <div className="relative mx-auto max-w-2xl px-6 pb-32 pt-[max(60px,calc(env(safe-area-inset-top,0px)+18px))] flex flex-col">
        {/* 1. Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => onBack?.()}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300 transition-colors hover:bg-white/[0.08]"
            title="Volver"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-serif text-[22px] font-medium leading-tight text-white">
              Psicólogos Colaboradores
            </h1>
            <p className="text-[12px] text-slate-400">Red verificada de profesionales Ansioff</p>
          </div>
        </div>

        {/* 2. Hero Box (Bloque informativo separado) */}
        <div className="w-full mb-8 rounded-3xl border border-indigo-500/25 bg-gradient-to-br from-indigo-500/[0.12] via-purple-500/[0.04] to-transparent p-6 shadow-xl">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-indigo-300 mb-2">
            <BadgeCheck className="h-4 w-4 text-indigo-400" />
            <span>Especialistas Sanitarios Verificados</span>
          </div>
          <h2 className="font-serif text-[24px] font-medium leading-snug text-white mb-3">
            Encuentra tu acompañamiento profesional
          </h2>
          <p className="text-[13.5px] leading-relaxed text-slate-300 mb-5">
            Selección de psicólogos sanitarios y clínicos especializados en regulación emocional, depresión, ataques de pánico y ansiedad.
          </p>

          <button
            onClick={() => shareClinicalReportPDF()}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-3 text-[13.5px] font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all cursor-pointer"
          >
            <Share2 className="h-4 w-4" />
            <span>Compartir mi informe Ansioff con un psicólogo</span>
          </button>
        </div>

        {/* 3. Buscador (Bloque de búsqueda totalmente independiente) */}
        <div className="w-full mb-8">
          <div className="relative flex items-center w-full">
            <Search className="pointer-events-none absolute left-4 h-5 w-5 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por especialista, ciudad o especialidad..."
              className="w-full rounded-2xl border border-white/10 bg-[#121829] py-3.5 pl-12 pr-4 text-[13.5px] text-white placeholder:text-slate-500 outline-none transition-all focus:border-indigo-400/50"
            />
          </div>
        </div>

        {/* 4. Selector de Pestañas (Bloque independiente) */}
        <div className="w-full mb-10 flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          {tabs.map((t) => {
            const active = tab === t;
            const icon =
              t === "Consulta Online" ? (
                <Video className="h-4 w-4" />
              ) : t === "Presencial" ? (
                <MapPin className="h-4 w-4" />
              ) : null;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium transition-all ${
                  active
                    ? "bg-white text-[#070A12] shadow-lg font-semibold"
                    : "border border-white/10 bg-[#070A12] text-slate-300 hover:bg-white/[0.08]"
                }`}
              >
                {icon}
                {t}
              </button>
            );
          })}
        </div>

        {/* 5. Lista de Tarjetas de Psicólogos */}
        <div className="w-full flex flex-col gap-8">
          {filteredPsicologos.length === 0 ? (
            <div className="rounded-3xl border border-white/[0.06] bg-[#121829] p-8 text-center text-slate-400 text-sm">
              No se encontraron psicólogos con ese criterio de búsqueda.
            </div>
          ) : (
            filteredPsicologos.map((p) => (
              <PsicologoCard key={p.id} p={p} onOpen={setSeleccionado} />
            ))
          )}
        </div>
      </div>

      {/* Modal Detail Sheet */}
      {seleccionado && (
        <PsicologoDetalleModal
          p={seleccionado}
          onClose={() => setSeleccionado(null)}
        />
      )}
    </div>
  );
}
