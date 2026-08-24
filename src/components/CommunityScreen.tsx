'use client';

import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Users,
  Send,
  RefreshCw,
  Smile,
  CheckCheck,
  Lock,
  Edit3,
  X,
  Check,
  Sparkles
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export interface ChatMessage {
  id: string;
  authorAlias: string;
  authorColor: string;
  channel: 'general' | 'victorias' | 'consejos' | 'animo';
  content: string;
  timestamp: string;
  isMe?: boolean;
  reactions: {
    understanding: number;
    encouragement: number;
    inspiring: number;
    hug: number;
  };
  userReactions?: string[];
}

interface CommunityScreenProps {
  onBack: () => void;
  onNav: (screen: string) => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    authorAlias: 'ValienteEnRuta',
    authorColor: '#e542a3',
    channel: 'victorias',
    content: '¡Buenas a todos! Hoy he logrado ir al supermercado solo y hacer la compra sin salir corriendo. Respiré en 4-7-8 antes de entrar y lo superé 💪✨',
    timestamp: '20:05',
    reactions: { understanding: 18, encouragement: 32, inspiring: 24, hug: 15 },
    userReactions: [],
  },
  {
    id: 'msg-2',
    authorAlias: 'CalmaPasitoAPaso',
    authorColor: '#00a884',
    channel: 'general',
    content: '¡Enhorabuena @ValienteEnRuta! Qué gran victoria. Celebrar cada paso es fundamental. 🙌',
    timestamp: '20:11',
    reactions: { understanding: 12, encouragement: 19, inspiring: 10, hug: 9 },
    userReactions: [],
  },
  {
    id: 'msg-3',
    authorAlias: 'MenteEnPaz',
    authorColor: '#53bdeb',
    channel: 'consejos',
    content: 'Un truco que me salva cuando empieza la presión en el pecho: toco agua muy fría en las manos y cuento 5 cosas azules en la habitación. El grounding rompe la espiral al instante. 🧊',
    timestamp: '20:18',
    reactions: { understanding: 25, encouragement: 14, inspiring: 38, hug: 11 },
    userReactions: [],
  },
  {
    id: 'msg-4',
    authorAlias: 'EsperanzaHoy',
    authorColor: '#f59e0b',
    channel: 'animo',
    content: 'Hoy me cuesta un poquito más concentrarme por la tensión. Sé que es solo ansiedad y pasará, pero reconforta poder leer la buena energía que hay aquí. Ánimo a quienes estéis igual 🤍',
    timestamp: '20:25',
    reactions: { understanding: 34, encouragement: 41, inspiring: 12, hug: 45 },
    userReactions: [],
  },
];

