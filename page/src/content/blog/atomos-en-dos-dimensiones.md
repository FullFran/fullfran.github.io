---
title: "¿Puede haber átomos en un universo de dos dimensiones?"
date: 2026-10-27
lang: es
description: "Una pregunta soñada acabó en una noche de física con una IA. Al rehacer las cuentas desde cero salieron los mismos números salvo una cienmilésima, y aun así la historia que contaban era falsa: el pozo de la molécula no acababa donde decía."
draft: false
---

En un sueño, mi hermana me preguntó si podría haber átomos en dos dimensiones.

No me preguntó por planetas ni por la vida en un mundo plano. Solo eso, átomos. Y me desperté con la pregunta metida en la cabeza, de esas que parecen de niño y que luego no sabes contestar.

Así que hice lo que hace casi todo el mundo ahora con una pregunta así: abrirle una conversación a una IA. Fue una noche larga. Salieron leyes de Gauss en el plano, relatividad general en 2+1 dimensiones (dos de espacio y una de tiempo), un modelo de química sobre una superficie curva, una molécula de hidrógeno ionizado con su curva de energía, varias referencias y un montón de números con cinco cifras.

Un par de semanas después volví a leerlo con calma, y la pregunta cambió. Ya no era solo si puede haber átomos en dos dimensiones, sino otra más incómoda: ¿me puedo creer lo que me contó la máquina aquella noche? Solo había una forma de saberlo, rehacerlo todo yo desde cero (a mano lo que se pudiera, con mis propios cálculos lo demás) y comparar.

## Lo que yo habría apostado

Antes de rehacer ninguna cuenta, yo habría apostado tres cosas.

La primera, que en dos dimensiones no hay átomos. Un átomo es un equilibrio delicado entre un electrón que quiere escapar y un núcleo que lo atrae, y la intuición me decía que, si le quitas una dimensión a la geometría, ese equilibrio se rompe por algún lado: o el electrón cae o se va.

La segunda, que sin la gravedad de Newton no hay planetas. Si la masa no atrae como estamos acostumbrados, nada se queda dando vueltas alrededor de nada.

La tercera es la que me importaba de verdad. Si al rehacer las cuentas salían los mismos números que me dio la IA, la historia que contaba la IA era correcta. Números buenos, física buena.

Las tres suenan razonables. Ninguna sobrevive entera.

## Un logaritmo que no suelta al electrón

Empecemos por lo más tonto: Newton en un plano. La ley de Gauss dice que el flujo del campo que sale de una carga (o de una masa) atraviesa cualquier circunferencia que la rodee, y que ese flujo no depende del radio. En tres dimensiones el flujo se reparte sobre una esfera, cuya superficie crece como $r^2$, y por eso la fuerza cae como $1/r^2$. En dos dimensiones se reparte sobre una circunferencia, que solo crece como $r$.

$$
2\pi r \, F(r) = -2\pi G_2 M m \quad\Longrightarrow\quad F(r) = -\frac{G_2 M m}{r}
$$

Dicho en palabras: el mismo flujo repartido sobre un perímetro que crece como $r$ da una fuerza que cae como $1/r$, más despacio que la de nuestro mundo.

Y una fuerza $1/r$ viene de un potencial logarítmico:

$$
V(r) = g \log r
$$

Es decir, la energía de separar las dos cargas crece con la distancia sin ningún techo, muy despacio y sin parar nunca.

<figure>
  <img src="/img/universo2d-gauss.png" alt="A la izquierda, dieciséis líneas de campo salen de una carga en un plano y cruzan tres circunferencias de radios 1, 2 y 3. A la derecha, la energía de separar dos cargas opuestas frente a la distancia: en el plano es log r y crece sin techo; en tres dimensiones es menos uno partido por r y se aplana hacia cero." />
  <figcaption>Izquierda: en un plano, las mismas líneas de campo atraviesan cada circunferencia, y como el perímetro crece como r, la fuerza cae como 1/r. Derecha: la energía que eso da. En nuestro mundo (naranja) se aplana y el electrón puede escaparse con energía suficiente; en el plano (azul) sigue subiendo para siempre.</figcaption>
</figure>

