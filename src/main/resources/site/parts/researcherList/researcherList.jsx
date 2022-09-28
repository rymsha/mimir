import React from 'react'
import PropTypes from 'prop-types'
import { Link, Divider, Text } from '@statisticsnorway/ssb-component-library'
import { ArrowRight } from 'react-feather'


function ResearcherList(props) {
  const { title, researchers, results } = props
  console.log(researchers)
  console.log(results)

  const renderResearchers = () => {
    let ListOfResearchersJSX = []
    
    for (const [letter, researchersListByLetter] of Object.entries(researchers)) {
      
      let sortedResearchersWithinLetter = researchersListByLetter.sort((a, b) => a.surname.localeCompare(b.surname))

      let researchersListItem = sortedResearchersWithinLetter.map((researcher, i) => {
        return (
          <>
          <li className="list-item" >
            {i == 0 ? <div className="letter col-md-1"><h2>{letter}</h2></div> : <div className="col-md-1"></div>}
            <div className="list col-md-11">
              <div>
                <Link href={researcher.path} linkType="header">{researcher.surname}, {researcher.name}</Link>
                {researcher.position ? <div><Text small>{researcher.position}</Text></div> : null}
                <div>
                  <Text small>
                    <Link href={'tel:' + researcher.phone}>{researcher.phone}</Link> / <Link href={'mailto:' + researcher.email}>{researcher.email}</Link> / Forskningsområde
                  </Text>
                </div>
              </div>
              <div className="list-arrow"><Link href={researcher.path} icon={<ArrowRight size="30" />}></Link></div>
            </div>
          </li>
          <Divider light />
          </>
        )
      })

      ListOfResearchersJSX.push(
        <ul className="letter-list">{researchersListItem}</ul> 
      )
    }

    return (
      <div>
        <Divider dark />
        {ListOfResearchersJSX}
      </div>
    ) 
  }

  return (
    <section className="xp-part researchers container p-0 mb-5">
      <div className="row banner">
        <h1>Ansatte forskning</h1>  
        <p>På denne siden finner du kontaktinformasjon til alle som jobber i Forskningsavdelingen i SSB. Klikk på navnet for å lese mer om personen.</p>
      </div>
      <div>Det er {results.total} personer i Forskningsavdelingen</div>
      {researchers != [] ? renderResearchers() : null}
    </section>
  )
}

export default (props) => <ResearcherList {...props} />

ResearcherList.propTypes = {
  title: PropTypes.string,
  researchers: PropTypes.object,
  results: PropTypes.object,
}