export default function CommunityScreen({ onBack, onNav }: CommunityScreenProps) {
  const [activeChannel, setActiveChannel] = useState<'todos' | 'general' | 'victorias' | 'consejos' | 'animo'>('todos');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputContent, setInputContent] = useState('');
  const [userAlias, setUserAlias] = useState('');
  
  // Custom Alias Modal State
  const [isAliasModalOpen, setIsAliasModalOpen] = useState(false);
  const [customAliasInput, setCustomAliasInput] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Generate random alias
  const generateAlias = () => {
    const prefixes = ['Calma', 'Valiente', 'Mente', 'PasoA', 'Sereno', 'Esperanza', 'Luz', 'Ruta'];
    const suffixes = ['EnPaz', 'Superando', 'Sereno', 'Paso', 'EnRuta', 'Hoy', 'Fuerte'];
    const randomP = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomS = suffixes[Math.floor(Math.random() * suffixes.length)];
    const num = Math.floor(10 + Math.random() * 89);
    return `${randomP}${randomS}${num}`;
  };

  // Format date time
  const formatTime = (isoString?: string) => {
    if (!isoString) {
      const now = new Date();
      return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '20:30';
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  // Load alias and Supabase messages
  useEffect(() => {
    let savedAlias = localStorage.getItem('ansioff_user_alias');
    if (!savedAlias) {
      savedAlias = generateAlias();
      localStorage.setItem('ansioff_user_alias', savedAlias);
    }
    setUserAlias(savedAlias);

    // Initial local cache load
    try {
      const savedMsgs = localStorage.getItem('ansioff_chat_community_messages');
      if (savedMsgs) {
        setMessages(JSON.parse(savedMsgs));
      } else {
        setMessages(INITIAL_MESSAGES);
      }
    } catch {
      setMessages(INITIAL_MESSAGES);
    }

    // Supabase Fetch & Realtime Subscription
    const fetchSupabaseMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('community_messages')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(100);

        if (!error && data && data.length > 0) {
          const remoteFormatted: ChatMessage[] = data.map((item: any) => ({
            id: item.id || `remote-${Math.random()}`,
            authorAlias: item.author_alias || 'Anónimo',
            authorColor: item.author_color || '#00a884',
            channel: item.channel || 'general',
            content: item.content,
            timestamp: formatTime(item.created_at),
            isMe: item.author_alias === savedAlias,
            reactions: item.reactions || { understanding: 0, encouragement: 1, inspiring: 0, hug: 1 },
            userReactions: [],
          }));
          setMessages(remoteFormatted);
          localStorage.setItem('ansioff_chat_community_messages', JSON.stringify(remoteFormatted));
        }
      } catch (e) {
        console.warn('Supabase fetch community messages skipped:', e);
      }
    };

    fetchSupabaseMessages();

    // Subscribe to real-time additions
    const channel = supabase
      .channel('public:community_messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'community_messages' },
        (payload) => {
          const item = payload.new;
          if (!item) return;

          const incomingMsg: ChatMessage = {
            id: item.id || `msg-${Date.now()}`,
            authorAlias: item.author_alias || 'Anónimo',
            authorColor: item.author_color || '#00a884',
            channel: item.channel || 'general',
            content: item.content,
            timestamp: formatTime(item.created_at),
            isMe: item.author_alias === savedAlias,
            reactions: item.reactions || { understanding: 0, encouragement: 1, inspiring: 0, hug: 1 },
            userReactions: [],
          };

          setMessages((prev) => {
            if (prev.some((m) => m.id === incomingMsg.id)) return prev;
            const updated = [...prev, incomingMsg];
            localStorage.setItem('ansioff_chat_community_messages', JSON.stringify(updated));
            return updated;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChannel]);

  const saveMessagesLocally = (updated: ChatMessage[]) => {
    setMessages(updated);
    localStorage.setItem('ansioff_chat_community_messages', JSON.stringify(updated));
  };

  // Open Custom Alias Modal
  const handleOpenAliasModal = () => {
    setCustomAliasInput(userAlias);
    setIsAliasModalOpen(true);
  };

  // Save Custom Alias
  const handleSaveCustomAlias = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = customAliasInput.trim().replace(/^@/, '');
    if (clean) {
      setUserAlias(clean);
      localStorage.setItem('ansioff_user_alias', clean);
    }
    setIsAliasModalOpen(false);
  };

  // Generate Random Alias inside modal
  const handleGenerateRandomInsideModal = () => {
    const next = generateAlias();
    setCustomAliasInput(next);
  };

  // Send message handler
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputContent.trim()) return;

    const colors = ['#e542a3', '#00a884', '#53bdeb', '#f59e0b', '#a855f7'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const selectedChannel = activeChannel === 'todos' ? 'general' : activeChannel;
    const textToSend = inputContent.trim();
    const tempId = `msg-${Date.now()}`;

    const newMsg: ChatMessage = {
      id: tempId,
      authorAlias: userAlias || 'Tú',
      authorColor: randomColor,
      channel: selectedChannel,
      content: textToSend,
      timestamp: timeStr,
      isMe: true,
      reactions: { understanding: 0, encouragement: 1, inspiring: 0, hug: 1 },
      userReactions: [],
    };

    // Optimistic UI update
    saveMessagesLocally([...messages, newMsg]);
    setInputContent('');

    // Remote insert to Supabase
    try {
      await supabase.from('community_messages').insert({
        author_alias: userAlias || 'Anónimo',
        author_color: randomColor,
        channel: selectedChannel,
        content: textToSend,
        reactions: { understanding: 0, encouragement: 1, inspiring: 0, hug: 1 },
        created_at: now.toISOString(),
      });
    } catch (err) {
      console.warn('Supabase remote message insert fallback:', err);
    }
  };

  // Reaction toggle
  const handleReaction = async (msgId: string, reactionKey: keyof ChatMessage['reactions']) => {
    const updated = messages.map((m) => {
      if (m.id === msgId) {
        const userReactions = m.userReactions || [];
        const hasReacted = userReactions.includes(reactionKey);

        const newReactions = { ...m.reactions };
        let newReqList = [...userReactions];

        if (hasReacted) {
          newReactions[reactionKey] = Math.max(0, newReactions[reactionKey] - 1);
          newReqList = newReqList.filter((r) => r !== reactionKey);
        } else {
          newReactions[reactionKey] += 1;
          newReqList.push(reactionKey);
        }

        return { ...m, reactions: newReactions, userReactions: newReqList };
      }
      return m;
    });

    saveMessagesLocally(updated);

    const targetMsg = updated.find((m) => m.id === msgId);
    if (targetMsg && !msgId.startsWith('msg-') && !msgId.startsWith('remote-')) {
      try {
        await supabase
          .from('community_messages')
          .update({ reactions: targetMsg.reactions })
          .eq('id', msgId);
      } catch (err) {
        console.warn('Supabase reaction update skipped:', err);
      }
    }
  };

  // Filter messages
  const filteredMessages = messages.filter((m) => {
    if (activeChannel === 'todos') return true;
    return m.channel === activeChannel;
  });

  const getChannelTag = (ch: ChatMessage['channel']) => {
    switch (ch) {
      case 'victorias':
        return '🌱 Victoria';
      case 'consejos':
        return '💡 Consejo';
      case 'animo':
        return '🤝 Ánimo';
      default:
        return '💬 General';
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#0b141a] text-[#e9edef] font-sans overflow-hidden">
      {/* Header WhatsApp con estilos inline para MARGEN REAL 100% GARANTIZADO bajo la Isla Dinámica */}
      <header
        style={{
          paddingTop: 'max(64px, calc(env(safe-area-inset-top, 47px) + 16px))',
        }}
        className="bg-[#1f2c34] text-[#e9edef] border-b border-[#222d34] px-3 pb-3 shrink-0 shadow-md"
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              className="p-1.5 hover:bg-[#2a3942] rounded-full transition text-[#8696a0] hover:text-[#e9edef]"
              title="Volver"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Avatar Grupo WhatsApp */}
            <div className="w-9 h-9 rounded-full bg-[#00a884] flex items-center justify-center text-white font-bold text-base shrink-0 shadow">
              <Users className="w-4 h-4" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-semibold text-[#e9edef] leading-tight">Tribu Ansioff</h1>
                <span className="w-2 h-2 rounded-full bg-[#00a884] animate-pulse" />
              </div>
              <p className="text-[10px] text-[#8696a0]">Chat de apoyo 100% anónimo</p>
            </div>
          </div>

          {/* Botón para Cambiar / Escribir Alias */}
          <button
            onClick={handleOpenAliasModal}
            className="px-2.5 py-1 bg-[#2a3942] hover:bg-[#3b4a54] active:scale-95 rounded-lg text-[11px] text-[#00a884] font-medium transition flex items-center gap-1.5 border border-[#3b4a54] shadow-sm cursor-pointer"
            title="Toca para cambiar o escribir tu alias personal"
          >
            <Edit3 className="w-3 h-3 text-[#00a884]" />
            <span>@{userAlias}</span>
          </button>
        </div>
      </header>

      {/* Sub-Header con Selector de Canales estilo WhatsApp Tabs */}
      <div className="bg-[#111b21] border-b border-[#222d34] px-3 py-2 shrink-0">
        <div className="max-w-3xl mx-auto flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'todos', label: '💬 Todos' },
            { id: 'victorias', label: '🌱 Victorias' },
            { id: 'consejos', label: '💡 Consejos' },
            { id: 'animo', label: '🤝 Ánimo' },
          ].map((ch) => {
            const isSel = activeChannel === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id as any)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  isSel
                    ? 'bg-[#00a884] text-white font-semibold shadow'
                    : 'bg-[#202c33] text-[#8696a0] hover:text-[#e9edef] border border-[#2a3942]'
                }`}
              >
                {ch.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Stream (Contenedor flexible con scroll interno) */}
      <main className="flex-1 overflow-y-auto px-3 py-3 space-y-3 max-w-3xl w-full mx-auto pb-6">
        {/* Encriptación / Aviso de Seguridad estilo WhatsApp */}
        <div className="bg-[#182229] border border-[#222d34] rounded-lg p-2 text-center text-[11px] text-[#8696a0] max-w-xs mx-auto shadow-sm flex items-center gap-2 justify-center">
          <Lock className="w-3 h-3 text-[#e5c07b] shrink-0" />
          <span>Chat anónimo. Tu alias actual: <strong>@{userAlias}</strong>.</span>
        </div>

        {/* Mensajes en Burbujas estilo WhatsApp */}
        {filteredMessages.map((msg) => {
          const isMyMsg = msg.isMe || msg.authorAlias === userAlias;

          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[88%] sm:max-w-[75%] ${
                isMyMsg ? 'ml-auto items-end' : 'mr-auto items-start'
              }`}
            >
              {/* Burbuja estilo WhatsApp */}
              <div
                className={`relative px-3 py-2 rounded-lg text-xs sm:text-sm shadow ${
                  isMyMsg
                    ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none'
                    : 'bg-[#202c33] text-[#e9edef] rounded-tl-none border border-[#2a3942]'
                }`}
              >
                {/* Nombre de usuario (Si no es mi mensaje) */}
                {!isMyMsg && (
                  <div className="flex items-center justify-between gap-3 text-[11px] mb-1">
                    <span className="font-semibold" style={{ color: msg.authorColor || '#53bdeb' }}>
                      @{msg.authorAlias}
                    </span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 bg-[#111b21] rounded text-[#8696a0]">
                      {getChannelTag(msg.channel)}
                    </span>
                  </div>
                )}

                {/* Texto del Mensaje */}
                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line pr-10 pb-1">
                  {msg.content}
                </p>

                {/* Timestamp y Checkmarks WhatsApp */}
                <div className="absolute bottom-1 right-2 flex items-center gap-1 text-[9px] text-[#8696a0]">
                  <span>{msg.timestamp}</span>
                  {isMyMsg && <CheckCheck className="w-3 h-3 text-[#53bdeb]" />}
                </div>
              </div>

              {/* Botones de Reacción estilo WhatsApp */}
              <div className="flex flex-wrap gap-1 mt-1 px-1">
                <button
                  onClick={() => handleReaction(msg.id, 'understanding')}
                  className={`px-2 py-0.5 rounded-full text-[10px] border flex items-center gap-1 transition cursor-pointer ${
                    msg.userReactions?.includes('understanding')
                      ? 'bg-[#00a884]/30 border-[#00a884] text-[#00a884] font-bold'
                      : 'bg-[#182229] border-[#2a3942] text-[#8696a0] hover:text-[#e9edef]'
                  }`}
                >
                  <span>🫂</span>
                  <span>{msg.reactions.understanding}</span>
                </button>

                <button
                  onClick={() => handleReaction(msg.id, 'encouragement')}
                  className={`px-2 py-0.5 rounded-full text-[10px] border flex items-center gap-1 transition cursor-pointer ${
                    msg.userReactions?.includes('encouragement')
                      ? 'bg-[#00a884]/30 border-[#00a884] text-[#00a884] font-bold'
                      : 'bg-[#182229] border-[#2a3942] text-[#8696a0] hover:text-[#e9edef]'
                  }`}
                >
                  <span>💪</span>
                  <span>{msg.reactions.encouragement}</span>
                </button>

                <button
                  onClick={() => handleReaction(msg.id, 'inspiring')}
                  className={`px-2 py-0.5 rounded-full text-[10px] border flex items-center gap-1 transition cursor-pointer ${
                    msg.userReactions?.includes('inspiring')
                      ? 'bg-[#00a884]/30 border-[#00a884] text-[#00a884] font-bold'
                      : 'bg-[#182229] border-[#2a3942] text-[#8696a0] hover:text-[#e9edef]'
                  }`}
                >
                  <span>✨</span>
                  <span>{msg.reactions.inspiring}</span>
                </button>

                <button
                  onClick={() => handleReaction(msg.id, 'hug')}
                  className={`px-2 py-0.5 rounded-full text-[10px] border flex items-center gap-1 transition cursor-pointer ${
                    msg.userReactions?.includes('hug')
                      ? 'bg-[#00a884]/30 border-[#00a884] text-[#00a884] font-bold'
                      : 'bg-[#182229] border-[#2a3942] text-[#8696a0] hover:text-[#e9edef]'
                  }`}
                >
                  <span>🤍</span>
                  <span>{msg.reactions.hug}</span>
                </button>
              </div>
            </div>
          );
        })}

        <div ref={chatEndRef} />
      </main>

      {/* BARRA DE ENTRADA DE MENSAJE WHATSAPP EN EL PIE DE PANTALLA (#1f2c34) CON SAFE AREA INSET INLINE */}
      <footer
        style={{
          paddingBottom: 'max(20px, calc(env(safe-area-inset-bottom, 20px) + 8px))',
        }}
        className="bg-[#1f2c34] border-t border-[#222d34] px-3 pt-2.5 shrink-0 shadow-2xl"
      >
        <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex items-center gap-2">
          <div className="flex-1 bg-[#2a3942] rounded-full px-4 py-2 flex items-center gap-2 border border-[#3b4a54]">
            <Smile className="w-5 h-5 text-[#8696a0] shrink-0" />
            <input
              type="text"
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="w-full bg-transparent text-xs sm:text-sm text-[#e9edef] placeholder:text-[#8696a0] focus:outline-none font-normal"
            />
          </div>

          {/* Botón Verde Redondo WhatsApp */}
          <button
            type="submit"
            disabled={!inputContent.trim()}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition shadow-lg shrink-0 cursor-pointer ${
              inputContent.trim()
                ? 'bg-[#00a884] text-white hover:scale-105 active:scale-95'
                : 'bg-[#2a3942] text-[#8696a0]'
            }`}
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </footer>

      {/* MODAL PARA CAMBIAR O ESCRIBIR SEUDÓNIMO / ALIAS ANÓNIMO */}
      {isAliasModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1f2c34] border border-[#2a3942] rounded-2xl w-full max-w-sm p-5 shadow-2xl text-[#e9edef] space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#00a884]" />
                <h3 className="font-semibold text-base text-[#e9edef]">Tu Seudónimo Anónimo</h3>
              </div>
              <button
                onClick={() => setIsAliasModalOpen(false)}
                className="p-1 text-[#8696a0] hover:text-[#e9edef] hover:bg-[#2a3942] rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#8696a0] leading-relaxed">
              Escribe el nombre con el que quieres que te lean los demás miembros de la comunidad en el chat.
            </p>

            <form onSubmit={handleSaveCustomAlias} className="space-y-4">
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-[#00a884] font-semibold text-sm">@</span>
                <input
                  type="text"
                  value={customAliasInput}
                  onChange={(e) => setCustomAliasInput(e.target.value)}
                  placeholder="Ej: MenteEnPaz, Valiente24..."
                  maxLength={20}
                  className="w-full bg-[#111b21] border border-[#3b4a54] focus:border-[#00a884] rounded-xl pl-8 pr-4 py-2.5 text-sm text-[#e9edef] placeholder:text-[#8696a0] focus:outline-none transition"
                  autoFocus
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleGenerateRandomInsideModal}
                  className="flex-1 py-2.5 px-3 bg-[#2a3942] hover:bg-[#3b4a54] rounded-xl text-xs text-[#00a884] font-medium transition flex items-center justify-center gap-1.5 border border-[#3b4a54]"
                >
                  <Sparkles className="w-4 h-4 text-[#00a884]" />
                  <span>Aleatorio</span>
                </button>

                <button
                  type="submit"
                  disabled={!customAliasInput.trim()}
                  className="flex-1 py-2.5 px-3 bg-[#00a884] hover:bg-[#008f70] disabled:bg-[#2a3942] disabled:text-[#8696a0] rounded-xl text-xs text-white font-semibold transition flex items-center justify-center gap-1.5 shadow"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