Aquí cae la primera de mis apuestas. Con un logaritmo así, el electrón no se puede escapar: por mucha energía que le des, a una distancia suficientemente grande el potencial siempre la supera. No es que en dos dimensiones no haya átomos, es que el átomo es demasiado átomo. Todos los estados están ligados, hay infinitos, y no hay continuo de electrones libres. Esto no es solo mío: un artículo de Konovalov en Few-Body Systems de 2026 lo dice con esas palabras («infinitely many bound states and no continuum») y da la energía del estado fundamental de este átomo plano, 0,526509 en su convención. Pasada a mis unidades sale 0,179935, y mi propio cálculo da 0,179934–0,179935. Ese número publicado se convirtió en el banco de pruebas de todo lo demás.

Y de paso, una sorpresa. Esa referencia era justo la que me parecía inventada cuando repasé lo que me había dicho la IA: una revista real, sí, pero un artículo de 2026, de un solo autor, con un título que no me sonaba de nada. Existe, el DOI resuelve, está publicada en septiembre y dice exactamente lo que la IA le atribuía.

Las órbitas de planetas en este mundo plano también salen raras. Con el potencial logarítmico siempre hay una órbita circular y siempre es estable. Si empujas un poco al planeta, oscila radialmente con una frecuencia $\kappa$ distinta de la de giro $\Omega$:

$$
\frac{\kappa}{\Omega} = \sqrt{2}
$$

O sea, por cada vuelta completa, el planeta se acerca y se aleja $\sqrt{2}$ veces. Como $\sqrt{2}$ no es una fracción, la órbita nunca se cierra: va dibujando una roseta que precesa sin repetirse. Lo comprobé siguiendo una órbita con un 5 % más de velocidad que la circular durante 100 vueltas, y el radio se queda acotado entre 1,0000 y 1,1043 veces el radio circular. Estable, pero no una elipse.

Con un empujón más fuerte se ve mucho mejor. Aquí tienes el mismo planeta, con un 25 % más de velocidad que la circular, en nuestro mundo y en el plano:

<figure>
  <iframe src="/simuladores/universo2d-orbitas.html" title="Animación de dos órbitas: una elipse que se cierra con fuerza 1/r² y una roseta que no se cierra con fuerza 1/r" loading="lazy" style="width:100%;height:min(80vh,560px);border:1px solid rgba(128,128,128,.35);border-radius:6px;"></iframe>
  <figcaption>Mismo empujón, dos leyes de fuerza. Con la de nuestro mundo el planeta repite siempre la misma elipse. Con la del plano, cada vuelta empieza un poco girada respecto a la anterior y la trayectoria va rellenando un anillo.</figcaption>
</figure>

## Einstein no atrae en un plano

Hasta aquí era Newton, que es la aproximación. ¿Qué pasa si haces relatividad general de verdad en 2+1 dimensiones, sin constante cosmológica?

Pasa algo que a mí me sigue pareciendo casi un truco. En tres dimensiones de espaciotiempo, la curvatura entera queda fijada por la materia que hay en cada punto. No queda una parte de la curvatura libre para viajar por el vacío (la que en nuestro mundo son las ondas gravitacionales y la atracción de una estrella sobre un planeta lejano). Donde no hay materia, no hay curvatura.

Así que fuera de una estrella el espacio es localmente plano. La masa solo se nota de forma global, como si a una hoja de papel le recortaras una cuña y pegaras los bordes: un cono. Scargill lo resume en una frase, que el espaciotiempo fuera de una estrella es localmente plano y que la presencia del objeto solo se detecta globalmente, por un déficit angular. Y lo remata: está claro que en un mundo así no podría haber sistemas solares.

<figure>
  <img src="/img/universo2d-cono.png" alt="A la izquierda, un disco de papel al que le falta una cuña. Dos rectas paralelas, una azul y una verde, llegan a los bordes de la cuña por los puntos A y B y reaparecen por el borde opuesto, de modo que acaban cruzándose. Un punto naranja en reposo lleva la etiqueta no cae. A la derecha, el cono que sale al pegar los bordes." />
  <figcaption>Recorta una cuña de una hoja y pega los bordes: tienes un cono, y en cada trozo el papel sigue siendo plano. Una recta que llega al borde en A sale por el otro A. Dos rectas que iban paralelas acaban cruzándose detrás de la masa, sin que nada tire de ellas, y un objeto en reposo se queda donde está.</figcaption>
