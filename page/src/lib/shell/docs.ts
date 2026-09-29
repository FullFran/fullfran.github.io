import type { Locale } from '../../data/site';
import { site } from '../../data/site';

// Command documentation shared by `help` (summary + example) and `man` (the rest).
export interface HelpItem { cmd: string; summary: string; example: (l: Locale) => string }
export interface HelpGroup { title: string; items: HelpItem[] }

const aboutOf = (l: Locale) => site[l].aboutFile;

export const HELP: Record<Locale, HelpGroup[]> = {
  es: [
    { title: 'Moverse', items: [
      { cmd: 'ls', summary: 'ver qué hay aquí', example: () => 'ls blog' },
      { cmd: 'cd', summary: 'entrar en una carpeta', example: () => 'cd blog' },
      { cmd: 'pwd', summary: 'saber dónde estás', example: () => 'pwd' },
      { cmd: 'tree', summary: 'ver todo como un árbol', example: () => 'tree' },
    ] },
    { title: 'Leer', items: [
      { cmd: 'cat', summary: 'leer un fichero', example: (l) => `cat ${aboutOf(l)}` },
      { cmd: 'head', summary: 'ver solo el principio', example: (l) => `head -n 3 ${aboutOf(l)}` },
      { cmd: 'grep', summary: 'buscar una palabra en todo', example: () => 'grep teclado' },
      { cmd: 'whoami', summary: 'quién soy', example: () => 'whoami' },
      { cmd: 'man', summary: 'el manual de un comando', example: () => 'man ls' },
    ] },
    { title: 'Abrir', items: [
      { cmd: 'vi', summary: 'leer en modo vim', example: (l) => `vi ${aboutOf(l)}` },
      { cmd: 'nano', summary: 'leer en modo nano', example: (l) => `nano ${aboutOf(l)}` },
      { cmd: 'open', summary: 'abrir en la web', example: () => 'open cv' },
    ] },
    { title: 'Otros', items: [
      { cmd: 'neofetch', summary: 'mi setup', example: () => 'neofetch' },
      { cmd: 'history', summary: 'comandos anteriores', example: () => 'history' },
      { cmd: 'clear', summary: 'limpiar la pantalla', example: () => 'clear' },
      { cmd: 'exit', summary: 'volver a la web (también :q)', example: () => 'exit' },
    ] },
  ],
  en: [
    { title: 'Move around', items: [
      { cmd: 'ls', summary: 'list what is here', example: () => 'ls blog' },
      { cmd: 'cd', summary: 'enter a folder', example: () => 'cd blog' },
      { cmd: 'pwd', summary: 'see where you are', example: () => 'pwd' },
      { cmd: 'tree', summary: 'see everything as a tree', example: () => 'tree' },
    ] },
    { title: 'Read', items: [
      { cmd: 'cat', summary: 'read a file', example: (l) => `cat ${aboutOf(l)}` },
      { cmd: 'head', summary: 'see only the start', example: (l) => `head -n 3 ${aboutOf(l)}` },
      { cmd: 'grep', summary: 'search a word everywhere', example: () => 'grep keyboard' },
      { cmd: 'whoami', summary: 'who I am', example: () => 'whoami' },
      { cmd: 'man', summary: 'the manual of a command', example: () => 'man ls' },
    ] },
    { title: 'Open', items: [
      { cmd: 'vi', summary: 'read in vim mode', example: (l) => `vi ${aboutOf(l)}` },
      { cmd: 'nano', summary: 'read in nano mode', example: (l) => `nano ${aboutOf(l)}` },
      { cmd: 'open', summary: 'open on the web', example: () => 'open cv' },
    ] },
    { title: 'Other', items: [
      { cmd: 'neofetch', summary: 'my setup', example: () => 'neofetch' },
      { cmd: 'history', summary: 'previous commands', example: () => 'history' },
      { cmd: 'clear', summary: 'clear the screen', example: () => 'clear' },
      { cmd: 'exit', summary: 'back to the web (also :q)', example: () => 'exit' },
    ] },
  ],
};

