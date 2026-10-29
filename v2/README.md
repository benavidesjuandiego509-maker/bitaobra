# BitaObra: bitácora electrónica de obra

Aplicación web instalable (PWA) para llevar el diario de obra (bitácora) en el teléfono, con firma electrónica de cada nota y sin necesidad de internet. Sigue el numeral 8.4, ítem 8, del Manual de Interventoría Obra Pública del INVIAS (MEPI-MN1, 2022): la bitácora se lleva junto con el constructor, permanece en la oficina de campo de la interventoría, se inicia en la reunión técnica inicial y registra sucesos, instrucciones, observaciones, ejecuciones y determinaciones.

| Pestaña | Qué hace |
|---|---|
| Hoy | Registro diario de la jornada. Un medidor muestra cuántos de los 11 contenidos mínimos (D1 a D11) están completos y lleva al campo que falta. |
| Notas | Instrucción, observación, determinación, solicitud y respuesta (enlazada a la nota que responde). Notas pendientes de enterado, borradores y nota de cierre. |
| Bitácora | Todas las notas firmadas en orden, su estado de enterado, la verificación de integridad, el PDF de la bitácora y la copia JSON para verificar. |
| Proyecto | Datos del contrato, firmantes (con cédula, matrícula profesional y huella de su clave), nota de apertura y respaldo. |

## Firma electrónica

- Cada firmante crea en el teléfono una clave ECDSA P-256. La clave privada queda cifrada con su PIN (PBKDF2 con 150 000 iteraciones y AES-GCM) y nunca sale del dispositivo; la copia JSON solo lleva claves públicas.
- La nota de apertura registra a los firmantes con la huella de su clave, el horario, el plazo para firmar de enterado y el acuerdo de firma electrónica (Ley 527 de 1999, art. 7; Decreto 1074 de 2015, arts. 2.2.2.47.1 a 2.2.2.47.8).
- Al firmar, la nota recibe su número consecutivo y se sella con el hash SHA-256 de su contenido (incluidas las huellas de sus fotos) y el hash de la nota anterior. Ya no se edita.
- La otra parte firma de enterado. Si no lo hace dentro del plazo pactado, la nota se tiene por aceptada.
- Un error se corrige con «Anular y reemplazar»: una nota nueva que anula la anterior y dice por qué.
- «Verificar la bitácora» recalcula la cadena y comprueba cada firma contra las claves de la nota de apertura. En el ejemplo, «Simular una alteración» muestra cómo se detecta un dato cambiado.

Los códigos de criterio (D1 a D11, N1 a N6, K1, K2, A1) son los de la lista de verificación del Anexo 1 del documento.

## Dictado por voz

Las áreas de texto y los campos Actividad, Localización, Asunto y Ubicación tienen un micrófono. Al tocarlo, lo que se dice se escribe en el campo; se toca de nuevo para terminar. Usa el reconocimiento de voz del navegador (Chrome en Android, Safari en iPhone) y necesita internet. Sin señal, sirve el micrófono del teclado del celular. En iPhone funciona en Safari, no dentro de la app instalada.

## Cómo ejecutarlo

```bash
cd app
python3 -m http.server 8000
```

Abrir `http://localhost:8000`.

## Instalar en el teléfono

La instalación y el modo sin conexión exigen HTTPS, así que la app se publica en GitHub Pages, en la subcarpeta `v2/` del repositorio de la versión 1 (`BitaObra\publicar\v2` en el PC): https://benavidesjuandiego509-maker.github.io/bitaobra/v2/

- Android (Chrome): abrir el enlace, menú ⋮ → «Instalar aplicación» o «Agregar a pantalla principal».
- iPhone (Safari): abrir el enlace, botón Compartir → «Agregar a pantalla de inicio».

Queda con el nombre «BitaObra v2». Los datos y las claves se guardan en el teléfono.

## Archivos

- `bitaobra.html`: código fuente (HTML, CSS y JavaScript, sin dependencias salvo jsPDF).
- `build.py`: genera `index.html`, la versión instalable, a partir de `bitaobra.html`. Ejecutar `python3 build.py` después de cada cambio.
- `index.html`, `manifest.webmanifest`, `sw.js`, `icon.svg`, `icon-192.png`, `icon-512.png`: archivos de la PWA.
- `vendor/jspdf.umd.min.js`: jsPDF 2.5.1 (licencia MIT) para generar PDF sin conexión.

## Límites

- La bitácora vive en un solo dispositivo, como el libro físico en la oficina de campo. Cada parte recibe la copia JSON exportada; la sincronización entre teléfonos queda como trabajo futuro.
- La firma es electrónica, no digital certificada: su fuerza probatoria depende del acuerdo de las partes en la nota de apertura y de que la entidad la acepte (Manual INVIAS, numeral 6, ítem 8).
- Si se pierde el teléfono sin copia exportada, se pierde la bitácora; si se olvida el PIN, ese firmante no puede volver a firmar.
- El contrato que trae al abrir es ficticio y está marcado como ejemplo (PIN 123456); «Empezar mi proyecto» lo borra.
