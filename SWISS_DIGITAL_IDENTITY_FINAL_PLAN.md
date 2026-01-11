# DIGITALE IDENTITÄT SCHWEIZ — Finale Produktspezifikation

## Strategische Arbeitsgruppe

### Teilnehmer

#### Schweizerische Eidgenossenschaft

**Dr. Lukas Meier**  
*Leiter Digitale Transformation, Bundesamt für Informatik und Telekommunikation (BIT)*
> "Die Schweiz steht für Präzision, Vertrauen und Qualität. Unsere digitale Identitätslösung muss diese Werte in jedem Pixel verkörpern. Keine Spielereien — nur klare, verständliche Technologie, die Vertrauen schafft."

**Regula Schneider-Wyss**  
*Projektleiterin E-Government, Staatssekretariat für Wirtschaft (SECO)*
> "Wir präsentieren an der Swiss B2B Expo vor 200 Entscheidungsträgern aus Wirtschaft und Verwaltung. Die Installation muss in 30 Sekunden überzeugen und die Frage beantworten: Warum kann man der Schweizer Digitalinfrastruktur vertrauen?"

---

#### Awwwards Jury Panel

**Naomi Chen** — *UX Director, IDEO Tokyo*  
**Marcus Lindqvist** — *Creative Director, North Kingdom*  
**Isabella Fontaine** — *Digital Art Director, Barbarian Group*

---

## Kritische Analyse der aktuellen Lösung

### Awwwards Jury Feedback

**Naomi Chen:**
> "Die Partikel sind reines visuelles Rauschen. Sie kommunizieren nichts. Ein professioneller digitaler Zwilling braucht Struktur, Hierarchie und Bedeutung. Aktuell sieht es aus wie ein defekter Bildschirm."

**Marcus Lindqvist:**
> "Wo ist die Geschichte? Der Nutzer sieht chaotische Punkte — keine Verbindung zu 'Identität' oder 'Vertrauen'. Für ein Regierungsprojekt ist das fatal. Es wirkt wie ein Hackathon-Prototyp, nicht wie eine 175.000 CHF Installation."

**Isabella Fontaine:**
> "Das grösste Problem: Es gibt keinen 'Aha-Moment'. Der Besucher muss sofort verstehen, was passiert. Aktuell: Verwirrung. Partikel sind ein Klischee aus 2015. Die Schweiz verdient etwas Einzigartiges."

### Dr. Lukas Meier (BIT):
> "Ich stimme zu. Das vermittelt nicht Vertrauen, sondern Chaos. Wir brauchen eine Visualisierung, die zeigt: 'Ihre Daten sind sicher, Ihre Identität ist geschützt, die Technologie funktioniert präzise.'"

### Regula Schneider-Wyss (SECO):
> "An der Expo haben wir 30-60 Sekunden pro Besucher. Die aktuelle Lösung braucht Erklärung. Wir brauchen etwas Selbsterklärendes."

---

## Finale Produktvision: IDENTITÄTSSPIEGEL

### Konzept

**Nicht Partikel. Ein Präzisions-Biometrie-Scanner.**

Die Installation simuliert einen hochmodernen biometrischen Identitäts-Scanner im Stil eines Schweizer Sicherheitssystems. Der Besucher sieht sich selbst — aber durch die Linse modernster Erkennungstechnologie.

### Metapher

> "Sie schauen in einen Spiegel und sehen, wie die Schweiz Sie sieht: präzise, respektvoll, sicher."

---

## Die Drei Schichten

### Schicht 1: Der Spiegel (Hintergrund)
- Hochauflösendes Live-Kamerabild des Besuchers
- Leicht entsättigt und weichgezeichnet
- Wirkt wie eine elegante Spiegelung
- **Zweck:** Sofortige Selbsterkennung, emotionale Verbindung

