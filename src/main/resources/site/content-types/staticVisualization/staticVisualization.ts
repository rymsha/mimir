// WARNING: This file was automatically generated by "no.item.xp.codegen". You may lose your changes if you edit it.
export interface StaticVisualization {
  /**
   * Legg til infografikk eller visualisering
   */
  image: string;

  /**
   * Beskrivende hjelpetekst
   */
  longDesc?: string;

  /**
   * Tabelldata
   */
  tableData?: string;

  /**
   * Kilder
   */
  sources?: Array<
    | {
        /**
         * Selected
         */
        _selected: "urlSource";

        /**
         * Kilde fra url
         */
        urlSource: {
          /**
           * Tekst til kildelenke
           */
          urlText: string;

          /**
           * Kildelenke
           */
          url: string;
        };
      }
    | {
        /**
         * Selected
         */
        _selected: "relatedSource";

        /**
         * Kilde fra XP
         */
        relatedSource: {
          /**
           * Tekst til kildelenke
           */
          urlText?: string;

          /**
           * Relatert innhold
           */
          sourceSelector?: string;
        };
      }
  >;

  /**
   * Fotnote-tekst
   */
  footNote?: Array<string>;
}
