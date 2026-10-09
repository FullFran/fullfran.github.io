---
title: "Si una máquina comprueba la demostración, ¿ya está bien?"
date: 2026-10-06
lang: es
description: "OpenAI colgó 722 manuscritos de matemáticas escritos por un modelo y al día siguiente retiró tres. Yo pensaba que lo difícil era que la IA demostrara cosas. Lo difícil resulta ser otra cosa, y no la arregla ningún verificador."
draft: false
---

Imagina que abres GitHub un martes por la tarde y te encuentras 722 artículos de matemáticas que no ha escrito ninguna persona.

No es una forma de hablar. El 6 de octubre de 2026 OpenAI publicó un repositorio con 722 manuscritos, repartidos en 372 familias de problemas, producidos por un modelo interno que no han sacado al público. Algunos atacan problemas abiertos de verdad. Y una parte de ellos viene con su demostración escrita en Lean, un lenguaje en el que un programa comprueba cada paso del razonamiento y no deja pasar ni uno que no se siga del anterior.

Al día siguiente retiraron tres.

Yo estoy haciendo un doctorado en física, y mi primera reacción fue de pura codicia: esto me va a servir para la tesis. Si una máquina puede escribir teoremas y otra puede certificarlos, el cuello de botella de investigar acaba de moverse a otra parte. La pregunta es a cuál. Y para contestarla me puse a leer qué está haciendo la gente que ya lleva tiempo metida en esto.

## Lo que yo habría apostado

Antes de leer nada, yo habría apostado dos cosas.

La primera, que lo difícil era demostrar. Que la parte cara de usar una IA en matemáticas o en física teórica es conseguir que encuentre la cadena de pasos que lleva de las hipótesis a la conclusión, y que una vez que la tiene, el resto es papeleo.

La segunda, que si esa cadena pasa por Lean, ya no hace falta nadie más. El verificador no se cansa, no se deja impresionar por el prestigio del autor y no se salta pasos a las tres de la mañana. Si dice que sí, es que sí.

Las dos suenan razonables. Las dos están mal, y de una forma que me parece mucho más interesante que si estuvieran bien.

## Qué comprueba exactamente un verificador

Lean funciona como un profesor de matemáticas sin ningún sentido del humor. Le das un enunciado y una demostración, y su núcleo (una parte pequeña del programa, pensada para que se pueda revisar a mano) comprueba que cada paso es una aplicación legal de las reglas. Si falta un paso, no compila. Si usas algo que no has demostrado, te obliga a declararlo como axioma y queda a la vista.

En el repositorio de OpenAI, a 9 de octubre, hay 300 de los 719 resultados principales formalizados así (alrededor del 42 %). El resto, el otro 58 %, son demostraciones en prosa, como las de cualquier artículo. Y el propio repositorio lo avisa sin rodeos: no todos los resultados tienen formalización, y algunos de los que no la tienen podrían tener problemas.

Los tres que retiraron el miércoles eran resultados sobre ciclos algebraicos en variedades abelianas y superficies K3, en el entorno de la conjetura de Hodge (una de las siete del milenio, para que te hagas una idea del calibre). Esa misma revisión arregló otros catorce manuscritos.

Hasta aquí, nada que tumbe mis apuestas. Que la prosa falle y Lean no es justo lo que yo esperaba. La parte interesante está en los que sí pasaron.

## Lean demuestra lo que escribiste

Entre los formalizados hay uno que me tocó de cerca, porque es física disfrazada de matemáticas. Coges un sólido elástico, lo empujas por la superficie y mides cómo se deforma esa superficie. La pregunta es si con esas medidas, todas desde fuera, puedes saber de qué está hecho por dentro (sus dos constantes elásticas en cada punto, los módulos de Lamé). El resultado formalizado dice que sí: si dos materiales distintos dieran exactamente la misma respuesta en la superficie, en realidad serían el mismo material. La ficha de la formalización añade, con mucha honestidad, que eso no te da ningún algoritmo para reconstruirlo. Solo te dice que la respuesta existe y es única.

Y en el mismo repositorio hay un resultado hermano que va en sentido contrario: para la conductividad eléctrica en tres dimensiones, con funciones suficientemente rugosas, construyen dos interiores distintos que dan medidas idénticas en la frontera. Desde fuera, indistinguibles.

Esto es lo que en física se llama un problema inverso, y es la misma pregunta que ya salió en este blog con [la guitarra que sabe dónde la tocaste](/blog/la-guitarra-sabe-donde-la-tocaste): ¿puedes oír la forma de un tambor? A veces sí y a veces no, y saber cuál de las dos te toca es lo primero que deberías mirar antes de ponerte a ajustar nada.

