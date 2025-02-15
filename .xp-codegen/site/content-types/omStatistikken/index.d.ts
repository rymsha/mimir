/* eslint-disable prettier/prettier */ 
 // WARNING: This file was automatically generated by no.item.xp.codegen. You may lose your changes if you edit it.
export interface OmStatistikken {
  /**
   * Ingress
   */
  ingress: string;

  /**
   * Definisjoner
   */
  definition?: {
    /**
     * Definisjoner av viktige begrep og variabler
     */
    conceptsAndVariables?: string;

    /**
     * Standard klassifikasjoner
     */
    standardRatings?: string;
  };

  /**
   * Administrative opplysninger
   */
  administrativeInformation?: {
    /**
     * Navn og emne
     */
    nameAndSubject?: string;

    /**
     * Ansvarlig Seksjon
     */
    responsibleDept?: string;

    /**
     * Regionalt nivå
     */
    regionalLevel?: string;

    /**
     * Hyppighet og aktualitet
     */
    frequency?: string;

    /**
     * Internasjonal rapportering
     */
    internationalReporting?: string;

    /**
     * Lagring og anvendelse av grunnlagsmaterialet
     */
    storageAndUse?: string;
  };

  /**
   * Bakgrunn
   */
  background?: {
    /**
     * Formål og historie
     */
    purposeAndHistory?: string;

    /**
     * Brukere og bruksområder
     */
    usersAndUse?: string;

    /**
     * Likebehandling av brukere
     */
    equalTreatmentUsers?: string;

    /**
     * Sammenheng med annen statistikk
     */
    relationOtherStatistics?: string;

    /**
     * Lovhjemmel
     */
    legalAuthority?: string;

    /**
     * EØS-referanse
     */
    eeaReference?: string;
  };

  /**
   * Produksjon
   */
  production?: {
    /**
     * Omfang
     */
    scope?: string;

    /**
     * Datakilder og utvalg
     */
    dataSourcesAndSamples?: string;

    /**
     * Datainnsamling, editering og beregninger
     */
    dataCollectionEditingAndCalculations?: string;

    /**
     * Sesongjustering
     */
    seasonalAdjustment?: string;

    /**
     * Konfidensialitet
     */
    confidentiality?: string;

    /**
     * Sammenlignbarhet over tid og sted
     */
    comparability?: string;
  };

  /**
   * Nøyaktighet og pålitelighet
   */
  accuracyAndReliability?: {
    /**
     * Feilkilder og usikkerhet
     */
    errorSources?: string;

    /**
     * Revisjon
     */
    revision?: string;
  };

  /**
   * Relevant dokumentasjon
   */
  relevantDocumentation?: string;

  /**
   * Om sesongjustering
   */
  aboutSeasonalAdjustment?: {
    /**
     * Generelt om sesongjustering
     */
    generalInformation?: string;

    /**
     * Hvorfor sesongjusteres denne statistikken?
     */
    whySeasonallyAdjustStatistic?: string;

    /**
     * Prekorrigering
     */
    preTreatment?: string;

    /**
     * Sesongjustering
     */
    seasonalAdjustment?: string;

    /**
     * Revisjonsrutiner
     */
    auditProcedures?: string;

    /**
     * Kvalitet på sesongjustering
     */
    qualityOfSeasonalAdjustment?: string;

    /**
     * Spesielle tilfeller
     */
    specialCases?: string;

    /**
     * Publiseringsrutiner
     */
    postingProcedures?: string;

    /**
     * Relevant dokumentasjon
     */
    relevantDocumentation?: string;
  };

  /**
   * GraphQL name. Also used for separating unions in TypeScript
   */
  __typename?: 'mimir_OmStatistikken_Data';
}