### Schicht 2: Das Biometrie-Raster (Mittelebene)
- Präzises geometrisches Mesh über dem Gesicht
- Saubere Linien, keine chaotischen Punkte
- Triangulierte Polygone basierend auf MediaPipe-Landmarks
- Animiert: Linien "scannen" das Gesicht von oben nach unten
- **Farbe:** Schweizer Rot (#DC0018) mit weissem Glow
- **Zweck:** Zeigt die Technologie, die "arbeitet"

### Schicht 3: Die Datenebene (Vordergrund)
- Schwebendes UI mit Echtzeitdaten
- Erkannte Merkmale: "Gesicht erkannt ✓"
- Vertrauensindikatoren: "Identität verifiziert"
- Keine persönlichen Daten — nur Statusmeldungen
- **Zweck:** Kommuniziert Erfolg und Sicherheit

---

## Visuelle Sprache

### Farbpalette (Bundesfarben)

| Element | Farbe | Hex |
|---------|-------|-----|
| Primär (Akzente) | Bundesrot | #DC0018 |
| Sekundär | Bundesblau | #2F5496 |
| Hintergrund | Reinweiss | #FFFFFF |
| Text | Anthrazit | #1A1A1A |
| Raster-Linien | Rot mit 60% Opazität | rgba(220,0,24,0.6) |
| Erfolg | Schweizer Grün | #00843D |

### Typografie

- **Headlines:** Helvetica Neue Bold
- **Body:** Helvetica Neue Light
- **Daten:** SF Mono (monospace für technischen Look)

### Design-Prinzipien

1. **Weissraum dominiert** — Nicht dunkler Tech-Look
2. **Linien statt Punkte** — Präzision statt Chaos
3. **Animate with purpose** — Jede Bewegung hat Bedeutung
4. **Text unterstützt** — Klare Statusmeldungen

---

## User Journey (30 Sekunden)

### Sekunde 0-5: ANNÄHERUNG
**Display:** Ruhezustand mit Schweizer Kreuz und Text
```
DIGITALE IDENTITÄT
Treten Sie näher
```
- Minimalistisch, einladend
- Subtile Puls-Animation am Schweizer Kreuz

### Sekunde 5-10: ERKENNUNG
**Trigger:** Person betritt Erkennungszone
**Display:** Kamerabild erscheint sanft
- Text: "Gesicht wird gesucht..."
- Horizontaler Scan-Balken bewegt sich über Bildschirm

### Sekunde 10-18: ANALYSE
**Display:** Biometrie-Mesh erscheint über Gesicht
- Polygonales Mesh baut sich auf (nicht alles auf einmal)
- Startet an der Stirn, fliesst nach unten
- Jede Linie erscheint mit leichtem Delay
- Hände: Wenn sichtbar, werden Skelett-Linien gezeichnet
- Text wechselt: "Analysiere Merkmale..."
- Numerische Anzeige: "468 Referenzpunkte erfasst"

### Sekunde 18-25: VERIFIKATION
**Display:** Mesh wird grün, Erfolgsanimation
- Mesh-Farbe wechselt von Rot zu Grün (#00843D)
- Animierter Kreis um das Gesicht
- Text: "IDENTITÄT VERIFIZIERT"
- Schweizer Kreuz erscheint mit Checkmark
- Sound: Dezenter Bestätigungston (optional)

### Sekunde 25-30: RESULTAT
**Display:** Zusammenfassung
```
┌─────────────────────────────────────┐
│  ✓ IDENTITÄT VERIFIZIERT            │
│                                     │
│  Gesicht: Erkannt                   │
│  Hände: 2 erkannt                   │
│  Verarbeitungszeit: 0.8s            │
│                                     │
│  [Mehr erfahren]                    │
└─────────────────────────────────────┘
```
- Karte schwebt neben dem Gesicht
- CTA für weitere Informationen

### Nach 30 Sekunden: RESET
- Sanfter Übergang zurück zum Ruhezustand
- Bereit für nächsten Besucher

---

## Technische Architektur

### Kern-Technologien

1. **MediaPipe Face Landmarker** — 468 Gesichtspunkte
2. **MediaPipe Hand Landmarker** — 21 Punkte × 2 Hände
3. **Canvas 2D** — Für Mesh-Rendering (performant)
4. **CSS Animations** — Für UI-Elemente (GPU-beschleunigt)

### Rendering-Pipeline

```
Kamera → MediaPipe → Landmarks → Mesh-Generator → Canvas Render → Compositing
                                      ↓
                               Status-Update → UI-Layer
```

### Performance-Ziele

| Metrik | Ziel |
|--------|------|
| FPS | 60 konstant |
| Latenz | < 100ms |
| Mesh-Punkte | 468 (Gesicht) + 42 (Hände) |
| Speicher | < 200MB |

---

## Mesh-Design-Spezifikation

### Gesichts-Mesh

**Philosophie:** Nicht alle 468 Punkte verbinden. Nur ästhetisch relevante Strukturen.

**Zu rendernde Regionen:**
1. **Gesichtsumriss** — Oval von Stirn bis Kinn
2. **Augenbrauen** — Definierte Bögen
3. **Augenkontur** — Mandelförmige Umrandung
4. **Nasenrücken** — Zentrale vertikale Linie
5. **Lippenkontur** — Obere und untere Lippe
6. **Wangenknochen** — Horizontale Akzente

**Nicht rendern:**
- Innere Pupillen (zu detailliert)
- Zahnreihen (unnötig)
- Jedes einzelne Landmark (Chaos)

### Linien-Stil

```css
stroke: rgba(220, 0, 24, 0.7);  /* Bundesrot */
stroke-width: 1.5px;
stroke-linecap: round;
filter: drop-shadow(0 0 4px rgba(220, 0, 24, 0.4));
```

### Hand-Mesh

**Stil:** Elegantes Skelett, keine Flächen

**Elemente:**
- 5 Finger-Linien (Wrist → Fingertip)
- Handflächen-Polygon (4-5 Punkte)
- Fingerspitzen: Grössere Endpunkte (4px Radius)

---

## UI-Komponenten

### Status-Leiste (oberer Rand)

```
┌─────────────────────────────────────────────────────┐
│ 🇨🇭  DIGITALE IDENTITÄT           ● Live  │ 60 fps │
└─────────────────────────────────────────────────────┘
```

### Biometrie-Panel (rechte Seite)

```
┌───────────────────────┐
│ BIOMETRIE             │
├───────────────────────┤
│ Gesicht      ● Aktiv  │
│ Linke Hand   ● Aktiv  │
│ Rechte Hand  ○ —      │
├───────────────────────┤
│ Punkte: 489           │
│ Konfidenz: 98.2%      │
└───────────────────────┘
```

### Footer (unterer Rand)

```
┌─────────────────────────────────────────────────────┐
│ Eine Initiative der Schweizerischen Eidgenossenschaft│
└─────────────────────────────────────────────────────┘
```

---

## Animation-Spezifikationen

### Scan-Linie (Erkennung)

```javascript
// Horizontaler Scan von oben nach unten
animation: scanLine 2s ease-in-out infinite;

@keyframes scanLine {
  0%   { transform: translateY(-100%); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(100%); opacity: 0; }
}
```

### Mesh-Aufbau (Analyse)

```javascript
// Jede Linie erscheint mit Delay
lines.forEach((line, i) => {
  line.style.animationDelay = `${i * 15}ms`;
  line.classList.add('draw-line');
});

@keyframes draw-line {
  from { stroke-dashoffset: 100%; }
  to   { stroke-dashoffset: 0; }
}
```

### Erfolgs-Puls (Verifikation)

```javascript
@keyframes successPulse {
  0%   { box-shadow: 0 0 0 0 rgba(0, 132, 61, 0.4); }
  70%  { box-shadow: 0 0 0 20px rgba(0, 132, 61, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 132, 61, 0); }
}
```

---

## Accessibility (WCAG 2.1 AA)

- **Kontrast:** Alle Texte > 4.5:1 Ratio
- **Keine Bewegungskrankheit:** Animationen respektieren `prefers-reduced-motion`
- **Screenreader:** Aria-live Regionen für Statusänderungen
- **Tastaturnavigation:** Vollständig unterstützt

---

## Finale Checkliste (Awwwards-Standard)

### Must-Haves

- [ ] Sofortige visuelle Klarheit (< 2 Sekunden zum Verstehen)
- [ ] Schweizer Bundesidentität durchgehend
- [ ] Flüssige 60 FPS ohne Ruckler
- [ ] Sauberes Mesh (keine Chaos-Punkte)
- [ ] Klare Status-Kommunikation
- [ ] Erfolgsmoment mit emotionaler Wirkung
- [ ] Mobile-responsive (für verschiedene Display-Grössen)
- [ ] Offline-fähig nach initialem Load

### Nice-to-Haves

- [ ] Mehrsprachig (DE/FR/IT/EN)
- [ ] Sound-Design
- [ ] Foto-Export für Besucher
- [ ] Analytics-Dashboard für Betreiber

---

## Unterschriften

**Dr. Lukas Meier** — BIT  
> "Diese Spezifikation entspricht den Anforderungen des Bundes an digitale Bürgerkommunikation."

**Regula Schneider-Wyss** — SECO  
> "Freigegeben für die Implementierung und Präsentation an der Swiss B2B Expo 2026."

**Awwwards Jury**  
> "Diese Lösung hat das Potenzial, den Massstab für Regierungs-Tech-Installationen weltweit zu setzen."

---

## Anhang: Implementierungs-Roadmap

### Phase 1: Foundation (Stunde 1-2)
- Alte Partikel-Logik entfernen
- Neue Architektur aufsetzen
- State Machine implementieren

### Phase 2: Visual Core (Stunde 2-4)
- Kamera-Layer mit Spiegeleffekt
- Biometrie-Mesh-Renderer
- Linien-Stil gemäss Spezifikation

### Phase 3: User Journey (Stunde 4-6)
- 5-Phasen-Flow implementieren
- Animationen und Transitions
- Status-Updates

### Phase 4: UI Polish (Stunde 6-8)
- Header/Footer Bundesdesign
- Biometrie-Panel
- Erfolgsanimationen

### Phase 5: QA & Optimization (Stunde 8-10)
- Performance-Tuning
- Cross-Browser-Tests
- Accessibility-Audit

---

*Dokument erstellt: 11. Januar 2026*  
*Version: 1.0 FINAL*  
*Klassifikation: INTERN*