Pero fíjate en lo que tiene que pasar para que te creas el resultado de la elasticidad. Lean ha comprobado que, con las definiciones que hay en el fichero, el teorema se sigue. Lo que Lean no puede comprobar es que «el mapa desplazamiento-tracción» que alguien escribió en el fichero sea el mismo objeto que un ingeniero mide en el laboratorio. Que las hipótesis (dominio acotado, suave, constantes suaves, en tres dimensiones) sean las que tú creías. Que el enunciado diga lo que querías decir.

Y aquí cae mi primera apuesta. La herramienta que usa OpenAI para comprobar sus demostraciones, `comparator`, mira que la solución demuestra exactamente el enunciado que se había planteado, con los axiomas permitidos y nada más. Para las definiciones que rellena la máquina, su documentación es tajante: esas soluciones siempre deben revisarse con un verificador adicional, potencialmente humano. La herramienta diseñada para quitarte trabajo te dice en su propio manual dónde no llega.

La gente de Physlib (la biblioteca comunitaria de física en Lean, que empezó como HepLean, centrada en física de altas energías) lo ha escrito en su política de uso de IA con una frase que me parece de lo mejor que he leído este año: «A clean Lean build proves what was written, but only the human can certify what was written is what they meant». Una compilación limpia demuestra lo que escribiste. Solo una persona puede certificar que lo que escribiste es lo que querías decir.

Lo difícil no era demostrar. Lo difícil es saber qué has demostrado.

## Por qué en física duele más

En matemáticas puras el enunciado ya es el objeto. En física el enunciado es una traducción, y todas las traducciones pierden algo.

Un grupo que este verano autoformalizó con un equipo de agentes la teoría de redes tensoriales (en concreto el teorema fundamental de los estados de producto de matrices, que es física cuántica de muchos cuerpos de nivel de investigación) señala como cuello de botella principal justo eso: asegurarse de que la formalización respeta la intención matemática. Y lo consiguieron con revisión humana periódica, no sin ella. Otro trabajo reciente, que intenta demostrar en Lean resultados de mecánica cuántica de libro de texto, insiste en que los argumentos físicos van cargados de idealizaciones que casi nunca se dicen en voz alta. Cuando escribes «sea un sistema aislado» estás metiendo una docena de suposiciones que en Lean hay que escribir una por una, y que en el papel nadie escribe.

Y ni siquiera la física de primero está resuelta. Hay un banco de pruebas con 200 enunciados de física universitaria y de olimpiadas en Lean, revisados a mano, y en el artículo original uno de los mejores modelos comerciales de entonces solo demostraba un 35 %.

## La segunda apuesta, y lo que hacen en otros campos

Mi segunda apuesta era que, con un verificador perfecto, sobraba el humano. Lo que me encontré leyendo lo que se hace fuera de las matemáticas es que todos los sistemas que funcionan tienen el mismo esqueleto: algo genera, algo comprueba, y todo depende de cuánto te puedes fiar de lo que comprueba.

El ejemplo más limpio es FunSearch, de DeepMind. Un modelo de lenguaje propone programas, un evaluador automático los puntúa, y los mejores vuelven al modelo como inspiración. Así encontraron conjuntos sin progresiones (los llamados cap sets) más grandes que los que se conocían. Su sucesor, AlphaEvolve, encontró una forma de multiplicar matrices complejas de 4×4 con 48 multiplicaciones, mejorando un récord que venía del algoritmo de Strassen de 1969. Funciona porque el evaluador es barato e incorruptible: contar multiplicaciones no admite interpretaciones.

En biomedicina, donde no hay un evaluador así, Google montó el AI co-scientist (publicado en Nature el 19 de mayo de 2026): varios agentes sobre Gemini que generan hipótesis, las critican como si fueran revisores, las enfrentan en un torneo, las mejoran y las vuelven a revisar. Y aquí el evaluador final no es otro agente. Es el laboratorio. Propusieron reutilizar fármacos contra la fibrosis hepática y la leucemia mieloide aguda, y uno de sus hallazgos más llamativos fue llegar por su cuenta a un mecanismo de transferencia de genes entre bacterias que un grupo ya había medido pero aún no había publicado.

El contraejemplo también existe. The AI Scientist, de Sakana, automatiza el ciclo entero de investigación en aprendizaje automático, desde la idea hasta el artículo, y afirma que algunos de sus artículos superan el listón de aceptación de una buena conferencia «según nuestro revisor automático». Es decir, el mismo tipo de máquina que escribe es la que juzga. Una evaluación independiente posterior encontró que el sistema daba por novedosas técnicas ya conocidas y que el 42 % de sus experimentos fallaban por errores de código.