</figure>

Un cuerpo en reposo cerca de esa estrella no cae. No hay atracción. Mi segunda apuesta parecía ganar por goleada.

Hasta que metes una constante cosmológica negativa. El espaciotiempo con esa constante se llama AdS₃ (anti de Sitter en tres dimensiones), y en él las cosas sí se quedan ligadas. Hay estrellas de fluido finitas (Lubo, Rooman y Spindel encontraron que pedir fuentes finitas y sin viajes en el tiempo favorece justo este signo de la constante), estrellas de bosones que giran, y alrededor de una masa puntual las geodésicas de las partículas quedan atrapadas entre dos radios, sin escapar nunca al infinito.

Lo que yo habría dicho es: vale, pues ahí está, en AdS₃ la estrella sí atrae. Pero la cuenta dice otra cosa. Para una partícula que se mueve en esa geometría, la energía efectiva se comporta como la de una bola en un potencial

$$
V(r) = a + \frac{L^2}{\ell^2} + \frac{a L^2}{r^2} + \frac{r^2}{\ell^2}
$$

donde $\ell$ es el radio de curvatura del espacio, $L$ el momento angular de la partícula y $a$ mide la masa central ($a = 1$ es el espacio sin ninguna masa, y $0 < a < 1$ es el cono que deja una masa puntual).

El término importante es el último: crece como $r^2$, y no depende para nada de la masa. Ese potencial tiene un mínimo para cualquier $a$ positivo, también para $a = 1$, cuando no hay ninguna estrella. Incluso una partícula lanzada en línea recta acaba volviendo. El fondo AdS es una caja.

<figure>
  <img src="/img/universo2d-ads.png" alt="Energía efectiva de una partícula frente al radio para tres casos. El cono sin constante cosmológica baja siempre y no tiene mínimo. El cono en AdS₃ tiene un mínimo en r = 0,84 ℓ. AdS₃ sin ninguna masa también tiene un mínimo, en r = ℓ." />
  <figcaption>Sin constante cosmológica (naranja) la energía efectiva solo baja: la partícula se va. Con ella aparece un valle, haya masa (azul) o no la haya (morado discontinuo). El valle lo pone el universo, no la estrella.</figcaption>
</figure>

Así que mi segunda apuesta cae, pero por un lado que no esperaba. Sin atracción de Newton sí puede haber cosas dando vueltas y ligadas, pero no porque la estrella las atraiga, sino porque el universo entero las devuelve hacia el centro. Si eso basta para tener algo que se parezca a un planeta es otra pregunta, y sigue abierta.

## El modelo que no era el universo

Con AdS₃ como escapatoria, aquella noche la IA propuso hacer química. Y aquí viene la parte que yo no supe ver.

La idea era razonable: si el espacio de AdS₃ en un instante dado es una superficie de curvatura negativa constante (el plano hiperbólico, $H^2$, que se parece a una silla de montar que se abre por todas partes), resuelve la electrostática sobre esa superficie y pon ahí el átomo. La energía entre un protón y un electrón a distancia $d$ sobre $H^2$ sale

$$
W(d) = g \log \tanh\!\left(\frac{d}{2\ell}\right)
$$

A distancias cortas comparadas con $\ell$ esto es el logaritmo del plano de antes. A distancias largas, en cambio, la tangente hiperbólica tiende a 1 y el logaritmo tiende a cero: la atracción se apaga.

Comprobé que esa función es de verdad el potencial de una carga en $H^2$ (resuelve la ecuación de Laplace fuera de la carga y su flujo total es exactamente 1). La cuenta está bien. El problema es que no es la cuenta de AdS₃.

Si haces Maxwell de verdad en el espaciotiempo AdS₃, con su tiempo curvado incluido, el potencial de una carga sale

$$
A_t \propto \log \sinh\!\left(\frac{\rho}{\ell}\right)
$$

Que a distancias cortas coincide con el anterior y a distancias largas crece en línea recta con la distancia $\rho$, sin techo.

