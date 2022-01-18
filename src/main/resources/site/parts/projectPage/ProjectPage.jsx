import React from 'react'
import PropTypes from 'prop-types'
import { Container, Row, Col } from 'react-bootstrap'
import { Title, LeadParagraph, Divider, Link } from '@statisticsnorway/ssb-component-library'
import { User, Calendar, Settings } from 'react-feather'

function ProjectPage(props) {
  function renderProjectInformation() {
    const generalInformation = props.projectPageGeneralInformation

    return (
      <Row>
        <Col className="col-lg-4">
          <Divider light={true} />
          <Row className="pt-4">
            <Col className="col-2">
              <User size={38} />
            </Col>
            <Col className="flex-column">
              <LeadParagraph>Prosjektleder</LeadParagraph>
              <div>
                <Link href={generalInformation.projectLeader.url} linkType="profiled">
                  {`${generalInformation.projectLeader.first_name} ${generalInformation.projectLeader.surname}`}, SSB
                </Link>
              </div>
            </Col>
          </Row>
        </Col>
        <Col className="col-lg-4">
          <Divider light={true} />
          <Row className="pt-4">
            <Col className="col-2">
              <Calendar size={38} />
            </Col>
            <Col className="flex-column">
              <LeadParagraph>Prosjektperiode</LeadParagraph>
              <b style={{
                fontSize: '20px'
              }}>
                {generalInformation.projectPeriod}
              </b>
            </Col>
          </Row>
        </Col>
        <Col className="col-lg-4">
          <Divider light={true} />
          <Row className="pt-4">
            <Col className="col-2">
              <Settings size={32} />
            </Col>
            <Col className="flex-column">
              <LeadParagraph>Oppdragsgiver</LeadParagraph>
              <b style={{
                fontSize: '20px'
              }}>
                {generalInformation.projectInstitution}
              </b>
            </Col>
          </Row>
        </Col>
        <Divider className="mt-5" light={true} />
      </Row>
    )
  }

  function renderAboutProject() {
    return (
      <Row>
        <Col className="col-12 mb-3">
          <Title size={2}>Om prosjektet</Title>
        </Col>
        <Col className="col-12">
          <div dangerouslySetInnerHTML={{
            __html: props.projectDescription
          }} />
        </Col>
      </Row>
    )
  }

  return (
    <Container fluid>
      <Row>
        <Col className="col-12">
          <Row className="mb-5">
            <Title size={1}>{props.projectPageTitle}</Title>
          </Row>
          {renderProjectInformation()}
        </Col>
      </Row>
      <Row className="mt-5 justify-content-center">
        <Col className="col-lg-6">
          {renderAboutProject()}
        </Col>
      </Row>
    </Container>
  )
}

ProjectPage.propTypes = {
  projectPageTitle: PropTypes.string,
  projectDescription: PropTypes.string,
  projectPageGeneralInformation: PropTypes.array
}

export default (props) => <ProjectPage {...props} />
