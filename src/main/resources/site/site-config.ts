// WARNING: This file was automatically generated by "no.item.xp.codegen". You may lose your changes if you edit it.
export interface SiteConfig {
  /**
   * Kommunedata innhold fra api
   */
  municipalDataContentId?: string;

  /**
   * Fylkedata innhold fra api
   */
  countyDataContentId?: string;

  /**
   * Endringslister fra api
   */
  municipalChangeListContentId?: string;

  /**
   * Standard kommune for å vise i "preview" mode
   */
  defaultMunicipality: string;

  /**
   * Kommunefakta instillinger
   */
  kommunefakta?: {
    /**
     * Mappe kartfiler
     */
    mapfolder?: string;
  };

  /**
   * URL til hjelpeside for statistikkbanken.
   */
  statbankHelpLink: string;

  /**
   * PX-API spørring for historiske navnedata
   */
  nameSearchGraphData: string;

  /**
   * Språk instillinger
   */
  language: Array<{
    /**
     * Språktittel (brukt til lenke i header)
     */
    label: string;

    /**
     * Språkkode (f.eks. "en", "no")
     */
    code: string;

    /**
     * Språklenke: url-stien til språkets "hjemmeside"
     */
    link?: string;

    /**
     * Språk tekst/fraser
     */
    phrases: "norwegian" | "english";

    /**
     * Språkets "Hjem"-side
     */
    homePageId?: string;

    /**
     * Header
     */
    headerId?: string;

    /**
     * Footer
     */
    footerId?: string;

    /**
     * Standardtegn i tabeller
     */
    standardSymbolPage?: string;
  }>;
}
