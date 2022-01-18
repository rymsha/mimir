import React from 'react'
import PropTypes from 'prop-types'
import { Container, Row, Col } from 'react-bootstrap'
import { Title, LeadParagraph, Divider, Link } from '@statisticsnorway/ssb-component-library'
import { User } from 'react-feather'

function ProjectPage(props) {
  function renderProjectInformation() {
    const projectLeader = props.projectParticipantsList.find((p) => p.roles[0].role_code === 'PRO_MANAGER')

    return (
      <Row>
        <Col className="col-lg-4">
          <Divider light={true} />
          <Row className="pt-4">
            <Col className="col-2">
              <User size={30} />
            </Col>
            <Col className="flex-column">
              <LeadParagraph>Prosjektleder</LeadParagraph>
              <div>
                <Link href={projectLeader.url} linkType="profiled">
                  {`${projectLeader.first_name} ${projectLeader.surname}`}, SSB
                </Link>
              </div>
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
        <Col className="col-12">
          {/* TODO: Language */}
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
            <Title size={1} className="mb-3">{props.projectPageTitle}</Title>
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
  projectParticipantsList: PropTypes.array
}

export default (props) => <ProjectPage {...props} />