export interface ManPage {
  // Only for pages whose command is not listed in HELP.
  summary?: string;
  synopsis: string;
  description: string;
  examples: string[];
}

// Examples may use {about} for the locale's about file.
export const MAN: Record<Locale, Record<string, ManPage>> = {
  es: {
    ls: { synopsis: 'ls [-l] [-a] [ruta]', description: 'Lista lo que hay en una carpeta. Con -l muestra fechas y tamaños; con -a también los ficheros ocultos (los que empiezan por punto).', examples: ['ls', 'ls blog', 'ls -a'] },
    cd: { synopsis: 'cd [ruta]', description: 'Cambia de carpeta. Sin ruta vuelve a casa; con .. sube un nivel.', examples: ['cd blog', 'cd ..', 'cd'] },
    pwd: { synopsis: 'pwd', description: 'Muestra la ruta completa de la carpeta donde estás.', examples: ['pwd'] },
    tree: { synopsis: 'tree [-a] [ruta]', description: 'Dibuja las carpetas y ficheros como un árbol. Toca cualquier nombre para abrirlo.', examples: ['tree', 'tree blog', 'tree -a'] },
    cat: { synopsis: 'cat <fichero>...', description: 'Muestra el contenido de uno o varios ficheros. Es la forma más rápida de leer un post.', examples: ['cat {about}', 'cat ahora.txt'] },
    head: { synopsis: 'head [-n N] <fichero>', description: 'Muestra las primeras N líneas de un fichero (10 por defecto).', examples: ['head -n 3 {about}'] },
    tail: { summary: 'ver solo el final', synopsis: 'tail [-n N] <fichero>', description: 'Muestra las últimas N líneas de un fichero (10 por defecto).', examples: ['tail -n 3 {about}'] },
    grep: { synopsis: 'grep <texto> [ruta]', description: 'Busca una palabra en todos los ficheros, sin distinguir mayúsculas. Toca el nombre de un resultado para leer ese fichero.', examples: ['grep teclado', 'grep física blog'] },
    whoami: { synopsis: 'whoami', description: 'Dice quién soy, en una línea.', examples: ['whoami'] },
    man: { synopsis: 'man <comando>', description: 'Muestra esta página de manual para un comando.', examples: ['man ls', 'man tree'] },
    vi: { synopsis: 'vi <fichero>', description: 'Abre un fichero en el visor tipo vim. Se sale con :q. También responden vim, nvim, less y more.', examples: ['vi {about}'] },
    nano: { synopsis: 'nano <fichero>', description: 'Abre un fichero en un visor tipo nano, de solo lectura. Se sale con Ctrl+X, Escape, q o el botón ^X Salir.', examples: ['nano {about}'] },
    open: { synopsis: 'open <destino>', description: 'Abre algo en la web: un post, cv, teclado, o un enlace como github o linkedin.', examples: ['open cv', 'open github', 'open teclado'] },
    neofetch: { synopsis: 'neofetch', description: 'Enseña mi setup: sistema, terminal, editor y teclado.', examples: ['neofetch'] },
    history: { synopsis: 'history', description: 'Lista los comandos que has escrito en esta sesión.', examples: ['history'] },
    clear: { synopsis: 'clear', description: 'Limpia la pantalla. También vale Ctrl+L.', examples: ['clear'] },
    exit: { synopsis: 'exit', description: 'Sale de la terminal y vuelve a la web. También valen salir, quit, q y :q.', examples: ['exit', ':q'] },
    help: { summary: 'lista de comandos con ejemplos', synopsis: 'help', description: 'Enseña los comandos agrupados, cada uno con un ejemplo que puedes tocar. También vale ayuda o ?.', examples: ['help'] },
    echo: { summary: 'repetir un texto', synopsis: 'echo <texto>', description: 'Escribe el texto que le pases.', examples: ['echo hola'] },
    date: { summary: 'fecha y hora', synopsis: 'date', description: 'Muestra la fecha y la hora actuales.', examples: ['date'] },
  },
  en: {
    ls: { synopsis: 'ls [-l] [-a] [path]', description: 'Lists what is in a folder. With -l it shows dates and sizes; with -a it also shows hidden files (the ones starting with a dot).', examples: ['ls', 'ls blog', 'ls -a'] },
    cd: { synopsis: 'cd [path]', description: 'Changes folder. With no path it goes home; with .. it goes up one level.', examples: ['cd blog', 'cd ..', 'cd'] },
    pwd: { synopsis: 'pwd', description: 'Prints the full path of the folder you are in.', examples: ['pwd'] },
    tree: { synopsis: 'tree [-a] [path]', description: 'Draws folders and files as a tree. Tap any name to open it.', examples: ['tree', 'tree blog', 'tree -a'] },
    cat: { synopsis: 'cat <file>...', description: 'Prints the content of one or more files. The quickest way to read a post.', examples: ['cat {about}', 'cat now.txt'] },
    head: { synopsis: 'head [-n N] <file>', description: 'Prints the first N lines of a file (10 by default).', examples: ['head -n 3 {about}'] },
    tail: { summary: 'see only the end', synopsis: 'tail [-n N] <file>', description: 'Prints the last N lines of a file (10 by default).', examples: ['tail -n 3 {about}'] },
    grep: { synopsis: 'grep <text> [path]', description: 'Searches a word in all files, ignoring case. Tap a result name to read that file.', examples: ['grep keyboard', 'grep physics blog'] },
    whoami: { synopsis: 'whoami', description: 'Says who I am, in one line.', examples: ['whoami'] },
    man: { synopsis: 'man <command>', description: 'Shows this manual page for a command.', examples: ['man ls', 'man tree'] },
    vi: { synopsis: 'vi <file>', description: 'Opens a file in the vim-like viewer. Leave with :q. vim, nvim, less and more work too.', examples: ['vi {about}'] },
    nano: { synopsis: 'nano <file>', description: 'Opens a file in a read-only nano-like viewer. Leave with Ctrl+X, Escape, q or the ^X Exit button.', examples: ['nano {about}'] },
    open: { synopsis: 'open <target>', description: 'Opens something on the web: a post, cv, teclado, or a link such as github or linkedin.', examples: ['open cv', 'open github', 'open teclado'] },
    neofetch: { synopsis: 'neofetch', description: 'Shows my setup: system, terminal, editor and keyboard.', examples: ['neofetch'] },
    history: { synopsis: 'history', description: 'Lists the commands you typed in this session.', examples: ['history'] },
    clear: { synopsis: 'clear', description: 'Clears the screen. Ctrl+L works too.', examples: ['clear'] },
    exit: { synopsis: 'exit', description: 'Leaves the terminal and goes back to the web. exit, quit, q and :q all work.', examples: ['exit', ':q'] },
    help: { summary: 'list of commands with examples', synopsis: 'help', description: 'Shows the commands in groups, each with an example you can tap. Also works as ayuda or ?.', examples: ['help'] },
    echo: { summary: 'repeat a text', synopsis: 'echo <text>', description: 'Prints the text you give it.', examples: ['echo hello'] },
    date: { summary: 'date and time', synopsis: 'date', description: 'Shows the current date and time.', examples: ['date'] },
  },
};

// Commands that share another command's page.
export const MAN_ALIASES: Record<string, string> = { vim: 'vi', nvim: 'vi', less: 'vi', more: 'vi' };

export const MAN_HEADINGS: Record<Locale, { name: string; synopsis: string; description: string; examples: string }> = {
  es: { name: 'NOMBRE', synopsis: 'SINOPSIS', description: 'DESCRIPCIÓN', examples: 'EJEMPLOS' },
  en: { name: 'NAME', synopsis: 'SYNOPSIS', description: 'DESCRIPTION', examples: 'EXAMPLES' },
};