La diferencia entre las dos fórmulas es un solo factor: cuánto se dilata el tiempo según te alejas del centro (en relatividad se llama el lapse, y aquí vale $\cosh(\rho/\ell)$). El modelo de superficie curva se lo come. Y se nota muchísimo.

<figure>
  <img src="/img/universo2d-potenciales.png" alt="Energía entre un protón y un electrón frente a la distancia, para el plano, el plano hiperbólico H² y AdS₃ con ℓ = 2 a. Las tres curvas coinciden cerca del origen; lejos, la de H² se aplana hacia una constante, la del plano crece despacio y la de AdS₃ crece en línea recta." />
  <figcaption>Las tres curvas empiezan igual cerca del protón. Lejos, en el plano hiperbólico la atracción se apaga (curva azul pegada a la línea punteada) y el electrón podría escaparse; en AdS₃ con Maxwell completo crece en línea recta y no se escaparía nunca.</figcaption>
</figure>

Esto le da otra vuelta a la primera apuesta. En el modelo de la IA, lejos del protón la atracción se apaga, así que el electrón sí se puede ionizar. Y encima, en $H^2$ un electrón libre no puede tener cualquier energía: el espacio curvo le impone un mínimo de energía cinética,

$$
E_{\text{umbral}} = \frac{1}{8\ell^2}
$$

en unidades en las que $\hbar$ y la masa del electrón valen 1. Cuanto más curvo es el espacio (cuanto más pequeño es $\ell$), más cara le sale al electrón la libertad.

El átomo solo existe si su estado fundamental queda por debajo de ese umbral. Midiendo las longitudes en $a$, la longitud natural del átomo plano (la que sale de combinar $\hbar$, la masa del electrón y la intensidad $g$ de la atracción), el átomo queda ligado con seguridad para $\ell \geq 0{,}3873\,a$. Para $\ell = 0{,}1\,a$ y $0{,}25\,a$ no encontré ningún estado ligado.

<figure>
  <img src="/img/universo2d-umbral.png" alt="Energía del átomo menos el umbral 1/(8ℓ²) frente al radio de curvatura ℓ, en escala logarítmica. Por encima de ℓ = 0,3873 a la diferencia es negativa y crece en valor absoluto con ℓ; por debajo se pega a cero." />
  <figcaption>Por debajo de cero, el electrón tiene menos energía de la que necesitaría para irse y el átomo existe. Con el universo muy curvado (a la izquierda de la línea naranja) la curva se pega al umbral y el electrón se escapa.</figcaption>
</figure> O sea, en el modelo de la IA, si el universo está demasiado curvado no hay átomos. En el universo de verdad (Maxwell en AdS₃) el electrón no podría escaparse nunca. Los dos dicen cosas opuestas justo donde importa. Para ser justo, la IA ya avisaba aquella noche de que el modelo de la superficie no era Maxwell en AdS₃, pero lo dejaba en una advertencia, sin medir cuánto se separaban.

Lo bueno es que los valores de curvatura que se usaron aquella noche, $\ell = 2\,a$ y $\ell = 5\,a$, están muy lejos de ese borde. Para el átomo la diferencia no muerde. Para lo que venía después, ya veremos.

Algo parecido pasó con otra de las citas. La IA atribuyó el potencial logarítmico de Maxwell en AdS₃ a un artículo de Konewko y Winstanley. El artículo existe, y en él aparece un potencial logarítmico: el de un agujero negro cargado (el BTZ), no el del espacio AdS₃ vacío. La física que contaba era correcta (la comprobé para cualquier geometría de ese tipo); lo que fallaba es que la referencia no decía lo que le atribuía. Y la cita que me parecía inventada, la de Konovalov, era la buena.

## La molécula

Con un átomo en $H^2$ la pregunta natural es si dos protones pueden compartir un electrón. Es la molécula más simple que existe, H₂⁺: dos protones y un solo electrón.

El truco estándar es dejar los protones quietos a distancia $R$ (la aproximación de Born–Oppenheimer: los protones pesan tanto que el electrón se reajusta antes de que se muevan) y probar un orbital para el electrón. Aquella noche se usó el más sencillo: el orbital del átomo aislado, trasladado a una distancia $d$ de uno de los protones a lo largo de la línea que los une. La pregunta es si esa configuración tiene menos energía que un átomo con el otro protón infinitamente lejos. Si la tiene, hay enlace.

