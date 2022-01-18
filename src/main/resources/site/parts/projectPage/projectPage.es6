const {
  getContent
} = __non_webpack_require__('/lib/xp/portal')
const {
  renderError
} = __non_webpack_require__('/lib/ssb/error/error')
const React4xp = __non_webpack_require__('/lib/enonic/react4xp')

exports.get = function(req) {
  try {
    return renderPart(req)
  } catch (e) {
    return renderError(req, 'Error in part ', e)
  }
}

exports.preview = (req) => renderPart(req)

function renderPart(req) {
  const projectPageMock = {
    'cristin_project_id': '360372',
    'publishable': true,
    'published': true,
    'title': {
      'no': 'ACCESS Life Course Database',
      'en': 'The ACCESS Life Course Database'
    },
    'main_language': 'no',
    'start_date': '2010-08-01T00:00:00.000Z',
    'end_date': '2014-07-31T00:00:00.000Z',
    'status': 'CONCLUDED',
    'created': {
      'date': '2012-01-23T13:21:30.000Z'
    },
    'last_modified': {
      'date': '2012-01-23T13:33:30.000Z'
    },
    'coordinating_institution': {
      'institution': {
        'cristin_institution_id': '215',
        'institution_name': {
          'en': 'Oslomet - Oslo Metropolitan University'
        },
        'url': 'https://api.cristin.no/v2/institutions/215'
      },
      'unit': {
        'cristin_unit_id': '215.16.2.0',
        'unit_name': {
          'en': 'Norwegian Social Research'
        },
        'url': 'https://api.cristin.no/v2/units/215.16.2.0'
      }
    },
    'languages': [{
      'code': 'en',
      'name': {
        'en': 'English'
      }
    }, {
      'code': 'no',
      'name': {
        'en': 'Norwegian'
      }
    }],
    'project_funding_sources': [{
      'funding_source_code': 'NFR',
      'funding_source_name': {
        'en': 'Research Council of Norway (RCN)'
      }
    }],
    'contact_info': {
      'email': 'access@nova.no'
    },
    'participants': [{
      'cristin_person_id': '14732',
      'first_name': 'Marijke',
      'surname': 'Veenstra',
      'url': 'https://api.cristin.no/v2/persons/14732',
      'roles': [{
        'role_code': 'PRO_MANAGER',
        'institution': {
          'cristin_institution_id': '215',
          'institution_name': {
            'en': 'Oslomet - Oslo Metropolitan University'
          }
        },
        'unit': {
          'cristin_unit_id': '215.16.2.0',
          'unit_name': {
            'en': 'Norwegian Social Research'
          }
        }
      }]
    }, {
      'cristin_person_id': '328991',
      'first_name': 'Morten',
      'surname': 'Blekesaune',
      'url': 'https://api.cristin.no/v2/persons/328991',
      'roles': [{
        'role_code': 'PRO_PARTICIPANT',
        'institution': {
          'cristin_institution_id': '0',
          'institution_name': {
            'en': 'Unknown unit'
          }
        },
        'unit': {
          'cristin_unit_id': '0.0.0.0',
          'unit_name': {
            'en': 'Unknown'
          }
        }
      }]
    }, {
      'cristin_person_id': '275357',
      'first_name': 'Ivar Andreas Åsland',
      'surname': 'Lima',
      'url': 'https://api.cristin.no/v2/persons/275357',
      'roles': [{
        'role_code': 'PRO_PARTICIPANT',
        'institution': {
          'cristin_institution_id': '0',
          'institution_name': {
            'en': 'Unknown unit'
          }
        },
        'unit': {
          'cristin_unit_id': '0.0.0.0',
          'unit_name': {
            'en': 'Unknown'
          }
        }
      }]
    }, {
      'cristin_person_id': '1397',
      'first_name': 'Kristine',
      'surname': 'Koløen',
      'url': 'https://api.cristin.no/v2/persons/1397',
      'roles': [{
        'role_code': 'PRO_PARTICIPANT',
        'institution': {
          'cristin_institution_id': '0',
          'institution_name': {
            'en': 'Unknown unit'
          }
        },
        'unit': {
          'cristin_unit_id': '0.0.0.0',
          'unit_name': {
            'en': 'Unknown'
          }
        }
      }]
    }, {
      'cristin_person_id': '13754',
      'first_name': 'Thomas',
      'surname': 'Hansen',
      'url': 'https://api.cristin.no/v2/persons/13754',
      'roles': [{
        'role_code': 'PRO_PARTICIPANT',
        'institution': {
          'cristin_institution_id': '0',
          'institution_name': {
            'en': 'Unknown unit'
          }
        },
        'unit': {
          'cristin_unit_id': '0.0.0.0',
          'unit_name': {
            'en': 'Unknown'
          }
        }
      }]
    }, {
      'cristin_person_id': '14097',
      'first_name': 'Trude',
      'surname': 'Lappegård',
      'url': 'https://api.cristin.no/v2/persons/14097',
      'roles': [{
        'role_code': 'PRO_PARTICIPANT',
        'institution': {
          'cristin_institution_id': '0',
          'institution_name': {
            'en': 'Unknown unit'
          }
        },
        'unit': {
          'cristin_unit_id': '0.0.0.0',
          'unit_name': {
            'en': 'Unknown'
          }
        }
      }]
    }, {
      'cristin_person_id': '1113413',
      'first_name': 'Lars',
      'surname': 'Dommermuth',
      'url': 'https://api.cristin.no/v2/persons/1113413',
      'roles': [{
        'role_code': 'PRO_PARTICIPANT',
        'institution': {
          'cristin_institution_id': '0',
          'institution_name': {
            'en': 'Unknown unit'
          }
        },
        'unit': {
          'cristin_unit_id': '0.0.0.0',
          'unit_name': {
            'en': 'Unknown'
          }
        }
      }]
    }],
    'participants_url': 'https://api.cristin.no/v2/projects/360372/participants',
    'academic_summary': {
      // eslint-disable-next-line max-len
      'no': 'ACCESS Life Course er en forskningsinfrastruktur som bidrar til økt tilgjengelighet på livsløpsdata fra to store og integrerte studier: Den norske panel studien om livsløp, aldring og generasjon (NorLAG) og studien av livsløp, generasjon og kjønn (LOGG). </br></br>ACCESS Life Course Database er finansiert av Norges Forskningsråd gjennom nasjonal satsing på forskningsinfrastruktur, og er lokalisert og styrt fra NOVA, i nært samarbeid med SSB. Databasene byr på en unik kombinasjon av flernivå data, longitudinelle data og register data, samt at de inneholder instrumenter og mål fra ulike disipliner (demografi, sosiologi, psykologi, økonomi og helsefag). Dette gir et vell av forskningsmuligheter! Dataene kan blant annet belyse hvilke muligheter og begrensninger den aldrende befolkningen representerer i forhold til utvikling og planlegging av sosial- og velferdstjenester. Temaområdene dataene sentrerer rundt er arbeid og pensjonering, familie, generasjoner og omsorg, mental helse og livskvalitet, helse og helseatferd, samt lokalmiljø og sosial integrasjon i andre halvdel av livet.</br></br>I sin opprinnelige form er dataene svært komplekse og de har derfor en høy brukerterskel. Ved å tilby godt dokumenterte, sterke og tilgjengelige data bidrar ACCESS LCD til økt forståelse og kunnskap i livsløpsforskningen Hensikten er også at dette vil fremme utveksling av ferdigheter og kunnskap på tvers av forskningsinstitusjoner, disipliner og nasjoner. </br></br>Prosjektets hovedmål er:</br>•\tÅ optimalisere tilgangen til ACCESS LCD ved å tilby forskere og forskermiljøer tilrettelagte, brukervennlige og godt dokumenterte data sett. </br>•\tÅ øke kvaliteten på dataene, både enkle mål og sammensatte instrumenter</br>•\tÅ harmonisere data innsamlet på ulike tidspunkt, slik at de blir enklere sammenlignbare </br>•\tÅ vurdere egnede metoder for å analysere longitudinelle data og flernivå data</br>•\tÅ bidra til økt samarbeid i livsløpsforskningen, både nasjonalt og internasjonalt </br>',
      // eslint-disable-next-line max-len
      'en': 'ACCESS Life Course is a research infrastructure that enhances the availability of life course data from two large-scale and integrated Norwegian studies: The Norwegian Life Course, Ageing and Generation Study (NorLAG) and The Life Course, Generations and Gender study (LOGG). </br></br>The ACCESS Life Course Database is funded by the Norwegian Research Council (NFR) through the National Financing Initiative for Research Infrastructure. It is located and managed at Norwegian Social Research (NOVA), in close cooperation with Statistics Norway. The Databases provide a unique and complex combination of multi-level, longitudinal survey and register data, in addition to contextual information on the NorLAG communities. The data include internationally validated instruments and measures from multiple disciplines (demography, sociology, psychology, economics and health sciences). ACCESS will be a knowledge base for exploring life course patterns and demographic trends in an ageing society, across 5 key themes 1) work and retirement, 2) family, generations and care, 3) mental health and quality of life, 4)health and health behaviour , and 5) local community and social integration. This yields a wealth of research opportunities not available earlier. By providing well documented, strong and available data, ACCESS will contribute to an increased understanding and better knowledge in the field of life course research. </br></br>Some of the main goals of ACCESS are:</br>•\tTo optimise access to the ACCESS LCD by providing easy-to-use and well-documented data sets to researchers </br>•\tTo improve the quality and international comparability of data and measurement instruments </br>•\tÅ harmonisere data innsamlet på ulike tidspunkt, slik at de blir enklere sammenlignbare </br>•\tTo assess innovatiove methodological approaches in life course studies, including analyses of longitudinal data </br>•\tEnhance institutional and multidisiplinary collaboration in life course and demographic studies. </br>'
    },
    'related_projects': ['https://api.cristin.no/v2/projects/2494995']
  }

  const page = getContent()

  const projectPageProps = {
    projectPageTitle: page.displayName,
    projectDescription: projectPageMock.academic_summary.no,
    projectParticipantsList: projectPageMock.participants
  }

  return React4xp.render('site/parts/projectPage/ProjectPage', projectPageProps, req)
}
