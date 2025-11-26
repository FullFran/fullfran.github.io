<!doctype html>
<html lang="es" class="h-full">
  <head>
    <meta charset="UTF-8" />
    <title>fullfran :: terminal</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- Tailwind CDN (para prototipo; en Astro lo compilas bien) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      :root {
        --bg: #1a1b26;
        --bg-alt: #16161e;
        --fg: #c0caf5;
        --fg-muted: #a9b1d6;
        --accent: #7aa2f7;
        --accent-soft: #334155;
        --cursor: #c0caf5;
        --error: #f7768e;
        --warning: #e0af68;
        --success: #9ece6a;
      }
      body {
        background: radial-gradient(circle at top, #1f2335 0, #050816 60%, #000 100%);
        color: var(--fg);
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Mono", Menlo, monospace;
      }
      .terminal {
        background: rgba(15, 16, 26, 0.95);
        border-radius: 1rem;
        border: 1px solid #24283b;
        box-shadow:
          0 25px 50px rgba(0, 0, 0, 0.8),
          0 0 0 1px rgba(148, 163, 184, 0.06);
        backdrop-filter: blur(16px);
      }
      .terminal-header {
        background: linear-gradient(to right, #15161e, #111827);
        border-bottom: 1px solid #1f2937;
      }
      .term-dot {
        width: 10px;
        height: 10px;
        border-radius: 999px;
      }
      .cursor {
        display: inline-block;
        width: 0.6em;
        background: var(--cursor);
        animation: blink 1s step-start infinite;
      }
      @keyframes blink {
        50% {
          background: transparent;
        }
      }
      .section-active {
        background: rgba(15, 23, 42, 0.9);
      }
      .vim-hint {
        font-size: 0.7rem;
        letter-spacing: 0.08em;
      }
      a {
        color: var(--accent);
      }
      a:hover {
        text-decoration: underline;
      }
      code {
        font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco,
          Consolas, "Liberation Mono", "Courier New", monospace;
      }
      .scroll-shadow {
        box-shadow: inset 0 10px 15px -15px rgba(0, 0, 0, 0.8);
      }
    </style>
  </head>
  <body class="h-full min-h-screen flex items-center justify-center px-4 py-8">
    <div class="max-w-5xl w-full">
      <div class="terminal overflow-hidden">
        <!-- Header -->
        <div class="terminal-header px-4 py-2 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="term-dot bg-red-500/80"></div>
            <div class="term-dot bg-yellow-400/80"></div>
            <div class="term-dot bg-green-500/80"></div>
            <span class="ml-3 text-xs text-slate-400">
              fullfran@pop-os • ~/fullfran.com
            </span>
          </div>
          <div class="vim-hint text-slate-500 hidden sm:flex gap-4">
            <span>j/k: move</span>
            <span>:help</span>
            <span>1–4: sections</span>
          </div>
        </div>

        <!-- Body -->
        <div
          id="app"
          class="scroll-shadow max-h-[70vh] overflow-y-auto px-4 sm:px-6 py-5 space-y-4 text-sm sm:text-base"
        >
          <!-- Render landing o admin via JS -->
        </div>

        <!-- Command line -->
        <div
          class="border-t border-slate-800 bg-gradient-to-r from-slate-950/90 to-slate-900/80 px-4 sm:px-6 py-2"
        >
          <div class="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>INSERT</span>
            <span class="mx-1">•</span>
            <span>type <code>:help</code> and press Enter</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <span class="text-emerald-400">:</span>
            <input
              id="command-input"
              type="text"
              autocomplete="off"
              class="bg-transparent flex-1 outline-none border-none text-slate-200 placeholder:text-slate-500"
              placeholder="q | wq | about | exp | stack | contact | admin | help"
            />
          </div>
        </div>
      </div>
    </div>

    <script>
      /***********************
       * CONFIG DINÁMICA
       ***********************/
      const STORAGE_KEY = "fullfran_terminal_config_v1";

      const defaultConfig = {
        hero: {
          name: "Francisco Manuel Olmedo Cortés",
          handle: "fullfran",
          title: "Physicist & AI-Powered Automation Architect",
          subtitle:
            "Diseño sistemas de IA y automatización que convierten caos operativo en pipelines fiables, medibles y escalables.",
          location: "Córdoba, Andalucía, España",
        },
        about: {
          tagline: "AI Solutions Architect & Physicist",
          body: [
            "Soy físico especializado en arquitecturas de IA y automatización aplicada al negocio.",
            "Fundador de BlakIA, donde diseño infraestructuras de agentes, RAG/GraphRAG y sistemas multi-tenant que mueven tráfico real (más de 100K mensajes en eventos de ciudad).",
            "Aplico rigor científico (simulación, optimización, modelos de luz en medios desordenados) a problemas de negocio: menos fricción, más señal, menos humo.",
            "Friki de teclados custom, anime, videojuegos y con pasado serio en calistenia: me gustan los sistemas eficientes, ya sean músculos o clusters.",
          ],
        },
        experience: [
          {
            label: "2024 — ahora",
            title: "Cofounder & AI Solutions Architect · BlakIA",
            details: [
              "Arquitectura de agentes de IA, RAG/GraphRAG y automatizaciones sobre n8n, LangChain, Pydantic AI y LangGraph.",
              "Infraestructura de bots para eventos masivos (WhatsApp + web), con más de 100K mensajes procesados y observabilidad en tiempo real.",
              "Diseño de SaaS multi-tenant con métricas, dashboards y despliegues productivos sobre Hetzner + Docker.",
            ],
          },
          {
            label: "Freelance",
            title: "AI & ML Developer",
            details: [
              "Automatizaciones end-to-end que reducen trabajo manual hasta un 60% en consultoras y agencias.",
              "Bots de cualificación de leads, asistentes internos y sistemas LLMOps con bases vectoriales (Qdrant, Weaviate).",
            ],
          },
          {
            label: "Investigación",
            title: "Researcher · Universidad de Córdoba / IDENER / CIEMAT",
            details: [
              "Simulación de medios ópticos desordenados con ray tracing y algoritmos genéticos.",
              "Modelos de red neuronal para forecasting energético y materiales termoluminiscentes.",
              "Docencia en Python y ciencia de datos para estudiantes de física.",
            ],
          },
        ],
        stack: {
          core: [
            "Python, FastAPI, Docker, CI/CD",
            "LLMs, RAG, GraphRAG, OpenAI API",
            "n8n, LangChain, Pydantic AI, LangGraph",
            "Qdrant, Postgres, Redis",
          ],
          frontend: ["Astro, React, Tailwind CSS", "Tokyonight everything"],
          fun: [
            "Custom keyboards (Fifi, layouts 34–36 teclas)",
            "Anime: Steins;Gate, Re:Zero, Kaguya-sama",
            "Soulsborne enjoyer, calistenia & maltese enjoyer",
          ],
        },
        contact: {
          email: "fran@blakia.es",
          website: "https://blakia.es",
          cv: "https://fullfran.github.io/cv",
          linkedin:
            "https://www.linkedin.com/in/francisco-olmedo-cortes/",
          github: "https://github.com/FullFran",
        },
        admin: {
          // Cambia esto en cuanto lo montes de verdad
          password: "fullfran",
        },
      };

      function loadConfig() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return structuredClone(defaultConfig);
        try {
          const parsed = JSON.parse(raw);
          return { ...structuredClone(defaultConfig), ...parsed };
        } catch {
          return structuredClone(defaultConfig);
        }
      }

      function saveConfig(cfg) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
      }

      let config = loadConfig();
      let currentSectionIndex = 0; // 0: hero, 1: about, 2: exp, 3: stack, 4: contact

      /***********************
       * RENDER LANDING
       ***********************/
      function sectionIdFromIndex(idx) {
        return ["hero", "about", "experience", "stack", "contact"][idx] ?? "hero";
      }

      function renderLanding() {
        const app = document.getElementById("app");
        app.innerHTML = `
          <div id="hero" class="space-y-3 pb-4 border-b border-slate-800">
            <div class="text-xs text-slate-500 mb-1">
              $ whoami
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 class="text-xl sm:text-2xl font-semibold text-slate-50">
                  ${config.hero.name}
                  <span class="text-sm text-slate-500 block sm:inline sm:ml-2">
                    (@${config.hero.handle})
                  </span>
                </h1>
                <p class="text-sm text-slate-400 mt-1">
                  ${config.hero.title}
                </p>
                <p class="text-xs text-slate-500 mt-1">
                  ${config.hero.location}
                </p>
              </div>
              <div class="text-xs text-right text-slate-500">
                <div>mode: <span class="text-emerald-400">NORMAL</span></div>
                <div>theme: tokyonight</div>
              </div>
            </div>
            <p class="text-sm text-slate-300 mt-2">
              ${config.hero.subtitle}
            </p>
          </div>

          <div id="about" class="pt-3 pb-4 border-b border-slate-800">
            <div class="text-xs text-slate-500 mb-1">
              $ cat about.txt
            </div>
            <p class="text-xs text-sky-400 mb-1">${config.about.tagline}</p>
            ${config.about.body
              .map(
                (p) =>
                  `<p class="text-sm text-slate-300 leading-relaxed mb-2">${p}</p>`
              )
              .join("")}
          </div>

          <div id="experience" class="pt-3 pb-4 border-b border-slate-800">
            <div class="text-xs text-slate-500 mb-2">
              $ ls experience/
            </div>
            <div class="space-y-3">
              ${config.experience
                .map(
                  (exp) => `
                <div class="rounded-lg border border-slate-800/80 bg-slate-950/40 p-3">
                  <div class="flex justify-between text-xs text-slate-500 mb-1">
                    <span>${exp.label}</span>
                    <span>nano ${exp.title.replace(/\s+/g, "_").toLowerCase()}</span>
                  </div>
                  <div class="text-sm text-slate-100 font-medium">
                    ${exp.title}
                  </div>
                  <ul class="mt-1 space-y-1 text-sm text-slate-300 list-disc list-inside">
                    ${exp.details
                      .map((d) => `<li>${d}</li>`)
                      .join("")}
                  </ul>
                </div>
              `
                )
                .join("")}
            </div>
          </div>

          <div id="stack" class="pt-3 pb-4 border-b border-slate-800">
            <div class="text-xs text-slate-500 mb-2">
              $ cat stack.yml
            </div>
            <div class="grid sm:grid-cols-3 gap-3 text-sm">
              <div class="rounded-lg border border-slate-800/80 bg-slate-950/40 p-3">
                <div class="text-xs text-slate-500 mb-1">core_stack:</div>
                <ul class="space-y-1 text-slate-300 list-disc list-inside">
                  ${config.stack.core.map((s) => `<li>${s}</li>`).join("")}
                </ul>
              </div>
              <div class="rounded-lg border border-slate-800/80 bg-slate-950/40 p-3">
                <div class="text-xs text-slate-500 mb-1">frontend:</div>
                <ul class="space-y-1 text-slate-300 list-disc list-inside">
                  ${config.stack.frontend.map((s) => `<li>${s}</li>`).join("")}
                </ul>
              </div>
              <div class="rounded-lg border border-slate-800/80 bg-slate-950/40 p-3">
                <div class="text-xs text-slate-500 mb-1">fun_flags:</div>
                <ul class="space-y-1 text-slate-300 list-disc list-inside">
                  ${config.stack.fun.map((s) => `<li>${s}</li>`).join("")}
                </ul>
              </div>
            </div>
          </div>

          <div id="contact" class="pt-3 pb-1">
            <div class="text-xs text-slate-500 mb-2">
              $ cat contact.sh
            </div>
            <div class="text-xs sm:text-sm bg-slate-950/40 border border-slate-800/80 rounded-lg p-3 font-mono">
              <div class="text-slate-400 mb-1">#!/bin/bash</div>
              <div class="text-slate-300">email="${config.contact.email}"</div>
              <div class="text-slate-300">site="${config.contact.website}"</div>
              <div class="text-slate-300">cv="${config.contact.cv}"</div>
              <div class="text-slate-300">linkedin="${config.contact.linkedin}"</div>
              <div class="text-slate-300">github="${config.contact.github}"</div>
              <div class="mt-2 text-slate-400">
                echo "ping me for AI systems, automation infra or weird physics-inspired architectures."
              </div>
            </div>
          </div>
        `;

        highlightActiveSection();
      }

      /***********************
       * RENDER ADMIN
       ***********************/
      function renderAdminLogin(error) {
        const app = document.getElementById("app");
        app.innerHTML = `
          <div class="space-y-4">
            <div class="text-xs text-slate-500">
              $ cd /admin && ./login
            </div>
            <h2 class="text-lg font-semibold text-slate-100">
              Admin · fullfran terminal
            </h2>
            <p class="text-sm text-slate-400">
              Introduce la contraseña para editar el contenido de la landing.
            </p>
            ${
              error
                ? `<p class="text-xs text-red-400">auth failed: contraseña incorrecta</p>`
                : ""
            }
            <form id="admin-login-form" class="space-y-3 max-w-xs">
              <label class="block text-sm text-slate-300">
                Password
                <input
                  type="password"
                  name="password"
                  class="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-sm text-slate-100 outline-none focus:border-sky-500"
                  autofocus
                />
              </label>
              <button
                type="submit"
                class="text-xs px-3 py-1 rounded-md bg-sky-600 hover:bg-sky-500 text-slate-50"
              >
                login
              </button>
            </form>
            <p class="text-xs text-slate-500">
              Tip: en producción monta auth seria (Clerk, Supabase, etc). Esto es solo un stub.
            </p>
          </div>
        `;

        document
          .getElementById("admin-login-form")
          .addEventListener("submit", (e) => {
            e.preventDefault();
            const pwd = e.target.password.value;
            if (pwd === config.admin.password) {
              sessionStorage.setItem("fullfran_admin_authed", "1");
              renderAdminPanel();
            } else {
              renderAdminLogin(true);
            }
          });
      }

      function renderAdminPanel() {
        const app = document.getElementById("app");
        app.innerHTML = `
          <div class="space-y-4 pb-2">
            <div class="text-xs text-slate-500">
              $ cd /admin && vim config.json
            </div>
            <div class="flex justify-between items-center gap-2">
              <h2 class="text-lg font-semibold text-slate-100">
                Admin · Contenido de la landing
              </h2>
              <button
                id="admin-back-btn"
                class="text-xs px-3 py-1 rounded-md border border-slate-700 text-slate-300 hover:bg-slate-900"
              >
                volver a la landing
              </button>
            </div>
            <p class="text-xs text-slate-400">
              Edita los textos principales. Para cambios más profundos, toca el código directamente.
            </p>

            <form id="admin-form" class="space-y-4 text-sm">
              <div class="grid sm:grid-cols-2 gap-3">
                <label class="block">
                  <span class="text-slate-300 text-xs">Hero title</span>
                  <input
                    name="heroTitle"
                    class="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-sm text-slate-100 outline-none focus:border-sky-500"
                    value="${config.hero.title}"
                  />
                </label>
                <label class="block">
                  <span class="text-slate-300 text-xs">Hero subtitle</span>
                  <input
                    name="heroSubtitle"
                    class="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-sm text-slate-100 outline-none focus:border-sky-500"
                    value="${config.hero.subtitle.replace(/"/g, "&quot;")}"
                  />
                </label>
              </div>

              <label class="block">
                <span class="text-slate-300 text-xs">About · párrafos (uno por línea)</span>
                <textarea
                  name="aboutBody"
                  rows="5"
                  class="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-sm text-slate-100 outline-none focus:border-sky-500"
                >${config.about.body.join("\n")}</textarea>
              </label>

              <div class="grid sm:grid-cols-2 gap-3">
                <label class="block">
                  <span class="text-slate-300 text-xs">Email</span>
                  <input
                    name="email"
                    class="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-sm text-slate-100 outline-none focus:border-sky-500"
                    value="${config.contact.email}"
                  />
                </label>
                <label class="block">
                  <span class="text-slate-300 text-xs">Website</span>
                  <input
                    name="website"
                    class="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-sm text-slate-100 outline-none focus:border-sky-500"
                    value="${config.contact.website}"
                  />
                </label>
              </div>

              <div class="grid sm:grid-cols-3 gap-3">
                <label class="block">
                  <span class="text-slate-300 text-xs">LinkedIn URL</span>
                  <input
                    name="linkedin"
                    class="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-sm text-slate-100 outline-none focus:border-sky-500"
                    value="${config.contact.linkedin}"
                  />
                </label>
                <label class="block">
                  <span class="text-slate-300 text-xs">GitHub URL</span>
                  <input
                    name="github"
                    class="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-sm text-slate-100 outline-none focus:border-sky-500"
                    value="${config.contact.github}"
                  />
                </label>
                <label class="block">
                  <span class="text-slate-300 text-xs">CV URL</span>
                  <input
                    name="cv"
                    class="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-sm text-slate-100 outline-none focus:border-sky-500"
                    value="${config.contact.cv}"
                  />
                </label>
              </div>

              <div class="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  class="text-xs px-4 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-50"
                >
                  guardar cambios
                </button>
                <span id="admin-status" class="text-xs text-slate-500"></span>
              </div>
            </form>
          </div>
        `;

        document.getElementById("admin-back-btn").onclick = () => {
          window.history.pushState({}, "", "/");
          initRouter();
        };

        document.getElementById("admin-form").onsubmit = (e) => {
          e.preventDefault();
          const f = e.target;
          config.hero.title = f.heroTitle.value;
          config.hero.subtitle = f.heroSubtitle.value;
          config.about.body = f.aboutBody.value
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean);
          config.contact.email = f.email.value;
          config.contact.website = f.website.value;
          config.contact.linkedin = f.linkedin.value;
          config.contact.github = f.github.value;
          config.contact.cv = f.cv.value;

          saveConfig(config);
          const status = document.getElementById("admin-status");
          status.textContent = "saved ✓";
          setTimeout(() => (status.textContent = ""), 1500);
        };
      }

      /***********************
       * ROUTER SENCILLO
       ***********************/
      function initRouter() {
        const path = window.location.pathname.replace(/\/+$/, "") || "/";
        const cmdInput = document.getElementById("command-input");
        cmdInput.value = "";

        if (path === "/admin") {
          if (sessionStorage.getItem("fullfran_admin_authed") === "1") {
            renderAdminPanel();
          } else {
            renderAdminLogin(false);
          }
        } else {
          renderLanding();
        }
      }

      /***********************
       * VIM-LIKE UX
       ***********************/
      function scrollToSection(idx) {
        currentSectionIndex = Math.max(0, Math.min(idx, 4));
        const id = sectionIdFromIndex(currentSectionIndex);
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          highlightActiveSection();
        }
      }

      function highlightActiveSection() {
        const ids = ["hero", "about", "experience", "stack", "contact"];
        ids.forEach((id, idx) => {
          const el = document.getElementById(id);
          if (!el) return;
          if (idx === currentSectionIndex) {
            el.classList.add("section-active");
          } else {
            el.classList.remove("section-active");
          }
        });
      }

      function handleNormalModeKeydown(e) {
        const path = window.location.pathname.replace(/\/+$/, "") || "/";
        if (path !== "/") return; // navegación vim solo en landing

        const activeTag = document.activeElement?.tagName?.toLowerCase();
        if (activeTag === "input" || activeTag === "textarea") return;

        if (e.key === "j") {
          e.preventDefault();
          scrollToSection(currentSectionIndex + 1);
        } else if (e.key === "k") {
          e.preventDefault();
          scrollToSection(currentSectionIndex - 1);
        } else if (["1", "2", "3", "4", "5"].includes(e.key)) {
          e.preventDefault();
          scrollToSection(parseInt(e.key, 10) - 1);
        } else if (e.key === ":") {
          e.preventDefault();
          document.getElementById("command-input").focus();
        }
      }

      function showHelpMessage() {
        alert(
          [
            "Vim-style commands:",
            "",
            "j / k         → mover entre secciones",
            "1..5          → saltar a sección",
            ":about        → sección About",
            ":exp          → Experience",
            ":stack        → Stack",
            ":contact      → Contact",
            ":admin        → Admin panel",
            ":q            → 'salir' (scroll arriba)",
            ":help         → esta ayuda",
          ].join("\n")
        );
      }

      function handleCommand(cmdRaw) {
        const cmd = cmdRaw.trim().replace(/^:/, "");
        if (!cmd) return;

        const path = window.location.pathname.replace(/\/+$/, "") || "/";

        switch (cmd) {
          case "q":
            scrollToSection(0);
            break;
          case "wq":
            scrollToSection(0);
            break;
          case "help":
            showHelpMessage();
            break;
          case "about":
            scrollToSection(1);
            break;
          case "exp":
          case "experience":
            scrollToSection(2);
            break;
          case "stack":
            scrollToSection(3);
            break;
          case "contact":
            scrollToSection(4);
            break;
          case "admin":
            window.history.pushState({}, "", "/admin");
            initRouter();
            break;
          default:
            alert(`command not found: :${cmd}`);
        }
      }

      /***********************
       * INIT
       ***********************/
      window.addEventListener("keydown", handleNormalModeKeydown);

      window.addEventListener("DOMContentLoaded", () => {
        initRouter();

        const cmdInput = document.getElementById("command-input");
        cmdInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            handleCommand(e.target.value);
            e.target.value = "";
            e.target.blur();
          } else if (e.key === "Escape") {
            e.target.blur();
          }
        });

        // soportar navegación del historial entre / y /admin
        window.addEventListener("popstate", initRouter);
      });
    </script>
  </body>
</html>