La cuenta se puede hacer con un teorema de la cáscara, igual que el de Newton para la Tierra: un anillo de carga se ve desde fuera como si toda estuviera en el centro, y desde dentro no se nota. Con él, la diferencia de energía queda

$$
\Delta E = F(d) - F(0) + F(R - d) - W(R)
$$

donde $F(s)$ es la atracción entre un protón y la nube del electrón cuando el centro de la nube está a distancia $s$ de él. Leída de izquierda a derecha: lo que cuesta alejar la nube de su protón, lo que se gana porque el otro protón la atrae, y la repulsión entre los dos protones. Si el total es negativo, la molécula se mantiene.

Rehíce todo desde cero, por mi cuenta. Y el número salió igual.

Para $\ell = 2\,a$, con $R = 1{,}5\,a$ y el orbital a medio camino ($d = 0{,}75\,a$), la IA me había dado $\Delta E = -0{,}12659\,g$. Mi cálculo da $-0{,}12660\,g$. Para $\ell = 5\,a$, me había dado $-0{,}14504\,g$ y a mí me sale $-0{,}14505\,g$. La diferencia es de una unidad en la quinta decimal. El mínimo de la curva lo ponían en $R \approx 1{,}5$–$1{,}6\,a$ y a mí me sale en $R = 1{,}540\,a$ y $1{,}585\,a$.

Hubo un momento en el que pensé que no iba a coincidir. La forma más ingenua de plantear el cálculo (la que habría hecho yo sin pensar) converge tan despacio que, aun afinándolo muchísimo, la energía del átomo todavía baila en la segunda cifra y $\Delta E$ se queda en $-0{,}141$. Hay que tratar con cuidado lo que pasa justo en el centro del átomo, y entonces converge limpia. Los números de la IA coincidían con la forma buena, no con la ingenua. Eso me convenció todavía más de que la máquina había hecho las cuentas bien.

Así que ahí estaba mi tercera apuesta, ganando: una cienmilésima de diferencia, mismo mínimo, misma molécula.

## El pozo que no se cerraba

La IA contaba la historia de la molécula con una frase: la energía tiene un pozo entre $R \approx 1$ y $R \approx 3$. Por debajo de 1 los protones se repelen demasiado, por encima de 3 la molécula se rompe, y en medio se forma el enlace. Es la imagen de libro de una molécula, con su curva en forma de cuchara.

Mi cálculo reproducía esa frase. Pero al dibujar la curva me di cuenta de que había hecho exactamente lo mismo que la IA: dejar el orbital fijo a medio camino entre los dos protones, $d = R/2$, para todas las distancias. Con eso, $\Delta E$ es negativo entre $R = 0{,}960\,a$ y $R = 2{,}382\,a$ para $\ell = 2\,a$ (y entre $0{,}946\,a$ y $2{,}568\,a$ para $\ell = 5\,a$). Un pozo entre 1 y 3, más o menos.

Pero nada obliga a poner el electrón en el medio. Es un parámetro del orbital de prueba, y el principio variacional dice que hay que buscar el que dé menos energía. Y si dejas que $d$ busque su mejor valor, el pozo no se cierra.

<figure>
  <img src="/img/universo2d-enlace.png" alt="Dos paneles. A la izquierda, diferencia de energía del H₂⁺ frente a la distancia entre protones R, para ℓ = 2 a, ℓ = 5 a y el plano. A la derecha, menos esa diferencia en escala logarítmica entre R = 3 y 14 a, con el electrón en su mejor sitio, siempre positiva. Las curvas discontinuas, con el orbital a medio camino, vuelven a cruzar cero entre R = 2,4 y 2,6; las continuas, con el orbital en su mejor posición, se quedan por debajo de cero y se acercan a él poco a poco." />
  <figcaption>Curvas discontinuas: orbital fijo a medio camino entre los protones, la imagen de aquella noche, con un pozo que se cierra. Curvas continuas: orbital en su mejor posición. Coinciden cerca del mínimo y luego se separan: la energía ya no vuelve a cero. A la derecha, la curva continua vista de lejos en escala logarítmica: cada vez más pequeña, pero siempre por debajo de cero hasta R = 14 a.</figcaption>
