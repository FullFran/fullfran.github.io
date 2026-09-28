# CLAUDE.md

Antes de escribir, editar o publicar cualquier entrada en `page/src/content/blog/*.md`, carga la skill `fullfran-blog-post` (`~/.claude/skills/fullfran-blog-post/SKILL.md`); ahí está el contrato completo, la plantilla y el script de comprobaciones.

Las cinco reglas que más importan:

1. Estructura narrativa Veritasium: gancho cotidiano, apuesta equivocada en primera persona ("lo que yo habría apostado"), cada intuición se derrumba en su momento de la historia (no todas al final), remate, y cierre que vuelve al gancho inicial y transfiere el mecanismo a otro sistema. Nunca un informe de laboratorio: fuera predicciones selladas, fechas de sello, tablas de predicción o diarios de depuración de instrumentos.
2. Voz de Fran: español peninsular, sin voseo ni regionalismos, paréntesis para incisos, nunca raya "—" ni pares " - ", casi nada de negrita, prosa fluida, segunda persona, coma decimal, cada ecuación explicada en palabras justo debajo.
3. Todo número tiene que salir del código o cuaderno del proyecto ya ejecutado: nunca se inventa ni se importa una cifra sin fuente. No menciones ni enlaces el repositorio salvo que el usuario lo pida.
4. Frontmatter: `title` suele ser pregunta, `description` concreta con payoff, `date` es el día del hecho narrado (no el de escritura), `lang: es`, `draft: true` hasta que el usuario diga explícitamente que se publica.
5. Antes de comitear: `assets/check.sh <post>` de la skill (raya larga = 0, frases prohibidas, rutas `/img/` existentes) y `cd page && npx astro build` en verde; commits estilo `content(blog): ...` en minúscula y en español, sin atribución de IA.
