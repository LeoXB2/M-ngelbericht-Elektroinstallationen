import { GoogleGenAI } from "@google/genai";

export const analyzeInstallationDescription = async (description: string, pdfContext: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const contextPrompt = pdfContext 
    ? `
    **Zusätzliche Wissensbasis:**
    Die folgende Information wurde aus hochgeladenen Dokumenten extrahiert. Nutze sie als primäre und maßgebliche Quelle für deine Analyse. Beziehe dich bei der Nennung von Normen und Regeln explizit auf diese Dokumente, falls anwendbar. Ignoriere widersprüchliche Informationen aus deinem allgemeinen Wissen und priorisiere diesen Kontext.
    ---
    ${pdfContext}
    ---
    `
    : '';

  const prompt = `
    **Rolle:** Du bist ein zertifizierter Experte für Elektroinstallationen in der Schweiz mit tiefgehenden Kenntnissen der Niederspannungs-Installationsnorm (NIN) sowie relevanter europäischer Normen (EN).

    **Aufgabe:** Analysiere die folgende Beschreibung einer Elektroinstallation kritisch und sorgfältig. Identifiziere alle potenziellen Mängel, die nicht den aktuellen Normen entsprechen.
    ${contextPrompt}
    **Beschreibung der Installation:**
    ${description}

    **Anforderungen an den Output:**
    1.  Erstelle einen professionellen, klar strukturierten Mängeltext.
    2.  Beginne mit einer kurzen, allgemeinen Einschätzung der beschriebenen Installation.
    3.  Liste jeden identifizierten Mangel als separaten Punkt auf.
    4.  Beschreibe für jeden Mangel präzise, was das Problem ist, basierend auf der Beschreibung (und der Wissensbasis, falls vorhanden).
    5.  Nenne, wenn möglich, die verletzte Norm (z.B. NIN 5.2.6) oder das allgemeine Schutzprinzip. Priorisiere hierbei die Normen aus der Wissensbasis.
    6.  Schlage für jeden Mangel eine fachgerechte Massnahme zur Behebung vor.
    7.  Formuliere den Text objektiv und professionell, als wäre er Teil eines offiziellen Inspektionsberichts.
    8.  Wenn aus der Beschreibung keine Mängel hervorgehen, bestätige, dass die Installation gemäss Beschreibung normenkonform erscheint, weise aber darauf hin, dass eine visuelle Inspektion notwendig ist.
    
    Analysiere jetzt die Beschreibung und erstelle den Mängelbericht.
    `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Die KI-Analyse konnte nicht durchgeführt werden.");
  }
};