</figure>

Con $d$ óptimo, $\Delta E$ sigue siendo negativo hasta $R = 14\,a$ como mínimo, que es lo más lejos que calculé ($-5{,}7 \cdot 10^{-7}\,g$ para $\ell = 2\,a$ y $-2{,}2 \cdot 10^{-4}\,g$ para $\ell = 5\,a$). Cada vez más pequeño, pero negativo.

El mecanismo es bonito y se ve mejor en el plano. A distancia grande no conviene poner el electrón en el medio: conviene dejarlo casi en su protón y desplazar su nube un poquito hacia el otro. Desplazarla una distancia $d$ cuesta una energía que crece como $d^2$ (solo se nota la parte de la nube que queda «dentro» del desplazamiento), y lo que se gana por acercarse al otro protón crece como $d$. Un coste cuadrático contra una ganancia lineal: siempre hay un desplazamiento pequeño que sale a cuenta. Optimizando,

$$
\Delta E \leq -\frac{g}{2\pi \rho_0 R^2}
$$

donde $\rho_0$ es la densidad del electrón en el centro del átomo. Es decir, a gran distancia el protón lejano polariza el átomo y eso siempre baja la energía, como $-1/R^2$. Lo comprobé numéricamente: el cociente entre el cálculo exacto y esta fórmula se acerca a 1 según crece $R$, y en $R = 40\,a$ vale 1,0008.

Se ve muy bien si pintas la nube del electrón sobre el plano hiperbólico. Para dibujar una superficie que se abre por todas partes se usa el disco de Poincaré: todo el plano infinito cabe dentro de un círculo, y las distancias se van encogiendo hacia el borde (los círculos finos marcan distancias de 1, 2, 4, 6 y 8 veces $a$ desde el centro, que se apelotonan contra el borde).

<figure>
  <img src="/img/universo2d-disco.png" alt="Tres discos de Poincaré con la densidad del electrón en colores cálidos. En el primero, el átomo solo, con la nube centrada en el protón. En el segundo, dos protones a 1,54 a y la nube centrada a medio camino. En el tercero, dos protones a 6 a, el segundo pegado al borde del disco, y la nube casi en el primer protón." />
  <figcaption>Izquierda: el átomo solo, con ℓ = 2 a. Centro: la molécula en su mínimo, con la nube a medio camino entre los dos protones (cruces). Derecha: con los protones a 6 a, el mejor sitio para la nube está a 0,039 a de su protón, casi encima. Esa nube un poquito torcida hacia el otro protón es lo que mantiene el enlace.</figcaption>
</figure>

Puedes jugar tú con las dos cosas a la vez: separar los protones y mover el electrón.

<figure>
  <iframe src="/simuladores/universo2d-molecula.html" title="Explorador interactivo de la molécula H₂⁺: deslizadores para la distancia entre protones y el desplazamiento del electrón, con la energía resultante" loading="lazy" style="width:100%;height:min(88vh,640px);border:1px solid rgba(128,128,128,.35);border-radius:6px;"></iframe>
  <figcaption>Mueve R con el electrón a medio camino (d al máximo) y verás el pozo de la IA cerrarse hacia R ≈ 2,4. Ahora marca «pon el electrón en su mejor sitio»: el punto se queda por debajo de cero hasta el final de la escala.</figcaption>
</figure>

Y aquí cae la tercera apuesta. Los números de la IA eran correctos salvo una cienmilésima. Su mínimo estaba donde decía. Y la historia que contaban esos números, la del pozo que acaba en $R \approx 3$, era falsa: describía una restricción del orbital de prueba, no la molécula. La energía nunca vuelve a subir hasta cero en lo que yo he calculado. Lo que hay es un mínimo cerca de $R \approx 1{,}55\,a$ y luego una pendiente larguísima que se aplana sin cruzar nunca.

## Repetir no es comprobar

