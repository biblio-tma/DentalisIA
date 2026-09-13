import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AlertCircle,
  ArrowDown,
  Bot,
  Check,
  Copy,
  Mic,
  Paperclip,
  RefreshCw,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useAnalyse } from "../hooks/AnalyseContext";

/* ============================================================
   CONFIGURATION
   ============================================================ */

const STORAGE_KEY = "dentalis_ai_conversation";

const SUGGESTIONS = [
  "J'ai mal à une dent depuis 3 jours",
  "Pourquoi ma dent me fait mal quand je mange sucré ?",
  "J'ai les gencives qui saignent",
  "J'ai un gonflement au niveau de la joue",
];

/* ============================================================
   UTILITAIRES
   ============================================================ */

const createId = () =>
  `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;

const formatTime = (date) => {
  if (!date) return "";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  return value.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* ============================================================
   MESSAGE INITIAL
   ============================================================ */

const createWelcomeMessage = () => ({
  id: createId(),
  role: "assistant",
  content:
    "Bonjour 👋\n\nJe suis Dentalis IA, votre assistant d'orientation dentaire.\n\nVous pouvez me poser librement vos questions concernant vos symptômes, votre douleur, vos gencives, vos dents ou votre situation dentaire.\n\nDécrivez-moi simplement ce que vous ressentez et je vous aiderai à mieux comprendre la situation.",
  createdAt: new Date().toISOString(),
});

/* ============================================================
   FORMATAGE DU TEXTE IA
   ============================================================ */

function MessageContent({ content }) {
  const lines = String(content || "").split("\n");

  return (
    <div className="space-y-1.5 text-[14px] leading-7 text-slate-700">
      {lines.map((line, index) => {
        if (!line.trim()) {
          return (
            <div
              key={index}
              className="h-1"
            />
          );
        }

        if (
          line.startsWith("•") ||
          line.startsWith("-")
        ) {
          return (
            <div
              key={index}
              className="flex gap-2"
            >
              <span className="font-bold text-[#0A2E61]">
                •
              </span>

              <span>
                {line
                  .replace(/^[-•]\s*/, "")
                  .trim()}
              </span>
            </div>
          );
        }

        return (
          <p key={index}>
            {line}
          </p>
        );
      })}
    </div>
  );
}

/* ============================================================
   MESSAGE UTILISATEUR
   ============================================================ */

function UserBubble({
  message,
}) {
  return (
    <div className="flex justify-end">
      <div className="flex max-w-[88%] items-end gap-2.5 sm:max-w-[72%]">
        <div className="min-w-0">
          <div className="rounded-[22px] rounded-br-md bg-[#0A2E61] px-4 py-3.5 text-white shadow-lg shadow-blue-950/10 sm:px-5">
            {message.image && (
              <div className="mb-3 overflow-hidden rounded-2xl">
                <img
                  src={message.image}
                  alt="Image envoyée"
                  className="max-h-[300px] w-full object-cover"
                />
              </div>
            )}

            <p className="whitespace-pre-line text-[14px] leading-6">
              {message.content}
            </p>
          </div>

          <div className="mt-1.5 text-right">
            <span className="text-[10px] text-slate-400">
              {formatTime(
                message.createdAt
              )}
            </span>
          </div>
        </div>

        <div className="hidden h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm sm:flex">
          <User className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MESSAGE IA
   ============================================================ */

function AssistantBubble({
  message,
  onCopy,
  onRegenerate,
}) {
  const [copied, setCopied] =
    useState(false);

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(
        message.content
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);

      if (onCopy) {
        onCopy(message);
      }
    } catch (error) {
      console.error(
        "Erreur copie :",
        error
      );
    }
  };

  return (
    <div className="group flex items-start gap-3">
      {/* Avatar */}
      <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[15px] bg-gradient-to-br from-[#0A2E61] via-[#104A8D] to-[#1672C8] text-white shadow-lg shadow-blue-900/20">
        <Bot className="h-5 w-5" />

        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#F5F7FB] bg-emerald-500" />
      </div>

      {/* Contenu */}
      <div className="min-w-0 max-w-[88%] sm:max-w-[76%]">
        {/* Nom */}
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-xs font-extrabold text-slate-800">
            Dentalis IA
          </span>

          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#0A2E61]">
            IA
          </span>
        </div>

        {/* Bulle */}
        <div className="rounded-[22px] rounded-tl-md border border-slate-200 bg-white px-4 py-3.5 shadow-sm sm:px-5">
          <MessageContent
            content={
              message.content
            }
          />

          {/* Bloc orientation */}
          {message.orientation && (
            <div className="mt-4 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-slate-50 p-4">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#0A2E61] text-white">
                  <Sparkles className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#0A2E61]">
                    Orientation indicative
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    {message.orientation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Urgence */}
          {message.urgency && (
            <div
              className={`mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold ${
                message.urgency ===
                "urgente"
                  ? "bg-red-50 text-red-700"
                  : message.urgency ===
                    "moderee"
                  ? "bg-amber-50 text-amber-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              <AlertCircle className="h-4 w-4" />

              <span>
                Niveau d'urgence :
                {" "}
                {message.urgency ===
                "urgente"
                  ? "évaluation rapide recommandée"
                  : message.urgency ===
                    "moderee"
                  ? "consultation recommandée"
                  : "surveillance et consultation selon évolution"}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-1.5 flex items-center gap-3 px-1 opacity-0 transition group-hover:opacity-100">
          <span className="text-[10px] text-slate-400">
            {formatTime(
              message.createdAt
            )}
          </span>

          <button
            type="button"
            onClick={copyMessage}
            className="flex items-center gap-1 text-[10px] text-slate-400 transition hover:text-slate-700"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                Copié
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copier
              </>
            )}
          </button>

          {onRegenerate && (
            <button
              type="button"
              onClick={() =>
                onRegenerate(
                  message
                )
              }
              className="flex items-center gap-1 text-[10px] text-slate-400 transition hover:text-slate-700"
            >
              <RefreshCw className="h-3 w-3" />
              Régénérer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   INDICATEUR IA
   ============================================================ */

function TypingBubble() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[15px] bg-gradient-to-br from-[#0A2E61] to-[#1672C8] text-white shadow-lg">
        <Bot className="h-5 w-5" />
      </div>

      <div>
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-xs font-extrabold text-slate-800">
            Dentalis IA
          </span>

          <span className="text-[10px] font-medium text-emerald-600">
            réfléchit...
          </span>
        </div>

        <div className="rounded-[20px] rounded-tl-md border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-bounce rounded-full bg-[#0A2E61]" />

            <span
              className="h-2 w-2 animate-bounce rounded-full bg-[#0A2E61]"
              style={{
                animationDelay:
                  "120ms",
              }}
            />

            <span
              className="h-2 w-2 animate-bounce rounded-full bg-[#0A2E61]"
              style={{
                animationDelay:
                  "240ms",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   COMPOSANT PRINCIPAL
   ============================================================ */

export default function Chat() {
    const {
        profil: patient,
    } = useAnalyse();
  const [messages, setMessages] =
    useState(() => {
      try {
        const saved = null;
        // const saved =
        //   localStorage.getItem(
        //     STORAGE_KEY
        //   );

        if (saved) {
          const parsed =
            JSON.parse(saved);

          if (
            Array.isArray(parsed) &&
            parsed.length
          ) {
            return parsed;
          }
        }
      } catch (error) {
        console.error(
          "Erreur récupération chat :",
          error
        );
      }

      return [
        createWelcomeMessage(),
      ];
    });

  const [input, setInput] =
    useState("");

  const [isTyping, setIsTyping] =
    useState(false);

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [showScrollButton, setShowScrollButton] =
    useState(false);

  const [isListening, setIsListening] =
    useState(false);

  const messagesContainerRef =
    useRef(null);

  const messagesEndRef =
    useRef(null);

  const textareaRef =
    useRef(null);

  const fileInputRef =
    useRef(null);

  /* ==========================================================
     SAUVEGARDE
     ========================================================== */

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(messages)
      );
    } catch (error) {
      console.error(
        "Erreur sauvegarde :",
        error
      );
    }
  }, [messages]);


  /* ==========================================================
     AUTO SCROLL
     ========================================================== */

  const scrollToBottom = (
    smooth = true
  ) => {
    messagesEndRef.current?.scrollIntoView(
      {
        behavior: smooth
          ? "smooth"
          : "auto",
        block: "end",
      }
    );
  };

  useEffect(() => {
    if (!isTyping) {
      scrollToBottom();
    }
  }, [messages, isTyping]);

  /* ==========================================================
     DETECTION SCROLL
     ========================================================== */

  const handleScroll = () => {
    const element =
      messagesContainerRef.current;

    if (!element) return;

    const distance =
      element.scrollHeight -
      element.scrollTop -
      element.clientHeight;

    setShowScrollButton(
      distance > 400
    );
  };

  /* ==========================================================
     AUTO RESIZE TEXTAREA
     ========================================================== */

  useEffect(() => {
    const textarea =
      textareaRef.current;

    if (!textarea) return;

    textarea.style.height =
      "auto";

    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      140
    )}px`;
  }, [input]);

  /* ==========================================================
     SIMULATION IA
     
     À REMPLACER PAR FASTAPI
     ========================================================== */

  const generateAIResponse = (
    question
  ) => {
    const text =
      question.toLowerCase();

    if (
      text.includes("gonflement") ||
      text.includes("gonflé") ||
      text.includes("gonflee") ||
      text.includes("pus") ||
      text.includes("abcès") ||
      text.includes("abces")
    ) {
      return {
        content:
          "Un gonflement autour d'une dent ou la présence de pus peut être associé à une infection dentaire. Il est préférable de faire examiner la zone par un professionnel de santé dentaire.\n\nÉvitez de percer ou de presser vous-même la zone gonflée. Si le gonflement devient important, s'étend vers le visage, l'œil ou le cou, ou si vous avez des difficultés à respirer, avaler ou parler, recherchez une prise en charge urgente.",
        orientation:
          "Les symptômes décrits peuvent nécessiter une évaluation dentaire rapide.",
        urgency:
          "urgente",
      };
    }

    if (
      text.includes("douleur") ||
      text.includes("mal à") ||
      text.includes("mal a") ||
      text.includes("dent me fait")
    ) {
      return {
        content:
          "Une douleur dentaire peut avoir différentes causes : carie, inflammation de la pulpe, problème gingival, traumatisme ou autre affection dentaire.\n\nPour mieux vous orienter, dites-moi où se situe exactement la douleur, depuis quand elle est présente, son intensité sur 10 et si elle apparaît spontanément ou après avoir mangé ou bu.",
        orientation:
          "Une douleur persistante ou importante mérite généralement une évaluation par un professionnel.",
        urgency:
          "moderee",
      };
    }

    if (
      text.includes("saigne") ||
      text.includes("saignement") ||
      text.includes("gencive")
    ) {
      return {
        content:
          "Des gencives qui saignent peuvent notamment être liées à une inflammation gingivale. La fréquence du saignement, son abondance et les autres symptômes associés sont importants pour l'orientation.\n\nPouvez-vous me préciser si le saignement apparaît principalement pendant le brossage ou également spontanément ?",
        orientation:
          "Une consultation dentaire peut être utile pour identifier la cause du saignement et évaluer l'état des gencives.",
        urgency:
          "moderee",
      };
    }

    if (
      text.includes("sucré") ||
      text.includes("sucre") ||
      text.includes("froid") ||
      text.includes("chaud")
    ) {
      return {
        content:
          "Une douleur déclenchée par le sucre, le froid ou le chaud peut avoir plusieurs origines, notamment une sensibilité dentaire ou une atteinte de la dent.\n\nLa durée de la douleur après le contact avec l'aliment ou la boisson est une information particulièrement intéressante.",
        orientation:
          "Une sensibilité répétée mérite d'être évaluée afin d'en déterminer la cause.",
        urgency:
          "moderee",
      };
    }

    if (
      text.includes("fièvre") ||
      text.includes("fievre") ||
      text.includes("température")
    ) {
      return {
        content:
          "La présence de fièvre avec des symptômes dentaires est une information importante. Elle peut être particulièrement préoccupante lorsqu'elle est associée à un gonflement, du pus ou une douleur importante.\n\nSi votre état général se dégrade ou si vous présentez des difficultés à respirer, avaler ou parler, recherchez une prise en charge urgente.",
        orientation:
          "Fièvre associée à des symptômes dentaires : une évaluation professionnelle rapide peut être nécessaire.",
        urgency:
          "urgente",
      };
    }

    return {
      content:
        "Je comprends votre question. Je peux vous aider à analyser les éléments que vous décrivez et à vous orienter.\n\nPour que mon analyse soit plus pertinente, vous pouvez me préciser :\n• Depuis combien de temps avez-vous ce problème ?\n• Où se situe exactement le problème ?\n• Quelle est l'intensité de la douleur sur 10 ?\n• Avez-vous un gonflement, du pus, de la fièvre ou un saignement ?\n• Qu'est-ce qui déclenche ou soulage vos symptômes ?",
      orientation:
        "Cette conversation permet une orientation indicative et ne constitue pas un diagnostic médical.",
      urgency:
        "faible",
    };
  };

  /* ==========================================================
     ENVOYER MESSAGE
     ========================================================== */

  const sendMessage = async (
    forcedMessage = null
  ) => {
    const text =
      forcedMessage !== null
        ? forcedMessage.trim()
        : input.trim();

    if (
      !text &&
      !selectedImage
    ) {
      return;
    }

    const userMessage = {
      id: createId(),
      role: "user",
      content:
        text ||
        "Pouvez-vous examiner cette image ?",
      image: selectedImage,
      createdAt:
        new Date().toISOString(),
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setInput("");
    setSelectedImage(null);
    setIsTyping(true);

    try {

const response = await fetch(
  "http://localhost:8000/analyse/api/chat",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: text,
      history: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      image: selectedImage,
    }),
  }
);

if (!response.ok) {
  throw new Error("Erreur serveur");
}

const data = await response.json();

setMessages((previous) => [
  ...previous,
  {
    id: createId(),
    role: "assistant",
    content: data.message,
    orientation: data.orientation,
    urgency: data.urgence,
    createdAt: new Date().toISOString(),
  },
]);

    } catch (error) {
      console.error(
        "Erreur IA :",
        error
      );

      setMessages((previous) => [
        ...previous,
        {
          id: createId(),
          role: "assistant",
          content:
            "Je rencontre actuellement un problème technique. Veuillez réessayer dans quelques instants.",
          createdAt:
            new Date().toISOString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  /* ==========================================================
     ENTER
     ========================================================== */

  const handleKeyDown = (
    event
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      sendMessage();
    }
  };

  /* ==========================================================
     IMAGE
     ========================================================== */

  const handleImageChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      alert(
        "Veuillez sélectionner une image."
      );

      return;
    }

    if (
      file.size >
      8 * 1024 * 1024
    ) {
      alert(
        "L'image ne doit pas dépasser 8 Mo."
      );

      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      setSelectedImage(
        reader.result
      );
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  };

  /* ==========================================================
     MICRO
     ========================================================== */

  const toggleVoice = () => {
    setIsListening(
      (previous) =>
        !previous
    );

    /*
     * Tu peux brancher ici :
     * - Web Speech API
     * - Whisper
     * - autre service STT
     */

    setTimeout(() => {
      setIsListening(false);
    }, 3000);
  };



  /* ==========================================================
     RÉGÉNÉRER
     ========================================================== */

  const regenerateMessage = (
    message
  ) => {
    const index =
      messages.findIndex(
        (item) =>
          item.id ===
          message.id
      );

    if (index === -1) return;

    const previousUserMessage =
      [...messages]
        .slice(0, index)
        .reverse()
        .find(
          (item) =>
            item.role === "user"
        );

    if (!previousUserMessage) {
      return;
    }

    setIsTyping(true);

    setTimeout(() => {
      const response =
        generateAIResponse(
          previousUserMessage.content
        );

      setMessages((previous) => {
        const copy = [
          ...previous,
        ];

        copy[index] = {
          ...copy[index],
          content:
            response.content,
          orientation:
            response.orientation,
          urgency:
            response.urgency,
          createdAt:
            new Date().toISOString(),
        };

        return copy;
      });

      setIsTyping(false);
    }, 1000);
  };

  /* ==========================================================
     RENDER
     ========================================================== */
return (
<div className="flex h-[calc(100vh-72px)] min-h-0 w-full overflow-hidden bg-[#F5F7FB] text-slate-900">
  <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-100/30 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-cyan-100/20 blur-3xl" />
      </div>

      {/* =====================================================
          HEADER FIXE
      ===================================================== */}
      {/* <header className="relative z-20 flex h-[64px] shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 shadow-sm backdrop-blur-xl sm:px-6">

        <div className="flex min-w-0 items-center gap-3">

          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0A2E61] to-[#1672C8] text-white shadow-md">
            <Bot className="h-[18px] w-[18px]" />

            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-sm font-extrabold text-slate-800">
                Dentalis IA
              </h1>

              <span className="hidden rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-600 sm:inline-flex">
                En ligne
              </span>
            </div>

            <p className="truncate text-[10px] text-slate-400 sm:text-xs">
              Assistant d'orientation dentaire
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />

          <span className="text-[10px] font-semibold text-slate-500">
            Disponible
          </span>
        </div>
      </header> */}

      {/* =====================================================
          ZONE CHAT
      ===================================================== */}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">

        {/* ===================================================
            MESSAGES
            SEULE ZONE QUI SCROLLE
        =================================================== */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="
            relative
            min-h-0
            flex-1
            overflow-x-hidden
            overflow-y-auto
            overscroll-contain
            scroll-smooth
          "
        >

          <div className="mx-auto w-full max-w-6xl px-4 pb-8 pt-7 sm:px-6 sm:pt-9">

            {/* ===============================================
                MESSAGE D'ACCUEIL
            =============================================== */}
            {/* {messages.length <= 1 && ( */}
              <div className="mb-10 text-center">

                <div className="mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-[25px] bg-gradient-to-br from-[#0A2E61] to-[#1672C8] text-white shadow-xl shadow-blue-900/20">
                  <Sparkles className="h-8 w-8" />
                </div>

                <h2 className="text-2xl font-black tracking-tight text-slate-800 sm:text-3xl">
                  Bonjour, {patient?.prenom || ""} {patient?.nom || ""} comment puis-je vous aider ?
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
                  Posez votre question naturellement.
                  Décrivez vos symptômes, votre douleur
                  ou toute autre préoccupation dentaire.
                </p>
              </div>
            {/* )} */}

            {/* ===============================================
                LISTE DES MESSAGES
            =============================================== */}
            <div className="space-y-7">

              {messages.map((message) => {

                if (message.role === "user") {
                  return (
                    <UserBubble
                      key={message.id}
                      message={message}
                    />
                  );
                }

                return (
                  <AssistantBubble
                    key={message.id}
                    message={message}
                    onRegenerate={regenerateMessage}
                  />
                );
              })}

              {isTyping && <TypingBubble />}

              <div
                ref={messagesEndRef}
                className="h-px"
              />

            </div>
          </div>
        </div>

        {/* ===================================================
            BOUTON RETOUR EN BAS
            FIXE DANS LA ZONE CHAT
        =================================================== */}
        {showScrollButton && (
          <button
            type="button"
            onClick={() => scrollToBottom()}
            className="
              absolute
              bottom-[125px]
              right-5
              z-40
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-slate-200
              bg-white
              text-slate-600
              shadow-xl
              transition
              hover:-translate-y-0.5
              hover:text-[#0A2E61]
            "
            aria-label="Retour en bas"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
        )}

        {/* ===================================================
            COMPOSER FIXE
            NE SCROLLE JAMAIS
        =================================================== */}
{/* <div className="relative z-30 shrink-0 px-4 pb-4 pt-3 sm:px-6 sm:pb-5"> */}
  {/* <div
  className="
    rounded-[26px]
    border
    border-slate-200/80
    bg-white
    p-2
    shadow-[0_12px_40px_rgba(15,23,42,0.12)]
    ring-1
    ring-slate-100
    transition-all
    focus-within:border-blue-300
    focus-within:ring-4
    focus-within:ring-blue-50
    focus-within:shadow-[0_15px_45px_rgba(10,46,97,0.15)]
  "
> */}
<div
  className="
    relative
    z-30
    shrink-0
    rounded-t-[24px]
    border
    border-[#0A2E61]
    bg-[#0A2E61]
    px-4
    pb-4
    pt-3
    shadow-[0_-8px_30px_rgba(10,46,97,0.20)]
    sm:px-6
    sm:pb-5
  "
>
          <div className="mx-auto w-full max-w-4xl">

            {/* APERÇU IMAGE */}
            {selectedImage && (
              <div className="mb-2.5 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-2.5">

                <img
                  src={selectedImage}
                  alt="Aperçu"
                  className="h-14 w-14 shrink-0 rounded-xl object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-700">
                    Image ajoutée
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-400">
                    Cette image sera envoyée avec votre message.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white hover:text-red-500"
                  aria-label="Supprimer l'image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* =============================================
                INPUT
            ============================================= */}
<div className="
  rounded-[26px]
  border
  border-slate-200/90
  bg-white
  p-2
  shadow-[0_10px_35px_rgba(15,23,42,0.12)]
  ring-1
  ring-slate-100
  transition-all
  focus-within:border-blue-300
  focus-within:shadow-[0_12px_40px_rgba(10,46,97,0.14)]
  focus-within:ring-4
  focus-within:ring-blue-50
">
              <div className="flex items-end gap-1">

                {/* PHOTO */}
                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-blue-50 hover:text-[#0A2E61]"
                  title="Joindre une photo"
                >
                  <Paperclip className="h-5 w-5" />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {/* TEXTAREA */}
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(event) =>
                    setInput(event.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  disabled={isTyping}
                  rows={1}
                  placeholder="Posez votre question à Dentalis IA..."
                  className="
                    max-h-[120px]
                    min-h-[42px]
                    flex-1
                    resize-none
                    overflow-y-auto
                    border-0
                    bg-transparent
                    px-2
                    py-2.5
                    text-sm
                    leading-6
                    text-slate-700
                    outline-none
                    placeholder:text-slate-400
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                />

                {/* MICRO */}
                <button
                  type="button"
                  onClick={toggleVoice}
                  className={`mb-0.5 hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl transition sm:flex ${
                    isListening
                      ? "bg-red-50 text-red-500"
                      : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                  title="Parler"
                >
                  <Mic className="h-5 w-5" />
                </button>

                {/* ENVOYER */}
                <button
                  type="button"
                  onClick={() => sendMessage()}
                  disabled={
                    isTyping ||
                    (!input.trim() &&
                      !selectedImage)
                  }
                  className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0A2E61] text-white shadow-md shadow-blue-900/20 transition hover:bg-[#08264F] disabled:cursor-not-allowed disabled:opacity-35"
                  title="Envoyer"
                >
                  <Send className="h-4 w-4" />
                </button>

              </div>
            </div>

            {/* DISCLAIMER */}
            <div className="mt-2 flex items-center justify-center gap-1.5 px-2 text-center">

              <AlertCircle className="h-3 w-3 shrink-0 text-slate-400" />

              <p className="text-[9px] leading-4 text-slate-400 sm:text-[10px]">
                Dentalis IA fournit une orientation indicative
                et ne remplace pas l'avis d'un professionnel de santé.
              </p>

            </div>

          </div>
        </div>
      </div>
    </main>
  </div>
);
}