Y la novedad es otra cosa que hay que verificar. En octubre de 2025 se anunció que GPT-5 había «resuelto» diez problemas de Erdős que figuraban como abiertos. Según se contó entonces, el responsable de la base de datos de esos problemas respondió que «abierto» solo significaba que él no conocía la solución, y lo que había hecho el modelo era encontrarla en la literatura. Que, por cierto, también tiene mérito. Solo que es otro mérito.

Así que cae la segunda apuesta. El verificador nunca hace sobrar al humano. Le cambia el trabajo: ya no tiene que comprobar cada paso, tiene que vigilar la frontera donde el mundo entra en el sistema (qué enunciado, qué definiciones, qué hipótesis, contra qué se compara, si esto ya lo había hecho alguien).

## El mecanismo

Si lo junto todo, lo que veo es esto. Una IA que genera resultados vale exactamente lo que vale el comprobador más barato y fiable que tengas detrás. Donde ese comprobador es perfecto y barato (contar multiplicaciones, compilar en Lean), la generación se dispara y se vuelve casi gratis. Y entonces todo el coste se concentra en el único sitio que el comprobador no cubre: la traducción entre lo que querías preguntar y lo que preguntaste de verdad.

No es que la IA no sirva. Es que desplaza el trabajo difícil a un sitio menos vistoso.

## Vuelta al martes

Vuelvo a los 722 manuscritos de aquel martes, que ahora son 719. Lo que me llevo para la tesis no es un teorema, es una costumbre. En mi caso ajusto modelos físicos a curvas medidas en el laboratorio, y la pregunta del tambor (¿podrían dos juegos de parámetros distintos dar la misma curva?) me persigue desde el primer día. Lo que he aprendido esta semana es que, si un día le pido a una máquina que me demuestre algo sobre eso, lo primero que tengo que escribir no es Lean. Es, en castellano, qué quiero que signifique el teorema, para que alguien que no sea la máquina pueda decir si lo que se ha demostrado es eso.

Y el mecanismo no es exclusivo de las matemáticas. El corrector ortográfico de tu móvil comprueba que cada palabra existe, no que el mensaje diga lo que querías decir. Los tests de un programa comprueban que el código hace lo que dicen los tests, no que los tests pidan lo correcto. Un contrato revisado por un abogado impecable puede proteger perfectamente algo que no era lo que querías proteger. En todos los casos el comprobador es fiable dentro de su frontera, y el error vive justo en la frontera.

Lo que queda sin cerrar es casi todo. Los números del repositorio cambian cada día (yo los he contado a 9 de octubre), nadie ha dicho todavía cuántos de esos manuscritos aguantarán la revisión de especialistas, y la pregunta de cómo se verifica la intención, la de verdad, no tiene de momento más respuesta que una persona leyendo con calma. Que, bien pensado, es una respuesta bastante antigua.

### Referencias

- OpenAI, repositorio [openai/math](https://github.com/openai/math) y su [historial de cambios](https://github.com/openai/math/blob/main/history.md); ficha de la formalización de la [unicidad en elasticidad](https://github.com/openai/math/blob/main/lean/docs/372.md) y del [contraejemplo en conductividad](https://github.com/openai/math/blob/main/lean/docs/365.md).
- Lean FRO, [comparator](https://github.com/leanprover/comparator).
- Physlib, [política de uso de IA](https://github.com/leanprover-community/physlib/blob/master/AI-POLICY.md). J. Tooby-Smith, [HepLean: Digitalising high energy physics](https://arxiv.org/abs/2405.08863) (2024).
- S. Lu, E. Tjoa y J. I. Cirac, [Multi-agent Autoformalization of Tensor Network Theory](https://arxiv.org/abs/2607.07857) (2026).
- Li et al., [Lean4Physics: Comprehensive Reasoning Framework for College-level Physics in Lean4](https://arxiv.org/abs/2510.26094) (2025).
- B. Romera-Paredes et al., [Mathematical discoveries from program search with large language models](https://doi.org/10.1038/s41586-023-06924-6), Nature (2024). DeepMind, [AlphaEvolve](https://deepmind.google/discover/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/) (2025).
- Google DeepMind, [AI co-scientist](https://deepmind.google/blog/co-scientist-a-multi-agent-ai-partner-to-accelerate-research/) (2026) y el preprint [Towards an AI co-scientist](https://arxiv.org/abs/2502.18864) (2025).
- C. Lu et al., [The AI Scientist](https://arxiv.org/abs/2408.06292) (2024). J. Beel, M.-Y. Kan y M. Baumgart, [Evaluating Sakana's AI Scientist](https://arxiv.org/abs/2502.14297) (2025).