Lo que más me ha costado digerir de todo esto es que mi propia comprobación habría dado la historia por buena. Rehíce la cuenta, salieron los mismos números, y lo que me pedía el cuerpo era cerrar el portátil y decir que la IA tenía razón. Pero coincidir en los números solo dice que hemos hecho la misma cuenta. Si la cuenta llevaba dentro una elección arbitraria (poner el electrón en el medio), reproducirla reproduce también la elección.

Esto no es exclusivo de la física ni de las IA. Cuando un auditor rehace las sumas de una empresa y cuadran, sabe que nadie se ha equivocado sumando, no que las partidas digan lo que la empresa cree que dicen. Cuando rehaces el análisis de un artículo con sus mismos datos y te salen sus figuras, has reproducido el artículo, no lo has replicado: los mismos supuestos producen los mismos resultados. Es primo hermano de lo que contaba en [la entrada sobre quién comprueba a la máquina](/blog/quien-comprueba-a-la-maquina): el verificador es fiable dentro de su frontera, y el error vive en la frontera. Aquí la frontera no era un teorema mal enunciado, sino una pregunta que nadie le hizo a la curva: ¿y si muevo el electrón?

Volviendo a mi hermana y a su pregunta soñada. Sí, puede haber átomos en dos dimensiones, y en un plano son incluso más átomos que los nuestros, porque el electrón no se puede escapar nunca. En un universo de 2+1 dimensiones con gravedad de Einstein, la vía que encontramos para que algo se quede ligado es que el propio espacio tenga curvatura negativa y haga de caja. En el modelo de superficie curva que usamos aquella noche, el átomo existe si el universo no está demasiado curvado, y dos protones pueden compartir un electrón. Y la molécula no se rompe donde me dijeron.

Lo que queda sin cerrar es bastante. La molécula la he estudiado con la electrostática sobre la superficie curva, no con Einstein y Maxwell en AdS₃ completo, y ya hemos visto que esos dos modelos se separan justo a gran distancia, que es donde vive el giro de esta historia. Lo que he calculado es una cota superior con un orbital de prueba, no la curva de energía de verdad, y falta la energía de punto cero de los protones (que vibran aunque estén en el fondo del pozo), que podría tragarse un pozo tan poco profundo. Que el mínimo esté a una distancia finita depende además de dos hechos estándar que no he demostrado aquí. Por debajo de $\ell \approx 0{,}39\,a$ el átomo de ese modelo probablemente no existe, pero un estado ligado muy débil podría no caber en mi cálculo. Y aquella noche salieron más temas (magnetismo, iones negativos, agujeros negros) que todavía no he rehecho.

### Referencias

- M. Lubo, M. Rooman y Ph. Spindel, [(2+1)-dimensional stars](https://doi.org/10.1103/PhysRevD.59.044012), Phys. Rev. D 59, 044012 (1999).
- K. Sakamoto y K. Shiraishi, [Rotating boson stars with large self-interaction in 2+1 dimensions](https://doi.org/10.1103/PhysRevD.62.124014), Phys. Rev. D 62, 124014 (2000).
- C. Martínez, N. Parra, N. Valdés y J. Zanelli, [Geodesic structure of naked singularities in AdS₃ spacetime](https://doi.org/10.1103/PhysRevD.100.024026), Phys. Rev. D 100, 024026 (2019).
- J. H. C. Scargill, [Existence of life in 2 + 1 dimensions](https://doi.org/10.1103/PhysRevResearch.2.013217), Phys. Rev. Research 2, 013217 (2020).
- S. Konewko y E. Winstanley, [Charge superradiance on charged BTZ black holes](https://doi.org/10.1140/epjc/s10052-024-12910-7), Eur. Phys. J. C 84, 594 (2024).
- D. Konovalov, [Radial models of helium and atomic hydrogen in two and three dimensions](https://doi.org/10.1007/s00601-026-02080-5), Few-Body Systems 67, 59 (2026).
- S. Deser, R. Jackiw y G. 't Hooft, [Three-dimensional Einstein gravity: dynamics of flat space](https://doi.org/10.1016/0003-4916(84)90085-X), Ann. Phys. 152, 220 (1984).
- J. Montaldi y C. Nava-Gaxiola, [Point vortices on the hyperbolic plane](https://doi.org/10.1063/1.4897210), J. Math. Phys. 55, 102702 (2014).
